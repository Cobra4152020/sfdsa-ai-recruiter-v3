"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ImprovedHeader } from "@/components/improved-header"
import { ImprovedFooter } from "@/components/improved-footer"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/components/ui/use-toast"
import { getSupabaseClient } from "@/lib/supabase-core"
import { Loader2, ArrowLeft } from "lucide-react"
import { useUser } from "@/context/user-context"

export default function EditProfilePage() {
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    bio: "",
    militaryService: "",
    lawEnforcementExperience: "",
    educationLevel: "",
    preferredContact: "email",
  })

  const router = useRouter()
  const { toast } = useToast()
  const supabase = getSupabaseClient()
  const { currentUser, setCurrentUser } = useUser()

  useEffect(() => {
    const checkAuth = async () => {
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

        // Populate form data
        setFormData({
          firstName: profile?.first_name || session.user.user_metadata?.first_name || "",
          lastName: profile?.last_name || session.user.user_metadata?.last_name || "",
          email: session.user.email || "",
          phone: profile?.phone || "",
          address: profile?.address || "",
          city: profile?.city || "",
          state: profile?.state || "",
          zipCode: profile?.zip_code || "",
          bio: profile?.bio || "",
          militaryService: profile?.military_service || "",
          lawEnforcementExperience: profile?.law_enforcement_experience || "",
          educationLevel: profile?.education_level || "",
          preferredContact: profile?.preferred_contact || "email",
        })
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
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    try {
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession()
      if (sessionError) throw sessionError
      if (!session) throw new Error("No active session")

      const userId = session.user.id

      // Update user metadata
      const { error: updateError } = await supabase.auth.updateUser({
        data: {
          first_name: formData.firstName,
          last_name: formData.lastName,
        },
      })

      if (updateError) throw updateError

      // Check if profile exists
      const { data: existingProfile, error: checkError } = await supabase
        .from("user_profiles")
        .select("user_id")
        .eq("user_id", userId)
        .maybeSingle()

      if (checkError) throw checkError

      // Upsert profile data
      const { error: upsertError } = await supabase.from("user_profiles").upsert({
        user_id: userId,
        first_name: formData.firstName,
        last_name: formData.lastName,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        zip_code: formData.zipCode,
        bio: formData.bio,
        military_service: formData.militaryService,
        law_enforcement_experience: formData.lawEnforcementExperience,
        education_level: formData.educationLevel,
        preferred_contact: formData.preferredContact,
        updated_at: new Date().toISOString(),
      })

      if (upsertError) throw upsertError

      // Update context
      setCurrentUser((prev) => ({
        ...prev,
        firstName: formData.firstName,
        lastName: formData.lastName,
      }))

      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      })

      // Redirect to dashboard
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
      <>
        <ImprovedHeader showOptInForm={() => {}} />
        <main className="container mx-auto px-4 py-8">
          <div className="flex items-center mb-6">
            <Skeleton className="h-8 w-8 mr-2" />
            <Skeleton className="h-8 w-48" />
          </div>

          <Skeleton className="h-[600px] w-full max-w-2xl mx-auto" />
        </main>
        <ImprovedFooter />
      </>
    )
  }

  return (
    <>
      <ImprovedHeader showOptInForm={() => {}} />
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center mb-6">
          <Button variant="ghost" onClick={() => router.push("/dashboard")} className="mr-2">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-3xl font-bold text-[#0A3C1F]">Edit Profile</h1>
        </div>

        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>Update your profile information</CardDescription>
          </CardHeader>
          <CardContent>
            <form id="profile-form" onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" name="firstName" value={formData.firstName} onChange={handleChange} required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" name="lastName" value={formData.lastName} onChange={handleChange} required />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" name="email" value={formData.email} onChange={handleChange} disabled />
                  <p className="text-xs text-gray-500">Contact support to change your email address</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" name="phone" value={formData.phone} onChange={handleChange} />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input id="address" name="address" value={formData.address} onChange={handleChange} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input id="city" name="city" value={formData.city} onChange={handleChange} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="state">State</Label>
                  <Input id="state" name="state" value={formData.state} onChange={handleChange} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="zipCode">ZIP Code</Label>
                  <Input id="zipCode" name="zipCode" value={formData.zipCode} onChange={handleChange} />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Tell us a bit about yourself"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="militaryService">Military Service</Label>
                  <Input
                    id="militaryService"
                    name="militaryService"
                    value={formData.militaryService}
                    onChange={handleChange}
                    placeholder="Branch and years of service"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lawEnforcementExperience">Law Enforcement Experience</Label>
                  <Input
                    id="lawEnforcementExperience"
                    name="lawEnforcementExperience"
                    value={formData.lawEnforcementExperience}
                    onChange={handleChange}
                    placeholder="Previous experience if any"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="educationLevel">Education Level</Label>
                  <Select
                    value={formData.educationLevel}
                    onValueChange={(value) => handleSelectChange("educationLevel", value)}
                  >
                    <SelectTrigger id="educationLevel">
                      <SelectValue placeholder="Select education level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high_school">High School</SelectItem>
                      <SelectItem value="some_college">Some College</SelectItem>
                      <SelectItem value="associates">Associate's Degree</SelectItem>
                      <SelectItem value="bachelors">Bachelor's Degree</SelectItem>
                      <SelectItem value="masters">Master's Degree</SelectItem>
                      <SelectItem value="doctorate">Doctorate</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="preferredContact">Preferred Contact Method</Label>
                  <Select
                    value={formData.preferredContact}
                    onValueChange={(value) => handleSelectChange("preferredContact", value)}
                  >
                    <SelectTrigger id="preferredContact">
                      <SelectValue placeholder="Select contact method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="phone">Phone</SelectItem>
                      <SelectItem value="text">Text Message</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => router.push("/dashboard")}>
              Cancel
            </Button>
            <Button
              type="submit"
              form="profile-form"
              className="bg-[#0A3C1F] hover:bg-[#0A3C1F]/90"
              disabled={isSaving}
            >
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </CardFooter>
        </Card>
      </main>
      <ImprovedFooter />
    </>
  )
}
