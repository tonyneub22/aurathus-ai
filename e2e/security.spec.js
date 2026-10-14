import { readFileSync } from 'node:fs'
import { expect, test } from '@playwright/test'

/**
 * The production security headers live in vercel.json, which `vite preview`
 * doesn't apply. This spec adds them to every document response and fails on
 * any Content Security Policy violation, so the policy and the site can't drift.
 */
const vercel = JSON.parse(readFileSync(new URL('../vercel.json', import.meta.url), 'utf8'))
const headers = Object.fromEntries(vercel.headers[0].headers.map(({ key, value }) => [key.toLowerCase(), value]))

test.beforeEach(async ({ page }) => {
  await page.route('**/*', async (route) => {
    if (route.request().resourceType() !== 'document') return route.continue()
    const response = await route.fetch()
    await route.fulfill({ response, headers: { ...response.headers(), ...headers } })
  })
  await page.addInitScript(() => {
    window.__cspViolations = []
    document.addEventListener('securitypolicyviolation', (e) => window.__cspViolations.push(`${e.violatedDirective} ${e.blockedURI}`))
  })
})

test('sends a strict policy that forbids framing and plugins', () => {
  const csp = headers['content-security-policy']
  for (const rule of ["default-src 'self'", "script-src 'self'", "object-src 'none'", "frame-ancestors 'none'", "base-uri 'self'"]) expect(csp).toContain(rule)
  expect(csp).not.toMatch(/script-src[^;]*'unsafe-(inline|eval)'/)
  expect(headers['x-content-type-options']).toBe('nosniff')
  expect(headers['x-frame-options']).toBe('DENY')
})

for (const path of ['/', '/services/web-development', '/consult', '/nowhere']) {
  test(`${path} runs under the policy with no violations`, async ({ page }) => {
    test.setTimeout(60_000)
    await page.goto(path)
    await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1)
    // Scroll through so lazy chunks, fonts, the fibers and the beam all load.
    const height = await page.evaluate(() => document.body.scrollHeight)
    for (let y = 0; y < height; y += 600) {
      await page.evaluate((top) => window.scrollTo({ top, behavior: 'instant' }), y)
      await page.waitForTimeout(150)
    }
    await page.waitForTimeout(path === '/' ? 4000 : 1000)
    expect(await page.evaluate(() => window.__cspViolations)).toEqual([])
  })
}
