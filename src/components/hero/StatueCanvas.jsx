import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from 'motion/react'
import { createStatueScene } from '../../three/statueScene'
import { clamp } from '../../three/layout'

/**
 * Full-bleed WebGL canvas for the hero. Owns DOM listeners (pointer, scroll,
 * resize) and forwards them to the framework-free scene controller.
 *
 * `heroRef` is the hero section element; scroll progress is measured against it.
 */
export default function StatueCanvas({ heroRef, modelUrl, onLoad, className = '' }) {
  const canvasRef = useRef(null)
  const reducedMotion = useReducedMotion()
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    const canvas = canvasRef.current
    const hero = heroRef?.current
    if (!canvas) return undefined

    let controller
    try {
      controller = createStatueScene(canvas, {
        modelUrl,
        reducedMotion: Boolean(reducedMotion),
        onLoad,
        onError: () => setFailed(true),
      })
    } catch (err) {
      // Hero checks supportsWebGL() before mounting this, so reaching here
      // means a driver refused the context. The canvas stays transparent.
      console.warn('Hero figure unavailable:', err)
      return undefined
    }

    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect
      controller.resize(Math.round(width), Math.round(height))
    })
    ro.observe(canvas)

    const onPointer = (e) => {
      controller.setPointer(e.clientX / window.innerWidth - 0.5, e.clientY / window.innerHeight - 0.5)
    }
    const onScroll = () => {
      if (!hero) return
      const rect = hero.getBoundingClientRect()
      controller.setScroll(clamp(-rect.top / Math.max(rect.height, 1), 0, 1))
    }

    window.addEventListener('pointermove', onPointer, { passive: true })
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()

    return () => {
      window.removeEventListener('pointermove', onPointer)
      window.removeEventListener('scroll', onScroll)
      ro.disconnect()
      controller.dispose()
    }
  }, [heroRef, modelUrl, reducedMotion, onLoad])

  if (failed) return null

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      data-testid="statue-canvas"
      className={`block h-full w-full ${className}`}
    />
  )
}
