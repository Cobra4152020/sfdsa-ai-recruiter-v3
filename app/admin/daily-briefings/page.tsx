"use client"

import { useState, useEffect } from "react"
import { useToast } from "@/components/ui/use-toast"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AdminAuthCheck } from "@/components/admin/admin-auth-check"
import type { DailyBriefing } from "@/lib/daily-briefing-service"
import { ThemeIcon, getThemeColor } from "@/components/daily-briefing/theme-icon"
import { createClient } from "@/lib/supabase-clients"
import { AlertCircle, Check, Clock, Edit, Plus, Trash } from "lucide-react"

export default function AdminDailyBriefingsPage() {
  return (
    <AdminAuthCheck>
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-6">Manage Daily Briefings</h1>
        <BriefingManager />
      </div>
    </AdminAuthCheck>
  )
}

function BriefingManager() {
  const [briefings, setBriefings] = useState<DailyBriefing[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedBriefing, setSelectedBriefing] = useState<DailyBriefing | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isAdding, setIsAdding] = useState(false)

  // Form state
  const [formDate, setFormDate] = useState<string>("")
  const [formTheme, setFormTheme] = useState<string>("duty")
  const [formQuote, setFormQuote] = useState<string>("")
  const [formQuoteAuthor, setFormQuoteAuthor] = useState<string>("")
  const [formSgtKenTake, setFormSgtKenTake] = useState<string>("")
  const [formCallToAction, setFormCallToAction] = useState<string>("")
  const [formActive, setFormActive] = useState<boolean>(true)

  const { toast } = useToast()

  useEffect(() => {
    fetchBriefings()
  }, [])

  // Set form values when a briefing is selected for editing
  useEffect(() => {
    if (selectedBriefing && isEditing) {
      setFormDate(selectedBriefing.date)
      setFormTheme(selectedBriefing.theme)
      setFormQuote(selectedBriefing.quote)
      setFormQuoteAuthor(selectedBriefing.quote_author || "")
      setFormSgtKenTake(selectedBriefing.sgt_ken_take)
      setFormCallToAction(selectedBriefing.call_to_action)
      setFormActive(selectedBriefing.active)
    }
  }, [selectedBriefing, isEditing])

  // Reset form when adding new briefing
  useEffect(() => {
    if (isAdding) {
      const today = new Date().toISOString().split("T")[0]
      setFormDate(today)
      setFormTheme("duty")
      setFormQuote("")
      setFormQuoteAuthor("")
      setFormSgtKenTake("")
      setFormCallToAction("")
      setFormActive(true)
    }
  }, [isAdding])

  const fetchBriefings = async () => {
    try {
      setLoading(true)

      const supabase = createClient()
      const { data, error } = await supabase
        .from("daily_briefings")
        .select("*")
        .order("date", { ascending: false })
        .limit(30)

      if (error) {
        throw error
      }

      setBriefings(data || [])
    } catch (error) {
      console.error("Error fetching briefings:", error)
      toast({
        title: "Error",
        description: "Failed to fetch briefings",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (briefing: DailyBriefing) => {
    setSelectedBriefing(briefing)
    setIsEditing(true)
    setIsAdding(false)
  }

  const handleAdd = () => {
    setSelectedBriefing(null)
    setIsEditing(false)
    setIsAdding(true)
  }

  const handleSave = async () => {
    try {
      if (!formDate || !formTheme || !formQuote || !formSgtKenTake || !formCallToAction) {
        toast({
          title: "Validation Error",
          description: "Please fill in all required fields",
          variant: "destructive",
        })
        return
      }

      const supabase = createClient()

      if (isEditing && selectedBriefing) {
        // Update existing briefing
        const { error } = await supabase
          .from("daily_briefings")
          .update({
            date: formDate,
            theme: formTheme,
            quote: formQuote,
            quote_author: formQuoteAuthor || null,
            sgt_ken_take: formSgtKenTake,
            call_to_action: formCallToAction,
            active: formActive,
          })
          .eq("id", selectedBriefing.id)

        if (error) throw error

        toast({
          title: "Success",
          description: "Briefing updated successfully",
        })
      } else if (isAdding) {
        // Insert new briefing
        const { error } = await supabase.from("daily_briefings").insert({
          date: formDate,
          theme: formTheme,
          quote: formQuote,
          quote_author: formQuoteAuthor || null,
          sgt_ken_take: formSgtKenTake,
          call_to_action: formCallToAction,
          active: formActive,
        })

        if (error) throw error

        toast({
          title: "Success",
          description: "New briefing created successfully",
        })
      }

      // Reset state and refresh data
      setIsEditing(false)
      setIsAdding(false)
      setSelectedBriefing(null)
      fetchBriefings()
    } catch (error) {
      console.error("Error saving briefing:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save briefing",
        variant: "destructive",
      })
    }
  }

  const handleDelete = async (briefing: DailyBriefing) => {
    if (!confirm(`Are you sure you want to delete the briefing for ${briefing.date}?`)) {
      return
    }

    try {
      const supabase = createClient()
      const { error } = await supabase.from("daily_briefings").delete().eq("id", briefing.id)

      if (error) throw error

      toast({
        title: "Success",
        description: "Briefing deleted successfully",
      })

      fetchBriefings()
    } catch (error) {
      console.error("Error deleting briefing:", error)
      toast({
        title: "Error",
        description: "Failed to delete briefing",
        variant: "destructive",
      })
    }
  }

  const handleCancel = () => {
    setIsEditing(false)
    setIsAdding(false)
    setSelectedBriefing(null)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <div className="space-y-6">
      {/* Control buttons */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">
          {loading ? "Loading briefings..." : `${briefings.length} briefings found`}
        </h2>
        <Button onClick={handleAdd} disabled={isEditing || isAdding}>
          <Plus className="h-4 w-4 mr-2" />
          Add New Briefing
        </Button>
      </div>

      {/* Edit/Add Form */}
      {(isEditing || isAdding) && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>{isEditing ? `Edit Briefing for ${formatDate(formDate)}` : "Create New Briefing"}</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Date</label>
                  <Input type="date" value={formDate} onChange={(e) => setFormDate(e.target.value)} />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Theme</label>
                  <Select value={formTheme} onValueChange={setFormTheme}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select theme" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="duty">Duty</SelectItem>
                      <SelectItem value="courage">Courage</SelectItem>
                      <SelectItem value="respect">Respect</SelectItem>
                      <SelectItem value="service">Service</SelectItem>
                      <SelectItem value="leadership">Leadership</SelectItem>
                      <SelectItem value="resilience">Resilience</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Quote</label>
                <Textarea
                  value={formQuote}
                  onChange={(e) => setFormQuote(e.target.value)}
                  placeholder="Enter the quote"
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Quote Author</label>
                <Input
                  value={formQuoteAuthor}
                  onChange={(e) => setFormQuoteAuthor(e.target.value)}
                  placeholder="Enter the quote author (optional)"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Sgt. Ken's Take</label>
                <Textarea
                  value={formSgtKenTake}
                  onChange={(e) => setFormSgtKenTake(e.target.value)}
                  placeholder="Enter Sgt. Ken's take on the quote"
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Call to Action</label>
                <Textarea
                  value={formCallToAction}
                  onChange={(e) => setFormCallToAction(e.target.value)}
                  placeholder="Enter the call to action"
                  rows={3}
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="active"
                  checked={formActive}
                  onChange={(e) => setFormActive(e.target.checked)}
                />
                <label htmlFor="active" className="text-sm font-medium">
                  Active (visible to users)
                </label>
              </div>

              <div className="flex justify-end space-x-4 pt-4">
                <Button variant="outline" onClick={handleCancel}>
                  Cancel
                </Button>
                <Button onClick={handleSave}>{isEditing ? "Update Briefing" : "Create Briefing"}</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Briefings Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Theme</TableHead>
                <TableHead className="hidden md:table-cell">Quote</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    <div className="flex items-center justify-center">
                      <Clock className="h-5 w-5 animate-spin mr-2" />
                      Loading briefings...
                    </div>
                  </TableCell>
                </TableRow>
              ) : briefings.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    <div className="flex flex-col items-center justify-center text-gray-500">
                      <AlertCircle className="h-8 w-8 mb-2" />
                      <p>No briefings found</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                briefings.map((briefing) => {
                  const themeColors = getThemeColor(briefing.theme)

                  return (
                    <TableRow key={briefing.id}>
                      <TableCell>{formatDate(briefing.date)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <ThemeIcon theme={briefing.theme} size={16} className={themeColors.text} />
                          <span className="capitalize">{briefing.theme}</span>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell max-w-[300px] truncate">{briefing.quote}</TableCell>
                      <TableCell className="text-center">
                        {briefing.active ? (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            <Check className="h-3 w-3 mr-1" />
                            Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            Inactive
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(briefing)}
                            disabled={isEditing || isAdding}
                          >
                            <Edit className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-600 border-red-600 hover:bg-red-50"
                            onClick={() => handleDelete(briefing)}
                            disabled={isEditing || isAdding}
                          >
                            <Trash className="h-4 w-4" />
                            <span className="sr-only">Delete</span>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
