import { Skeleton } from "@/components/ui/skeleton"

export default function LoadingPage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <Skeleton className="h-10 w-3/4 mx-auto mb-6" />

        <div className="mb-8">
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-3/4 mb-2" />

          <Skeleton className="h-4 w-full mb-2 mt-4" />
          <Skeleton className="h-4 w-5/6 mb-2" />
        </div>

        <Skeleton className="h-[300px] w-full rounded-md" />

        <div className="mt-8">
          <Skeleton className="h-[100px] w-full rounded-md" />
        </div>
      </div>
    </main>
  )
}
