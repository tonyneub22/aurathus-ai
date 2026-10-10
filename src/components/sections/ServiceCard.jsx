import { motion, useReducedMotion } from 'motion/react'
import { site } from '../../config/site'
import { reveal } from './reveal'
import { serviceGlyphs } from './serviceGlyphs'
import ReadMoreLink from './ReadMoreLink'

/**
 * One cell of the Services grid. The cell is opaque so the hairlines between
 * cells never flash while the content fades in; Read more sits at the foot so
 * buttons line up across a row whatever the card line's length.
 */
export default function ServiceCard({ service, index }) {
  const reduce = useReducedMotion()
  const { services } = site

  return (
    <article className="flex min-w-0 bg-aura-black-2 py-10 transition-colors duration-700 hover:bg-aura-black sm:px-8 sm:py-12 sm:odd:pl-0 sm:even:pr-0">
      <motion.div {...reveal(reduce, index * 0.12)} className="flex w-full flex-col gap-4">
        <div className="text-aura-gold [&_*]:fill-none [&_*]:stroke-current [&_*]:stroke-[1]">
          {serviceGlyphs[service.slug]}
        </div>
        <h3 className="font-serif text-[28px] font-normal leading-[1.1] tracking-[0.04em] text-aura-white">
          {service.name}
        </h3>
        <p className="max-w-[40ch] font-serif text-[17px] leading-relaxed text-aura-white/60">{service.cardLine}</p>
        <div className="mt-auto flex pt-6">
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
