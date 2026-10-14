import { useLayoutEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// The site curve (--ease-aura, cubic-bezier(0.2, 0.7, 0.2, 1)) as GSAP knows it.
const EASE = 'power3.out'

const rootContains = (root, el) => root === el || root.contains(el)

/**
 * The site's one scroll-entrance grammar, set up once per page root.
 * Mark elements with `data-reveal` (rise 24px and fade in) or
 * `data-reveal="rule"` (a line drawn from the left). Elements entering
 * together stagger 80ms apart, once. Anything already on screen, and
 * everything under reduced motion, is left exactly as rendered, so content
 * is never hidden by the markup or by a script that fails to run.
 *
 * Waiting elements are only transparent, never visibility:hidden, so they
 * stay in the accessibility tree and in the tab order; one that receives
 * keyboard focus is revealed at once.
 */
export default function useReveal(rootRef, deps = []) {
  useLayoutEffect(() => {
    const root = rootRef.current
    if (!root || window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return undefined

    const ctx = gsap.context(() => {
      const below = (el) => el.getBoundingClientRect().top > window.innerHeight * 0.92
      const rise = gsap.utils.toArray(root.querySelectorAll('[data-reveal=""]')).filter(below)
      const rules = gsap.utils.toArray(root.querySelectorAll('[data-reveal="rule"]')).filter(below)

      gsap.set(rise, { opacity: 0, y: 24 })
      gsap.set(rules, { scaleX: 0, transformOrigin: '0% 50%' })

      ScrollTrigger.batch(rise, {
        start: 'top 88%',
        once: true,
        onEnter: (batch) =>
          gsap.to(batch, { opacity: 1, y: 0, duration: 1.1, ease: EASE, stagger: 0.08, clearProps: 'opacity,transform', overwrite: true }),
      })
      ScrollTrigger.batch(rules, {
        start: 'top 90%',
        once: true,
        onEnter: (batch) => gsap.to(batch, { scaleX: 1, duration: 1.4, ease: EASE, stagger: 0.12, clearProps: 'transform' }),
      })
    }, root)

    const onFocus = (event) => {
      const waiting = event.target.closest?.('[data-reveal=""]')
      if (waiting && rootContains(root, waiting)) gsap.to(waiting, { opacity: 1, y: 0, duration: 0.4, ease: EASE, clearProps: 'opacity,transform', overwrite: true })
    }
    root.addEventListener('focusin', onFocus)

    return () => {
      root.removeEventListener('focusin', onFocus)
      ctx.revert()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
}
