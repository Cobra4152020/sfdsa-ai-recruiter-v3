"use client"

import Link from "next/link"
import { Trophy, Award, Lock, Rocket } from "lucide-react"
import { Button } from "@/components/ui/button"

export function PointsIntroduction() {
  return (
    <div className="bg-gradient-to-r from-[#0A3C1F]/5 to-transparent p-6 rounded-lg border border-[#0A3C1F]/20">
      <h2 className="text-2xl font-bold text-[#0A3C1F] mb-4">Explore the Deputy Sheriff Position</h2>
      <p className="text-gray-700 dark:text-gray-300 mb-4">
        Our platform is designed to help you learn about the San Francisco Deputy Sheriff role and prepare for the
        recruitment process. We've created an engaging experience that rewards your participation and progress.
      </p>
      <div className="grid md:grid-cols-3 gap-6 mt-6">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-[#0A3C1F]/10">
          <div className="rounded-full w-12 h-12 bg-[#0A3C1F]/10 flex items-center justify-center mb-3">
            <Trophy className="h-6 w-6 text-[#0A3C1F]" />
          </div>
          <h3 className="font-semibold mb-2">Earn Points</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Accumulate points by reading content, chatting with Sgt. Ken, taking practice tests, and more.
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-[#0A3C1F]/10">
          <div className="rounded-full w-12 h-12 bg-[#0A3C1F]/10 flex items-center justify-center mb-3">
            <Award className="h-6 w-6 text-[#0A3C1F]" />
          </div>
          <h3 className="font-semibold mb-2">Unlock Badges</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Earn achievement badges that showcase your progress and dedication to becoming a Deputy Sheriff.
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-[#0A3C1F]/10">
          <div className="rounded-full w-12 h-12 bg-[#0A3C1F]/10 flex items-center justify-center mb-3">
            <Lock className="h-6 w-6 text-[#0A3C1F]" />
          </div>
          <h3 className="font-semibold mb-2">Access Exclusive Content</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Unlock special resources and information as you progress through your recruitment journey.
          </p>
        </div>
      </div>
      <div className="mt-6 text-center">
        <Link href="/deputy-launchpad">
          <Button className="bg-[#0A3C1F] hover:bg-[#0A3C1F]/90">
            <Rocket className="mr-2 h-4 w-4" />
            Visit Deputy Launchpad
          </Button>
        </Link>
      </div>
    </div>
  )
}
