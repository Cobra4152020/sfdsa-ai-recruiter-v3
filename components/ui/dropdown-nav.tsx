"use client"

import type React from "react"
import { useRef, useEffect, useState } from "react"
import Link from "next/link"
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

  // Handle controlled vs uncontrolled state
  useEffect(() => {
    if (controlledIsOpen !== undefined) {
      setIsOpen(controlledIsOpen)
    }
  }, [controlledIsOpen])

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault()
    if (onToggle) {
      onToggle()
    } else {
      setIsOpen(!isOpen)
    }
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

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={handleToggle}
        className="flex items-center text-white hover:text-[#FFD700] transition-colors focus:outline-none focus:ring-2 focus:ring-[#FFD700] focus:ring-opacity-50 rounded px-2 py-1"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        {icon && <span className="mr-1 text-[#FFD700]">{icon}</span>}
        <span>{label}</span>
        <ChevronDown className={cn("ml-1 h-4 w-4 transition-transform duration-200", isOpen ? "rotate-180" : "")} />
      </button>

      {isOpen && (
        <div
          className="absolute left-0 mt-2 w-56 rounded-md shadow-lg bg-[#0A3C1F] ring-1 ring-[#FFD700]/20 z-50 animate-in fade-in slide-in-from-top-5 duration-200"
          role="menu"
          aria-orientation="vertical"
        >
          <div className="py-1" role="menu" aria-orientation="vertical">
            {items.map((item, index) => (
              <Link
                key={index}
                href={item.href}
                className="block px-4 py-2 text-sm text-white hover:text-[#FFD700] hover:bg-white/10 transition-colors"
                role="menuitem"
                onClick={() => setIsOpen(false)}
                style={{ transitionDelay: `${50 + index * 25}ms` }}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
