import { motion, useReducedMotion } from 'motion/react'
import { EASE } from '../sections/reveal'

const PLACE =
  'pointer-events-none absolute -right-[18vw] top-14 w-[56vw] opacity-25 sm:-right-[6vw] sm:w-[46vw] sm:opacity-35 [filter:drop-shadow(0_0_10px_color-mix(in_srgb,var(--color-aura-ring)_45%,transparent))] lg:right-0 lg:top-1/2 lg:w-[min(520px,42vw)] lg:-translate-y-1/2 lg:opacity-70'

/**
 * A thin gold ring that draws itself in, echoing the home halo: behind the
 * service page title by default. `className` places it elsewhere (the Why Us
 * statue); `inView` waits to draw until it scrolls into view.
 */
export default function TitleRing({ className = PLACE, inView = false }) {
  const reduce = useReducedMotion()

  return (
    <svg aria-hidden="true" viewBox="0 0 200 200" className={className}>
      <motion.circle
        cx="100"
        cy="100"
        r="98"
        fill="none"
        stroke="var(--color-aura-gold-hot)"
        strokeWidth="0.6"
        transform="rotate(-90 100 100)"
        initial={reduce ? false : { pathLength: 0 }}
        {...(inView ? { whileInView: { pathLength: 1 }, viewport: { once: true, amount: 0.4 } } : { animate: { pathLength: 1 } })}
        transition={{ duration: 2.4, delay: 0.2, ease: EASE }}
      />
    </svg>
  )
}
