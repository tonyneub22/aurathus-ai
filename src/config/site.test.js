import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'
import { site } from './site'

/**
 * The CC BY 4.0 licence on the hero figure requires attribution with title,
 * author, licence link and a note of changes. This test fails if any of it is
 * removed from the config. See LICENSES.md.
 */
describe('statue attribution', () => {
  const c = site.statue.credit

  it('names the work, the author and the licence', () => {
    expect(c.title).toBe('David Head')
    expect(c.author).toBe('1d_inc')
    expect(c.license).toMatch(/CC BY 4\.0/)
  })

  it('links to the source, the author and the licence text', () => {
    expect(c.titleUrl).toMatch(/^https:\/\/(skfb\.ly|sketchfab\.com)\//)
    expect(c.authorUrl).toMatch(/^https:\/\/sketchfab\.com\//)
    expect(c.licenseUrl).toMatch(/creativecommons\.org\/licenses\/by\/4\.0/)
  })

  it('notes that the work was modified', () => {
    expect(c.changes).toMatch(/modified/i)
  })

  it('points at a model file shipped with the site', () => {
    expect(site.statue.modelUrl).toMatch(/^\/models\/.+\.(gltf|glb)$/)
  })
})

describe('copy', () => {
  it('has the hero headline and subtitle', () => {
    expect(site.hero.headline.join(' ')).toBe('Aurathus AI')
    expect(site.hero.subtitle).toBe('Technology Design Services')
    expect(site.hero.tagline).toBe('Sculpting Ideas to Reality')
  })

  it('has titled boxes for testimonials, why-us and about, with copy in each', () => {
    expect(site.testimonials.title).toBe('Client Testimonials')
    expect(site.whyUs.title).toBe('Why Choose Us?')
    expect(site.about.title).toBe('About')
    expect(site.testimonials.items.length).toBeGreaterThanOrEqual(2)
    for (const t of site.testimonials.items) {
      expect(t.quote).toBeTruthy()
      expect(t.name).toBeTruthy()
      expect(t.role).toBeTruthy()
    }
    for (const w of site.whyUs.items) {
      expect(w.title).toBeTruthy()
      expect(w.body).toBeTruthy()
    }
    expect(site.about.paragraphs.length).toBeGreaterThan(0)
  })

  it('has a Services box with three services with complete copy', () => {
    expect(site.services.title).toBe('Services')
    expect(site.services.items).toHaveLength(3)
    for (const item of site.services.items) {
      expect(item.title).toBeTruthy()
      expect(item.body).toBeTruthy()
      expect(item.meta).toBeTruthy()
    }
  })
})

describe('brand', () => {
  const html = readFileSync(resolve(process.cwd(), 'index.html'), 'utf8')

  it('names the company and its domain', () => {
    expect(site.companyName).toBe('Aurathus AI LLC')
    expect(site.siteUrl).toBe('https://aurathus-ai.com')
    expect(site.footer.text).toBe('© 2026 Aurathus AI LLC')
  })

  it('points at brand files that exist in public/', () => {
    expect(existsSync(resolve(process.cwd(), 'public', site.brand.logo.src.slice(1)))).toBe(true)
  })

  it('takes the domain in index.html from siteUrl, never hardcoded', () => {
    expect(html).not.toMatch(/aurathus-ai\.com/)
    expect(html).toContain('<link rel="canonical" href="__SITE_URL__/" />')
    expect(html).toContain('content="__SITE_URL__/og-image.png"')
  })

  it('links every icon and the manifest that index.html names', () => {
    for (const [, path] of html.matchAll(/href="\/([^"]+\.(?:ico|png|webmanifest))"/g)) {
      expect(existsSync(resolve(process.cwd(), 'public', path)), path).toBe(true)
    }
  })
})
