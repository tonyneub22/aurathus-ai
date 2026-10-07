import { useEffect, useRef } from 'react'
import { createGhostFibers } from '../../three/ghostFibers'

/**
 * React wrapper for the Ghost Fibers controller (src/three/ghostFibers.js,
 * adapted from React Bits, MIT + Commons Clause; see LICENSES.md). Props are
 * React Bits' names (lineColor, glowColor, speed, brightness, …) plus `active`
 * (false stops the loop) and `still` (draw one frame, never animate). Fills its parent.
 */
export default function GhostFibers({ dpr, className = '', ...params }) {
  const mountRef = useRef(null)
  const controllerRef = useRef(null)

  useEffect(() => {
    let controller
    try {
      controller = createGhostFibers(mountRef.current, { dpr })
    } catch (err) {
      console.warn('Ghost fibers unavailable:', err)
      return undefined
    }
    controllerRef.current = controller
    return () => {
      controller.dispose()
      controllerRef.current = null
    }
  }, [dpr])

  // Uniform writes are cheap, so push every prop on every render.
  useEffect(() => {
    controllerRef.current?.update(params)
  })

  return <div ref={mountRef} className={`h-full w-full ${className}`} />
}
