"use client"

import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ImprovedHeader } from "@/components/improved-header"
import { ImprovedFooter } from "@/components/improved-footer"
import { UserProvider } from "@/context/user-context"
import { useAuthModal } from "@/context/auth-modal-context"
import type { Badge } from "@/lib/badge-utils"

interface BadgeClientProps {
  badge: Badge | null
}

export function BadgeClient({ badge }: BadgeClientProps) {
  const { openModal } = useAuthModal()

  const showOptInForm = (isApplying?: boolean) => {
    if (isApplying) {
      openModal("optin", "recruit")
    } else {
      openModal("signin", "recruit")
    }
  }

  if (!badge) {
    return (
      <UserProvider>
        <div className="min-h-screen flex flex-col">
          <ImprovedHeader showOptInForm={showOptInForm} />
          <main className="flex-1 pt-40 pb-12 bg-[#F8F5EE] dark:bg-[#121212] flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-3xl font-bold mb-4">Badge Not Found</h1>
              <p className="mb-8">The badge you're looking for doesn't exist.</p>
              <Link href="/awards">
                <Button>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Awards
                </Button>
              </Link>
            </div>
          </main>
          <ImprovedFooter />
        </div>
      </UserProvider>
    )
  }

  return (
    <UserProvider>
      <div className="min-h-screen flex flex-col">
        <ImprovedHeader showOptInForm={showOptInForm} />
        <main className="flex-1 pt-40 pb-12 bg-[#F8F5EE] dark:bg-[#121212]">
          <div className="container mx-auto px-4">
            <Link href="/awards">
              <Button variant="ghost" className="mb-8">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Awards
              </Button>
            </Link>

            <div className="max-w-3xl mx-auto text-center mb-8">
              <h1 className="text-3xl md:text-4xl font-bold mb-4 text-[#0A3C1F] dark:text-[#FFD700]">{badge.name}</h1>
              <p className="text-lg text-[#0A3C1F]/70 dark:text-white/70">{badge.description}</p>
            </div>

            <div className="flex flex-col items-center justify-center">
              <div className={`rounded-full w-40 h-40 flex items-center justify-center mb-6 ${badge.color}`}>
                <img src={badge.icon || "/placeholder.svg"} alt={badge.name} className="w-24 h-24 object-contain" />
              </div>

              <div className="mt-12 max-w-xl mx-auto text-center">
                <h2 className="text-2xl font-bold mb-4 text-[#0A3C1F] dark:text-[#FFD700]">
                  Join the San Francisco Sheriff's Office
                </h2>
                <p className="text-[#0A3C1F]/70 dark:text-white/70 mb-6">
                  Earn badges like this one by engaging with our AI assistant and learning about the application
                  process. Discover a rewarding career with competitive pay, excellent benefits, and opportunities for
                  advancement.
                </p>

                <Link href="/">
                  <Button className="bg-[#FFD700] hover:bg-[#FFD700]/90 text-[#0A3C1F] dark:text-black font-bold px-8 py-3 rounded-xl text-lg shadow-lg">
                    Learn More & Apply
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </main>
        <ImprovedFooter />
      </div>
    </UserProvider>
  )
} 