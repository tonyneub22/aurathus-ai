import { useRef } from 'react'
import { motion, useInView, useReducedMotion, useScroll, useTransform } from 'motion/react'
import { site } from '../../config/site'
import { EASE } from './reveal'
import TitleRing from '../service/TitleRing'

// Brightest arc at upper left (the hero's rim light), fading round to a quieter far side.
const HALO = `conic-gradient(from -50deg,
  color-mix(in srgb, var(--color-aura-gold-hot) 70%, transparent) 0deg,
  color-mix(in srgb, var(--color-aura-gold) 45%, transparent) 55deg,
  transparent 130deg,
  color-mix(in srgb, var(--color-aura-gold-soft) 28%, transparent) 210deg,
  transparent 280deg,
  color-mix(in srgb, var(--color-aura-gold-hot) 70%, transparent) 360deg)`
const HALO_MASK = 'radial-gradient(closest-side, #000 45%, transparent 100%)'

/**
 * Rodin's Thinker with a slow, candlelit gold halo turning behind it. The
 * figure is a transparent cutout, so its static rim glow follows the silhouette.
 * The halo only animates transform and opacity, pauses off screen (data-active),
 * and holds still, already placed, under reduced motion.
 */
export default function WhyStatue() {
  const { statue } = site.whyUs
  const ref = useRef(null)
  const reduce = useReducedMotion()
  const active = useInView(ref, { margin: '200px' })
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const rise = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [24, -24])

  return (
    <div ref={ref} data-active={active} className="relative mx-auto w-fit">
      <motion.div
        aria-hidden="true"
        data-testid="why-halo"
        className="pointer-events-none absolute -inset-[16%]"
        initial={reduce ? false : { opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 1.8, ease: EASE }}
      >
        <div className={`absolute inset-0 ${reduce ? '' : 'why-halo-breath'}`}>
          <div
            className={`absolute inset-0 rounded-full blur-[48px] ${reduce ? '' : 'why-halo-turn'}`}
            style={{ background: HALO, maskImage: HALO_MASK, WebkitMaskImage: HALO_MASK }}
          />
        </div>
      </motion.div>
      {/* The hero's ring language, centred on the head so it reads as a halo. */}
      <TitleRing inView className="pointer-events-none absolute left-[38%] -top-[7%] w-[70%] opacity-50" />
      <motion.picture style={{ y: rise }} className="relative block">
        {statue.sources.map((s) => (
          <source key={s.type} type={s.type} srcSet={s.srcSet} />
        ))}
        <img
          src={statue.src}
          width={statue.width}
          height={statue.height}
          alt={statue.alt}
          loading="lazy"
          decoding="async"
          draggable={false}
          // A warm rim from the upper left, following the cutout's alpha. Static, never animated.
          className="block h-auto max-h-[55svh] w-auto select-none [filter:drop-shadow(-4px_-6px_14px_color-mix(in_srgb,var(--color-aura-gold)_30%,transparent))] md:max-h-[420px] lg:max-h-[600px]"
        />
      </motion.picture>
    </div>
  )
}
