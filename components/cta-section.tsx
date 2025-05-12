"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

interface CTASectionProps {
  showOptInForm: (isApplying?: boolean) => void
}

export function CTASection({ showOptInForm }: CTASectionProps) {
  return (
    <section className="py-16 bg-[#0A3C1F] text-white">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Start Your Journey?</h2>
          <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
            Join the San Francisco Sheriff's Office and become part of a team dedicated to public safety and community
            service.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button
              onClick={() => showOptInForm(true)}
              size="lg"
              className="bg-[#FFD700] hover:bg-[#FFD700]/90 text-[#0A3C1F] font-bold text-lg px-8"
            >
              Apply Now
            </Button>
            <Button
              onClick={() => showOptInForm(false)}
              size="lg"
              variant="outline"
              className="border-white/30 text-white hover:bg-white/10 font-medium text-lg px-8"
            >
              Get More Information <ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
