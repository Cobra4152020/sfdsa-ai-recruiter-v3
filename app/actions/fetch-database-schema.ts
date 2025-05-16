"use server"

import type { DatabaseSchema } from "@/lib/schema-visualization"

export async function fetchSchema(): Promise<DatabaseSchema> {
  try {
    const response = await fetch('/api/admin/database-schema')
    const data = await response.json()
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to fetch database schema')
    }
    
    return data
  } catch (error) {
    console.error("Error fetching database schema:", error)
    return {
      tables: [],
      success: false,
      error: error instanceof Error ? error.message : String(error),
    }
  }
}
