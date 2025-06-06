"use client";

import { useState, useEffect } from "react";
import { Facebook, Twitter, Instagram } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ShieldLogo } from "@/components/shield-logo";
import { ImprovedFooter } from "@/components/improved-footer";
import { useRouter } from "next/navigation";

export function MobileOptimizedFooter() {
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
      <footer className="bg-[#0A3C1F] text-white">
        <div className="container mx-auto px-4 py-2">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-700 rounded"></div>
          </div>
        </div>
      </footer>
    );
  }

  return (
    <>
      {/* Mobile Footer - Ultra Compact */}
      <footer className="md:hidden bg-[#0A3C1F] text-white">
        <div className="container mx-auto px-4 py-2">
          {/* Header row */}
          <div className="flex items-center justify-between mb-2">
            <button
              onClick={() => handleNavigation("/")}
              className="flex items-center"
              aria-label="Go to homepage"
            >
              <ShieldLogo className="w-4 h-4 text-[#FFD700] mr-1" />
              <span className="font-bold text-xs">SF Deputy Sheriff</span>
            </button>
            <Button
              onClick={() => handleNavigation("/donate")}
              size="sm"
              className="py-1 px-2 text-xs bg-[#FFD700] text-[#0A3C1F] hover:bg-[#FFD700]/90"
            >
              Donate
            </Button>
          </div>

          {/* Links grid - 3 columns */}
          <div className="grid grid-cols-3 gap-x-4 gap-y-1 mb-2 text-xs">
            {[
              { href: "/", label: "Home" },
              { href: "/awards", label: "Awards" },
              { href: "/volunteer-register", label: "Volunteer" },
              { href: "/trivia", label: "Trivia" },
              { href: "/contact", label: "Contact" },
              { href: "/gi-bill", label: "G.I. Bill" }
            ].map(({ href, label }) => (
              <button
                key={href}
                onClick={() => handleNavigation(href)}
                className="text-left text-white/80 hover:text-[#FFD700] transition-colors"
              >
                {label}
              </button>
            ))}
          </div>

          {/* Bottom row - Contact & Social */}
          <div className="border-t border-white/20 pt-2">
            <div className="flex justify-between items-center text-xs">
              <div className="text-white/70">
                <a href="tel:+14156962428" className="hover:text-[#FFD700]">
                  (415) 696-2428
                </a>
                <span className="mx-1">•</span>
                <a href="mailto:info@sfdeputysheriff.com" className="hover:text-[#FFD700]">
                  Email
                </a>
              </div>
              <div className="flex space-x-2">
                {[
                  { href: "https://www.facebook.com/SFDeputySheriff", icon: Facebook },
                  { href: "https://twitter.com/SFDeputySheriff", icon: Twitter },
                  { href: "https://www.instagram.com/sfdeputysheriff", icon: Instagram }
                ].map(({ href, icon: Icon }) => (
                  <a
                    key={href}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white/70 hover:text-[#FFD700]"
                  >
                    <Icon size={12} />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Desktop Footer - Use the full improved footer */}
      <div className="hidden md:block">
        <ImprovedFooter />
      </div>
    </>
  );
} 