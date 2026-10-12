import { Link } from 'react-router'
import { site } from '../config/site'
import usePageMeta from '../lib/usePageMeta'
import SiteHeader from '../components/layout/header/SiteHeader'
import Footer from '../components/layout/Footer'

/** Unknown paths and unknown service slugs. */
export default function NotFound() {
  const { notFound } = site
  usePageMeta(`${notFound.title} — ${site.companyName}`, notFound.body)

  return (
    <>
      <SiteHeader />
      <main className="relative z-10 mx-auto flex min-h-[70svh] w-full max-w-[1180px] flex-col justify-center px-5 pb-20 pt-36 sm:px-10 xl:px-0">
        <section aria-labelledby="not-found-title">
          <h1
            id="not-found-title"
            className="font-serif text-[clamp(36px,6vw,72px)] font-light uppercase leading-[1.05] tracking-[0.08em] text-aura-heading"
          >
            {notFound.title}
          </h1>
          <p className="mt-6 max-w-[46ch] font-serif text-[clamp(18px,1.6vw,21px)] leading-relaxed text-aura-muted">
            {notFound.body}
          </p>
          <Link
            to="/"
            className="mt-12 inline-block font-serif text-[13px] font-medium uppercase tracking-[0.28em] text-aura-gold transition-colors duration-500 hover:text-aura-gold-hot"
          >
            {site.consult.back}
          </Link>
        </section>
      </main>
      <Footer />
    </>
  )
}
