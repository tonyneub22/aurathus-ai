/**
 * Brand colours for WebGL, which can't read CSS custom properties. These
 * mirror the tokens in src/styles/theme.css; palette.test.js fails if the two
 * drift apart. Every three.js scene takes its gold from here.
 */
export const GOLD = '#d4c39a' // --color-podo-gold, the logo's ring
export const GOLD_HOT = '#f3dfb4' // --color-podo-gold-hot, highlight on the ring rim
export const SURFACE = '#11100e' // --color-podo-black-2, the raised surface the section boxes use
export const GOLD_SOFT = '#a29578' // --color-podo-gold-soft, the quieter gold
// The ring on the statue is additively blended and tone-mapped, so on screen it
// is a brighter yellow-gold than GOLD. Measured from the hero screenshot: core
// ~#fffd9c, edges ~#d9b36d, average across its lit band ~#f0dc8a. The beam uses
// this so it reads as the same light; the average (not the core) keeps it gold,
// not olive, where the shader dims it.
export const RING_LIGHT = '#f0dc8a' // --color-podo-ring
export const STONE = '#46413b' // the statue's material; not a page token
