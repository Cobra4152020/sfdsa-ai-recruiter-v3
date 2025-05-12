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
    <section className="bg-gradient-to-b from-[#0A3C1F]/95 to-[#0A3C1F]/90 text-white pt-16 pb-20 relative">
      {/* Background pattern - subtle grid */}
      <div
        className="absolute inset-0 z-0 opacity-10"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23ffffff' fillOpacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
          backgroundSize: "30px 30px",
        }}
        aria-hidden="true"
      ></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
            Join the <span className="text-[#FFD700]">San Francisco</span> Sheriff's Office
          </h1>
          <p className="text-xl md:text-2xl text-white/80 max-w-3xl mx-auto">
            Embark on a rewarding career in law enforcement. Protect our community with honor and integrity.
          </p>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-center gap-6 mb-12">
          <div className="w-full md:w-1/2 lg:w-5/12 order-2 md:order-1">
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/20 shadow-xl">
              <h2 className="text-2xl font-bold mb-4 flex items-center">
                <span className="text-[#FFD700] mr-2" aria-hidden="true">
                  ✓
                </span>{" "}
                Starting Salary: $116,428
              </h2>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="text-[#FFD700] mr-2" aria-hidden="true">
                    ✓
                  </span>
                  <span>Full medical, dental, and vision benefits</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#FFD700] mr-2" aria-hidden="true">
                    ✓
                  </span>
                  <span>Paid academy training (23 weeks)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#FFD700] mr-2" aria-hidden="true">
                    ✓
                  </span>
                  <span>Career advancement opportunities</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#FFD700] mr-2" aria-hidden="true">
                    ✓
                  </span>
                  <span>Retirement plan with pension</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#FFD700] mr-2" aria-hidden="true">
                    ✓
                  </span>
                  <span>Tuition reimbursement program</span>
                </li>
              </ul>
              <div className="mt-6 space-y-3">
                <Button
                  onClick={() => showOptInForm(true)}
                  className="w-full bg-[#FFD700] hover:bg-[#FFD700]/90 text-[#0A3C1F] font-bold"
                >
                  Apply Now
                </Button>
                <AskSgtKenButton
                  variant="outline"
                  fullWidth={true}
                  className="border-white/30 hover:bg-white/10 text-white"
                />
              </div>
            </div>
          </div>

          <div className="w-full md:w-1/2 lg:w-5/12 order-1 md:order-2">
            <div className="relative rounded-xl overflow-hidden shadow-2xl aspect-video">
              <Image
                src="/sf-sheriff-deputies.png"
                alt="San Francisco Deputy Sheriffs in uniform standing together"
                width={800}
                height={450}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 800px"
                className="object-cover"
                priority
                quality={85}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A3C1F]/80 to-transparent flex items-end">
                <div className="p-4">
                  <p className="text-white text-lg font-medium">
                    Join our diverse team of law enforcement professionals
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center">
          <p className="text-white/90 mb-2">Already interested? Take the first step today</p>
          <Button
            onClick={() => showOptInForm(false)}
            variant="link"
            className="text-[#FFD700] hover:text-[#FFD700]/80"
          >
            Sign up for updates <ArrowRight className="ml-1 h-4 w-4" aria-hidden="true" />
          </Button>
        </div>
      </div>
    </section>
  )
}
