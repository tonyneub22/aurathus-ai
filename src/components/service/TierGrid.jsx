import TierCard from './TierCard'

/**
 * Plans side by side on desktop, stacked on phones. Two plans keep the width
 * of a three-up column (centred) instead of stretching to fill the row.
 */
export default function TierGrid({ tiers }) {
  const layout =
    tiers.length === 2 ? 'lg:mx-auto lg:max-w-[calc((100%-3rem)*2/3+1.5rem)] lg:grid-cols-2' : 'lg:grid-cols-3'

  return (
    <div className={`grid gap-6 ${layout}`}>
      {tiers.map((tier, i) => (
        <TierCard key={tier.label} tier={tier} index={i} />
      ))}
    </div>
  )
}
