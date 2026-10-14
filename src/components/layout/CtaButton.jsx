import MotionLink from '../routing/MotionLink'

/**
 * The site's primary call to action: outlined gold, with an arrow that grows
 * on hover when motion is allowed. Extra props (Motion entrances included)
 * pass through to the link.
 */
export default function CtaButton({ to, className = '', children, ...props }) {
  return (
    <MotionLink
      {...props}
      to={to}
      className={`group inline-flex items-center gap-4 border border-aura-gold/50 px-8 py-4 font-serif text-[13px] font-medium uppercase tracking-[0.34em] text-aura-text transition-colors duration-500 hover:border-aura-gold ${className}`}
    >
      {children}
      <span
        aria-hidden="true"
        className="relative h-px w-7 bg-aura-gold transition-[width] duration-500 ease-aura after:absolute after:-top-[3px] after:right-0 after:h-[6px] after:w-[6px] after:rotate-45 after:border-r after:border-t after:border-aura-gold motion-safe:group-hover:w-11"
      />
    </MotionLink>
  )
}
