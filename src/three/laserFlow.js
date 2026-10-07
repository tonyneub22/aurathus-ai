/**
 * Controller for the Laser Flow beam (shaders in laserFlowShader.js).
 *
 * Adapted from React Bits by David Haz (https://reactbits.dev/animations/laser-flow),
 * Copyright (c) 2026 David Haz, MIT + Commons Clause. The full licence notice is
 * in laserFlowShader.js and LICENSES.md and must stay with this code.
 *
 * Changes from upstream: framework-free controller instead of a React component;
 * transparent output (premultiplied alpha) instead of an opaque canvas with a
 * screen blend, so it can sit under a CSS mask; render loop stops entirely when
 * inactive; DPR capped at 1.5 with no adaptive DPR; no pointer tracking (our
 * layer takes no pointer events); the statue ring's colour by default; a `beamReach` uniform
 * so the beam stays bright up a short canvas.
 */import * as THREE from 'three'
import { RING_LIGHT } from './palette.js'
import { FRAG, VERT } from './laserFlowShader.js'

/** Prop names and defaults follow the React Bits component; `color` defaults to brand gold. */
export const LASER_DEFAULTS = {
  wispDensity: 1,
  mouseTiltStrength: 0.01,
  horizontalBeamOffset: 0.1,
  verticalBeamOffset: 0.0,
  flowSpeed: 0.35,
  verticalSizing: 2.0,
  horizontalSizing: 0.5,
  fogIntensity: 0.45,
  fogScale: 0.3,
  wispSpeed: 15.0,
  wispIntensity: 5.0,
  flowStrength: 0.25,
  decay: 1.1,
  falloffStart: 1.2,
  fogFallSpeed: 0.6,
  beamReach: 1, // ours: >1 keeps the beam bright further above the hit point
  color: RING_LIGHT, // the statue ring's rendered colour, not the raw brand gold
}

const UNIFORM_FOR = {
  wispDensity: 'uWispDensity',
  mouseTiltStrength: 'uTiltScale',
  horizontalBeamOffset: 'uBeamXFrac',
  verticalBeamOffset: 'uBeamYFrac',
  flowSpeed: 'uFlowSpeed',
  verticalSizing: 'uVLenFactor',
  horizontalSizing: 'uHLenFactor',
  fogIntensity: 'uFogIntensity',
  fogScale: 'uFogScale',
  wispSpeed: 'uWSpeed',
  wispIntensity: 'uWIntensity',
  flowStrength: 'uFlowStrength',
  decay: 'uDecay',
  falloffStart: 'uFalloffStart',
  fogFallSpeed: 'uFogFallSpeed',
  beamReach: 'uReach',
}

export const MAX_DPR = 1.5

/**
 * Mounts a canvas filling `mount` and returns a controller.
 * @param {HTMLElement} mount
 * @param { dpr?: number } [opts]
 */
export function createLaserFlow(mount, { dpr } = {}) {
  const renderer = new THREE.WebGLRenderer({
    antialias: false,
    alpha: true,
    depth: false,
    stencil: false,
    premultipliedAlpha: true,
    powerPreference: 'high-performance',
  })
  const pixelRatio = Math.min(dpr ?? (window.devicePixelRatio || 1), MAX_DPR)
  renderer.setPixelRatio(pixelRatio)
  renderer.outputColorSpace = THREE.SRGBColorSpace
  renderer.setClearColor(0x000000, 0)
  const canvas = renderer.domElement
  canvas.style.cssText = 'display:block;width:100%;height:100%'
  mount.appendChild(canvas)

  const scene = new THREE.Scene()
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)
  // One oversized triangle covers the viewport.
  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array([-1, -1, 0, 3, -1, 0, -1, 3, 0]), 3))

  const uniforms = {
    iTime: { value: 0 },
    iResolution: { value: new THREE.Vector3(1, 1, 1) },
    iMouse: { value: new THREE.Vector4(0, 0, 0, 0) },
    uFlowTime: { value: 0 },
    uFogTime: { value: 0 },
    uColor: { value: new THREE.Vector3(1, 1, 1) },
    uFade: { value: 0 },
  }
  for (const name of Object.values(UNIFORM_FOR)) uniforms[name] = { value: 0 }

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
  let active = false
  let lost = false

  function resize() {
    const w = mount.clientWidth || 1
    const h = mount.clientHeight || 1
    renderer.setSize(w, h, false)
    uniforms.iResolution.value.set(w * pixelRatio, h * pixelRatio, pixelRatio)
    if (!raf && !lost) renderer.render(scene, camera)
  }

  function frame() {
    raf = requestAnimationFrame(frame)
    // Clamp dt so a long pause doesn't make the flow jump on resume.
    const dt = Math.min(0.033, Math.max(0.001, clock.getDelta()))
    uniforms.iTime.value += dt
    uniforms.uFlowTime.value += dt
    uniforms.uFogTime.value += dt
    uniforms.uFade.value = Math.min(1, uniforms.uFade.value + dt) // 1s fade-in
    renderer.render(scene, camera)
  }

  function sync() {
    const run = active && !lost && !document.hidden
    if (run && !raf) {
      clock.getDelta() // discard time spent paused
      frame()
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
    /** Set any LASER_DEFAULTS key, plus `active` (false stops the render loop). */
    update(params) {
      const p = { ...LASER_DEFAULTS, ...params }
      for (const [key, name] of Object.entries(UNIFORM_FOR)) uniforms[name].value = p[key]
      // The shader expects sRGB components, as upstream's hex parser produced.
      const c = new THREE.Color(p.color).getRGB({ r: 0, g: 0, b: 0 }, THREE.SRGBColorSpace)
      uniforms.uColor.value.set(c.r, c.g, c.b)
      active = Boolean(params.active ?? true)
      sync()
    },
    dispose() {
      active = false
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
