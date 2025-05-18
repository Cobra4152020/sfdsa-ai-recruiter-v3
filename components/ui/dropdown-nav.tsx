"use client"

import type React from "react"
import { useRef, useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

interface DropdownNavItem {
  label: React.ReactNode
  href: string
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
  const dropdownRef = useRef<HTMLDivElement>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const router = useRouter()

  // Handle controlled vs uncontrolled state
  useEffect(() => {
    if (controlledIsOpen !== undefined) {
      setIsOpen(controlledIsOpen)
    }
  }, [controlledIsOpen])

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    setIsOpen(true)
  }

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false)
    }, 150)
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
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
      }
    }

    document.addEventListener("keydown", handleEscape)
    return () => {
      document.removeEventListener("keydown", handleEscape)
    }
  }, [])

  // Handle keyboard navigation
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault()
      setIsOpen(!isOpen)
    }
  }

  const handleLinkClick = (href: string, event: React.MouseEvent) => {
    event.preventDefault()
    setIsOpen(false)
    // Use setTimeout to ensure the dropdown closes before navigation
    setTimeout(() => {
      router.push(href)
    }, 10)
  }

  return (
    <div 
      className="relative group" 
      ref={dropdownRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button 
        className="flex items-center text-[#0A3C1F] dark:text-[#FFD700] hover:text-[#FFD700] dark:hover:text-white py-2 transition-all duration-200 group"
        aria-expanded={isOpen}
        aria-haspopup="true"
        onKeyDown={handleKeyDown}
        onClick={() => setIsOpen(!isOpen)}
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
          className="absolute left-0 mt-2 w-64 bg-[#0A3C1F] dark:bg-[#0A3C1F] rounded-lg shadow-lg overflow-hidden z-50 border border-[#FFD700]/20 animate-in fade-in slide-in-from-top-5 duration-200"
          role="menu"
          aria-orientation="vertical"
        >
          <div className="py-1" role="menu" aria-orientation="vertical">
            {items.map((item, index) => (
              <a
                key={index}
                href={item.href}
                className="flex items-center px-4 py-3 text-sm text-white hover:text-[#FFD700] hover:bg-[#FFD700]/10 transition-all duration-150 group"
                role="menuitem"
                onClick={(e) => handleLinkClick(item.href, e)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault()
                    handleLinkClick(item.href, e as any)
                  }
                }}
                tabIndex={0}
                style={{ transitionDelay: `${50 + index * 25}ms` }}
              >
                {item.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
