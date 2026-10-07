import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { useReducedMotion } from 'motion/react'
import ServicesBeam from './ServicesBeam'
import { supportsWebGL } from '../../three/webgl'

vi.mock('./LaserFlow', () => ({ default: () => <div data-testid="laser-flow" /> }))
vi.mock('../../three/webgl', () => ({ supportsWebGL: vi.fn() }))
vi.mock('motion/react', async (importOriginal) => ({ ...(await importOriginal()), useReducedMotion: vi.fn() }))

function Stage() {
  return (
    <main style={{ position: 'relative' }}>
      <section data-beam-hero>
        <div data-beam-clear />
      </section>
      <ServicesBeam />
      <div data-beam-target />
    </main>
  )
}

describe('<ServicesBeam />', () => {
  beforeEach(() => {
    vi.mocked(supportsWebGL).mockReturnValue(true)
    vi.mocked(useReducedMotion).mockReturnValue(false)
  })

  it('is decorative: hidden from assistive tech and never takes clicks', () => {
    render(<Stage />)
    const layer = screen.getByTestId('services-beam')
    expect(layer).toHaveAttribute('aria-hidden', 'true')
    expect(layer).toHaveClass('pointer-events-none')
  })

  it('does not create a WebGL context until the beam is near the viewport', () => {
    render(<Stage />)
    expect(screen.queryByTestId('laser-flow')).not.toBeInTheDocument()
  })

  it.each([
    ['reduced motion', () => vi.mocked(useReducedMotion).mockReturnValue(true)],
    ['no WebGL', () => vi.mocked(supportsWebGL).mockReturnValue(false)],
  ])('draws a still gold line instead with %s', (_, setup) => {
    setup()
    render(<Stage />)
    const layer = screen.getByTestId('services-beam')
    expect(screen.queryByTestId('laser-flow')).not.toBeInTheDocument()
    expect(layer.querySelectorAll('div div').length).toBeGreaterThan(0) // StaticBeam's line and flare
  })
})
