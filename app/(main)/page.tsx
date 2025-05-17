"use client"
import { useUser } from "@/context/user-context"
import { HeroSection } from "@/components/hero-section"
import { BenefitsSection } from "@/components/benefits-section"
import { TestimonialsSection } from "@/components/testimonials-section"
import { FAQSection } from "@/components/faq-section"
import { CTASection } from "@/components/cta-section"
import { DebugUser } from "@/components/debug-user"
import { TopRecruitsScroll } from "@/components/top-recruits-scroll"
import { AskSgtKenButton } from "@/components/ask-sgt-ken-button"
import { ApplicationProgressGamification } from "@/components/application-progress-gamification"
import { PointsIntroduction } from "@/components/points-introduction"
import { useRegistration } from "@/context/registration-context"

export default function Home() {
  const { currentUser } = useUser()
  const { openRegistrationPopup } = useRegistration()

  const showOptInForm = (applying = false) => {
    openRegistrationPopup({
      applying,
      initialTab: applying ? "optin" : "signin",
    })
  }

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <HeroSection onGetStarted={() => showOptInForm(true)} showOptInForm={showOptInForm} />
      <TopRecruitsScroll />
      <BenefitsSection />
      <PointsIntroduction />
      <ApplicationProgressGamification />
      <TestimonialsSection />
      <FAQSection />
      <CTASection showOptInForm={showOptInForm} />
      <DebugUser />
      <AskSgtKenButton position="fixed" variant="secondary" />
    </div>
  )
}
