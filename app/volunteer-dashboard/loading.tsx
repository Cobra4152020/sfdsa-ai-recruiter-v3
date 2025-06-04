import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <Skeleton className="h-12 w-64" />
        <Skeleton className="h-10 w-32" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-40 w-full" />
        ))}
      </div>

      <div className="flex items-center mb-6">
        <Skeleton className="h-10 w-32 mr-4" />
        <Skeleton className="h-10 w-32 mr-4" />
        <Skeleton className="h-10 w-32" />
      </div>

      <Skeleton className="h-96 w-full" />
    </div>
  );
}
