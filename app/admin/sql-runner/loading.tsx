import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="container py-10">
      <Skeleton className="h-10 w-64 mb-8" />
      <Skeleton className="h-24 w-full mb-6" />
      <Skeleton className="h-96 w-full" />
    </div>
  )
}
