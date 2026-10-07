import * as THREE from 'three'
import { GOLD, GOLD_SOFT, SURFACE } from './palette.js'
import { FRAG, VERT } from './ghostFibersShader.js'

/**
 * Controller for the Ghost Fibers background (shaders in ghostFibersShader.js).
 *
 * Adapted from React Bits by David Haz (https://reactbits.dev/c/backgrounds/ghost-fibers),
 * Copyright (c) 2026 David Haz, MIT + Commons Clause. The full licence notice is in
 * ghostFibersShader.js and LICENSES.md and must stay with this code.
 *
 * Changes from upstream: three.js instead of `ogl` (no new dependency); gold palette
 * by default, with the blue boost off; a surface-colour backdrop; DPR capped at 1;
 * a 30 fps default; and a still mode that draws one frame and never loops.
 */

/** Names follow the React Bits component. Defaults here are our tuned, restrained look. */
export const FIBER_DEFAULTS = {
  lineColor: GOLD_SOFT,
  glowColor: GOLD,
  backdrop: SURFACE, // the box surface, so the canvas blends into it
  speed: 0.2,
  scale: 2,
  rotation: 0,
  rotationSpeed: 0.25,
  layers: 4,
  waveAmplitude: 0.015,
  waveFrequency: 3,
  waveSpeed: 0.15,
  layerSpeed: 0.08,
  twist: 0.1,
  twistFrequency: 5,
  twistSpeed: 1.2,
  lineFrequency: 5,
  lineSpacing: 2,
  lineSharpness: 16,
  glowFalloff: 10,
  glowIntensity: 1.6,
  brightness: 2,
  blueBoost: 1, // upstream 1.25 pushes blue, which would wash gold toward white
  vignette: 0.8,
  grain: 0.05,
  lightMode: false,
  fps: 30,
}

const COLOR_UNIFORMS = { lineColor: 'uLineColor', glowColor: 'uGlowColor', backdrop: 'uBackdrop' }
const NUMBER_UNIFORMS = {
  speed: 'uSpeed',
  scale: 'uScale',
  rotation: 'uRotation',
  rotationSpeed: 'uRotationSpeed',
  layers: 'uLayers',
  waveAmplitude: 'uWaveAmplitude',
  waveFrequency: 'uWaveFrequency',
  waveSpeed: 'uWaveSpeed',
  layerSpeed: 'uLayerSpeed',
  twist: 'uTwist',
  twistFrequency: 'uTwistFrequency',
  twistSpeed: 'uTwistSpeed',
  lineFrequency: 'uLineFrequency',
  lineSpacing: 'uLineSpacing',
  lineSharpness: 'uLineSharpness',
  glowFalloff: 'uGlowFalloff',
  glowIntensity: 'uGlowIntensity',
  brightness: 'uBrightness',
  blueBoost: 'uBlueBoost',
  vignette: 'uVignette',
  grain: 'uGrain',
}

// Soft, blurry threads gain nothing from extra pixels, and this shader is per-pixel heavy.
export const MAX_DPR = 1
export const STILL_TIME = 12 // seconds into the animation; a well-developed frame for the still version

/**
 * Mounts a canvas filling `mount` and returns a controller.
 * @param {HTMLElement} mount
 * @param {{ dpr?: number }} [opts]
 */
