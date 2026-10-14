import { Link } from 'react-router'
import { site } from '../../../config/site'

/**
 * The brand mark and name, back to the top of the home page from anywhere.
 * Named "Aurathus AI, Home" so the visible words lead the accessible name.
 */
export default function HomeLink() {
  const { home } = site.nav

  return (
    <Link
      to={home.href}
      aria-label={`${site.shortName}, ${home.label}`}
      className="group flex h-11 items-center gap-3 text-aura-text transition-colors duration-500 hover:text-aura-gold-hot focus-visible:text-aura-gold-hot"
    >
      {/* The small mark: the full icon is too heavy below 64px (CLAUDE.md). */}
      <img src="/brand/aurathus-icon-small.svg" width="30" height="30" alt="" className="h-[30px] w-[30px] select-none" draggable={false} />
      <span translate="no" className="font-serif text-[15px] font-medium uppercase tracking-[0.3em]">{site.shortName}</span>
    </Link>
  )
}
