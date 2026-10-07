import { act, fireEvent, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import useMenu from './useMenu'

/** A menu button and a panel with two links, wired to the hook's refs. */
function setup() {
  const button = document.createElement('button')
  const panel = document.createElement('div')
  panel.innerHTML = '<a href="/#a">A</a><a href="/#b">B</a>'
  document.body.append(button, panel)

  const hook = renderHook(() => useMenu())
  hook.result.current.buttonRef.current = button
  hook.result.current.panelRef.current = panel
  const [first, last] = panel.querySelectorAll('a')
  return { ...hook, button, panel, first, last }
}

describe('useMenu', () => {
  beforeEach(() => {
    document.documentElement.style.overflow = ''
  })
  afterEach(() => {
    document.body.innerHTML = ''
  })

  it('opens, closes and toggles', () => {
    const { result } = setup()
    expect(result.current.open).toBe(false)
    act(() => result.current.toggle())
    expect(result.current.open).toBe(true)
    act(() => result.current.close())
    expect(result.current.open).toBe(false)
  })

  it('closes on Escape and on a hash change', () => {
    const { result } = setup()
    act(() => result.current.toggle())
    act(() => fireEvent.keyDown(window, { key: 'Escape' }))
    expect(result.current.open).toBe(false)

    act(() => result.current.toggle())
    act(() => fireEvent(window, new HashChangeEvent('hashchange')))
    expect(result.current.open).toBe(false)
  })

  it('moves focus into the panel and back to the button on close', () => {
    const { result, button, first } = setup()
    act(() => result.current.toggle())
    expect(document.activeElement).toBe(first)
    act(() => result.current.close())
    expect(document.activeElement).toBe(button)
  })

  it('traps Tab inside the menu', () => {
    const { result, button, last } = setup()
    act(() => result.current.toggle())
    last.focus()
    fireEvent.keyDown(window, { key: 'Tab' })
    expect(document.activeElement).toBe(button)
    fireEvent.keyDown(window, { key: 'Tab', shiftKey: true })
    expect(document.activeElement).toBe(last)
  })

  it('locks page scroll while open and restores it on close and unmount', () => {
    const { result, unmount } = setup()
    const root = document.documentElement
    act(() => result.current.toggle())
    expect(root.style.overflow).toBe('hidden')
    act(() => result.current.close())
    expect(root.style.overflow).toBe('')

    act(() => result.current.toggle())
    expect(root.style.overflow).toBe('hidden')
    unmount()
    expect(root.style.overflow).toBe('')
  })
})

