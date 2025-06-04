"use client";

import { PageWrapper } from "@/components/page-wrapper";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Award, Trophy, Star, Shield } from "lucide-react";

export default function BadgesPage() {
  return (
    <PageWrapper>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold text-[#0A3C1F] mb-4">
              Badge Gallery
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Earn badges by completing challenges, participating in events, and
              contributing to the SFDSA community. Track your progress and
              compete with other recruits.
            </p>
          </div>

          <Tabs defaultValue="all" className="space-y-6">
            <TabsList className="grid grid-cols-4 gap-4">
              <TabsTrigger value="all" className="flex items-center">
                <Award className="h-4 w-4 mr-2" />
                All Badges
              </TabsTrigger>
              <TabsTrigger value="achievements" className="flex items-center">
                <Trophy className="h-4 w-4 mr-2" />
                Achievements
              </TabsTrigger>
              <TabsTrigger value="special" className="flex items-center">
                <Star className="h-4 w-4 mr-2" />
                Special
              </TabsTrigger>
              <TabsTrigger value="process" className="flex items-center">
                <Shield className="h-4 w-4 mr-2" />
                Process
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Badge cards will be dynamically populated */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Award className="h-5 w-5 mr-2 text-[#FFD700]" />
                      First Response
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600">
                      Awarded for your first interaction with our platform.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="achievements">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Achievement badges will be dynamically populated */}
              </div>
            </TabsContent>

            <TabsContent value="special">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Special badges will be dynamically populated */}
              </div>
            </TabsContent>

            <TabsContent value="process">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Process badges will be dynamically populated */}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </PageWrapper>
  );
}
