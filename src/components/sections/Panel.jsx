import { motion, useReducedMotion } from 'motion/react'
import { reveal } from './reveal'
import MatteGrain from '../effects/MatteGrain'
import { sectionTitle } from './Section'

/**
 * A section set in one leather box (About): a labelled region with a title
 * and the matte panel surface. Other home sections are unboxed (Section.jsx). `decoration` renders behind the grain and
 * the content (a glow, a background); `boxProps` / `boxClassName` land on the box itself.
 */
export default function Panel({ id, title, decoration, boxProps, boxClassName = '', spacing = 'pb-14', children }) {
  const reduce = useReducedMotion()
  const titleId = `${id}-title`

  return (
    <section
      id={id}
      aria-labelledby={titleId}
      className={`relative z-10 mx-auto w-full max-w-[1180px] px-5 sm:px-10 xl:px-0 ${spacing}`}
    >
      <div
        {...boxProps}
        className={`matte-panel px-6 py-12 sm:px-12 lg:px-16 lg:py-16 ${boxClassName}`}
      >
        {decoration}
        <MatteGrain variant="panel" />
        <div className="relative">
          <motion.h2
            {...reveal(reduce)}
            id={titleId}
            className={sectionTitle}
          >
            {title}
          </motion.h2>
          {children}
        </div>
      </div>
    </section>
  )
}
