import { motion, useReducedMotion } from 'motion/react'
import { site } from '../../config/site'
import Section from './Section'
import { reveal } from './reveal'

/** The reasons, unboxed: the title holds the left column, four short statements fill the right. */
export default function WhyChooseUs() {
  const reduce = useReducedMotion()
  const { whyUs } = site

  return (
    <Section id="why-us" title={whyUs.title} aside>
      <ul className="grid gap-x-16 gap-y-14 md:grid-cols-2">
        {whyUs.items.map((item, i) => (
          <motion.li key={item.title} {...reveal(reduce, (i % 2) * 0.12)} className="grid content-start gap-4">
            <h3 className="font-serif text-[clamp(26px,2.4vw,32px)] font-normal leading-[1.15] tracking-[0.02em] text-aura-heading">
              {item.title}
            </h3>
            <p className="max-w-[44ch] font-sans text-[17px] leading-[1.7] text-aura-body">{item.body}</p>
          </motion.li>
        ))}
      </ul>
    </Section>
  )
}
