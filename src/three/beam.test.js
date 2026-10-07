import { describe, expect, it } from 'vitest'
import { BEAM, beamFrame, beamStart, laserOffsets } from './beam'
import { ringScreenPosition } from './layout'

const desktopHero = { left: 0, top: 0, width: 1440, height: 900 }
const phoneHero = { left: 0, top: 0, width: 390, height: 844 }

describe('beamStart', () => {
  it('leaves the bottom of the ring, with a clear gap, on desktop', () => {
    const ring = ringScreenPosition({ width: 1440, height: 900 })
    const s = beamStart({ hero: desktopHero, copyBottom: 700, scroll: 0, desktop: true })
    expect(s.fromRing).toBe(true)
    expect(s.x).toBeCloseTo(ring.x)
    expect(s.y - ring.bottom).toBe(BEAM.gap)
    expect(s.x).toBeGreaterThan(720) // the ring is on the right
  })

  it('follows the ring up and dims with it as the hero scrolls out', () => {
    const rest = beamStart({ hero: desktopHero, copyBottom: 700, scroll: 0, desktop: true })
    const out = beamStart({ hero: desktopHero, copyBottom: 700, scroll: 0.6, desktop: true })
    expect(out.y).toBeLessThan(rest.y)
    expect(out.opacity).toBeLessThan(rest.opacity)
    expect(out.opacity).toBeCloseTo(ringScreenPosition({ width: 1440, height: 900, scroll: 0.6 }).opacity)
  })

  it('starts below the hero on phones, centred under the ring', () => {
    const s = beamStart({ hero: phoneHero, copyBottom: 780, scroll: 0, desktop: false })
    expect(s.fromRing).toBe(false)
    expect(s.y).toBe(844 + BEAM.gap)
    expect(s.x).toBeCloseTo(195)
  })

  it('also starts below the copy on a landscape tablet, where the copy overlaps the figure', () => {
    const s = beamStart({ hero: { left: 0, top: 0, width: 900, height: 700 }, copyBottom: 640, scroll: 0, desktop: false })
    expect(s.fromRing).toBe(false)
  })
})

describe('beamFrame', () => {
  it('spans from the highest start down past the hit point', () => {
    const f = beamFrame({ hero: desktopHero, copyBottom: 700, boxTop: 996, desktop: true })
    const highest = beamStart({ hero: desktopHero, copyBottom: 700, scroll: 1, desktop: true })
    expect(f.top).toBeCloseTo(highest.y)
    expect(f.top + f.hitY).toBeCloseTo(996)
    expect(f.height - f.hitY).toBe(BEAM.below)
  })

  it('never starts below the box', () => {
    const f = beamFrame({ hero: phoneHero, copyBottom: 700, boxTop: 850, desktop: false })
    expect(f.top).toBe(850)
    expect(f.hitY).toBe(0)
  })
})

describe('laserOffsets', () => {
  it('maps the beam x and hit point to the shader offsets', () => {
    const centred = laserOffsets({ x: 720, hitY: 100, height: 200 }, 1440)
    expect(centred.horizontalBeamOffset).toBe(0)
    expect(centred.verticalBeamOffset).toBe(0)
    const o = laserOffsets({ x: 1080, hitY: 300, height: 400 }, 1440)
    expect(o.horizontalBeamOffset).toBeCloseTo(0.25)
    expect(o.verticalBeamOffset).toBeCloseTo(-0.25) // hit sits below centre
  })

  it('stretches the reach on short canvases, never shrinks it', () => {
    expect(laserOffsets({ x: 0, hitY: 200, height: 320 }, 1440).beamReach).toBeGreaterThan(1)
    expect(laserOffsets({ x: 0, hitY: 0, height: 120 }, 1440).beamReach).toBe(1)
  })
})
