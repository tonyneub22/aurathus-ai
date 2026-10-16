# Third-party assets and licenses

Record every asset that is not ours here, with its license and the date it was checked.
Attribution for CC BY assets must stay visible on the site wherever the asset appears.

## 3D models

### David Head — 1d_inc

- **Used in:** hero figure on the home page (`src/three/statueScene.js`)
- **Files:** `public/models/david-head/scene.gltf`, `scene.bin`, `LICENSE.txt` (as downloaded)
- **Source:** https://sketchfab.com/3d-models/david-head-39a4d01bef37495cac8d8f0009728871 (short link https://skfb.ly/oKvzW)
- **Author:** 1d_inc — https://sketchfab.com/1d_inc
- **License:** Creative Commons Attribution 4.0 International (CC BY 4.0) — http://creativecommons.org/licenses/by/4.0/
- **Commercial use:** allowed
- **Modifications made:** original material replaced (dark stone), re-lit with a gold rim light, scaled and animated. No changes to the mesh itself.
- **Attribution shown on site:** `src/components/brand/StatueCredit.jsx`, rendered in the footer of the home page, the only page that shows the figure. Covered by `src/config/site.test.js`, `StatueCredit.test.jsx`, `Footer.test.jsx`, `AppRoutes.test.jsx` and `e2e/home.spec.js`.
- **Downloaded:** 2026-10-03
- **License checked:** 2026-10-03 (license.txt bundled with the download confirms CC-BY-4.0)

## Images

- None. (Rodin's *The Thinker*, The Met, CC0, was used in Why Us from 2026-10-13 and removed on 2026-10-14; see git history.)

## Own brand assets

- `public/brand/aurathus-*`, the favicons, `site.webmanifest` and `og-image.png` in `public/` are Aurathus AI LLC's own brand assets, from `brand-source/aurathus-logo-v2/` (an original line drawing, not traced from the CC BY 3D model). The wordmark is Cormorant Garamond (SIL OFL 1.1) converted to outlines.

## Fonts

- **Cormorant Garamond** — SIL Open Font License 1.1, served by Google Fonts
- **Hanken Grotesk** — SIL Open Font License 1.1, served by Google Fonts

## Code

### Laser Flow — React Bits (David Haz)

- **Used in:** the gold beam from the hero ring to the Services box (`src/three/laserFlowShader.js`, `src/three/laserFlow.js`, driven by `src/components/effects/`)
- **Source:** https://reactbits.dev/animations/laser-flow — `src/tailwind/Animations/LaserFlow` in https://github.com/DavidHDev/react-bits
- **License:** MIT + Commons Clause v1.0, Copyright (c) 2026 David Haz. **Not plain MIT.** Full text is kept in the header of `laserFlowShader.js`.
- **What it allows:** use, modify and publish it *as part of* a website or product, including commercially. The copyright and permission notice must stay with the code.
- **What it forbids:** selling, sublicensing or redistributing the component itself, alone, in a bundle or ported. Shipping it inside this site (or a client's site) is fine; selling it as a template, kit or snippet is not.
- **Modifications made:** rewritten as a framework-free controller; output changed to premultiplied alpha with highlights scaled rather than clipped (gold core, no white burn); added a `uReach` uniform; render loop stops when off screen; DPR capped at 1.5; pointer tilt removed; brand gold default.
- **Copied:** 2026-10-04 (license checked the same day)

### Ghost Fibers — React Bits (David Haz)

- **Used in:** the animated background of the About box (`src/three/ghostFibersShader.js`, `src/three/ghostFibers.js`, driven by `src/components/effects/GhostFibers*.jsx`)
- **Source:** https://reactbits.dev/c/backgrounds/ghost-fibers — `src/tailwind/Backgrounds/GhostFibers` in https://github.com/DavidHDev/react-bits
- **License:** MIT + Commons Clause v1.0, Copyright (c) 2026 David Haz. **Not plain MIT.** Same terms as Laser Flow above, and the full text is kept in the header of `ghostFibersShader.js`. `src/three/licenseHeaders.test.js` fails if either header is lost.
- **Modifications made:** runs on three.js instead of the `ogl` library (so no new dependency); GLSL ES 3.00 converted to WebGL1 syntax; `uBackdrop` uniform replaces the hard-coded indigo-black backdrop; recoloured to brand gold (`--color-aura-gold`, `--color-aura-gold-soft`) with the blue boost off; rendered at 1x pixel density and 30 fps; a still mode for reduced motion.
- **Copied:** 2026-10-04 (license checked the same day)

### GSAP — GreenSock (Webflow)

- **Used in:** scroll entrances (`src/lib/useReveal.js`), the smooth-scroll ticker (`src/lib/smoothScroll.js`), the phone menu's stagger (`MenuPanel.jsx`)
- **Package:** `gsap` (npm), version 3
- **License:** GSAP Standard "no charge" license, https://gsap.com/standard-license. **Not MIT.** Free for commercial use, including on client sites. It may not be used in a product that competes with Webflow's own tools (a no-code visual animation builder); a website using it is fine.
- **Checked:** 2026-10-14

### Lenis — darkroom.engineering

- **Used in:** site-wide smooth scrolling (`src/lib/smoothScroll.js`), off under reduced motion
- **Package:** `lenis` (npm), version 1
- **License:** MIT
- **Checked:** 2026-10-14

### Other

- **three.js** — MIT
- **motion** — MIT
- **react / react-dom** — MIT
- **tailwindcss** — MIT
