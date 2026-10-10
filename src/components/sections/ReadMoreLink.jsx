import { Link } from 'react-router'

/**
 * Outlined "Read more" button. Hover and keyboard focus brighten the border
 * and glow; the arrow grows only when motion is allowed. Always outlined, so
 * it reads as a button on touch screens too.
 */
export default function ReadMoreLink({ to, label, ariaLabel }) {
  return (
    <Link
      to={to}
      aria-label={ariaLabel}
      // The soft gold bloom (not a hard ring) doubles as the focus indicator.
      className="group inline-flex items-center gap-4 self-start border border-aura-gold/50 px-6 py-3.5 font-serif text-[13px] font-medium uppercase tracking-[0.34em] text-aura-white transition-[border-color,box-shadow] duration-[400ms] ease-aura hover:border-aura-gold hover:shadow-[0_0_28px_-6px_color-mix(in_srgb,var(--color-aura-gold)_60%,transparent)] focus-visible:border-aura-gold focus-visible:shadow-[0_0_28px_-6px_color-mix(in_srgb,var(--color-aura-gold)_60%,transparent)] focus-visible:outline-none"
    >
      {label}
      <span
        aria-hidden="true"
        className="relative h-px w-6 bg-aura-gold transition-[width] duration-[400ms] ease-aura after:absolute after:-top-[3px] after:right-0 after:h-[6px] after:w-[6px] after:rotate-45 after:border-r after:border-t after:border-aura-gold motion-safe:group-hover:w-9 motion-safe:group-focus-visible:w-9"
      />
    </Link>
  )
}
