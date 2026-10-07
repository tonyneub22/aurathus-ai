import { site } from '../../../config/site'

/** Thin-line house that returns to the top of the home page, from any page. */
export default function HomeLink() {
  const { home } = site.nav

  return (
    <a
      href={home.href}
      aria-label={home.label}
      className="flex h-11 w-11 items-center justify-center text-aura-white transition-colors duration-500 hover:text-aura-gold focus-visible:text-aura-gold"
    >
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1" aria-hidden="true">
        <path d="M3 11.5 12 4l9 7.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M5.5 9.5V20h13V9.5" strokeLinejoin="round" />
        <path d="M10 20v-5.5h4V20" strokeLinejoin="round" />
      </svg>
    </a>
  )
}
