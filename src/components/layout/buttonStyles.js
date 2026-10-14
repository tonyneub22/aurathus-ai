// The site's one outlined button, as classes, for links (CtaButton) and real
// <button>s (the consult form) alike. Gold hairline, wide-tracked caps.
const base =
  'border border-aura-gold/50 font-serif text-[13px] font-medium uppercase text-aura-text transition-colors duration-500 ease-aura hover:border-aura-gold focus-visible:border-aura-gold'

const sizes = {
  md: 'px-8 py-4 tracking-[0.34em]',
  sm: 'px-5 py-2.5 tracking-[0.3em]',
}

export const outlineButton = (size = 'md') => `${base} ${sizes[size]}`
