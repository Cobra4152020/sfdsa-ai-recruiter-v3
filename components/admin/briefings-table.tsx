"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2, Search, Eye, ChevronLeft, ChevronRight } from "lucide-react"
import { ThemeIcon } from "@/components/daily-briefing/theme-icon"
import { formatDate } from "@/lib/utils"
import type { DailyBriefing } from "@/lib/daily-briefing-service"
import { createBrowserClient } from "@/lib/supabase-browser"

export function BriefingsTable() {
  const [briefings, setBriefings] = useState<DailyBriefing[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const pageSize = 10

  const fetchBriefings = async () => {
    setLoading(true)
    setError(null)

    try {
      const supabase = createBrowserClient()

      let query = supabase.from("daily_briefings").select("*", { count: "exact" }).order("date", { ascending: false })

      // Apply search if provided
      if (searchTerm) {
        query = query.or(`quote.ilike.%${searchTerm}%,quote_author.ilike.%${searchTerm}%,theme.ilike.%${searchTerm}%`)
      }

      // Apply pagination
      const from = (page - 1) * pageSize
      const to = from + pageSize - 1

      const { data, error, count } = await query.range(from, to)

      if (error) {
        throw error
      }

      setBriefings(data || [])

      if (count !== null) {
        setTotalPages(Math.ceil(count / pageSize))
      }
    } catch (err) {
      console.error("Error fetching briefings:", err)
      setError("Failed to load briefings")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBriefings()
  }, [page, searchTerm])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setPage(1) // Reset to first page on new search
    fetchBriefings()
  }

  const handlePreviousPage = () => {
    if (page > 1) {
      setPage(page - 1)
    }
  }

  const handleNextPage = () => {
    if (page < totalPages) {
      setPage(page + 1)
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Manage Briefings</CardTitle>
        <CardDescription>View and manage Sgt. Ken's Daily Briefings.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSearch} className="flex space-x-2 mb-4">
          <Input
            placeholder="Search briefings..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
          <Button type="submit" variant="outline" size="icon">
            <Search className="h-4 w-4" />
          </Button>
        </form>

        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          </div>
        ) : error ? (
          <div className="text-center py-8 text-red-500">{error}</div>
        ) : briefings.length === 0 ? (
          <div className="text-center py-8 text-gray-500">No briefings found</div>
        ) : (
          <>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Theme</TableHead>
                    <TableHead className="hidden md:table-cell">Quote</TableHead>
                    <TableHead className="hidden md:table-cell">Author</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {briefings.map((briefing) => (
                    <TableRow key={briefing.id}>
                      <TableCell>{formatDate(new Date(briefing.date))}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <ThemeIcon theme={briefing.theme} size={16} />
                          <span className="capitalize">{briefing.theme}</span>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell max-w-xs truncate">"{briefing.quote}"</TableCell>
                      <TableCell className="hidden md:table-cell">{briefing.quote_author}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm" asChild>
                          <a href={`/daily-briefing?date=${briefing.date}`} target="_blank" rel="noreferrer">
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </a>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-gray-500">
                Page {page} of {totalPages}
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" onClick={handlePreviousPage} disabled={page <= 1}>
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Previous
                </Button>
                <Button variant="outline" size="sm" onClick={handleNextPage} disabled={page >= totalPages}>
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
