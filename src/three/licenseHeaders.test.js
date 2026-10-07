import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

/**
 * The React Bits code we ship is MIT + Commons Clause, which requires the
 * copyright and permission notice to stay with it. Fails if a header is lost.
 */
const read = (file) => readFileSync(resolve(process.cwd(), file), 'utf8')

describe.each(['src/three/laserFlowShader.js', 'src/three/ghostFibersShader.js'])('%s', (file) => {
  const source = read(file)

  it('keeps the original copyright and licence notice', () => {
    expect(source).toMatch(/Copyright \(c\) 2026 David Haz/)
    expect(source).toMatch(/MIT \+ Commons Clause/)
    expect(source).toMatch(/Permission is hereby granted/)
    expect(source).toMatch(/reactbits\.dev/)
  })
})

describe('ghost fibers shader', () => {
  const source = read('src/three/ghostFibersShader.js')

  it('runs on three.js alone: WebGL1 syntax, no #version header, no ogl', () => {
    expect(source).not.toMatch(/#version/)
    expect(source).not.toMatch(/\bogl\b.*import|from 'ogl'/)
    expect(source).toMatch(/gl_FragColor/)
  })

  it('takes its backdrop from a uniform instead of the original indigo-black', () => {
    expect(source).toMatch(/uniform vec3 uBackdrop/)
    expect(source).not.toMatch(/0\.070588/)
  })
})
