import { useRef } from 'react'
import { render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import useReveal from './useReveal'

function Page() {
  const ref = useRef(null)
  useReveal(ref)
  return (
    <div ref={ref}>
      <p data-reveal="">Below the fold</p>
    </div>
  )
}

const setReduced = (reduced) =>
  vi.spyOn(window, 'matchMedia').mockImplementation((query) => ({
    matches: reduced && query.includes('reduce'),
    media: query,
    addEventListener() {},
    removeEventListener() {},
    addListener() {},
    removeListener() {},
  }))

describe('useReveal', () => {
  afterEach(() => vi.restoreAllMocks())

  it('leaves content exactly as rendered under reduced motion', () => {
    setReduced(true)
    render(<Page />)
    expect(screen.getByText('Below the fold').getAttribute('style')).toBeNull()
  })

  it('never hides waiting content with visibility, so it stays readable and focusable', () => {
    setReduced(false)
    vi.spyOn(window, 'innerHeight', 'get').mockReturnValue(-1) // everything counts as below the fold
    render(<Page />)
    const el = screen.getByText('Below the fold')
    expect(el.style.visibility).toBe('')
    expect(el.style.opacity).toBe('0')
  })
})
