import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

const theme = readFileSync(resolve(process.cwd(), 'src/styles/theme.css'), 'utf8')
const value = (name) => theme.match(new RegExp(`--${name}:\\s*([^;]+);`))[1]
const hexes = (css) => css.match(/#[0-9a-f]{6}/gi)

// WCAG 2 relative luminance and contrast ratio.
const channel = (c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4)
const luminance = (hex) => {
  const [r, g, b] = [1, 3, 5].map((i) => channel(parseInt(hex.slice(i, i + 2), 16) / 255))
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}
const contrast = (a, b) => {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x)
  return (hi + 0.05) / (lo + 0.05)
}

describe('matte surfaces', () => {
  // Every stop of the page spotlight and of the panel gradient, so no part of either fails.
  const surfaces = [value('bg-base'), ...hexes(value('bg-gradient')), ...hexes(value('panel'))]
  const texts = ['text', 'text-heading', 'text-body', 'text-muted', 'color-aura-gold'].map((name) => [name, value(name)])

  it.each(texts)('--%s clears 4.5:1 on the black page and the charcoal panels', (_, color) => {
    for (const surface of surfaces) expect(contrast(color, surface)).toBeGreaterThanOrEqual(4.5)
  })

  it('keeps the page black, not grey', () => {
    for (const stop of [value('bg-base'), ...hexes(value('bg-gradient'))]) expect(luminance(stop)).toBeLessThan(0.01)
  })
})
