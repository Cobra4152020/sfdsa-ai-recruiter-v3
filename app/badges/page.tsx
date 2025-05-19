"use client"

import { Suspense } from "react"
import { BadgesContent } from "./badges-content"

export default function BadgesPage() {
  return (
    <Suspense
      fallback={
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-8">
              <div className="h-8 w-64 bg-gray-200 rounded animate-pulse mx-auto mb-4" />
              <div className="h-4 w-96 bg-gray-200 rounded animate-pulse mx-auto" />
            </div>
            <div className="p-6 bg-white rounded-lg shadow">
              <div className="h-4 w-32 bg-gray-200 rounded animate-pulse mb-4" />
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="h-32 bg-gray-200 rounded animate-pulse" />
                ))}
              </div>
            </div>
          </div>
        </div>
      }
    >
      <BadgesContent />
    </Suspense>
  )
}
