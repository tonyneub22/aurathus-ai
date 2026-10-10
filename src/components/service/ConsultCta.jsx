import { Link } from 'react-router'
import { site } from '../../config/site'

/** Request Consult for one service, with the email as visible text for anyone who'd rather write. */
export default function ConsultCta({ service, centered = false }) {
  const { email } = site.contact

  return (
    <div className={`flex flex-col gap-5 ${centered ? 'items-center text-center' : 'items-start'}`}>
      <Link
        to={site.servicePage.consultHref(service)}
        className="group inline-flex items-center gap-4 border border-aura-gold/50 px-8 py-4 font-serif text-[13px] font-medium uppercase tracking-[0.34em] text-aura-white transition-colors duration-500 hover:border-aura-gold"
      >
        {site.hero.cta.label}
        <span
          aria-hidden="true"
          className="relative h-px w-7 bg-aura-gold transition-all duration-500 ease-aura after:absolute after:-top-[3px] after:right-0 after:h-[6px] after:w-[6px] after:rotate-45 after:border-r after:border-t after:border-aura-gold motion-safe:group-hover:w-11"
        />
      </Link>
      <a
        href={`mailto:${email}`}
        className="font-serif text-[15px] tracking-[0.12em] text-aura-gold transition-colors duration-500 hover:text-aura-gold-hot"
      >
        {email}
      </a>
    </div>
  )
}
