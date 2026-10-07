import { site } from '../../config/site'
import StatueCredit from '../brand/StatueCredit'

export default function Footer() {
  return (
    <footer
      id="contact"
      className="relative z-10 mx-auto w-full max-w-[1180px] border-t border-podo-line px-5 pb-14 pt-10 sm:px-10 lg:px-0"
    >
      <div className="flex flex-wrap items-start justify-between gap-x-8 gap-y-4 font-serif text-[13px] font-medium uppercase tracking-[0.28em] text-podo-white/50">
        <span>{site.footer.text}</span>
        <a
          href={`mailto:${site.contact.email}`}
          className="normal-case tracking-[0.12em] text-podo-gold transition hover:text-podo-gold-hot"
        >
          {site.contact.email}
        </a>
        <span>{site.location}</span>
      </div>
      <StatueCredit className="mt-8" />
    </footer>
  )
}
