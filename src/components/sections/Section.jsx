import { motion, useReducedMotion } from 'motion/react'
import { reveal } from './reveal'

export const sectionTitle = 'font-serif text-[clamp(28px,3vw,40px)] font-light uppercase leading-[1.1] tracking-[0.2em] text-balance text-aura-heading'

/**
 * An unboxed home-page section on the matte page: a labelled region with its
 * title. Space separates sections, not frames. `aside` sets the title in a
 * left column on wide screens, with the content beside it.
 */
export default function Section({ id, title, aside = false, className = 'py-28 lg:py-40', children }) {
  const reduce = useReducedMotion()
  const titleId = `${id}-title`
  const heading = (
    <motion.h2 {...reveal(reduce)} id={titleId} className={sectionTitle}>
      {title}
    </motion.h2>
  )

  return (
    <section
      id={id}
      aria-labelledby={titleId}
      className={`relative z-10 mx-auto w-full max-w-[1180px] px-5 sm:px-10 xl:px-0 ${className}`}
    >
      {aside ? (
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-4">{heading}</div>
          <div className="lg:col-span-8">{children}</div>
        </div>
      ) : (
        <>
          {heading}
          {children}
        </>
      )}
    </section>
  )
}
