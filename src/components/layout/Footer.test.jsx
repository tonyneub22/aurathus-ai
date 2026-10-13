import { screen } from '@testing-library/react'
import { renderInRouter as render } from '../../test/router'
import { describe, expect, it } from 'vitest'
import Footer from './Footer'

describe('<Footer />', () => {
  it('shows the horizontal logo, sized to avoid layout shift, linking to the top', () => {
    render(<Footer />)
    const logo = screen.getByRole('img', { name: 'Aurathus AI LLC' })
    expect(logo).toHaveAttribute('src', '/brand/aurathus-logo-horizontal.svg')
    expect(logo).toHaveAttribute('width', '3892')
    expect(logo).toHaveAttribute('height', '1000')
    expect(logo.closest('a')).toHaveAttribute('href', '/#top')
  })

  it('keeps the copyright and email', () => {
    render(<Footer />)
    expect(screen.getByText('© 2026 Aurathus AI LLC')).toBeInTheDocument()
    expect(screen.getByText('tjneubacher@gmail.com')).toBeInTheDocument()
  })

  it('shows the statue credit only when asked (pages that show the statue)', () => {
    const { unmount } = render(<Footer />)
    expect(screen.queryByTestId('statue-credit')).not.toBeInTheDocument()
    unmount()
    render(<Footer credit />)
    expect(screen.getByTestId('statue-credit')).toBeInTheDocument()
  })

  it('credits the Met photograph of the Thinker beside the David credit, with its link', () => {
    const { unmount } = render(<Footer />)
    expect(screen.queryByTestId('image-credit')).not.toBeInTheDocument()
    unmount()
    render(<Footer credit />)
    const credit = screen.getByTestId('image-credit')
    expect(credit).toHaveTextContent('The Thinker')
    expect(credit).toHaveTextContent('Auguste Rodin')
    expect(credit).toHaveTextContent('Public Domain (CC0)')
    const link = screen.getByRole('link', { name: 'The Thinker' })
    expect(link).toHaveAttribute('href', 'https://www.metmuseum.org/art/collection/search/191811')
    expect(link).toHaveAttribute('rel', 'noopener noreferrer')
  })
})
