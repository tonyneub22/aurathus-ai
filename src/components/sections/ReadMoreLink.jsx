import { Link } from 'react-router'

/**
 * "Read more" with a thin gold rule under the label and arrow. Hover and
 * keyboard focus brighten both to full gold with a soft glow; the arrow
 * glides a few pixels right (a translate, never a width change, so nothing
 * reflows) only when motion is allowed. Timing matches the index row. `stretched` spreads the link's hit area
 * over its nearest positioned ancestor (a whole index row). `compact` shows
 * only the arrow below the md breakpoint (the label stays for screen readers).
 */
export default function ReadMoreLink({ to, label, ariaLabel, stretched = false, compact = false }) {
  return (
    <Link
      to={to}
      aria-label={ariaLabel}
      // The glow and the brightened rule double as the focus indicator.
      className={`${stretched ? 'after:absolute after:inset-0' : ''} ${compact ? 'border-transparent py-2 md:border-aura-gold/40 md:py-0 md:pb-2.5' : 'border-aura-gold/40 pb-2.5'} group/link inline-flex items-center gap-5 whitespace-nowrap border-b font-serif text-[12px] font-medium uppercase tracking-[0.34em] text-aura-body transition-[color,border-color,box-shadow,text-shadow] duration-[450ms] ease-aura hover:delay-[60ms] hover:duration-700 hover:border-aura-gold hover:text-aura-gold hover:shadow-[0_8px_18px_-10px_color-mix(in_srgb,var(--color-aura-gold)_70%,transparent)] hover:[text-shadow:0_0_14px_color-mix(in_srgb,var(--color-aura-gold)_55%,transparent)] focus-visible:border-aura-gold focus-visible:text-aura-gold focus-visible:shadow-[0_8px_18px_-10px_color-mix(in_srgb,var(--color-aura-gold)_70%,transparent)] focus-visible:outline-none focus-visible:[text-shadow:0_0_14px_color-mix(in_srgb,var(--color-aura-gold)_55%,transparent)]`}
    >
      {/* not-sr-only resets white-space, so restore nowrap: the label must never wrap. */}
      <span className={compact ? 'sr-only md:not-sr-only md:whitespace-nowrap' : 'whitespace-nowrap'}>{label}</span>
      <span
        aria-hidden="true"
        className="relative h-px w-6 shrink-0 bg-aura-gold transition-[translate,box-shadow] duration-[450ms] ease-aura group-hover/link:delay-[60ms] group-hover/link:duration-700 after:absolute after:-top-[3px] after:right-0 after:h-[6px] after:w-[6px] after:rotate-45 after:border-r after:border-t after:border-aura-gold group-hover/link:shadow-[0_0_8px_color-mix(in_srgb,var(--color-aura-gold)_80%,transparent)] group-focus-visible/link:shadow-[0_0_8px_color-mix(in_srgb,var(--color-aura-gold)_80%,transparent)] motion-safe:group-hover/link:translate-x-1.5 motion-safe:group-focus-visible/link:translate-x-1.5"
      />
    </Link>
  )
}
