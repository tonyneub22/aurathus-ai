import { expect, test } from '@playwright/test'

/**
 * Smoke tests for the home page against the production build.
 * Screenshots land in e2e/screenshots/ for visual review (gitignored).
 */

test.describe('home page', () => {
  let consoleErrors

  test.beforeEach(async ({ page }) => {
    consoleErrors = []
    page.on('console', (msg) => {
      if (msg.type() === 'error') consoleErrors.push(msg.text())
    })
    page.on('pageerror', (err) => consoleErrors.push(String(err)))
    await page.goto('/')
  })

  test('renders the hero copy and title', async ({ page }) => {
    await expect(page).toHaveTitle(/Aurathus AI LLC/)
    // innerText respects layout, so this fails if the words visually run together.
    const h1 = (await page.getByRole('heading', { level: 1 }).innerText()).replace(/\s+/g, ' ').trim()
    expect(h1.toLowerCase()).toBe('aurathus ai')
    await expect(page.getByText('Technology Design Services', { exact: true })).toBeVisible()
    await expect(page.locator('#top').getByRole('link', { name: /request consult/i })).toBeVisible()
  })

  test('has no scroll cue and a framed Services box', async ({ page }) => {
    await expect(page.getByText(/^scroll$/i)).toHaveCount(0)
    const services = page.getByRole('region', { name: 'Services' })
    await expect(services.getByRole('heading', { level: 2, name: 'Services' })).toBeVisible()
    await expect(services.getByRole('heading', { level: 3 })).toHaveCount(3)
    await expect(page.getByText(/what we make|finished to a standard most studios skip/i)).toHaveCount(0)
  })

  test('draws the beam above the Services box without blocking it', async ({ page }) => {
    const beam = page.getByTestId('services-beam')
    await expect(beam).toHaveAttribute('aria-hidden', 'true')
    await expect(beam).toHaveCSS('pointer-events', 'none')
    const box = page.locator('[data-beam-target]')
    await box.scrollIntoViewIfNeeded()
    await expect(beam.locator('canvas')).toBeAttached({ timeout: 20_000 })
    const [b, t] = [await beam.boundingBox(), await box.boundingBox()]
    // The beam's canvas reaches down past the box's top edge, where it lands.
    expect(b.y).toBeLessThan(t.y)
    expect(b.y + b.height).toBeGreaterThan(t.y)
  })

  test('stacks the boxes in order and the testimonial accordion works', async ({ page }) => {
    const titles = await page.getByRole('heading', { level: 2 }).allTextContents()
    expect(titles.map((t) => t.trim())).toEqual(['Services', 'Why Choose Us?', 'Client Testimonials', 'About'])

    const buttons = page.getByRole('region', { name: 'Client Testimonials' }).getByRole('button')
    await buttons.first().scrollIntoViewIfNeeded()
    await expect(buttons.first()).toHaveAttribute('aria-expanded', 'true')
    // Hovering another panel must not open it; only a click does.
    await buttons.nth(3).hover()
    await page.waitForTimeout(500)
    await expect(buttons.first()).toHaveAttribute('aria-expanded', 'true')
    await expect(buttons.nth(3)).toHaveAttribute('aria-expanded', 'false')
    await buttons.nth(1).click()
    await expect(buttons.nth(1)).toHaveAttribute('aria-expanded', 'true')
    await expect(buttons.first()).toHaveAttribute('aria-expanded', 'false')
    await buttons.nth(1).press('ArrowRight') // keyboard moves on to the next panel
    await expect(buttons.nth(2)).toHaveAttribute('aria-expanded', 'true')
  })

  test('draws gold fibers behind About, hidden from assistive tech', async ({ page }) => {
    const fibers = page.getByTestId('ghost-fibers')
    await expect(fibers).toHaveAttribute('aria-hidden', 'true')
    await expect(fibers).toHaveCSS('pointer-events', 'none')
    await page.getByRole('region', { name: 'About' }).scrollIntoViewIfNeeded()
    await expect(fibers.locator('canvas')).toBeAttached({ timeout: 20_000 })
  })

  test('keeps the subtitle on one line on desktop', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'desktop', 'phones may wrap it')
    const box = await page.getByText('Technology Design Services', { exact: true }).boundingBox()
    const fontSize = await page
      .getByText('Technology Design Services', { exact: true })
      .evaluate((el) => parseFloat(getComputedStyle(el).fontSize))
    expect(box.height).toBeLessThan(fontSize * 2) // two lines would be at least 2x
  })

  test('mounts the WebGL figure and loads the model', async ({ page }) => {
    const canvas = page.getByTestId('statue-canvas')
    // The canvas sits behind a lazy three.js chunk and software GL, so under
    // parallel workers it can take longer than the 5s default to appear.
    await expect(canvas).toBeAttached({ timeout: 20_000 })
    // The loading indicator disappears once the glTF has been parsed.
    await expect(page.getByRole('img', { name: /loading figure/i })).toBeHidden({ timeout: 20_000 })
    const box = await canvas.boundingBox()
    expect(box.width).toBeGreaterThan(100)
    expect(box.height).toBeGreaterThan(100)
  })

  test('keeps the CC BY credit visible with working links', async ({ page }) => {
    const credit = page.getByTestId('statue-credit')
    await credit.scrollIntoViewIfNeeded()
    await expect(credit).toBeVisible()
    await expect(credit.getByRole('link', { name: 'David Head' })).toHaveAttribute('href', /skfb\.ly|sketchfab/)
    await expect(credit.getByRole('link', { name: '1d_inc' })).toHaveAttribute('href', /sketchfab\.com/)
    await expect(credit.getByRole('link', { name: 'CC BY 4.0' })).toHaveAttribute(
      'href',
      /creativecommons\.org\/licenses\/by\/4\.0/,
    )
  })

  test('never scrolls horizontally', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.evaluate(() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'instant' }))
    await page.waitForTimeout(500)
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    )
    expect(overflow).toBeLessThanOrEqual(0)
  })

  test('logs no console errors', async ({ page }) => {
    await page.waitForTimeout(4000) // let the intro finish
    expect(consoleErrors).toEqual([])
  })

  test('screenshots for review', async ({ page }, testInfo) => {
    test.setTimeout(120_000) // many captures, with software-rendered WebGL
    const shot = (name) => page.screenshot({ path: `e2e/screenshots/${testInfo.project.name}-${name}.png` })
    await expect(page.getByRole('img', { name: /loading figure/i })).toBeHidden({ timeout: 20_000 })
    await page.waitForTimeout(5000) // intro complete, beam faded in
    await shot('hero')
    await page.getByRole('button', { name: 'Menu' }).click()
    await expect(page.getByRole('dialog', { name: 'Menu' })).toBeInViewport()
    await page.waitForTimeout(900) // slide-in finished
    await shot('menu-open')
    await page.keyboard.press('Escape')
    await page.waitForTimeout(900)
    await page.evaluate(() => document.activeElement.blur()) // the returned focus ring would sit in every later shot
    // Instant scroll: the page uses smooth scrolling, which makes captures land mid-animation.
    // Frame the beam landing: box top a little below the middle of the screen.
    await page.evaluate(() => {
      const top = document.querySelector('[data-beam-target]').getBoundingClientRect().top + window.scrollY
      window.scrollTo({ top: top - window.innerHeight * 0.6, behavior: 'instant' })
    })
    await page.waitForTimeout(1500)
    await shot('beam')
    for (const id of ['why-us', 'testimonials', 'about']) {
      await page.evaluate((target) => {
        const top = document.getElementById(target).getBoundingClientRect().top + window.scrollY
        window.scrollTo({ top: top - 24, behavior: 'instant' })
      }, id)
      // Wait for the on-screen reveal fades to finish rather than guessing a delay: headless
      // software GL is slow, and anything below the fold legitimately hasn't revealed yet.
      await page.waitForFunction(
        (target) =>
          [...document.querySelectorAll(`#${target} h2, #${target} h3, #${target} p, #${target} a, #${target} li`)]
            .filter((el) => {
              const r = el.getBoundingClientRect()
              return r.top < window.innerHeight && r.bottom > 0
            })
            .every((el) => getComputedStyle(el).opacity === '1'),
        id,
        { timeout: 30_000 },
      )
      await page.waitForTimeout(600)
      await shot(id)
    }
    // Mid-page, part way into a box, so the header's backing shows against content.
    await page.evaluate(() => {
      const top = document.getElementById('testimonials').getBoundingClientRect().top + window.scrollY
      window.scrollTo({ top: top + 120, behavior: 'instant' })
    })
    await page.waitForTimeout(1000)
    await shot('header-scrolled')
    await page.evaluate(() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'instant' }))
    await page.waitForTimeout(1500)
    await shot('footer')
  })
})

