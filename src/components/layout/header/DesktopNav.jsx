import { Link } from 'react-router'
import { site } from '../../../config/site'
import CtaButton from '../CtaButton'

const link =
  "relative py-2 font-serif text-[13px] font-medium uppercase tracking-[0.3em] text-aura-body transition-colors duration-500 ease-aura hover:text-aura-heading focus-visible:text-aura-heading aria-[current=true]:text-aura-heading after:absolute after:inset-x-0 after:-bottom-px after:h-px after:origin-left after:scale-x-0 after:bg-aura-gold after:transition-transform after:duration-700 after:ease-aura hover:after:scale-x-100 focus-visible:after:scale-x-100 aria-[current=true]:after:scale-x-100 motion-reduce:after:transition-none"

/** Wide screens: the section links in a row, then Request Consult. `current` is the href in view. */
export default function DesktopNav({ current }) {
  const { links, cta } = site.nav

  return (
    <div className="hidden items-center gap-12 lg:flex">
      <nav aria-label="Primary">
        <ul className="flex items-center gap-9">
          {links.map((l) => (
            <li key={l.href}>
              <Link to={l.href} aria-current={current === l.href ? 'true' : undefined} className={link}>
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <CtaButton to={cta.href} size="sm" arrow={false}>
        {cta.label}
      </CtaButton>
    </div>
  )
}
