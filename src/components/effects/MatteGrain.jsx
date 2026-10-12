import { useId } from 'react'

/*
 * Each layer is its own <svg> carrying its own blend mode and opacity, so it
 * blends with what is behind it (the page, or the panel's fill). Wrapping the
 * layers in a shared, z-indexed element would isolate them and the blend
 * would have nothing to mix with.
 */
const TEXTURES = {
  // Large, soft clouds: the uneven tone of a hide.
  mottle: (
    <>
      <feTurbulence type="fractalNoise" baseFrequency="0.004" numOctaves="4" seed="7" />
      <feColorMatrix type="saturate" values="0" />
    </>
  ),
  // The pebbled grain of leather: fine noise used as a height map and lit from
  // the top left, so each pore reads as relief. Diffuse only, no specular: matte.
  pebble: (
    <>
      <feTurbulence type="fractalNoise" baseFrequency="0.55" numOctaves="3" seed="3" stitchTiles="stitch" />
      <feDiffuseLighting surfaceScale="1.6" diffuseConstant="1" lightingColor="#ffffff">
        <feDistantLight azimuth="225" elevation="52" />
      </feDiffuseLighting>
    </>
  ),
  // The same grain, tighter, for the smaller inset leather.
  'pebble-fine': (
    <>
      <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="2" seed="11" stitchTiles="stitch" />
      <feDiffuseLighting surfaceScale="1.2" diffuseConstant="1" lightingColor="#ffffff">
        <feDistantLight azimuth="225" elevation="52" />
      </feDiffuseLighting>
    </>
  ),
}

const VARIANTS = {
  // Matte black hide, fixed behind everything: above the body background,
  // below all content. Screen is the only blend that shows on black, and it
  // lifts it, so these stay low (about +4/255 in all).
  page: {
    position: 'fixed',
    zIndex: -1,
    layers: [
      { texture: 'mottle', opacity: 0.02, blend: 'screen' },
      { texture: 'pebble', opacity: 0.012, blend: 'screen' },
    ],
  },
  // Saddle-brown leather inside a .matte-panel, under its content.
  panel: {
    position: 'absolute',
    layers: [
      { texture: 'mottle', opacity: 0.3, blend: 'overlay' },
      { texture: 'pebble', opacity: 0.16, blend: 'overlay' },
    ],
  },
  // Espresso leather inside a .matte-panel.matte-inset: quieter tone, finer grain.
  inset: {
    position: 'absolute',
    layers: [
      { texture: 'mottle', opacity: 0.2, blend: 'overlay' },
      { texture: 'pebble-fine', opacity: 0.14, blend: 'overlay' },
    ],
  },
}

/** Static SVG texture that gives a surface a matte leather finish. No image files, never animated. */
export default function MatteGrain({ variant = 'panel' }) {
  const id = useId().replace(/:/g, '')
  const { position, zIndex, layers } = VARIANTS[variant]

  return layers.map(({ texture, opacity, blend }) => {
    const filterId = `${id}-${texture}`
    return (
      <svg
        key={texture}
        aria-hidden="true"
        focusable="false"
        data-testid={`matte-${texture}`}
        className="pointer-events-none inset-0 h-full w-full"
        style={{ position, zIndex, opacity, mixBlendMode: blend }}
      >
        <filter id={filterId} colorInterpolationFilters="sRGB">
          {TEXTURES[texture]}
        </filter>
        <rect width="100%" height="100%" filter={`url(#${filterId})`} />
      </svg>
    )
  })
}
