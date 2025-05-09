"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { ImprovedHeader } from "@/components/improved-header"
import { ImprovedFooter } from "@/components/improved-footer"
import { SkipToContent } from "@/components/skip-to-content"
import { usePathname } from "next/navigation"

export default function MainLayoutClient({ children }: { children: React.ReactNode }) {
  const [isScrolled, setIsScrolled] = useState(false)
  const pathname = usePathname()

  // Check if we're on the homepage
  const isHomePage = pathname === "/"

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <>
      <SkipToContent />
      <ImprovedHeader isScrolled={isScrolled} />
      <main id="main-content" className="min-h-screen pt-8">
        {children}
      </main>
      <ImprovedFooter />
    </>
  )
}
