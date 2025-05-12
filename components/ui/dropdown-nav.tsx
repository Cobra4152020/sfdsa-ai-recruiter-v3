"use client"

import type React from "react"

import { useRef, useEffect } from "react"
import Link from "next/link"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAnimationState } from "@/hooks/use-animation-state"

interface DropdownNavItem {
  label: React.ReactNode
  href: string
}

interface DropdownNavProps {
  label: React.ReactNode
  items: DropdownNavItem[]
  isOpen?: boolean
  onToggle?: () => void
}

export function DropdownNav({ label, items, isOpen: controlledIsOpen, onToggle }: DropdownNavProps) {
  const { isOpen, toggle, close, isVisible, animationState } = useAnimationState(controlledIsOpen || false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Handle controlled vs uncontrolled state
  useEffect(() => {
    if (controlledIsOpen !== undefined && controlledIsOpen !== isOpen) {
      if (controlledIsOpen) toggle()
      else close()
    }
  }, [controlledIsOpen, isOpen, toggle, close])

  const handleToggle = () => {
    if (onToggle) {
      onToggle()
    } else {
      toggle()
    }
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        close()
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [close])

  return (
    <div className="relative group" ref={dropdownRef}>
      <button
        onClick={handleToggle}
        className="flex items-center text-white hover:text-[#FFD700] transition-colors focus:outline-none focus:ring-2 focus:ring-[#FFD700] focus:ring-opacity-50 rounded px-2 py-1"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        {label}
        <ChevronDown className="ml-1 h-4 w-4 transition-transform duration-200 group-hover:rotate-180" />
      </button>

      {isVisible && (
        <div
          className={cn(
            "absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50",
            {
              "opacity-0 translate-y-[-8px]": animationState === "closing" || animationState === "closed",
              "opacity-100 translate-y-0": animationState === "opening" || animationState === "open",
            },
          )}
          role="menu"
          aria-orientation="vertical"
        >
          <div className="py-1" role="menu" aria-orientation="vertical">
            {items.map((item, index) => (
              <Link
                key={index}
                href={item.href}
                className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                role="menuitem"
                onClick={close}
                style={{ transitionDelay: `${50 + index * 50}ms` }}
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
