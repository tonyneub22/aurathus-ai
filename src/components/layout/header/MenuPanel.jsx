import { useEffect, useLayoutEffect } from 'react'
import { Link } from 'react-router'
import { gsap } from 'gsap'
import { site } from '../../../config/site'
import { prefersReducedMotion } from '../../../lib/motionPreference'
import CtaButton from '../CtaButton'

/**
 * Phones and tablets: a full-screen matte overlay with the section links set
 * large, Request Consult and the email at the foot. The parts rise in with a
 * short GSAP stagger on open (none under reduced motion). Inert while closed.
 */
export default function MenuPanel({ id, open, onClose, panelRef }) {
  const { links, cta, menuLabel } = site.nav
  const { email } = site.contact

  // React 18 doesn't know the `inert` attribute, so set the DOM property.
  useEffect(() => {
    if (panelRef.current) panelRef.current.inert = !open
  }, [open, panelRef])

  useLayoutEffect(() => {
    const panel = panelRef.current
    if (!open || !panel || prefersReducedMotion()) return undefined
    const tween = gsap.fromTo(
      panel.querySelectorAll('[data-menu-item]'),
      { opacity: 0, y: 28 },
      // Opacity only, never visibility: focus moves to the first link as the menu opens.
      { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out', stagger: 0.06, delay: 0.15, clearProps: 'opacity,transform' },
    )
    return () => tween.revert()
  }, [open, panelRef])

  return (
    <div
      ref={panelRef}
      id={id}
      role="dialog"
      aria-modal="true"
      aria-label={menuLabel}
      // Visibility flips at once on open (so focus can move in) and only after the fade on close.
      className={`fixed inset-0 z-20 flex flex-col overflow-y-auto overscroll-contain bg-aura-black px-6 pb-10 pt-28 duration-500 ease-aura motion-reduce:transition-none sm:px-10 lg:hidden ${open ? 'visible opacity-100 transition-opacity' : 'invisible opacity-0 transition-[opacity,visibility]'}`}
    >
      <nav aria-label="Primary" className="flex-1">
        <ul className="grid gap-2">
          {links.map((link) => (
            <li key={link.href} data-menu-item="">
              <Link
                to={link.href}
                onClick={onClose}
                className="inline-block py-2 font-serif text-[clamp(34px,9vw,48px)] font-light leading-[1.1] tracking-[0.02em] text-aura-heading transition-colors duration-500 hover:text-aura-gold-hot focus-visible:text-aura-gold-hot"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div data-menu-item="" className="mt-12 grid justify-items-start gap-6 border-t border-aura-gold/20 pt-8">
        <CtaButton to={cta.href} arrow={false} onClick={onClose}>
          {cta.label}
        </CtaButton>
        <a href={`mailto:${email}`} className="font-sans text-[15px] text-aura-gold transition-colors duration-500 hover:text-aura-gold-hot">
          {email}
        </a>
      </div>
    </div>
  )
}
