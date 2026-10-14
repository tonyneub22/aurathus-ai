import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { prefersReducedMotion } from './motionPreference'

gsap.registerPlugin(ScrollTrigger)

let lenis = null

/**
 * One Lenis instance for the whole site, ticked by GSAP so ScrollTrigger and
 * the smooth scroll share a frame. Never started under reduced motion: the
 * page then scrolls natively. Returns a stop function.
 */
export function startSmoothScroll() {
  if (lenis || prefersReducedMotion()) return () => {}
  lenis = new Lenis({ lerp: 0.09, smoothWheel: true })
  lenis.on('scroll', ScrollTrigger.update)
  const tick = (time) => lenis?.raf(time * 1000)
  gsap.ticker.add(tick)
  gsap.ticker.lagSmoothing(0)
  return () => {
    gsap.ticker.remove(tick)
    lenis?.destroy()
    lenis = null
  }
}

/** The running instance, or null (reduced motion, tests, before start). */
export const getLenis = () => lenis
