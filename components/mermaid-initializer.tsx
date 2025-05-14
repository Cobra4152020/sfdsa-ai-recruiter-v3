"use client"

import { useEffect } from "react"

export function MermaidInitializer() {
  useEffect(() => {
    import("mermaid").then((mermaid) => {
      mermaid.default.initialize({
        startOnLoad: true,
        theme: "default",
        securityLevel: "loose",
        er: {
          diagramPadding: 20,
          layoutDirection: "TB",
          minEntityWidth: 100,
          minEntityHeight: 75,
          entityPadding: 15,
          stroke: "gray",
          fill: "white",
          fontSize: 12,
        },
      })

      try {
        mermaid.default.init(".mermaid")
      } catch (error) {
        console.error("Error initializing mermaid:", error)
      }
    })
  }, [])

  return null
}
