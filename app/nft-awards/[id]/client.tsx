"use client"

import { useState, useEffect } from "react"
import { NFTAwardCard } from "@/components/nft-award-card"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { PageWrapper } from "@/components/page-wrapper"
import type { NFTAward } from "@/lib/nft-utils"

interface NFTAwardPageClientProps {
  award: NFTAward | undefined
}

export function NFTAwardPageClient({ award }: NFTAwardPageClientProps) {
  const [showOptInForm, setShowOptInForm] = useState(false)
  const [UserProvider, setUserProvider] = useState<any>(null)

  useEffect(() => {
    const loadClientModules = async () => {
      const { UserProvider } = await import("@/context/user-context")
      setUserProvider(() => UserProvider)
    }
    loadClientModules()
  }, [])

  if (!UserProvider) {
    return null
  }

  if (!award) {
    return (
      <UserProvider>
        <PageWrapper>
          <main className="flex-1 bg-white dark:bg-gray-900 pt-8 pb-12">
            <div className="text-center">
              <h1 className="text-3xl font-bold mb-4">NFT Award Not Found</h1>
              <p className="mb-8">The NFT award you're looking for doesn't exist.</p>
              <Link href="/" prefetch={false}>
                <Button>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Home
                </Button>
              </Link>
            </div>
          </main>
        </PageWrapper>
      </UserProvider>
    )
  }

  // Meta tags for social sharing
  const title = `${award.name} - SF Sheriff Recruitment NFT Award`
  const description = award.description

  return (
    <UserProvider>
      <PageWrapper>
        <head>
          <title>{title}</title>
          <meta name="description" content={description} />
          <meta property="og:title" content={title} />
          <meta property="og:description" content={description} />
          <meta property="og:type" content="website" />
          <meta
            property="og:image"
            content={`${process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000"}${award.imageUrl}`}
          />
          <meta property="twitter:card" content="summary_large_image" />
          <meta property="twitter:title" content={title} />
          <meta property="twitter:description" content={description} />
          <meta
            property="twitter:image"
            content={`${process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000"}${award.imageUrl}`}
          />
        </head>

        <main className="flex-1 bg-white dark:bg-gray-900 pt-8 pb-12">
          <div className="container mx-auto px-4">
            <Link href="/" prefetch={false}>
              <Button variant="ghost" className="mb-8">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Button>
            </Link>

            <div className="max-w-3xl mx-auto text-center mb-8">
              <h1 className="text-3xl md:text-4xl font-bold mb-4 text-[#0A3C1F] dark:text-[#FFD700]">{award.name}</h1>
              <p className="text-lg text-[#0A3C1F]/70 dark:text-white/70">{award.description}</p>
            </div>

            <div className="flex flex-col items-center justify-center">
              <div className="max-w-md w-full">
                <NFTAwardCard
                  id={award.id}
                  name={award.name}
                  description={award.description}
                  imageUrl={award.imageUrl}
                  className="w-full"
                />
              </div>

              <div className="mt-12 max-w-xl mx-auto text-center">
                <h2 className="text-2xl font-bold mb-4 text-[#0A3C1F] dark:text-[#FFD700]">
                  Join the San Francisco Sheriff's Office
                </h2>
                <p className="text-[#0A3C1F]/70 dark:text-white/70 mb-6">
                  Earn exclusive NFT awards like this one by participating in our recruitment process. Discover a
                  rewarding career with competitive pay, excellent benefits, and opportunities for advancement.
                </p>

                <Link href="/" prefetch={false}>
                  <Button className="bg-[#FFD700] hover:bg-[#FFD700]/90 text-[#0A3C1F] dark:text-black font-bold px-8 py-3 rounded-xl text-lg shadow-lg">
                    Learn More & Apply
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </main>
      </PageWrapper>
    </UserProvider>
  )
} 