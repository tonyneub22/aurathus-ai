import { useEffect } from 'react'
import { site } from '../config/site'
import ConsultForm from '../components/consult/ConsultForm'

export default function ConsultRequest() {
  const { consult } = site

  useEffect(() => {
    document.title = `${consult.title} — ${site.companyName}`
  }, [consult.title])

  return (
    <>
      <div className="grain" aria-hidden="true" />
      <div className="relative z-10 mx-auto w-full max-w-[720px] px-5 pb-20 pt-7 sm:px-10">
        <header className="mb-16">
          <a href="/" aria-label={`${site.companyName} home`} className="inline-flex">
            <img
              src={site.brand.wordmark}
              alt={site.brand.logoAlt}
              width="800"
              height="96"
              className="h-[18px] w-auto select-none sm:h-[22px]"
              draggable={false}
            />
          </a>
        </header>

        <main>
          <section aria-labelledby="consult-title">
            <p className="font-serif text-[13px] font-medium uppercase tracking-[0.3em] text-podo-gold/70">
              {consult.eyebrow}
            </p>
            <h1
              id="consult-title"
              className="mt-4 font-serif text-[clamp(36px,6vw,64px)] font-light uppercase leading-[1.05] tracking-[0.08em] text-podo-white"
            >
              {consult.title}
            </h1>
            <p className="mb-12 mt-5 max-w-[46ch] font-serif text-[18px] leading-relaxed text-podo-white/60">
              {consult.intro}
            </p>
            <ConsultForm />
          </section>
        </main>

        <a
          href="/"
          className="mt-16 inline-block font-serif text-[13px] font-medium uppercase tracking-[0.28em] text-podo-white/50 transition-colors hover:text-podo-white"
        >
          {consult.back}
        </a>
      </div>
    </>
  )
}
