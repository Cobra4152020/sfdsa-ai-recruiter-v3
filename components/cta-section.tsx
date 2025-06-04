"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface CTASectionProps {
  showOptInForm: (isApplying?: boolean) => void;
}

export function CTASection({ showOptInForm }: CTASectionProps) {
  return (
    <section className="w-full py-12 md:py-20 bg-[#0A3C1F] text-white">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Ready to Start Your Journey?
        </h2>
        <p className="mb-8 text-lg">
          Apply now to become a San Francisco Deputy Sheriff and make a
          difference in your community.
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
            className="border-2 border-[#FFD700] text-[#FFD700] hover:bg-[#FFD700]/10 font-medium text-lg px-8"
          >
            Get More Information{" "}
            <ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" />
          </Button>
        </div>
      </div>
    </section>
  );
}
