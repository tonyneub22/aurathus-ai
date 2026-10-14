/**
 * The thin drawn arrow beside a link label: a 1px line with a chevron tip, in
 * the current text colour. Callers set its length and how it answers hover.
 */
export default function Arrow({ className = '' }) {
  return (
    <span
      aria-hidden="true"
      className={`relative h-px shrink-0 bg-current after:absolute after:-top-[3px] after:right-0 after:h-[6px] after:w-[6px] after:rotate-45 after:border-r after:border-t after:border-current ${className}`}
    />
  )
}
