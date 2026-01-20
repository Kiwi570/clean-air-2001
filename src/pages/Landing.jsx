import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { Hero } from '@/components/landing/Hero'
import { TrustBanner } from '@/components/landing/TrustBanner'
import { DualPath } from '@/components/landing/DualPath'
import { HowItWorks } from '@/components/landing/HowItWorks'
import { Pricing } from '@/components/landing/Pricing'
import { Testimonials } from '@/components/landing/Testimonials'
import { FinalCTA } from '@/components/landing/FinalCTA'

function Landing() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <Hero />
        <TrustBanner />
        <DualPath />
        <HowItWorks />
        <Pricing />
        <Testimonials />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  )
}

export default Landing
