"use client";

import { useState, useEffect, useCallback } from "react";
import type { ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  ChevronDown,
  Facebook,
  Twitter,
  Youtube,
  Instagram,
  Linkedin,
  Shield,
  BookOpen,
  Trophy,
  Gamepad2,
  MessageSquare,
  HelpCircle,
  Menu,
  X,
} from "lucide-react";
import { useAuthModal } from "@/context/auth-modal-context";
import { useUser } from "@/context/user-context";
import { ShieldLogo } from "@/components/shield-logo";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-provider";
import { UserNav } from "@/components/user-nav";
import { cn } from "@/lib/utils";
import { useClientOnly } from "@/hooks/use-client-only";
import { getWindowDimensions } from "@/lib/utils";
import Link from "next/link";

interface ImprovedHeaderProps {
  showOptInForm?: (isApplying?: boolean) => void;
}

interface NavItem {
  label: string;
  href: string;
  icon?: ReactNode;
}

interface NavSection {
  label: string;
  icon?: ReactNode;
  items: NavItem[];
}

export function ImprovedHeader({ showOptInForm }: ImprovedHeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const { currentUser } = useUser();
  const { openModal } = useAuthModal();
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  const memoizedGetWindowDimensions = useCallback(
    () => getWindowDimensions(),
    [],
  );
  const { scrollY } = useClientOnly(memoizedGetWindowDimensions, {
    scrollY: 0,
    width: 0,
    height: 0,
    innerWidth: 0,
    innerHeight: 0,
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setScrolled(scrollY > 10);
  }, [scrollY]);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setActiveDropdown(null);
  }, [pathname]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleDropdown = (label: string) => {
    setActiveDropdown(activeDropdown === label ? null : label);
  };

  const handleNavigation = (href: string) => {
    router.push(href);
    setIsMobileMenuOpen(false);
    setActiveDropdown(null);
  };

  const handleDropdownClick = (href: string) => {
    handleNavigation(href);
  };

  const handleLogin = () => {
    try {
      if (typeof openModal === "function") {
        openModal("signin", "recruit");
      } else if (showOptInForm) {
        showOptInForm(false);
      } else {
        console.error("Authentication modal is not available");
        // You could show a toast here if you have access to it
      }
    } catch (error) {
      console.error("Error opening login modal:", error);
      // Handle gracefully - could redirect to a login page instead
    }
  };

  const handleApplyNow = () => {
    try {
      if (typeof openModal === "function") {
        openModal("optin", "recruit");
      } else if (showOptInForm) {
        showOptInForm(true);
      } else {
        console.error("Authentication modal is not available");
        // You could show a toast here if you have access to it
      }
    } catch (error) {
      console.error("Error opening application modal:", error);
      // Handle gracefully - could redirect to an application page instead
    }
  };

  const mainNavItems: Record<string, NavSection> = {
    mission: {
      label: "Mission Briefing",
      icon: <BookOpen className="w-4 h-4" />,
      items: [
        {
          label: "Overview",
          href: "/mission-briefing",
          icon: <Shield className="w-4 h-4" />,
        },
        {
          label: "Daily Briefing",
          href: "/daily-briefing",
          icon: <BookOpen className="w-4 h-4" />,
        },
        {
          label: "Requirements",
          href: "/requirements",
          icon: <Shield className="w-4 h-4" />,
        },
        {
          label: "Application Process",
          href: "/application-process",
          icon: <Shield className="w-4 h-4" />,
        },
      ],
    },
    gamification: {
      label: "Achievements",
      icon: <Trophy className="w-4 h-4" />,
      items: [
        {
          label: "Awards",
          href: "/awards",
          icon: <Trophy className="w-4 h-4" />,
        },
        {
          label: "Badges Gallery",
          href: "/badges",
          icon: <Shield className="w-4 h-4" />,
        },
        {
          label: "NFT Awards",
          href: "/nft-awards",
          icon: <Trophy className="w-4 h-4" />,
        },
        {
          label: "Leaderboard",
          href: "/leaderboard",
          icon: <Trophy className="w-4 h-4" />,
        },
      ],
    },
    games: {
      label: "Challenges",
      icon: <Gamepad2 className="w-4 h-4" />,
      items: [
        {
          label: "Sgt. Ken Says...",
          href: "/sgt-ken-says",
          icon: <Gamepad2 className="w-4 h-4" />,
        },
        {
          label: "Could You Make the Cut?",
          href: "/could-you-make-the-cut",
          icon: <Gamepad2 className="w-4 h-4" />,
        },
        {
          label: "Daily Trivia",
          href: "/trivia",
          icon: <Gamepad2 className="w-4 h-4" />,
        },
        {
          label: "TikTok Challenges",
          href: "/tiktok-challenges",
          icon: <Gamepad2 className="w-4 h-4" />,
        },
        {
          label: "Special Missions",
          href: "/play-the-game",
          icon: <Gamepad2 className="w-4 h-4" />,
        },
      ],
    },
    support: {
      label: "Support",
      icon: <HelpCircle className="w-4 h-4" />,
      items: [
        {
          label: "Chat with Sgt. Ken",
          href: "/chat-with-sgt-ken",
          icon: <MessageSquare className="w-4 h-4" />,
        },
        {
          label: "Contact Support",
          href: "/contact",
          icon: <HelpCircle className="w-4 h-4" />,
        },
        {
          label: "Accessibility",
          href: "/accessibility",
          icon: <HelpCircle className="w-4 h-4" />,
        },
      ],
    },
  };

  // Return a placeholder during server-side rendering
  if (!mounted) {
    return (
      <header className="fixed w-full z-50 bg-white/95 dark:bg-[#121212]/95 shadow-md backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="w-32 h-8 bg-gray-200 dark:bg-gray-700 animate-pulse rounded" />
            <div className="hidden md:flex space-x-4">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="w-24 h-6 bg-gray-200 dark:bg-gray-700 animate-pulse rounded"
                />
              ))}
            </div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header
      className={cn(
        "fixed w-full z-50 transition-all duration-200",
        scrolled
          ? "bg-white/95 dark:bg-[#121212]/95 shadow-md backdrop-blur-sm"
          : "bg-transparent",
      )}
    >
      {/* Top bar */}
      <div className="bg-[#0A3C1F] dark:bg-black text-white dark:text-[#FFD700] py-2">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <span className="text-sm">
              🌟 Start Your Hero Journey - Become a San Francisco Deputy Sheriff Today! 🌟
            </span>
          </div>
          <div className="flex items-center space-x-3">
            <a
              href="https://www.facebook.com/SFDeputySheriff"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="text-white hover:text-[#FFD700] dark:text-[#FFD700] dark:hover:text-white transition-colors duration-200"
            >
              <Facebook size={16} />
            </a>
            <a
              href="https://twitter.com/SFDeputySheriff"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Twitter"
              className="text-white hover:text-[#FFD700] dark:text-[#FFD700] dark:hover:text-white transition-colors duration-200"
            >
              <Twitter size={16} />
            </a>
            <a
              href="https://www.youtube.com/@SFDeputySheriff"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="YouTube"
              className="text-white hover:text-[#FFD700] dark:text-[#FFD700] dark:hover:text-white transition-colors duration-200"
            >
              <Youtube size={16} />
            </a>
            <a
              href="https://www.instagram.com/sfdeputysheriff"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="text-white hover:text-[#FFD700] dark:text-[#FFD700] dark:hover:text-white transition-colors duration-200"
            >
              <Instagram size={16} />
            </a>
            <a
              href="https://www.linkedin.com/company/san-francisco-deputy-sheriffs-association"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="text-white hover:text-[#FFD700] dark:text-[#FFD700] dark:hover:text-white transition-colors duration-200"
            >
              <Linkedin size={16} />
            </a>
            <ThemeToggle />
          </div>
        </div>
      </div>

      {/* Main navigation */}
      <div
        className={cn(
          "py-4 transition-colors duration-200",
          scrolled
            ? "bg-white dark:bg-[#121212]"
            : "bg-white/0 dark:bg-transparent",
        )}
      >
        <div className="container mx-auto px-4">
          <nav className="flex justify-between items-center">
            <Link
              href="/"
              className="flex items-center space-x-2 group transition-transform duration-200 hover:scale-105"
            >
              <ShieldLogo className="w-8 h-8" />
              <span className="text-xl font-bold text-[#0A3C1F] dark:text-[#FFD700]">
                SFDSA
              </span>
            </Link>

            {/* Desktop navigation */}
            <div className="hidden md:flex items-center space-x-6">
              {Object.entries(mainNavItems).map(([key, section]) => (
                <div key={key} className="relative group">
                  <button
                    className="flex items-center space-x-1 text-gray-600 dark:text-gray-300 hover:text-[#0A3C1F] dark:hover:text-[#FFD700] transition-colors duration-200 group"
                    onClick={() => toggleDropdown(section.label)}
                    aria-expanded={activeDropdown === section.label}
                    aria-haspopup="true"
                  >
                    {section.icon && (
                      <span className="mr-1">{section.icon}</span>
                    )}
                    <span>{section.label}</span>
                    <ChevronDown
                      className={cn(
                        "w-4 h-4 transition-transform duration-200",
                        activeDropdown === section.label ? "rotate-180" : "",
                      )}
                    />
                  </button>

                  {activeDropdown === section.label && (
                    <div
                      className="absolute left-0 mt-2 w-64 bg-white dark:bg-[#121212] rounded-lg shadow-lg overflow-hidden z-50 border border-gray-200 dark:border-gray-800"
                      role="menu"
                      aria-orientation="vertical"
                      aria-labelledby={`menu-button-${key}`}
                    >
                      <div className="py-1">
                        {section.items.map((item) => (
                          <button
                            key={item.href}
                            onClick={() => handleDropdownClick(item.href)}
                            className="flex items-center w-full px-4 py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-[#0A3C1F] dark:hover:text-[#FFD700] transition-colors duration-200"
                            role="menuitem"
                          >
                            {item.icon && (
                              <span className="mr-2">{item.icon}</span>
                            )}
                            {item.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
              {currentUser ? (
                <UserNav />
              ) : (
                <div className="flex items-center space-x-4">
                  <Button
                    variant="ghost"
                    onClick={handleLogin}
                    className="text-[#0A3C1F] dark:text-[#FFD700]"
                  >
                    Login
                  </Button>
                  <Button
                    onClick={handleApplyNow}
                    className="bg-[#0A3C1F] text-white hover:bg-[#0A3C1F]/90 dark:bg-[#FFD700] dark:text-black dark:hover:bg-[#FFD700]/90"
                  >
                    Apply Now
                  </Button>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="flex items-center space-x-4 md:hidden">
              <ThemeToggle />
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleMobileMenu}
                className="text-[#0A3C1F] dark:text-[#FFD700]"
                aria-expanded={isMobileMenuOpen}
                aria-controls="mobile-menu"
              >
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </Button>
            </div>
          </nav>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div
          id="mobile-menu"
          className="md:hidden fixed inset-0 top-[120px] bottom-0 bg-white dark:bg-[#121212] z-50 overflow-y-auto"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile navigation menu"
        >
          {/* Mobile menu backdrop */}
          <div 
            className="absolute inset-0 bg-black/50 z-40"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          
          {/* Mobile menu content */}
          <div className="relative z-50 bg-white dark:bg-[#121212] min-h-full">
            <div className="container mx-auto px-4 py-6">
              {Object.values(mainNavItems).map((section) => (
                <div key={section.label} className="mb-6">
                  <h3 className="text-[#0A3C1F] dark:text-[#FFD700] font-semibold mb-3 flex items-center text-lg border-b border-gray-200 dark:border-gray-700 pb-2">
                    {section.icon && <span className="mr-2">{section.icon}</span>}
                    {section.label}
                  </h3>
                  <div className="space-y-1 pl-6">
                    {section.items.map((item) => (
                      <button
                        key={item.href}
                        onClick={() => handleNavigation(item.href)}
                        className="w-full text-left text-gray-600 dark:text-gray-300 hover:text-[#0A3C1F] dark:hover:text-[#FFD700] py-3 flex items-center text-base transition-all duration-200 hover:translate-x-1 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md px-2"
                      >
                        {item.icon && (
                          <span className="mr-3 opacity-75">{item.icon}</span>
                        )}
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
              {!currentUser && (
                <div className="mt-8 space-y-4 border-t border-gray-200 dark:border-gray-700 pt-6">
                  <Button
                    variant="ghost"
                    onClick={handleLogin}
                    className="w-full text-[#0A3C1F] dark:text-[#FFD700] justify-center py-3 text-lg"
                  >
                    Login
                  </Button>
                  <Button
                    onClick={handleApplyNow}
                    className="w-full bg-[#0A3C1F] text-white hover:bg-[#0A3C1F]/90 dark:bg-[#FFD700] dark:text-black dark:hover:bg-[#FFD700]/90 py-3 text-lg"
                  >
                    Apply Now
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
