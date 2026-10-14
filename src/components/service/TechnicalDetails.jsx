import { useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { EASE } from '../../lib/ease'

/** Collapsed-by-default disclosure for the technical paragraphs. A plus turns into a cross when open. */
export default function TechnicalDetails({ id, label, paragraphs }) {
  const reduce = useReducedMotion()
  const [open, setOpen] = useState(false)
  const buttonId = `${id}-button`
  const panelId = `${id}-panel`

  return (
    <section aria-labelledby={buttonId}>
      <h2>
        <button
          id={buttonId}
          type="button"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen((o) => !o)}
          className="flex w-full items-center justify-between gap-6 border-y border-aura-line py-6 text-left font-serif text-[15px] font-medium uppercase tracking-[0.28em] text-aura-text transition-colors duration-500 hover:text-aura-gold focus-visible:text-aura-gold"
        >
          {label}
          <span
            aria-hidden="true"
            className={`relative h-4 w-4 shrink-0 text-aura-gold transition-transform duration-500 ease-aura motion-reduce:transition-none ${open ? 'rotate-45' : ''}`}
          >
            <span className="absolute left-0 top-1/2 h-px w-4 bg-current" />
            <span className="absolute left-1/2 top-0 h-4 w-px bg-current" />
          </span>
        </button>
      </h2>
      <div id={panelId}>
        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              key="content"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={reduce ? { duration: 0 } : { duration: 0.7, ease: EASE }}
              className="overflow-hidden"
            >
              <div className="grid max-w-[68ch] gap-5 pb-6 pt-8">
                {paragraphs.map((text) => (
                  <p key={text.slice(0, 24)} className="font-sans text-[16px] leading-[1.75] text-aura-body">
                    {text}
                  </p>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}
