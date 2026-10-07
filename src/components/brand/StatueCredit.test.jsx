import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import StatueCredit from './StatueCredit'
import { site } from '../../config/site'

describe('<StatueCredit />', () => {
  it('renders every required part of the CC BY attribution as links', () => {
    render(<StatueCredit />)
    const c = site.statue.credit

    const title = screen.getByRole('link', { name: c.title })
    expect(title).toHaveAttribute('href', c.titleUrl)

    const author = screen.getByRole('link', { name: c.author })
    expect(author).toHaveAttribute('href', c.authorUrl)

    const license = screen.getByRole('link', { name: c.license })
    expect(license).toHaveAttribute('href', c.licenseUrl)
    expect(license.getAttribute('rel')).toContain('license')

    expect(screen.getByTestId('statue-credit')).toHaveTextContent(c.changes)
  })

  it('opens external links safely', () => {
    render(<StatueCredit />)
    for (const link of screen.getAllByRole('link')) {
      expect(link).toHaveAttribute('target', '_blank')
      expect(link.getAttribute('rel')).toContain('noopener')
    }
  })
})
