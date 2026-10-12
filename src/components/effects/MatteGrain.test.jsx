import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import MatteGrain from './MatteGrain'

const filterOf = (svg) => svg.querySelector('rect').getAttribute('filter').match(/#([^)]+)/)[1]

describe('<MatteGrain />', () => {
  it('page: fixed mottle and grain layers, behind content, screened', () => {
    render(<MatteGrain variant="page" />)
    const mottle = screen.getByTestId('matte-mottle')
    const grain = screen.getByTestId('matte-grain')
    for (const [svg, opacity] of [[mottle, '0.02'], [grain, '0.025']]) {
      expect(svg).toHaveAttribute('aria-hidden', 'true')
      expect(svg).toHaveClass('pointer-events-none')
      expect(svg.style).toMatchObject({ position: 'fixed', zIndex: '-1', opacity, mixBlendMode: 'screen' })
    }
    const turbulence = mottle.querySelector('feTurbulence')
    expect(turbulence).toHaveAttribute('baseFrequency', '0.006')
    expect(turbulence).toHaveAttribute('numOctaves', '4')
    expect(turbulence).toHaveAttribute('seed', '7')
    expect(grain.querySelector('feTurbulence')).toHaveAttribute('stitchTiles', 'stitch')
    expect(mottle.querySelector('feColorMatrix')).toHaveAttribute('values', '0')
  })

  it('panel: grain only, overlaid, filling its parent', () => {
    render(<MatteGrain variant="panel" />)
    expect(screen.queryByTestId('matte-mottle')).not.toBeInTheDocument()
    expect(screen.getByTestId('matte-grain').style).toMatchObject({ position: 'absolute', opacity: '0.07', mixBlendMode: 'overlay' })
  })

  it('gives every instance its own filter ids, each pointing at a filter that exists', () => {
    render(
      <>
        <MatteGrain variant="panel" />
        <MatteGrain variant="panel" />
      </>,
    )
    const ids = screen.getAllByTestId('matte-grain').map(filterOf)
    expect(new Set(ids).size).toBe(2)
    for (const id of ids) expect(document.getElementById(id).tagName.toLowerCase()).toBe('filter')
  })
})
