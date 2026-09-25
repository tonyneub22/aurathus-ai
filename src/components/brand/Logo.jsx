import { motion, useReducedMotion } from 'motion/react'
import { site } from '../../config/site'

/**
 * Brand wordmark with an optional slow-breathing gold glow behind it.
 * `glow` can be turned off for contexts where a static mark is wanted
 * (e.g. a future header/nav during the full revamp).
 */
export default function Logo({ glow = true, className = '' }) {
  const reduceMotion = useReducedMotion()

  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      {glow && (
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-[58%] -z-10 h-[140%] w-[85%] -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            background:
              'radial-gradient(closest-side, color-mix(in srgb, var(--color-podo-gold) 55%, transparent) 0%, color-mix(in srgb, var(--color-podo-gold) 18%, transparent) 45%, transparent 75%)',
            filter: 'blur(28px)',
          }}
          initial={{ opacity: 0.45, scale: 1 }}
          animate={
            reduceMotion
              ? { opacity: 0.45, scale: 1 }
              : { opacity: [0.35, 0.6, 0.35], scale: [0.96, 1.04, 0.96] }
          }
          transition={
            reduceMotion
              ? { duration: 0 }
              : { duration: 4, repeat: Infinity, ease: 'easeInOut' }
          }
        />
      )}
      <img
        src={site.brand.logo}
        alt={site.brand.logoAlt}
        className="relative w-full max-w-[420px] select-none"
        draggable={false}
      />
    </div>
  )
}
