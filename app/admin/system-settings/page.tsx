"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"

interface SystemSetting {
  key: string
  value: string
  description: string
  updated_at: string
}

// Static mock data for export build
const STATIC_SETTINGS: SystemSetting[] = [
  {
    key: "SITE_NAME",
    value: "SFDSA AI Recruiter",
    description: "The name of the site displayed in various locations",
    updated_at: new Date().toISOString()
  },
  {
    key: "CONTACT_EMAIL",
    value: "contact@sfdeputysheriff.com",
    description: "Primary contact email for the application",
    updated_at: new Date().toISOString()
  },
  {
    key: "MAINTENANCE_MODE",
    value: "false",
    description: "Toggle maintenance mode for the application",
    updated_at: new Date().toISOString()
  },
  {
    key: "DAILY_BRIEFING_TIME",
    value: "09:00",
    description: "Time when daily briefings are published",
    updated_at: new Date().toISOString()
  }
];

export default function SystemSettingsPage() {
  const [settings, setSettings] = useState<SystemSetting[]>([])
  const [loading, setLoading] = useState(true)
  const [newKey, setNewKey] = useState("")
  const [newValue, setNewValue] = useState("")
  const [newDescription, setNewDescription] = useState("")

  useEffect(() => {
    fetchSettings()
  }, [])

  async function fetchSettings() {
    try {
      setLoading(true)
      
      // Use static data for export build
      if (process.env.NEXT_PUBLIC_GITHUB_PAGES === "true") {
        setSettings(STATIC_SETTINGS)
        return
      }

      const response = await fetch("/api/admin/system-settings")
      if (!response.ok) throw new Error("Failed to fetch settings")

      const data = await response.json()
      setSettings(data.settings)
    } catch (error) {
      console.error("Error fetching settings:", error)
      toast({
        title: "Error",
        description: "Failed to load system settings",
        variant: "destructive",
      })
      // Fallback to static data on error
      setSettings(STATIC_SETTINGS)
    } finally {
      setLoading(false)
    }
  }

  async function saveSetting(setting: SystemSetting) {
    try {
      // In export build, just update the state
      if (process.env.NEXT_PUBLIC_GITHUB_PAGES === "true") {
        setSettings(settings.map(s => s.key === setting.key ? setting : s))
        toast({
          title: "Success",
          description: `Setting "${setting.key}" saved successfully (Demo Mode)`,
        })
        return
      }

      const response = await fetch("/api/admin/system-settings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(setting),
      })

      if (!response.ok) throw new Error("Failed to save setting")

      toast({
        title: "Success",
        description: `Setting "${setting.key}" saved successfully`,
      })

      fetchSettings()
    } catch (error) {
      console.error("Error saving setting:", error)
      toast({
        title: "Error",
        description: "Failed to save setting",
        variant: "destructive",
      })
    }
  }

  async function deleteSetting(key: string) {
    try {
      // In export build, just update the state
      if (process.env.NEXT_PUBLIC_GITHUB_PAGES === "true") {
        setSettings(settings.filter(s => s.key !== key))
        toast({
          title: "Success",
          description: `Setting "${key}" deleted successfully (Demo Mode)`,
        })
        return
      }

      const response = await fetch(`/api/admin/system-settings?key=${key}`, {
        method: "DELETE",
      })

      if (!response.ok) throw new Error("Failed to delete setting")

      toast({
        title: "Success",
        description: `Setting "${key}" deleted successfully`,
      })

      fetchSettings()
    } catch (error) {
      console.error("Error deleting setting:", error)
      toast({
        title: "Error",
        description: "Failed to delete setting",
        variant: "destructive",
      })
    }
  }

  function handleAddSetting() {
    if (!newKey || !newValue) {
      toast({
        title: "Error",
        description: "Key and value are required",
        variant: "destructive",
      })
      return
    }

    const newSetting: SystemSetting = {
      key: newKey,
      value: newValue,
      description: newDescription,
      updated_at: new Date().toISOString(),
    }

    // In export build, just add to state
    if (process.env.NEXT_PUBLIC_GITHUB_PAGES === "true") {
      setSettings([...settings, newSetting])
      toast({
        title: "Success",
        description: `Setting "${newKey}" added successfully (Demo Mode)`,
      })
    } else {
      saveSetting(newSetting)
    }

    setNewKey("")
    setNewValue("")
    setNewDescription("")
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">System Settings</h1>

      {process.env.NEXT_PUBLIC_GITHUB_PAGES === "true" && (
        <Card className="mb-8 bg-yellow-50">
          <CardHeader>
            <CardTitle>Demo Mode</CardTitle>
            <CardDescription>
              This is a demo version with mock data. Changes will not persist after page refresh.
            </CardDescription>
          </CardHeader>
        </Card>
      )}

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Add New Setting</CardTitle>
          <CardDescription>Create a new system setting</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <Label htmlFor="key">Key</Label>
              <Input id="key" value={newKey} onChange={(e) => setNewKey(e.target.value)} placeholder="SETTING_KEY" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="value">Value</Label>
              <Input
                id="value"
                value={newValue}
                onChange={(e) => setNewValue(e.target.value)}
                placeholder="Setting value"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                placeholder="Optional description"
              />
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleAddSetting}>Add Setting</Button>
        </CardFooter>
      </Card>

      <h2 className="text-2xl font-bold mb-4">Current Settings</h2>

      {loading ? (
        <p>Loading settings...</p>
      ) : settings.length === 0 ? (
        <p>No settings found</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {settings.map((setting) => (
            <Card key={setting.key}>
              <CardHeader>
                <CardTitle>{setting.key}</CardTitle>
                <CardDescription>{setting.description || "No description"}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label htmlFor={`value-${setting.key}`}>Value</Label>
                  <Input
                    id={`value-${setting.key}`}
                    value={setting.value}
                    onChange={(e) => {
                      const updatedSettings = settings.map((s) =>
                        s.key === setting.key ? { ...s, value: e.target.value } : s,
                      )
                      setSettings(updatedSettings)
                    }}
                  />
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  Last updated: {new Date(setting.updated_at).toLocaleString()}
                </p>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={() => deleteSetting(setting.key)}>
                  Delete
                </Button>
                <Button onClick={() => saveSetting(setting)}>Save</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
