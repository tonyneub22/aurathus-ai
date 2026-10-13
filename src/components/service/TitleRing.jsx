import { motion, useReducedMotion } from 'motion/react'
import { EASE } from '../sections/reveal'

/** A thin gold ring that draws itself in behind the page title, echoing the home halo. */
export default function TitleRing() {
  const reduce = useReducedMotion()

  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 200 200"
      className="pointer-events-none absolute -right-[18vw] top-14 w-[56vw] opacity-25 sm:-right-[6vw] sm:w-[46vw] sm:opacity-35 [filter:drop-shadow(0_0_10px_color-mix(in_srgb,var(--color-aura-ring)_45%,transparent))] lg:right-0 lg:top-1/2 lg:w-[min(520px,42vw)] lg:-translate-y-1/2 lg:opacity-70"
    >
      <motion.circle
        cx="100"
        cy="100"
        r="98"
        fill="none"
        stroke="var(--color-aura-gold-hot)"
        strokeWidth="0.6"
        transform="rotate(-90 100 100)"
        initial={reduce ? false : { pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 2.4, delay: 0.2, ease: EASE }}
      />
    </svg>
  )
}
