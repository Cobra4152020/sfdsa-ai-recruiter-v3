import { Shield, DollarSign, Clock, Heart, GraduationCap, Home } from "lucide-react"

export function BenefitsSection() {
  return (
    <section className="w-full py-12 md:py-20 bg-card text-card-foreground">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold mb-8 text-primary">Benefits of Joining</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-background rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold mb-3 text-primary">Competitive Salary</h3>
            <p>Starting salary ranges from $89,648 to $108,914 annually.</p>
          </div>
          <div className="bg-background rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold mb-3 text-primary">Comprehensive Benefits</h3>
            <p>Medical, dental, vision, and retirement plans included.</p>
          </div>
          <div className="bg-background rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold mb-3 text-primary">Career Growth</h3>
            <p>Opportunities for advancement and specialized training.</p>
          </div>
        </div>
      </div>
    </section>
  )
}