test.describe('brand and head', () => {
  test('has the canonical, social and icon tags, and every asset they name loads', async ({ page, request }) => {
    const missing = []
    page.on('response', (res) => {
      if (res.status() >= 400) missing.push(`${res.status()} ${res.url()}`)
    })
    await page.goto('/')
    const attr = (selector, name) => page.locator(selector).getAttribute(name)

    expect(await attr('link[rel="canonical"]', 'href')).toBe('https://aurathus-ai.com/')
    expect(await attr('meta[property="og:url"]', 'content')).toBe('https://aurathus-ai.com/')
    expect(await attr('meta[property="og:site_name"]', 'content')).toBe('Aurathus AI LLC')
    expect(await attr('meta[property="og:title"]', 'content')).toMatch(/Aurathus AI LLC/)
    expect(await attr('meta[property="og:description"]', 'content')).toBeTruthy()
    expect(await attr('meta[property="og:image"]', 'content')).toBe('https://aurathus-ai.com/og-image.png')
    expect(await attr('meta[property="og:image:width"]', 'content')).toBe('1200')
    expect(await attr('meta[property="og:image:height"]', 'content')).toBe('630')
    expect(await attr('meta[property="og:image:alt"]', 'content')).toBeTruthy()
    expect(await attr('meta[name="twitter:card"]', 'content')).toBe('summary_large_image')
    expect(await attr('meta[name="twitter:image"]', 'content')).toBe('https://aurathus-ai.com/og-image.png')
    expect(await attr('meta[name="theme-color"]', 'content')).toBe('#0a0a0b')

    // Icons, manifest and the og image, as served by this build (the absolute URLs point at production).
    const paths = await page.locator('head link[rel="icon"], head link[rel="apple-touch-icon"], head link[rel="manifest"]')
      .evaluateAll((links) => links.map((l) => new URL(l.href).pathname))
    expect(paths).toEqual(
      expect.arrayContaining(['/favicon.ico', '/favicon-32x32.png', '/favicon-16x16.png', '/apple-touch-icon.png', '/site.webmanifest']),
    )
    for (const path of [...paths, '/og-image.png', '/icon-192.png', '/icon-512.png']) {
      expect((await request.get(path)).status(), path).toBe(200)
    }
    const manifest = await (await request.get('/site.webmanifest')).json()
    expect(manifest).toMatchObject({ name: 'Aurathus AI LLC', theme_color: '#0a0a0b', background_color: '#0a0a0b' })

    await page.evaluate(() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'instant' }))
    await expect(page.getByRole('img', { name: 'Aurathus AI LLC' })).toBeVisible()
    expect(missing).toEqual([])
  })
})

