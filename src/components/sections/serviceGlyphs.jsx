// Thin line glyphs for the service rows. Stroke and colour come from the row.
const svg = { viewBox: '0 0 40 40', className: 'h-[30px] w-[30px]', 'aria-hidden': true }

export const serviceGlyphs = {
  // window / site
  'web-development': (
    <svg {...svg}>
      <rect x="3" y="7" width="34" height="24" rx="1" />
      <path d="M3 13h34M9 10h2M13 10h2" />
    </svg>
  ),
  // spark
  'ai-integration': (
    <svg {...svg}>
      <path d="M20 5l4 11 11 4-11 4-4 11-4-11-11-4 11-4z" />
    </svg>
  ),
  // </> code brackets
  'software-development': (
    <svg {...svg}>
      <path d="M13 12l-8 8 8 8M27 12l8 8-8 8M23 8l-6 24" />
    </svg>
  ),
  // camera
  video: (
    <svg {...svg}>
      <rect x="3" y="12" width="24" height="17" rx="1" />
      <path d="M27 18l10-5v15l-10-5z" />
      <circle cx="10" cy="17" r="1.5" />
    </svg>
  ),
}
