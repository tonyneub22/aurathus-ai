import { render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { site } from '../../config/site'

const reduced = vi.hoisted(() => ({ value: false }))
vi.mock('motion/react', async (importOriginal) => {
  const actual = await importOriginal()
  return { ...actual, useReducedMotion: () => reduced.value }
})

const { default: WhyStatue } = await import('./WhyStatue')
const { statue } = site.whyUs

describe('<WhyStatue />', () => {
  afterEach(() => {
    reduced.value = false
  })

  it('serves the statue through <picture> with the configured sources and size', () => {
    const { container } = render(<WhyStatue />)
    const sources = [...container.querySelectorAll('picture > source')].map((s) => [s.type, s.getAttribute('srcset')])
    expect(sources).toEqual(statue.sources.map((s) => [s.type, s.srcSet]))
    const img = container.querySelector('picture > img')
    expect(img).toHaveAttribute('src', statue.src)
    expect(img).toHaveAttribute('width', String(statue.width))
    expect(img).toHaveAttribute('height', String(statue.height))
    expect(img).toHaveAttribute('alt', '') // decorative beside the copy
    expect(img).toHaveAttribute('loading', 'lazy')
    expect(img).toHaveAttribute('decoding', 'async')
  })

  it('hides the halo and the ring from assistive tech', () => {
    const { container } = render(<WhyStatue />)
    expect(screen.getByTestId('why-halo')).toHaveAttribute('aria-hidden', 'true')
    expect(container.querySelector('svg')).toHaveAttribute('aria-hidden', 'true')
  })

  it('turns and breathes the halo when motion is allowed', () => {
    const { container } = render(<WhyStatue />)
    expect(container.querySelector('.why-halo-turn')).toBeInTheDocument()
    expect(container.querySelector('.why-halo-breath')).toBeInTheDocument()
  })

  it('holds the halo still under reduced motion', () => {
    reduced.value = true
    const { container } = render(<WhyStatue />)
    expect(screen.getByTestId('why-halo')).toBeInTheDocument()
    expect(container.querySelector('.why-halo-turn, .why-halo-breath')).not.toBeInTheDocument()
  })
})
