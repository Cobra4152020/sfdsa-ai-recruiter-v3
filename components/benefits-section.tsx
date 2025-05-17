import { Shield, DollarSign, Clock, Heart, GraduationCap, Home } from "lucide-react"

export function BenefitsSection() {
  return (
    <section className="w-full py-8 sm:py-12 md:py-20 bg-[#0A3C1F] text-white">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 sm:mb-8 text-[#F8F5EE] text-center sm:text-left">Benefits of Joining</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 border border-[#0A3C1F]/10 transform transition-all duration-300 hover:scale-[1.02] hover:shadow-lg">
              <div className="flex items-center mb-3 sm:mb-4">
                <DollarSign className="h-5 w-5 sm:h-6 sm:w-6 text-[#FFD700] mr-2" />
                <h3 className="text-lg sm:text-xl font-semibold text-[#0A3C1F]">Competitive Salary</h3>
              </div>
              <p className="text-sm sm:text-base text-[#0A3C1F]/70">Starting salary ranges from $89,648 to $108,914 annually.</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 border border-[#0A3C1F]/10 transform transition-all duration-300 hover:scale-[1.02] hover:shadow-lg">
              <div className="flex items-center mb-3 sm:mb-4">
                <Heart className="h-5 w-5 sm:h-6 sm:w-6 text-[#FFD700] mr-2" />
                <h3 className="text-lg sm:text-xl font-semibold text-[#0A3C1F]">Comprehensive Benefits</h3>
              </div>
              <p className="text-sm sm:text-base text-[#0A3C1F]/70">Medical, dental, vision, and retirement plans included.</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 border border-[#0A3C1F]/10 transform transition-all duration-300 hover:scale-[1.02] hover:shadow-lg">
              <div className="flex items-center mb-3 sm:mb-4">
                <GraduationCap className="h-5 w-5 sm:h-6 sm:w-6 text-[#FFD700] mr-2" />
                <h3 className="text-lg sm:text-xl font-semibold text-[#0A3C1F]">Career Growth</h3>
              </div>
              <p className="text-sm sm:text-base text-[#0A3C1F]/70">Opportunities for advancement and specialized training.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
