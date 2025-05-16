"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { fetchSchema } from "@/app/actions/fetch-database-schema"
import { generateMermaidDiagram, generateSimplifiedMermaidDiagram } from "@/lib/schema-visualization"
import type { DatabaseSchema } from "@/lib/schema-visualization"
import { RefreshCw, Database, ZoomIn, ZoomOut } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

export function SchemaDiagram() {
  const [schema, setSchema] = useState<DatabaseSchema | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [diagramType, setDiagramType] = useState<"detailed" | "simplified">("simplified")
  const [zoomLevel, setZoomLevel] = useState(100)
  const { toast } = useToast()

  useEffect(() => {
    loadSchema()
  }, [])

  const loadSchema = async () => {
    try {
      setIsLoading(true)
      const result = await fetchSchema()
      setSchema(result)

      if (!result.success) {
        toast({
          title: "Error Loading Schema",
          description: result.error || "Failed to load database schema",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error loading schema:", error)
      toast({
        title: "Error Loading Schema",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const getMermaidDiagram = () => {
    if (!schema) return ""

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
          <Button onClick={loadSchema} disabled={isLoading} variant="outline" size="sm">
            <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
            {isLoading ? "Loading..." : "Refresh"}
          </Button>
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

        {schema ? (
          <div className="overflow-auto border rounded-md" style={{ maxHeight: "70vh" }}>
            <div style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: "top left", padding: "20px" }}>
              <pre className="mermaid">{getMermaidDiagram()}</pre>
            </div>
          </div>
        ) : (
          <div className="flex justify-center items-center h-64">
            {isLoading ? (
              <div className="text-center">
                <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-gray-400" />
                <p>Loading database schema...</p>
              </div>
            ) : (
              <div className="text-center">
                <Database className="h-8 w-8 mx-auto mb-4 text-gray-400" />
                <p>No schema information available</p>
                <Button onClick={loadSchema} variant="outline" className="mt-4">
                  Load Schema
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
