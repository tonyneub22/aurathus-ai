import { site } from '../../config/site'
import Panel from './Panel'

/** The reasons in a dark matte box framed in gold, like About but without its fibers. */
export default function WhyChooseUs() {
  const { whyUs } = site

  return (
    <Panel id="why-us" title={whyUs.title}>
      <ul className="mt-12 grid gap-x-14 gap-y-12 md:grid-cols-2 lg:mt-14 lg:gap-y-14">
        {whyUs.items.map((item) => (
          <li key={item.title} data-reveal="" className="relative grid content-start gap-3 pt-7">
            <span aria-hidden="true" data-reveal="rule" className="absolute inset-x-0 top-0 h-px bg-aura-gold/30" />
            <h3 className="font-serif text-[clamp(24px,2vw,28px)] font-normal leading-[1.2] tracking-[0.02em] text-aura-heading">
              {item.title}
            </h3>
            <p className="max-w-[44ch] font-sans text-[16px] leading-[1.65] text-aura-body">{item.body}</p>
          </li>
        ))}
      </ul>
    </Panel>
  )
}
