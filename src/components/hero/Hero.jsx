import { Fragment, lazy, Suspense, useCallback, useRef, useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { site } from '../../config/site'
import CtaButton from '../layout/CtaButton'
import BuildingIndicator from '../brand/BuildingIndicator'
import { supportsWebGL } from '../../three/webgl'

// three.js only loads for the hero, and only after the shell has painted.
const StatueCanvas = lazy(() => import('./StatueCanvas'))

const EASE = [0.2, 0.7, 0.2, 1]

/** Staggered entrance for the headline block; timed to follow the ring draw. */
function rise(delay, reduce) {
  return {
    initial: reduce ? false : { opacity: 0, y: 18 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 1.3, delay: reduce ? 0 : delay, ease: EASE },
  }
}

export default function Hero() {
  const heroRef = useRef(null)
  const reduce = useReducedMotion()
  const [webgl] = useState(supportsWebGL)
  const [modelReady, setModelReady] = useState(false)
  const onLoad = useCallback(() => setModelReady(true), [])
  const { hero } = site

  return (
    <section
      ref={heroRef}
      id="top"
      aria-labelledby="hero-title"
      data-beam-hero
      // Above the beam layer (z-11), so the copy always reads over it.
      className="relative isolate z-[12] grid min-h-[100svh] grid-rows-[1fr_auto] overflow-hidden"
    >
      {/* Figure layer */}
      <div className="absolute inset-0 -z-10">
        {webgl && (
          <Suspense fallback={null}>
            <StatueCanvas heroRef={heroRef} modelUrl={site.statue.modelUrl} onLoad={onLoad} />
          </Suspense>
        )}
        {/* Phones stack the copy over the figure; darken the lower half so it reads. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[62%] bg-gradient-to-t from-aura-black via-aura-black/80 to-transparent lg:hidden"
        />
        {webgl && !modelReady && (
          <BuildingIndicator
            size={28}
            label="Loading figure"
            className="absolute left-1/2 top-[38%] -translate-x-1/2 lg:left-[72%] lg:top-1/2"
          />
        )}
      </div>

      {/* Copy layer */}
      <div className="grid items-end px-5 pb-16 pt-[52svh] sm:px-10 lg:items-center lg:px-16 lg:pt-40">
        <div data-beam-clear className="max-w-[640px]">
          <h1
            id="hero-title"
            className="font-serif text-[clamp(52px,9vw,112px)] font-light uppercase leading-[0.95] tracking-[0.08em] text-aura-heading"
          >
            {hero.headline.map((word, i) => (
              // The space sits between the masks, not inside them: trailing
              // whitespace inside an inline-block collapses to nothing.
              <Fragment key={word}>
                {i > 0 && ' '}
                <span className="inline-block overflow-hidden align-top">
                  <motion.span
                    className="inline-block"
                    initial={reduce ? false : { y: '110%' }}
                    animate={{ y: 0 }}
                    transition={{ duration: 1.4, delay: reduce ? 0 : 1.5 + i * 0.12, ease: [0.2, 0.7, 0.1, 1] }}
                  >
                    {word}
                  </motion.span>
                </span>
              </Fragment>
            ))}
          </h1>

          <motion.p
            {...rise(2.0, reduce)}
            className="mt-5 font-serif text-[clamp(18px,1.7vw,22px)] font-normal uppercase tracking-[0.24em] text-aura-gold lg:whitespace-nowrap"
          >
            {hero.subtitle}
          </motion.p>

          <motion.p
            {...rise(2.2, reduce)}
            className="mt-3 font-serif text-[clamp(20px,2vw,26px)] font-light tracking-[0.06em] text-aura-body lg:mt-4"
          >
            {hero.tagline}
          </motion.p>

          <CtaButton {...rise(2.5, reduce)} to={hero.cta.href} className="mt-16 lg:mt-40">
            {hero.cta.label}
          </CtaButton>
        </div>
      </div>
    </section>
  )
}
