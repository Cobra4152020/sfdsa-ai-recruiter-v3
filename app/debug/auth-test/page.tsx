"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { supabase } from "@/lib/supabase-client-singleton"
import { ImprovedHeader } from "@/components/improved-header"
import { ImprovedFooter } from "@/components/improved-footer"

export default function AuthTestPage() {
  const [sessionData, setSessionData] = useState<any>(null)
  const [userInfo, setUserInfo] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkSession()
  }, [])

  async function checkSession() {
    try {
      setLoading(true)
      setError(null)

      const { data, error } = await supabase.auth.getSession()

      if (error) throw error

      setSessionData(data.session)

      if (data.session?.user) {
        setUserInfo(data.session.user)
      }
    } catch (err) {
      console.error("Session check error:", err)
      setError(err instanceof Error ? err.message : "Failed to check session")
    } finally {
      setLoading(false)
    }
  }

  async function handleSignOut() {
    try {
      setLoading(true)
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      setSessionData(null)
      setUserInfo(null)
    } catch (err) {
      console.error("Sign out error:", err)
      setError(err instanceof Error ? err.message : "Failed to sign out")
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <ImprovedHeader />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-[#0A3C1F]">Authentication Diagnostic Tool</CardTitle>
              <CardDescription>
                Use this tool to check your authentication status and troubleshoot login issues
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {loading ? (
                <div className="text-center py-4">
                  <div
                    className="animate-spin inline-block w-6 h-6 border-2 border-current border-t-transparent text-[#0A3C1F] rounded-full"
                    aria-hidden="true"
                  ></div>
                  <p className="mt-2">Checking authentication status...</p>
                </div>
              ) : (
                <>
                  {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md">
                      <h3 className="font-medium">Error</h3>
                      <p>{error}</p>
                    </div>
                  )}

                  <div className="bg-gray-50 p-4 rounded-md">
                    <h3 className="font-medium mb-2">Session Status</h3>
                    <p className="mb-2">
                      {sessionData ? (
                        <span className="text-green-600 font-medium">✓ Authenticated</span>
                      ) : (
                        <span className="text-red-600 font-medium">✗ Not authenticated</span>
                      )}
                    </p>

                    {sessionData && (
                      <div className="mt-4">
                        <p className="text-sm text-gray-500">
                          Session expires at: {new Date(sessionData.expires_at * 1000).toLocaleString()}
                        </p>
                      </div>
                    )}
                  </div>

                  {userInfo && (
                    <div className="bg-gray-50 p-4 rounded-md">
                      <h3 className="font-medium mb-2">User Information</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-500">User ID</p>
                          <p className="font-mono text-xs break-all">{userInfo.id}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Email</p>
                          <p>{userInfo.email}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Email Verified</p>
                          <p>{userInfo.email_confirmed_at ? "Yes" : "No"}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Last Sign In</p>
                          <p>
                            {userInfo.last_sign_in_at ? new Date(userInfo.last_sign_in_at).toLocaleString() : "N/A"}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex space-x-4">
                    <Button onClick={checkSession} variant="outline">
                      Refresh Status
                    </Button>

                    {sessionData && (
                      <Button onClick={handleSignOut} variant="destructive">
                        Sign Out
                      </Button>
                    )}

                    {!sessionData && (
                      <Button
                        onClick={() => (window.location.href = "/login")}
                        className="bg-[#0A3C1F] hover:bg-[#0A3C1F]/90"
                      >
                        Go to Login
                      </Button>
                    )}
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-[#0A3C1F]">Troubleshooting Tips</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-medium">Common Issues</h3>
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  <li>Session expired or missing</li>
                  <li>Cookies blocked by browser settings</li>
                  <li>Incorrect redirect URLs</li>
                  <li>Multiple browser tabs causing session conflicts</li>
                </ul>
              </div>

              <div>
                <h3 className="font-medium">Try These Solutions</h3>
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  <li>Clear your browser cookies and cache</li>
                  <li>Try using a private/incognito window</li>
                  <li>Ensure third-party cookies are enabled</li>
                  <li>Request a new password reset link if needed</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <ImprovedFooter />
    </>
  )
}
