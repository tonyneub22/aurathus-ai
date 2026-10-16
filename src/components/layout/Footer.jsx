import { Link } from 'react-router'
import { site } from '../../config/site'
import StatueCredit from '../brand/StatueCredit'

const meta = 'font-serif text-[13px] font-medium uppercase tracking-[0.28em] text-aura-muted'

/** A small gold dot between footer items. */
function Dot({ className = '' }) {
  return <span aria-hidden="true" className={`h-1 w-1 shrink-0 rounded-full bg-aura-gold/70 ${className}`} />
}

/**
 * Compact footer. Phones: a centred stack (logo, email, location, ©; tracked
 * caps are too wide to share a line at 390px).
 * Tablets: the logo, then one wrapped line. Wide screens: one row, the logo
 * left, email · location in the middle, © right. `credit`: show the CC BY
 * statue credit underneath; only pages that show the statue (home) need it.
 */
export default function Footer({ credit = false }) {
  const { footer: logo, logoAlt } = site.brand
  const { email } = site.contact

  return (
    <footer
      id="contact"
      className="relative z-10 mx-auto w-full max-w-[1180px] border-t border-aura-line px-5 py-7 sm:px-10 lg:px-0 lg:py-8"
    >
      <div className="grid justify-items-center gap-3 text-center md:justify-items-start md:text-left lg:grid-cols-[auto_1fr_auto] lg:items-center lg:gap-10">
        <Link to={site.nav.home.href} className="inline-flex opacity-90 transition-opacity duration-500 ease-aura hover:opacity-100 focus-visible:opacity-100">
          <img
            src={logo.src}
            width={logo.width}
            height={logo.height}
            alt={logoAlt}
            loading="lazy"
            decoding="async"
            draggable={false}
            className="h-7 w-auto select-none md:h-8 lg:h-[34px]"
          />
        </Link>
        <p className={`flex flex-wrap items-center justify-center gap-x-3 gap-y-2 md:justify-start lg:justify-center ${meta}`}>
          {/* Phones: each item on its own line. Tablets: one wrapped line. */}
          <a
            href={`mailto:${email}`}
            className="basis-full normal-case tracking-[0.12em] text-aura-gold transition-colors duration-500 hover:text-aura-gold-hot md:basis-auto"
          >
            {email}
          </a>
          <Dot className="hidden md:block" />
          <span>{site.location}</span>
          {/* Wide screens set © in its own column at the right instead. */}
          <Dot className="hidden md:block lg:hidden" />
          <span className="basis-full md:basis-auto lg:hidden">{site.footer.text}</span>
        </p>
        <p className={`hidden lg:block ${meta}`}>{site.footer.text}</p>
      </div>
      {credit && <StatueCredit className="mx-auto mt-5 text-pretty text-center md:mx-0 md:max-w-none md:text-left" />}
    </footer>
  )
}
