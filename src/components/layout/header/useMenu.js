import { useCallback, useEffect, useRef, useState } from 'react'
import { focusables, trapTab } from './focusTrap'
import { lockScroll } from './scrollLock'

/**
 * State and behaviour for the slide-in menu: Esc and hash changes close it,
 * focus moves into the panel and is trapped there (the menu button stays in
 * the cycle as the close control), and returns to the button on close.
 * The page behind doesn't scroll while it is open. Pass the router location
 * key as `routeKey`: the menu is open only at the location it was opened at,
 * so any navigation (even same-page, which fires no hashchange) closes it.
 */
export default function useMenu(routeKey = null) {
  const [openAt, setOpenAt] = useState(undefined)
  const open = openAt === routeKey
  const buttonRef = useRef(null)
  const panelRef = useRef(null)
  const wasOpen = useRef(false)

  const close = useCallback(() => setOpenAt(undefined), [])
  const toggle = useCallback(() => setOpenAt((at) => (at === routeKey ? undefined : routeKey)), [routeKey])

  useEffect(() => {
    if (!open) return undefined
    const onKeyDown = (event) => {
      if (event.key === 'Escape') close()
      else if (event.key === 'Tab') trapTab(event, [buttonRef.current, ...focusables(panelRef.current)].filter(Boolean))
    }
    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('hashchange', close)
    const unlock = lockScroll()
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('hashchange', close)
      unlock()
    }
  }, [open, close])

  useEffect(() => {
    if (open) focusables(panelRef.current)[0]?.focus()
    else if (wasOpen.current) buttonRef.current?.focus({ preventScroll: true })
    wasOpen.current = open
  }, [open])

  return { open, toggle, close, buttonRef, panelRef }
}
