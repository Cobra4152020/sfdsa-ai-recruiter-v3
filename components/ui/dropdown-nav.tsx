"use client"

import type React from "react"
import { useRef, useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { usePathname } from "next/navigation"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

interface DropdownNavItem {
  label: React.ReactNode
  href: string
  icon?: React.ReactNode
}

interface DropdownNavProps {
  label: React.ReactNode
  items: DropdownNavItem[]
  icon?: React.ReactNode
  isOpen?: boolean
  onToggle?: () => void
}

export function DropdownNav({ label, items, icon, isOpen: controlledIsOpen, onToggle }: DropdownNavProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const pathname = usePathname()
  const router = useRouter()

  // Handle controlled vs uncontrolled state
  useEffect(() => {
    if (controlledIsOpen !== undefined) {
      setIsOpen(controlledIsOpen)
    }
  }, [controlledIsOpen])

  // Close dropdown when pathname changes
  useEffect(() => {
    setIsOpen(false)
    setActiveIndex(-1)
  }, [pathname])

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    setIsOpen(true)
  }

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false)
      setActiveIndex(-1)
    }, 150)
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
        setActiveIndex(-1)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Close dropdown when pressing escape
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false)
        setActiveIndex(-1)
      }
    }

    document.addEventListener("keydown", handleEscape)
    return () => {
      document.removeEventListener("keydown", handleEscape)
    }
  }, [])

  // Handle keyboard navigation
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (!isOpen && (event.key === "Enter" || event.key === " " || event.key === "ArrowDown")) {
      event.preventDefault()
      setIsOpen(true)
      setActiveIndex(0)
      return
    }

    if (isOpen) {
      switch (event.key) {
        case "ArrowDown":
          event.preventDefault()
          setActiveIndex(prev => (prev + 1) % items.length)
          break
        case "ArrowUp":
          event.preventDefault()
          setActiveIndex(prev => (prev - 1 + items.length) % items.length)
          break
        case "Enter":
        case " ":
          event.preventDefault()
          if (activeIndex >= 0) {
            const item = items[activeIndex]
            router.push(item.href)
            setIsOpen(false)
            setActiveIndex(-1)
          }
          break
        case "Tab":
          if (!event.shiftKey && activeIndex === items.length - 1) {
            setIsOpen(false)
            setActiveIndex(-1)
          }
          if (event.shiftKey && activeIndex === 0) {
            setIsOpen(false)
            setActiveIndex(-1)
          }
          break
      }
    }
  }

  return (
    <div 
      className="relative group" 
      ref={dropdownRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onKeyDown={handleKeyDown}
    >
      <button 
        className="flex items-center text-[#0A3C1F] dark:text-[#FFD700] hover:text-[#FFD700] dark:hover:text-white py-2 transition-all duration-200 group"
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-controls={isOpen ? "dropdown-menu" : undefined}
        onClick={() => {
          setIsOpen(!isOpen)
          if (onToggle) onToggle()
        }}
      >
        <span className="flex items-center transform group-hover:scale-105 transition-transform duration-200">
          {icon && <span className="text-[#FFD700] dark:text-[#FFD700] mr-1" aria-hidden="true">{icon}</span>}
          <span className="mx-1">{label}</span>
          <ChevronDown 
            className={cn(
              "ml-1 h-4 w-4 transition-transform duration-200",
              isOpen ? "rotate-180" : ""
            )} 
            aria-hidden="true"
          />
        </span>
      </button>

      {isOpen && (
        <div
          id="dropdown-menu"
          className="absolute left-0 mt-2 w-64 bg-[#0A3C1F] dark:bg-[#0A3C1F] rounded-lg shadow-lg overflow-hidden z-50 border border-[#FFD700]/20"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="dropdown-button"
        >
          <div className="py-1" role="none">
            {items.map((item, index) => (
              <Link
                key={index}
                href={item.href}
                className={cn(
                  "flex items-center w-full px-4 py-3 text-sm text-white hover:text-[#FFD700] hover:bg-[#FFD700]/10 transition-all duration-150 group text-left",
                  activeIndex === index && "bg-[#FFD700]/5 text-[#FFD700]"
                )}
                role="menuitem"
                tabIndex={isOpen ? 0 : -1}
                aria-current={activeIndex === index}
                onClick={() => {
                  setIsOpen(false)
                  setActiveIndex(-1)
                }}
              >
                {item.icon && <span className="mr-3 opacity-75 group-hover:opacity-100">{item.icon}</span>}
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
