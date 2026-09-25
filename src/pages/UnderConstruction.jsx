import { motion } from 'motion/react'
import { site } from '../config/site'
import Logo from '../components/brand/Logo'
import BuildingIndicator from '../components/brand/BuildingIndicator'

export default function UnderConstruction() {
  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center bg-podo-black px-6 py-16 text-center">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="flex w-full max-w-lg flex-col items-center"
      >
        <Logo className="w-full" />

        <p className="mt-6 font-sans text-xs uppercase tracking-[0.35em] text-podo-gold">
          {site.tagline}
        </p>

        <h1 className="mt-4 font-serif text-3xl font-medium text-podo-white sm:text-4xl">
          {site.headline}
        </h1>

        <BuildingIndicator className="mt-8" />

        <div className="mt-10 flex flex-col items-center gap-1 font-sans text-sm text-podo-white/80">
          <span>
            {site.contact.label} —{' '}
            <span className="text-podo-white">{site.contact.name}</span>
          </span>
          <a
            href={`mailto:${site.contact.email}`}
            className="text-podo-gold underline decoration-podo-gold/40 underline-offset-4 transition hover:decoration-podo-gold"
          >
            {site.contact.email}
          </a>
        </div>
      </motion.div>

      <footer className="mt-16 font-sans text-[11px] tracking-wide text-podo-white/40">
        {site.footer.text}
      </footer>
    </main>
  )
}
