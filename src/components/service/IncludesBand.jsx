import MatteGrain from '../effects/MatteGrain'

/** The band under the plans: what every plan comes with. */
export default function IncludesBand({ includes }) {
  return (
    <div data-testid="includes" className="matte-panel mt-6 p-6 sm:p-7 lg:p-8">
      <MatteGrain variant="panel" />
      <div className="relative">
        <h3 className="font-serif text-[13px] font-medium uppercase tracking-[0.3em] text-aura-gold/80">{includes.heading}</h3>
        <p className="mt-4 max-w-[75ch] font-sans text-[17px] leading-[1.7] text-aura-body">{includes.body}</p>
      </div>
    </div>
  )
}
