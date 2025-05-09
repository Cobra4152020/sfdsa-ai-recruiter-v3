"use client"

import { useState } from "react"
import { useUser } from "@/context/user-context"
import { OptInForm } from "@/components/opt-in-form"
import { HeroSection } from "@/components/hero-section"
import { BenefitsSection } from "@/components/benefits-section"
import { TestimonialsSection } from "@/components/testimonials-section"
import { FAQSection } from "@/components/faq-section"
import { CTASection } from "@/components/cta-section"
import { DebugUser } from "@/components/debug-user"
import { TopRecruitsScroll } from "@/components/top-recruits-scroll"
import { AskSgtKenButton } from "@/components/ask-sgt-ken-button"
import { ApplicationProgressGamification } from "@/components/application-progress-gamification"
import { ReferralRewards } from "@/components/referral-rewards"

export default function Home() {
  const [isOptInFormOpen, setIsOptInFormOpen] = useState(false)
  const [isApplying, setIsApplying] = useState(false)
  const { isLoggedIn = false } = useUser()

  const showOptInForm = (applying = false) => {
    setIsApplying(applying)
    setIsOptInFormOpen(true)
  }

  return (
    <>
      <main className="flex-1">
        <HeroSection onGetStarted={() => {}} showOptInForm={showOptInForm} />

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

        {/* Add Referral Rewards section */}
        <section className="py-12 bg-white dark:bg-[#1A1A1A]">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <ReferralRewards />
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

      {isOptInFormOpen && (
        <OptInForm
          onClose={() => {
            setIsOptInFormOpen(false)
            setIsApplying(false)
          }}
          isApplying={isApplying}
          isOpen={isOptInFormOpen}
        />
      )}

      {/* Only show debug component in development or when explicitly enabled */}
      {process.env.NODE_ENV === "development" || process.env.NEXT_PUBLIC_ENABLE_DEBUG === "true" ? <DebugUser /> : null}

      {/* Fixed Ask Sgt. Ken button */}
      <AskSgtKenButton position="fixed" variant="secondary" />
    </>
  )
}
