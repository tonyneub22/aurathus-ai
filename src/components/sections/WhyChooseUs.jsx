import { motion, useReducedMotion } from 'motion/react'
import { site } from '../../config/site'
import Section from './Section'
import { reveal } from './reveal'
import WhyStatue from './WhyStatue'

/** The reasons beside Rodin's Thinker: the figure holds the left column, title and four ruled statements the right. */
export default function WhyChooseUs() {
  const reduce = useReducedMotion()
  const { whyUs } = site

  return (
    <Section id="why-us" title={whyUs.title} figure={<WhyStatue />}>
      <ul className="grid gap-x-12 gap-y-10 md:grid-cols-2 lg:gap-y-12">
        {whyUs.items.map((item, i) => (
          <motion.li key={item.title} {...reveal(reduce, (i % 2) * 0.12)} className="grid content-start gap-3 border-t border-aura-gold/25 pt-6">
            <h3 className="font-serif text-[clamp(24px,2vw,28px)] font-normal leading-[1.2] tracking-[0.02em] text-aura-heading">
              {item.title}
            </h3>
            <p className="max-w-[44ch] font-sans text-[16px] leading-[1.65] text-aura-body">{item.body}</p>
          </motion.li>
        ))}
      </ul>
    </Section>
  )
}
