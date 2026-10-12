import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import MatteGrain from './MatteGrain'

const filterOf = (svg) => svg.querySelector('rect').getAttribute('filter').match(/#([^)]+)/)[1]

describe('<MatteGrain />', () => {
  it('page: fixed, behind content, screened lightly so the black stays black', () => {
    render(<MatteGrain variant="page" />)
    for (const svg of [screen.getByTestId('matte-mottle'), screen.getByTestId('matte-pebble')]) {
      expect(svg).toHaveAttribute('aria-hidden', 'true')
      expect(svg).toHaveClass('pointer-events-none')
      expect(svg.style).toMatchObject({ position: 'fixed', zIndex: '-1', mixBlendMode: 'screen' })
      expect(Number(svg.style.opacity)).toBeLessThanOrEqual(0.03)
    }
  })

  it('panel and inset: two overlaid leathers, the inset with the finer grain', () => {
    const { unmount } = render(<MatteGrain variant="panel" />)
    expect(screen.getByTestId('matte-pebble').style).toMatchObject({ position: 'absolute', mixBlendMode: 'overlay' })
    unmount()
    render(<MatteGrain variant="inset" />)
    expect(screen.queryByTestId('matte-pebble')).not.toBeInTheDocument()
    expect(screen.getByTestId('matte-pebble-fine').style).toMatchObject({ position: 'absolute', mixBlendMode: 'overlay' })
  })

  it('lights the pebble grain diffusely (matte) and never animates', () => {
    render(<MatteGrain variant="panel" />)
    const pebble = screen.getByTestId('matte-pebble')
    expect(pebble.querySelector('feDiffuseLighting')).toBeInTheDocument()
    expect(pebble.querySelector('feSpecularLighting')).not.toBeInTheDocument()
    expect(pebble.querySelector('animate, animateTransform')).not.toBeInTheDocument()
  })

  it('gives every instance its own filter ids, each pointing at a filter that exists', () => {
    render(
      <>
        <MatteGrain variant="panel" />
        <MatteGrain variant="panel" />
      </>,
    )
    const ids = screen.getAllByTestId('matte-pebble').map(filterOf)
    expect(new Set(ids).size).toBe(2)
    for (const id of ids) expect(document.getElementById(id).tagName.toLowerCase()).toBe('filter')
  })
})
