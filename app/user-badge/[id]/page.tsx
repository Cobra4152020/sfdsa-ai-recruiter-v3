import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ImprovedHeader } from "@/components/improved-header"
import { ImprovedFooter } from "@/components/improved-footer"
import { UserProvider } from "@/context/user-context"
import { getAllBadgeIds } from "@/lib/badge-utils"

interface UserBadgePageProps {
  params: {
    id: string
  }
}

export async function generateStaticParams() {
  const badgeIds = await getAllBadgeIds()
  return badgeIds.map((id) => ({
    id: id,
  }))
}

export async function generateMetadata({ params }: UserBadgePageProps): Promise<Metadata> {
  const decodedName = decodeURIComponent(params.id)

  return {
    title: `${decodedName}'s SF Sheriff Recruitment Badge`,
    description: "Join the San Francisco Sheriff's Office and start a rewarding career in law enforcement.",
    openGraph: {
      title: `${decodedName}'s SF Sheriff Recruitment Badge`,
      description: "Join the San Francisco Sheriff's Office and start a rewarding career in law enforcement.",
      images: [
        {
          url: "/placeholder.svg?key=lr7b8",
          width: 1200,
          height: 1200,
          alt: `${decodedName}'s SF Sheriff Recruitment Badge`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${decodedName}'s SF Sheriff Recruitment Badge`,
      description: "Join the San Francisco Sheriff's Office and start a rewarding career in law enforcement.",
      images: ["/placeholder.svg?key=jjudt"],
    },
  }
}

export default function UserBadgePage({ params }: UserBadgePageProps) {
  const decodedName = decodeURIComponent(params.id)

  return (
    <UserProvider>
      <div className="min-h-screen flex flex-col">
        <ImprovedHeader showOptInForm={() => {}} />
        <main className="flex-1 pt-40 pb-12 bg-[#F8F5EE] dark:bg-[#121212]">
          <div className="container mx-auto px-4">
            <Link href="/awards">
              <Button variant="ghost" className="mb-8">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Awards
              </Button>
            </Link>

            <div className="max-w-3xl mx-auto text-center mb-8">
              <h1 className="text-3xl md:text-4xl font-bold mb-4 text-[#0A3C1F] dark:text-[#FFD700]">
                {decodedName}'s Recruitment Badge
              </h1>
              <p className="text-lg text-[#0A3C1F]/70 dark:text-white/70">
                {decodedName} is exploring a career with the San Francisco Sheriff's Office. Join them and discover
                opportunities in law enforcement!
              </p>
            </div>

            <div className="flex flex-col items-center justify-center">
              {/* Replace with your RecruitmentBadge component or create a simplified version */}
              <div className="relative rounded-full bg-gradient-to-br from-[#0A3C1F] to-[#0A3C1F]/80 p-1 w-48 h-48">
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#FFD700] to-[#FFD700]/60 opacity-50 blur-md"></div>
                <div className="relative h-full w-full rounded-full bg-[#0A3C1F] flex flex-col items-center justify-center text-white p-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-1/3 h-1/3 text-[#FFD700] mb-2"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                  <div className="text-center">
                    <div className="font-bold text-[#FFD700]">SF DEPUTY SHERIFF</div>
                    <div className="mt-1 font-medium text-sm">RECRUIT CANDIDATE</div>
                  </div>
                </div>
              </div>

              <div className="mt-4 text-center">
                <h3 className="font-bold text-lg text-[#0A3C1F] dark:text-[#FFD700]">{decodedName}</h3>
                <p className="text-sm text-[#0A3C1F]/70 dark:text-white/70">Recruitment Candidate</p>
              </div>

              <div className="mt-12 max-w-xl mx-auto text-center">
                <h2 className="text-2xl font-bold mb-4 text-[#0A3C1F] dark:text-[#FFD700]">
                  Join the San Francisco Sheriff's Office
                </h2>
                <p className="text-[#0A3C1F]/70 dark:text-white/70 mb-6">
                  Discover a rewarding career with competitive pay, excellent benefits, and opportunities for
                  advancement. Make a difference in your community every day.
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
