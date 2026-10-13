import { motion, useReducedMotion } from 'motion/react'
import { EASE, reveal } from '../sections/reveal'
import MatteGrain from '../effects/MatteGrain'

const small = 'font-serif text-[12px] font-medium uppercase tracking-[0.28em]'

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
      className="matte-panel flex h-full flex-col overflow-visible p-6 sm:p-7 lg:p-8"
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
        <p className={`${small} flex flex-wrap justify-between gap-x-4 gap-y-1`}>
          <span className="text-aura-muted">{tier.label}</span>
          <span className="text-aura-gold">{tier.timeline}</span>
        </p>
        <h3 id={titleId} className="mt-4 font-serif text-[26px] font-normal leading-[1.15] tracking-[0.03em] text-aura-heading">
          {tier.name}
        </h3>
        <p className="mt-4 border-t border-aura-line pt-4 font-sans text-[16px] leading-[1.65] text-aura-body">{tier.body}</p>
      </div>
    </motion.article>
  )
}
