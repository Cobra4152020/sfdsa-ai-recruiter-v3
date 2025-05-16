"use client"

import type React from "react"

import { useState } from "react"
import { getClientSideSupabase } from "@/lib/supabase-client-safe"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"

export default function CreateBriefingPage() {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [theme, setTheme] = useState("")
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()
  const router = useRouter()
  const supabase = getClientSideSupabase()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!title || !content) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    try {
      setLoading(true)

      // Get the current date in YYYY-MM-DD format
      const today = new Date().toISOString().split("T")[0]

      // Insert the new briefing - this will respect RLS policies
      const { error } = await supabase.from("daily_briefings").insert({
        title,
        content,
        theme: theme || "General",
        date: today,
      })

      if (error) {
        if (error.code === "PGRST301") {
          toast({
            title: "Permission denied",
            description: "You do not have permission to create briefings. Please contact an administrator.",
            variant: "destructive",
          })
        } else {
          throw error
        }
        return
      }

      toast({
        title: "Briefing created",
        description: "Your daily briefing has been created successfully",
      })

      // Redirect to the dashboard
      router.push("/admin/secure-dashboard")
    } catch (err) {
      console.error("Error creating briefing:", err)
      toast({
        title: "Error",
        description: "Failed to create the daily briefing",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-8 text-[#0A3C1F]">Create Daily Briefing</h1>

      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>New Daily Briefing</CardTitle>
          <CardDescription>Create a new daily briefing for deputies</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter briefing title"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="theme">Theme</Label>
              <Input
                id="theme"
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                placeholder="Enter briefing theme (optional)"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Content (HTML supported)</Label>
              <Textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Enter briefing content"
                rows={10}
                required
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Creating..." : "Create Briefing"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
