import { render, screen } from '@testing-library/react'
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

  it('keeps the copyright, email and statue credit', () => {
    render(<Footer />)
    expect(screen.getByText('© 2026 Aurathus AI LLC')).toBeInTheDocument()
    expect(screen.getByText('tjneubacher@gmail.com')).toBeInTheDocument()
    expect(screen.getByTestId('statue-credit')).toBeInTheDocument()
  })
})
