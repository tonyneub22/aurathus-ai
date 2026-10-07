import { afterEach, describe, expect, it, vi } from 'vitest'
import { scrollToHash } from './scrollToHash'

describe('scrollToHash', () => {
  afterEach(() => {
    document.body.innerHTML = ''
  })

  it('scrolls the named element into view, without animating', () => {
    document.body.innerHTML = '<section id="why-us"></section>'
    const section = document.getElementById('why-us')
    section.scrollIntoView = vi.fn()
    expect(scrollToHash('#why-us')).toBe(true)
    expect(section.scrollIntoView).toHaveBeenCalledWith({ behavior: 'instant', block: 'start' })
  })

  it('does nothing for an empty or unknown hash', () => {
    expect(scrollToHash('')).toBe(false)
    expect(scrollToHash('#nowhere')).toBe(false)
  })
})
