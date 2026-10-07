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
    await expect(page).toHaveTitle(/Podocyte AI/)
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
    await page.evaluate(() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'instant' }))
    await page.waitForTimeout(1500)
    await shot('footer')
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
