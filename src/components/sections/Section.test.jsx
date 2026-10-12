import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import Section from './Section'

describe('<Section />', () => {
  it('is a region labelled by its heading, with no box around it', () => {
    const { container } = render(
      <Section id="demo" title="Demo">
        <p>Body</p>
      </Section>,
    )
    const region = screen.getByRole('region', { name: 'Demo' })
    expect(region).toHaveAttribute('id', 'demo')
    expect(container.querySelector('.matte-panel')).not.toBeInTheDocument()
  })

  it('can set the title in a column beside the content', () => {
    render(
      <Section id="demo" title="Demo" aside>
        <p>Body</p>
      </Section>,
    )
    expect(screen.getByRole('heading', { level: 2, name: 'Demo' }).parentElement).toHaveClass('lg:col-span-4')
  })
})
