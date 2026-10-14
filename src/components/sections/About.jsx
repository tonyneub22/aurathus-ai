import { Link } from 'react-router'
import { site } from '../../config/site'
import Panel from './Panel'
import Arrow from '../layout/Arrow'
import GhostFibersBackground from '../effects/GhostFibersBackground'

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
  const { about, hero } = site

  return (
    <Panel
      id="about"
      title={about.title}
      spacing="pb-28 lg:pb-40"
      boxClassName="isolate overflow-hidden"
      decoration={
        <>
          <GhostFibersBackground />
          <Scrim />
        </>
      }
    >
      <div className="mt-10 grid max-w-[58ch] gap-6 lg:mt-14">
        {about.paragraphs.map((text, i) => (
          <p key={i} data-reveal="" className="font-sans text-[18px] leading-[1.75] text-aura-body">
            {text}
          </p>
        ))}
        <div data-reveal="" className="mt-4">
          <Link
            to={hero.cta.href}
            className="group inline-flex items-center gap-4 font-serif text-[13px] font-medium uppercase tracking-[0.34em] text-aura-gold transition-colors duration-500 hover:text-aura-gold-hot"
          >
            {hero.cta.label}
            <Arrow className="w-6 transition-[translate] duration-500 ease-aura motion-safe:group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </Panel>
  )
}
