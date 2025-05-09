import { Shield, DollarSign, Clock, Heart, GraduationCap, Home } from "lucide-react"

export function BenefitsSection() {
  return (
    <section id="benefits" className="py-16 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-[#0A3C1F] dark:text-[#FFD700] mb-4">Benefits of Joining</h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            The San Francisco Sheriff's Department offers competitive compensation and excellent benefits to attract and
            retain the best talent.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Competitive Salary */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <div className="flex items-center mb-4">
              <div className="bg-[#0A3C1F]/10 dark:bg-[#FFD700]/10 p-3 rounded-full mr-4">
                <DollarSign className="h-6 w-6 text-[#0A3C1F] dark:text-[#FFD700]" />
              </div>
              <h3 className="text-xl font-semibold text-[#0A3C1F] dark:text-[#FFD700]">Competitive Salary</h3>
            </div>
            <p className="text-gray-600 dark:text-gray-300">
              Starting salary range of $116,428 to $184,362 with regular step increases and opportunities for overtime.
            </p>
          </div>

          {/* Flexible Schedule */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <div className="flex items-center mb-4">
              <div className="bg-[#0A3C1F]/10 dark:bg-[#FFD700]/10 p-3 rounded-full mr-4">
                <Clock className="h-6 w-6 text-[#0A3C1F] dark:text-[#FFD700]" />
              </div>
              <h3 className="text-xl font-semibold text-[#0A3C1F] dark:text-[#FFD700]">Flexible Schedule</h3>
            </div>
            <p className="text-gray-600 dark:text-gray-300">
              Various shift options including 4/10 work schedule (four 10-hour days per week) with three consecutive
              days off.
            </p>
          </div>

          {/* Health Benefits */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <div className="flex items-center mb-4">
              <div className="bg-[#0A3C1F]/10 dark:bg-[#FFD700]/10 p-3 rounded-full mr-4">
                <Heart className="h-6 w-6 text-[#0A3C1F] dark:text-[#FFD700]" />
              </div>
              <h3 className="text-xl font-semibold text-[#0A3C1F] dark:text-[#FFD700]">Health Benefits</h3>
            </div>
            <p className="text-gray-600 dark:text-gray-300">
              Comprehensive medical, dental, and vision coverage for you and your dependents with multiple plan options.
            </p>
          </div>

          {/* Retirement Plan */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <div className="flex items-center mb-4">
              <div className="bg-[#0A3C1F]/10 dark:bg-[#FFD700]/10 p-3 rounded-full mr-4">
                <Shield className="h-6 w-6 text-[#0A3C1F] dark:text-[#FFD700]" />
              </div>
              <h3 className="text-xl font-semibold text-[#0A3C1F] dark:text-[#FFD700]">Retirement Plan</h3>
            </div>
            <p className="text-gray-600 dark:text-gray-300">
              Generous pension plan with the ability to retire after 25 years of service with up to 75% of your highest
              salary.
            </p>
          </div>

          {/* Education Opportunities */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <div className="flex items-center mb-4">
              <div className="bg-[#0A3C1F]/10 dark:bg-[#FFD700]/10 p-3 rounded-full mr-4">
                <GraduationCap className="h-6 w-6 text-[#0A3C1F] dark:text-[#FFD700]" />
              </div>
              <h3 className="text-xl font-semibold text-[#0A3C1F] dark:text-[#FFD700]">Education Opportunities</h3>
            </div>
            <p className="text-gray-600 dark:text-gray-300">
              Tuition reimbursement, G.I. Bill benefits for veterans, and ongoing professional development and training.
            </p>
          </div>

          {/* Housing Assistance */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <div className="flex items-center mb-4">
              <div className="bg-[#0A3C1F]/10 dark:bg-[#FFD700]/10 p-3 rounded-full mr-4">
                <Home className="h-6 w-6 text-[#0A3C1F] dark:text-[#FFD700]" />
              </div>
              <h3 className="text-xl font-semibold text-[#0A3C1F] dark:text-[#FFD700]">Housing Assistance</h3>
            </div>
            <p className="text-gray-600 dark:text-gray-300">
              Access to discounted housing programs and first-time homebuyer assistance for law enforcement officers in
              San Francisco.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
