const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])'

export function focusables(container) {
  return container ? [...container.querySelectorAll(FOCUSABLE)] : []
}

/** Keeps Tab and Shift+Tab cycling through `items`, wrapping at either end. */
export function trapTab(event, items) {
  if (items.length === 0) return
  const first = items[0]
  const last = items[items.length - 1]
  const active = document.activeElement
  const outside = !items.includes(active)

  if (event.shiftKey && (active === first || outside)) {
    event.preventDefault()
    last.focus()
  } else if (!event.shiftKey && (active === last || outside)) {
    event.preventDefault()
    first.focus()
  }
}
