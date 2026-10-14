import MotionLink from '../routing/MotionLink'
import Arrow from './Arrow'
import { outlineButton } from './buttonStyles'

/**
 * The site's primary call to action: outlined gold, with an arrow that grows
 * on hover when motion is allowed. `size="sm"` for the header bar, `arrow`
 * off where the label stands alone. Extra props (Motion entrances, onClick)
 * pass through to the link.
 */
export default function CtaButton({ to, size = 'md', arrow = true, className = '', children, ...props }) {
  return (
    <MotionLink {...props} to={to} className={`group inline-flex items-center gap-4 ${outlineButton(size)} ${className}`}>
      {children}
      {arrow && <Arrow className="w-7 text-aura-gold transition-[width] duration-500 ease-aura motion-safe:group-hover:w-11" />}
    </MotionLink>
  )
}
