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
  FileText,
} from "lucide-react";
import { useAuthModal } from "@/context/auth-modal-context";
import { useUser } from "@/context/user-context";
import { ShieldLogo } from "@/components/shield-logo";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-provider";
import { UserNav } from "@/components/user-nav";
import AskSgtKenButton from "@/components/ask-sgt-ken-button";
import { cn } from "@/lib/utils";
import { useClientOnly } from "@/hooks/use-client-only";
import { getWindowDimensions } from "@/lib/utils";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

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

export function ImprovedHeader() {
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

  const handleSignUp = () => {
    try {
      if (typeof openModal === "function") {
        openModal("signup", "recruit");
      } else {
        router.push("/apply");
      }
    } catch (error) {
      console.error("Error opening signup modal:", error);
      router.push("/apply");
    }
  };

  const handleApplyNow = () => {
    router.push("/apply");
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
          label: "Deputy Roadmap",
          href: "/roadmap",
          icon: <Trophy className="w-4 h-4" />,
        },
        {
          label: "Apply Now",
          href: "/apply",
          icon: <Shield className="w-4 h-4" />,
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
        {
          label: "Background Prep",
          href: "/background-preparation",
          icon: <FileText className="w-4 h-4" />,
        },
        {
          label: "Practice Tests",
          href: "/practice-tests",
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
      label: "Help & Support",
      icon: <HelpCircle className="w-4 h-4" />,
      items: [
        {
          label: "FAQ",
          href: "/faq",
          icon: <HelpCircle className="w-4 h-4" />,
        },
        {
          label: "Ask Sgt. Ken (AI Chat)",
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
      <header className="fixed w-full z-50 bg-white/95 dark:bg-black/95 shadow-md backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="w-32 h-8 bg-gray-200 dark:bg-black animate-pulse rounded" />
            <div className="hidden md:flex space-x-4">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="w-24 h-6 bg-gray-200 dark:bg-black animate-pulse rounded"
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
          ? "bg-white/95 dark:bg-black/95 shadow-md backdrop-blur-sm"
          : "bg-transparent",
      )}
    >
      {/* Top bar */}
      <div className="bg-primary dark:bg-black text-white dark:text-[#FFD700] py-1 sm:py-2">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1 sm:space-x-2">
              <Badge variant="outline" className="bg-[#FFD700] text-black border-[#FFD700] text-xs">
                NOW HIRING
              </Badge>
              <span className="text-xs sm:text-sm font-medium hidden xs:block">
                Deputy Sheriff - Starting at $118,000
              </span>
              <span className="text-xs font-medium xs:hidden">
                Deputy Sheriff
              </span>
            </div>
            <div className="flex items-center space-x-1 sm:space-x-2">
              <AskSgtKenButton 
                variant="outline" 
                size="sm"
                className="bg-[#FFD700] text-black border-[#FFD700] hover:bg-[#FFD700]/90 hover:text-black text-xs px-2 py-1 h-6 sm:h-7 font-bold rounded-full"
              />
              <Link href="/donate">
                <Button
                  size="sm"
                  variant="outline"
                  className="bg-white dark:bg-[#FFD700] text-black border-white dark:border-[#FFD700] hover:bg-white/90 dark:hover:bg-[#FFD700]/90 hover:text-black text-xs px-2 py-1 h-6 sm:h-7 font-bold rounded-full"
                >
                  Donate
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main navigation */}
      <div
        className={cn(
          "py-3 sm:py-4 transition-colors duration-200",
          scrolled
            ? "bg-white dark:bg-black"
            : "bg-white/0 dark:bg-transparent",
        )}
      >
        <div className="container mx-auto px-4">
          <nav className="flex justify-between items-center">
            <Link
              href="/"
              className="flex items-center space-x-2 group transition-transform duration-200 hover:scale-105"
            >
              <ShieldLogo className="w-6 h-6 sm:w-8 sm:h-8" />
              <span className="text-lg sm:text-xl font-bold text-primary dark:text-[#FFD700]">
                SF Deputy Sheriff
              </span>
            </Link>

            {/* Desktop navigation */}
            <div className="hidden md:flex items-center space-x-6">
              {Object.entries(mainNavItems).map(([key, section]) => (
                <div key={key} className="relative group">
                  <button
                    className="flex items-center space-x-1 text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-[#FFD700] transition-colors duration-200 group"
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
                      className="absolute left-0 mt-2 w-64 bg-white dark:bg-black rounded-lg shadow-lg overflow-hidden z-50 border border-gray-200 dark:border-[#FFD700]/30"
                      role="menu"
                      aria-orientation="vertical"
                      aria-labelledby={`menu-button-${key}`}
                    >
                      <div className="py-1">
                        {section.items.map((item) => (
                          <button
                            key={item.href}
                            onClick={() => handleDropdownClick(item.href)}
                            className="flex items-center w-full px-4 py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#FFD700]/10 hover:text-primary dark:hover:text-[#FFD700] transition-colors duration-200"
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
              <div className="flex items-center space-x-3">
                <ThemeToggle />
                {currentUser ? (
                  <UserNav />
                ) : (
                  <div className="flex items-center space-x-3">
                    <Button
                      variant="ghost"
                      onClick={handleSignUp}
                      className="text-primary dark:text-[#FFD700]"
                    >
                      Sign Up
                    </Button>
                    <Button
                      onClick={handleApplyNow}
                      className="bg-primary text-white hover:bg-primary/90 dark:bg-[#FFD700] dark:text-black dark:hover:bg-[#FFD700]/90"
                    >
                      Apply Now
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Mobile menu button - MUCH more visible */}
            <div className="flex items-center space-x-2 md:hidden">
              <Button
                variant="outline"
                size="icon"
                onClick={toggleMobileMenu}
                className="text-primary dark:text-[#FFD700] border-2 border-primary dark:border-[#FFD700] hover:bg-primary hover:text-white dark:hover:bg-[#FFD700] dark:hover:text-black bg-white dark:bg-black shadow-lg w-10 h-10"
                aria-expanded={isMobileMenuOpen}
                aria-controls="mobile-menu"
              >
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6 stroke-[3]" />
                ) : (
                  <Menu className="w-6 h-6 stroke-[3]" />
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
          className="md:hidden fixed inset-0 top-[90px] bottom-0 z-[9999] overflow-y-auto"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile navigation menu"
        >
          {/* Mobile menu backdrop */}
          <div 
            className="absolute inset-0 bg-black/75 z-[9998]"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          
          {/* Mobile menu content */}
          <div className="relative z-[9999] bg-white dark:bg-black min-h-full shadow-2xl border-t-4 border-primary dark:border-[#FFD700]">
            <div className="p-6">
              <h3 className="text-primary dark:text-[#FFD700] font-semibold mb-3 flex items-center text-lg border-b border-gray-200 dark:border-[#FFD700]/30 pb-2">
                <FileText className="mr-2 h-5 w-5" />
                Quick Links
              </h3>
              <nav className="space-y-2">
                {Object.values(mainNavItems).flatMap((section) =>
                  section.items.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="w-full text-left text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-[#FFD700] py-3 flex items-center text-base transition-all duration-200 hover:translate-x-1 hover:bg-accent/10 dark:hover:bg-[#FFD700]/10 rounded-md px-2"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {item.icon && <span className="mr-3 h-4 w-4">{item.icon}</span>}
                      {item.label}
                    </Link>
                  ))
                )}
              </nav>
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-[#FFD700]/30">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Theme</span>
                  <ThemeToggle />
                </div>
                <div className="space-y-3">
                  <AskSgtKenButton 
                    variant="outline"
                    className="w-full text-primary dark:text-[#FFD700] border-primary dark:border-[#FFD700] py-3 text-lg"
                  />
                  <Link href="/donate">
                    <Button
                      variant="outline"
                      className="w-full text-primary dark:text-[#FFD700] border-primary dark:border-[#FFD700] py-3 text-lg"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Donate
                    </Button>
                  </Link>
                  <Button
                    className="w-full bg-primary text-white hover:bg-primary/90 dark:bg-[#FFD700] dark:text-black dark:hover:bg-[#FFD700]/90 py-3 text-lg font-semibold"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Apply Now
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
