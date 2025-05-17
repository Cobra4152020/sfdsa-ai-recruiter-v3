import Image from "next/image"
import { Star } from "lucide-react"

export function TestimonialsSection() {
  return (
    <section className="w-full py-12 md:py-20 bg-[#0A3C1F] text-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold mb-8 text-white">What Our Deputies Say</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg shadow-md p-6 border border-white/20">
            <div className="flex mb-4 text-[#FFD700]">
              <Star className="h-5 w-5 fill-current" />
              <Star className="h-5 w-5 fill-current" />
              <Star className="h-5 w-5 fill-current" />
              <Star className="h-5 w-5 fill-current" />
              <Star className="h-5 w-5 fill-current" />
            </div>
            <p className="mb-4 text-white/90">"Joining the SF Sheriff's Office was the best decision I ever made. The team is supportive and the work is meaningful."</p>
            <span className="font-semibold text-[#FFD700]">Deputy A. Smith</span>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg shadow-md p-6 border border-white/20">
            <div className="flex mb-4 text-[#FFD700]">
              <Star className="h-5 w-5 fill-current" />
              <Star className="h-5 w-5 fill-current" />
              <Star className="h-5 w-5 fill-current" />
              <Star className="h-5 w-5 fill-current" />
              <Star className="h-5 w-5 fill-current" />
            </div>
            <p className="mb-4 text-white/90">"The benefits and opportunities for growth are unmatched. I feel valued every day."</p>
            <span className="font-semibold text-[#FFD700]">Deputy B. Lee</span>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg shadow-md p-6 border border-white/20">
            <div className="flex mb-4 text-[#FFD700]">
              <Star className="h-5 w-5 fill-current" />
              <Star className="h-5 w-5 fill-current" />
              <Star className="h-5 w-5 fill-current" />
              <Star className="h-5 w-5 fill-current" />
              <Star className="h-5 w-5 fill-current" />
            </div>
            <p className="mb-4 text-white/90">"I'm proud to serve my community and be part of such a dedicated department."</p>
            <span className="font-semibold text-[#FFD700]">Deputy C. Patel</span>
          </div>
        </div>
      </div>
    </section>
  )
}
