import { Loader2 } from "lucide-react"

export default function DailyBriefingLoading() {
  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold text-center mb-8 text-[#0A3C1F] dark:text-[#FFD700]">
        Sgt. Ken's Daily Briefing
      </h1>

      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <Loader2 className="h-12 w-12 text-[#0A3C1F] dark:text-[#FFD700] animate-spin mb-4" />
        <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300">Loading Sgt. Ken's Daily Briefing...</h2>
        <p className="text-gray-500 dark:text-gray-400 mt-2">Preparing today's motivation and insights...</p>
      </div>
    </div>
  )
}
