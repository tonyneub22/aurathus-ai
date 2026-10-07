import { site } from '../../config/site'

/**
 * CC BY 4.0 attribution for the hero figure. The license requires title,
 * author, license link and a note of changes. Keep it visible wherever the
 * model is shown. Do not remove during redesigns. See LICENSES.md.
 */
export default function StatueCredit({ className = '' }) {
  const c = site.statue.credit
  const link = 'underline decoration-podo-gold/30 underline-offset-4 transition hover:decoration-podo-gold'

  return (
    <p
      data-testid="statue-credit"
      className={`max-w-[70ch] font-serif text-[13px] font-medium leading-relaxed tracking-[0.04em] text-podo-white/40 ${className}`}
    >
      3D figure: “
      <a href={c.titleUrl} className={link} rel="noopener noreferrer" target="_blank">
        {c.title}
      </a>
      ” by{' '}
      <a href={c.authorUrl} className={link} rel="noopener noreferrer" target="_blank">
        {c.author}
      </a>
      , licensed under{' '}
      <a href={c.licenseUrl} className={link} rel="license noopener noreferrer" target="_blank">
        {c.license}
      </a>
      . {c.changes}
    </p>
  )
}
