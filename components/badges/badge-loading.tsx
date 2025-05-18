import { Skeleton } from "@/components/ui/skeleton"

interface BadgeLoadingProps {
  variant?: "full" | "compact"
}

export function BadgeLoading({ variant = "full" }: BadgeLoadingProps) {
  if (variant === "compact") {
    return (
      <div className="flex items-start space-x-3 animate-pulse">
        <div className="h-12 w-12 rounded-full bg-gray-200" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-3 w-32" />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8 animate-pulse">
      <div className="flex items-center justify-center">
        <div className="h-20 w-20 rounded-full bg-gray-200" />
      </div>
      
      <div className="space-y-4">
        <Skeleton className="h-8 w-48 mx-auto" />
        <Skeleton className="h-4 w-64 mx-auto" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-3">
          <Skeleton className="h-6 w-32" />
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-4 w-full" />
          ))}
        </div>
        <div className="space-y-3">
          <Skeleton className="h-6 w-32" />
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-4 w-full" />
          ))}
        </div>
      </div>

      <div className="flex justify-center space-x-4">
        <Skeleton className="h-10 w-32" />
        <Skeleton className="h-10 w-32" />
      </div>
    </div>
  )
} 