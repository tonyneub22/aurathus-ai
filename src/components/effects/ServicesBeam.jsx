import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { supportsWebGL } from '../../three/webgl'
import { clamp } from '../../three/layout'
import { BEAM, beamFrame, beamStart, laserOffsets } from '../../three/beam'
import StaticBeam from './StaticBeam'

// Shares the three.js chunk with the hero; only fetched once the beam is near view.
const LaserFlow = lazy(() => import('./LaserFlow'))

/** Restrained, not neon. Tuned against the Playwright screenshots. */
const LOOK = {
  wispDensity: 0.8,
  flowSpeed: 0.22,
  verticalSizing: 2.0,
  horizontalSizing: 0.28,
  fogIntensity: 0.2,
  fogScale: 0.3,
  wispSpeed: 9,
  wispIntensity: 3,
  flowStrength: 0.2,
  decay: 1.05,
  falloffStart: 1.35,
  fogFallSpeed: 0.4,
  mouseTiltStrength: 0,
}
/** Phones and tablets: the beam sits closer to text, so less fog and fewer wisps. */
const LOOK_COMPACT = { ...LOOK, fogIntensity: 0.07, wispIntensity: 1.0, horizontalSizing: 0.2, falloffStart: 0.9 }

const INTRO_DELAY = 2.6 // seconds; after the ring has drawn itself
const MASK = `linear-gradient(to bottom, transparent var(--beam-start, 0px), #000 calc(var(--beam-start, 0px) + ${BEAM.fadeIn}px), #000 calc(100% - ${BEAM.below - 24}px), transparent)`

/** Reads the hero, its copy and the Services box, relative to the stage. */
function measure(stage) {
  const heroEl = stage.querySelector('[data-beam-hero]')
  const copyEl = stage.querySelector('[data-beam-clear]')
  const box = stage.querySelector('[data-beam-target]')
  if (!heroEl || !box) return null
  const s = stage.getBoundingClientRect()
  const h = heroEl.getBoundingClientRect()
  const b = box.getBoundingClientRect()
  return {
    heroEl,
    box,
    boxLeft: b.left - s.left,
    stageWidth: s.width,
    hero: { left: h.left - s.left, top: h.top - s.top, width: h.width, height: h.height },
    copyBottom: (copyEl ?? heroEl).getBoundingClientRect().bottom - s.top,
    boxTop: b.top - s.top,
    desktop: window.matchMedia(`(min-width: ${BEAM.desktopMinWidth}px)`).matches,
  }
}

/**
 * The gold beam from the hero ring to the Services box. Place it inside the
 * element that contains both, which must be `position: relative`. Purely
 * decorative: hidden from assistive tech and transparent to the pointer.
 */
export default function ServicesBeam() {
  const layerRef = useRef(null)
  const reduce = useReducedMotion()
  const [webgl] = useState(supportsWebGL)
  const [geo, setGeo] = useState(null)
  const [near, setNear] = useState(false)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const layer = layerRef.current
    const stage = layer?.parentElement
    if (!stage) return undefined
    let m = null
    let frame = null
    let introDone = Boolean(reduce)

    const onScroll = () => {
      if (!m) return
      const r = m.heroEl.getBoundingClientRect()
      const start = beamStart({ ...m, scroll: clamp(-r.top / Math.max(r.height, 1), 0, 1) })
      layer.style.setProperty('--beam-start', `${start.y - frame.top}px`)
      layer.style.opacity = String(start.opacity)
      m.box.style.setProperty('--beam-glow', String(introDone ? start.opacity : 0))
    }
    const remeasure = () => {
      m = measure(stage)
      if (!m) return
      frame = beamFrame(m)
      m.box.style.setProperty('--beam-x', `${frame.x - m.boxLeft}px`)
      setGeo({ frame, offsets: laserOffsets(frame, m.stageWidth), compact: !m.desktop })
      onScroll()
    }

    const ro = new ResizeObserver(remeasure)
    ro.observe(stage)
    const io = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting)
        if (entry.isIntersecting) setNear(true)
      },
      { rootMargin: '300px 0px' },
    )
    io.observe(layer)
    const intro = setTimeout(() => {
      introDone = true
      onScroll()
    }, reduce ? 0 : INTRO_DELAY * 1000)
    window.addEventListener('scroll', onScroll, { passive: true })
    remeasure()

    return () => {
      clearTimeout(intro)
      ro.disconnect()
      io.disconnect()
      window.removeEventListener('scroll', onScroll)
    }
  }, [reduce])

  const animate = webgl && !reduce

  return (
    <div
      ref={layerRef}
      aria-hidden="true"
      data-testid="services-beam"
      className="pointer-events-none absolute inset-x-0 z-[11] overflow-hidden"
      style={{ top: geo?.frame.top ?? 0, height: geo?.frame.height ?? 0, maskImage: MASK, WebkitMaskImage: MASK }}
    >
      {geo && (
        <motion.div
          className="h-full w-full"
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.6, delay: reduce ? 0 : INTRO_DELAY, ease: [0.2, 0.7, 0.2, 1] }}
        >
          {animate ? (
            near && (
              <Suspense fallback={null}>
                <LaserFlow {...(geo.compact ? LOOK_COMPACT : LOOK)} {...geo.offsets} active={inView} />
              </Suspense>
            )
          ) : (
            <StaticBeam x={geo.frame.x} hitY={geo.frame.hitY} />
          )}
        </motion.div>
      )}
    </div>
  )
}
