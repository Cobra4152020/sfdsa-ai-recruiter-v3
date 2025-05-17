import { PageWrapper } from "@/components/page-wrapper"

export default function HomePage() {
  return (
    <PageWrapper>
      <div className="container mx-auto px-4 py-8">
        <section className="mb-12">
          <h1 className="text-4xl font-bold text-primary mb-4">San Francisco Deputy Sheriff</h1>
          <p className="text-lg mb-6">Join our team and make a difference in our community.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-card p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-3">Competitive Salary</h2>
              <p>Starting salary ranges from $89,648 to $108,914 annually.</p>
            </div>
            
            <div className="bg-card p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-3">Benefits</h2>
              <p>Medical, dental, vision coverage, and retirement plans.</p>
            </div>
            
            <div className="bg-card p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-3">Career Growth</h2>
              <p>Opportunities for advancement and specialized training.</p>
            </div>
          </div>
        </section>
        
        <section className="my-12">
          <h2 className="text-3xl font-bold text-primary mb-6">Ready to Serve?</h2>
          <div className="flex justify-center">
            <a href="/apply" className="bg-primary text-primary-foreground px-6 py-3 rounded-md text-lg font-medium hover:bg-primary/90 transition-colors">
              Apply Now
            </a>
          </div>
        </section>
      </div>
    </PageWrapper>
  )
} 