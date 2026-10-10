import { describe, expect, it } from 'vitest'
import { screen, within } from '@testing-library/react'
import { renderInRouter as render } from '../../test/router'
import Services from './Services'
import { services } from '../../config/services'

describe('<Services />', () => {
  it('is one box titled "Services", labelled by its heading, that the beam aims at', () => {
    render(<Services />)
    const region = screen.getByRole('region', { name: 'Services' })
    expect(region).toContainElement(screen.getByRole('heading', { level: 2, name: 'Services' }))
    expect(region.querySelector('[data-beam-target]')).toBeInTheDocument()
  })

  it('renders four cards: glyph, name, card line and Read more, in that order', () => {
    render(<Services />)
    const cards = screen.getAllByRole('article')
    expect(cards).toHaveLength(4)
    cards.forEach((card, i) => {
      const s = services[i]
      const kids = [...card.firstElementChild.children]
      expect(kids[0].querySelector('svg')).toHaveAttribute('aria-hidden', 'true')
      expect(kids[1]).toHaveTextContent(s.name)
      expect(kids[2]).toHaveTextContent(s.cardLine)
      expect(within(kids[3]).getByRole('link')).toHaveTextContent('Read more')
    })
  })

  it('links each Read more to its service page, named for the service', () => {
    render(<Services />)
    for (const s of services) {
      expect(screen.getByRole('heading', { level: 3, name: s.name })).toBeInTheDocument()
      expect(screen.getByRole('link', { name: `Read more about ${s.name}` })).toHaveAttribute('href', `/services/${s.slug}`)
    }
  })
})
