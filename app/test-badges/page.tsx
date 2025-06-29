"use client";

import { AchievementBadge } from "@/components/achievement-badge";
import { BadgeLegend } from "@/components/badge-legend";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function TestBadgesPage() {
  const achievementBadges = [
    { type: "written", name: "Written Test", description: "Document with A+ grade and pencil" },
    { type: "oral", name: "Oral Board", description: "Interview scene with two people" },
    { type: "physical", name: "Physical Test", description: "Blue dumbbells/weights" },
    { type: "polygraph", name: "Polygraph", description: "Computer with analytics/graph" },
    { type: "psychological", name: "Psychological", description: "Brain with medical cross" },
  ];

  const processBadges = [
    { type: "full", name: "Full Process", description: "Completed all preparation areas" },
    { type: "chat-participation", name: "Chat Participation", description: "Engaged with Sgt. Ken" },
    { type: "first-response", name: "First Response", description: "Received first response from Sgt. Ken" },
    { type: "application-started", name: "Application Started", description: "Started the application process" },
    { type: "application-completed", name: "Application Completed", description: "Completed the application process" },
  ];

  const participationBadges = [
    { type: "frequent-user", name: "Frequent User", description: "Regularly engages with the recruitment platform" },
    { type: "resource-downloader", name: "Resource Downloader", description: "Downloaded recruitment resources and materials" },
    { type: "hard-charger", name: "Hard Charger", description: "Show exceptional dedication and enthusiasm" },
  ];

  return (
    <div className="container mx-auto py-8 space-y-8">
      {/* Page Header */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-gray-900">Badge Image Test Page</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          🎉 <strong>ALL 13 BADGE IMAGES ARE NOW COMPLETE!</strong> Every badge should display with custom images.
        </p>
      </div>

      {/* Achievement Badge Tests */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            🎯 Achievement Badge Images (5/5 Complete)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {achievementBadges.map((badge) => (
              <div key={badge.type} className="text-center space-y-4">
                <div className="flex flex-col items-center space-y-2">
                  <h3 className="font-medium text-sm">{badge.name}</h3>
                  <p className="text-xs text-gray-500 mb-2">{badge.description}</p>
                </div>
                
                {/* Not Earned State */}
                <div className="space-y-2">
                  <p className="text-xs font-medium text-gray-600">Not Earned</p>
                  <AchievementBadge
                    type={badge.type as any}
                    size="lg"
                    earned={false}
                  />
                </div>
                
                {/* Earned State */}
                <div className="space-y-2">
                  <p className="text-xs font-medium text-green-600">Earned</p>
                  <AchievementBadge
                    type={badge.type as any}
                    size="lg"
                    earned={true}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Process Badge Tests */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            📋 Process Badge Images (5/5 Complete)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {processBadges.map((badge) => (
              <div key={badge.type} className="text-center space-y-4">
                <div className="flex flex-col items-center space-y-2">
                  <h3 className="font-medium text-sm">{badge.name}</h3>
                  <p className="text-xs text-gray-500 mb-2">{badge.description}</p>
                </div>
                
                {/* Not Earned State */}
                <div className="space-y-2">
                  <p className="text-xs font-medium text-gray-600">Not Earned</p>
                  <AchievementBadge
                    type={badge.type as any}
                    size="lg"
                    earned={false}
                  />
                </div>
                
                {/* Earned State */}
                <div className="space-y-2">
                  <p className="text-xs font-medium text-green-600">Earned</p>
                  <AchievementBadge
                    type={badge.type as any}
                    size="lg"
                    earned={true}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Participation Badge Tests */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            👥 Participation Badge Images (3/3 Complete)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {participationBadges.map((badge) => (
              <div key={badge.type} className="text-center space-y-4">
                <div className="flex flex-col items-center space-y-2">
                  <h3 className="font-medium text-sm">{badge.name}</h3>
                  <p className="text-xs text-gray-500 mb-2">{badge.description}</p>
                </div>
                
                {/* Not Earned State */}
                <div className="space-y-2">
                  <p className="text-xs font-medium text-gray-600">Not Earned</p>
                  <AchievementBadge
                    type={badge.type as any}
                    size="lg"
                    earned={false}
                  />
                </div>
                
                {/* Earned State */}
                <div className="space-y-2">
                  <p className="text-xs font-medium text-green-600">Earned</p>
                  <AchievementBadge
                    type={badge.type as any}
                    size="lg"
                    earned={true}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Different Sizes Test */}
      <Card>
        <CardHeader>
          <CardTitle>Badge Size Variations - All Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {["sm", "md", "lg", "xl"].map((size) => (
              <div key={size} className="space-y-2">
                <h4 className="font-medium capitalize">{size} Size</h4>
                <div className="flex items-center space-x-4 flex-wrap gap-2">
                  {/* Achievement */}
                  {achievementBadges.slice(0, 2).map((badge) => (
                    <AchievementBadge
                      key={`achievement-${badge.type}`}
                      type={badge.type as any}
                      size={size as any}
                      earned={true}
                    />
                  ))}
                  <div className="mx-2 text-gray-400">|</div>
                  {/* Process */}
                  {processBadges.slice(0, 2).map((badge) => (
                    <AchievementBadge
                      key={`process-${badge.type}`}
                      type={badge.type as any}
                      size={size as any}
                      earned={true}
                    />
                  ))}
                  <div className="mx-2 text-gray-400">|</div>
                  {/* Participation */}
                  {participationBadges.slice(0, 1).map((badge) => (
                    <AchievementBadge
                      key={`participation-${badge.type}`}
                      type={badge.type as any}
                      size={size as any}
                      earned={true}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Badge Legend Component Test */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Badge Legend Component</h2>
        <BadgeLegend />
      </div>

      {/* Final Status */}
      <Card className="bg-green-50 border-green-200">
        <CardHeader>
          <CardTitle className="text-green-800">🎉 COMPLETE! Badge Setup Status</CardTitle>
        </CardHeader>
        <CardContent className="text-green-700">
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">✅ ALL BADGE SETS COMPLETED:</h4>
              <ul className="list-disc list-inside space-y-1">
                <li>✅ <strong>Achievement Badges (5/5)</strong> - physical.png, psychological.png, oral.png, polygraph.png, written.png</li>
                <li>✅ <strong>Process Badges (5/5)</strong> - full.png, chat-participation.png, first-response.png, application-started.png, application-completed.png</li>
                <li>✅ <strong>Participation Badges (3/3)</strong> - frequent-user.png, resource-downloader.png, hard-charger.png</li>
              </ul>
            </div>

            <div className="pt-4 border-t border-green-200">
              <p><strong>🚀 Your Badge System is Complete!</strong></p>
              <ol className="list-decimal list-inside space-y-1 mt-2">
                <li>Visit <strong>http://localhost:3000/badges</strong> to see all badges with custom images</li>
                <li>Test different tabs: "All Badges", "Application", "Participation"</li>
                <li>All 13 badges should now display with beautiful custom 3D images!</li>
              </ol>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 