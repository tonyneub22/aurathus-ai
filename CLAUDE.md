# Aurathus AI LLC — working rules for Claude

Read this before touching the codebase. These rules hold for every session.

## Hard rules

- **Never run `git commit`, `git push`, `git rebase`, or anything that writes history.** Anthony commits and deploys manually after reviewing on his local dev server. Leave the working tree for him to inspect.
- **Never add secrets, API keys or tokens to the repo.** Env values go in `.env.local` (gitignored). The client bundle must never contain anything private.
- **No new dependencies without saying why.** Prefer what is installed: React, react-router, motion, three, gsap, lenis, Tailwind v4. Pin major versions.
- **Keep the CC BY attribution for the hero figure.** It shows on every page that shows the statue (home only: `<Footer credit />`). See `LICENSES.md`. Tests enforce it.

## How work is checked

Run `npm run check` before handing anything back. It runs, in order:

1. `npm run lint` — ESLint (flat config, `eslint.config.js`)
2. `npm run test` — Vitest unit and component tests (`src/**/*.test.{js,jsx}`)
3. `npm run build` — production build must succeed
4. `npm run test:e2e` — Playwright smoke tests against the built site (`e2e/`)

A change is not done until all four pass. New modules get tests in the same folder.
Playwright writes review screenshots to `e2e/screenshots/`.

## Where things live

