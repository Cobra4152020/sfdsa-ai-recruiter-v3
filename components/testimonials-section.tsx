import Image from "next/image"
import { Star } from "lucide-react"

export function TestimonialsSection() {
  return (
    <section className="py-16 bg-[#0A3C1F]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <span className="text-[#FFD700] font-semibold">SUCCESS STORIES</span>
          <h2 className="text-3xl md:text-4xl font-bold mt-2 text-white">Hear From Our Deputies</h2>
          <p className="mt-4 text-lg text-white/70 max-w-3xl mx-auto">
            Learn about the experiences of those who have chosen a career with the San Francisco Sheriff's Office.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Testimonial 1 */}
          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
            <div className="flex mb-4" aria-label="5 out of 5 stars rating">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-5 w-5 fill-[#FFD700] text-[#FFD700]" aria-hidden="true" />
              ))}
            </div>
            <p className="text-gray-700 mb-6 italic">
              "Joining the Sheriff's Office was the best career decision I've made. The training prepared me well for
              the role, and I'm proud to serve the community while enjoying great benefits and work-life balance."
            </p>
            <div className="flex items-center">
              <div className="relative h-12 w-12 rounded-full overflow-hidden mr-4">
                <Image
                  src="/female-law-enforcement-headshot.png"
                  alt="Deputy Maria Rodriguez"
                  width={48}
                  height={48}
                  className="object-cover"
                />
              </div>
              <div>
                <h4 className="font-bold text-[#0A3C1F]">Deputy Maria Rodriguez</h4>
                <p className="text-gray-500 text-sm">5 years of service</p>
              </div>
            </div>
          </div>

          {/* Testimonial 2 */}
          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
            <div className="flex mb-4" aria-label="5 out of 5 stars rating">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-5 w-5 fill-[#FFD700] text-[#FFD700]" aria-hidden="true" />
              ))}
            </div>
            <p className="text-gray-700 mb-6 italic">
              "I transitioned from military service to the Sheriff's Office. The camaraderie, structured environment,
              and opportunities for advancement make this a rewarding career path with genuine job security."
            </p>
            <div className="flex items-center">
              <div className="relative h-12 w-12 rounded-full overflow-hidden mr-4">
                <Image
                  src="/male-law-enforcement-headshot.png"
                  alt="Deputy James Thompson"
                  width={48}
                  height={48}
                  className="object-cover"
                />
              </div>
              <div>
                <h4 className="font-bold text-[#0A3C1F]">Deputy James Thompson</h4>
                <p className="text-gray-500 text-sm">8 years of service</p>
              </div>
            </div>
          </div>

          {/* Testimonial 3 */}
          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
            <div className="flex mb-4" aria-label="5 out of 5 stars rating">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-5 w-5 fill-[#FFD700] text-[#FFD700]" aria-hidden="true" />
              ))}
            </div>
            <p className="text-gray-700 mb-6 italic">
              "What surprised me most was the variety of assignments available within the department. From courts to
              jails to community programs, there's always an opportunity to grow and find your niche."
            </p>
            <div className="flex items-center">
              <div className="relative h-12 w-12 rounded-full overflow-hidden mr-4">
                <Image
                  src="/asian-male-officer-headshot.png"
                  alt="Deputy David Chen"
                  width={48}
                  height={48}
                  className="object-cover"
                />
              </div>
              <div>
                <h4 className="font-bold text-[#0A3C1F]">Deputy David Chen</h4>
                <p className="text-gray-500 text-sm">3 years of service</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
