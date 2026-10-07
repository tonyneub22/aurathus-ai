import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import Home from '../../pages/Home'
import Testimonials from './Testimonials'
import WhyChooseUs from './WhyChooseUs'
import About from './About'
import { site } from '../../config/site'

// The hero and the two WebGL effects can't run in jsdom; the page structure still can.
vi.mock('../hero/Hero', () => ({ default: () => <section id="top"><h1>Hero</h1></section> }))
vi.mock('../effects/ServicesBeam', () => ({ default: () => null }))
vi.mock('../effects/GhostFibersBackground', () => ({ default: () => <div data-testid="ghost-fibers" /> }))

describe('home page boxes', () => {
  it('stack in order: Services, Why Choose Us?, Client Testimonials, About', () => {
    render(<Home />)
    const titles = screen.getAllByRole('heading', { level: 2 }).map((h) => h.textContent)
    expect(titles).toEqual(['Services', 'Why Choose Us?', 'Client Testimonials', 'About'])
  })

  it('makes each box a labelled region with a matching anchor', () => {
    const { container } = render(<Home />)
    for (const [id, name] of [
      ['services', 'Services'],
      ['why-us', 'Why Choose Us?'],
      ['testimonials', 'Client Testimonials'],
      ['about', 'About'],
    ]) {
      expect(screen.getByRole('region', { name })).toHaveAttribute('id', id)
      expect(container.querySelector(`#${id}`)).toBeInTheDocument()
    }
  })

  it('aims the laser beam at the Services box only', () => {
    const { container } = render(<Home />)
    const targets = container.querySelectorAll('[data-beam-target]')
    expect(targets).toHaveLength(1)
    expect(targets[0].closest('section')).toHaveAttribute('id', 'services')
  })

  it('gives every menu link a target on the home page', () => {
    const { container } = render(<Home />)
    for (const { href } of [site.nav.home, ...site.nav.links]) {
      expect(href).toMatch(/^\/#[a-z-]+$/)
      expect(container.querySelector(href.slice(1))).toBeInTheDocument()
    }
  })
})

describe('<Testimonials />', () => {
  it('shows the accordion with every testimonial from config', () => {
    render(<Testimonials />)
    expect(screen.getAllByRole('button')).toHaveLength(site.testimonials.items.length)
  })
})

describe('<WhyChooseUs />', () => {
  it('numbers the reasons 1 to 4, without a leading zero', () => {
    const { container } = render(<WhyChooseUs />)
    const numerals = [...container.querySelectorAll('li > span[aria-hidden="true"]')].map((n) => n.textContent)
    expect(numerals).toEqual(['1', '2', '3', '4'])
  })

  it('lists every reason from config under its own heading', () => {
    render(<WhyChooseUs />)
    for (const item of site.whyUs.items) {
      expect(screen.getByRole('heading', { level: 3, name: item.title })).toBeInTheDocument()
      expect(screen.getByText(item.body)).toBeInTheDocument()
    }
  })
})

describe('<About />', () => {
  it('shows the copy over a decorative fibers background, with a link to request a consult', () => {
    render(<About />)
    for (const text of site.about.paragraphs) expect(screen.getByText(text)).toBeInTheDocument()
    expect(screen.getByTestId('ghost-fibers')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: new RegExp(site.hero.cta.label) })).toHaveAttribute('href', site.hero.cta.href)
  })
})