- `src/config/site.js` — every piece of copy, link and attribution. No copy in components. `copy.test.js` guards every word against `__fixtures__/approved-copy.json`: redesigns never change wording; update the fixture only when Anthony supplies new copy.
- `src/config/services.js` — the four services, in display order (the home-page rows and `/services/:slug` pages render from it). Copy is final as supplied by Anthony; don't reword it.
- `src/styles/theme.css` — brand tokens (`--color-aura-*`, `--ease-aura*`, fonts) and the matte surface tokens (`--bg-*`, `--panel*`, `--text*`). Components use Tailwind classes built on these. Text uses `text-aura-heading`, `-text`, `-body` or `-muted` (all clear 4.5:1 on page and panels; `contrast.test.js`), never dimmed white.
- Every home section is a dark matte box (`Panel.jsx`, `.matte-panel.matte-dark`) with the gold frame, except Services, which is `bordered={false}` (`.matte-borderless`): the beam lands on its top edge instead. Never nest boxes (Testimonials' cells are the only exception, and that section is off). Plan cards and the consult form are still `.matte-panel` in saddle-brown leather; the includes band is dark. A box is a `.matte-panel` with `<MatteGrain variant="panel" />` inside and its content positioned above it. A box inside a box adds `.matte-inset` (darker espresso leather) and uses `<MatteGrain variant="inset" />`. `App.jsx` mounts the one page-wide `<MatteGrain variant="page" />`. Keep the grain subtle: if the page reads grey, lower the page opacities.
- `src/three/` — framework-free WebGL. `layout.js` is pure math (unit tested). `statueScene.js` builds the scene and returns a controller. No React imports here.
- `src/components/hero/` — the hero. `StatueCanvas.jsx` and `effects/LaserFlow.jsx` are the only React files that drive three.js scenes, and both are lazy-loaded.
- `src/components/sections/` — the home-page sections: Services (an editorial index, `ServiceIndexRow.jsx`), Why Choose Us? (reasons in a framed box), About (fibers behind the copy), and Client Testimonials, which is switched off by `showTestimonials` in `site.js` until real quotes exist (it also hides the Work menu link). Why Us, About and testimonial copy is **placeholder** until replaced in `site.js`.
- `src/components/effects/` — `MatteGrain.jsx` (static SVG noise), the gold beam from the hero ring to the Services box, and the Ghost Fibers background behind About. `ServicesBeam.jsx` places it using the pure math in `src/three/beam.js` and `layout.js` (`ringScreenPosition`).
- `src/three/palette.js` — brand colours for WebGL. Must match `theme.css` (tested). The beam uses `RING_LIGHT` (the ring as rendered), not the raw gold.
- `src/components/layout/header/` — the fixed header on every page: the brand (`HomeLink`, mark + name, to `/#top`) left. Wide screens: the section links and Request Consult inline (`DesktopNav`, `aria-current` on the section in view via `useActiveSection`). Smaller screens: `MenuButton` opening a full-screen `MenuPanel`. Clear over the hero, a matte bar once scrolled; it tucks away reading down and returns on the way up (`useHeaderState`). `useMenu` owns open/close, Esc, focus trap, focus return and scroll lock. Labels and links come from `site.nav`; links use the `/#id` form so they work from `/consult`.
- `src/components/brand/` — loading indicator, attribution. These survive redesigns.
- `src/components/layout/`, `src/components/sections/` — page chrome and content sections. `layout/CtaButton.jsx` is the one primary button (hero, Services, service pages).
- `src/pages/` — one file per route. `App.jsx` holds the `react-router` routes: `/`, `/consult`, `/services/:slug` (lazy-loaded) and a 404. Internal links use `Link`; `ScrollManager` handles `/#id` targets and scroll-to-top. `vercel.json` rewrites every path to `index.html`.
- `src/components/service/` — the service page template (centred hero, tier boxes, includes band, Technical details, consult CTA).
- **Motion:** `src/lib/smoothScroll.js` runs one Lenis instance (ticked by GSAP; off under reduced motion; `getLenis()` for scroll code). `src/lib/useReveal.js` is the one scroll-entrance grammar (GSAP ScrollTrigger): mark elements `data-reveal` (rise and fade) or `data-reveal="rule"` (a line drawn in), and call `useReveal(rootRef)` once per page root. Waiting elements are opacity-only, never `visibility: hidden`. Motion (`motion/react`) stays for the hero and component state (disclosure, presence).
- `public/brand/` — Aurathus logos and icons. `public/` root — favicons, `site.webmanifest`, `og-image.png`. `public/models/` — 3D assets with their license files.

## Brand

- Company name **Aurathus AI LLC** (`site.companyName`; `site.shortName` is "Aurathus AI"). Domain https://aurathus-ai.com (`site.siteUrl`; `index.html` gets it through `__SITE_URL__`). GitHub repo `tonyneub22/aurathus-ai`.
- Brand pack: `brand-source/aurathus-ai-brand/` (plain assets, never run anything from it). Copies live in `public/brand/` (logos, icons) and the `public/` root (favicons, manifest, og image).
- Every logo is made for dark backgrounds. Never place one on a light surface.
- `aurathus-icon.svg` is ~300 KB with ~680 paths: only as an `<img>` at 64px or larger, never inline. Anything smaller uses `aurathus-icon-small.svg`.
- Site colours stay as defined in `theme.css` (gold `#D4C39A`, black `#090807`, …). The brand pack's artwork colours (`#c9a24a`, `#000`) are for the logo files only.

## Code style

- Small, named modules with one job. If a file needs a scroll bar to read, split it.
- A comment explains *why*, not *what*. Delete code instead of commenting it out.
- Motion must respect `prefers-reduced-motion` (`useReducedMotion` in React, the `reducedMotion` flag in three).
- Links to other sites get `rel="noopener noreferrer"`. Email addresses are shown as text, not only as `mailto:`.
- Mobile first: check every change at 390px wide. The page must never scroll horizontally.
- Accessibility: one `h1` per page, labelled sections, visible focus states, alt text on images, `aria-hidden` on decorative canvases.

## Design direction

Matte warm-black page, matte leather boxes framed in gold (saddle brown; espresso for boxes inside boxes), champagne gold (`#D4C39A` from the logo), bone white. Cormorant Garamond for display type and the wide-tracked small caps (matches the logo lettering); Hanken Grotesk (`font-sans`) for every paragraph, form field and other reading text, at 16–18px, 1.65–1.75 leading, at most ~65ch. No eyebrow labels above headings and no decorative section numbers. One light source. Motion is slow, eased and purposeful; no bouncing, no parallax for its own sake. When in doubt, remove something.
