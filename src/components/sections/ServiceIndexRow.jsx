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
        className="grid grid-cols-[minmax(0,1fr)_auto] gap-x-6 gap-y-3 py-6 md:grid-cols-[minmax(0,4fr)_minmax(0,6fr)_9.5rem] md:items-baseline md:gap-x-10 lg:py-7"
      >
        <h3 className="font-serif text-[clamp(24px,2.3vw,32px)] font-normal leading-[1.15] tracking-[0.01em] text-aura-heading transition-colors duration-500 group-focus-within:text-aura-gold-hot group-hover:text-aura-gold-hot">
          {service.name}
        </h3>
        <p className="col-span-2 max-w-[52ch] font-sans md:col-span-1 text-[16px] leading-[1.6] text-aura-body">{service.cardLine}</p>
        {/* Phones: the arrow alone, beside the name. Wider: the full Read more in its own column.
            Never positioned itself, so the stretched link still covers the whole row. */}
        <div className="col-start-2 row-start-1 self-center md:col-start-auto md:row-start-auto md:self-auto">
          <ReadMoreLink
            to={`/services/${service.slug}`}
            label={services.readMore}
            ariaLabel={services.readMoreAbout(service.name)}
            stretched
            compact
          />
        </div>
      </motion.div>
    </article>
  )
}
