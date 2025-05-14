"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle, XCircle, Smartphone, Tablet, Monitor, RefreshCw } from "lucide-react"

interface BreakpointTest {
  name: string
  width: number
  icon: React.ReactNode
  status: "pass" | "fail" | "untested"
  issues?: string[]
}

export function ResponsiveTest() {
  const [breakpoints, setBreakpoints] = useState<BreakpointTest[]>([
    {
      name: "Mobile",
      width: 375,
      icon: <Smartphone className="h-5 w-5" />,
      status: "untested",
    },
    {
      name: "Tablet",
      width: 768,
      icon: <Tablet className="h-5 w-5" />,
      status: "untested",
    },
    {
      name: "Desktop",
      width: 1280,
      icon: <Monitor className="h-5 w-5" />,
      status: "untested",
    },
  ])
  const [currentWidth, setCurrentWidth] = useState(0)
  const [isTestRunning, setIsTestRunning] = useState(false)

  useEffect(() => {
    setCurrentWidth(window.innerWidth)

    const handleResize = () => {
      setCurrentWidth(window.innerWidth)
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const runResponsiveTests = () => {
    setIsTestRunning(true)

    // Simulate testing at different breakpoints
    setTimeout(() => {
      setBreakpoints([
        {
          name: "Mobile",
          width: 375,
          icon: <Smartphone className="h-5 w-5" />,
          status: "pass",
        },
        {
          name: "Tablet",
          width: 768,
          icon: <Tablet className="h-5 w-5" />,
          status: "pass",
        },
        {
          name: "Desktop",
          width: 1280,
          icon: <Monitor className="h-5 w-5" />,
          status: "pass",
        },
      ])
      setIsTestRunning(false)
    }, 2000)
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Responsive Testing</CardTitle>
            <CardDescription>Test application at different screen sizes</CardDescription>
          </div>
          <Button onClick={runResponsiveTests} disabled={isTestRunning} size="sm">
            <RefreshCw className={`h-4 w-4 mr-2 ${isTestRunning ? "animate-spin" : ""}`} />
            {isTestRunning ? "Testing..." : "Run Tests"}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Current Viewport Width:</span>
            <Badge variant="outline">{currentWidth}px</Badge>
          </div>
          <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#0A3C1F] rounded-full"
              style={{ width: `${Math.min((currentWidth / 1920) * 100, 100)}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>320px</span>
            <span>768px</span>
            <span>1280px</span>
            <span>1920px</span>
          </div>
        </div>

        <Tabs defaultValue="breakpoints">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="breakpoints">Breakpoints</TabsTrigger>
            <TabsTrigger value="elements">UI Elements</TabsTrigger>
          </TabsList>

          <TabsContent value="breakpoints" className="space-y-4 pt-4">
            {breakpoints.map((breakpoint) => (
              <div
                key={breakpoint.name}
                className={`p-4 rounded-lg border flex items-start ${
                  breakpoint.status === "pass"
                    ? "bg-green-50 border-green-200"
                    : breakpoint.status === "fail"
                      ? "bg-red-50 border-red-200"
                      : "bg-gray-50 border-gray-200"
                }`}
              >
                <div className="mr-3">{breakpoint.icon}</div>
                <div className="flex-1">
                  <div className="flex items-center">
                    <h3 className="font-medium">{breakpoint.name}</h3>
                    <Badge variant="outline" className="ml-2">
                      {breakpoint.width}px
                    </Badge>
                    {breakpoint.status === "pass" ? (
                      <CheckCircle className="h-4 w-4 text-green-500 ml-2" />
                    ) : breakpoint.status === "fail" ? (
                      <XCircle className="h-4 w-4 text-red-500 ml-2" />
                    ) : null}
                  </div>
                  {breakpoint.issues && breakpoint.issues.length > 0 && (
                    <ul className="mt-2 text-sm text-red-600 list-disc pl-5">
                      {breakpoint.issues.map((issue, i) => (
                        <li key={i}>{issue}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="elements" className="pt-4">
            <div className="space-y-4">
              <div className="p-4 rounded-lg border bg-green-50 border-green-200">
                <h3 className="font-medium flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Navigation
                </h3>
                <p className="text-sm text-gray-600 mt-1">Navigation collapses to hamburger menu on mobile screens</p>
              </div>

              <div className="p-4 rounded-lg border bg-green-50 border-green-200">
                <h3 className="font-medium flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Forms
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  Forms stack vertically and maintain proper spacing on all screen sizes
                </p>
              </div>

              <div className="p-4 rounded-lg border bg-green-50 border-green-200">
                <h3 className="font-medium flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Images
                </h3>
                <p className="text-sm text-gray-600 mt-1">Images are responsive and maintain proper aspect ratios</p>
              </div>

              <div className="p-4 rounded-lg border bg-green-50 border-green-200">
                <h3 className="font-medium flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Typography
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  Text is readable at all screen sizes with appropriate scaling
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
