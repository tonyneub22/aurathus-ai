import * as THREE from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { CAMERA_FOV, FIGURE, RING, damp, layoutForAspect, pointerPose, scrollPose } from './layout.js'
import { GOLD as GOLD_HEX, GOLD_HOT as GOLD_HOT_HEX, STONE as STONE_HEX } from './palette.js'
import { paintMarbleDisc } from './marbleTexture.js'

/**
 * The hero scene: a classical head lit by a single warm rim light, floating
 * in front of a dark marble disc whose gold ring draws itself on load, with
 * gold dust drifting through the air.
 *
 * Framework-free on purpose. React (StatueCanvas.jsx) owns the DOM and
 * listeners and talks to this through the returned controller.
 */

const GOLD = new THREE.Color(GOLD_HEX)
const GOLD_HOT = new THREE.Color(GOLD_HOT_HEX)
const STONE = new THREE.Color(STONE_HEX)

const RING_VERT = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const RING_FRAG = /* glsl */ `
  precision highp float;
  uniform float uProgress;   // 0..1, how much of the ring has been drawn
  uniform float uOpacity;
  uniform float uInner;      // inner radius / outer radius
  uniform float uLine;       // where the crisp line sits across the band
  uniform vec3 uColor;
  uniform vec3 uHot;
  varying vec2 vUv;
  const float PI = 3.141592653589793;

  void main() {
    vec2 d = vUv - 0.5;
    float len = length(d) * 2.0;                 // 0 at centre, 1 at outer edge
    float t = (len - uInner) / (1.0 - uInner);   // 0..1 across the ring band
    if (t < 0.0 || t > 1.0) discard;

    // Angle from the top, clockwise, 0..1.
    float ang = atan(d.y, d.x);
    float a = mod(-(ang - PI * 0.5), PI * 2.0) / (PI * 2.0);
    float drawn = 1.0 - smoothstep(uProgress - 0.02, uProgress + 0.004, a);

    // Crisp line near the inner third of the band, glow fading outward.
    float line = exp(-pow((t - uLine) / 0.045, 2.0));
    float glow = exp(-pow((t - uLine) / 0.42, 2.0)) * 0.42;
    float alpha = (line + glow) * drawn * uOpacity;
    vec3 col = mix(uColor, uHot, line);
    gl_FragColor = vec4(col * alpha, alpha);
  }
`

function makeSoftDotTexture() {
  const c = document.createElement('canvas')
  c.width = c.height = 64
  const g = c.getContext('2d')
  const grad = g.createRadialGradient(32, 32, 0, 32, 32, 32)
  grad.addColorStop(0, 'rgba(255,255,255,1)')
  grad.addColorStop(0.35, 'rgba(255,255,255,0.55)')
  grad.addColorStop(1, 'rgba(255,255,255,0)')
  g.fillStyle = grad
  g.fillRect(0, 0, 64, 64)
  const tex = new THREE.CanvasTexture(c)
  tex.colorSpace = THREE.SRGBColorSpace
  return tex
}

function makeDust(count) {
  const positions = new Float32Array(count * 3)
  const speeds = new Float32Array(count)
  const phases = new Float32Array(count)
  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 9
    positions[i * 3 + 1] = (Math.random() - 0.5) * 6
    positions[i * 3 + 2] = (Math.random() - 0.5) * 4 - 0.5
    speeds[i] = 0.08 + Math.random() * 0.22
    phases[i] = Math.random() * Math.PI * 2
  }
  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  const mat = new THREE.PointsMaterial({
    map: makeSoftDotTexture(),
    color: GOLD_HOT,
    size: 0.045,
    sizeAttenuation: true,
    transparent: true,
    opacity: 0.55,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  })
  const points = new THREE.Points(geo, mat)
  points.userData = { speeds, phases }
  return points
}

