"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { AskSgtKenButton } from "@/components/ask-sgt-ken-button"

interface HeroSectionProps {
  onGetStarted: () => void
  showOptInForm: (isApplying?: boolean) => void
}

export function HeroSection({ onGetStarted, showOptInForm }: HeroSectionProps) {
  return (
    <section className="w-full bg-background text-foreground py-12 md:py-20">
      <div className="container mx-auto px-4 flex flex-col items-center text-center">
        <h1 className="text-5xl md:text-6xl font-bold mb-6 text-primary">San Francisco Deputy Sheriff</h1>
        <p className="text-lg md:text-xl mb-8 text-foreground">Join our team and make a difference in our community.</p>
        <div className="flex flex-col md:flex-row gap-4 justify-center">
          <button className="px-8 py-3 rounded-lg bg-primary text-primary-foreground font-semibold text-lg shadow-md hover:bg-primary/90 transition-colors" onClick={onGetStarted}>
            Get Started
          </button>
          <button className="px-8 py-3 rounded-lg bg-secondary text-secondary-foreground font-semibold text-lg shadow-md hover:bg-secondary/80 transition-colors" onClick={() => showOptInForm && showOptInForm(false)}>
            Learn More
          </button>
        </div>
      </div>
    </section>
  )
}
