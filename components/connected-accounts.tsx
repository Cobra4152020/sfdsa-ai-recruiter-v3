"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useToast } from "@/components/ui/use-toast"
import { authService } from "@/lib/unified-auth-service-client"
import type { SocialProvider } from "@/lib/unified-auth-service"
import { AlertCircle } from "lucide-react"
import { SocialLoginButtons } from "@/components/social-login-buttons"

interface ConnectedAccountsProps {
  userId: string
}

export function ConnectedAccounts({ userId }: ConnectedAccountsProps) {
  const [connectedProviders, setConnectedProviders] = useState<SocialProvider[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [unlinking, setUnlinking] = useState<SocialProvider | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    const fetchConnectedProviders = async () => {
      try {
        // getUserProfile is not available on the client; skip fetching
        setConnectedProviders([])
      } catch (err) {
        console.error("Error fetching connected providers:", err)
        setError("Failed to load connected accounts")
      } finally {
        setIsLoading(false)
      }
    }

    fetchConnectedProviders()
  }, [userId])

  const handleUnlink = async (provider: SocialProvider) => {
    setUnlinking(provider)
    setError(null)

    // Unlink is not available on the client; show error
    setTimeout(() => {
      setError("Unlinking social accounts is only available on the server or via support.")
      setUnlinking(null)
    }, 500)
  }

  const getProviderName = (provider: SocialProvider): string => {
    switch (provider) {
      case "google":
        return "Google"
      case "facebook":
        return "Facebook"
      case "twitter":
        return "Twitter"
      case "github":
        return "GitHub"
      default:
        return provider
    }
  }

  const getProviderIcon = (provider: SocialProvider) => {
    switch (provider) {
      case "google":
        return (
          <svg className="h-5 w-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
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
        )
      case "facebook":
        return (
          <svg
            className="h-5 w-5 text-[#1877F2]"
            fill="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M9.198 21.5h4v-8.01h3.604l.396-3.98h-4V7.5a1 1 0 0 1 1-1h3v-4h-3a5 5 0 0 0-5 5v2.01h-2l-.396 3.98h2.396v8.01Z" />
          </svg>
        )
      case "twitter":
        return (
          <svg
            className="h-5 w-5 text-[#1DA1F2]"
            fill="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M22 5.897c-.75.33-1.5.577-2.333.66A4.4 4.4 0 0 0 21.5 4.33c-.833.495-1.75.825-2.667 1.01C18.167 4.65 17 4 15.667 4c-2.5 0-4.55 2.047-4.55 4.547 0 .357.33.7.1 1.035-3.8-.193-7.15-2.017-9.4-4.81-.417.717-.633 1.542-.633 2.417 0 1.575.8 2.967 2.017 3.782a4.473 4.473 0 0 1-2.067-.572v.055c0 2.2 1.567 4.028 3.617 4.448a4.5 4.5 0 0 1-2.067.08c.583 1.815 2.25 3.12 4.233 3.157-1.55 1.213-3.5 1.936-5.617 1.936-.367 0-.733-.023-1.083-.067C4.2 20.607 6.417 21.33 8.867 21.33c8.233 0 12.733-6.83 12.733-12.748 0-.193-.005-.393-.013-.588A9.03 9.03 0 0 0 24 5.897h-2Z" />
          </svg>
        )
      case "github":
        return (
          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.167 6.839 9.49.5.09.682-.217.682-.48 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.268 2.75 1.026A9.578 9.578 0 0 1 12 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.026 2.747-1.026.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.577.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
          </svg>
        )
      default:
        return null
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Connected Accounts</CardTitle>
        <CardDescription>Manage your connected social accounts</CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {isLoading ? (
          <div className="space-y-2">
            <div className="h-12 bg-gray-100 animate-pulse rounded-md"></div>
            <div className="h-12 bg-gray-100 animate-pulse rounded-md"></div>
            <div className="h-12 bg-gray-100 animate-pulse rounded-md"></div>
          </div>
        ) : (
          <div className="space-y-4">
            {connectedProviders.length === 0 ? (
              <p className="text-sm text-gray-500">No social accounts connected.</p>
            ) : (
              connectedProviders.map((provider) => (
                <div key={provider} className="flex items-center justify-between p-3 border rounded-md">
                  <div className="flex items-center space-x-3">
                    {getProviderIcon(provider)}
                    <div>
                      <p className="font-medium">{getProviderName(provider)}</p>
                      <p className="text-xs text-gray-500">Connected</p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleUnlink(provider)}
                    disabled={unlinking === provider}
                  >
                    {unlinking === provider ? (
                      <span className="flex items-center">
                        <span className="animate-spin mr-1">⟳</span>
                        Unlinking...
                      </span>
                    ) : (
                      "Disconnect"
                    )}
                  </Button>
                </div>
              ))
            )}

            <div className="mt-4">
              <h4 className="text-sm font-medium mb-2">Connect more accounts</h4>
              <SocialLoginButtons />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
