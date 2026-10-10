/**
 * Scrolls to the element named by a URL hash, if it exists. `auto` follows the
 * page's CSS scroll-behavior (smooth, or instant under reduced motion).
 */
export function scrollToHash(hash = window.location.hash, behavior = 'instant') {
  const id = decodeURIComponent(hash.replace(/^#/, ''))
  const target = id && document.getElementById(id)
  if (!target) return false
  target.scrollIntoView({ behavior, block: 'start' })
  return true
}
