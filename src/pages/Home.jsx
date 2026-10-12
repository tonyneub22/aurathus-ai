import SiteHeader from '../components/layout/header/SiteHeader'
import Hero from '../components/hero/Hero'
import Services from '../components/sections/Services'
import Testimonials from '../components/sections/Testimonials'
import WhyChooseUs from '../components/sections/WhyChooseUs'
import About from '../components/sections/About'
import ServicesBeam from '../components/effects/ServicesBeam'
import Footer from '../components/layout/Footer'
import { site } from '../config/site'
import usePageMeta from '../lib/usePageMeta'

export default function Home() {
  usePageMeta(site.meta.title, site.meta.description)

  return (
    <>
      {/* Fixed, so it floats over the hero without taking layout space; fades in after the intro. */}
      <SiteHeader introDelay={1.8} />
      <div className="relative">
        {/* The beam is positioned against this; clip stops its flare widening the page. */}
        <main className="relative overflow-x-clip">
          <Hero />
          <ServicesBeam />
          <Services />
          <WhyChooseUs />
          {site.testimonials.enabled && <Testimonials />}
          <About />
        </main>
        <Footer credit />
      </div>
    </>
  )
}