function makeHalo() {
  const group = new THREE.Group()

  const discTex = new THREE.CanvasTexture(paintMarbleDisc({ size: 1024 }))
  discTex.colorSpace = THREE.SRGBColorSpace
  discTex.anisotropy = 4
  const disc = new THREE.Mesh(
    new THREE.CircleGeometry(FIGURE.haloRadius * 0.985, 96),
    new THREE.MeshBasicMaterial({ map: discTex, transparent: true, opacity: 0 }),
  )
  group.add(disc)

  const ringMat = new THREE.ShaderMaterial({
    vertexShader: RING_VERT,
    fragmentShader: RING_FRAG,
    uniforms: {
      uProgress: { value: 0 },
      uOpacity: { value: 1 },
      uInner: { value: RING.inner },
      uLine: { value: RING.line },
      uColor: { value: GOLD },
      uHot: { value: GOLD_HOT },
    },
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  })
  const outer = FIGURE.haloRadius * RING.outerScale
  const ring = new THREE.Mesh(new THREE.RingGeometry(outer * RING.inner, outer, 160), ringMat)
  ring.position.z = 0.02
  group.add(ring)

  group.position.z = FIGURE.haloDepth
  group.userData = { disc, ring }
  return group
}

function prepareHead(gltfScene) {
  const material = new THREE.MeshStandardMaterial({
    color: STONE,
    roughness: 0.46,
    metalness: 0.06,
    transparent: true,
    opacity: 0,
  })
  gltfScene.traverse((o) => {
    if (o.isMesh) {
      o.material = material
      o.castShadow = false
      o.receiveShadow = false
    }
  })
  // Centre on its bounding box and normalise height.
  const box = new THREE.Box3().setFromObject(gltfScene)
  const size = box.getSize(new THREE.Vector3())
  const center = box.getCenter(new THREE.Vector3())
  const scale = FIGURE.height / size.y
  const pivot = new THREE.Group()
  gltfScene.position.sub(center)
  pivot.add(gltfScene)
  pivot.scale.setScalar(scale)
  pivot.userData = { material }
  return pivot
}

/**
 * @param {HTMLCanvasElement} canvas
 * @param {{ modelUrl: string, reducedMotion?: boolean, onLoad?: () => void, onError?: (e: unknown) => void }} opts
 */
