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
  const { isLoggedIn = false } = useUser()
  const { openRegistrationPopup } = useRegistration()

  const showOptInForm = (applying = false) => {
    openRegistrationPopup({
      applying,
      initialTab: applying ? "optin" : "signin",
    })
  }

  return (
    <>
      <main className="flex-1">
        <HeroSection onGetStarted={() => showOptInForm(true)} showOptInForm={showOptInForm} />

        {/* Top Recruits section moved to top, right after hero */}
        <TopRecruitsScroll />

        {/* Add Application Progress Gamification for logged in users */}
        {isLoggedIn && (
          <section className="py-12 bg-[#F8F5EE] dark:bg-[#121212]">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto">
                <ApplicationProgressGamification />
              </div>
            </div>
          </section>
        )}

        {/* Introduction to Points and Rewards System */}
        <section className="py-12 bg-white dark:bg-[#1A1A1A]">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <PointsIntroduction />
            </div>
          </div>
        </section>

        <section id="benefits" className="scroll-mt-20">
          <BenefitsSection />
        </section>

        <section id="testimonials" className="scroll-mt-20">
          <TestimonialsSection />
        </section>

        <section id="faq" className="scroll-mt-20">
          <FAQSection />
        </section>

        <CTASection showOptInForm={showOptInForm} />
      </main>

      {/* Only show debug component in development or when explicitly enabled */}
      {process.env.NODE_ENV === "development" || process.env.NEXT_PUBLIC_ENABLE_DEBUG === "true" ? <DebugUser /> : null}

      {/* Fixed Ask Sgt. Ken button */}
      <AskSgtKenButton position="fixed" variant="secondary" />
    </>
  )
}
