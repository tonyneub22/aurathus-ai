import { motion, useReducedMotion } from 'motion/react'

/**
 * Small motion glyph: a thin gold ring with a slowly rotating arc, echoing
 * the ring around the Aurathus mark. Used as a quiet loading indicator.
 */
export default function BuildingIndicator({ size = 40, label = 'Loading', className = '' }) {
  const reduceMotion = useReducedMotion()

  return (
    <div
      className={`relative ${className}`}
      style={{ width: size, height: size }}
      role="img"
      aria-label={label}
    >
      <svg viewBox="0 0 40 40" width={size} height={size} className="absolute inset-0">
        <circle
          cx="20"
          cy="20"
          r="17.5"
          fill="none"
          stroke="var(--color-aura-gold)"
          strokeOpacity="0.25"
          strokeWidth="1"
        />
      </svg>

      <motion.svg
        viewBox="0 0 40 40"
        width={size}
        height={size}
        className="absolute inset-0"
        animate={reduceMotion ? { rotate: 0 } : { rotate: 360 }}
        transition={reduceMotion ? { duration: 0 } : { duration: 5, repeat: Infinity, ease: 'linear' }}
      >
        <circle
          cx="20"
          cy="20"
          r="17.5"
          fill="none"
          stroke="var(--color-aura-gold)"
          strokeWidth="1.25"
          strokeLinecap="round"
          strokeDasharray="16 94"
        />
      </motion.svg>
    </div>
  )
}
