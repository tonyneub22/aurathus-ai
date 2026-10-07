import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import Services from './Services'
import { site } from '../../config/site'

describe('<Services />', () => {
  it('is one box titled "Services", labelled by its heading', () => {
    render(<Services />)
    const heading = screen.getByRole('heading', { level: 2, name: 'Services' })
    expect(screen.getByRole('region', { name: 'Services' })).toContainElement(heading)
  })

  it('keeps the three service cards with their copy', () => {
    render(<Services />)
    for (const item of site.services.items) {
      expect(screen.getByRole('heading', { level: 3, name: item.title })).toBeInTheDocument()
      expect(screen.getByText(item.body)).toBeInTheDocument()
      expect(screen.getByText(item.meta)).toBeInTheDocument()
    }
  })

  it('drops the old eyebrow and headline', () => {
    render(<Services />)
    expect(screen.queryByText(/what we make/i)).not.toBeInTheDocument()
    expect(screen.queryByText(/built by hand/i)).not.toBeInTheDocument()
  })
})
