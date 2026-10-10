import { expect, test } from '@playwright/test'

/** Services on the home page and the /services/:slug pages, against the production build. */

const SERVICES = [
  { slug: 'web-development', name: 'Web Development', tiers: 3, includes: true },
  { slug: 'ai-integration', name: 'AI Integration', tiers: 3, includes: false },
  { slug: 'software-development', name: 'Software Development', tiers: 3, includes: true },
  { slug: 'video', name: 'Video Services', tiers: 2, includes: true },
]

const overflow = (page) =>
  page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)

// Arriving on home starts the WebGL hero, which under headless software GL can
// hold the main thread for seconds; waits that land on home allow for that.
const HOME = { timeout: 20_000 }

/** Collects console errors and failed requests for the page's lifetime. */
function watchErrors(page) {
  const errors = []
  page.on('console', (msg) => msg.type() === 'error' && errors.push(msg.text()))
  page.on('pageerror', (err) => errors.push(String(err)))
  page.on('response', (res) => res.status() >= 400 && errors.push(`${res.status()} ${res.url()}`))
  return errors
}

/**
 * Bring each plan box into view in turn and wait for its reveal and gold rule
 * to land. Scroll reveals only fire while an element is on screen, and headless
 * software GL renders frames slowly, so a quick sweep can skip past one.
 */
async function revealAll(page) {
  const count = await page.getByTestId('tier').count()
  for (let i = 0; i < count; i++) {
    await page.getByTestId('tier').nth(i).evaluate((el) => el.scrollIntoView({ block: 'center', behavior: 'instant' }))
    await page.waitForFunction(
      (index) => {
        const card = document.querySelectorAll('[data-testid="tier"]')[index]
        const settled = (el) => {
          const cs = getComputedStyle(el)
          return cs.opacity === '1' && cs.transform === 'none'
        }
        return settled(card) && settled(card.firstElementChild)
      },
      i,
      { timeout: 20_000 },
    )
  }
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }))
}

test.describe('home: services', () => {
  test('shows four rows, each Read more opening its service page', async ({ page }) => {
    test.setTimeout(180_000)
    await page.goto('/')
    const section = page.getByRole('region', { name: 'Services' })
    await expect(section.getByRole('article')).toHaveCount(4)

    for (const s of SERVICES) {
      await page.goto('/#services')
      await page.getByRole('link', { name: `Read more about ${s.name}` }).click(HOME)
      await expect(page).toHaveURL(new RegExp(`/services/${s.slug}$`))
      await expect(page.getByRole('heading', { level: 1 })).toHaveText(s.name)
      // A new page starts at its top.
      expect(await page.evaluate(() => window.scrollY)).toBe(0)
    }
  })

  test('stacks the rows in order, with columns aligned down the list', async ({ page }, testInfo) => {
    await page.goto('/')
    const rows = page.getByRole('region', { name: 'Services' }).getByRole('article')
    await rows.last().scrollIntoViewIfNeeded()
    await page.waitForTimeout(3000) // staggered reveals finished
    const boxes = await rows.evaluateAll((els) =>
      els.map((el) => {
        const left = (sel) => Math.round(el.querySelector(sel).getBoundingClientRect().left)
        return { top: el.getBoundingClientRect().top, name: el.querySelector('h3').textContent, h3: left('h3'), p: left('p'), a: left('a') }
      }),
    )
    const byTop = [...boxes].sort((a, b) => a.top - b.top).map((b) => b.name)
    expect(byTop).toEqual(SERVICES.map((s) => s.name))
    for (const key of ['h3', 'p', 'a']) {
      const xs = boxes.map((b) => b[key])
      expect(Math.max(...xs) - Math.min(...xs)).toBeLessThanOrEqual(1)
    }
    if (testInfo.project.name === 'desktop') {
      // Four columns: name, card line and Read more side by side.
      expect(boxes[0].p).toBeGreaterThan(boxes[0].h3)
      expect(boxes[0].a).toBeGreaterThan(boxes[0].p)
    } else {
      // Stacked: card line and Read more start at the row's left edge.
      expect(boxes[0].a).toBe(boxes[0].p)
    }
  })

  test('Request Consult below the rows opens the consult form', async ({ page }) => {
    await page.goto('/')
    const cta = page.getByRole('region', { name: 'Services' }).getByRole('link', { name: 'Request Consult' })
    await cta.scrollIntoViewIfNeeded()
    await cta.click(HOME)
    await expect(page).toHaveURL(/\/consult$/)
  })

  test('Read more glows on keyboard focus', async ({ page }) => {
    await page.goto('/')
    const link = page.getByRole('link', { name: 'Read more about Web Development' })
    await link.scrollIntoViewIfNeeded()
    await link.focus()
    await page.keyboard.press('Shift+Tab')
    await page.keyboard.press('Tab') // keyboard focus, so :focus-visible applies
    await expect(link).toBeFocused()
    await expect.poll(() => link.evaluate((el) => getComputedStyle(el).boxShadow)).not.toBe('none')
  })
})

