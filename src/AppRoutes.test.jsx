import { describe, expect, it, vi } from 'vitest'
import { screen } from '@testing-library/react'
import { renderInRouter } from './test/router'
import { AppRoutes } from './App'

vi.mock('./components/hero/Hero', () => ({ default: () => <section id="top"><h1>Hero</h1></section> }))
vi.mock('./components/effects/ServicesBeam', () => ({ default: () => null }))
vi.mock('./components/effects/GhostFibersBackground', () => ({ default: () => null }))

describe('routes', () => {
  it('renders the styled 404 for an unknown path', () => {
    renderInRouter(<AppRoutes />, { route: '/nowhere' })
    expect(screen.getByRole('heading', { level: 1, name: 'Page not found' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Back to home' })).toHaveAttribute('href', '/')
    expect(document.title).toBe('Page not found — Aurathus AI LLC')
  })

  it('lazy-loads a service page', async () => {
    renderInRouter(<AppRoutes />, { route: '/services/video' })
    expect(await screen.findByRole('heading', { level: 1, name: 'Video Services' })).toBeInTheDocument()
  })

  it('shows the statue credit on home only', async () => {
    const home = renderInRouter(<AppRoutes />, { route: '/' })
    expect(screen.getByTestId('statue-credit')).toBeInTheDocument()
    home.unmount()
    renderInRouter(<AppRoutes />, { route: '/services/video' })
    await screen.findByRole('heading', { level: 1, name: 'Video Services' })
    expect(screen.queryByTestId('statue-credit')).not.toBeInTheDocument()
  })

  it('preselects the service on the consult form', () => {
    renderInRouter(<AppRoutes />, { route: '/consult?service=video' })
    expect(screen.getByLabelText('What do you need?')).toHaveValue('Video')
  })
})
