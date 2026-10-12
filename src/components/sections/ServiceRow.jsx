import { motion, useReducedMotion } from 'motion/react'
import { site } from '../../config/site'
import { reveal } from './reveal'
import { serviceGlyphs } from './serviceGlyphs'
import ReadMoreLink from './ReadMoreLink'
import MatteGrain from '../effects/MatteGrain'

/**
 * One full-width row of the Services list. Every row uses the same fixed grid
 * template, so the name, card line and Read more columns line up down the list
 * whatever each line's length. The matte box is opaque and never moves; only
 * its content fades in.
 */
export default function ServiceRow({ service, index }) {
  const reduce = useReducedMotion()
  const { services } = site

  return (
    <article className="matte-panel px-5 py-8 sm:px-10 sm:py-10 xl:px-14 xl:py-14">
      <MatteGrain variant="panel" />
      <motion.div
        {...reveal(reduce, index * 0.12)}
        className="relative grid grid-cols-[30px_minmax(0,1fr)] items-start gap-x-5 gap-y-5 xl:grid-cols-[30px_minmax(0,1fr)_minmax(0,1.1fr)_10.5rem] xl:gap-x-10"
      >
        {/* Nudged down to sit on the title's first line. */}
        <div aria-hidden="true" className="mt-1.5 text-aura-gold [&_*]:fill-none [&_*]:stroke-current [&_*]:stroke-[1.25] xl:mt-2">
          {serviceGlyphs[service.slug]}
        </div>
        <h3 className="font-serif text-[clamp(28px,2.6vw,38px)] font-light leading-[1.15] tracking-[0.02em] text-aura-heading">
          {service.name}
        </h3>
        <p className="col-span-2 max-w-[45ch] font-serif text-[17px] leading-[1.75] text-aura-muted xl:col-span-1 xl:mt-1">
          {service.cardLine}
        </p>
        <div className="col-span-2 flex xl:col-span-1 xl:mt-2.5">
          <ReadMoreLink
            to={`/services/${service.slug}`}
            label={services.readMore}
            ariaLabel={services.readMoreAbout(service.name)}
          />
        </div>
      </motion.div>
    </article>
  )
}
