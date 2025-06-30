"use client";

import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DonorTier } from "@/components/donor-tier";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Filter, Calendar, Heart, Info, Shield } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { isStaticBuild, safeApiFetch, handleStaticBuildError } from "@/lib/static-build-utils";

type Donor = {
  id: string;
  name: string;
  amount: number;
  message?: string;
  donation_date: string;
  tier: "benefactor" | "champion" | "supporter" | "friend";
  is_recurring: boolean;
  organization?: string;
};

export function DonorRecognitionWall() {
  const [donors, setDonors] = useState<Donor[]>([]);
  const [filteredDonors, setFilteredDonors] = useState<Donor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [timeframe, setTimeframe] = useState<"all" | "month" | "year">("all");
  const [showFilters, setShowFilters] = useState(false);
  const [dataSource, setDataSource] = useState<"live" | "mixed" | "fallback">("live");
  const [sourceInfo, setSourceInfo] = useState<{
    realDonorCount?: number;
    fallbackDonorCount?: number;
    message?: string;
  }>({});

  useEffect(() => {
    fetchDonors();
  }, []);

  useEffect(() => {
    filterDonors();
  }, [donors, searchTerm, timeframe]);

  async function fetchDonors() {
    setIsLoading(true);
    
    // Check if we're in a static build AND production - skip API calls
    const isStaticBuild = process.env.NEXT_PUBLIC_STATIC_BUILD === "true" && process.env.NODE_ENV === "production";
    
    if (isStaticBuild) {
      // Use fallback data for static builds
      const fallbackDonors = generateFallbackDonors();
      setDonors(fallbackDonors);
      setFilteredDonors(fallbackDonors);
      setDataSource("fallback");
      setSourceInfo({ message: "Using sample data for demonstration" });
      setIsLoading(false);
      return;
    }
    
    try {
      // Try to fetch from API first
      const response = await fetch(`/api/donors?timeframe=${timeframe}`);
      
      if (response.ok) {
        const data = await response.json();
        setDonors(data.donors || []);
        setFilteredDonors(data.donors || []);
        setDataSource(data.source || "live");
        setSourceInfo({
          realDonorCount: data.realDonorCount,
          fallbackDonorCount: data.fallbackDonorCount,
          message: data.message
        });
      } else {
        throw new Error('API response not ok');
      }
    } catch (error) {
      console.error("Error fetching donors:", error);
      // Fallback to reduced mock data
      const fallbackDonors = generateFallbackDonors();
      setDonors(fallbackDonors);
      setFilteredDonors(fallbackDonors);
      setDataSource("fallback");
      setSourceInfo({ message: "Using sample data - API connection unavailable" });
    } finally {
      setIsLoading(false);
    }
  }

  function filterDonors() {
    let result = [...donors];

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (donor) =>
          donor.name.toLowerCase().includes(term) ||
          (donor.message && donor.message.toLowerCase().includes(term)) ||
          (donor.organization &&
            donor.organization.toLowerCase().includes(term)),
      );
    }

    // Filter by timeframe
    if (timeframe !== "all") {
      const now = new Date();
      const cutoffDate = new Date();

      if (timeframe === "month") {
        cutoffDate.setMonth(now.getMonth() - 1);
      } else if (timeframe === "year") {
        cutoffDate.setFullYear(now.getFullYear() - 1);
      }

      result = result.filter(
        (donor) => new Date(donor.donation_date) >= cutoffDate,
      );
    }

    setFilteredDonors(result);
  }

  // Group donors by tier
  const benefactors = filteredDonors.filter(
    (donor) => donor.tier === "benefactor",
  );
  const champions = filteredDonors.filter((donor) => donor.tier === "champion");
  const supporters = filteredDonors.filter(
    (donor) => donor.tier === "supporter",
  );
  const friends = filteredDonors.filter((donor) => donor.tier === "friend");

  // Calculate total stats
  const totalAmount = filteredDonors.reduce((sum, donor) => sum + donor.amount, 0);
  const totalDonors = filteredDonors.length;
  const recurringDonors = filteredDonors.filter(donor => donor.is_recurring).length;

  return (
    <div className="space-y-8">
      {/* Header with enhanced design */}
      <div className="text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent mb-6">
          🏆 Donor Recognition Wall
        </h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-8">
          Recognizing the generous supporters who make our mission possible. 
          Every contribution, no matter the size, helps us build a stronger, safer San Francisco.
        </p>

        {/* Stats Dashboard */}
        <div className="bg-gradient-to-r from-primary/10 to-transparent border border-primary/20 rounded-lg p-6 mb-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold text-primary">{totalDonors}</div>
              <div className="text-sm text-gray-600 font-medium">Total Donors</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary">${totalAmount.toLocaleString()}</div>
              <div className="text-sm text-gray-600 font-medium">Total Donations</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary">{recurringDonors}</div>
              <div className="text-sm text-gray-600 font-medium">Recurring Donors</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary">${Math.round(totalAmount / (totalDonors || 1))}</div>
              <div className="text-sm text-gray-600 font-medium">Average Gift</div>
            </div>
          </div>
        </div>

        {/* Data Source Info */}
        {sourceInfo.message && (
          <Card className="bg-blue-50 border-blue-200 mb-8">
            <CardContent className="p-4">
              <div className="flex items-center justify-center">
                <Info className="h-4 w-4 text-blue-600 mr-2" />
                <span className="text-sm text-blue-800">{sourceInfo.message}</span>
                {dataSource === "mixed" && sourceInfo.realDonorCount && (
                  <Badge variant="outline" className="ml-2 text-blue-700 border-blue-300">
                    {sourceInfo.realDonorCount} real + {sourceInfo.fallbackDonorCount} sample
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search donors..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex gap-2 w-full md:w-auto">
          <Select
            value={timeframe}
            onValueChange={(value: "all" | "month" | "year") =>
              setTimeframe(value)
            }
          >
            <SelectTrigger className="w-full md:w-40">
              <Calendar className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Timeframe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Time</SelectItem>
              <SelectItem value="month">Past Month</SelectItem>
              <SelectItem value="year">Past Year</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
        </div>
      </div>

      {showFilters && (
        <div className="bg-muted p-4 rounded-lg border space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="min-amount">Minimum Amount</Label>
              <Input id="min-amount" type="number" placeholder="Min amount" />
            </div>
            <div>
              <Label htmlFor="max-amount">Maximum Amount</Label>
              <Input id="max-amount" type="number" placeholder="Max amount" />
            </div>
            <div>
              <Label htmlFor="recurring">Donation Type</Label>
              <Select defaultValue="all">
                <SelectTrigger id="recurring">
                  <SelectValue placeholder="Donation type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Donations</SelectItem>
                  <SelectItem value="one-time">One-time</SelectItem>
                  <SelectItem value="recurring">Recurring</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearchTerm("");
                setTimeframe("all");
                setShowFilters(false);
              }}
            >
              Reset Filters
            </Button>
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="space-y-8">
          <Skeleton className="h-8 w-64 mb-4" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Skeleton className="h-40" />
            <Skeleton className="h-40" />
            <Skeleton className="h-40" />
          </div>
          <Skeleton className="h-8 w-64 mb-4" />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
          </div>
        </div>
      ) : (
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="all">All Donors</TabsTrigger>
            <TabsTrigger value="benefactors">Benefactors</TabsTrigger>
            <TabsTrigger value="champions">Champions</TabsTrigger>
            <TabsTrigger value="supporters">Supporters</TabsTrigger>
            <TabsTrigger value="friends">Friends</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-8 pt-6">
            {benefactors.length > 0 && (
              <DonorTier
                title="Benefactors"
                description="Donors who have contributed $1,000 or more"
                donors={benefactors}
                tierColor="#FFD700"
                icon={<Heart className="h-5 w-5" />}
              />
            )}

            {champions.length > 0 && (
              <DonorTier
                title="Champions"
                description="Donors who have contributed $500-$999"
                donors={champions}
                tierColor="#C0C0C0"
                icon={<Heart className="h-5 w-5" />}
              />
            )}

            {supporters.length > 0 && (
              <DonorTier
                title="Supporters"
                description="Donors who have contributed $100-$499"
                donors={supporters}
                tierColor="#CD7F32"
                icon={<Heart className="h-5 w-5" />}
              />
            )}

            {friends.length > 0 && (
              <DonorTier
                title="Friends"
                description="Donors who have contributed up to $99"
                donors={friends}
                tierColor="#0A3C1F"
                icon={<Heart className="h-5 w-5" />}
              />
            )}

            {filteredDonors.length === 0 && (
              <div className="text-center py-12 bg-muted rounded-lg">
                <Heart className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-500">
                  No donors found
                </h3>
                <p className="text-gray-400 mt-2">
                  Try adjusting your search or filters
                </p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="benefactors" className="pt-6">
            {benefactors.length > 0 ? (
              <DonorTier
                title="Benefactors"
                description="Donors who have contributed $1,000 or more"
                donors={benefactors}
                tierColor="#FFD700"
                icon={<Heart className="h-5 w-5" />}
                showTitle={false}
              />
            ) : (
              <div className="text-center py-12 bg-muted rounded-lg">
                <Heart className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-500">
                  No benefactors found
                </h3>
                <p className="text-gray-400 mt-2">
                  Try adjusting your search or filters
                </p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="champions" className="pt-6">
            {champions.length > 0 ? (
              <DonorTier
                title="Champions"
                description="Donors who have contributed $500-$999"
                donors={champions}
                tierColor="#C0C0C0"
                icon={<Heart className="h-5 w-5" />}
                showTitle={false}
              />
            ) : (
              <div className="text-center py-12 bg-muted rounded-lg">
                <Heart className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-500">
                  No champions found
                </h3>
                <p className="text-gray-400 mt-2">
                  Try adjusting your search or filters
                </p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="supporters" className="pt-6">
            {supporters.length > 0 ? (
              <DonorTier
                title="Supporters"
                description="Donors who have contributed $100-$499"
                donors={supporters}
                tierColor="#CD7F32"
                icon={<Heart className="h-5 w-5" />}
                showTitle={false}
              />
            ) : (
              <div className="text-center py-12 bg-muted rounded-lg">
                <Heart className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-500">
                  No supporters found
                </h3>
                <p className="text-gray-400 mt-2">
                  Try adjusting your search or filters
                </p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="friends" className="pt-6">
            {friends.length > 0 ? (
              <DonorTier
                title="Friends"
                description="Donors who have contributed up to $99"
                donors={friends}
                tierColor="#0A3C1F"
                icon={<Heart className="h-5 w-5" />}
                showTitle={false}
              />
            ) : (
              <div className="text-center py-12 bg-muted rounded-lg">
                <Heart className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-500">
                  No friends found
                </h3>
                <p className="text-gray-400 mt-2">
                  Try adjusting your search or filters
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      )}

      <div className="bg-primary/5 p-6 rounded-lg mt-12">
        <h2 className="text-xl font-bold text-primary mb-4">
          Become a Recognized Donor
        </h2>
        <p className="text-gray-600 mb-4">
          Would you like to join our community of supporters? Your contribution,
          no matter the size, makes a difference in our mission to build a
          stronger, safer San Francisco.
        </p>
        <div className="flex justify-center mt-6">
          <Button
            className="bg-primary hover:bg-primary/90"
            size="lg"
            asChild
          >
            <a href="/donate">Make a Donation</a>
          </Button>
        </div>
      </div>

      <div className="text-center text-sm text-gray-500 mt-8">
        <p>
          Only donors who have given explicit permission are displayed on this
          page. If you&apos;ve made a donation and would like to be recognized
          (or removed), please contact us at{" "}
          <a
            href="mailto:donations@protectingsanfrancisco.com"
            className="text-primary hover:underline"
          >
            donations@protectingsanfrancisco.com
          </a>
          .
        </p>
      </div>
    </div>
  );
}

// Reduced fallback donors for when API is unavailable
function generateFallbackDonors(): Donor[] {
  const mockData = [
    {
      id: "mock-1",
      name: "San Francisco Community Foundation",
      amount: 2500,
      message: "Proud to support the Sheriff's Department and their community outreach.",
      donation_date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      tier: "benefactor" as const,
      is_recurring: false,
      organization: "San Francisco Community Foundation"
    },
    {
      id: "mock-2", 
      name: "Maria Rodriguez",
      amount: 750,
      message: "Thank you for your service to our community!",
      donation_date: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
      tier: "champion" as const,
      is_recurring: true
    },
    {
      id: "mock-3",
      name: "David Chen",
      amount: 250,
      message: "Keep up the great work protecting our city.",
      donation_date: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
      tier: "supporter" as const,
      is_recurring: false
    },
    {
      id: "mock-4",
      name: "Golden Gate Rotary Club",
      amount: 1500,
      donation_date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      tier: "benefactor" as const,
      is_recurring: false,
      organization: "Golden Gate Rotary Club"
    },
    {
      id: "mock-5",
      name: "Sarah Johnson",
      amount: 150,
      message: "Happy to contribute to this important cause.",
      donation_date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
      tier: "supporter" as const,
      is_recurring: true
    },
    {
      id: "mock-6",
      name: "Anonymous Donor",
      amount: 50,
      donation_date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      tier: "friend" as const,
      is_recurring: false
    },
    {
      id: "mock-7",
      name: "Bay Area Business Association",
      amount: 3000,
      message: "Supporting our local law enforcement heroes.",
      donation_date: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
      tier: "benefactor" as const,
      is_recurring: false,
      organization: "Bay Area Business Association"
    },
    {
      id: "mock-8",
      name: "Michael Wong",
      amount: 75,
      donation_date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      tier: "friend" as const,
      is_recurring: false
    }
  ];

  return mockData;
}

// Helper function to generate mock donors for demonstration
function generateMockDonors(): Donor[] {
  const tiers: Array<"benefactor" | "champion" | "supporter" | "friend"> = [
    "benefactor",
    "champion",
    "supporter",
    "friend",
  ];

  const organizations = [
    "San Francisco Community Foundation",
    "Bay Area Business Association",
    "Golden Gate Rotary Club",
    "Mission District Neighborhood Association",
    "SF Tech for Good",
  ];

  const messages = [
    "Proud to support the Sheriff&apos;s Department and their community outreach.",
    "In memory of my father who served in law enforcement for 30 years.",
    "Thank you for your service to our community!",
    "Keep up the great work protecting our city.",
    "Happy to contribute to this important cause.",
  ];

  const names = [
    "John Smith",
    "Maria Rodriguez",
    "David Chen",
    "Sarah Johnson",
    "Michael Wong",
    "Emily Davis",
    "James Wilson",
    "Sophia Garcia",
    "Robert Taylor",
    "Olivia Martinez",
    "William Lee",
    "Emma Thompson",
    "Anonymous Donor",
  ];

  // Generate 50 random donors
  return Array.from({ length: 50 }, (_, i) => {
    const tier = tiers[Math.floor(Math.random() * tiers.length)];
    let amount: number;

    switch (tier) {
      case "benefactor":
        amount = Math.floor(Math.random() * 4000) + 1000; // $1000-$5000
        break;
      case "champion":
        amount = Math.floor(Math.random() * 500) + 500; // $500-$999
        break;
      case "supporter":
        amount = Math.floor(Math.random() * 400) + 100; // $100-$499
        break;
      case "friend":
      default:
        amount = Math.floor(Math.random() * 90) + 10; // $10-$99
        break;
    }

    // Generate a random date within the past 2 years
    const today = new Date();
    const twoYearsAgo = new Date();
    twoYearsAgo.setFullYear(today.getFullYear() - 2);
    const randomTimestamp =
      twoYearsAgo.getTime() +
      Math.random() * (today.getTime() - twoYearsAgo.getTime());
    const randomDate = new Date(randomTimestamp);

    // 30% chance of being an organization
    const isOrganization = Math.random() < 0.3;

    // 70% chance of having a message
    const hasMessage = Math.random() < 0.7;

    // 20% chance of being a recurring donor
    const isRecurring = Math.random() < 0.2;

    return {
      id: `donor-${i + 1}`,
      name: isOrganization
        ? organizations[Math.floor(Math.random() * organizations.length)]
        : names[Math.floor(Math.random() * names.length)],
      amount,
      message: hasMessage
        ? messages[Math.floor(Math.random() * messages.length)]
        : undefined,
      donation_date: randomDate.toISOString(),
      tier,
      is_recurring: isRecurring,
      organization: isOrganization
        ? undefined
        : Math.random() < 0.2
          ? organizations[Math.floor(Math.random() * organizations.length)]
          : undefined,
    };
  });
}
