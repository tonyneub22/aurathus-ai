import { useEffect, useState } from 'react'

/**
 * Header state from the scroll: `scrolled` past the top band (show the matte
 * bar) and `hidden` while scrolling down (tuck the bar away), back as soon as
 * the reader scrolls up. Small moves are ignored so it never flickers.
 */
export default function useHeaderState(threshold = 80) {
  const [state, setState] = useState(() => ({ scrolled: window.scrollY > threshold, hidden: false }))

  useEffect(() => {
    let last = window.scrollY
    const update = () => {
      const y = window.scrollY
      const delta = y - last
      if (Math.abs(delta) < 6 && y > threshold) return
      last = y
      setState((s) => {
        const next = { scrolled: y > threshold, hidden: y > threshold * 2 && delta > 0 }
        return next.scrolled === s.scrolled && next.hidden === s.hidden ? s : next
      })
    }
    window.addEventListener('scroll', update, { passive: true })
    return () => window.removeEventListener('scroll', update)
  }, [threshold])

  return state
}
