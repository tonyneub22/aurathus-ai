import { motion, useReducedMotion } from 'motion/react'
import { EASE, reveal } from '../sections/reveal'

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
      className="relative flex h-full flex-col border border-aura-line bg-aura-black-2 p-8 transition-[border-color,box-shadow] duration-700 ease-aura hover:border-aura-gold/60 hover:shadow-[inset_0_0_56px_-24px_color-mix(in_srgb,var(--color-aura-gold)_45%,transparent)] lg:p-10"
    >
      <motion.span
        aria-hidden="true"
        className="absolute inset-x-0 -top-px h-px origin-left bg-aura-gold"
        initial={reduce ? false : { scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 1.4, delay: 0.3 + index * 0.18, ease: EASE }}
      />
      <p className={`${small} text-aura-white/50`}>{tier.label}</p>
      <h3 id={titleId} className="mt-4 font-serif text-[30px] font-normal leading-[1.1] tracking-[0.04em] text-aura-white">
        {tier.name}
      </h3>
      <p className={`${small} mt-6 border-t border-aura-line pt-5 leading-relaxed text-aura-gold`}>{tier.timeline}</p>
      <p className="mt-6 font-serif text-[17px] leading-relaxed text-aura-white/70">{tier.body}</p>
    </motion.article>
  )
}
