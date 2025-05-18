import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function VolunteerLoginLoading() {
  return (
    <main className="container mx-auto px-4 py-8 md:py-12">
      <div className="max-w-md mx-auto">
        <Card className="border-t-4 border-t-[#0A3C1F] shadow-lg">
          <CardHeader className="space-y-1">
            <div className="flex items-center justify-center mb-4">
              <Skeleton className="h-10 w-10 rounded-full mr-2" />
              <Skeleton className="h-8 w-64" />
            </div>
            <Skeleton className="h-4 w-full" />
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-10 w-full" />
              </div>
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-5/6 mx-auto" />
              <Skeleton className="h-4 w-4/6 mx-auto" />
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
