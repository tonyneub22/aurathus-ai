import { useEffect } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { useLocation } from 'react-router'
import { site } from '../../../config/site'
import { EASE } from '../../../lib/ease'
import HomeLink from './HomeLink'
import DesktopNav from './DesktopNav'
import MenuButton from './MenuButton'
import MenuPanel from './MenuPanel'
import useMenu from './useMenu'
import useHeaderState from './useHeaderState'
import useActiveSection from './useActiveSection'

const MENU_ID = 'site-menu'
const HREFS = site.nav.links.map((l) => l.href)

/**
 * Fixed header on every page. Wide screens: the brand, the section links and
 * Request Consult in a row. Smaller screens: the brand and a menu button that
 * opens a full-screen menu. Clear over the hero, a matte black bar once
 * scrolled; it tucks away while reading down and returns on the way up.
 * `introDelay` lets the home page fade it in after the hero intro.
 */
export default function SiteHeader({ introDelay = 0 }) {
  const reduceMotion = useReducedMotion()
  const { pathname, key } = useLocation()
  const { scrolled, hidden } = useHeaderState(80)
  const { open, toggle, close, buttonRef, panelRef } = useMenu(key)
  const current = useActiveSection(HREFS, pathname === '/')
  const fadeIn = !reduceMotion && introDelay > 0
  const tucked = hidden && !open

  // The full-screen menu belongs to small screens; widening the window closes it.
  useEffect(() => {
    if (!open) return undefined
    const wide = window.matchMedia('(min-width: 1024px)')
    const onChange = (e) => e.matches && close()
    wide.addEventListener('change', onChange)
    return () => wide.removeEventListener('change', onChange)
  }, [open, close])

  return (
    <>
      {/* Opacity only here: a transform on the header would trap the fixed menu inside it. */}
      <motion.header
        className="fixed inset-x-0 top-0 z-30"
        initial={fadeIn ? { opacity: 0 } : false}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, delay: fadeIn ? introDelay : 0, ease: EASE }}
      >
        <div
          data-testid="header-bar"
          // Keyboard users never lose it: focus inside brings it back.
          className={`relative transition-[translate] duration-700 ease-aura focus-within:translate-y-0 motion-reduce:transition-none ${tucked ? '-translate-y-full' : 'translate-y-0'}`}
        >
          <div
            aria-hidden="true"
            data-testid="header-backing"
            className={`absolute inset-0 border-b border-aura-gold/15 bg-aura-black/[0.92] transition-opacity duration-700 ease-aura motion-reduce:transition-none ${scrolled && !open ? 'opacity-100' : 'opacity-0'}`}
          />
          {/* On the content grid, so the brand and the action line up with the boxes below. */}
          <div className="relative mx-auto flex h-[72px] w-full max-w-[1180px] items-center justify-between px-5 sm:px-10 xl:px-0">
            <HomeLink />
            <DesktopNav current={current} />
            <div className="lg:hidden">
              <MenuButton ref={buttonRef} open={open} controls={MENU_ID} onClick={toggle} />
            </div>
          </div>
        </div>
      </motion.header>
      <MenuPanel id={MENU_ID} open={open} onClose={close} panelRef={panelRef} />
    </>
  )
}
