import { describe, expect, it } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import AccordionGallery from './AccordionGallery'

const items = [
  { quote: 'First quote', name: 'Ada', role: 'CEO, One' },
  { quote: 'Second quote', name: 'Bo', role: 'CTO, Two' },
  { quote: 'Third quote', name: 'Cy', role: 'COO, Three' },
]

const open = () => screen.getAllByRole('button').map((b) => b.getAttribute('aria-expanded') === 'true')
const regions = () => screen.getAllByRole('region', { hidden: true })

describe('<AccordionGallery />', () => {
  it('opens the first panel by default and no other', () => {
    render(<AccordionGallery items={items} />)
    expect(open()).toEqual([true, false, false])
  })

  it('opens a panel on click and closes the previous one', () => {
    render(<AccordionGallery items={items} />)
    fireEvent.click(screen.getByRole('button', { name: /02\s*Bo/ }))
    expect(open()).toEqual([false, true, false])
  })

  it('does not react to hovering, only to a click', () => {
    render(<AccordionGallery items={items} />)
    const panel = screen.getAllByRole('button')[2].closest('li')
    for (const pointerType of ['mouse', 'touch', 'pen']) {
      fireEvent.pointerEnter(panel, { pointerType })
      fireEvent.pointerOver(panel, { pointerType })
      fireEvent.mouseEnter(panel)
      fireEvent.mouseOver(panel)
    }
    expect(open()).toEqual([true, false, false])
    fireEvent.click(screen.getAllByRole('button')[2])
    expect(open()).toEqual([false, false, true])
  })

  it('moves focus and opens with arrow keys, Home and End, stopping at the ends', () => {
    render(<AccordionGallery items={items} />)
    const buttons = screen.getAllByRole('button')
    fireEvent.keyDown(buttons[0], { key: 'ArrowRight' })
    expect(open()).toEqual([false, true, false])
    expect(buttons[1]).toHaveFocus()
    fireEvent.keyDown(buttons[1], { key: 'End' })
    expect(buttons[2]).toHaveFocus()
    fireEvent.keyDown(buttons[2], { key: 'ArrowDown' }) // already last
    expect(open()).toEqual([false, false, true])
    fireEvent.keyDown(buttons[2], { key: 'Home' })
    expect(open()).toEqual([true, false, false])
    fireEvent.keyDown(buttons[0], { key: 'ArrowUp' }) // already first
    expect(open()).toEqual([true, false, false])
  })

  it('labels each region by its button and hides collapsed ones from assistive tech', () => {
    render(<AccordionGallery items={items} />)
    const buttons = screen.getAllByRole('button')
    regions().forEach((region, i) => {
      expect(region).toHaveAttribute('aria-labelledby', buttons[i].id)
      expect(buttons[i]).toHaveAttribute('aria-controls', region.id)
    })
    expect(regions().map((r) => r.hasAttribute('inert'))).toEqual([false, true, true])
    fireEvent.click(buttons[2])
    expect(regions().map((r) => r.hasAttribute('inert'))).toEqual([true, true, false])
  })

  it('shows the quote, name and role', () => {
    render(<AccordionGallery items={items} />)
    expect(screen.getByText('First quote')).toBeInTheDocument()
    expect(screen.getByText(/CEO, One/)).toBeInTheDocument()
  })

  it('uses an optional image, with alt text only while its panel is open', () => {
    const withImage = [{ ...items[0], image: '/a.jpg', imageAlt: 'Ada at work' }, { ...items[1], image: '/b.jpg', imageAlt: 'Bo' }]
    render(<AccordionGallery items={withImage} />)
    expect(screen.getByAltText('Ada at work')).toHaveAttribute('src', '/a.jpg')
    expect(screen.queryByAltText('Bo')).not.toBeInTheDocument()
  })
})
