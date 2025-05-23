"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Facebook, Twitter, Youtube, Instagram, Linkedin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ShieldLogo } from "@/components/shield-logo"
import { useRouter } from "next/navigation"

export function ImprovedFooter() {
  const [mounted, setMounted] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleNavigation = (href: string) => {
    router.push(href)
  }

  // Return a placeholder during server-side rendering
  if (!mounted) {
    return (
      <footer className="bg-[#0A3C1F] text-white">
        <div className="container mx-auto px-4 py-12">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 space-y-6 md:space-y-0">
            <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-8">
              <div className="w-32 h-8 bg-gray-700 animate-pulse rounded" />
              <div className="w-64 h-4 bg-gray-700 animate-pulse rounded" />
            </div>
            <div className="flex space-x-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="w-6 h-6 bg-gray-700 animate-pulse rounded-full" />
              ))}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="md:col-span-3">
                <div className="w-24 h-6 bg-gray-700 animate-pulse rounded mb-4" />
                <div className="space-y-2">
                  {[1, 2, 3, 4].map((j) => (
                    <div key={j} className="w-32 h-4 bg-gray-700 animate-pulse rounded" />
                  ))}
                </div>
              </div>
            ))}
            <div className="md:col-span-6">
              <div className="w-24 h-6 bg-gray-700 animate-pulse rounded mb-4" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <div className="w-32 h-32 bg-gray-700 animate-pulse rounded mb-2" />
                  <div className="w-48 h-4 bg-gray-700 animate-pulse rounded mb-2" />
                  <div className="space-y-2">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="w-32 h-4 bg-gray-700 animate-pulse rounded" />
                    ))}
                  </div>
                </div>
                <div>
                  <div className="w-32 h-32 bg-gray-700 animate-pulse rounded mb-2" />
                  <div className="w-48 h-4 bg-gray-700 animate-pulse rounded mb-2" />
                  <div className="w-32 h-4 bg-gray-700 animate-pulse rounded mb-4" />
                  <div className="w-full h-10 bg-gray-700 animate-pulse rounded" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    )
  }

  return (
    <footer className="bg-[#0A3C1F] text-white" role="contentinfo" aria-label="Site footer">
      <div className="container mx-auto px-4 py-12">
        {/* Brand Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 space-y-6 md:space-y-0">
          <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-8">
            <button 
              onClick={() => handleNavigation('/')}
              className="flex items-center group transition-transform duration-200 hover:scale-105"
              aria-label="Go to homepage"
            >
              <div className="mr-2 text-[#FFD700]">
                <ShieldLogo className="w-8 h-8" />
              </div>
              <div>
                <div className="font-bold">SF Deputy Sheriff</div>
                <div className="text-[#FFD700] text-sm">AI Recruitment</div>
              </div>
            </button>
            <p className="text-sm text-white/80 max-w-md">
              Serving the City and County of San Francisco with honor, integrity, and commitment to public safety.
            </p>
          </div>
          <div className="flex space-x-4 justify-center md:justify-end">
            {[
              { href: "https://www.facebook.com/SFDeputySheriff", icon: Facebook, label: "Facebook" },
              { href: "https://twitter.com/SFDeputySheriff", icon: Twitter, label: "Twitter" },
              { href: "https://www.youtube.com/@SFDeputySheriff", icon: Youtube, label: "YouTube" },
              { href: "https://www.instagram.com/sfdeputysheriff", icon: Instagram, label: "Instagram" },
              { href: "https://www.linkedin.com/company/san-francisco-deputy-sheriffs-association", icon: Linkedin, label: "LinkedIn" }
            ].map(({ href, icon: Icon, label }) => (
              <a
                key={href}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-[#FFD700] transition-all duration-200 hover:scale-110"
                aria-label={`Visit our ${label} page`}
              >
                <Icon size={20} />
              </a>
            ))}
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Quick Links Column */}
          <div className="md:col-span-3">
            <h3 className="font-semibold text-lg mb-4 text-[#FFD700]">Quick Links</h3>
            <div className="grid grid-cols-2 md:grid-cols-1 gap-2">
              {[
                { href: "/", label: "Home" },
                { href: "/awards", label: "Top Recruit Awards" },
                { href: "/badges", label: "Badge Gallery" },
                { href: "/gi-bill", label: "G.I. Bill" },
                { href: "/discounted-housing", label: "Discounted Housing" }
              ].map(({ href, label }) => (
                <button
                  key={href}
                  onClick={() => handleNavigation(href)}
                  className="text-left text-white/80 hover:text-[#FFD700] transition-all duration-200 hover:translate-x-1 focus:outline-none focus:text-[#FFD700]"
                  aria-label={`Navigate to ${label}`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Resources Column */}
          <div className="md:col-span-3">
            <h3 className="font-semibold text-lg mb-4 text-[#FFD700]">Resources</h3>
            <div className="grid grid-cols-2 md:grid-cols-1 gap-2">
              {[
                { href: "/trivia", label: "SF Trivia" },
                { href: "/donor-recognition", label: "Donor Recognition" },
                { href: "/volunteer-recruiter", label: "Volunteer Recruiter" },
                { href: "/contact", label: "Contact Support" }
              ].map(({ href, label }) => (
                <button
                  key={href}
                  onClick={() => handleNavigation(href)}
                  className="text-left text-white/80 hover:text-[#FFD700] transition-all duration-200 hover:translate-x-1 focus:outline-none focus:text-[#FFD700]"
                  aria-label={`Navigate to ${label}`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Contact Column */}
          <div className="md:col-span-6">
            <h3 className="font-semibold text-lg mb-4 text-[#FFD700]">Contact Us</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <div className="relative w-[120px] h-[120px] mb-2">
                  <Image
                    src="/sfdsa-logo.png"
                    alt="San Francisco Deputy Sheriffs' Association"
                    fill
                    className="object-contain"
                    sizes="(max-width: 768px) 100vw, 240px"
                  />
                </div>
                <p className="text-sm text-white/80">San Francisco Deputy Sheriffs' Association 501(c)5</p>
                <address className="text-sm text-white/80 not-italic mt-4">
                  <p>680 8th Street, Suite 200</p>
                  <p>San Francisco, CA 94103</p>
                  <p className="mt-2">
                    <a href="tel:+14156962428" className="hover:text-[#FFD700] transition-colors">
                      Phone: (415) 696-2428
                    </a>
                  </p>
                </address>
              </div>
              <div>
                <div className="relative w-[120px] h-[120px] mb-2">
                  <Image
                    src="/protecting-sf-logo.png"
                    alt="Protecting San Francisco"
                    fill
                    className="object-contain"
                    sizes="(max-width: 768px) 100vw, 240px"
                  />
                </div>
                <p className="text-sm text-white/80">Protecting San Francisco 501(c)3</p>
                <p className="text-sm text-white/80 mt-4">
                  <a 
                    href="mailto:info@sfdeputysheriff.com"
                    className="hover:text-[#FFD700] transition-colors"
                  >
                    Email: info@sfdeputysheriff.com
                  </a>
                </p>
                <Button 
                  onClick={() => handleNavigation('/donate')}
                  className="block mt-4 w-full transform transition-transform duration-200 hover:scale-105 bg-[#FFD700] text-[#0A3C1F] hover:bg-[#FFD700]/90 font-semibold"
                  aria-label="Support our mission - Make a donation"
                >
                  Support Our Mission
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
