import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import Hero from './Hero'
import { site } from '../../config/site'
import { supportsWebGL } from '../../three/webgl'

// The WebGL canvas can't run in jsdom; the hero must still render its copy.
vi.mock('./StatueCanvas', () => ({ default: () => <canvas data-testid="statue-canvas" /> }))
vi.mock('../../three/webgl', () => ({ supportsWebGL: vi.fn() }))

describe('<Hero />', () => {
  beforeEach(() => {
    vi.mocked(supportsWebGL).mockReturnValue(true)
  })

  it('renders the headline, subtitle and call to action from config', async () => {
    render(<Hero />)
    await screen.findByTestId('statue-canvas') // let the lazy figure settle
    const h1 = screen.getByRole('heading', { level: 1 })
    expect(h1).toHaveTextContent(/^Aurathus AI$/) // exact: screen readers need the space
    expect(screen.getByText(site.hero.subtitle)).toBeInTheDocument()
    expect(screen.getByText(site.hero.tagline)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: new RegExp(site.hero.cta.label) })).toHaveAttribute(
      'href',
      site.hero.cta.href,
    )
  })

  it('has no scroll cue', () => {
    render(<Hero />)
    expect(screen.queryByText(/^scroll$/i)).not.toBeInTheDocument()
  })

  it('shows a loading indicator and mounts the figure when WebGL is available', async () => {
    render(<Hero />)
    expect(screen.getByRole('img', { name: /loading figure/i })).toBeInTheDocument()
    expect(await screen.findByTestId('statue-canvas')).toBeInTheDocument()
  })

  it('skips the figure entirely without WebGL but keeps all copy', () => {
    vi.mocked(supportsWebGL).mockReturnValue(false)
    render(<Hero />)
    expect(screen.queryByRole('img', { name: /loading figure/i })).not.toBeInTheDocument()
    expect(screen.queryByTestId('statue-canvas')).not.toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
  })
})
