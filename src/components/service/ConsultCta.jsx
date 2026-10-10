import { site } from '../../config/site'
import CtaButton from '../layout/CtaButton'

/** Request Consult for one service, with the email as visible text for anyone who'd rather write. */
export default function ConsultCta({ service, centered = false }) {
  const { email } = site.contact

  return (
    <div className={`flex flex-col gap-5 ${centered ? 'items-center text-center' : 'items-start'}`}>
      <CtaButton to={site.servicePage.consultHref(service)}>{site.hero.cta.label}</CtaButton>
      <a
        href={`mailto:${email}`}
        className="font-serif text-[15px] tracking-[0.12em] text-aura-gold transition-colors duration-500 hover:text-aura-gold-hot"
      >
        {email}
      </a>
    </div>
  )
}
