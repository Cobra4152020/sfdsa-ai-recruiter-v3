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
    <>
      <main className="flex-1 w-full">
        <HeroSection onGetStarted={() => showOptInForm(true)} showOptInForm={showOptInForm} />

        <TopRecruitsScroll />

        {currentUser && (
          <section className="w-full py-12 bg-[#0A3C1F] dark:bg-[#121212]">
            <div className="container mx-auto px-4">
              <div className="max-w-7xl mx-auto">
                <ApplicationProgressGamification />
              </div>
            </div>
          </section>
        )}

        <section className="w-full py-12 bg-[#0A3C1F] dark:bg-[#1A1A1A]">
          <div className="container mx-auto px-4">
            <div className="max-w-7xl mx-auto">
              <PointsIntroduction />
            </div>
          </div>
        </section>

        <section id="benefits" className="w-full scroll-mt-20">
          <BenefitsSection />
        </section>

        <section id="testimonials" className="w-full scroll-mt-20">
          <TestimonialsSection />
        </section>

        <section id="faq" className="w-full scroll-mt-20">
          <FAQSection />
        </section>

        <CTASection showOptInForm={showOptInForm} />
      </main>

      {process.env.NODE_ENV === "development" || process.env.NEXT_PUBLIC_ENABLE_DEBUG === "true" ? <DebugUser /> : null}

      <AskSgtKenButton position="fixed" variant="secondary" />
    </>
  )
} 