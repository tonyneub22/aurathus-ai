# Aurathus AI LLC: brand assets

Grey engraved marble head, black field, gold rim. Wordmark set in **Cormorant Garamond** (SemiBold, with LLC in Medium). The text is converted to outlines, so it renders the same everywhere without loading the font.

## Where each file goes (Vite + React)
Put everything in `public/`, so it's served from the site root.

| File | Use |
|---|---|
| `aurathus-logo-horizontal.svg` | Header/nav logo (icon + AURATHUS AI LLC) |
| `aurathus-logo-stacked.svg` | Hero, footer, or centered layouts |
| `aurathus-icon.svg` | Standalone mark at 64px and larger |
| `aurathus-icon-small.svg` | Mark below 64px (solid silhouette) |
| `favicon.ico`, `favicon-16x16.png`, `favicon-32x32.png` | Browser tab |
| `apple-touch-icon.png` (180, black background) | iOS home screen |
| `icon-192.png`, `icon-512.png`, `site.webmanifest` | Android / PWA |
| `og-image.png` (1200x630) | Link previews (iMessage, LinkedIn, Slack, X) |
| `aurathus-icon-1024.png`, `aurathus-logo-*.png` | Raster copies for social profiles, docs, email signatures |

All logos are built for dark backgrounds. The gold and grey artwork won't read well on white.

## index.html <head>
```html
<link rel="icon" href="/favicon.ico" sizes="any">
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<link rel="manifest" href="/site.webmanifest">
<meta name="theme-color" content="#000000">
<meta property="og:image" content="https://YOUR-DOMAIN/og-image.png">
<meta property="og:title" content="Aurathus AI LLC">
<meta name="twitter:card" content="summary_large_image">
```

## Header logo
```jsx
<a href="/" aria-label="Aurathus AI LLC home">
  <img src="/aurathus-logo-horizontal.svg" alt="Aurathus AI LLC" height="48" />
</a>
```
Use `<img>` for `aurathus-icon.svg` rather than inlining it. It holds about 680 paths (~300 KB), and as an `<img>` the browser caches it.

## Brand colors
- Black field `#0b0b0b` / `#000000`
- Gold `#c9a24a` (rule lines), gradient `#f6e2a2` → `#d9b65e` → `#a87f2f`
- Stone grey `#f4f4f2` → `#c4c4c2` → `#7d7d7b`

## Font for site text
```html
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600&display=swap" rel="stylesheet">
```
