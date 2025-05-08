"use server"

import { setupDatabase, createColumnCheckFunction } from "@/lib/database-setup"

export async function runDatabaseSetup() {
  try {
    // Create the column check function first
    await createColumnCheckFunction()

    // Run the database setup
    const result = await setupDatabase()

    return result
  } catch (error) {
    console.error("Error in runDatabaseSetup:", error)
    return { success: false, error: String(error) }
  }
}