export function createStatueScene(canvas, opts) {
  const { modelUrl, reducedMotion = false, onLoad, onError } = opts

  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
    powerPreference: 'high-performance',
  })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
  renderer.outputColorSpace = THREE.SRGBColorSpace
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 1.05
  renderer.setClearColor(0x000000, 0)

  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(CAMERA_FOV, 1, 0.1, 60)

  const stage = new THREE.Group() // moves as a unit for layout
  scene.add(stage)

  const halo = makeHalo()
  stage.add(halo)

  const headSlot = new THREE.Group()
  stage.add(headSlot)

  // Lighting: one warm rim light is the whole idea. Everything else is a whisper.
  // Key rim comes from behind, on the side the face turns toward, so the
  // profile (brow, nose, lips) catches the gold edge.
  const rim = new THREE.DirectionalLight(GOLD_HOT, 6.5)
  rim.position.set(-2.6, 2.4, -2.4)
  rim.target = headSlot
  const rim2 = new THREE.DirectionalLight(GOLD, 2.2)
  rim2.position.set(2.8, 0.9, -2.2)
  rim2.target = headSlot
  const fill = new THREE.PointLight(0x8f7f66, 5, 12, 2)
  fill.position.set(1.6, 0.4, 3.2)
  const ambient = new THREE.AmbientLight(0x2a241c, 0.9)
  scene.add(rim, rim2, fill, ambient)

  const dust = reducedMotion ? null : makeDust(260)
  if (dust) scene.add(dust)

  // --- state -----------------------------------------------------------------
  let layout = layoutForAspect(1.5)
  let head = null
  let frame = 0
  let disposed = false
  const clock = new THREE.Clock()
  const pointer = { x: 0, y: 0, cx: 0, cy: 0 }
  let scroll = 0
  let loadedAt = -1
  let lastT = 0
  const STILL_TIME = 10 // a time by which every intro animation has finished

  function applyLayout(width, height) {
    const aspect = width / Math.max(height, 1)
    layout = layoutForAspect(aspect)
    camera.aspect = aspect
    camera.position.set(0, 0, layout.cameraZ)
    camera.lookAt(0, 0, 0)
    camera.updateProjectionMatrix()
    stage.position.set(layout.headX, layout.headY, 0)
    stage.scale.setScalar(layout.headScale)
  }

  function resize(width, height) {
    renderer.setSize(width, height, false)
    applyLayout(width, height)
    if (reducedMotion) render(STILL_TIME)
  }

  function render(t) {
    const { ring, disc } = halo.userData
    const since = loadedAt < 0 ? 0 : t - loadedAt

    // Ring draws in over 2.4s from first frame; disc fades in behind it.
    // Overshoot past 1 so the shader's soft leading edge clears the seam at
    // the top and the finished ring is unbroken.
    ring.material.uniforms.uProgress.value = Math.min(1.04, (t / 2.4) * 1.04)
    disc.material.opacity = Math.min(1, Math.max(0, (t - 0.6) / 1.8))

    // Head fades in once loaded.
    if (head) head.userData.material.opacity = Math.min(1, since / 1.6)

    const sp = scrollPose(scroll)
    ring.material.uniforms.uOpacity.value = sp.haloOpacity
    disc.material.opacity *= sp.haloOpacity

    pointer.cx = damp(pointer.cx, pointer.x, 0.045)
    pointer.cy = damp(pointer.cy, pointer.y, 0.045)
    const pp = pointerPose(pointer.cx, pointer.cy)

    const breathe = reducedMotion ? 0 : Math.sin(t * 0.55) * 0.03
    headSlot.position.y = sp.lift + breathe
    headSlot.rotation.set(FIGURE.basePitch + pp.pitch, FIGURE.baseYaw + pp.yaw + sp.yaw, 0)
    headSlot.scale.setScalar(sp.scale)
    halo.position.y = sp.lift * 0.6
    halo.rotation.y = pp.yaw * 0.25

    if (dust) {
      const pos = dust.geometry.attributes.position
      const { speeds, phases } = dust.userData
      const dt = Math.min(Math.max(t - lastT, 0), 0.05)
      for (let i = 0; i < speeds.length; i++) {
        let y = pos.getY(i) + speeds[i] * dt
        const x = pos.getX(i) + Math.sin(t * 0.6 + phases[i]) * 0.0012
        if (y > 3.2) y = -3.2
        pos.setXY(i, x, y)
      }
      pos.needsUpdate = true
      dust.material.opacity = 0.35 + Math.sin(t * 0.9) * 0.1
    }

    lastT = t
    renderer.render(scene, camera)
  }

  function loop() {
    if (disposed) return
    render(clock.getElapsedTime())
    frame = requestAnimationFrame(loop)
  }

  // --- load the figure ---------------------------------------------------------
  const loader = new GLTFLoader()
  loader.load(
    modelUrl,
    (gltf) => {
      if (disposed) return
      head = prepareHead(gltf.scene)
      headSlot.add(head)
      loadedAt = clock.getElapsedTime()
      onLoad?.()
      if (reducedMotion) {
        // No loop in reduced-motion mode: show the finished state once.
        loadedAt = 0
        render(STILL_TIME)
      }
    },
    undefined,
    (err) => {
      if (!disposed) onError?.(err)
    },
  )

  applyLayout(canvas.clientWidth || 1, canvas.clientHeight || 1)
  if (reducedMotion) {
    render(STILL_TIME) // finished ring, no animation
  } else {
    loop()
  }

  return {
    /** nx, ny in -0.5..0.5 (pointer position relative to viewport centre). */
    setPointer(nx, ny) {
      pointer.x = nx
      pointer.y = ny
    },
    /** 0..1, how far the hero has scrolled out of view. */
    setScroll(p) {
      scroll = p
      if (reducedMotion) render(STILL_TIME)
    },
    resize,
    dispose() {
      disposed = true
      cancelAnimationFrame(frame)
      scene.traverse((o) => {
        if (o.geometry) o.geometry.dispose()
        const mats = Array.isArray(o.material) ? o.material : o.material ? [o.material] : []
        for (const m of mats) {
          if (m.map) m.map.dispose()
          m.dispose()
        }
      })
      renderer.dispose()
    },
  }
}
