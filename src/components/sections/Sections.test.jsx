import { describe, expect, it, vi } from 'vitest'
import { screen } from '@testing-library/react'
import { renderInRouter as render } from '../../test/router'
import Home from '../../pages/Home'
import Testimonials from './Testimonials'
import WhyChooseUs from './WhyChooseUs'
import About from './About'
import { site } from '../../config/site'

// The hero and the two WebGL effects can't run in jsdom; the page structure still can.
vi.mock('../hero/Hero', () => ({ default: () => <section id="top"><h1>Hero</h1></section> }))
vi.mock('../effects/ServicesBeam', () => ({ default: () => null }))
vi.mock('../effects/GhostFibersBackground', () => ({ default: () => <div data-testid="ghost-fibers" /> }))

describe('home page sections', () => {
  it('run in order: Services, Why Choose Us?, About', () => {
    render(<Home />)
    const titles = screen.getAllByRole('heading', { level: 2 }).map((h) => h.textContent)
    expect(titles).toEqual(['Services', 'Why Choose Us?', 'About'])
  })

  it('leave out the placeholder testimonials, and their menu link, while they are switched off', () => {
    expect(site.testimonials.enabled).toBe(false)
    const { container } = render(<Home />)
    expect(container.querySelector('#testimonials')).not.toBeInTheDocument()
    expect(site.nav.links.map((l) => l.href)).not.toContain('/#testimonials')
  })

  it('box only About: the rest sit on the page itself', () => {
    const { container } = render(<Home />)
    const boxes = [...container.querySelectorAll('.matte-panel')]
    expect(boxes).toHaveLength(1)
    expect(boxes[0].closest('section')).toHaveAttribute('id', 'about')
  })

  it('makes each section a labelled region with a matching anchor', () => {
    const { container } = render(<Home />)
    for (const [id, name] of [
      ['services', 'Services'],
      ['why-us', 'Why Choose Us?'],
      ['about', 'About'],
    ]) {
      expect(screen.getByRole('region', { name })).toHaveAttribute('id', id)
      expect(container.querySelector(`#${id}`)).toBeInTheDocument()
    }
  })

  it('aims the laser beam at the Services index only', () => {
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
  it('carries no decorative section numbers', () => {
    const { container } = render(<WhyChooseUs />)
    expect(container.querySelectorAll('li > span[aria-hidden="true"]')).toHaveLength(0)
    expect(container.textContent).not.toMatch(/\b0?[1-4]\b/)
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
