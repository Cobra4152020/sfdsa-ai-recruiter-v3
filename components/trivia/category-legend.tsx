"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Flame, MapPin, MessageSquare, Building2, Castle, Trees, Info } from "lucide-react"

const categories = [
  {
    id: "sports",
    name: "Sports",
    icon: <Flame className="h-4 w-4" />,
    bgColor: "bg-red-500",
    textColor: "text-white",
    description: "Questions about local sports teams, athletes, and sporting events",
  },
  {
    id: "geography",
    name: "Geography",
    icon: <MapPin className="h-4 w-4" />,
    bgColor: "bg-purple-500",
    textColor: "text-white",
    description: "Questions about San Francisco's geography, neighborhoods, and locations",
  },
  {
    id: "landmarks",
    name: "Landmarks",
    icon: <Castle className="h-4 w-4" />,
    bgColor: "bg-green-500",
    textColor: "text-white",
    description: "Questions about famous San Francisco landmarks and attractions",
  },
  {
    id: "culture",
    name: "Culture",
    icon: <MessageSquare className="h-4 w-4" />,
    bgColor: "bg-blue-500",
    textColor: "text-white",
    description: "Questions about San Francisco's history, arts, and cultural events",
  },
  {
    id: "urban",
    name: "Urban",
    icon: <Building2 className="h-4 w-4" />,
    bgColor: "bg-slate-500",
    textColor: "text-white",
    description: "Questions about city life, infrastructure, and urban development",
  },
  {
    id: "nature",
    name: "Nature",
    icon: <Trees className="h-4 w-4" />,
    bgColor: "bg-emerald-500",
    textColor: "text-white",
    description: "Questions about parks, outdoor spaces, and natural attractions",
  },
]

export function CategoryLegend() {
  const [open, setOpen] = useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-1">
          <Info className="h-4 w-4" />
          <span>Categories</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-4">
        <div className="space-y-4">
          <h3 className="font-semibold text-lg">Trivia Categories</h3>
          <p className="text-sm text-gray-500">
            Each trivia game is tagged with one or more categories to help you find topics you're interested in.
          </p>
          <div className="space-y-2">
            {categories.map((category) => (
              <div key={category.id} className="flex items-start gap-2">
                <div className={`p-1 rounded-full ${category.bgColor} mt-0.5`}>{category.icon}</div>
                <div>
                  <h4 className="font-medium">{category.name}</h4>
                  <p className="text-xs text-gray-500">{category.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
