"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { NotificationBell } from "@/components/notification-bell"
import { useUser } from "@/context/user-context"

export default function NotificationTestPage() {
  const { currentUser } = useUser()
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    type: "test",
    title: "Test Notification",
    message: "This is a test notification message.",
    actionUrl: "",
    imageUrl: "",
  })
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch("/api/notifications/test", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to create test notification")
      }

      toast({
        title: "Notification Created",
        description: "Test notification has been created successfully.",
      })
    } catch (error) {
      console.error("Error creating test notification:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create test notification",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (!currentUser) {
    return (
      <div className="container mx-auto py-10">
        <Card>
          <CardHeader>
            <CardTitle>Notification Test</CardTitle>
            <CardDescription>You must be logged in to use this feature.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Notification Test</h1>
        <NotificationBell userId={currentUser.id} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Create Test Notification</CardTitle>
          <CardDescription>Use this form to create test notifications for the current user.</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="type">Notification Type</Label>
              <Select value={formData.type} onValueChange={(value) => handleSelectChange("type", value)}>
                <SelectTrigger id="type">
                  <SelectValue placeholder="Select notification type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="test">Test</SelectItem>
                  <SelectItem value="badge">Badge</SelectItem>
                  <SelectItem value="donation">Donation</SelectItem>
                  <SelectItem value="achievement">Achievement</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Notification title"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Notification message"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="actionUrl">Action URL (optional)</Label>
              <Input
                id="actionUrl"
                name="actionUrl"
                value={formData.actionUrl}
                onChange={handleChange}
                placeholder="e.g., /badges"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="imageUrl">Image URL (optional)</Label>
              <Input
                id="imageUrl"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleChange}
                placeholder="e.g., /badge-icon.png"
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Creating..." : "Create Notification"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
