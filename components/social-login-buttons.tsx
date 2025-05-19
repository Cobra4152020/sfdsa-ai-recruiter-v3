"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { authService } from "@/lib/unified-auth-service-client"
import { useToast } from "@/components/ui/use-toast"
import type { Provider } from "@supabase/supabase-js"

interface SocialLoginButtonsProps {
  onLoginStart?: () => void
  className?: string
}

export function SocialLoginButtons({ onLoginStart, className = "" }: SocialLoginButtonsProps) {
  const [isLoading, setIsLoading] = useState<Provider | null>(null)
  const { toast } = useToast()

  const handleSocialLogin = async (provider: Provider) => {
    setIsLoading(provider)
    onLoginStart?.()

    try {
      const result = await authService.signInWithSocialProvider(provider)

      if (result.success && result.redirectUrl) {
        // Redirect to the provider's OAuth page
        window.location.href = result.redirectUrl
      } else {
        toast({
          variant: "destructive",
          title: "Authentication failed",
          description: result.message,
        })
        setIsLoading(null)
      }
    } catch (error) {
      console.error(`${provider} login error:`, error)
      toast({
        variant: "destructive",
        title: "Authentication failed",
        description: error instanceof Error ? error.message : "Failed to authenticate",
      })
      setIsLoading(null)
    }
  }

  return (
    <div className={`space-y-3 ${className}`}>
      <Button
        type="button"
        variant="outline"
        className="w-full flex items-center justify-center bg-white hover:bg-gray-50 text-black"
        onClick={() => handleSocialLogin("google")}
        disabled={isLoading !== null}
      >
        {isLoading === "google" ? (
          <span className="flex items-center">
            <span className="animate-spin mr-2">⟳</span>
            Connecting...
          </span>
        ) : (
          <>
            <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Continue with Google
          </>
        )}
      </Button>

      <Button
        type="button"
        variant="outline"
        className="w-full flex items-center justify-center bg-[#1877F2] hover:bg-[#1877F2]/90 text-white"
        onClick={() => handleSocialLogin("facebook")}
        disabled={isLoading !== null}
      >
        {isLoading === "facebook" ? (
          <span className="flex items-center">
            <span className="animate-spin mr-2">⟳</span>
            Connecting...
          </span>
        ) : (
          <>
            <svg className="mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M9.198 21.5h4v-8.01h3.604l.396-3.98h-4V7.5a1 1 0 0 1 1-1h3v-4h-3a5 5 0 0 0-5 5v2.01h-2l-.396 3.98h2.396v8.01Z" />
            </svg>
            Continue with Facebook
          </>
        )}
      </Button>

      <Button
        type="button"
        variant="outline"
        className="w-full flex items-center justify-center bg-[#1DA1F2] hover:bg-[#1DA1F2]/90 text-white"
        onClick={() => handleSocialLogin("twitter")}
        disabled={isLoading !== null}
      >
        {isLoading === "twitter" ? (
          <span className="flex items-center">
            <span className="animate-spin mr-2">⟳</span>
            Connecting...
          </span>
        ) : (
          <>
            <svg className="mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M22 5.897c-.75.33-1.5.577-2.333.66A4.4 4.4 0 0 0 21.5 4.33c-.833.495-1.75.825-2.667 1.01C18.167 4.65 17 4 15.667 4c-2.5 0-4.55 2.047-4.55 4.547 0 .357.33.7.1 1.035-3.8-.193-7.15-2.017-9.4-4.81-.417.717-.633 1.542-.633 2.417 0 1.575.8 2.967 2.017 3.782a4.473 4.473 0 0 1-2.067-.572v.055c0 2.2 1.567 4.028 3.617 4.448a4.5 4.5 0 0 1-2.067.08c.583 1.815 2.25 3.12 4.233 3.157-1.55 1.213-3.5 1.936-5.617 1.936-.367 0-.733-.023-1.083-.067C4.2 20.607 6.417 21.33 8.867 21.33c8.233 0 12.733-6.83 12.733-12.748 0-.193-.005-.393-.013-.588A9.03 9.03 0 0 0 24 5.897h-2Z" />
            </svg>
            Continue with Twitter
          </>
        )}
      </Button>
    </div>
  )
}
