import { useId, useRef, useState } from 'react'

const pad = (n) => String(n + 1).padStart(2, '0')

/**
 * Expanding-panel gallery. Panels sit side by side on desktop (the open one
 * grows) and stack on phones (the open one unfolds). Click, tap, Enter or Space
 * opens a panel, and arrow keys, Home and End move between them. Hovering does
 * nothing: panels change only when asked, so a passing mouse never moves them.
 *
 * items: [{ quote, name, role, image?, imageAlt? }]. Without an image a large
 * gold quotation mark fills the panel.
 */
export default function AccordionGallery({ items }) {
  const [open, setOpen] = useState(0)
  const base = useId()
  const buttons = useRef([])

  function onKeyDown(event, i) {
    const last = items.length - 1
    const next = { ArrowRight: i + 1, ArrowDown: i + 1, ArrowLeft: i - 1, ArrowUp: i - 1, Home: 0, End: last }[event.key]
    if (next === undefined) return
    event.preventDefault()
    const target = Math.min(last, Math.max(0, next))
    buttons.current[target]?.focus()
    setOpen(target)
  }

  return (
    <ul className="mt-10 flex flex-col gap-px bg-podo-line md:h-[440px] md:flex-row lg:mt-14">
      {items.map((item, i) => {
        const isOpen = open === i
        const buttonId = `${base}-btn-${i}`
        const regionId = `${base}-region-${i}`
        return (
          <li
            key={i}
            style={{ '--grow': isOpen ? 6 : 1 }}
            className={`relative flex min-w-0 flex-col overflow-hidden transition-[flex-grow,background-color] [transition-duration:1000ms,500ms] ease-podo-soft motion-reduce:transition-none md:[flex:var(--grow)_1_0%] ${isOpen ? 'bg-podo-panel-open' : 'bg-podo-panel hover:bg-podo-panel-open/60'}`}
          >
            {item.image && (
              <img
                src={item.image}
                alt={isOpen ? (item.imageAlt ?? '') : ''}
                className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ease-podo-soft motion-reduce:transition-none ${isOpen ? 'opacity-35' : 'opacity-15'}`}
              />
            )}
            <h3 className={`relative ${isOpen ? '' : 'md:flex md:flex-1 md:flex-col'}`}>
              <button
                ref={(el) => (buttons.current[i] = el)}
                id={buttonId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={regionId}
                onClick={() => setOpen(i)}
                onKeyDown={(e) => onKeyDown(e, i)}
                className={`flex w-full items-center gap-4 px-6 py-5 text-left font-serif transition-colors duration-500 hover:text-podo-white md:px-5 md:py-6 ${isOpen ? 'text-podo-white md:flex-none' : 'cursor-pointer text-podo-white/70 md:flex-1 md:flex-col md:items-start md:justify-between'}`}
              >
                <span className="text-[13px] font-medium tracking-[0.28em] text-podo-gold">{pad(i)}</span>
                <span
                  className={`text-[22px] font-normal leading-tight tracking-[0.04em] ${isOpen ? '' : 'md:[writing-mode:vertical-rl] md:rotate-180 md:self-center'}`}
                >
                  {item.name}
                </span>
              </button>
            </h3>

            <div
              id={regionId}
              role="region"
              aria-labelledby={buttonId}
              // Collapsed panels are removed from the accessibility tree and tab order.
              {...(isOpen ? {} : { inert: '' })}
              className={`relative grid transition-[grid-template-rows] duration-700 ease-podo-soft motion-reduce:transition-none md:flex-1 md:grid-rows-[1fr] ${isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}
            >
              <div className="min-h-0 overflow-hidden">
                <figure
                  // Fades in once the panel is mostly open; out quickly so text never lingers in a shrinking strip.
                  className={`px-6 pb-8 pt-2 transition-opacity motion-reduce:transition-none md:min-w-[520px] md:px-8 md:pb-10 ${isOpen ? 'opacity-100 duration-700 delay-300' : 'opacity-0 duration-200'}`}
                >
                  <span aria-hidden="true" className="block font-serif text-[72px] leading-none text-podo-gold/40">
                    &ldquo;
                  </span>
                  <blockquote className="max-w-[34ch] font-serif text-[clamp(21px,2.1vw,28px)] font-light leading-snug text-podo-white">
                    {item.quote}
                  </blockquote>
                  <figcaption className="mt-6 font-serif text-[13px] font-medium uppercase tracking-[0.28em] text-podo-gold/80">
                    {item.name} <span className="text-podo-white/40">·</span> {item.role}
                  </figcaption>
                </figure>
              </div>
            </div>
          </li>
        )
      })}
    </ul>
  )
}
