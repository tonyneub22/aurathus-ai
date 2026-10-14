import { useRef } from 'react'
import { Link, useParams } from 'react-router'
import { site } from '../config/site'
import { serviceBySlug } from '../config/services'
import usePageMeta from '../lib/usePageMeta'
import useReveal from '../lib/useReveal'
import SiteHeader from '../components/layout/header/SiteHeader'
import Footer from '../components/layout/Footer'
import ConsultCta from '../components/service/ConsultCta'
import TierGrid from '../components/service/TierGrid'
import IncludesBand from '../components/service/IncludesBand'
import TechnicalDetails from '../components/service/TechnicalDetails'
import NotFound from './NotFound'
import { sectionTitle } from '../components/sections/sectionTitle'

const container = 'mx-auto w-full max-w-[1180px] px-5 sm:px-10 xl:px-0'

/** /services/:slug. One template for every service; unknown slugs get the 404. */
export default function ServicePage() {
  const service = serviceBySlug(useParams().slug)
  // Keyed by slug so moving between services starts fresh (dropdown closed, ring redrawn).
  return service ? <ServiceDetail key={service.slug} service={service} /> : <NotFound />
}

function ServiceDetail({ service }) {
  const page = site.servicePage
  usePageMeta(`${service.name} — ${site.companyName}`, service.cardLine)
  const main = useRef(null)
  useReveal(main)

  return (
    <>
      <SiteHeader />
      {/* Clip so the title ring never widens the page. */}
      <main ref={main} className="relative z-10 overflow-x-clip">
        <section aria-labelledby="service-title" className={`relative pb-16 pt-32 lg:pb-24 lg:pt-44 ${container}`}>
          <div className="relative mx-auto flex max-w-[60ch] flex-col items-center text-center">
            <h1
              id="service-title"
              className="max-w-[16ch] font-serif text-[clamp(34px,5vw,68px)] font-light uppercase leading-[1.02] tracking-[0.08em] text-balance text-aura-heading"
            >
              {service.name}
            </h1>
            <p className="mt-7 max-w-[46ch] font-sans text-[17px] leading-[1.7] text-aura-body lg:text-[18px]">
              {service.startLine}
            </p>
            <div className="mt-10">
              <ConsultCta service={service} centered />
            </div>
            <p className="mt-8 font-sans text-[15px] text-aura-muted">{service.pricingNote}</p>
          </div>
        </section>

        <section aria-labelledby="plans-title" className={`pb-16 lg:pb-20 ${container}`}>
          <h2 id="plans-title" data-reveal="" className={`mb-8 text-center lg:mb-10 ${sectionTitle}`}>
            {page.plans}
          </h2>
          <TierGrid tiers={service.tiers} />
          {service.includes && <IncludesBand includes={service.includes} />}
        </section>

        <div className={`pb-16 lg:pb-24 ${container}`}>
          <TechnicalDetails id="technical" label={page.technical} paragraphs={service.technical} />
        </div>

        <div className={`flex flex-col items-center gap-16 pb-20 ${container}`}>
          <ConsultCta service={service} centered />
          <Link
            to={page.back.href}
            className="font-serif text-[13px] font-medium uppercase tracking-[0.28em] text-aura-muted transition-colors duration-500 hover:text-aura-heading"
          >
            {page.back.label}
          </Link>
        </div>
      </main>
      <Footer />
    </>
  )
}
