import { DollarSign, Heart, GraduationCap } from "lucide-react";

export function BenefitsSection() {
  return (
    <section className="w-full py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          
          {/* Section Header */}
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Why Choose SF Sheriff's Department?
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Join one of California's most respected law enforcement agencies with unmatched 
              benefits, career growth, and community impact opportunities.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            <div className="bg-background rounded-lg shadow-md p-4 sm:p-6 border border-border transform transition-all duration-300 hover:scale-[1.02] hover:shadow-lg">
              <div className="flex items-center mb-3 sm:mb-4">
                <DollarSign className="h-5 w-5 sm:h-6 sm:w-6 text-primary mr-2" />
                <h3 className="text-lg sm:text-xl font-semibold text-foreground">
                  Competitive Salary
                </h3>
              </div>
              <p className="text-sm sm:text-base text-muted-foreground">
                Starting salary ranges from $118,768 to $184,362 annually (with incentives).
              </p>
            </div>
            <div className="bg-background rounded-lg shadow-md p-4 sm:p-6 border border-border transform transition-all duration-300 hover:scale-[1.02] hover:shadow-lg">
              <div className="flex items-center mb-3 sm:mb-4">
                <Heart className="h-5 w-5 sm:h-6 sm:w-6 text-primary mr-2" />
                <h3 className="text-lg sm:text-xl font-semibold text-foreground">
                  Comprehensive Benefits
                </h3>
              </div>
              <p className="text-sm sm:text-base text-muted-foreground">
                Medical, dental, vision, and retirement plans included.
              </p>
            </div>
            <div className="bg-background rounded-lg shadow-md p-4 sm:p-6 border border-border transform transition-all duration-300 hover:scale-[1.02] hover:shadow-lg">
              <div className="flex items-center mb-3 sm:mb-4">
                <GraduationCap className="h-5 w-5 sm:h-6 sm:w-6 text-primary mr-2" />
                <h3 className="text-lg sm:text-xl font-semibold text-foreground">
                  Career Growth
                </h3>
              </div>
              <p className="text-sm sm:text-base text-muted-foreground">
                Opportunities for advancement and specialized training.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
