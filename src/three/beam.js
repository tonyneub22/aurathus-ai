import { ringScreenPosition } from './layout.js'

/**
 * Pure placement math for the gold beam that falls from the hero ring onto the
 * Services box. All positions are CSS pixels relative to the "stage": the
 * element the beam layer is absolutely positioned in.
 */
export const BEAM = {
  gap: 20, // clear black between the ring's glow and the top of the beam
  fadeIn: 32, // the beam's top end fades in over this distance
  below: 120, // canvas runs past the hit point so the flare can spread over the box
  desktopMinWidth: 1024, // below this the hero copy sits over the figure
}

/**
 * Where the beam begins for a given scroll progress (0..1 through the hero).
 * On desktop it leaves the bottom of the ring and follows it as the ring
 * lifts and dims. Narrower screens stack the copy over the figure (and darken
 * the hero behind it), so there the beam starts below the hero instead of
 * running through the headline.
 */
export function beamStart({ hero, copyBottom, scroll, desktop }) {
  const ring = ringScreenPosition({ width: hero.width, height: hero.height, scroll })
  const x = hero.left + ring.x
  if (desktop && ring.wide) {
    return { x, y: hero.top + ring.bottom + BEAM.gap, opacity: ring.opacity, fromRing: true }
  }
  return { x, y: Math.max(copyBottom, hero.top + hero.height) + BEAM.gap, opacity: 1, fromRing: false }
}

/** The canvas box: tall enough for the highest start (ring fully lifted) down past the hit. */
export function beamFrame({ hero, copyBottom, boxTop, desktop }) {
  const highest = beamStart({ hero, copyBottom, scroll: 1, desktop })
  const top = Math.min(highest.y, boxTop)
  return { top, height: boxTop + BEAM.below - top, x: highest.x, hitY: boxTop - top }
}

// Laser Flow's canvas is 204.8 shader units tall at any pixel height, and it
// dims the beam over 150 units above the hit point.
const CANVAS_UNITS = 204.8
const FADE_UNITS = 150

/**
 * Laser Flow props that place the beam: offsets from the canvas centre as
 * fractions of width and height, and a reach that keeps the beam bright
 * (about 80%) all the way up to the top of our short canvas.
 */
export function laserOffsets(frame, stageWidth) {
  return {
    horizontalBeamOffset: frame.x / stageWidth - 0.5,
    verticalBeamOffset: 0.5 - frame.hitY / frame.height,
    beamReach: Math.max(1, ((2.5 * frame.hitY) / frame.height) * (CANVAS_UNITS / FADE_UNITS)),
  }
}
