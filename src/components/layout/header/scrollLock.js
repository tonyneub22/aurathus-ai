/**
 * Stops the page scrolling behind an open overlay. Pads by the scrollbar's
 * width so the layout doesn't jump. Returns a function that restores it.
 */
export function lockScroll(root = document.documentElement) {
  const previous = { overflow: root.style.overflow, paddingRight: root.style.paddingRight }
  const scrollbar = window.innerWidth - root.clientWidth
  root.style.overflow = 'hidden'
  if (scrollbar > 0) root.style.paddingRight = `${scrollbar}px`

  return () => {
    root.style.overflow = previous.overflow
    root.style.paddingRight = previous.paddingRight
  }
}
