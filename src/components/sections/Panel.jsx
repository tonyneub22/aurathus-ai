import { motion, useReducedMotion } from 'motion/react'
import { reveal } from './reveal'

/**
 * The framed box every home-page section lives in: a labelled region with a
 * title and the raised surface. `decoration` renders behind the content (a glow,
 * a background); `boxProps` / `boxClassName` land on the box itself.
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
        className={`relative border border-aura-line bg-aura-black-2 px-6 py-12 sm:px-12 lg:px-16 lg:py-16 ${boxClassName}`}
      >
        {decoration}
        <div className="relative">
          <motion.h2
            {...reveal(reduce)}
            id={titleId}
            className="font-serif text-[clamp(28px,3vw,40px)] font-light uppercase leading-none tracking-[0.2em] text-aura-white"
          >
            {title}
          </motion.h2>
          {children}
        </div>
      </div>
    </section>
  )
}
