"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { LineChart } from "@/components/ui/charts"

interface PerformanceData {
  cpu: {
    usage: number
    temperature: number
    processes: number
  }
  memory: {
    used: number
    total: number
    swap: number
  }
  disk: {
    used: number
    total: number
    readSpeed: string
    writeSpeed: string
  }
  network: {
    incoming: string
    outgoing: string
    latency: string
    errors: number
  }
}

interface PerformanceWidgetProps {
  data: PerformanceData
}

export function PerformanceWidget({ data }: PerformanceWidgetProps) {
  // Calculate performance ratings
  const cpuRating = data.cpu.usage <= 50 ? "good" : data.cpu.usage <= 80 ? "needs-improvement" : "poor"
  const memoryRating = (data.memory.used / data.memory.total) <= 0.6 ? "good" : (data.memory.used / data.memory.total) <= 0.8 ? "needs-improvement" : "poor"
  const diskRating = (data.disk.used / data.disk.total) <= 0.6 ? "good" : (data.disk.used / data.disk.total) <= 0.8 ? "needs-improvement" : "poor"

  // Overall rating is the worst of all ratings
  const overallRating = [cpuRating, memoryRating, diskRating].includes("poor") ? "poor" : 
                       [cpuRating, memoryRating, diskRating].includes("needs-improvement") ? "needs-improvement" : "good"

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between">
          <span>Performance</span>
          <Badge variant={overallRating === "good" ? "success" : overallRating === "needs-improvement" ? "warning" : "destructive"}>
            {overallRating === "good" ? "Good" : overallRating === "needs-improvement" ? "Needs Improvement" : "Poor"}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-2">
              <span>CPU Usage</span>
              <span>{data.cpu.usage}%</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${
                  cpuRating === "good" ? "bg-green-500" : cpuRating === "needs-improvement" ? "bg-yellow-500" : "bg-red-500"
                }`}
                style={{ width: `${data.cpu.usage}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <span>Memory Usage</span>
              <span>{data.memory.used}GB / {data.memory.total}GB</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${
                  memoryRating === "good" ? "bg-green-500" : memoryRating === "needs-improvement" ? "bg-yellow-500" : "bg-red-500"
                }`}
                style={{ width: `${(data.memory.used / data.memory.total) * 100}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <span>Disk Usage</span>
              <span>{data.disk.used}GB / {data.disk.total}GB</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${
                  diskRating === "good" ? "bg-green-500" : diskRating === "needs-improvement" ? "bg-yellow-500" : "bg-red-500"
                }`}
                style={{ width: `${(data.disk.used / data.disk.total) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
