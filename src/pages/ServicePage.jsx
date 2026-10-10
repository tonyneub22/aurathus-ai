import { Link, useParams } from 'react-router'
import { site } from '../config/site'
import { serviceBySlug } from '../config/services'
import usePageMeta from '../lib/usePageMeta'
import SiteHeader from '../components/layout/header/SiteHeader'
import Footer from '../components/layout/Footer'
import TitleRing from '../components/service/TitleRing'
import ConsultCta from '../components/service/ConsultCta'
import TierGrid from '../components/service/TierGrid'
import IncludesBand from '../components/service/IncludesBand'
import TechnicalDetails from '../components/service/TechnicalDetails'
import NotFound from './NotFound'

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

  return (
    <>
      <div className="grain" aria-hidden="true" />
      <SiteHeader />
      {/* Clip so the title ring never widens the page. */}
      <main className="relative z-10 overflow-x-clip">
        <section aria-labelledby="service-title" className={`relative pb-20 pt-36 lg:pb-28 lg:pt-52 ${container}`}>
          <TitleRing />
          <div className="relative">
            <h1
              id="service-title"
              className="max-w-[14ch] font-serif text-[clamp(34px,7vw,84px)] font-light uppercase leading-[1] tracking-[0.08em] text-aura-white"
            >
              {service.name}
            </h1>
            <p className="mt-8 max-w-[60ch] font-serif text-[clamp(19px,1.6vw,22px)] font-light leading-relaxed text-aura-white/80">
              {service.startLine}
            </p>
            <div className="mt-12">
              <ConsultCta service={service} />
            </div>
            <p className="mt-10 font-serif text-[17px] italic text-aura-white/50">{service.pricingNote}</p>
          </div>
        </section>

        <section aria-labelledby="plans-title" className={`pb-16 lg:pb-20 ${container}`}>
          <h2
            id="plans-title"
            className="mb-10 font-serif text-[clamp(28px,3vw,40px)] font-light uppercase leading-none tracking-[0.2em] text-aura-white lg:mb-14"
          >
            {page.plans}
          </h2>
          <TierGrid tiers={service.tiers} />
          {service.includes && <IncludesBand includes={service.includes} />}
        </section>

        <div className={`pb-20 lg:pb-28 ${container}`}>
          <TechnicalDetails id="technical" label={page.technical} paragraphs={service.technical} />
        </div>

        <div className={`flex flex-col items-center gap-16 pb-20 ${container}`}>
          <ConsultCta service={service} centered />
          <Link
            to={page.back.href}
            className="font-serif text-[13px] font-medium uppercase tracking-[0.28em] text-aura-white/50 transition-colors duration-500 hover:text-aura-white"
          >
            {page.back.label}
          </Link>
        </div>
      </main>
      <Footer />
    </>
  )
}
