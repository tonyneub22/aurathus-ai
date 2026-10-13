import { useReducedMotion } from 'motion/react'
import { site } from '../../config/site'
import { services } from '../../config/services'
import CtaButton from '../layout/CtaButton'
import Section from './Section'
import ServiceIndexRow from './ServiceIndexRow'
import { reveal } from './reveal'

const BLOOM = 'radial-gradient(ellipse at center, color-mix(in srgb, var(--color-aura-ring) 22%, transparent), transparent 70%)'

/**
 * Where the beam lands: a brighter stretch of the index's top rule and a soft
 * bloom either side of it. ServicesBeam sets --beam-x (landing point) and
 * --beam-glow (0..1, tracks the beam's own opacity) on the rule.
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

/** The services as an editorial index on the matte page: no boxes, gold rules between entries. */
export default function Services() {
  const reduce = useReducedMotion()
  const { cta } = site.hero

  return (
    <Section id="services" title={site.services.title} className="pb-24 pt-24 lg:pb-32">
      {/* The beam is aimed at this rule; it stays put (no reveal transform). */}
      <div data-beam-target="" className="relative mt-10 border-t border-aura-gold/25 lg:mt-12">
        <BeamGlow />
        {services.map((service, i) => (
          <ServiceIndexRow key={service.slug} service={service} index={i} />
        ))}
      </div>
      <CtaButton {...reveal(reduce, 0.2)} to={cta.href} className="mt-12">
        {cta.label}
      </CtaButton>
    </Section>
  )
}
