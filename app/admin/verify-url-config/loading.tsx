import { RefreshCw } from "lucide-react"

export default function Loading() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6 text-green-900">URL Configuration Verification</h1>
      <div className="flex items-center justify-center p-8">
        <RefreshCw className="h-8 w-8 animate-spin text-yellow-500" />
        <span className="ml-2 text-lg">Loading configuration...</span>
      </div>
    </div>
  )
}
