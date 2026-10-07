import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { act, render, screen } from '@testing-library/react'
import { useReducedMotion } from 'motion/react'
import GhostFibersBackground from './GhostFibersBackground'
import { supportsWebGL } from '../../three/webgl'

vi.mock('./GhostFibers', () => ({
  default: ({ active, still }) => <div data-testid="fibers-canvas" data-active={String(active)} data-still={String(still)} />,
}))
vi.mock('../../three/webgl', () => ({ supportsWebGL: vi.fn() }))
vi.mock('motion/react', async (importOriginal) => ({ ...(await importOriginal()), useReducedMotion: vi.fn() }))

const original = globalThis.IntersectionObserver
let notify
class ObserverStub {
  constructor(callback) {
    notify = (isIntersecting) => callback([{ isIntersecting }])
  }
  observe() {}
  disconnect() {}
}

describe('<GhostFibersBackground />', () => {
  beforeEach(() => {
    globalThis.IntersectionObserver = ObserverStub
    vi.mocked(supportsWebGL).mockReturnValue(true)
    vi.mocked(useReducedMotion).mockReturnValue(false)
  })
  afterEach(() => {
    globalThis.IntersectionObserver = original
  })

  it('is decorative: hidden from assistive tech and never takes clicks', () => {
    render(<GhostFibersBackground />)
    const root = screen.getByTestId('ghost-fibers')
    expect(root).toHaveAttribute('aria-hidden', 'true')
    expect(root).toHaveClass('pointer-events-none')
  })

  it('shows the still gold gradient and creates no WebGL context until near the viewport', () => {
    render(<GhostFibersBackground />)
    expect(screen.getByTestId('fibers-static')).toBeInTheDocument()
    expect(screen.queryByTestId('fibers-canvas')).not.toBeInTheDocument()
  })

  it('mounts the canvas when it comes near, and pauses it when it leaves', async () => {
    render(<GhostFibersBackground />)
    act(() => notify(true))
    expect(await screen.findByTestId('fibers-canvas')).toHaveAttribute('data-active', 'true')
    act(() => notify(false))
    expect(screen.getByTestId('fibers-canvas')).toHaveAttribute('data-active', 'false')
  })

  it('draws one still frame, never a loop, with reduced motion', async () => {
    vi.mocked(useReducedMotion).mockReturnValue(true)
    render(<GhostFibersBackground />)
    act(() => notify(true))
    expect(await screen.findByTestId('fibers-canvas')).toHaveAttribute('data-still', 'true')
  })

  it('stays on the still gradient without WebGL', () => {
    vi.mocked(supportsWebGL).mockReturnValue(false)
    render(<GhostFibersBackground />)
    act(() => notify(true))
    expect(screen.getByTestId('fibers-static')).toBeInTheDocument()
    expect(screen.queryByTestId('fibers-canvas')).not.toBeInTheDocument()
  })
})
