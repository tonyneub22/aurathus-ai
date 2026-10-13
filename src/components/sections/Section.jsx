import { motion, useReducedMotion } from 'motion/react'
import { reveal } from './reveal'

export const sectionTitle = 'font-serif text-[clamp(28px,3vw,40px)] font-light uppercase leading-[1.1] tracking-[0.2em] text-balance text-aura-heading'

/**
 * An unboxed home-page section on the matte page: a labelled region with its
 * title. Space separates sections, not frames. `figure` sets an image in a
 * left column on wide screens with the title and content beside it, and above
 * them on smaller screens. Its glow may spill past the section; the page's
 * <main> clips sideways, so it never widens the page.
 */
export default function Section({ id, title, figure, className = 'py-24 lg:py-32', children }) {
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
      {figure ? (
        <div className="grid items-end gap-14 lg:grid-cols-12 lg:gap-16">
          {/* Bleeds a little past the column on wide screens. */}
          <div className="lg:col-span-5 lg:-ml-10">{figure}</div>
          <div className="lg:col-span-7 lg:pb-6">
            {heading}
            <div className="mt-10 lg:mt-12">{children}</div>
          </div>
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
