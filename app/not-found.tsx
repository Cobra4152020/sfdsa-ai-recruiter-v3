import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Shield, Home, Search, ArrowLeft } from "lucide-react"

export default function NotFound() {
  return (
    <div className="bg-[#F8F5EE] dark:bg-[#121212] min-h-screen">
      <header className="bg-[#0A3C1F] dark:bg-[#121212] text-white py-4">
        <div className="max-w-7xl mx-auto px-4">
          <Link
            href="/"
            className="flex items-center hover:opacity-90 transition-opacity"
            aria-label="SF Deputy Sheriff AI Recruitment - Home"
          >
            <Shield className="h-8 w-8 text-[#FFD700] mr-2" aria-hidden="true" />
            <div>
              <span className="font-bold text-white text-lg">SF Deputy Sheriff</span>
              <span className="text-[#FFD700] text-xs block -mt-1">AI Recruitment</span>
            </div>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-16 flex flex-col items-center justify-center min-h-[60vh]">
        <div className="text-center max-w-md">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <Shield className="h-24 w-24 text-[#0A3C1F] opacity-20" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-4xl font-bold text-[#0A3C1F]">404</span>
              </div>
            </div>
          </div>

          <h1 className="text-3xl font-bold text-[#0A3C1F] mb-4">Page Not Found</h1>

          <p className="text-gray-600 mb-8">The page you're looking for doesn't exist or has been moved.</p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild className="bg-[#0A3C1F] hover:bg-[#0A3C1F]/90">
              <Link href="/">
                <Home className="h-4 w-4 mr-2" />
                Back to Home
              </Link>
            </Button>

            <Button asChild variant="outline">
              <Link href="/contact">
                <Search className="h-4 w-4 mr-2" />
                Contact Support
              </Link>
            </Button>
          </div>

          <div className="mt-12">
            <Button asChild variant="link" className="text-[#0A3C1F]">
              <Link href="javascript:history.back()">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Go Back
              </Link>
            </Button>
          </div>
        </div>
      </main>

      <footer className="bg-[#0A3C1F] dark:bg-[#121212] text-white py-6">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm">
            © {new Date().getFullYear()} San Francisco Deputy Sheriff's Association. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
