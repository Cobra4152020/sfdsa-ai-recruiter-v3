import { Skeleton } from "@/components/ui/skeleton"

export default function DailyBriefingLoading() {
  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Sgt. Ken's Daily Briefing</h1>

      <div className="space-y-6">
        <div className="w-full max-w-3xl mx-auto">
          <div className="rounded-lg border p-6 space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Skeleton className="h-8 w-8 rounded-full" />
                <Skeleton className="h-8 w-40" />
              </div>
              <Skeleton className="h-6 w-24" />
            </div>

            <div className="space-y-4">
              <Skeleton className="h-24 w-full rounded-lg" />
              <div className="space-y-2">
                <Skeleton className="h-6 w-40" />
                <Skeleton className="h-20 w-full" />
              </div>
              <Skeleton className="h-24 w-full rounded-lg" />
            </div>

            <div className="flex gap-3 pt-2">
              <Skeleton className="h-10 w-40" />
              <div className="flex gap-2 ml-auto">
                <Skeleton className="h-10 w-20" />
                <Skeleton className="h-10 w-20" />
                <Skeleton className="h-10 w-20" />
              </div>
            </div>
          </div>
        </div>

        <div className="w-full max-w-3xl mx-auto">
          <div className="rounded-lg border p-6">
            <Skeleton className="h-8 w-40 mb-4" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Skeleton className="h-24 w-full rounded-lg" />
              <Skeleton className="h-24 w-full rounded-lg" />
              <Skeleton className="h-24 w-full rounded-lg" />
              <Skeleton className="h-24 w-full rounded-lg" />
            </div>
          </div>
        </div>

        <div className="w-full max-w-3xl mx-auto">
          <div className="rounded-lg border p-6">
            <Skeleton className="h-8 w-40 mb-4" />
            <div className="space-y-3">
              <Skeleton className="h-12 w-full rounded-lg" />
              <Skeleton className="h-12 w-full rounded-lg" />
              <Skeleton className="h-12 w-full rounded-lg" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
