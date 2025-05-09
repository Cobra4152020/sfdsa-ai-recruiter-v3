"use client"

import { useRef, useEffect } from "react"
import Link from "next/link"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAnimationState } from "@/hooks/use-animation-state"

interface DropdownNavProps {
  label: string
  items: {
    label: string
    href: string
    isComingSoon?: boolean
  }[]
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
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={handleToggle}
        className="flex items-center text-white hover:text-[#FFD700] transition-colors focus:outline-none focus:ring-2 focus:ring-[#FFD700] focus:ring-opacity-50 rounded px-2 py-1"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        {label}
        <ChevronDown
          className={cn("ml-1 h-4 w-4 transition-transform duration-200", {
            "transform rotate-180": isOpen,
          })}
        />
      </button>

      {isVisible && (
        <div
          className={cn(
            "absolute z-10 mt-2 w-48 rounded-md shadow-lg bg-[#0A3C1F] border border-white/10 py-1 transition-all duration-200",
            {
              "opacity-0 translate-y-[-8px]": animationState === "closing" || animationState === "closed",
              "opacity-100 translate-y-0": animationState === "opening" || animationState === "open",
            },
          )}
          role="menu"
          aria-orientation="vertical"
        >
          {items.map((item, index) => (
            <Link
              key={index}
              href={item.href}
              className={cn(
                "block px-4 py-2 text-sm text-white hover:bg-white/10 hover:text-[#FFD700] transition-all",
                {
                  "opacity-0 translate-y-[-4px] transition-all duration-[150ms]":
                    animationState === "closing" || animationState === "closed",
                  "opacity-100 translate-y-0 transition-all duration-[250ms]":
                    animationState === "opening" || animationState === "open",
                  "delay-[50ms]": index === 0,
                  "delay-[100ms]": index === 1,
                  "delay-[150ms]": index === 2,
                  "delay-[200ms]": index === 3,
                },
              )}
              role="menuitem"
              onClick={close}
              style={{ transitionDelay: `${50 + index * 50}ms` }}
            >
              {item.label}
              {item.isComingSoon && (
                <span className="ml-2 inline-block px-2 py-0.5 text-xs bg-[#FFD700] text-[#0A3C1F] rounded-full">
                  Soon
                </span>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
