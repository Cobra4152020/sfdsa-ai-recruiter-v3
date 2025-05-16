"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { generateMermaidDiagram, generateSimplifiedMermaidDiagram } from "@/lib/schema-visualization"
import type { DatabaseSchema } from "@/lib/schema-visualization"
import { RefreshCw, Database, ZoomIn, ZoomOut } from "lucide-react"

interface SchemaVisualizationProps {
  schema: DatabaseSchema
}

export function SchemaVisualization({ schema }: SchemaVisualizationProps) {
  const [diagramType, setDiagramType] = useState<"detailed" | "simplified">("simplified")
  const [zoomLevel, setZoomLevel] = useState(100)

  const getMermaidDiagram = () => {
    return diagramType === "detailed" ? generateMermaidDiagram(schema) : generateSimplifiedMermaidDiagram(schema)
  }

  const zoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 10, 200))
  }

  const zoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 10, 50))
  }

  const resetZoom = () => {
    setZoomLevel(100)
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Database Schema Diagram</CardTitle>
            <CardDescription>Visual representation of your database structure</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex items-center justify-between">
          <Tabs value={diagramType} onValueChange={(value) => setDiagramType(value as "detailed" | "simplified")}>
            <TabsList>
              <TabsTrigger value="simplified">Simplified</TabsTrigger>
              <TabsTrigger value="detailed">Detailed</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="flex items-center space-x-2">
            <Button onClick={zoomOut} variant="outline" size="icon" title="Zoom Out">
              <ZoomOut className="h-4 w-4" />
            </Button>
            <Button onClick={resetZoom} variant="outline" size="sm">
              {zoomLevel}%
            </Button>
            <Button onClick={zoomIn} variant="outline" size="icon" title="Zoom In">
              <ZoomIn className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="overflow-auto border rounded-md" style={{ maxHeight: "70vh" }}>
          <div style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: "top left", padding: "20px" }}>
            <pre className="mermaid">{getMermaidDiagram()}</pre>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 