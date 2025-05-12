"use server"

import { createClient } from "@/lib/supabase-server"
import { revalidatePath } from "next/cache"

export async function importDailyBriefings(csvUrl: string) {
  try {
    console.log("Starting import of daily briefings from CSV")

    // Fetch the CSV data
    const response = await fetch(csvUrl)
    if (!response.ok) {
      throw new Error(`Failed to fetch CSV: ${response.statusText}`)
    }

    const csvText = await response.text()
    const rows = csvText.split("\n")

    // Parse header row to get column indices
    const headers = rows[0].split(",")
    const dateIndex = headers.findIndex((h) => h.trim().toLowerCase() === "date")
    const quoteIndex = headers.findIndex((h) => h.trim().toLowerCase() === "quote")
    const authorIndex = headers.findIndex((h) => h.trim().toLowerCase() === "author")
    const sgtKenTakeIndex = headers.findIndex((h) => h.trim().toLowerCase() === "sgt_ken_take")
    const callToActionIndex = headers.findIndex((h) => h.trim().toLowerCase() === "call_to_action")

    if (
      dateIndex === -1 ||
      quoteIndex === -1 ||
      authorIndex === -1 ||
      sgtKenTakeIndex === -1 ||
      callToActionIndex === -1
    ) {
      throw new Error("CSV is missing required columns")
    }

    // Function to determine theme based on content
    const inferTheme = (quote: string, sgtKenTake: string): string => {
      const lowerQuote = quote.toLowerCase()
      const lowerTake = sgtKenTake.toLowerCase()

      if (
        lowerQuote.includes("duty") ||
        lowerTake.includes("duty") ||
        lowerQuote.includes("obligation") ||
        lowerTake.includes("obligation")
      ) {
        return "duty"
      } else if (
        lowerQuote.includes("courage") ||
        lowerTake.includes("courage") ||
        lowerQuote.includes("brave") ||
        lowerTake.includes("brave")
      ) {
        return "courage"
      } else if (
        lowerQuote.includes("respect") ||
        lowerTake.includes("respect") ||
        lowerQuote.includes("honor") ||
        lowerTake.includes("honor")
      ) {
        return "respect"
      } else if (
        lowerQuote.includes("service") ||
        lowerTake.includes("service") ||
        lowerQuote.includes("serve") ||
        lowerTake.includes("serve")
      ) {
        return "service"
      } else if (
        lowerQuote.includes("lead") ||
        lowerTake.includes("lead") ||
        lowerQuote.includes("leader") ||
        lowerTake.includes("leader")
      ) {
        return "leadership"
      } else if (
        lowerQuote.includes("resilience") ||
        lowerTake.includes("resilience") ||
        lowerQuote.includes("strength") ||
        lowerTake.includes("strength")
      ) {
        return "resilience"
      }

      // Default to rotating themes based on row number
      const themes = ["duty", "courage", "respect", "service", "leadership", "resilience"]
      return themes[Math.floor(Math.random() * themes.length)]
    }

    // Process data rows
    const supabase = createClient()
    let importedCount = 0
    let errorCount = 0

    for (let i = 1; i < rows.length; i++) {
      if (!rows[i].trim()) continue // Skip empty rows

      const columns = rows[i].split(",")

      // Handle quoted fields that might contain commas
      const processedColumns = []
      let currentField = ""
      let inQuotes = false

      for (const col of columns) {
        if (inQuotes) {
          currentField += "," + col
          if (col.endsWith('"')) {
            inQuotes = false
            processedColumns.push(currentField.slice(1, -1)) // Remove quotes
            currentField = ""
          }
        } else {
          if (col.startsWith('"') && !col.endsWith('"')) {
            inQuotes = true
            currentField = col
          } else {
            processedColumns.push(col.replace(/^"|"$/g, "")) // Remove quotes if present
          }
        }
      }

      const date = processedColumns[dateIndex]?.trim()
      const quote = processedColumns[quoteIndex]?.trim()
      const author = processedColumns[authorIndex]?.trim()
      const sgtKenTake = processedColumns[sgtKenTakeIndex]?.trim()
      const callToAction = processedColumns[callToActionIndex]?.trim()

      if (!date || !quote || !sgtKenTake || !callToAction) {
        console.error(`Row ${i} is missing required fields`)
        errorCount++
        continue
      }

      const theme = inferTheme(quote, sgtKenTake)

      try {
        const { error } = await supabase.from("daily_briefings").upsert(
          {
            date,
            theme,
            quote,
            quote_author: author,
            sgt_ken_take: sgtKenTake,
            call_to_action: callToAction,
            created_at: new Date().toISOString(),
            active: true,
          },
          {
            onConflict: "date",
          },
        )

        if (error) {
          console.error(`Error importing row ${i}:`, error)
          errorCount++
        } else {
          importedCount++
        }
      } catch (err) {
        console.error(`Exception importing row ${i}:`, err)
        errorCount++
      }
    }

    console.log(`Import completed: ${importedCount} briefings imported, ${errorCount} errors`)

    // Revalidate the daily briefing page
    revalidatePath("/daily-briefing")

    return {
      success: true,
      importedCount,
      errorCount,
    }
  } catch (error) {
    console.error("Error importing daily briefings:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}
