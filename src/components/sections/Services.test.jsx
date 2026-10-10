import { describe, expect, it } from 'vitest'
import { screen, within } from '@testing-library/react'
import { renderInRouter as render } from '../../test/router'
import Services from './Services'
import { site } from '../../config/site'

// The order Anthony asked for, written out so a reshuffled data file fails here.
const ORDER = [
  ['Web Development', '/services/web-development'],
  ['AI Integration', '/services/ai-integration'],
  ['Software Development', '/services/software-development'],
  ['Video Services', '/services/video'],
]

describe('<Services />', () => {
  it('is one box titled "Services", labelled by its heading, that the beam aims at', () => {
    render(<Services />)
    const region = screen.getByRole('region', { name: 'Services' })
    expect(within(region).getAllByRole('heading', { level: 2 })).toHaveLength(1)
    expect(region).toContainElement(screen.getByRole('heading', { level: 2, name: 'Services' }))
    expect(region.querySelector('[data-beam-target]')).toBeInTheDocument()
  })

  it('renders four rows in order, each with a hidden icon, an h3 and Read more to its page', () => {
    render(<Services />)
    const rows = screen.getAllByRole('article')
    expect(rows).toHaveLength(4)
    rows.forEach((row, i) => {
      const [name, href] = ORDER[i]
      expect(within(row).getByRole('heading', { level: 3 })).toHaveTextContent(name)
      expect(row.querySelector('svg').closest('[aria-hidden="true"]')).toBeInTheDocument()
      const link = within(row).getByRole('link', { name: `Read more about ${name}` })
      expect(link).toHaveAttribute('href', href)
      expect(link).toHaveTextContent('Read more')
    })
  })

  it('ends with the general Request Consult button instead of a lead-in line', () => {
    render(<Services />)
    const region = screen.getByRole('region', { name: 'Services' })
    expect(within(region).getByRole('link', { name: site.hero.cta.label })).toHaveAttribute('href', site.hero.cta.href)
    expect(screen.queryByText(/not sure where to begin/i)).not.toBeInTheDocument()
  })
})
