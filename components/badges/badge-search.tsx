"use client"

import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

export interface BadgeSearchProps {
  value: string;
  onChange: (value: string) => void;
}

export function BadgeSearch({ value, onChange }: BadgeSearchProps) {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
      <Input
        type="text"
        placeholder="Search badges..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pl-10 w-[200px] sm:w-[300px]"
      />
    </div>
  )
} 