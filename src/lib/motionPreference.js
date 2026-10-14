/** True when the visitor asked the system for less motion. Safe where matchMedia is missing. */
export const prefersReducedMotion = () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false
