import MatteGrain from '../effects/MatteGrain'
import { sectionTitle } from './sectionTitle'

/**
 * A home-page section set in one dark matte box: a labelled region with its
 * title. `bordered={false}` drops the gold frame (Services: its top edge is
 * where the beam lands instead). `decoration` renders behind the grain and the
 * content (a glow, a background); `boxProps` / `boxClassName` land on the box.
 * Entrances come from the page's useReveal (data-reveal).
 */
export default function Panel({ id, title, decoration, boxProps, boxClassName = '', bordered = true, spacing = 'pb-6 lg:pb-10', children }) {
  const titleId = `${id}-title`

  return (
    <section
      id={id}
      aria-labelledby={titleId}
      className={`relative z-10 mx-auto w-full max-w-[1180px] px-5 sm:px-10 xl:px-0 ${spacing}`}
    >
      <div
        {...boxProps}
        className={`matte-panel matte-dark ${bordered ? '' : 'matte-borderless'} px-6 py-14 sm:px-12 lg:px-16 lg:py-20 ${boxClassName}`}
      >
        {decoration}
        <MatteGrain variant="panel" />
        <div className="relative">
          <h2 data-reveal="" id={titleId} className={sectionTitle}>
            {title}
          </h2>
          {children}
        </div>
      </div>
    </section>
  )
}
