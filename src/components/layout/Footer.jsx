import { site } from '../../config/site'
import StatueCredit from '../brand/StatueCredit'

export default function Footer() {
  return (
    <footer
      id="contact"
      className="relative z-10 mx-auto w-full max-w-[1180px] border-t border-aura-line px-5 pb-14 pt-10 sm:px-10 lg:px-0"
    >
      <a href={site.nav.home.href} className="mb-10 inline-block w-[min(260px,80%)]">
        <img
          src={site.brand.logo.src}
          width={site.brand.logo.width}
          height={site.brand.logo.height}
          alt={site.brand.logoAlt}
          loading="lazy"
          decoding="async"
          className="h-auto w-full select-none"
          draggable={false}
        />
      </a>
      <div className="flex flex-wrap items-start justify-between gap-x-8 gap-y-4 font-serif text-[13px] font-medium uppercase tracking-[0.28em] text-aura-white/50">
        <span>{site.footer.text}</span>
        <a
          href={`mailto:${site.contact.email}`}
          className="normal-case tracking-[0.12em] text-aura-gold transition hover:text-aura-gold-hot"
        >
          {site.contact.email}
        </a>
        <span>{site.location}</span>
      </div>
      <StatueCredit className="mt-8" />
    </footer>
  )
}
