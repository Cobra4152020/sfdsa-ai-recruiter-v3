"use server"

import { fetchDatabaseSchema } from "@/lib/schema-visualization"
import type { DatabaseSchema } from "@/lib/schema-visualization"

export async function fetchSchema(): Promise<DatabaseSchema> {
  try {
    return await fetchDatabaseSchema()
  } catch (error) {
    console.error("Error fetching database schema:", error)
    return {
      tables: [],
      success: false,
      error: error instanceof Error ? error.message : String(error),
    }
  }
}
