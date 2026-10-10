import { useReducedMotion } from 'motion/react'
import { site } from '../../config/site'
import { services } from '../../config/services'
import CtaButton from '../layout/CtaButton'
import Panel from './Panel'
import ServiceRow from './ServiceRow'
import { reveal } from './reveal'

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
  const { cta } = site.hero

  return (
    <Panel
      id="services"
      title={site.services.title}
      spacing="pb-14 pt-24"
      // The box stays put (no reveal transform): the beam is aimed at its top edge.
      boxProps={{ 'data-beam-target': '' }}
      decoration={<BeamGlow />}
    >
      <div className="mt-10 grid gap-5 lg:mt-14">
        {services.map((service, i) => (
          <ServiceRow key={service.slug} service={service} index={i} />
        ))}
      </div>
      <CtaButton {...reveal(reduce, 0.2)} to={cta.href} className="mt-12">
        {cta.label}
      </CtaButton>
    </Panel>
  )
}
