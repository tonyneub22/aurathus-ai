import { fireEvent, screen, within } from '@testing-library/react'
import { renderInRouter as render } from '../../../test/router'
import { describe, expect, it } from 'vitest'
import { site } from '../../../config/site'
import SiteHeader from './SiteHeader'

describe('<SiteHeader />', () => {
  it('links the brand to the top of the home page, named for what it is and does', () => {
    render(<SiteHeader />)
    const home = screen.getByRole('link', { name: 'Aurathus AI, Home' })
    expect(home).toHaveAttribute('href', '/#top')
    // The header lockup, decorative inside the named link, sized from its viewBox.
    const img = home.querySelector('img')
    expect(img).toHaveAttribute('src', '/brand/aurathus-logo-header.svg')
    expect(img).toHaveAttribute('alt', '')
    expect(img).toHaveAttribute('width', '890')
    expect(img).toHaveAttribute('height', '200')
  })

  it('shows the section links and Request Consult inline for wide screens', () => {
    const { container } = render(<SiteHeader />)
    const header = container.querySelector('header')
    const links = [...header.querySelectorAll('nav a')].map((a) => [a.textContent, a.getAttribute('href')])
    expect(links).toEqual(site.nav.links.map((l) => [l.label, l.href]))
    expect(within(header).getByRole('link', { name: site.nav.cta.label })).toHaveAttribute('href', site.nav.cta.href)
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
      ['Contact', '/#contact'],
      [site.nav.cta.label, '/consult'],
      [site.contact.email, `mailto:${site.contact.email}`],
    ])
  })

  it('closes when a menu link is clicked or Esc is pressed', () => {
    render(<SiteHeader />)
    const button = screen.getByRole('button', { name: 'Menu' })
    fireEvent.click(button)
    const dialog = screen.getByRole('dialog', { name: 'Menu' })
    fireEvent.click(within(dialog).getByRole('link', { name: 'Services' }))
    expect(button).toHaveAttribute('aria-expanded', 'false')

    fireEvent.click(button)
    fireEvent.keyDown(window, { key: 'Escape' })
    expect(button).toHaveAttribute('aria-expanded', 'false')
  })
})
