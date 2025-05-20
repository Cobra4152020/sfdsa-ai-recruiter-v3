"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/components/ui/use-toast"
import { ArrowLeft, Save } from "lucide-react"

export default function EditProfilePage() {
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    bio: "",
    military_experience: "none",
    law_enforcement_experience: "none",
    education_level: "high_school",
  })

  const router = useRouter()
  const { toast } = useToast()
  const [supabase, setSupabase] = useState(null)
  const [currentUser, setCurrentUser] = useState(null)

  useEffect(() => {
    const loadClientModules = async () => {
      const { getClientSideSupabase } = require("@/lib/supabase")
      const { useUser } = require("@/context/user-context")
      const supabaseInstance = getClientSideSupabase()
      const { currentUser, setCurrentUser } = useUser()
      setSupabase(supabaseInstance)
      setCurrentUser(currentUser)
    }
    loadClientModules()
  }, [])

  useEffect(() => {
    const checkAuth = async () => {
      if (!supabase) return
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession()

        if (error) throw error

        if (!session) {
          // Not authenticated, redirect to login
          router.push("/login")
          return
        }

        // Fetch user profile
        const { data: profile, error: profileError } = await supabase
          .from("user_profiles")
          .select("*")
          .eq("user_id", session.user.id)
          .single()

        if (profileError && profileError.code !== "PGRST116") {
          throw profileError
        }

        if (profile) {
          setFormData({
            first_name: profile.first_name || "",
            last_name: profile.last_name || "",
            email: session.user.email || "",
            phone: profile.phone || "",
            address: profile.address || "",
            city: profile.city || "",
            state: profile.state || "",
            zip: profile.zip || "",
            bio: profile.bio || "",
            military_experience: profile.military_experience || "none",
            law_enforcement_experience: profile.law_enforcement_experience || "none",
            education_level: profile.education_level || "high_school",
          })
        } else {
          setFormData({
            ...formData,
            first_name: session.user.user_metadata?.first_name || "",
            last_name: session.user.user_metadata?.last_name || "",
            email: session.user.email || "",
          })
        }
      } catch (error) {
        console.error("Auth check error:", error)
        toast({
          title: "Authentication error",
          description: error instanceof Error ? error.message : "Failed to authenticate user",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [router, toast, supabase])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!session) {
        router.push("/login")
        return
      }

      // Update user metadata
      const { error: metadataError } = await supabase.auth.updateUser({
        data: {
          first_name: formData.first_name,
          last_name: formData.last_name,
        },
      })

      if (metadataError) throw metadataError

      // Update profile in database
      const { error: profileError } = await supabase.from("user_profiles").upsert({
        user_id: session.user.id,
        first_name: formData.first_name,
        last_name: formData.last_name,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        zip: formData.zip,
        bio: formData.bio,
        military_experience: formData.military_experience,
        law_enforcement_experience: formData.law_enforcement_experience,
        education_level: formData.education_level,
        updated_at: new Date().toISOString(),
      })

      if (profileError) throw profileError

      // Update user context
      if (setCurrentUser && currentUser) {
        setCurrentUser({
          ...currentUser,
          name: `${formData.first_name} ${formData.last_name}`.trim(),
          first_name: formData.first_name,
          last_name: formData.last_name,
        })
      }

      toast({
        title: "Profile updated",
        description: "Your profile information has been saved successfully.",
      })

      // Redirect back to profile view
      router.push("/dashboard")
    } catch (error) {
      console.error("Profile update error:", error)
      toast({
        title: "Update failed",
        description: error instanceof Error ? error.message : "Failed to update profile",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <main className="container mx-auto px-4 py-8">
        <Skeleton className="h-8 w-64 mb-6" />
        <Skeleton className="h-[800px] w-full" />
      </main>
    )
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-6">
        <Button variant="ghost" onClick={() => router.push("/dashboard")} className="mr-2">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Edit Profile</CardTitle>
          <CardDescription>Update your personal information and preferences.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="first_name">First Name</Label>
                <Input
                  id="first_name"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="last_name">Last Name</Label>
                <Input
                  id="last_name"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" value={formData.email} onChange={handleChange} required disabled />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" name="phone" value={formData.phone} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input id="address" name="address" value={formData.address} onChange={handleChange} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input id="city" name="city" value={formData.city} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="state">State</Label>
                <Input id="state" name="state" value={formData.state} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="zip">ZIP Code</Label>
                <Input id="zip" name="zip" value={formData.zip} onChange={handleChange} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                rows={4}
                placeholder="Tell us about yourself..."
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="military_experience">Military Experience</Label>
                <Select
                  value={formData.military_experience}
                  onValueChange={(value) => handleSelectChange("military_experience", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select experience" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="active">Active Duty</SelectItem>
                    <SelectItem value="veteran">Veteran</SelectItem>
                    <SelectItem value="reserve">Reserve/National Guard</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="law_enforcement_experience">Law Enforcement Experience</Label>
                <Select
                  value={formData.law_enforcement_experience}
                  onValueChange={(value) => handleSelectChange("law_enforcement_experience", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select experience" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="sworn">Sworn Officer</SelectItem>
                    <SelectItem value="civilian">Civilian</SelectItem>
                    <SelectItem value="intern">Intern/Volunteer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="education_level">Education Level</Label>
                <Select
                  value={formData.education_level}
                  onValueChange={(value) => handleSelectChange("education_level", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select education" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high_school">High School</SelectItem>
                    <SelectItem value="associates">Associate's Degree</SelectItem>
                    <SelectItem value="bachelors">Bachelor's Degree</SelectItem>
                    <SelectItem value="masters">Master's Degree</SelectItem>
                    <SelectItem value="doctorate">Doctorate</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <CardFooter className="flex justify-end space-x-4">
              <Button variant="outline" onClick={() => router.push("/dashboard")}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSaving}>
                {isSaving ? "Saving..." : "Save Changes"}
                <Save className="h-4 w-4 ml-2" />
              </Button>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </main>
  )
}
