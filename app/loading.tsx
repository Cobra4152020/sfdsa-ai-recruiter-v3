export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="h-8 w-64 bg-[#0A3C1F]/20 rounded-lg animate-pulse mx-auto mb-8"></div>
      <div className="h-4 w-full bg-[#0A3C1F]/20 rounded-lg animate-pulse mb-4"></div>
      <div className="h-4 w-3/4 bg-[#0A3C1F]/20 rounded-lg animate-pulse mb-8"></div>

      <div className="h-64 w-full bg-[#0A3C1F]/20 rounded-lg animate-pulse mb-8"></div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="h-48 bg-[#0A3C1F]/20 rounded-lg animate-pulse"></div>
        <div className="h-48 bg-[#0A3C1F]/20 rounded-lg animate-pulse"></div>
        <div className="h-48 bg-[#0A3C1F]/20 rounded-lg animate-pulse"></div>
        <div className="h-48 bg-[#0A3C1F]/20 rounded-lg animate-pulse"></div>
      </div>
    </div>
  );
}
