import MatteGrain from '../effects/MatteGrain'

const small = 'font-serif text-[13px] font-medium uppercase tracking-[0.28em]'

/** One plan. A gold rule draws across its top edge as it enters (useReveal on the page). */
export default function TierCard({ tier, index }) {
  const titleId = `tier-${index + 1}-title`

  return (
    <article
      data-reveal=""
      aria-labelledby={titleId}
      data-testid="tier"
      // Unclipped, so the gold rule can draw over the top border.
      className="matte-panel flex h-full flex-col overflow-visible p-6 sm:p-7 lg:p-8"
    >
      <span
        aria-hidden="true"
        data-reveal="rule"
        className="absolute -left-[2px] -right-[2px] -top-[2px] z-[1] h-[2px] origin-left bg-aura-gold"
      />
      <MatteGrain variant="panel" />
      <div className="relative flex flex-1 flex-col">
        <p className={`${small} flex flex-wrap justify-between gap-x-4 gap-y-1`}>
          <span className="text-aura-muted">{tier.label}</span>
          <span className="text-aura-gold">{tier.timeline}</span>
        </p>
        <h3 id={titleId} className="mt-4 font-serif text-[26px] font-normal leading-[1.15] tracking-[0.03em] text-aura-heading">
          {tier.name}
        </h3>
        <p className="mt-4 border-t border-aura-line pt-4 font-sans text-[16px] leading-[1.65] text-aura-body">{tier.body}</p>
      </div>
    </article>
  )
}
