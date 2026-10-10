import { renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import usePageMeta from './usePageMeta'

describe('usePageMeta', () => {
  it('sets the title and the meta description', () => {
    document.head.innerHTML = '<meta name="description" content="old" />'
    renderHook(() => usePageMeta('Video Services — Aurathus AI LLC', 'Beautiful video.'))
    expect(document.title).toBe('Video Services — Aurathus AI LLC')
    expect(document.querySelector('meta[name="description"]')).toHaveAttribute('content', 'Beautiful video.')
  })
})
