import { site } from '../../config/site'
import Panel from './Panel'
import AccordionGallery from './AccordionGallery'

export default function Testimonials() {
  const { testimonials } = site
  return (
    <Panel id="testimonials" title={testimonials.title}>
      <AccordionGallery items={testimonials.items} />
    </Panel>
  )
}