test.describe('header and menu', () => {
  const overflow = (page) =>
    page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)

  test('the Home icon returns to the top of the page', async ({ page }) => {
    await page.goto('/')
    await page.evaluate(() => window.scrollTo({ top: 2000, behavior: 'instant' }))
    const home = page.getByRole('link', { name: 'Home', exact: true })
    await expect(home).toBeInViewport()
    await home.click()
    await expect.poll(() => page.evaluate(() => window.scrollY), { timeout: 10_000 }).toBe(0)
  })

  test('opens, traps focus, closes on Esc and returns focus', async ({ page }) => {
    await page.goto('/')
    const button = page.getByRole('button', { name: 'Menu' })
    const dialog = page.getByRole('dialog', { name: 'Menu' })
    await expect(dialog).toBeHidden()

    await button.click()
    await expect(button).toHaveAttribute('aria-expanded', 'true')
    await expect(dialog).toBeInViewport()
    await expect(dialog.getByRole('link', { name: 'Services' })).toBeFocused()
    expect(await page.evaluate(() => getComputedStyle(document.documentElement).overflow)).toBe('hidden')
    expect(await overflow(page)).toBeLessThanOrEqual(0)

    for (let i = 0; i < 8; i++) await page.keyboard.press('Tab')
    const focusInMenu = await page.evaluate(
      () => !!document.activeElement.closest('#site-menu') || document.activeElement.getAttribute('aria-label') === 'Menu',
    )
    expect(focusInMenu).toBe(true)

    await page.keyboard.press('Escape')
    await expect(button).toHaveAttribute('aria-expanded', 'false')
    await expect(button).toBeFocused()
    await expect(dialog).toBeHidden({ timeout: 20_000 })
    expect(await page.evaluate(() => getComputedStyle(document.documentElement).overflow)).not.toBe('hidden')
  })

  test('closes when the backdrop is clicked', async ({ page }) => {
    await page.goto('/')
    const button = page.getByRole('button', { name: 'Menu' })
    await button.click()
    await page.getByTestId('menu-backdrop').click({ position: { x: 10, y: 300 } })
    await expect(button).toHaveAttribute('aria-expanded', 'false')
  })

  for (const [label, id] of [
    ['Services', 'services'],
    ['Why Us', 'why-us'],
    ['Work', 'testimonials'],
    ['Studio', 'about'],
    ['Contact', 'contact'],
  ]) {
    test(`the ${label} link reaches #${id}, clear of the header`, async ({ page }) => {
      await page.goto('/')
      await page.getByRole('button', { name: 'Menu' }).click()
      await page.getByRole('dialog', { name: 'Menu' }).getByRole('link', { name: label, exact: true }).click()
      await expect(page).toHaveURL(new RegExp(`/#${id}$`))
      // Long timeout: software WebGL in headless Chrome can starve the slide-out's frames.
      await expect(page.getByRole('dialog', { name: 'Menu' })).toBeHidden({ timeout: 20_000 })
      const target = page.locator(`#${id}`)
      await expect(target).toBeInViewport()
      // Smooth scroll: wait for it to settle, then check the section isn't tucked under the header.
      await expect
        .poll(async () => {
          const a = await page.evaluate(() => window.scrollY)
          await page.waitForTimeout(250)
          return a === (await page.evaluate(() => window.scrollY))
        }, { timeout: 10_000 })
        .toBe(true)
      const header = await page.locator('header').first().boundingBox()
      const atBottom = await page.evaluate(
        () => Math.ceil(window.scrollY + window.innerHeight) >= document.documentElement.scrollHeight,
      )
      if (!atBottom) expect((await target.boundingBox()).y).toBeGreaterThanOrEqual(header.height - 1)
    })
  }

  test('Request Consult opens /consult, whose menu links back to the home sections', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: 'Menu' }).click()
    await page.getByRole('dialog', { name: 'Menu' }).getByRole('link', { name: /request consult/i }).click()
    await expect(page).toHaveURL(/\/consult$/)
    await expect(page).toHaveTitle(/Aurathus AI LLC/)
    await expect(page.getByRole('link', { name: 'Home', exact: true })).toHaveAttribute('href', '/#top')

    await page.getByRole('button', { name: 'Menu' }).click()
    await page.getByRole('dialog', { name: 'Menu' }).getByRole('link', { name: 'Services', exact: true }).click()
    await expect(page).toHaveURL(/\/#services$/)
    await expect(page.locator('#services')).toBeInViewport()
  })

  test('the footer logo is labelled and links to the top', async ({ page }) => {
    await page.goto('/')
    const logo = page.locator('footer').getByRole('img', { name: 'Aurathus AI LLC' })
    await expect(logo).toHaveAttribute('alt', 'Aurathus AI LLC')
    await expect(logo.locator('xpath=..')).toHaveAttribute('href', '/#top')
  })
})

