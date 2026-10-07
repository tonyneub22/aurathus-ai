import { describe, expect, it } from 'vitest'
import * as THREE from 'three'
import {
  CAMERA_FOV,
  FIGURE,
  RING,
  clamp,
  damp,
  layoutForAspect,
  lerp,
  pointerPose,
  ringScreenPosition,
  scrollPose,
} from './layout'

describe('math helpers', () => {
  it('clamps into range', () => {
    expect(clamp(5, 0, 1)).toBe(1)
    expect(clamp(-5, 0, 1)).toBe(0)
    expect(clamp(0.5, 0, 1)).toBe(0.5)
  })

  it('lerps and damps toward a target', () => {
    expect(lerp(0, 10, 0.5)).toBe(5)
    expect(damp(0, 10, 0.1)).toBeCloseTo(1)
    expect(damp(10, 10, 0.1)).toBe(10)
  })
})

describe('layoutForAspect', () => {
  it('puts the figure to the right on wide screens', () => {
    const l = layoutForAspect(16 / 9)
    expect(l.wide).toBe(true)
    expect(l.headX).toBeGreaterThan(0)
    expect(l.headScale).toBeGreaterThan(layoutForAspect(0.5).headScale)
  })

  it('stacks the figure above the headline on phones', () => {
    const l = layoutForAspect(390 / 844)
    expect(l.wide).toBe(false)
    expect(l.headX).toBe(0)
    expect(l.headY).toBeGreaterThan(0)
    expect(l.headScale).toBeLessThan(1)
    expect(l.cameraZ).toBeGreaterThan(layoutForAspect(2).cameraZ)
  })
})

describe('scrollPose', () => {
  it('is at rest at the top of the page', () => {
    expect(scrollPose(0)).toEqual({ yaw: 0, lift: 0, scale: 1, haloOpacity: 1 })
  })

  it('turns, lifts and dims as the hero scrolls out, and clamps past 1', () => {
    const end = scrollPose(1)
    expect(end.yaw).toBeGreaterThan(0)
    expect(end.lift).toBeGreaterThan(0)
    expect(end.scale).toBeLessThan(1)
    expect(end.haloOpacity).toBeGreaterThan(0)
    expect(scrollPose(5)).toEqual(end)
    expect(scrollPose(-1)).toEqual(scrollPose(0))
  })
})

describe('pointerPose', () => {
  it('is centred when the pointer is centred', () => {
    expect(pointerPose(0, 0)).toEqual({ yaw: 0, pitch: 0 })
  })

  it('tilts a little, never a lot', () => {
    const p = pointerPose(3, -3) // far outside the viewport
    expect(Math.abs(p.yaw)).toBeLessThan(0.3)
    expect(Math.abs(p.pitch)).toBeLessThan(0.2)
    expect(pointerPose(0.5, 0).yaw).toBeGreaterThan(0)
  })
})

describe('ringScreenPosition', () => {
  /** The same transforms statueScene.js applies, done by three.js itself. */
  function threeProjection(width, height, scroll) {
    const layout = layoutForAspect(width / height)
    const camera = new THREE.PerspectiveCamera(CAMERA_FOV, width / height, 0.1, 60)
    camera.position.set(0, 0, layout.cameraZ)
    camera.lookAt(0, 0, 0)
    camera.updateMatrixWorld()
    camera.updateProjectionMatrix()
    const stage = new THREE.Group()
    stage.position.set(layout.headX, layout.headY, 0)
    stage.scale.setScalar(layout.headScale)
    const halo = new THREE.Group()
    halo.position.set(0, scrollPose(scroll).lift * 0.6, FIGURE.haloDepth)
    const ring = new THREE.Group()
    ring.position.z = 0.02
    stage.add(halo)
    halo.add(ring)
    stage.updateMatrixWorld(true)
    const edge = FIGURE.haloRadius * RING.outerScale * (RING.inner + RING.edge * (1 - RING.inner))
    const toPx = (v) => {
      const p = ring.localToWorld(v).project(camera)
      return { x: ((p.x + 1) / 2) * width, y: ((1 - p.y) / 2) * height }
    }
    return { centre: toPx(new THREE.Vector3(0, 0, 0)), bottom: toPx(new THREE.Vector3(0, -edge, 0)) }
  }

  it.each([
    [1440, 900, 0],
    [1440, 900, 0.6],
    [1024, 768, 0.3],
    [390, 844, 0],
  ])('matches three.js at %i×%i, scroll %f', (width, height, scroll) => {
    const ours = ringScreenPosition({ width, height, scroll })
    const theirs = threeProjection(width, height, scroll)
    expect(ours.x).toBeCloseTo(theirs.centre.x, 3)
    expect(ours.centreY).toBeCloseTo(theirs.centre.y, 3)
    expect(ours.bottom).toBeCloseTo(theirs.bottom.y, 3)
  })

  it('sits right of centre on desktop and centred on phones', () => {
    expect(ringScreenPosition({ width: 1440, height: 900 }).x).toBeGreaterThan(720)
    expect(ringScreenPosition({ width: 390, height: 844 }).x).toBeCloseTo(195)
  })

  it('rises and dims as the hero scrolls out', () => {
    const rest = ringScreenPosition({ width: 1440, height: 900, scroll: 0 })
    const out = ringScreenPosition({ width: 1440, height: 900, scroll: 1 })
    expect(out.bottom).toBeLessThan(rest.bottom)
    expect(out.opacity).toBeLessThan(rest.opacity)
    expect(rest.bottom).toBeGreaterThan(rest.centreY)
  })
})
