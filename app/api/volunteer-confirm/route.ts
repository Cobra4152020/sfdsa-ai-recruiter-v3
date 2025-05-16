export const dynamic = 'force-static';
export const revalidate = 3600; // Revalidate every hour;

import { NextResponse } from "next/server"

interface TokenData {
  id: string;
  token: string;
  email: string;
  type: string;
  expires_at: string;
  used_at: string | null;
}

// Generate all possible combinations at build time
export function generateStaticParams() {
  // Generate params for test tokens and some mock real tokens
  const tokens = [
    'test-token-1',
    'test-token-2',
    'test-token-3',
    'mock-token-1',
    'mock-token-2',
    'mock-token-3'
  ];
  
  return tokens.map(token => ({ token }));
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const token = searchParams.get("token")
    const isTest = searchParams.get("test") === "true"

    // For test requests, just return a success response
    if (isTest) {
      return NextResponse.json({
        success: true,
        message: "Test endpoint is working",
        source: 'static'
      })
    }

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          message: "No confirmation token provided",
          source: 'static'
        },
        { status: 400 },
      )
    }

    // For static generation, we'll return mock data based on the token
    const mockData = getMockTokenData(token)

    if (!mockData) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid or expired confirmation token",
          source: 'static'
        },
        { status: 400 },
      )
    }

    // Check if token is expired
    if (new Date(mockData.expires_at) < new Date()) {
      return NextResponse.json(
        {
          success: false,
          message: "Confirmation token has expired. Please register again.",
          source: 'static'
        },
        { status: 400 },
      )
    }

    // Check if token is already used
    if (mockData.used_at) {
      return NextResponse.json(
        {
          success: false,
          message: "This email has already been confirmed",
          source: 'static'
        },
        { status: 400 },
      )
    }

    return NextResponse.json({
      success: true,
      message: "Your email has been confirmed successfully. You can now log in to your volunteer recruiter account.",
      email: mockData.email,
      source: 'static'
    })
  } catch (error) {
    console.error("Error in volunteer confirm API:", error)
    return NextResponse.json(
      {
        success: false,
        message: "An unexpected error occurred while confirming your email",
        source: 'error'
      },
      { status: 500 },
    )
  }
}

function getMockTokenData(token: string): TokenData | null {
  // Mock data for test tokens
  const mockTokens: Record<string, TokenData> = {
    'test-token-1': {
      id: '1',
      token: 'test-token-1',
      email: 'test1@example.com',
      type: 'volunteer_recruiter',
      expires_at: new Date(Date.now() + 86400000).toISOString(), // Expires in 24 hours
      used_at: null
    },
    'test-token-2': {
      id: '2',
      token: 'test-token-2',
      email: 'test2@example.com',
      type: 'volunteer_recruiter',
      expires_at: new Date(Date.now() - 86400000).toISOString(), // Expired 24 hours ago
      used_at: null
    },
    'test-token-3': {
      id: '3',
      token: 'test-token-3',
      email: 'test3@example.com',
      type: 'volunteer_recruiter',
      expires_at: new Date(Date.now() + 86400000).toISOString(),
      used_at: new Date().toISOString() // Already used
    },
    'mock-token-1': {
      id: '4',
      token: 'mock-token-1',
      email: 'volunteer1@example.com',
      type: 'volunteer_recruiter',
      expires_at: new Date(Date.now() + 86400000).toISOString(),
      used_at: null
    },
    'mock-token-2': {
      id: '5',
      token: 'mock-token-2',
      email: 'volunteer2@example.com',
      type: 'volunteer_recruiter',
      expires_at: new Date(Date.now() + 86400000).toISOString(),
      used_at: null
    },
    'mock-token-3': {
      id: '6',
      token: 'mock-token-3',
      email: 'volunteer3@example.com',
      type: 'volunteer_recruiter',
      expires_at: new Date(Date.now() + 86400000).toISOString(),
      used_at: null
    }
  };

  return mockTokens[token] || null;
}
