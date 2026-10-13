import { site } from '../../config/site'

/**
 * Credit for the Why Us statue photograph. It is CC0 (The Met Open Access), so
 * no credit is required; it sits beside the David credit in the same voice.
 * See LICENSES.md.
 */
export default function ImageCredit({ className = '' }) {
  const c = site.whyUs.statue.credit
  const link = 'underline decoration-aura-gold/30 underline-offset-4 transition hover:decoration-aura-gold'

  return (
    <p data-testid="image-credit" className={`max-w-[70ch] font-sans text-[13px] leading-relaxed text-aura-muted ${className}`}>
      Photograph: “
      <a href={c.titleUrl} className={link} rel="noopener noreferrer" target="_blank">
        {c.title}
      </a>
      ” by {c.artist}, {c.date}. {c.source}, {c.license}. {c.changes}
    </p>
  )
}
