import { motion, useReducedMotion } from 'motion/react'
import { EASE, reveal } from '../sections/reveal'
import MatteGrain from '../effects/MatteGrain'

const small = 'font-serif text-[13px] font-medium uppercase tracking-[0.3em]'

/** One plan. A gold rule draws across the top as it reveals, staggered by `index`. */
export default function TierCard({ tier, index }) {
  const reduce = useReducedMotion()
  const titleId = `tier-${index + 1}-title`

  return (
    <motion.article
      {...reveal(reduce, index * 0.15)}
      aria-labelledby={titleId}
      data-testid="tier"
      // Unclipped, so the gold rule can draw over the top border.
      className="matte-panel flex h-full flex-col overflow-visible p-8 lg:p-10"
    >
      <motion.span
        aria-hidden="true"
        className="absolute -left-[2px] -right-[2px] -top-[2px] z-[1] h-[2px] origin-left bg-aura-gold"
        initial={reduce ? false : { scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 1.4, delay: 0.3 + index * 0.18, ease: EASE }}
      />
      <MatteGrain variant="panel" />
      <div className="relative flex flex-1 flex-col">
        <p className={`${small} text-aura-muted`}>{tier.label}</p>
        <h3 id={titleId} className="mt-4 font-serif text-[30px] font-normal leading-[1.1] tracking-[0.04em] text-aura-heading">
          {tier.name}
        </h3>
        <p className={`${small} mt-6 border-t border-aura-line pt-5 leading-relaxed text-aura-gold`}>{tier.timeline}</p>
        <p className="mt-6 font-serif text-[17px] leading-relaxed text-aura-muted">{tier.body}</p>
      </div>
    </motion.article>
  )
}
