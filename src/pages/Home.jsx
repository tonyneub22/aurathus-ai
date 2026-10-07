import Nav from '../components/layout/Nav'
import Hero from '../components/hero/Hero'
import Services from '../components/sections/Services'
import Testimonials from '../components/sections/Testimonials'
import WhyChooseUs from '../components/sections/WhyChooseUs'
import About from '../components/sections/About'
import ServicesBeam from '../components/effects/ServicesBeam'
import Footer from '../components/layout/Footer'

export default function Home() {
  return (
    <>
      <div className="grain" aria-hidden="true" />
      <div className="relative">
        {/* Nav floats over the top of the hero. */}
        <div className="absolute inset-x-0 top-0 z-20">
          <Nav />
        </div>
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
