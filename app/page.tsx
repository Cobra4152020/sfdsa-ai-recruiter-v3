import { Button } from "@/components/ui/button"
import Link from "next/link"

export const metadata = {
  title: "SFDSA Recruiter - San Francisco Deputy Sheriff's Association",
  description: "Join the San Francisco Deputy Sheriff's Association and make a difference in your community.",
}

export default function HomePage() {
  return (
    <div className="container flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] py-8 text-center">
      <h1 className="text-4xl font-bold mb-4">San Francisco Deputy Sheriff's Association</h1>
      <p className="text-xl text-gray-600 max-w-2xl mb-8">
        Join our team and make a difference in your community. Explore opportunities, complete challenges, and connect
        with fellow deputies.
      </p>
      <div className="flex gap-4">
        <Button asChild size="lg">
          <Link href="/dashboard">Go to Dashboard</Link>
        </Button>
        <Button variant="outline" asChild size="lg">
          <Link href="/daily-briefing">Daily Briefing</Link>
        </Button>
      </div>
    </div>
  )
}
