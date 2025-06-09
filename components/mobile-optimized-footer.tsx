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
      <footer className="bg-primary text-primary-foreground">
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
      <footer className="md:hidden bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 py-2">
          {/* Header row */}
          <div className="flex items-center justify-between mb-2">
            <button
              onClick={() => handleNavigation("/")}
              className="flex items-center"
              aria-label="Go to homepage"
            >
              <ShieldLogo className="w-4 h-4 text-secondary mr-1" />
              <span className="font-bold text-xs text-white dark:text-yellow-400">SF Deputy Sheriff</span>
            </button>
            <Button
              onClick={() => handleNavigation("/donate")}
              size="sm"
              className="py-1 px-2 text-xs bg-secondary text-secondary-foreground hover:bg-secondary/90"
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
                className="text-left text-white/90 dark:text-yellow-200/80 hover:text-secondary transition-colors"
              >
                {label}
              </button>
            ))}
          </div>

          {/* Bottom row - Contact & Social */}
          <div className="border-t border-white/20 dark:border-yellow-400/20 pt-2">
            <div className="flex justify-between items-center text-xs">
              <div className="text-white/90 dark:text-yellow-200/80">
                <a href="tel:+14156962428" className="hover:text-secondary">
                  (415) 696-2428
                </a>
                <span className="mx-1">•</span>
                <a href="mailto:info@sfdeputysheriff.com" className="hover:text-secondary">
                  Email
                </a>
              </div>
              <div className="flex space-x-2">
                {[
                  { href: "https://www.facebook.com/SanFranciscoDeputySheriffsAssociation", icon: Facebook },
                  { href: "https://twitter.com/sanfranciscodsa", icon: Twitter },
                  { href: "https://www.instagram.com/sfdeputysheriffsassociation/", icon: Instagram }
                ].map(({ href, icon: Icon }) => (
                  <a
                    key={href}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white/90 dark:text-yellow-200/80 hover:text-secondary"
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