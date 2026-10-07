import { motion, useReducedMotion } from 'motion/react'
import HomeLink from './HomeLink'
import MenuButton from './MenuButton'
import MenuPanel from './MenuPanel'
import useMenu from './useMenu'
import useScrolled from './useScrolled'

const MENU_ID = 'site-menu'

/**
 * Fixed header on every page: Home left, menu right. Clear over the hero,
 * it gains a soft dark backing once the page scrolls. `introDelay` lets the
 * home page fade it in after the hero intro.
 */
export default function SiteHeader({ introDelay = 0 }) {
  const reduceMotion = useReducedMotion()
  const scrolled = useScrolled(80)
  const { open, toggle, close, buttonRef, panelRef } = useMenu()
  const fadeIn = !reduceMotion && introDelay > 0

  return (
    <>
      {/* Opacity only: a transform here would trap the fixed menu panel inside the header. */}
      <motion.header
        className="fixed inset-x-0 top-0 z-30"
        initial={fadeIn ? { opacity: 0 } : false}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, delay: fadeIn ? introDelay : 0, ease: [0.2, 0.7, 0.2, 1] }}
      >
        <div
          aria-hidden="true"
          data-testid="header-backing"
          className={`absolute inset-0 bg-gradient-to-b from-aura-black/90 to-aura-black/40 backdrop-blur-md [mask-image:linear-gradient(to_bottom,black_55%,transparent)] transition-opacity duration-700 ease-aura motion-reduce:transition-none ${scrolled && !open ? 'opacity-100' : 'opacity-0'}`}
        />
        <div className="relative flex items-center justify-between px-2.5 py-4 sm:px-7 lg:px-[53px]">
          <HomeLink />
          <MenuButton ref={buttonRef} open={open} controls={MENU_ID} onClick={toggle} />
        </div>
      </motion.header>
      <MenuPanel id={MENU_ID} open={open} onClose={close} panelRef={panelRef} />
    </>
  )
}
