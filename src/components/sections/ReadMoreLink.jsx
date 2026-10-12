import { Link } from 'react-router'

/**
 * "Read more" with a thin gold rule under the label and arrow. Hover and
 * keyboard focus brighten both to full gold with a soft glow; the arrow
 * extends only when motion is allowed.
 */
export default function ReadMoreLink({ to, label, ariaLabel }) {
  return (
    <Link
      to={to}
      aria-label={ariaLabel}
      // The glow and the brightened rule double as the focus indicator.
      className="group inline-flex items-center gap-5 whitespace-nowrap border-b border-aura-gold/40 pb-3 font-serif text-[12px] font-medium uppercase tracking-[0.34em] text-aura-body transition-[color,border-color,box-shadow,text-shadow] duration-[400ms] ease-aura hover:border-aura-gold hover:text-aura-gold hover:shadow-[0_8px_18px_-10px_color-mix(in_srgb,var(--color-aura-gold)_70%,transparent)] hover:[text-shadow:0_0_14px_color-mix(in_srgb,var(--color-aura-gold)_55%,transparent)] focus-visible:border-aura-gold focus-visible:text-aura-gold focus-visible:shadow-[0_8px_18px_-10px_color-mix(in_srgb,var(--color-aura-gold)_70%,transparent)] focus-visible:outline-none focus-visible:[text-shadow:0_0_14px_color-mix(in_srgb,var(--color-aura-gold)_55%,transparent)]"
    >
      {label}
      <span
        aria-hidden="true"
        className="relative h-px w-6 bg-aura-gold transition-[width,box-shadow] duration-[400ms] ease-aura after:absolute after:-top-[3px] after:right-0 after:h-[6px] after:w-[6px] after:rotate-45 after:border-r after:border-t after:border-aura-gold group-hover:shadow-[0_0_8px_color-mix(in_srgb,var(--color-aura-gold)_80%,transparent)] group-focus-visible:shadow-[0_0_8px_color-mix(in_srgb,var(--color-aura-gold)_80%,transparent)] motion-safe:group-hover:w-9 motion-safe:group-focus-visible:w-9"
      />
    </Link>
  )
}
