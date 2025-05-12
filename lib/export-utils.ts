export function exportToCSV(data: Record<string, any>[], filename: string) {
  if (!data || data.length === 0) return

  // Get headers from the first object
  const headers = Object.keys(data[0])

  // Create CSV content
  const csvContent = [
    headers.join(","), // Header row
    ...data.map((row) =>
      headers
        .map((header) => {
          // Handle values that need quotes (contain commas, quotes, or newlines)
          const value = row[header] === null || row[header] === undefined ? "" : String(row[header])
          const needsQuotes = value.includes(",") || value.includes('"') || value.includes("\n")

          if (needsQuotes) {
            // Escape quotes by doubling them
            return `"${value.replace(/"/g, '""')}"`
          }

          return value
        })
        .join(","),
    ),
  ].join("\n")

  // Create a blob and download link
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")

  link.setAttribute("href", url)
  link.setAttribute("download", `${filename}_${new Date().toISOString().split("T")[0]}.csv`)
  link.style.display = "none"

  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
