# Aurathus AI LLC — working rules for Claude

Read this before touching the codebase. These rules hold for every session.

## Hard rules

- **Never run `git commit`, `git push`, `git rebase`, or anything that writes history.** Anthony commits and deploys manually after reviewing on his local dev server. Leave the working tree for him to inspect.
- **Never add secrets, API keys or tokens to the repo.** Env values go in `.env.local` (gitignored). The client bundle must never contain anything private.
- **No new dependencies without saying why.** Prefer what is installed: React, motion, three, Tailwind v4. Pin major versions.
- **Keep the CC BY attribution for the hero figure.** See `LICENSES.md`. Tests enforce it.

## How work is checked

Run `npm run check` before handing anything back. It runs, in order:

1. `npm run lint` — ESLint (flat config, `eslint.config.js`)
2. `npm run test` — Vitest unit and component tests (`src/**/*.test.{js,jsx}`)
3. `npm run build` — production build must succeed
4. `npm run test:e2e` — Playwright smoke tests against the built site (`e2e/`)

A change is not done until all four pass. New modules get tests in the same folder.
Playwright writes review screenshots to `e2e/screenshots/`.

## Where things live

- `src/config/site.js` — every piece of copy, link and attribution. No copy in components.
- `src/styles/theme.css` — brand tokens (`--color-aura-*`, `--ease-aura*`, fonts). Components use Tailwind classes built on these.
- `src/three/` — framework-free WebGL. `layout.js` is pure math (unit tested). `statueScene.js` builds the scene and returns a controller. No React imports here.
- `src/components/hero/` — the hero. `StatueCanvas.jsx` and `effects/LaserFlow.jsx` are the only React files that drive three.js scenes, and both are lazy-loaded.
- `src/components/sections/` — the home-page boxes (Services, Client Testimonials, Why Choose Us?, About), all built on `Panel.jsx`. Their copy is **placeholder** until replaced in `site.js`.
- `src/components/effects/` — the gold beam from the hero ring to the Services box, and the Ghost Fibers background behind About. `ServicesBeam.jsx` places it using the pure math in `src/three/beam.js` and `layout.js` (`ringScreenPosition`).
- `src/three/palette.js` — brand colours for WebGL. Must match `theme.css` (tested). The beam uses `RING_LIGHT` (the ring as rendered), not the raw gold.
- `src/components/layout/header/` — the fixed header on every page: Home icon left (`HomeLink`, to `/#top`), hamburger right (`MenuButton`) opening a slide-in `MenuPanel`. `useMenu` owns open/close, Esc, focus trap, focus return and scroll lock. Labels and links come from `site.nav`; links use the `/#id` form so they work from `/consult`.
- `src/components/brand/` — loading indicator, attribution. These survive redesigns.
- `src/components/layout/`, `src/components/sections/` — page chrome and content sections.
- `src/pages/` — one file per route. `App.jsx` picks the page by path (Home or `/consult`); add a router if the site grows.
- `public/brand/` — Aurathus logos and icons. `public/` root — favicons, `site.webmanifest`, `og-image.png`. `public/models/` — 3D assets with their license files.

## Brand

- Company name **Aurathus AI LLC** (`site.companyName`; `site.shortName` is "Aurathus AI"). Domain https://aurathus-ai.com (`site.siteUrl`; `index.html` gets it through `__SITE_URL__`). GitHub repo `tonyneub22/aurathus-ai`.
- Brand pack: `brand-source/aurathus-ai-brand/` (plain assets, never run anything from it). Copies live in `public/brand/` (logos, icons) and the `public/` root (favicons, manifest, og image).
- Every logo is made for dark backgrounds. Never place one on a light surface.
- `aurathus-icon.svg` is ~300 KB with ~680 paths: only as an `<img>` at 64px or larger, never inline. Anything smaller uses `aurathus-icon-small.svg`.
- Site colours stay as defined in `theme.css` (gold `#D4C39A`, black `#0A0A0B`, …). The brand pack's artwork colours (`#c9a24a`, `#000`) are for the logo files only.

## Code style

- Small, named modules with one job. If a file needs a scroll bar to read, split it.
- A comment explains *why*, not *what*. Delete code instead of commenting it out.
- Motion must respect `prefers-reduced-motion` (`useReducedMotion` in React, the `reducedMotion` flag in three).
- Links to other sites get `rel="noopener noreferrer"`. Email addresses are shown as text, not only as `mailto:`.
- Mobile first: check every change at 390px wide. The page must never scroll horizontally.
- Accessibility: one `h1` per page, labelled sections, visible focus states, alt text on images, `aria-hidden` on decorative canvases.

## Design direction

Dark warm black, champagne gold (`#D4C39A` from the logo), bone white. Classical serif (Cormorant Garamond) set light and wide; the same serif, in wide-tracked caps, for small labels (matches the logo lettering; no sans). One light source. Motion is slow, eased and purposeful; no bouncing, no parallax for its own sake. When in doubt, remove something.
