import { getLenis } from './smoothScroll'

/**
 * Scrolls to the element named by a URL hash, if it exists. With smooth scroll
 * running, Lenis glides there ('auto'), clearing the header by the target's
 * own scroll-margin-top. Jumps, and everything without Lenis (reduced
 * motion), are native.
 */
export function scrollToHash(hash = window.location.hash, behavior = 'instant') {
  const id = decodeURIComponent(hash.replace(/^#/, ''))
  const target = id && document.getElementById(id)
  if (!target) return false
  const lenis = getLenis()
  if (lenis && behavior !== 'instant') {
    // Re-measure first: the page may have grown since Lenis last looked.
    lenis.resize()
    const margin = parseFloat(getComputedStyle(target).scrollMarginTop) || 0
    lenis.scrollTo(target, { offset: -margin, duration: 1.4 })
  } else {
    // Jumps (arriving from another page) go native: Lenis follows the native
    // scroll, and its size for a page that just mounted may still be the old one.
    target.scrollIntoView({ behavior: lenis ? 'instant' : behavior, block: 'start' })
  }
  return true
}
