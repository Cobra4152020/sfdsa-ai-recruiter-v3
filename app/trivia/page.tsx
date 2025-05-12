"use client"
import Link from "next/link"
import Image from "next/image"
import { ImprovedHeader } from "@/components/improved-header"
import { ImprovedFooter } from "@/components/improved-footer"
import { Card, CardContent } from "@/components/ui/card"
import { Trophy, MapPin, Landmark, Building } from "lucide-react"

export default function TriviaMainPage() {
  return (
    <>
      <ImprovedHeader showOptInForm={() => {}} />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-[#0A3C1F] mb-2">San Francisco Trivia Games</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Test your knowledge about San Francisco with our collection of trivia games. Earn badges and compete on the
            leaderboard!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* SF Football Trivia */}
          <Card className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="relative h-48">
              <Image
                src="/levis-stadium-49ers.png"
                alt="Levi's Stadium - Home of the 49ers"
                fill
                className="object-cover"
              />
            </div>
            <CardContent className="p-6">
              <div className="flex items-center mb-2">
                <Trophy className="h-5 w-5 text-[#0A3C1F] mr-2" />
                <h2 className="text-xl font-bold text-[#0A3C1F]">SF Football Trivia</h2>
              </div>
              <p className="text-gray-600 mb-4">
                Test your knowledge about San Francisco football history and the 49ers.
              </p>
              <Link
                href="/trivia/sf-football"
                className="inline-block bg-[#0A3C1F] hover:bg-[#0A3C1F]/90 text-white py-2 px-4 rounded-md transition-colors"
              >
                Play Now
              </Link>
            </CardContent>
          </Card>

          {/* SF Baseball Trivia */}
          <Card className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="relative h-48">
              <Image
                src="/oracle-park-giants.png"
                alt="Oracle Park - Home of the SF Giants"
                fill
                className="object-cover"
              />
            </div>
            <CardContent className="p-6">
              <div className="flex items-center mb-2">
                <Trophy className="h-5 w-5 text-[#0A3C1F] mr-2" />
                <h2 className="text-xl font-bold text-[#0A3C1F]">SF Baseball Trivia</h2>
              </div>
              <p className="text-gray-600 mb-4">
                How much do you know about the San Francisco Giants and baseball in the Bay Area?
              </p>
              <Link
                href="/trivia/sf-baseball"
                className="inline-block bg-[#0A3C1F] hover:bg-[#0A3C1F]/90 text-white py-2 px-4 rounded-md transition-colors"
              >
                Play Now
              </Link>
            </CardContent>
          </Card>

          {/* SF Basketball Trivia */}
          <Card className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="relative h-48">
              <Image
                src="/chase-center-gsw.png"
                alt="Chase Center - Home of the Golden State Warriors"
                fill
                className="object-cover"
              />
            </div>
            <CardContent className="p-6">
              <div className="flex items-center mb-2">
                <Trophy className="h-5 w-5 text-[#0A3C1F] mr-2" />
                <h2 className="text-xl font-bold text-[#0A3C1F]">SF Basketball Trivia</h2>
              </div>
              <p className="text-gray-600 mb-4">
                Challenge yourself with questions about the Golden State Warriors and basketball in San Francisco.
              </p>
              <Link
                href="/trivia/sf-basketball"
                className="inline-block bg-[#0A3C1F] hover:bg-[#0A3C1F]/90 text-white py-2 px-4 rounded-md transition-colors"
              >
                Play Now
              </Link>
            </CardContent>
          </Card>

          {/* SF Districts Trivia */}
          <Card className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="relative h-48">
              <Image src="/san-francisco-cityscape.png" alt="San Francisco Cityscape" fill className="object-cover" />
            </div>
            <CardContent className="p-6">
              <div className="flex items-center mb-2">
                <Building className="h-5 w-5 text-[#0A3C1F] mr-2" />
                <h2 className="text-xl font-bold text-[#0A3C1F]">SF District Trivia</h2>
              </div>
              <p className="text-gray-600 mb-4">
                Test your knowledge of San Francisco's unique and diverse neighborhoods and districts.
              </p>
              <Link
                href="/trivia/sf-districts"
                className="inline-block bg-[#0A3C1F] hover:bg-[#0A3C1F]/90 text-white py-2 px-4 rounded-md transition-colors"
              >
                Play Now
              </Link>
            </CardContent>
          </Card>

          {/* SF Tourist Spots Trivia */}
          <Card className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="relative h-48">
              <Image src="/golden-gate-bridge.png" alt="Golden Gate Bridge" fill className="object-cover" />
            </div>
            <CardContent className="p-6">
              <div className="flex items-center mb-2">
                <Landmark className="h-5 w-5 text-[#0A3C1F] mr-2" />
                <h2 className="text-xl font-bold text-[#0A3C1F]">SF Tourist Spots Trivia</h2>
              </div>
              <p className="text-gray-600 mb-4">
                How well do you know San Francisco's famous landmarks and tourist attractions?
              </p>
              <Link
                href="/trivia/sf-tourist-spots"
                className="inline-block bg-[#0A3C1F] hover:bg-[#0A3C1F]/90 text-white py-2 px-4 rounded-md transition-colors"
              >
                Play Now
              </Link>
            </CardContent>
          </Card>

          {/* SF Day Trips Trivia */}
          <Card className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="relative h-48">
              <Image
                src="/lombard-street-crooked.png"
                alt="Lombard Street - The Crooked Street"
                fill
                className="object-cover"
              />
            </div>
            <CardContent className="p-6">
              <div className="flex items-center mb-2">
                <MapPin className="h-5 w-5 text-[#0A3C1F] mr-2" />
                <h2 className="text-xl font-bold text-[#0A3C1F]">SF Best Places to Visit</h2>
              </div>
              <p className="text-gray-600 mb-4">
                Test your knowledge about the best day trips and places to visit around San Francisco.
              </p>
              <Link
                href="/trivia/sf-day-trips"
                className="inline-block bg-[#0A3C1F] hover:bg-[#0A3C1F]/90 text-white py-2 px-4 rounded-md transition-colors"
              >
                Play Now
              </Link>
            </CardContent>
          </Card>
        </div>
      </main>
      <ImprovedFooter />
    </>
  )
}
