export const dynamic = 'force-static';
export const revalidate = 3600; // Revalidate every hour

import { NextResponse } from "next/server"

interface EmailConfig {
  provider: string;
  region: string;
  fromAddress: string;
  replyToAddress: string;
  templateDirectory: string;
  maxRetries: number;
  rateLimitPerMinute: number;
  isConfigured: boolean;
}

interface EmailDiagnostics {
  config: EmailConfig;
  status: {
    isHealthy: boolean;
    lastCheck: string;
    errors: string[];
  };
  metrics: {
    totalSent: number;
    deliveryRate: number;
    bounceRate: number;
    averageSendTime: number;
  };
}

// Mock email diagnostics data
const mockEmailDiagnostics: EmailDiagnostics = {
  config: {
    provider: "AWS SES",
    region: "us-west-2",
    fromAddress: "noreply@sfdsarecruiter.org",
    replyToAddress: "support@sfdsarecruiter.org",
    templateDirectory: "/templates/email",
    maxRetries: 3,
    rateLimitPerMinute: 100,
    isConfigured: true
  },
  status: {
    isHealthy: true,
    lastCheck: new Date().toISOString(),
    errors: []
  },
  metrics: {
    totalSent: 1250,
    deliveryRate: 98.5,
    bounceRate: 1.2,
    averageSendTime: 245 // milliseconds
  }
};

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      diagnostics: mockEmailDiagnostics,
      source: 'static'
    })
  } catch (error) {
    console.error("Error in email diagnostics API:", error)
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
