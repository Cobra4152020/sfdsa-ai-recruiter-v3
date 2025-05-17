"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Link from "next/link"

interface HeroSectionProps {
  onGetStarted: () => void
  showOptInForm: (isApplying?: boolean) => void
}

export function HeroSection({ onGetStarted, showOptInForm }: HeroSectionProps) {
  return (
    <section className="bg-[#0A3C1F] text-white pt-16 pb-12 relative">
      {/* Background pattern - subtle grid */}
      <div
        className="absolute inset-0 z-0 opacity-10"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23ffffff' fillOpacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
          backgroundSize: "30px 30px",
        }}
        aria-hidden="true"
      />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
            Join the <span className="text-[#FFD700]">San Francisco</span> Sheriff's Office
          </h1>
          <p className="text-xl md:text-2xl text-white/80 max-w-3xl mx-auto">
            Embark on a rewarding career in law enforcement. Protect our community with honor and integrity.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto items-stretch">
          {/* Benefits Box */}
          <div 
            className="transform-gpu bg-[#0A3C1F]/50 backdrop-blur-sm p-8 rounded-xl border border-white/20 
            shadow-[4px_4px_10px_0px_rgba(0,0,0,0.3),0_8px_10px_-6px_rgba(0,0,0,0.3),0_-2px_6px_0px_rgba(255,215,0,0.1)] 
            hover:shadow-[8px_8px_20px_0px_rgba(0,0,0,0.4),0_12px_16px_-8px_rgba(0,0,0,0.4),0_-4px_12px_0px_rgba(255,215,0,0.15)] 
            transition-all duration-300 ease-out hover:translate-y-[-4px]"
          >
            <h2 className="text-2xl font-bold mb-6 flex items-center">
              <span className="text-[#FFD700] mr-2" aria-hidden="true">
                ✓
              </span>
              Starting Salary: $116,428
            </h2>
            <ul className="space-y-4">
              <li className="flex items-start">
                <span className="text-[#FFD700] mr-2" aria-hidden="true">✓</span>
                <span>Full medical, dental, and vision benefits</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#FFD700] mr-2" aria-hidden="true">✓</span>
                <span>Paid academy training (23 weeks)</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#FFD700] mr-2" aria-hidden="true">✓</span>
                <span>Career advancement opportunities</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#FFD700] mr-2" aria-hidden="true">✓</span>
                <span>Retirement plan with pension</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#FFD700] mr-2" aria-hidden="true">✓</span>
                <span>Tuition reimbursement program</span>
              </li>
            </ul>
            <div className="mt-6 space-y-3">
              <Button
                onClick={() => showOptInForm(true)}
                className="w-full bg-[#FFD700] hover:bg-[#FFD700]/90 text-[#0A3C1F] font-bold text-lg py-6 
                transform-gpu transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]
                shadow-[0_4px_8px_0px_rgba(0,0,0,0.2)] hover:shadow-[0_6px_12px_0px_rgba(0,0,0,0.3)]"
              >
                Apply Now
              </Button>
              <Button
                onClick={() => showOptInForm(false)}
                variant="outline"
                className="w-full bg-[#0A3C1F] hover:bg-[#0A3C1F]/90 text-[#FFD700] border-[#FFD700] font-medium text-lg py-6 
                transform-gpu transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]
                shadow-[0_4px_8px_0px_rgba(0,0,0,0.2)] hover:shadow-[0_6px_12px_0px_rgba(0,0,0,0.3)]"
              >
                Get More Information
              </Button>
            </div>
          </div>

          {/* Image Box */}
          <div className="transform-gpu h-full">
            <div 
              className="relative rounded-xl overflow-hidden h-full min-h-[500px]
              shadow-[4px_4px_10px_0px_rgba(0,0,0,0.3),0_8px_10px_-6px_rgba(0,0,0,0.3),0_-2px_6px_0px_rgba(255,215,0,0.1)]
              hover:shadow-[8px_8px_20px_0px_rgba(0,0,0,0.4),0_12px_16px_-8px_rgba(0,0,0,0.4),0_-4px_12px_0px_rgba(255,215,0,0.15)]
              transition-all duration-300 ease-out hover:translate-y-[-4px]"
            >
              <Image
                src="/sf-sheriff-deputies.png"
                alt="San Francisco Deputy Sheriffs"
                fill
                className="object-cover"
                priority
                quality={90}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A3C1F] via-[#0A3C1F]/20 to-transparent">
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <p className="text-white text-lg font-medium drop-shadow-lg">
                    Join our diverse team of law enforcement professionals
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mt-12">
          <p className="text-white/90 mb-2">Already interested? Take the first step today</p>
          <Link href="#sign-up" className="text-[#FFD700] hover:text-[#FFD700]/80 flex items-center justify-center">
            Sign up for updates <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
