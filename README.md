# Aurathus AI LLC — Design Services

Landing site for Aurathus AI LLC (https://aurathus-ai.com). Vite + React + Tailwind CSS v4 + Motion + three.js.

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

- **Copy, links, attribution:** `src/config/site.js`; the four services in `src/config/services.js`. No copy is hardcoded in components.
- **Brand tokens:** `src/styles/theme.css` (Tailwind v4 `@theme`): `--color-aura-*` and `--ease-aura*`, plus the matte surface tokens (`--bg-*`, `--panel*`, `--text*`) and the `.matte-panel` class. Fonts (Google Fonts, linked in `index.html`): Cormorant Garamond for display, Hanken Grotesk for reading text. Gold `#D4C39A` is the site gold; the brand pack's artwork colours stay inside the logo files.
- **3D hero:** `src/three/statueScene.js` (scene, lights, halo, dust) and `src/three/layout.js` (pure layout math, unit tested). `src/components/hero/StatueCanvas.jsx` mounts it in React and is lazy-loaded so three.js ships in its own chunk.
- **Figure tuning:** the `FIGURE` constants at the top of `statueScene.js` set the head's size, turn and the halo radius.
- **Header:** `src/components/layout/header/` — the header lockup left (to the top of home); wide screens show the section links and Request Consult, phones a menu button and full-screen menu. Links come from `site.nav`.
- **Brand components:** `src/components/brand/` — loading indicator, CC BY credit.
- **Sections and chrome:** `src/components/sections/`, `src/components/layout/`.
- **Pages and routes:** `src/pages/`, routed in `App.jsx` with `react-router`: `/`, `/consult`, `/services/:slug` (template in `src/components/service/`) and a 404. `vercel.json` rewrites deep links to `index.html`.
- **Assets:** `public/brand/` (Aurathus logos and icons), `public/` root (favicons, `site.webmanifest`, `og-image.png`), `public/models/` (3D files with their licenses). The brand pack they came from is `brand-source/aurathus-logo-v2/`.
- **Licenses:** `LICENSES.md` records every third-party asset. The hero figure is CC BY 4.0 and its credit must stay visible.
- **Working rules for Claude:** `CLAUDE.md`.

## Notes

- All logos are made for dark backgrounds: `aurathus-logo-header.svg` (header), `aurathus-logo-footer.svg` (footer, with LLC) and `aurathus-icon.svg` (the mark alone). `favicon.svg` switches between gold and bronze for dark and light browser UIs by itself.
- The hero renders without WebGL too: if a context can't be created the canvas unmounts and the copy stands on its own.
- `prefers-reduced-motion` turns off the dust, the breathing and the intro sequence, and renders the finished state once.
