import { useEffect } from 'react'
import { site } from '../../../config/site'

// Visibility flips at once on open (so focus can move in) and only after the slide on close.
const shown = 'visible transition-[translate,opacity]'
const gone = 'invisible transition-[translate,opacity,visibility]'
const slide = 'duration-700 ease-aura motion-reduce:transition-none'

/** The menu: a backdrop and a panel that slides in from the right. Inert while closed. */
export default function MenuPanel({ id, open, onClose, panelRef }) {
  const { links, cta, menuLabel } = site.nav

  // React 18 doesn't know the `inert` attribute, so set the DOM property.
  useEffect(() => {
    if (panelRef.current) panelRef.current.inert = !open
  }, [open, panelRef])

  return (
    <>
      <div
        aria-hidden="true"
        data-testid="menu-backdrop"
        onClick={onClose}
        className={`fixed inset-0 z-20 bg-aura-black/60 backdrop-blur-sm ${slide} ${open ? `${shown} opacity-100` : `${gone} opacity-0`}`}
      />
      <div
        ref={panelRef}
        id={id}
        role="dialog"
        aria-modal="true"
        aria-label={menuLabel}
        className={`fixed inset-y-0 right-0 z-20 flex w-[min(380px,88vw)] flex-col overflow-y-auto border-l border-aura-gold/30 bg-aura-black-2 px-8 pb-12 pt-28 sm:px-12 ${slide} ${open ? `${shown} translate-x-0` : `${gone} translate-x-full`}`}
      >
        <nav aria-label="Primary">
          <ul className="grid gap-1">
            {links.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={onClose}
                  className="inline-block py-3 font-serif text-[15px] font-medium uppercase tracking-[0.28em] text-aura-white/70 transition-colors duration-500 hover:text-aura-gold focus-visible:text-aura-gold"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <a
          href={cta.href}
          onClick={onClose}
          className="mt-10 self-start border border-aura-gold/50 px-8 py-4 font-serif text-[13px] font-medium uppercase tracking-[0.34em] text-aura-white transition-colors duration-500 hover:border-aura-gold focus-visible:border-aura-gold"
        >
          {cta.label}
        </a>
      </div>
    </>
  )
}
