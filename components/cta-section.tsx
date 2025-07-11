"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

export function CTASection() {
  const router = useRouter();
  return (
    <section className="w-full py-12 md:py-20 bg-card text-card-foreground">
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
            onClick={() => router.push("/apply")}
            size="lg"
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-lg px-8"
          >
            Apply Now
          </Button>
          <Button
            onClick={() => router.push("/mission-briefing")}
            size="lg"
            variant="outline"
            className="border-2 border-primary text-primary hover:bg-primary/10 font-medium text-lg px-8"
          >
            Get More Information{" "}
            <ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" />
          </Button>
        </div>
      </div>
    </section>
  );
}
