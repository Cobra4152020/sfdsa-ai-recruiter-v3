/* Test comment to check tool status */
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Facebook, Twitter, Youtube, Instagram, Linkedin } from "lucide-react";
import { ShieldLogo } from "@/components/shield-logo";
import { useRouter } from "next/navigation";

export function ImprovedFooter() {
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleNavigation = (href: string) => {
    router.push(href);
  };

  if (!mounted) {
    return <footer className="bg-card text-card-foreground h-[300px]" />;
  }

  return (
    <footer
      className="bg-primary text-primary-foreground"
      role="contentinfo"
      aria-label="Site footer"
    >
      <div className="container mx-auto px-4">
        <div className="py-8 md:py-12">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 md:mb-12 space-y-4 md:space-y-0">
            <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-8">
              <button
                onClick={() => handleNavigation("/")}
                className="flex items-center group transition-transform duration-200 hover:scale-105"
                aria-label="Go to homepage"
              >
                <div className="mr-2 text-secondary">
                  <ShieldLogo className="w-6 h-6 md:w-8 md:h-8" />
                </div>
                <div>
                  <div className="font-bold text-sm md:text-base text-white dark:text-yellow-400">SF Deputy Sheriff</div>
                  <div className="text-secondary text-xs md:text-sm">AI Recruitment</div>
                </div>
              </button>
              <p className="text-xs md:text-sm text-white/90 dark:text-yellow-200/80 max-w-md hidden md:block">
                Serving the City and County of San Francisco with honor, integrity, and commitment to public safety.
              </p>
            </div>
            <div className="flex space-x-4">
              {[
                { href: "https://www.facebook.com/SanFranciscoDeputySheriffsAssociation", icon: Facebook, label: "Facebook" },
                { href: "https://twitter.com/sanfranciscodsa", icon: Twitter, label: "Twitter" },
                { href: "https://www.youtube.com/channel/UCgyW7q86c-Mua4bS1a9wBWA", icon: Youtube, label: "YouTube" },
                { href: "https://www.instagram.com/sfdeputysheriffsassociation/", icon: Instagram, label: "Instagram" },
                { href: "https://www.linkedin.com/company/san-francisco-deputy-sheriffs%E2%80%99-association", icon: Linkedin, label: "LinkedIn" },
              ].map(({ href, icon: Icon, label }) => (
                <a
                  key={href}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white dark:text-yellow-400 hover:text-secondary transition-all duration-200 hover:scale-110"
                  aria-label={`Visit our ${label} page`}
                >
                  <Icon size={20} />
                </a>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-12 gap-6">
            <div className="md:col-span-3">
              <h3 className="font-semibold text-lg mb-4 text-secondary">Quick Links</h3>
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
                    className="text-left text-white/90 dark:text-yellow-200/80 hover:text-secondary transition-all duration-200 hover:translate-x-1 focus:outline-none focus:text-secondary"
                    aria-label={`Navigate to ${label}`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div className="md:col-span-3">
              <h3 className="font-semibold text-lg mb-4 text-secondary">Resources</h3>
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
                    className="text-left text-white/90 dark:text-yellow-200/80 hover:text-secondary transition-all duration-200 hover:translate-x-1 focus:outline-none focus:text-secondary"
                    aria-label={`Navigate to ${label}`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div className="md:col-span-6">
              <h3 className="font-semibold text-lg mb-4 text-secondary">Contact Us</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <div className="relative w-[120px] h-[120px] mb-2 bg-transparent rounded p-1">
                    <Image src="/sfdsa-logo.png" alt="San Francisco Deputy Sheriffs' Association" fill className="object-contain" sizes="(max-width: 768px) 100vw, 240px" />
                  </div>
                  <p className="text-sm text-white/90 dark:text-yellow-200/80">San Francisco Deputy Sheriffs&apos; Association 501(c)5</p>
                  <address className="text-sm text-white/90 dark:text-yellow-200/80 not-italic mt-4">
                    <p>PO Box 428</p>
                    <p>San Francisco, CA 94104</p>
                    <p className="mt-2">
                      <a href="tel:+14156962428" className="hover:text-secondary transition-colors">Phone: (415) 696-2428</a>
                    </p>
                  </address>
                </div>
                <div>
                  <div className="relative w-[120px] h-[120px] mb-2 bg-transparent rounded p-1">
                    <Image src="/protecting-sf-logo.png" alt="Protecting San Francisco" fill className="object-contain" sizes="(max-width: 768px) 100vw, 240px" />
                  </div>
                  <p className="text-sm text-white/90 dark:text-yellow-200/80">Protecting San Francisco 501(c)3</p>
                  <p className="text-sm text-white/90 dark:text-yellow-200/80 mt-4">For inquiries, please contact us at:</p>
                  <a href="mailto:info@sfdeputysheriff.com" className="text-white dark:text-yellow-400 hover:text-secondary font-semibold transition-colors">info@sfdeputysheriff.com</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}