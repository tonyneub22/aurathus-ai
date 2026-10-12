import { Link, useSearchParams } from 'react-router'
import { site } from '../config/site'
import { serviceBySlug } from '../config/services'
import usePageMeta from '../lib/usePageMeta'
import ConsultForm from '../components/consult/ConsultForm'
import SiteHeader from '../components/layout/header/SiteHeader'
import MatteGrain from '../components/effects/MatteGrain'

export default function ConsultRequest() {
  const { consult } = site
  const [params] = useSearchParams()
  // Arriving from a service page (?service=video) preselects that service.
  const interest = serviceBySlug(params.get('service'))?.interest

  usePageMeta(`${consult.title} — ${site.companyName}`, consult.intro)

  return (
    <>
      <SiteHeader />
      <div className="relative z-10 mx-auto w-full max-w-[720px] px-5 pb-20 pt-32 sm:px-10">
        <main>
          <section aria-labelledby="consult-title">
            <h1
              id="consult-title"
              className="font-serif text-[clamp(36px,6vw,64px)] font-light uppercase leading-[1.05] tracking-[0.08em] text-aura-heading"
            >
              {consult.title}
            </h1>
            <p className="mb-12 mt-5 max-w-[46ch] font-sans text-[18px] leading-[1.65] text-aura-body">
              {consult.intro}
            </p>
            <div className="matte-panel px-6 py-10 sm:px-10 sm:py-12">
              <MatteGrain variant="panel" />
              <div className="relative">
                <ConsultForm interest={interest} />
              </div>
            </div>
          </section>
        </main>

        <Link
          to="/"
          className="mt-16 inline-block font-serif text-[13px] font-medium uppercase tracking-[0.28em] text-aura-muted transition-colors hover:text-aura-heading"
        >
          {consult.back}
        </Link>
      </div>
    </>
  )
}
