import { screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { renderInRouter as render } from '../../test/router'
import CtaButton from './CtaButton'

describe('<CtaButton />', () => {
  it('links to its target with a visible label and a decorative arrow', () => {
    render(<CtaButton to="/consult">Request Consult</CtaButton>)
    const link = screen.getByRole('link', { name: 'Request Consult' })
    expect(link).toHaveAttribute('href', '/consult')
    expect(link.querySelector('span')).toHaveAttribute('aria-hidden', 'true')
  })

  it('adds placement classes without losing its own', () => {
    render(<CtaButton to="/consult" className="mt-12">Go</CtaButton>)
    expect(screen.getByRole('link', { name: 'Go' })).toHaveClass('mt-12', 'border')
  })

  it('comes in a small size and without its arrow, for the header bar and the menu', () => {
    render(
      <CtaButton to="/consult" size="sm" arrow={false}>
        Small
      </CtaButton>,
    )
    const link = screen.getByRole('link', { name: 'Small' })
    expect(link).toHaveClass('px-5', 'py-2.5')
    expect(link.querySelector('span[aria-hidden]')).not.toBeInTheDocument()
  })
})
