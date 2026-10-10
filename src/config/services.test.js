import { describe, expect, it } from 'vitest'
import { serviceBySlug, services } from './services'
import { site } from './site'

describe('services', () => {
  it('has exactly four services with unique slugs', () => {
    expect(services).toHaveLength(4)
    expect(new Set(services.map((s) => s.slug)).size).toBe(4)
    expect(services.map((s) => s.slug)).toEqual(['web-development', 'ai-integration', 'software-development', 'video'])
  })

  it('gives each service complete copy', () => {
    for (const s of services) {
      expect(s.name, s.slug).toBeTruthy()
      expect(s.cardLine, s.slug).toBeTruthy()
      expect(s.startLine, s.slug).toBeTruthy()
      expect(s.pricingNote, s.slug).toBeTruthy()
      expect(s.tiers.length, s.slug).toBeGreaterThanOrEqual(2)
      expect(s.tiers.length, s.slug).toBeLessThanOrEqual(3)
      for (const t of s.tiers) {
        expect(t.label).toMatch(/^Tier I{1,3}$/)
        expect(t.name).toMatch(/ Plan$/)
        expect(t.timeline).toBeTruthy()
        expect(t.body).toBeTruthy()
      }
      expect(s.technical.length, s.slug).toBeGreaterThanOrEqual(1)
    }
  })

  it('numbers tiers in order', () => {
    for (const s of services) expect(s.tiers.map((t) => t.label)).toEqual(['Tier I', 'Tier II', 'Tier III'].slice(0, s.tiers.length))
  })

  it('has two tiers for Video and no includes band for AI Integration', () => {
    expect(serviceBySlug('video').tiers).toHaveLength(2)
    expect(serviceBySlug('video').includes.heading).toBe('Both plans include')
    expect(serviceBySlug('ai-integration').includes).toBeNull()
  })

  it('maps each service to an option on the consult form', () => {
    for (const s of services) expect(site.consult.interests).toContain(s.interest)
  })

  it('returns null for an unknown slug', () => {
    expect(serviceBySlug('nope')).toBeNull()
    expect(serviceBySlug(undefined)).toBeNull()
  })
})
