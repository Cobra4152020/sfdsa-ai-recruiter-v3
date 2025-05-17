import { Shield, DollarSign, Clock, Heart, GraduationCap, Home } from "lucide-react"

export function BenefitsSection() {
  return (
    <section className="w-full py-12 md:py-20 bg-white text-[#0A3C1F]">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold mb-8 text-[#0A3C1F]">Benefits of Joining</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-lg shadow-md p-6 border border-[#0A3C1F]/10">
            <div className="flex items-center mb-4">
              <DollarSign className="h-6 w-6 text-[#FFD700] mr-2" />
              <h3 className="text-xl font-semibold text-[#0A3C1F]">Competitive Salary</h3>
            </div>
            <p className="text-[#0A3C1F]/70">Starting salary ranges from $89,648 to $108,914 annually.</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 border border-[#0A3C1F]/10">
            <div className="flex items-center mb-4">
              <Heart className="h-6 w-6 text-[#FFD700] mr-2" />
              <h3 className="text-xl font-semibold text-[#0A3C1F]">Comprehensive Benefits</h3>
            </div>
            <p className="text-[#0A3C1F]/70">Medical, dental, vision, and retirement plans included.</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 border border-[#0A3C1F]/10">
            <div className="flex items-center mb-4">
              <GraduationCap className="h-6 w-6 text-[#FFD700] mr-2" />
              <h3 className="text-xl font-semibold text-[#0A3C1F]">Career Growth</h3>
            </div>
            <p className="text-[#0A3C1F]/70">Opportunities for advancement and specialized training.</p>
          </div>
        </div>
      </div>
    </section>
  )
}
