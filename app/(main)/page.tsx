import { Suspense } from "react"

// Create a simplified version that can be rendered as a static page
export default function Home() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <main className="flex-1">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-4xl font-bold mb-6">SF Deputy Sheriff Recruitment</h1>
          <p className="text-lg mb-8">
            Join the San Francisco Sheriff's Office. Competitive salary, benefits, and career advancement opportunities. 
            Apply now for a rewarding career in law enforcement.
          </p>
          
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <div className="p-6 border rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-2">Competitive Salary</h3>
              <p>Starting salaries begin at $92,560 with regular increases.</p>
            </div>
            <div className="p-6 border rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-2">Great Benefits</h3>
              <p>Comprehensive healthcare, retirement plans, and paid time off.</p>
            </div>
            <div className="p-6 border rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-2">Career Advancement</h3>
              <p>Opportunities for promotion and specialized assignments.</p>
            </div>
          </div>
          
          <div className="mt-12">
            <h2 className="text-3xl font-bold mb-6">How to Apply</h2>
            <p className="mb-4">
              Register on our platform to start your application process. 
              Our team will guide you through each step of becoming a deputy sheriff.
            </p>
          </div>
        </div>
      </main>
    </Suspense>
  )
}
