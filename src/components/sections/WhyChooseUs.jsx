import { motion, useReducedMotion } from 'motion/react'
import { site } from '../../config/site'
import Panel from './Panel'
import { reveal } from './reveal'

export default function WhyChooseUs() {
  const reduce = useReducedMotion()
  const { whyUs } = site

  return (
    <Panel id="why-us" title={whyUs.title}>
      <ol className="mt-10 grid gap-x-16 gap-y-12 lg:mt-14 md:grid-cols-2">
        {whyUs.items.map((item, i) => (
          <motion.li
            key={item.title}
            {...reveal(reduce, (i % 2) * 0.12)}
            className="grid content-start gap-4 border-t border-aura-line pt-6"
          >
            {/* Lining figures, so every numeral stands the same height at this size. */}
            <span aria-hidden="true" className="font-serif text-[clamp(48px,5vw,64px)] font-light leading-none text-aura-gold lining-nums">
              {i + 1}
            </span>
            <h3 className="font-serif text-[28px] font-normal leading-[1.1] tracking-[0.04em] text-aura-white">
              {item.title}
            </h3>
            <p className="max-w-[44ch] font-serif text-[17px] leading-relaxed text-aura-white/60">{item.body}</p>
          </motion.li>
        ))}
      </ol>
    </Panel>
  )
}
