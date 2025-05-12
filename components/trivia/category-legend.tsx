"use client"

import { Flame, MapPin, Castle, MessageSquare, Building2, Trees, InfoIcon } from "lucide-react"
import { useState } from "react"

export function CategoryLegend() {
  const [isOpen, setIsOpen] = useState(false)

  const categories = [
    {
      id: "sports",
      name: "Sports",
      icon: <Flame className="h-4 w-4" />,
      bgColor: "bg-red-500",
      textColor: "text-white",
      description: "Questions about sports teams, players, and history",
    },
    {
      id: "geography",
      name: "Geography",
      icon: <MapPin className="h-4 w-4" />,
      bgColor: "bg-purple-500",
      textColor: "text-white",
      description: "Questions about locations, neighborhoods, and regions",
    },
    {
      id: "landmarks",
      name: "Landmarks",
      icon: <Castle className="h-4 w-4" />,
      bgColor: "bg-green-500",
      textColor: "text-white",
      description: "Questions about famous monuments, buildings, and attractions",
    },
    {
      id: "culture",
      name: "Culture",
      icon: <MessageSquare className="h-4 w-4" />,
      bgColor: "bg-blue-500",
      textColor: "text-white",
      description: "Questions about local customs, traditions, and cultural events",
    },
    {
      id: "urban",
      name: "Urban",
      icon: <Building2 className="h-4 w-4" />,
      bgColor: "bg-slate-500",
      textColor: "text-white",
      description: "Questions about city planning, urban features, and city life",
    },
    {
      id: "nature",
      name: "Nature",
      icon: <Trees className="h-4 w-4" />,
      bgColor: "bg-emerald-500",
      textColor: "text-white",
      description: "Questions about parks, natural features, and outdoor attractions",
    },
  ]

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-gray-100 hover:bg-gray-200 text-sm font-medium transition-colors"
        aria-expanded={isOpen}
        aria-controls="category-legend"
      >
        <InfoIcon className="h-4 w-4" />
        <span>Categories</span>
      </button>

      {isOpen && (
        <div
          id="category-legend"
          className="absolute z-20 mt-2 p-4 bg-white rounded-lg shadow-lg border border-gray-200 w-72 right-0"
        >
          <h3 className="font-semibold text-gray-800 mb-3">Category Legend</h3>
          <div className="space-y-2.5">
            {categories.map((category) => (
              <div key={category.id} className="flex items-start gap-2">
                <div
                  className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${category.bgColor} ${category.textColor} shadow-sm`}
                >
                  {category.icon}
                  <span>{category.name}</span>
                </div>
                <p className="text-xs text-gray-600 flex-1">{category.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
