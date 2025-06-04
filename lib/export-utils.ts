/**
 * Represents a single row of data that can be exported to CSV
 */
interface ExportableData {
  [key: string]: string | number | boolean | null | undefined;
}

/**
 * Configuration options for CSV export
 */
interface CSVOptions {
  /** Character to use as field delimiter (default: ",") */
  delimiter?: string;
  /** Whether to include headers in the CSV (default: true) */
  includeHeaders?: boolean;
  /** Format for date values in the CSV (default: "YYYY-MM-DD") */
  dateFormat?: string;
}

/**
 * Exports an array of objects to a CSV file and triggers a download
 * @param data Array of objects to export. Each object should have string keys with values that can be converted to strings
 * @param filename Base filename for the exported file (without extension)
 * @param options Optional configuration for CSV export
 * @returns void
 * @throws {Error} If data is empty or invalid
 */
export function exportToCSV(
  data: ExportableData[],
  filename: string,
  options: CSVOptions = {},
): void {
  if (!data || data.length === 0) {
    throw new Error("No data provided for CSV export");
  }

  const {
    delimiter = ",",
    includeHeaders = true,
    // dateFormat = "YYYY-MM-DD", // Commented out unused variable
  } = options;

  // Get headers from the first object
  const headers = Object.keys(data[0]);

  // Create CSV content
  const csvContent = [
    // Header row (optional)
    ...(includeHeaders ? [headers.join(delimiter)] : []),
    // Data rows
    ...data.map((row) =>
      headers
        .map((header) => {
          // Handle values that need quotes (contain delimiter, quotes, or newlines)
          const value =
            row[header] === null || row[header] === undefined
              ? ""
              : String(row[header]);
          const needsQuotes =
            value.includes(delimiter) ||
            value.includes('"') ||
            value.includes("\n");

          if (needsQuotes) {
            // Escape quotes by doubling them
            return `"${value.replace(/"/g, '""')}"`;
          }

          return value;
        })
        .join(delimiter),
    ),
  ].join("\n");

  // Create a blob and download link
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  // Format date for filename
  const now = new Date();
  const date = now.toISOString().split("T")[0];
  const formattedFilename = `${filename}_${date}.csv`;

  link.setAttribute("href", url);
  link.setAttribute("download", formattedFilename);
  link.style.display = "none";

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  // Clean up the URL object
  URL.revokeObjectURL(url);
}
