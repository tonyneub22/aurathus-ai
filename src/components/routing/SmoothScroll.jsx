import { useEffect } from 'react'
import { startSmoothScroll } from '../../lib/smoothScroll'

/** Starts the site-wide smooth scroll (off under reduced motion). Renders nothing. */
export default function SmoothScroll() {
  useEffect(() => startSmoothScroll(), [])
  return null
}
