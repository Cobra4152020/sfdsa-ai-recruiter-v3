"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useToast } from "@/components/ui/use-toast"
import { Form } from "@/components/ui/form"
import { AlertCircle } from "lucide-react"
import { registerVolunteerRecruiter } from "@/app/actions/volunteer-registration"

// Form validation schema
const formSchema = z
  .object({
    firstName: z.string().min(2, "First name must be at least 2 characters"),
    lastName: z.string().min(2, "Last name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email address"),
    phone: z.string().min(10, "Please enter a valid phone number"),
    organization: z.string().optional(),
    position: z.string().optional(),
    location: z.string().min(2, "Please enter your location"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
    confirmPassword: z.string(),
    referralSource: z.string().optional(),
    agreeTerms: z.boolean().refine((val) => val === true, {
      message: "You must agree to the terms and conditions",
    }),
    agreePrivacy: z.boolean().refine((val) => val === true, {
      message: "You must agree to the privacy policy",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

type FormValues = z.infer<typeof formSchema>

interface VolunteerRegistrationFormProps {
  isSubmitting: boolean
  setIsSubmitting: (value: boolean) => void
}

export function VolunteerRegistrationForm({ isSubmitting, setIsSubmitting }: VolunteerRegistrationFormProps) {
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const { toast } = useToast()

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      organization: "",
      position: "",
      location: "",
      password: "",
      confirmPassword: "",
      referralSource: "",
      agreeTerms: false,
      agreePrivacy: false,
    },
  })

  async function onSubmit(data: FormValues) {
    setIsSubmitting(true)
    setError(null)

    try {
      const result = await registerVolunteerRecruiter({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        organization: data.organization || "",
        position: data.position || "",
        location: data.location,
        password: data.password,
        referralSource: data.referralSource || "",
      })

      if (result.error) {
        throw new Error(result.error)
      }

      toast({
        title: "Registration successful!",
        description: result.requiresConfirmation
          ? "Please check your email to confirm your account."
          : "Your volunteer recruiter account has been created. You can now log in.",
      })

      // Redirect to login page with confirmation message
      setTimeout(() => {
        router.push(result.requiresConfirmation ? "/volunteer-login?needsConfirmation=true" : "/volunteer-login")
      }, 1500)
    } catch (err) {
      console.error("Registration error:", err)
      setError(err instanceof Error ? err.message : "Failed to register. Please try again.")
      toast({
        title: "Registration failed",
        description: err instanceof Error ? err.message : "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md flex items-start">
            <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form fields remain the same */}
      </form>
    </Form>
  )
}
