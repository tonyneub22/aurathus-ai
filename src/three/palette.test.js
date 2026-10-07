import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'
import { GOLD, GOLD_HOT, GOLD_SOFT, RING_LIGHT, SURFACE } from './palette'

const theme = readFileSync(resolve(process.cwd(), 'src/styles/theme.css'), 'utf8') // vitest runs from the repo root
const token = (name) => theme.match(new RegExp(`--color-podo-${name}:\\s*(#[0-9a-f]{6})`, 'i'))?.[1].toLowerCase()

describe('palette', () => {
  it('matches the brand tokens in theme.css', () => {
    expect(GOLD).toBe(token('gold'))
    expect(GOLD_HOT).toBe(token('gold-hot'))
    expect(SURFACE).toBe(token('black-2'))
    expect(GOLD_SOFT).toBe(token('gold-soft'))
    expect(RING_LIGHT).toBe(token('ring'))
  })
})
