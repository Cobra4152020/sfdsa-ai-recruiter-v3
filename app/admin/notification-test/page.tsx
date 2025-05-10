"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { useUserContext } from "@/context/user-context"

export default function NotificationTestPage() {
  const { user } = useUserContext()
  const { toast } = useToast()
  const [title, setTitle] = useState("")
  const [message, setMessage] = useState("")
  const [type, setType] = useState("system")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user?.id) {
      toast({
        title: "Error",
        description: "You must be logged in to send notifications",
        variant: "destructive",
      })
      return
    }

    if (!title || !message) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch("/api/notifications/test", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.id,
          title,
          message,
          type,
        }),
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Success",
          description: "Test notification sent successfully",
        })

        // Reset form
        setTitle("")
        setMessage("")
        setType("system")
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to send test notification",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error sending test notification:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>Notification System Test</CardTitle>
          <CardDescription>Use this form to test the real-time notification system</CardDescription>
        </CardHeader>
        <CardContent>
          {!user ? (
            <div className="text-center py-6">
              <p className="text-gray-500 dark:text-gray-400">You must be logged in to test notifications</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Notification Title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter notification title"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Notification Message</Label>
                <Textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Enter notification message"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Notification Type</Label>
                <Select value={type} onValueChange={setType}>
                  <SelectTrigger id="type">
                    <SelectValue placeholder="Select notification type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="system">System</SelectItem>
                    <SelectItem value="badge">Badge</SelectItem>
                    <SelectItem value="donation">Donation</SelectItem>
                    <SelectItem value="achievement">Achievement</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? "Sending..." : "Send Test Notification"}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
