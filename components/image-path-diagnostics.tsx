"use client"

import { useState, useEffect } from "react"
import { checkImageExists } from "@/lib/image-path-utils"

// List of important images to check
const CRITICAL_IMAGES = [
  "/male-law-enforcement-headshot.png",
  "/female-law-enforcement-headshot.png",
  "/asian-male-officer-headshot.png",
  "/san-francisco-deputy-sheriff.png",
  "/generic-badge.png",
  "/diverse-group-brainstorming.png",
  "/abstract-geometric-shapes.png",
  "/document-icon.png",
  "/fitness-icon.png",
  "/psychology-icon.png",
  "/chat-icon.png",
]

export default function ImagePathDiagnostics() {
  const [results, setResults] = useState<Record<string, boolean>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function checkImages() {
      const checks = await Promise.all(
        CRITICAL_IMAGES.map(async (path) => {
          const exists = await checkImageExists(path)
          return { path, exists }
        }),
      )

      const resultsMap = checks.reduce(
        (acc, { path, exists }) => {
          acc[path] = exists
          return acc
        },
        {} as Record<string, boolean>,
      )

      setResults(resultsMap)
      setLoading(false)
    }

    checkImages()
  }, [])

  return (
    <div className="p-4 border rounded-lg bg-white shadow-sm">
      <h2 className="text-xl font-bold mb-4">Image Path Diagnostics</h2>
      {loading ? (
        <p>Checking image paths...</p>
      ) : (
        <div className="space-y-2">
          <p className="font-medium">Results:</p>
          <ul className="space-y-1">
            {Object.entries(results).map(([path, exists]) => (
              <li key={path} className="flex items-center">
                <span className={`w-4 h-4 rounded-full mr-2 ${exists ? "bg-green-500" : "bg-red-500"}`}></span>
                <span className={exists ? "text-green-700" : "text-red-700"}>
                  {path}: {exists ? "OK" : "Not Found"}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
