const GLOW = 'color-mix(in srgb, var(--color-aura-ring) 40%, transparent)'

/**
 * The still version of the beam, for reduced motion or no WebGL: a gold line
 * with a soft glow, and a flare where it meets the box.
 */
export default function StaticBeam({ x, hitY }) {
  return (
    <>
      <div
        className="absolute top-0 w-px -translate-x-1/2 bg-gradient-to-b from-aura-ring/0 via-aura-ring/70 to-aura-ring"
        style={{ left: x, height: hitY, boxShadow: `0 0 12px 1px ${GLOW}` }}
      />
      <div
        className="absolute h-14 w-[min(420px,80%)] -translate-x-1/2 -translate-y-1/2"
        style={{ left: x, top: hitY, background: `radial-gradient(ellipse at center, ${GLOW}, transparent 70%)` }}
      />
    </>
  )
}
