"use client";

import { CustomLockIcon } from "@/components/ui/custom-lock-icon";
import { RippleBackground, GridBackground } from "@/components/ui/grid-background";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, AlertCircle, RefreshCw } from "lucide-react";

export default function TestLockIconsPage() {
  return (
    <RippleBackground variant="hero" className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-4">🎉 Lock Icons & Grid Ripples Fixed!</h1>
            <div className="flex flex-wrap gap-2 justify-center">
              <Badge variant="default" className="bg-green-600 text-white">
                <CheckCircle className="h-4 w-4 mr-1" />
                Custom Lock Icons Working
              </Badge>
              <Badge variant="default" className="bg-blue-600 text-white">
                <CheckCircle className="h-4 w-4 mr-1" />
                Grid Ripples Restored
              </Badge>
              <Badge variant="default" className="bg-purple-600 text-white">
                <CheckCircle className="h-4 w-4 mr-1" />
                Auth Error Handling Added
              </Badge>
            </div>
          </div>

          {/* Grid Background Examples */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="relative overflow-hidden">
              <GridBackground variant="subtle" color="primary" size="sm" opacity={0.3} />
              <CardHeader className="relative z-10">
                <CardTitle className="text-center">Subtle Grid</CardTitle>
              </CardHeader>
              <CardContent className="relative z-10 text-center">
                <p className="text-sm text-muted-foreground">Primary color, small size</p>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden">
              <GridBackground variant="prominent" color="secondary" size="md" opacity={0.4} />
              <CardHeader className="relative z-10">
                <CardTitle className="text-center">Prominent Grid</CardTitle>
              </CardHeader>
              <CardContent className="relative z-10 text-center">
                <p className="text-sm text-muted-foreground">Secondary color, medium size</p>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden">
              <GridBackground variant="animated" color="muted" size="lg" opacity={0.2} />
              <CardHeader className="relative z-10">
                <CardTitle className="text-center">Animated Grid</CardTitle>
              </CardHeader>
              <CardContent className="relative z-10 text-center">
                <p className="text-sm text-muted-foreground">Muted color, large size, pulsing</p>
              </CardContent>
            </Card>
          </div>
          
          {/* Lock Icons Test Grid */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Custom Lock Icons Test</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-6">
                
                {/* Locked Icons */}
                <div className="text-center">
                  <div className="flex justify-center items-center py-8 bg-muted rounded-lg mb-2">
                    <CustomLockIcon size="sm" />
                  </div>
                  <p className="text-xs font-medium">Locked - Small</p>
                </div>

                <div className="text-center">
                  <div className="flex justify-center items-center py-8 bg-muted rounded-lg mb-2">
                    <CustomLockIcon size="md" />
                  </div>
                  <p className="text-xs font-medium">Locked - Medium</p>
                </div>

                <div className="text-center">
                  <div className="flex justify-center items-center py-8 bg-muted rounded-lg mb-2">
                    <CustomLockIcon size="lg" />
                  </div>
                  <p className="text-xs font-medium">Locked - Large</p>
                </div>

                <div className="text-center">
                  <div className="flex justify-center items-center py-8 bg-muted rounded-lg mb-2">
                    <CustomLockIcon size="xl" />
                  </div>
                  <p className="text-xs font-medium">Locked - XL</p>
                </div>

                {/* Unlocked Icons */}
                <div className="text-center">
                  <div className="flex justify-center items-center py-8 bg-green-50 rounded-lg mb-2">
                    <CustomLockIcon size="sm" unlocked={true} />
                  </div>
                  <p className="text-xs font-medium">Unlocked - Small</p>
                </div>

                <div className="text-center">
                  <div className="flex justify-center items-center py-8 bg-green-50 rounded-lg mb-2">
                    <CustomLockIcon size="md" unlocked={true} />
                  </div>
                  <p className="text-xs font-medium">Unlocked - Medium</p>
                </div>

                <div className="text-center">
                  <div className="flex justify-center items-center py-8 bg-green-50 rounded-lg mb-2">
                    <CustomLockIcon size="lg" unlocked={true} />
                  </div>
                  <p className="text-xs font-medium">Unlocked - Large</p>
                </div>

                <div className="text-center">
                  <div className="flex justify-center items-center py-8 bg-green-50 rounded-lg mb-2">
                    <CustomLockIcon size="xl" unlocked={true} />
                  </div>
                  <p className="text-xs font-medium">Unlocked - XL</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Implementation Status */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                Implementation Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <h4 className="font-semibold text-green-800 mb-2">✅ Fixed Issues</h4>
                  <ul className="text-sm text-green-700 space-y-1">
                    <li>• AuthApiError: Invalid Refresh Token - Auto-recovery implemented</li>
                    <li>• Grid ripples missing - RippleBackground component restored</li>
                    <li>• Custom lock icons integrated across platform</li>
                    <li>• Global error handling for auth issues</li>
                  </ul>
                </div>
                
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="font-semibold text-blue-800 mb-2">🔧 Components Updated</h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Hero Section - Using RippleBackground</li>
                    <li>• Popular Locked Benefits - Custom lock icons</li>
                    <li>• Deputy Roadmap - Custom lock icons</li>
                    <li>• Auth Required Wrapper - Custom lock icons</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Auth Recovery Test */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <RefreshCw className="h-5 w-5 text-blue-600" />
                Auth Recovery System
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                The auth recovery system now automatically handles invalid refresh token errors:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg text-center">
                  <AlertCircle className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                  <h4 className="font-semibold text-orange-800">Detection</h4>
                  <p className="text-sm text-orange-700">Automatically detects auth errors</p>
                </div>
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg text-center">
                  <RefreshCw className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <h4 className="font-semibold text-blue-800">Cleanup</h4>
                  <p className="text-sm text-blue-700">Clears corrupted tokens</p>
                </div>
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-center">
                  <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <h4 className="font-semibold text-green-800">Recovery</h4>
                  <p className="text-sm text-green-700">Refreshes session automatically</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </RippleBackground>
  );
} 