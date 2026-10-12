import { motion, useReducedMotion } from 'motion/react'
import { site } from '../../config/site'
import { reveal } from './reveal'
import ReadMoreLink from './ReadMoreLink'

/**
 * One entry of the Services index: name, card line, Read more, between gold
 * rules. The whole row is the link's hit area. On hover or keyboard focus a
 * brighter rule draws across the top and the name warms to gold.
 */
export default function ServiceIndexRow({ service, index }) {
  const reduce = useReducedMotion()
  const { services } = site

  return (
    <article className="group relative border-b border-aura-gold/25 transition-colors duration-700 ease-aura hover:bg-aura-gold/[0.03]">
      <span
        aria-hidden="true"
        className="absolute inset-x-0 -top-px h-px origin-left scale-x-0 bg-aura-gold transition-transform duration-[600ms] ease-aura group-focus-within:scale-x-100 group-hover:scale-x-100 motion-reduce:transition-none"
      />
      <motion.div
        {...reveal(reduce, index * 0.1)}
        className="grid gap-y-4 py-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)_10.5rem] lg:items-baseline lg:gap-x-12 lg:py-12"
      >
        <h3 className="font-serif text-[clamp(32px,3.4vw,50px)] font-light leading-[1.05] tracking-[0.01em] text-aura-heading transition-colors duration-500 group-focus-within:text-aura-gold-hot group-hover:text-aura-gold-hot">
          {service.name}
        </h3>
        <p className="max-w-[46ch] font-sans text-[17px] leading-[1.7] text-aura-body">{service.cardLine}</p>
        <div className="pt-2 lg:pt-0">
          <ReadMoreLink
            to={`/services/${service.slug}`}
            label={services.readMore}
            ariaLabel={services.readMoreAbout(service.name)}
            stretched
          />
        </div>
      </motion.div>
    </article>
  )
}
