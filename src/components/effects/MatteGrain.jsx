import { useId } from 'react'

/*
 * Each layer is its own <svg> carrying its own blend mode and opacity, so it
 * blends with what is behind it (the page, or the panel's fill). Wrapping the
 * layers in a shared, z-indexed element would isolate them and the blend
 * would have nothing to mix with.
 */
const NOISE = {
  // Large, soft clouds: the uneven tone of a matte material.
  mottle: { type: 'fractalNoise', baseFrequency: '0.006', numOctaves: '4', seed: '7' },
  // Fine tooth.
  grain: { type: 'fractalNoise', baseFrequency: '0.9', numOctaves: '2', stitchTiles: 'stitch' },
}

const VARIANTS = {
  // Fixed behind everything: above the body background, below all content.
  // Opacities are about 40% of the first spec (.05 / .06), which
  // lifted the black by ~10/255 and read grey; these lift it by ~4.
  page: {
    position: 'fixed',
    zIndex: -1,
    layers: [
      { noise: 'mottle', opacity: 0.02, blend: 'screen' },
      { noise: 'grain', opacity: 0.025, blend: 'screen' },
    ],
  },
  // Inside a .matte-panel, under its content.
  panel: {
    position: 'absolute',
    layers: [{ noise: 'grain', opacity: 0.07, blend: 'overlay' }],
  },
}

/** Static SVG noise that gives a surface a matte finish. No image files, never animated. */
export default function MatteGrain({ variant = 'panel' }) {
  const id = useId().replace(/:/g, '')
  const { position, zIndex, layers } = VARIANTS[variant]

  return layers.map(({ noise, opacity, blend }) => {
    const filterId = `${id}-${noise}`
    return (
      <svg
        key={noise}
        aria-hidden="true"
        focusable="false"
        data-testid={`matte-${noise}`}
        className="pointer-events-none inset-0 h-full w-full"
        style={{ position, zIndex, opacity, mixBlendMode: blend }}
      >
        <filter id={filterId}>
          <feTurbulence {...NOISE[noise]} />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter={`url(#${filterId})`} />
      </svg>
    )
  })
}
