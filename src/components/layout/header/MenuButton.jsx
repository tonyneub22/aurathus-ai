import { forwardRef } from 'react'
import { site } from '../../../config/site'

const bar = 'absolute left-1/2 top-1/2 h-px w-6 -translate-x-1/2 bg-current transition duration-500 ease-aura motion-reduce:transition-none'

/** Three thin bars that fold into an X while the menu is open. */
const MenuButton = forwardRef(function MenuButton({ open, controls, onClick }, ref) {
  return (
    <button
      ref={ref}
      type="button"
      aria-label={site.nav.menuLabel}
      aria-expanded={open}
      aria-controls={controls}
      onClick={onClick}
      className="relative h-11 w-11 text-aura-white transition-colors duration-500 hover:text-aura-gold focus-visible:text-aura-gold"
    >
      <span aria-hidden="true" className={`${bar} ${open ? 'rotate-45' : '-translate-y-[7px]'}`} />
      <span aria-hidden="true" className={`${bar} ${open ? 'opacity-0' : ''}`} />
      <span aria-hidden="true" className={`${bar} ${open ? '-rotate-45' : 'translate-y-[7px]'}`} />
    </button>
  )
})

export default MenuButton
