export const dynamic = 'force-static';
export const revalidate = 3600; // Revalidate every hour;

import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase-service"

interface DonationSummary {
  totalDonations: number;
  totalDonors: number;
  averageDonation: number;
  recentDonations: {
    id: string;
    amount: number;
    donor: string;
    date: string;
    cause: string;
  }[];
  byMonth: {
    month: string;
    total: number;
    count: number;
  }[];
  byCause: {
    cause: string;
    total: number;
    count: number;
  }[];
}

// Generate static paths for common parameter combinations
export function generateStaticParams() {
  const timeframes = ['week', 'month', 'year', 'all'];
  const causes = ['education', 'community', 'equipment', 'training', 'all'];
  
  return timeframes.flatMap(timeframe => 
    causes.map(cause => ({
      timeframe,
      cause
    }))
  );
}

// Mock donation data
const mockDonationSummary: DonationSummary = {
  totalDonations: 125000,
  totalDonors: 450,
  averageDonation: 277.78,
  recentDonations: [
    {
      id: "d1",
      amount: 500,
      donor: "John Smith",
      date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      cause: "education"
    },
    {
      id: "d2",
      amount: 1000,
      donor: "Maria Garcia",
      date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      cause: "community"
    },
    {
      id: "d3",
      amount: 250,
      donor: "David Lee",
      date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      cause: "equipment"
    }
  ],
  byMonth: [
    {
      month: "2024-01",
      total: 45000,
      count: 150
    },
    {
      month: "2023-12",
      total: 35000,
      count: 120
    },
    {
      month: "2023-11",
      total: 25000,
      count: 100
    },
    {
      month: "2023-10",
      total: 20000,
      count: 80
    }
  ],
  byCause: [
    {
      cause: "education",
      total: 50000,
      count: 180
    },
    {
      cause: "community",
      total: 35000,
      count: 120
    },
    {
      cause: "equipment",
      total: 25000,
      count: 100
    },
    {
      cause: "training",
      total: 15000,
      count: 50
    }
  ]
};

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const timeframe = searchParams.get("timeframe") || "all"
    const cause = searchParams.get("cause") || "all"

    // For static generation, we'll return the mock data
    // In a real app, you would filter the data based on timeframe and cause
    return NextResponse.json({
      success: true,
      summary: mockDonationSummary,
      source: 'static'
    })
  } catch (error) {
    console.error("Error in donation summary API:", error)
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Unknown error",
        source: 'error'
      },
      { status: 500 }
    )
  }
}
