// import Image from "next/image"; // Commented out unused import
import { Star } from "lucide-react";
// import { Card, CardContent } from "@/components/ui/card"; // Commented out unused imports

export function TestimonialsSection() {
  return (
    <section className="w-full py-8 sm:py-12 md:py-20 bg-card text-card-foreground">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 sm:mb-8 text-card-foreground text-center sm:text-left">
            What Our Deputies Say
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            <div className="bg-background rounded-lg shadow-md p-4 sm:p-6 border border-border transform transition-all duration-300 hover:scale-[1.02] hover:shadow-lg">
              <div className="flex mb-3 sm:mb-4 text-primary">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="h-4 w-4 sm:h-5 sm:w-5 fill-current"
                  />
                ))}
              </div>
              <p className="mb-4 text-sm sm:text-base text-muted-foreground">
                &quot;Joining the SF Sheriff&apos;s Office was the best decision
                I ever made. The team is supportive and the work is
                meaningful.&quot;
              </p>
              <span className="font-semibold text-primary text-sm sm:text-base">
                Deputy A. Smith
              </span>
            </div>
            <div className="bg-background rounded-lg shadow-md p-4 sm:p-6 border border-border transform transition-all duration-300 hover:scale-[1.02] hover:shadow-lg">
              <div className="flex mb-3 sm:mb-4 text-primary">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="h-4 w-4 sm:h-5 sm:w-5 fill-current"
                  />
                ))}
              </div>
              <p className="mb-4 text-sm sm:text-base text-muted-foreground">
                &quot;The benefits and opportunities for growth are unmatched. I
                feel valued every day.&quot;
              </p>
              <span className="font-semibold text-primary text-sm sm:text-base">
                Deputy B. Lee
              </span>
            </div>
            <div className="bg-background rounded-lg shadow-md p-4 sm:p-6 border border-border transform transition-all duration-300 hover:scale-[1.02] hover:shadow-lg">
              <div className="flex mb-3 sm:mb-4 text-primary">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="h-4 w-4 sm:h-5 sm:w-5 fill-current"
                  />
                ))}
              </div>
              <p className="mb-4 text-sm sm:text-base text-muted-foreground">
                &quot;I&apos;m proud to serve my community and be part of such a
                dedicated department.&quot;
              </p>
              <span className="font-semibold text-primary text-sm sm:text-base">
                Deputy C. Patel
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
