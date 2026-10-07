# Podocyte AI — Design Services

Landing site for Podocyte AI. Vite + React + Tailwind CSS v4 + Motion + three.js.

## Running locally

```bash
npm install
npx playwright install chromium   # once, for the e2e tests
npm run dev
```

Production build and preview:

```bash
npm run build
npm run preview
```

## Checking your work

```bash
npm run check   # lint → unit tests → build → Playwright e2e
```

Individual steps: `npm run lint`, `npm run test`, `npm run test:e2e`.
Playwright saves review screenshots to `e2e/screenshots/` and an HTML report to `playwright-report/`.

## Where things live

- **Copy, links, attribution:** `src/config/site.js`. No copy is hardcoded in components.
- **Brand tokens:** `src/styles/theme.css` (Tailwind v4 `@theme`). Gold `#D4C39A` was sampled from the logo.
- **3D hero:** `src/three/statueScene.js` (scene, lights, halo, dust) and `src/three/layout.js` (pure layout math, unit tested). `src/components/hero/StatueCanvas.jsx` mounts it in React and is lazy-loaded so three.js ships in its own chunk.
- **Figure tuning:** the `FIGURE` constants at the top of `statueScene.js` set the head's size, turn and the halo radius.
- **Brand components:** `src/components/brand/` — logo, loading indicator, CC BY credit.
- **Sections and chrome:** `src/components/sections/`, `src/components/layout/`.
- **Pages:** `src/pages/`. `App.jsx` renders the single page; add a router when there is a second one.
- **Assets:** `public/brand/` (logo, favicons), `public/models/` (3D files with their licenses).
- **Licenses:** `LICENSES.md` records every third-party asset. The hero figure is CC BY 4.0 and its credit must stay visible.
- **Working rules for Claude:** `CLAUDE.md`.

## Notes

- The source logo (`brand-source/Podocyte AI logo@1x.png`) is opaque with a `#0A0A0C` background, which matches the page background. Re-export from the PDF with transparency if you ever need a true cutout.
- The hero renders without WebGL too: if a context can't be created the canvas unmounts and the copy stands on its own.
- `prefers-reduced-motion` turns off the dust, the breathing and the intro sequence, and renders the finished state once.
