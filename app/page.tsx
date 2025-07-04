"use client";

import { HeroSection } from "@/components/hero-section";
import { BenefitsSection } from "@/components/benefits-section";
import { PopularLockedBenefits } from "@/components/popular-locked-benefits";
import { TestimonialsSection } from "@/components/testimonials-section";
import { FAQSection } from "@/components/faq-section";
import { CTASection } from "@/components/cta-section";
import { CTAMidPage } from "@/components/cta-mid-page";
import { DebugUser } from "@/components/debug-user";
import TopRecruitsScroll from "@/components/top-recruits-scroll";
import ApplicationProgressGamification from "@/components/application-progress-gamification";
import { PointsIntroduction } from "@/components/points-introduction";
import { ErrorBoundary } from "@/components/error-boundary";

import { useUser } from "@/context/user-context";
import { useRegistration } from "@/context/registration-context";
import { UserProvider } from "@/context/user-context";
import { RegistrationProvider } from "@/context/registration-context";
import { AuthModalProvider } from "@/context/auth-modal-context";
import { useState, useEffect } from "react";
import { Spinner } from "@/components/ui/spinner";

function HomeContent() {
  const { currentUser } = useUser();
  const { openRegistrationPopup } = useRegistration();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <main className="flex-1 w-full">
        <HeroSection />

        {/* Quick Social Proof */}
        <section className="w-full py-8 bg-muted/20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <div className="flex items-center justify-center gap-8 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <span className="text-primary font-bold text-lg">500+</span>
                  <span>Active Deputies</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-primary font-bold text-lg">95%</span>
                  <span>Job Satisfaction</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-primary font-bold text-lg">$118K+</span>
                  <span>Starting Salary</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <TopRecruitsScroll />

        <section id="benefits" className="w-full scroll-mt-20">
          <BenefitsSection />
        </section>

        <section id="testimonials" className="w-full scroll-mt-20">
          <TestimonialsSection />
        </section>

        <section className="w-full scroll-mt-20">
          <PopularLockedBenefits />
        </section>

        {currentUser && (
          <section className="w-full py-12">
            <div className="container mx-auto px-4">
              <div className="max-w-7xl mx-auto">
                <ApplicationProgressGamification />
              </div>
            </div>
          </section>
        )}

        <section className="w-full py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-7xl mx-auto">
              <PointsIntroduction />
            </div>
          </div>
        </section>

        <CTAMidPage />

        <section id="faq" className="w-full scroll-mt-20">
          <FAQSection />
        </section>

        <CTASection />
      </main>

      {process.env.NODE_ENV === "development" ||
      process.env.NEXT_PUBLIC_ENABLE_DEBUG === "true" ? (
        <DebugUser />
      ) : null}
    </ErrorBoundary>
  );
}

export default function Home() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <UserProvider>
        <RegistrationProvider>
          <AuthModalProvider>
            <HomeContent />
          </AuthModalProvider>
        </RegistrationProvider>
      </UserProvider>
    </ErrorBoundary>
  );
}
