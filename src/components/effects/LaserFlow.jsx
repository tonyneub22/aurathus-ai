import { useEffect, useRef } from 'react'
import { createLaserFlow } from '../../three/laserFlow'

/**
 * React wrapper for the Laser Flow controller (src/three/laserFlow.js, adapted
 * from React Bits, MIT + Commons Clause; see LICENSES.md). Props are React Bits'
 * names (color, horizontalBeamOffset, flowSpeed, fogIntensity, …) plus `active`,
 * which stops the render loop. Fills its parent.
 */
export default function LaserFlow({ dpr, className = '', ...params }) {
  const mountRef = useRef(null)
  const controllerRef = useRef(null)

  useEffect(() => {
    let controller
    try {
      controller = createLaserFlow(mountRef.current, { dpr })
    } catch (err) {
      console.warn('Laser beam unavailable:', err)
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
