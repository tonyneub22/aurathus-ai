import { useEffect } from 'react'
import SiteHeader from '../components/layout/header/SiteHeader'
import Hero from '../components/hero/Hero'
import Services from '../components/sections/Services'
import Testimonials from '../components/sections/Testimonials'
import WhyChooseUs from '../components/sections/WhyChooseUs'
import About from '../components/sections/About'
import ServicesBeam from '../components/effects/ServicesBeam'
import Footer from '../components/layout/Footer'
import { scrollToHash } from '../lib/scrollToHash'

export default function Home() {
  // Arriving from /consult via a menu link, e.g. /#services.
  useEffect(() => {
    scrollToHash()
  }, [])

  return (
    <>
      <div className="grain" aria-hidden="true" />
      {/* Fixed, so it floats over the hero without taking layout space; fades in after the intro. */}
      <SiteHeader introDelay={1.8} />
      <div className="relative">
        {/* The beam is positioned against this; clip stops its flare widening the page. */}
        <main className="relative overflow-x-clip">
          <Hero />
          <ServicesBeam />
          <Services />
          <WhyChooseUs />
          <Testimonials />
          <About />
        </main>
        <Footer />
      </div>
    </>
  )
}