export function createGhostFibers(mount, { dpr } = {}) {
  const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: false, depth: false, stencil: false })
  const pixelRatio = Math.min(dpr ?? (window.devicePixelRatio || 1), MAX_DPR)
  renderer.setPixelRatio(pixelRatio)
  const canvas = renderer.domElement
  canvas.style.cssText = 'display:block;width:100%;height:100%'
  canvas.setAttribute('aria-hidden', 'true')
  mount.appendChild(canvas)

  const scene = new THREE.Scene()
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)
  // One oversized triangle covers the viewport.
  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array([-1, -1, 0, 3, -1, 0, -1, 3, 0]), 3))

  const uniforms = {
    uResolution: { value: new THREE.Vector2(1, 1) },
    uTime: { value: 0 },
    uLightMode: { value: 0 },
  }
  for (const name of Object.values(NUMBER_UNIFORMS)) uniforms[name] = { value: 0 }
  for (const name of Object.values(COLOR_UNIFORMS)) uniforms[name] = { value: new THREE.Vector3() }

  const material = new THREE.RawShaderMaterial({
    vertexShader: VERT,
    fragmentShader: FRAG,
    uniforms,
    depthTest: false,
    depthWrite: false,
  })
  const mesh = new THREE.Mesh(geometry, material)
  mesh.frustumCulled = false
  scene.add(mesh)

  const clock = new THREE.Clock()
  let raf = 0
  let wantRun = false // animate and visible
  let still = false
  let lost = false
  let elapsed = 0
  let lastDraw = 0
  let frameMs = 1000 / FIBER_DEFAULTS.fps

  const draw = () => renderer.render(scene, camera)

  function resize() {
    const w = Math.max(1, Math.floor(mount.clientWidth))
    const h = Math.max(1, Math.floor(mount.clientHeight))
    renderer.setSize(w, h, false)
    uniforms.uResolution.value.set(w * pixelRatio, h * pixelRatio)
    if (!raf && !lost) {
      if (still) uniforms.uTime.value = STILL_TIME
      draw()
    }
  }

  function frame(now) {
    raf = requestAnimationFrame(frame)
    // Clamp dt so a long pause doesn't make the fibers jump on resume.
    elapsed += Math.min(0.1, clock.getDelta())
    if (now - lastDraw < frameMs - 0.5) return
    lastDraw = now
    uniforms.uTime.value = elapsed
    draw()
  }

  function sync() {
    const run = wantRun && !still && !lost && !document.hidden
    if (run && !raf) {
      clock.getDelta() // discard time spent paused
      raf = requestAnimationFrame(frame)
    } else if (!run && raf) {
      cancelAnimationFrame(raf)
      raf = 0
    }
  }

  const ro = new ResizeObserver(resize)
  ro.observe(mount)
  const onLost = (e) => {
    e.preventDefault()
    lost = true
    sync()
  }
  const onRestored = () => {
    lost = false
    resize()
    sync()
  }
  canvas.addEventListener('webglcontextlost', onLost)
  canvas.addEventListener('webglcontextrestored', onRestored)
  document.addEventListener('visibilitychange', sync)

  resize()

  return {
    /** Set any FIBER_DEFAULTS key, plus `active` (false stops the loop) and `still` (one frame, no loop). */
    update(params) {
      const p = { ...FIBER_DEFAULTS, ...params }
      for (const [key, name] of Object.entries(NUMBER_UNIFORMS)) uniforms[name].value = p[key]
      uniforms.uLayers.value = Math.min(10, Math.max(1, Math.round(p.layers)))
      for (const [key, name] of Object.entries(COLOR_UNIFORMS)) {
        // The shader works in sRGB components, as upstream's hex parser produced.
        const c = new THREE.Color(p[key]).getRGB({ r: 0, g: 0, b: 0 }, THREE.SRGBColorSpace)
        uniforms[name].value.set(c.r, c.g, c.b)
      }
      uniforms.uLightMode.value = p.lightMode ? 1 : 0
      frameMs = 1000 / Math.min(120, Math.max(1, p.fps))
      wantRun = Boolean(params.active ?? true)
      still = Boolean(params.still)
      if (still && !lost) {
        uniforms.uTime.value = STILL_TIME
        draw()
      }
      sync()
    },
    dispose() {
      wantRun = false
      sync()
      ro.disconnect()
      canvas.removeEventListener('webglcontextlost', onLost)
      canvas.removeEventListener('webglcontextrestored', onRestored)
      document.removeEventListener('visibilitychange', sync)
      geometry.dispose()
      material.dispose()
      renderer.dispose()
      renderer.forceContextLoss()
      canvas.remove()
    },
  }
}
