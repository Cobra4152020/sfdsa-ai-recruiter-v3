import Link from "next/link"
import { Shield } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#0A3C1F] px-4 py-12">
      <div className="text-center">
        <div className="flex justify-center mb-6">
          <Shield className="h-16 w-16 text-[#FFD700]" />
        </div>
        <h1 className="text-3xl font-bold text-[#FFD700] mb-2">Page Not Found</h1>
        <p className="text-white mb-8 max-w-md mx-auto">
          The page you're looking for doesn't exist or has been moved to another location.
        </p>
        <div className="space-y-4">
          <Button asChild className="bg-[#FFD700] hover:bg-[#FFD700]/90 text-[#0A3C1F] font-medium">
            <Link href="/">Return to Home</Link>
          </Button>
          <div className="pt-4">
            <Link href="/awards" className="text-white hover:text-[#FFD700] transition-colors">
              View Top Recruit Awards
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