test.describe('service pages', () => {
  for (const s of SERVICES) {
    test(`/services/${s.slug} deep-links and lays out its plans`, async ({ page }, testInfo) => {
      const errors = watchErrors(page)
      await page.goto(`/services/${s.slug}`)
      await expect(page.getByRole('heading', { level: 1 })).toHaveText(s.name)
      await expect(page).toHaveTitle(`${s.name} — Aurathus AI LLC`)
      await expect(page.getByTestId('statue-canvas')).toHaveCount(0) // the statue is home-only
      await expect(page.getByTestId('statue-credit')).toHaveCount(0)

      const tiers = page.getByTestId('tier')
      await expect(tiers).toHaveCount(s.tiers)
      await expect(page.getByTestId('includes')).toHaveCount(s.includes ? 1 : 0)
      const consult = page.getByRole('main').getByRole('link', { name: /request consult/i })
      await expect(consult).toHaveCount(2)
      await expect(consult.first()).toHaveAttribute('href', `/consult?service=${s.slug}`)

      await revealAll(page)
      const boxes = await tiers.evaluateAll((els) => els.map((el) => el.getBoundingClientRect().toJSON()))
      if (testInfo.project.name === 'desktop') {
        // Side by side, equal heights; two plans keep the three-up column width.
        const spread = (key) => Math.max(...boxes.map((b) => b[key])) - Math.min(...boxes.map((b) => b[key]))
        expect(spread('top')).toBeLessThanOrEqual(1)
        expect(spread('height')).toBeLessThanOrEqual(1)
        expect(boxes[0].width).toBeGreaterThan(300)
        expect(boxes[0].width).toBeLessThan(400)
      } else {
        for (let i = 1; i < boxes.length; i++) expect(boxes[i].top).toBeGreaterThan(boxes[i - 1].bottom)
      }

      expect(await overflow(page)).toBeLessThanOrEqual(0)
      expect(errors, errors.join('\n')).toEqual([])

      const shot = (state) =>
        page.screenshot({ path: `e2e/screenshots/${testInfo.project.name}-service-${s.slug}-${state}.png`, fullPage: true, scale: 'css' })
      await shot('collapsed')
      await page.getByRole('button', { name: 'Technical details' }).click()
      await page.waitForTimeout(1000)
      expect(await overflow(page)).toBeLessThanOrEqual(0)
      await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' })) // fixed header back at the top
      await page.waitForTimeout(800)
      await shot('expanded')
    })
  }

  test('Technical details opens and closes by mouse and by keyboard', async ({ page }) => {
    await page.goto('/services/ai-integration')
    const toggle = page.getByRole('button', { name: 'Technical details' })
    const body = page.getByText(/We build on the Claude API/)
    // The close animation runs on the main thread, which parallel software-GL workers can starve.
    const gone = () => expect(body).toHaveCount(0, { timeout: 15_000 })
    await expect(toggle).toHaveAttribute('aria-expanded', 'false')
    await expect(body).toHaveCount(0) // closed from the start: nothing to animate

    await toggle.click()
    await expect(toggle).toHaveAttribute('aria-expanded', 'true')
    await expect(body).toBeVisible()
    await toggle.click()
    await expect(toggle).toHaveAttribute('aria-expanded', 'false')
    await gone()

    await toggle.focus()
    await page.keyboard.press('Enter')
    await expect(toggle).toHaveAttribute('aria-expanded', 'true')
    await expect(body).toBeVisible()
    await page.keyboard.press('Space')
    await expect(toggle).toHaveAttribute('aria-expanded', 'false')
    await gone()
    await page.keyboard.press('Space')
    await expect(toggle).toHaveAttribute('aria-expanded', 'true')
  })

  test('Request Consult opens the form with the service chosen', async ({ page }) => {
    await page.goto('/services/video')
    await page.getByRole('main').getByRole('link', { name: /request consult/i }).first().click()
    await expect(page).toHaveURL(/\/consult\?service=video$/)
    await expect(page.getByLabel('What do you need?')).toHaveValue('Video')
  })

  test('Back to services and the menu return to the home sections', async ({ page }) => {
    await page.goto('/services/software-development')
    const back = page.getByRole('link', { name: 'Back to services' })
    await back.scrollIntoViewIfNeeded()
    await back.click()
    await expect(page).toHaveURL(/\/#services$/)
    await expect(page.locator('#services')).toBeInViewport(HOME)

    await page.goto('/services/video')
    await page.getByRole('button', { name: 'Menu' }).click()
    await page.getByRole('dialog', { name: 'Menu' }).getByRole('link', { name: 'Contact', exact: true }).click()
    await expect(page).toHaveURL(/\/#contact$/)
    await expect(page.locator('#contact')).toBeInViewport(HOME)
  })
})

test.describe('every page', () => {
  for (const path of ['/', '/consult', ...SERVICES.map((s) => `/services/${s.slug}`), '/services/unknown', '/nowhere']) {
    test(`${path} has no horizontal overflow or console errors`, async ({ page }) => {
      const errors = watchErrors(page)
      await page.goto(path)
      await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1)
      await page.waitForTimeout(1500)
      await page.evaluate(() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'instant' }))
      await page.waitForTimeout(500)
      expect(await overflow(page)).toBeLessThanOrEqual(0)
      expect(errors, errors.join('\n')).toEqual([])
    })
  }

  test('unknown paths and slugs show the styled 404', async ({ page }) => {
    for (const path of ['/services/unknown', '/nowhere']) {
      await page.goto(path)
      await expect(page.getByRole('heading', { level: 1 })).toHaveText('Page not found')
      await expect(page).toHaveTitle('Page not found — Aurathus AI LLC')
      await expect(page.getByRole('main').getByRole('link', { name: 'Back to home' })).toHaveAttribute('href', '/')
    }
  })
})

test('screenshot: home services section', async ({ page }, testInfo) => {
  await page.goto('/')
  test.setTimeout(90_000)
  const section = page.getByRole('region', { name: 'Services' })
  // Bring each card into view so its reveal runs (one column on phones is taller than the screen).
  const cards = section.getByRole('article')
  for (let i = 0; i < 4; i++) {
    await cards.nth(i).evaluate((el) => el.scrollIntoView({ block: 'center', behavior: 'instant' }))
    await expect.poll(() => cards.nth(i).evaluate((el) => getComputedStyle(el.firstElementChild).opacity), HOME).toBe('1')
  }
  await page.evaluate(() => {
    const top = document.getElementById('services').getBoundingClientRect().top + window.scrollY
    window.scrollTo({ top: top + 40, behavior: 'instant' })
  })
  await page.waitForTimeout(1500)
  // The fixed header would otherwise cover part of the section in the capture.
  await page.addStyleTag({ content: 'header { visibility: hidden !important; }' })
  await section.screenshot({ path: `e2e/screenshots/${testInfo.project.name}-services-section.png` })
})
