"use server"

import { createClient } from "@/lib/supabase-server"
import { revalidatePath } from "next/cache"

type BriefingImportResult = {
  success: boolean
  importedCount?: number
  errorCount?: number
  error?: string
  details?: string[]
}

export async function importDailyBriefings(csvUrl: string): Promise<BriefingImportResult> {
  try {
    console.log("Starting import of daily briefings from CSV:", csvUrl)

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
      throw new Error(
        `CSV is missing required columns. Found: ${headers.join(", ")}. Required: date, quote, author, sgt_ken_take, call_to_action`,
      )
    }

    // Function to determine theme based on content
    const inferTheme = (quote: string, sgtKenTake: string, author: string): string => {
      const combinedText = `${quote.toLowerCase()} ${sgtKenTake.toLowerCase()} ${author.toLowerCase()}`

      // Theme keywords mapping
      const themeKeywords = {
        duty: ["duty", "obligation", "responsibility", "commitment", "service", "honor"],
        courage: ["courage", "brave", "bravery", "fearless", "valor", "strength", "bold"],
        respect: ["respect", "honor", "dignity", "courtesy", "esteem", "regard", "admiration"],
        service: ["service", "serve", "help", "assist", "aid", "support", "community"],
        leadership: ["lead", "leader", "leadership", "guide", "direct", "inspire", "influence"],
        resilience: ["resilience", "endure", "persevere", "overcome", "adapt", "recover", "persist"],
      }

      // Check each theme's keywords
      for (const [theme, keywords] of Object.entries(themeKeywords)) {
        if (keywords.some((keyword) => combinedText.includes(keyword))) {
          return theme
        }
      }

      // Default to rotating themes based on row number
      const themes = ["duty", "courage", "respect", "service", "leadership", "resilience"]
      return themes[Math.floor(Math.random() * themes.length)]
    }

    // Process data rows
    const supabase = createClient()
    let importedCount = 0
    let errorCount = 0
    const errorDetails: string[] = []

    // Process CSV data in batches to avoid overwhelming the database
    const BATCH_SIZE = 50
    const batches = []
    let currentBatch = []

    // Skip header row (i=0)
    for (let i = 1; i < rows.length; i++) {
      const row = rows[i].trim()
      if (!row) continue // Skip empty rows

      // Parse CSV row, handling quoted fields that might contain commas
      const parseCSVRow = (row: string) => {
        const result = []
        let inQuotes = false
        let currentValue = ""

        for (let i = 0; i < row.length; i++) {
          const char = row[i]

          if (char === '"') {
            inQuotes = !inQuotes
          } else if (char === "," && !inQuotes) {
            result.push(currentValue)
            currentValue = ""
          } else {
            currentValue += char
          }
        }

        // Add the last value
        result.push(currentValue)

        // Clean up quotes
        return result.map((val) => val.replace(/^"|"$/g, "").trim())
      }

      const columns = parseCSVRow(row)

      if (columns.length <= Math.max(dateIndex, quoteIndex, authorIndex, sgtKenTakeIndex, callToActionIndex)) {
        errorCount++
        errorDetails.push(
          `Row ${i}: Not enough columns. Found ${columns.length}, needed at least ${Math.max(dateIndex, quoteIndex, authorIndex, sgtKenTakeIndex, callToActionIndex) + 1}`,
        )
        continue
      }

      const date = columns[dateIndex]
      const quote = columns[quoteIndex]
      const author = columns[authorIndex]
      const sgtKenTake = columns[sgtKenTakeIndex]
      const callToAction = columns[callToActionIndex]

      if (!date || !quote || !author || !sgtKenTake || !callToAction) {
        errorCount++
        errorDetails.push(`Row ${i}: Missing required fields`)
        continue
      }

      // Validate date format (YYYY-MM-DD)
      if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
        errorCount++
        errorDetails.push(`Row ${i}: Invalid date format. Expected YYYY-MM-DD, got ${date}`)
        continue
      }

      const theme = inferTheme(quote, sgtKenTake, author)

      currentBatch.push({
        date,
        theme,
        quote,
        quote_author: author,
        sgt_ken_take: sgtKenTake,
        call_to_action: callToAction,
        created_at: new Date().toISOString(),
        active: true,
      })

      if (currentBatch.length >= BATCH_SIZE) {
        batches.push([...currentBatch])
        currentBatch = []
      }
    }

    // Add the last batch if it has any items
    if (currentBatch.length > 0) {
      batches.push(currentBatch)
    }

    // Process batches
    for (const batch of batches) {
      try {
        const { error, count } = await supabase
          .from("daily_briefings")
          .upsert(batch, {
            onConflict: "date",
            ignoreDuplicates: false,
          })
          .select(null, { count: "exact" })

        if (error) {
          console.error("Error importing batch:", error)
          errorCount += batch.length
          errorDetails.push(`Batch error: ${error.message}`)
        } else {
          importedCount += count || 0
        }
      } catch (err) {
        console.error("Exception importing batch:", err)
        errorCount += batch.length
        errorDetails.push(`Batch exception: ${err instanceof Error ? err.message : String(err)}`)
      }
    }

    console.log(`Import completed: ${importedCount} briefings imported, ${errorCount} errors`)

    // Revalidate the daily briefing page
    revalidatePath("/daily-briefing")

    return {
      success: true,
      importedCount,
      errorCount,
      details: errorDetails.length > 0 ? errorDetails : undefined,
    }
  } catch (error) {
    console.error("Error importing daily briefings:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}
