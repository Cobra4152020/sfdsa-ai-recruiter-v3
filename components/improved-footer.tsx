"use client"

import Link from "next/link"
import Image from "next/image"
import { Facebook, Twitter, Youtube, Instagram, Linkedin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ShieldLogo } from "@/components/shield-logo"

export function ImprovedFooter() {
  return (
    <footer className="bg-[#0A3C1F] text-white">
      <div className="container mx-auto px-4 py-12">
        {/* Brand Section */}
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center space-x-8">
            <Link href="/" className="flex items-center">
              <div className="mr-2 text-[#FFD700]">
                <ShieldLogo className="w-8 h-8" />
              </div>
              <div>
                <div className="font-bold">SF Deputy Sheriff</div>
                <div className="text-[#FFD700] text-sm">AI Recruitment</div>
              </div>
            </Link>
            <p className="text-sm text-white/80 max-w-md">
              Serving the City and County of San Francisco with honor, integrity, and commitment to public safety.
            </p>
          </div>
          <div className="flex space-x-4">
            <Link href="https://facebook.com" className="text-white hover:text-[#FFD700] transition-colors">
              <Facebook size={20} />
            </Link>
            <Link href="https://twitter.com" className="text-white hover:text-[#FFD700] transition-colors">
              <Twitter size={20} />
            </Link>
            <Link href="https://youtube.com" className="text-white hover:text-[#FFD700] transition-colors">
              <Youtube size={20} />
            </Link>
            <Link href="https://instagram.com" className="text-white hover:text-[#FFD700] transition-colors">
              <Instagram size={20} />
            </Link>
            <Link href="https://linkedin.com" className="text-white hover:text-[#FFD700] transition-colors">
              <Linkedin size={20} />
            </Link>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="grid grid-cols-12 gap-8">
          {/* Quick Links Column */}
          <div className="col-span-3">
            <h3 className="font-semibold text-lg mb-4 text-[#FFD700]">Quick Links</h3>
            <div className="grid grid-cols-1 gap-2">
              <Link href="/" className="text-white/80 hover:text-[#FFD700] transition-colors">
                Home
              </Link>
              <Link href="/awards" className="text-white/80 hover:text-[#FFD700] transition-colors">
                Top Recruit Awards
              </Link>
              <Link href="/badges" className="text-white/80 hover:text-[#FFD700] transition-colors">
                Badge Gallery
              </Link>
              <Link href="/gi-bill" className="text-white/80 hover:text-[#FFD700] transition-colors">
                G.I. Bill
              </Link>
              <Link href="/housing" className="text-white/80 hover:text-[#FFD700] transition-colors">
                Discounted Housing
              </Link>
            </div>
          </div>

          {/* Resources Column */}
          <div className="col-span-3">
            <h3 className="font-semibold text-lg mb-4 text-[#FFD700]">Resources</h3>
            <div className="grid grid-cols-1 gap-2">
              <Link href="/trivia" className="text-white/80 hover:text-[#FFD700] transition-colors">
                SF Trivia
              </Link>
              <Link href="/donors" className="text-white/80 hover:text-[#FFD700] transition-colors">
                Donor Recognition
              </Link>
              <Link href="/volunteer" className="text-white/80 hover:text-[#FFD700] transition-colors">
                Volunteer Recruiter
              </Link>
              <Link href="/faq" className="text-white/80 hover:text-[#FFD700] transition-colors">
                FAQ
              </Link>
              <Link href="/contact" className="text-white/80 hover:text-[#FFD700] transition-colors">
                Contact Support
              </Link>
            </div>
          </div>

          {/* Contact Column */}
          <div className="col-span-6">
            <h3 className="font-semibold text-lg mb-4 text-[#FFD700]">Contact Us</h3>
            <div className="grid grid-cols-2 gap-8">
              <div>
                <Image
                  src="/sfdsa-logo.png"
                  alt="San Francisco Deputy Sheriffs' Association"
                  width={120}
                  height={120}
                  className="mb-2"
                />
                <p className="text-sm text-white/80">San Francisco Deputy Sheriffs' Association 501(c)5</p>
                <address className="text-sm text-white/80 not-italic mt-4">
                  <p>35 Gilbert Street</p>
                  <p>San Francisco, CA 94103</p>
                  <p className="mt-2">Phone: (415) 696-2428</p>
                </address>
              </div>
              <div>
                <Image
                  src="/protecting-sf-logo.png"
                  alt="Protecting San Francisco"
                  width={120}
                  height={120}
                  className="mb-2"
                />
                <p className="text-sm text-white/80">Protecting San Francisco 501(c)3</p>
                <p className="text-sm text-white/80 mt-4">
                  Email: email@protectingsanfrancisco.com
                </p>
                <Link href="https://www.sfdsa.org/donate" className="block mt-4">
                  <Button className="w-full bg-[#FFD700] text-[#0A3C1F] hover:bg-[#FFD700]/90">
                    Support Our Mission
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
