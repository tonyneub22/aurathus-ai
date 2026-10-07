import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { useReducedMotion } from 'motion/react'
import { supportsWebGL } from '../../three/webgl'

// Shares the three.js chunk with the hero; only fetched once the box is near view.
const GhostFibers = lazy(() => import('./GhostFibers'))

/** Restrained: slower and dimmer than upstream so text over it stays easy to read. Tuned against screenshots. */
const LOOK = {
  speed: 0.14,
  brightness: 1.15,
  glowIntensity: 1.2,
  vignette: 0.9,
  grain: 0.035,
}

/** The still version: used for reduced motion, no WebGL, and until the real one loads. */
function StaticFibers() {
  return (
    <div
      data-testid="fibers-static"
      className="absolute inset-0"
      style={{
        background:
          'radial-gradient(ellipse 60% 70% at 70% 30%, color-mix(in srgb, var(--color-aura-gold) 14%, transparent), transparent 70%), repeating-linear-gradient(115deg, transparent 0 22px, color-mix(in srgb, var(--color-aura-gold-soft) 7%, transparent) 22px 23px)',
      }}
    />
  )
}

/**
 * Fills its (positioned) parent with drifting gold fibers. Purely decorative:
 * hidden from assistive tech and transparent to the pointer. The WebGL canvas
 * is only created within 300px of the viewport and stops drawing off screen.
 */
export default function GhostFibersBackground() {
  const rootRef = useRef(null)
  const reduce = useReducedMotion()
  const [webgl] = useState(supportsWebGL)
  const [near, setNear] = useState(false)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const io = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting)
        if (entry.isIntersecting) setNear(true)
      },
      { rootMargin: '300px 0px' },
    )
    io.observe(rootRef.current)
    return () => io.disconnect()
  }, [])

  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      data-testid="ghost-fibers"
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      {webgl && near ? (
        <Suspense fallback={<StaticFibers />}>
          <GhostFibers {...LOOK} active={inView} still={Boolean(reduce)} />
        </Suspense>
      ) : (
        <StaticFibers />
      )}
    </div>
  )
}
