# Podocyte AI — Placeholder Site

A minimal "website upgrade in progress" landing page. Vite + React + Tailwind CSS v4 + Motion.

## Running locally

```bash
npm install
npm run dev
```

Build for production:

```bash
npm run build
npm run preview
```

## Where things live

- **Copy & contact info:** `src/config/site.js` — every piece of text on the page (company name, tagline, headline, contact name/email, footer) lives here. No copy is hardcoded in components.
- **Brand colors & fonts:** `src/styles/theme.css` — Tailwind v4 `@theme` tokens (`--color-podo-black`, `--color-podo-gold`, `--color-podo-white`, `--font-serif`, `--font-sans`). Change a value here and it propagates everywhere.
- **Reusable brand components:** `src/components/brand/` — `Logo.jsx` (wordmark + glow) and `BuildingIndicator.jsx` (rotating-arc icon). These are meant to survive the full revamp.
- **Brand assets:** `public/brand/` — logo, favicon, and touch-icon exports. Sourced from `brand-source/`.
- **The only page:** `src/pages/UnderConstruction.jsx`, rendered by `src/App.jsx`.

## Starting the full revamp

1. Create a branch: `git checkout -b redesign`
2. Delete `src/pages/UnderConstruction.jsx`
3. Keep `src/config/site.js`, `src/styles/theme.css`, and `src/components/brand/`
4. Add a router (e.g. `react-router`) and build out real pages in `src/pages/`
5. Update `src/App.jsx` to render the router instead of the single placeholder page

## Notes

- The source logo (`brand-source/Podocyte AI logo@1x.png`) has an alpha channel but is fully opaque — its background is `#0A0A0C`, which is a near-exact match for the page background (`#0A0A0B`), so it reads as transparent on the page. If you ever need a true cutout (e.g. for placing the logo over a different background), re-export it from the source PDF/vector with transparency.
- The brand gold (`--color-podo-gold`, `#D4C39A`) was sampled directly from the logo's ring mark.
- Favicon assets in `public/brand/` (`favicon.ico`, `favicon-16.png`, `favicon-32.png`, `apple-touch-icon.png`, `icon-192.png`, `icon-512.png`) were cropped from the podocyte ring ("O") mark in the logo.
