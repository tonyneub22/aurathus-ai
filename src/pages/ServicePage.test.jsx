import { describe, expect, it } from 'vitest'
import { fireEvent, screen, waitFor, within } from '@testing-library/react'
import { Route, Routes } from 'react-router'
import { renderInRouter } from '../test/router'
import { services } from '../config/services'
import ServicePage from './ServicePage'

const renderAt = (slug) =>
  renderInRouter(
    <Routes>
      <Route path="/services/:slug" element={<ServicePage />} />
    </Routes>,
    { route: `/services/${slug}` },
  )

describe('<ServicePage />', () => {
  for (const s of services) {
    describe(s.name, () => {
      it('titles the page with the service name as its only h1', () => {
        renderAt(s.slug)
        const h1s = screen.getAllByRole('heading', { level: 1 })
        expect(h1s).toHaveLength(1)
        expect(h1s[0]).toHaveTextContent(s.name)
        expect(document.title).toBe(`${s.name} — Aurathus AI LLC`)
        expect(screen.getByText(s.startLine)).toBeInTheDocument()
        expect(screen.getByText(s.pricingNote)).toBeInTheDocument()
      })

      it('has two Request Consult links to the consult form for this service', () => {
        renderAt(s.slug)
        // Within the page body: the header menu has its own Request Consult link.
        const links = within(screen.getByRole('main')).getAllByRole('link', { name: /request consult/i })
        expect(links).toHaveLength(2)
        for (const link of links) expect(link).toHaveAttribute('href', `/consult?service=${s.slug}`)
        expect(within(screen.getByRole('main')).getAllByText('tjneubacher@gmail.com')).toHaveLength(2)
      })

      it('shows a box per tier under "Plans", and the includes band only when there is one', () => {
        renderAt(s.slug)
        expect(screen.getByRole('heading', { level: 2, name: 'Plans' })).toBeInTheDocument()
        expect(screen.getAllByTestId('tier')).toHaveLength(s.tiers.length)
        for (const t of s.tiers) expect(screen.getByRole('heading', { level: 3, name: t.name })).toBeInTheDocument()
        if (s.includes) expect(screen.getByTestId('includes')).toHaveTextContent(s.includes.body)
        else expect(screen.queryByTestId('includes')).not.toBeInTheDocument()
      })
    })
  }

  it('opens and closes the Technical details', async () => {
    const s = services[0]
    renderAt(s.slug)
    const toggle = screen.getByRole('button', { name: 'Technical details' })
    expect(toggle).toHaveAttribute('aria-expanded', 'false')
    expect(document.getElementById(toggle.getAttribute('aria-controls'))).toBeInTheDocument()
    expect(screen.queryByText(s.technical[0])).not.toBeInTheDocument()

    fireEvent.click(toggle)
    expect(toggle).toHaveAttribute('aria-expanded', 'true')
    for (const p of s.technical) expect(screen.getByText(p)).toBeInTheDocument()

    fireEvent.click(toggle)
    expect(toggle).toHaveAttribute('aria-expanded', 'false')
    await waitFor(() => expect(screen.queryByText(s.technical[0])).not.toBeInTheDocument())
  })

  it('links back to the services on the home page', () => {
    renderAt('video')
    expect(screen.getByRole('link', { name: 'Back to services' })).toHaveAttribute('href', '/#services')
  })

  it('renders the 404 for an unknown slug', () => {
    renderAt('not-a-service')
    expect(screen.getByRole('heading', { level: 1, name: 'Page not found' })).toBeInTheDocument()
  })
})
