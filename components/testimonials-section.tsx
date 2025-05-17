import Image from "next/image"
import { Star } from "lucide-react"

export function TestimonialsSection() {
  return (
    <section className="w-full py-12 md:py-20 bg-background text-foreground">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold mb-8 text-primary">What Our Deputies Say</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-card rounded-lg shadow-md p-6">
            <p className="mb-4">“Joining the SF Sheriff's Office was the best decision I ever made. The team is supportive and the work is meaningful.”</p>
            <span className="font-semibold text-primary">Deputy A. Smith</span>
          </div>
          <div className="bg-card rounded-lg shadow-md p-6">
            <p className="mb-4">“The benefits and opportunities for growth are unmatched. I feel valued every day.”</p>
            <span className="font-semibold text-primary">Deputy B. Lee</span>
          </div>
          <div className="bg-card rounded-lg shadow-md p-6">
            <p className="mb-4">“I'm proud to serve my community and be part of such a dedicated department.”</p>
            <span className="font-semibold text-primary">Deputy C. Patel</span>
          </div>
        </div>
      </div>
    </section>
  )
}
