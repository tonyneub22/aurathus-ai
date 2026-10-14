import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'
import { collectCopy } from './copy'

// Approved by Anthony. Redesigns change the look, never the words; update this
// file only when he supplies new copy.
const approved = JSON.parse(readFileSync(resolve(process.cwd(), 'src/config/__fixtures__/approved-copy.json'), 'utf8'))

describe('copy guard', () => {
  it('keeps every word of the approved copy', () => {
    // Sorted: the guard is about words, not the order keys sit in the config.
    expect([...collectCopy()].sort()).toEqual([...approved].sort())
  })
})
