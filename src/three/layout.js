/**
 * Pure layout math for the statue scene. No three.js imports, so it can be
 * unit-tested in Node and reasoned about without a GPU.
 */

/** Tune these to re-frame the figure without touching the rest. */
export const FIGURE = {
  height: 2.5, // world units; camera is ~5–6 units away
  baseYaw: -0.38, // radians; the face points +Z, negative turns it toward the headline (left)
  basePitch: -0.04,
  haloRadius: 1.55,
  haloDepth: -1.1, // halo sits behind the head
}

/**
 * The gold ring's band, as fractions. The band runs from `inner` × outer
 * radius to the outer radius; the crisp line sits `line` of the way across it.
 * `edge` is where the glow visibly ends on screen (after tone mapping), judged
 * from screenshots: about 12px below the line on a 1440×900 hero.
 */
export const RING = { outerScale: 1.25, inner: 0.78, line: 0.3, edge: 0.45 }

export const CAMERA_FOV = 32 // degrees, vertical

export const clamp = (v, min, max) => Math.min(max, Math.max(min, v))

export const lerp = (a, b, t) => a + (b - a) * t

/** Smoothly interpolate toward a target; `k` is the per-frame catch-up factor. */
export const damp = (current, target, k) => current + (target - current) * k

/**
 * Where the head and halo sit for a given viewport aspect ratio.
 * Wide screens put the figure on the right so the headline can sit on the
 * left; narrow screens stack it above the headline.
 */
export function layoutForAspect(aspect) {
  const wide = aspect >= 1.1
  return {
    wide,
    headX: wide ? 1.2 : 0,
    headY: wide ? -0.05 : 0.55,
    headScale: wide ? 0.94 : 0.78,
    cameraZ: wide ? 5.2 : 6.1,
  }
}

/**
 * How the figure responds as the hero scrolls out of view.
 * `p` is scroll progress through the hero, 0 (top) to 1 (hero fully scrolled).
 */
export function scrollPose(p) {
  const t = clamp(p, 0, 1)
  return {
    yaw: t * 0.55, // slow turn away as the visitor leaves
    lift: t * 0.9, // drifts upward
    scale: 1 - t * 0.12,
    haloOpacity: 1 - t * 0.85,
  }
}

/** Pointer offset (-0.5..0.5 each axis) → small parallax tilt in radians. */
export function pointerPose(nx, ny) {
  return {
    yaw: clamp(nx, -0.5, 0.5) * 0.28,
    pitch: clamp(ny, -0.5, 0.5) * 0.16,
  }
}

/** World point → CSS pixels for the hero camera (at z = cameraZ, looking at the origin). */
function project(x, y, z, { width, height, cameraZ }) {
  const h = Math.tan(((CAMERA_FOV / 2) * Math.PI) / 180) * (cameraZ - z)
  return {
    x: ((x / (h * (width / height)) + 1) / 2) * width,
    y: ((1 - y / h) / 2) * height,
  }
}

/**
 * Where the gold ring is on screen, in CSS pixels from the hero's top-left,
 * for a hero of `width` × `height` scrolled `scroll` (0..1) of the way out.
 * Mirrors the transforms in statueScene.js, so the DOM can line things up
 * with the ring without asking the GPU.
 */
export function ringScreenPosition({ width, height, scroll = 0 }) {
  const layout = layoutForAspect(width / Math.max(height, 1))
  const pose = scrollPose(scroll)
  const s = layout.headScale
  const cx = layout.headX
  const cy = layout.headY + pose.lift * 0.6 * s
  const cz = (FIGURE.haloDepth + 0.02) * s
  const outer = FIGURE.haloRadius * RING.outerScale * s
  const edge = outer * (RING.inner + RING.edge * (1 - RING.inner))

  const view = { width, height, cameraZ: layout.cameraZ }
  const centre = project(cx, cy, cz, view)
  const bottom = project(cx, cy - edge, cz, view)
  return {
    wide: layout.wide,
    x: centre.x,
    centreY: centre.y,
    bottom: bottom.y, // lowest visible edge of the ring's glow
    opacity: pose.haloOpacity,
  }
}
