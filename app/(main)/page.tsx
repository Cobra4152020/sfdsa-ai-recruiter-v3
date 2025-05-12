import { Suspense } from "react"
import dynamic from "next/dynamic"
import { HeroSection } from "@/components/hero-section"
import { BenefitsSection } from "@/components/benefits-section"
import { TestimonialsSection } from "@/components/testimonials-section"
import { FAQSection } from "@/components/faq-section"
import { CTASection } from "@/components/cta-section"
import { ErrorBoundary } from "@/components/error-boundary"

// Dynamically import components that might cause fetch issues
const DynamicLeaderboard = dynamic(
  () => import("@/components/leaderboard").then((mod) => ({ default: mod.Leaderboard })),
  {
    ssr: false,
    loading: () => <div className="w-full h-64 bg-gray-100 animate-pulse rounded-lg"></div>,
  },
)

const DynamicBadgeShowcase = dynamic(
  () => import("@/components/badge-showcase").then((mod) => ({ default: mod.BadgeShowcase })),
  {
    ssr: false,
    loading: () => <div className="w-full h-48 bg-gray-100 animate-pulse rounded-lg"></div>,
  },
)

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <HeroSection />

      <BenefitsSection />

      <ErrorBoundary
        fallback={<div className="w-full py-8 text-center">Unable to load leaderboard. Please try again later.</div>}
      >
        <Suspense fallback={<div className="w-full h-64 bg-gray-100 animate-pulse rounded-lg"></div>}>
          <DynamicLeaderboard />
        </Suspense>
      </ErrorBoundary>

      <TestimonialsSection />

      <ErrorBoundary
        fallback={<div className="w-full py-8 text-center">Unable to load badges. Please try again later.</div>}
      >
        <Suspense fallback={<div className="w-full h-48 bg-gray-100 animate-pulse rounded-lg"></div>}>
          <DynamicBadgeShowcase />
        </Suspense>
      </ErrorBoundary>

      <FAQSection />

      <CTASection />
    </main>
  )
}
