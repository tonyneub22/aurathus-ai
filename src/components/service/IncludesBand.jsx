/** The quieter band under the plans: what every plan comes with. */
export default function IncludesBand({ includes }) {
  return (
    <div data-testid="includes" className="mt-6 border border-aura-line px-8 py-8 lg:px-10 lg:py-10">
      <h3 className="font-serif text-[13px] font-medium uppercase tracking-[0.3em] text-aura-gold/80">{includes.heading}</h3>
      <p className="mt-4 max-w-[90ch] font-serif text-[18px] leading-relaxed text-aura-white/65">{includes.body}</p>
    </div>
  )
}
