import { motion, useReducedMotion } from 'motion/react'
import { site } from '../../config/site'
import Panel from './Panel'
import { reveal } from './reveal'

const GLYPHS = [
  // window / site
  <svg key="web" viewBox="0 0 40 40" className="h-10 w-10" aria-hidden="true">
    <rect x="3" y="7" width="34" height="24" rx="1" />
    <path d="M3 13h34M9 10h2M13 10h2" />
  </svg>,
  // target / system
  <svg key="sw" viewBox="0 0 40 40" className="h-10 w-10" aria-hidden="true">
    <path d="M8 20h24M20 8v24" />
    <circle cx="20" cy="20" r="14" />
    <circle cx="20" cy="20" r="3" />
  </svg>,
  // spark
  <svg key="ai" viewBox="0 0 40 40" className="h-10 w-10" aria-hidden="true">
    <path d="M20 5l4 11 11 4-11 4-4 11-4-11-11-4 11-4z" />
  </svg>,
]

const BLOOM = 'radial-gradient(ellipse at center, color-mix(in srgb, var(--color-aura-ring) 22%, transparent), transparent 70%)'

/**
 * Where the beam lands: a brighter stretch of the top border and a soft bloom
 * either side of it. ServicesBeam sets --beam-x (landing point) and
 * --beam-glow (0..1, tracks the beam's own opacity) on the box.
 */
function BeamGlow() {
  const place = { left: 'var(--beam-x, 50%)', opacity: 'var(--beam-glow, 0)' }
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0">
      <div className="absolute -top-px h-px w-[min(360px,70%)] -translate-x-1/2 bg-gradient-to-r from-transparent via-aura-ring to-transparent transition-opacity duration-1000" style={place} />
      <div className="absolute top-0 h-20 w-[min(520px,90%)] -translate-x-1/2 -translate-y-1/2 transition-opacity duration-1000" style={{ ...place, background: BLOOM }} />
    </div>
  )
}

export default function Services() {
  const reduce = useReducedMotion()
  const { services } = site

  return (
    <Panel
      id="services"
      title={services.title}
      spacing="pb-14 pt-24"
      // The box stays put (no reveal transform): the beam is aimed at its top edge.
      boxProps={{ 'data-beam-target': '' }}
      decoration={<BeamGlow />}
    >
      <div className="mt-10 grid divide-y divide-aura-line border-t border-aura-line md:grid-cols-3 md:divide-x md:divide-y-0 lg:mt-14">
        {services.items.map((item, i) => (
          <article
            key={item.title}
            className="min-w-0 py-10 transition-colors duration-700 hover:bg-aura-black/40 md:px-8 md:first:pl-0 md:last:pr-0"
          >
            <motion.div {...reveal(reduce, i * 0.12)} className="grid content-start gap-4">
              <div className="text-aura-gold [&_*]:fill-none [&_*]:stroke-current [&_*]:stroke-[1]">
                {GLYPHS[i]}
              </div>
              <h3 className="font-serif text-[28px] font-normal leading-[1.1] tracking-[0.04em] text-aura-white">
                {item.title}
              </h3>
              <p className="max-w-[34ch] font-serif text-[17px] leading-relaxed text-aura-white/60">
                {item.body}
              </p>
              <small className="font-serif text-[13px] font-medium uppercase tracking-[0.28em] text-aura-gold/70">
                {item.meta}
              </small>
            </motion.div>
          </article>
        ))}
      </div>
    </Panel>
  )
}
