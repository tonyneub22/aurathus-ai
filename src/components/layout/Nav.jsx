import { motion, useReducedMotion } from 'motion/react'
import { site } from '../../config/site'

/** Top bar: wordmark left, section links right. Fades in after the hero intro. */
export default function Nav() {
  const reduceMotion = useReducedMotion()

  return (
    <motion.header
      className="relative z-10 flex items-center justify-between gap-6 px-5 py-7 sm:px-10 lg:px-16"
      initial={reduceMotion ? false : { opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.2, delay: reduceMotion ? 0 : 1.8, ease: [0.2, 0.7, 0.2, 1] }}
    >
      <a href="#top" className="flex items-center" aria-label={`${site.companyName} home`}>
        <img
          src={site.brand.wordmark}
          alt={site.brand.logoAlt}
          width="800"
          height="96"
          className="h-[18px] w-auto select-none sm:h-[22px]"
          draggable={false}
        />
      </a>

      <nav aria-label="Primary" className="hidden sm:block">
        <ul className="flex gap-8 font-serif text-[13px] font-medium uppercase tracking-[0.28em] text-podo-white/60 lg:gap-10">
          {site.nav.map((item) => (
            <li key={item.label}>
              <a
                href={item.href}
                className="group relative py-1.5 transition-colors duration-500 hover:text-podo-white"
              >
                {item.label}
                <span
                  aria-hidden="true"
                  className="absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-podo-gold transition-transform duration-500 ease-podo group-hover:scale-x-100"
                />
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </motion.header>
  )
}
