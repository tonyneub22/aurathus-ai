import { screen } from '@testing-library/react'
import { renderInRouter as render } from '../../test/router'
import { describe, expect, it } from 'vitest'
import Footer from './Footer'

describe('<Footer />', () => {
  it('shows the footer lockup (with LLC), sized to avoid layout shift, lazy, linking to the top', () => {
    render(<Footer />)
    const logo = screen.getByRole('img', { name: 'Aurathus AI LLC' })
    expect(logo).toHaveAttribute('src', '/brand/aurathus-logo-footer.svg')
    expect(logo).toHaveAttribute('width', '1058')
    expect(logo).toHaveAttribute('height', '200')
    expect(logo).toHaveAttribute('loading', 'lazy')
    expect(logo.closest('a')).toHaveAttribute('href', '/#top')
  })

  it('keeps the contact anchor, the email as text and a link, the location and the copyright', () => {
    const { container } = render(<Footer />)
    expect(container.querySelector('footer')).toHaveAttribute('id', 'contact')
    expect(screen.getByRole('link', { name: 'tjneubacher@gmail.com' })).toHaveAttribute('href', 'mailto:tjneubacher@gmail.com')
    expect(screen.getByText('Grand Rapids · Michigan')).toBeInTheDocument()
    // Rendered twice: inline for phones and tablets, in its own column on wide screens (one shown at a time).
    expect(screen.getAllByText('© 2026 Aurathus AI LLC')).toHaveLength(2)
  })

  it('shows the statue credit only when asked (pages that show the statue)', () => {
    const { unmount } = render(<Footer />)
    expect(screen.queryByTestId('statue-credit')).not.toBeInTheDocument()
    unmount()
    render(<Footer credit />)
    expect(screen.getByTestId('statue-credit')).toBeInTheDocument()
  })
})