test.describe('consult request', () => {
  test('the hero button opens a request form, and a failed send shows the email fallback', async ({ page }) => {
    await page.goto('/')
    await page.locator('#top').getByRole('link', { name: /request consult/i }).click()
    await expect(page).toHaveURL(/\/consult$/)
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(/request a consultation/i)

    await page.getByLabel('Your name').fill('Ada')
    await page.getByLabel('Email').fill('ada@example.com')
    await page.getByLabel('About the project').fill('A new site')
    // No backend yet: the form must say so honestly rather than pretend it sent.
    await page.route('**/api/consult', (route) => route.fulfill({ status: 404 }))
    await page.getByRole('button', { name: /send request/i }).click()
    await expect(page.getByRole('alert')).toContainText('@')

    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    )
    expect(overflow).toBeLessThanOrEqual(0)
  })

  test('screenshot for review', async ({ page }, testInfo) => {
    await page.goto('/consult')
    await page.waitForTimeout(1000)
    await page.screenshot({ path: `e2e/screenshots/${testInfo.project.name}-consult.png` })
  })
})

test.describe('reduced motion', () => {
  test.use({ reducedMotion: 'reduce' })

  test('still draws the About fibers, as a single frame', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('region', { name: 'About' }).scrollIntoViewIfNeeded()
    await expect(page.getByTestId('ghost-fibers').locator('canvas')).toBeAttached({ timeout: 20_000 })
    await expect(page.getByTestId('services-beam').locator('canvas')).toHaveCount(0) // the beam falls back to a still line
  })
})
