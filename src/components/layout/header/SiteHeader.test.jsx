import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { site } from '../../../config/site'
import SiteHeader from './SiteHeader'

describe('<SiteHeader />', () => {
  it('links Home to the top of the home page', () => {
    render(<SiteHeader />)
    expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute('href', '/#top')
  })

  it('toggles the menu and reports it with aria-expanded', () => {
    render(<SiteHeader />)
    const button = screen.getByRole('button', { name: 'Menu' })
    expect(button).toHaveAttribute('aria-expanded', 'false')
    expect(document.getElementById(button.getAttribute('aria-controls'))).toBeInTheDocument()

    fireEvent.click(button)
    expect(button).toHaveAttribute('aria-expanded', 'true')
    fireEvent.click(button)
    expect(button).toHaveAttribute('aria-expanded', 'false')
  })

  it('makes the closed panel inert', () => {
    render(<SiteHeader />)
    const button = screen.getByRole('button', { name: 'Menu' })
    const panel = document.getElementById(button.getAttribute('aria-controls'))
    expect(panel.inert).toBe(true)
    fireEvent.click(button)
    expect(panel.inert).toBe(false)
  })

  it('lists every menu link and the consult link, in order', () => {
    render(<SiteHeader />)
    fireEvent.click(screen.getByRole('button', { name: 'Menu' }))
    const dialog = screen.getByRole('dialog', { name: 'Menu' })
    const links = [...dialog.querySelectorAll('a')].map((a) => [a.textContent, a.getAttribute('href')])
    expect(links).toEqual([
      ['Services', '/#services'],
      ['Why Us', '/#why-us'],
      ['Work', '/#testimonials'],
      ['Studio', '/#about'],
      ['Contact', '/#contact'],
      [site.nav.cta.label, '/consult'],
    ])
  })

  it('closes when a link or the backdrop is clicked', () => {
    render(<SiteHeader />)
    const button = screen.getByRole('button', { name: 'Menu' })
    fireEvent.click(button)
    fireEvent.click(screen.getByRole('link', { name: 'Services' }))
    expect(button).toHaveAttribute('aria-expanded', 'false')

    fireEvent.click(button)
    fireEvent.click(screen.getByTestId('menu-backdrop'))
    expect(button).toHaveAttribute('aria-expanded', 'false')
  })
})
