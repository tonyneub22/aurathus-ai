const EASE = [0.2, 0.7, 0.2, 1]

/** Fade-and-rise as an element scrolls into view; no motion at all when reduced. */
export function reveal(reduce, delay = 0) {
  return {
    initial: reduce ? false : { opacity: 0, y: 28 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.25 },
    transition: { duration: 1.2, delay, ease: EASE },
  }
}
