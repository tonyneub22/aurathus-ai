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
  it('is an unboxed region titled "Services" whose top rule the beam aims at', () => {
    const { container } = render(<Services />)
    const region = screen.getByRole('region', { name: 'Services' })
    expect(within(region).getAllByRole('heading', { level: 2 })).toHaveLength(1)
    const target = region.querySelector('[data-beam-target]')
    expect(target).toHaveClass('border-t')
    expect(target.firstElementChild.nextElementSibling.tagName).toBe('ARTICLE')
    expect(container.querySelector('.matte-panel')).not.toBeInTheDocument()
  })

  it('indexes four services in order, each a whole-row link to its page', () => {
    render(<Services />)
    const rows = screen.getAllByRole('article')
    expect(rows).toHaveLength(4)
    rows.forEach((row, i) => {
      const [name, href] = ORDER[i]
      expect(within(row).getByRole('heading', { level: 3 })).toHaveTextContent(name)
      expect(row).toHaveClass('relative')
      const link = within(row).getByRole('link', { name: `Read more about ${name}` })
      expect(link).toHaveAttribute('href', href)
      expect(link).toHaveTextContent('Read more')
      expect(link).toHaveClass('after:absolute', 'after:inset-0') // stretched over the row
      expect(row.querySelector('svg')).not.toBeInTheDocument() // no icon tiles
    })
  })

  it('ends with the general Request Consult button', () => {
    render(<Services />)
    const region = screen.getByRole('region', { name: 'Services' })
    expect(within(region).getByRole('link', { name: site.hero.cta.label })).toHaveAttribute('href', site.hero.cta.href)
    expect(screen.queryByText(/not sure where to begin/i)).not.toBeInTheDocument()
  })
})
