/**
 * Scrolls to the element named by a URL hash, if it exists. The browser's own
 * fragment scroll runs before React has rendered, so links like /#services
 * from another page need this once the page mounts.
 */
export function scrollToHash(hash = window.location.hash) {
  const id = decodeURIComponent(hash.replace(/^#/, ''))
  const target = id && document.getElementById(id)
  if (!target) return false
  target.scrollIntoView({ behavior: 'instant', block: 'start' })
  return true
}
