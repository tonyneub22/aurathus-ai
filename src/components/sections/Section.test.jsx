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

  it('sets a figure in its own column, before the title and content', () => {
    render(
      <Section id="demo" title="Demo" figure={<img alt="" data-testid="fig" />}>
        <p>Body</p>
      </Section>,
    )
    const fig = screen.getByTestId('fig')
    const heading = screen.getByRole('heading', { level: 2, name: 'Demo' })
    expect(fig.compareDocumentPosition(heading) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
    expect(fig.parentElement).toHaveClass('lg:col-span-5')
  })
})
