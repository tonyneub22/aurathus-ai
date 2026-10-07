import { useEffect } from 'react'
import { site } from '../config/site'
import ConsultForm from '../components/consult/ConsultForm'
import SiteHeader from '../components/layout/header/SiteHeader'

export default function ConsultRequest() {
  const { consult } = site

  useEffect(() => {
    document.title = `${consult.title} — ${site.companyName}`
  }, [consult.title])

  return (
    <>
      <div className="grain" aria-hidden="true" />
      <SiteHeader />
      <div className="relative z-10 mx-auto w-full max-w-[720px] px-5 pb-20 pt-32 sm:px-10">
        <main>
          <section aria-labelledby="consult-title">
            <p className="font-serif text-[13px] font-medium uppercase tracking-[0.3em] text-aura-gold/70">
              {consult.eyebrow}
            </p>
            <h1
              id="consult-title"
              className="mt-4 font-serif text-[clamp(36px,6vw,64px)] font-light uppercase leading-[1.05] tracking-[0.08em] text-aura-white"
            >
              {consult.title}
            </h1>
            <p className="mb-12 mt-5 max-w-[46ch] font-serif text-[18px] leading-relaxed text-aura-white/60">
              {consult.intro}
            </p>
            <ConsultForm />
          </section>
        </main>

        <a
          href="/"
          className="mt-16 inline-block font-serif text-[13px] font-medium uppercase tracking-[0.28em] text-aura-white/50 transition-colors hover:text-aura-white"
        >
          {consult.back}
        </a>
      </div>
    </>
  )
}
