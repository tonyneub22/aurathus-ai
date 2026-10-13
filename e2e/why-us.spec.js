import { expect, test } from '@playwright/test'

/** The Why Choose Us statue and its gold halo, against the production build. */

// Landing on home boots the WebGL hero, which can hold the main thread for seconds headless.
const HOME = { timeout: 20_000 }

async function toStatue(page) {
  const section = page.locator('#why-us')
  await section.evaluate((el) => el.scrollIntoView({ block: 'start', behavior: 'instant' }))
  const img = section.locator('picture img')
  await expect(img).toBeVisible(HOME)
  // Lazy: wait for the bytes, not just the box.
  await expect.poll(() => img.evaluate((el) => el.complete && el.naturalWidth), HOME).toBeGreaterThan(0)
  return { section, img }
}

test('shows the statue beside the reasons, loaded, with no overflow or console errors', async ({ page }, testInfo) => {
  test.setTimeout(60_000)
  const errors = []
  page.on('console', (msg) => msg.type() === 'error' && errors.push(msg.text()))
  page.on('pageerror', (err) => errors.push(String(err)))
  page.on('response', (res) => res.status() >= 400 && errors.push(`${res.status()} ${res.url()}`))
  await page.goto('/')
  const { section, img } = await toStatue(page)

  const box = await img.boundingBox()
  const title = await section.getByRole('heading', { level: 2 }).boundingBox()
  if (testInfo.project.name === 'desktop') {
    expect(box.height).toBeGreaterThan(450) // large and confident
    expect(box.x + box.width).toBeLessThan(title.x) // its own column, left of the copy
  } else {
    expect(box.height).toBeLessThanOrEqual(page.viewportSize().height * 0.55 + 1)
    expect(box.y + box.height).toBeLessThan(title.y) // above the copy
    const centre = box.x + box.width / 2
    expect(Math.abs(centre - page.viewportSize().width / 2)).toBeLessThan(24)
  }

  // The halo turns while the section is on screen.
  await expect.poll(() => section.locator('.why-halo-turn').evaluate((el) => el.getAnimations().length)).toBeGreaterThan(0)

  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)
  expect(overflow).toBeLessThanOrEqual(0)
  // Bring each reason on screen so its reveal runs (phones stack them below the fold).
  for (const item of await section.locator('li').all()) {
    await item.evaluate((el) => el.scrollIntoView({ block: 'center', behavior: 'instant' }))
    await expect.poll(() => item.evaluate((el) => getComputedStyle(el).opacity), HOME).toBe('1')
  }
  await section.evaluate((el) => el.scrollIntoView({ block: 'start', behavior: 'instant' }))
  await page.waitForTimeout(2500) // the halo fade-up and the ring draw-in finished
  // The fixed header would otherwise cover part of the section in the capture.
  await page.addStyleTag({ content: 'header { visibility: hidden !important; }' })
  await section.screenshot({ path: `e2e/screenshots/${testInfo.project.name}-why-us-statue.png` })
  expect(errors, errors.join('\n')).toEqual([])
})

test.describe('reduced motion', () => {
  test.use({ reducedMotion: 'reduce' })

  test('keeps the halo still: no running animation', async ({ page }) => {
    await page.goto('/')
    const { section } = await toStatue(page)
    const halo = section.getByTestId('why-halo')
    await expect(halo).toBeAttached()
    const running = await halo.evaluate((el) =>
      [el, ...el.querySelectorAll('*')].flatMap((n) => n.getAnimations()).filter((a) => a.playState === 'running').length,
    )
    expect(running).toBe(0)
  })
})
