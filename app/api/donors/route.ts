import { NextResponse } from "next/server";
import { getServiceSupabase } from "@/app/lib/supabase/server";

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

// Reduced mock donors as fallback
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

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const timeframe = searchParams.get("timeframe") || "all";
    
    const supabase = getServiceSupabase();
    
    let query = supabase
      .from("donor_recognition_view")
      .select("*")
      .order("amount", { ascending: false });

    // Apply timeframe filter
    if (timeframe !== "all") {
      const now = new Date();
      const cutoffDate = new Date();

      if (timeframe === "month") {
        cutoffDate.setMonth(now.getMonth() - 1);
      } else if (timeframe === "year") {
        cutoffDate.setFullYear(now.getFullYear() - 1);
      }

      query = query.gte("donation_date", cutoffDate.toISOString());
    }

    const { data: donorData, error } = await query;

    if (error) {
      console.error("Error fetching donor data:", error);
      // Return fallback data on database error
      return NextResponse.json({
        donors: generateFallbackDonors(),
        source: "fallback",
        message: "Using fallback data due to database connection issue"
      });
    }

    // Transform database data to match component format
    const donors: Donor[] = (donorData || []).map((row: any) => ({
      id: row.id.toString(),
      name: row.name || "Anonymous Donor",
      amount: Number(row.amount),
      message: row.message || undefined,
      donation_date: row.donation_date,
      tier: row.tier || determineTier(Number(row.amount)),
      is_recurring: row.is_recurring || false,
      organization: row.organization || undefined
    }));

    // If no real donors, add a few fallback donors
    if (donors.length === 0) {
      return NextResponse.json({
        donors: generateFallbackDonors(),
        source: "fallback",
        message: "No donor data available, showing sample donors"
      });
    }

    // Mix real donors with a couple fallback ones for demonstration
    const fallbackDonors = generateFallbackDonors().slice(0, 2);
    const mixedDonors = [...donors, ...fallbackDonors];

    return NextResponse.json({
      donors: mixedDonors,
      source: "mixed",
      realDonorCount: donors.length,
      fallbackDonorCount: fallbackDonors.length
    });

  } catch (error) {
    console.error("Error in donor recognition API:", error);
    
    // Return fallback data on any error
    return NextResponse.json({
      donors: generateFallbackDonors(),
      source: "fallback",
      message: "Using fallback data due to server error"
    });
  }
}

function determineTier(amount: number): "benefactor" | "champion" | "supporter" | "friend" {
  if (amount >= 1000) return "benefactor";
  if (amount >= 500) return "champion";
  if (amount >= 100) return "supporter";
  return "friend";
} 