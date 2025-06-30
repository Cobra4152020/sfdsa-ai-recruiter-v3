"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Facebook, Twitter, Youtube, Instagram, Linkedin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ShieldLogo } from "@/components/shield-logo";
import { useRouter } from "next/navigation";

export function MobileFooter() {
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleNavigation = (href: string) => {
    router.push(href);
  };

  if (!mounted) {
    return (
      <footer className="bg-primary text-white">
        <div className="container mx-auto px-4 py-3 md:py-12">
          <div className="animate-pulse">
            <div className="h-12 bg-gray-700 rounded mb-3"></div>
            <div className="grid grid-cols-2 gap-2">
              <div className="h-4 bg-gray-700 rounded"></div>
              <div className="h-4 bg-gray-700 rounded"></div>
            </div>
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer
      className="bg-primary text-white"
      role="contentinfo"
      aria-label="Site footer"
    >
      <div className="container mx-auto px-4 py-3 md:py-12">
        {/* Mobile: Ultra-compact brand section */}
        <div className="block md:hidden">
          <div className="flex items-center justify-between mb-3">
            <button
              onClick={() => handleNavigation("/")}
              className="flex items-center"
              aria-label="Go to homepage"
            >
              <div className="mr-2 text-[#FFD700]">
                <ShieldLogo className="w-5 h-5" />
              </div>
              <div>
                <div className="font-bold text-sm">SF Deputy Sheriff</div>
                <div className="text-[#FFD700] text-xs">AI Recruitment</div>
              </div>
            </button>
            <Button
              onClick={() => handleNavigation("/donate")}
              className="py-1 px-3 text-xs bg-[#FFD700] text-primary hover:bg-[#FFD700]/90 font-semibold"
              aria-label="Support our mission"
            >
              Donate
            </Button>
          </div>

          {/* Mobile: Essential links only */}
          <div className="grid grid-cols-2 gap-2 mb-3">
            <div className="space-y-1">
              <h4 className="font-semibold text-xs text-[#FFD700] mb-1">Quick Links</h4>
              {[
                { href: "/", label: "Home" },
                { href: "/awards", label: "Awards" },
                { href: "/volunteer-register", label: "Volunteer" },
              ].map(({ href, label }) => (
                <button
                  key={href}
                  onClick={() => handleNavigation(href)}
                  className="block text-left text-xs text-white/80 hover:text-[#FFD700]"
                >
                  {label}
                </button>
              ))}
            </div>
            <div className="space-y-1">
              <h4 className="font-semibold text-xs text-[#FFD700] mb-1">Resources</h4>
              {[
                { href: "/trivia", label: "SF Trivia" },
                { href: "/contact", label: "Contact" },
                { href: "/gi-bill", label: "G.I. Bill" },
              ].map(({ href, label }) => (
                <button
                  key={href}
                  onClick={() => handleNavigation(href)}
                  className="block text-left text-xs text-white/80 hover:text-[#FFD700]"
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Mobile: Contact info - minimal */}
          <div className="text-center py-2 border-t border-white/20">
            <div className="text-xs text-white/80 mb-2">
              <p>San Francisco Deputy Sheriffs' Association</p>
              <p>680 8th Street, Suite 200, San Francisco, CA 94103</p>
            </div>
            <div className="flex justify-center space-x-3 mb-2">
              {[
                { href: "tel:+14156962428", text: "(415) 696-2428" },
                { href: "mailto:info@sfdeputysheriff.com", text: "Email Us" },
              ].map(({ href, text }) => (
                <a
                  key={href}
                  href={href}
                  className="text-xs text-[#FFD700] hover:text-white"
                >
                  {text}
                </a>
              ))}
            </div>
            {/* Mobile: Social icons - smaller */}
            <div className="flex justify-center space-x-3">
              {[
                { href: "https://www.facebook.com/SFDeputySheriff", icon: Facebook },
                { href: "https://twitter.com/SFDeputySheriff", icon: Twitter },
                { href: "https://www.instagram.com/sfdeputysheriff", icon: Instagram },
              ].map(({ href, icon: Icon }) => (
                <a
                  key={href}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white hover:text-[#FFD700]"
                >
                  <Icon size={14} />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Desktop: Full layout (same as original) */}
        <div className="hidden md:block">
          {/* Brand Section */}
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 space-y-6 md:space-y-0">
            <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-8">
              <button
                onClick={() => handleNavigation("/")}
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
                Serving the City and County of San Francisco with honor,
                integrity, and commitment to public safety.
              </p>
            </div>
            <div className="flex space-x-4 justify-center md:justify-end">
              {[
                { href: "https://www.facebook.com/SFDeputySheriff", icon: Facebook, label: "Facebook" },
                { href: "https://twitter.com/SFDeputySheriff", icon: Twitter, label: "Twitter" },
                { href: "https://www.youtube.com/@SFDeputySheriff", icon: Youtube, label: "YouTube" },
                { href: "https://www.instagram.com/sfdeputysheriff", icon: Instagram, label: "Instagram" },
                { href: "https://www.linkedin.com/company/san-francisco-deputy-sheriffs-association", icon: Linkedin, label: "LinkedIn" },
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

          {/* Desktop: Full grid layout */}
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
                  { href: "/discounted-housing", label: "Discounted Housing" },
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
                  { href: "/volunteer-register", label: "Volunteer Application" },
                  { href: "/contact", label: "Contact Support" },
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
                  <p className="text-sm text-white/80">
                    San Francisco Deputy Sheriffs&apos; Association 501(c)5
                  </p>
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
                    <a href="mailto:info@sfdeputysheriff.com" className="hover:text-[#FFD700] transition-colors">
                      Email: info@sfdeputysheriff.com
                    </a>
                  </p>
                  <Button
                    onClick={() => handleNavigation("/donate")}
                    className="block mt-4 w-full transform transition-transform duration-200 hover:scale-105 bg-[#FFD700] text-primary hover:bg-[#FFD700]/90 font-semibold"
                    aria-label="Support our mission - Make a donation"
                  >
                    Support Our Mission
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
} 