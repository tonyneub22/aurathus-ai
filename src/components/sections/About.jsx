import { motion, useReducedMotion } from 'motion/react'
import { site } from '../../config/site'
import MotionLink from '../routing/MotionLink'
import Panel from './Panel'
import GhostFibersBackground from '../effects/GhostFibersBackground'
import { reveal } from './reveal'

/** Dims the fibers behind the text column so the copy reads, and lets them show on the right. */
function Scrim() {
  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 bg-gradient-to-b from-aura-black-2/85 via-aura-black-2/70 to-aura-black-2/55 md:bg-gradient-to-r md:from-aura-black-2/95 md:via-aura-black-2/60 md:to-aura-black-2/10"
    />
  )
}

export default function About() {
  const reduce = useReducedMotion()
  const { about, hero } = site

  return (
    <Panel
      id="about"
      title={about.title}
      spacing="pb-28 lg:pb-40"
      boxClassName="matte-dark isolate overflow-hidden"
      decoration={
        <>
          <GhostFibersBackground />
          <Scrim />
        </>
      }
    >
      <div className="mt-10 grid max-w-[58ch] gap-6 lg:mt-14">
        {about.paragraphs.map((text, i) => (
          <motion.p
            key={i}
            {...reveal(reduce, i * 0.12)}
            className="font-sans text-[18px] leading-[1.75] text-aura-body"
          >
            {text}
          </motion.p>
        ))}
        <MotionLink
          {...reveal(reduce, 0.3)}
          to={hero.cta.href}
          className="mt-4 justify-self-start font-serif text-[13px] font-medium uppercase tracking-[0.34em] text-aura-gold transition-colors duration-500 hover:text-aura-gold-hot"
        >
          {hero.cta.label} →
        </MotionLink>
      </div>
    </Panel>
  )
}
