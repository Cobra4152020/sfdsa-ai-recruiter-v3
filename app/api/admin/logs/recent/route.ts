export const dynamic = "force-static";
export const revalidate = 3600; // Revalidate every hour;

import { NextResponse } from "next/server";

interface SystemLog {
  id: string;
  timestamp: string;
  level: "info" | "warn" | "error";
  message: string;
  context: {
    component: string;
    [key: string]: unknown;
  };
}

interface StaticParam {
  component?: string;
  level?: string;
  limit?: string;
}

// Generate all possible combinations at build time
export function generateStaticParams() {
  const components = ["auth", "database", "email", "api"];
  const levels = ["info", "warn", "error"];
  const limits = [10, 20, 50];

  // Generate all combinations
  const params: StaticParam[] = [];

  // Add component-only params
  components.forEach((component) => {
    params.push({ component });
  });

  // Add level-only params
  levels.forEach((level) => {
    params.push({ level });
  });

  // Add component + level combinations
  components.forEach((component) => {
    levels.forEach((level) => {
      params.push({ component, level });
    });
  });

  // Add limit variations
  limits.forEach((limit) => {
    params.push({ limit: limit.toString() });
  });

  return params;
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const component = url.searchParams.get("component");
    const level = url.searchParams.get("level") as
      | "info"
      | "warn"
      | "error"
      | null;
    const limit = Number.parseInt(url.searchParams.get("limit") || "50", 10);

    // Generate mock logs based on parameters
    const logs = getMockLogs({ component, level, limit });

    return NextResponse.json({
      logs,
      count: logs.length,
      timestamp: new Date().toISOString(),
      source: "static",
    });
  } catch (error) {
    console.error("Error in admin logs API:", error);

    return NextResponse.json(
      {
        error: "Failed to fetch logs",
        message: error instanceof Error ? error.message : "Unknown error",
        source: "error",
      },
      { status: 500 },
    );
  }
}

interface MockLogParams {
  component?: string | null;
  level?: "info" | "warn" | "error" | null;
  limit?: number;
}

function getMockLogs({
  component,
  level,
  limit = 50,
}: MockLogParams): SystemLog[] {
  // Define mock log templates
  const logTemplates = {
    auth: {
      info: [
        "User login successful",
        "User logout successful",
        "Password reset requested",
        "Email verification sent",
        "New user registration",
      ],
      warn: [
        "Failed login attempt",
        "Password reset attempt for non-existent user",
        "Multiple failed login attempts detected",
        "Session token expired",
        "Invalid 2FA code attempt",
      ],
      error: [
        "Authentication service unavailable",
        "Database connection error during login",
        "Token validation failed",
        "User account locked",
        "Critical security breach detected",
      ],
    },
    database: {
      info: [
        "Database backup completed",
        "Index optimization finished",
        "Schema update successful",
        "Data migration completed",
        "New table created",
      ],
      warn: [
        "Slow query detected",
        "High memory usage",
        "Connection pool near capacity",
        "Temporary table size exceeding limit",
        "Query timeout warning",
      ],
      error: [
        "Database connection failed",
        "Query execution error",
        "Disk space critical",
        "Deadlock detected",
        "Backup failure",
      ],
    },
    email: {
      info: [
        "Email sent successfully",
        "Template updated",
        "New subscriber added",
        "Campaign started",
        "Bounce list updated",
      ],
      warn: [
        "Email delivery delayed",
        "High bounce rate detected",
        "SMTP connection unstable",
        "Template rendering warning",
        "Rate limit approaching",
      ],
      error: [
        "Email service unavailable",
        "Template rendering failed",
        "SMTP authentication failed",
        "Rate limit exceeded",
        "Critical delivery failure",
      ],
    },
    api: {
      info: [
        "API request successful",
        "New endpoint deployed",
        "Cache updated",
        "Rate limit reset",
        "API key generated",
      ],
      warn: [
        "High latency detected",
        "Rate limit warning",
        "Deprecated endpoint used",
        "Cache miss rate high",
        "API version sunset warning",
      ],
      error: [
        "API endpoint unavailable",
        "Rate limit exceeded",
        "Invalid request payload",
        "Internal server error",
        "Gateway timeout",
      ],
    },
  };

  // Generate logs based on parameters
  const logs: unknown = [];
  const components = component ? [component] : Object.keys(logTemplates);
  const levels = level ? [level] : (["info", "warn", "error"] as const);

  // Use component and timestamp as seed for deterministic "random" selection
  let seed = 0;

  for (let i = 0; i < limit; i++) {
    const comp = components[i % components.length];
    const lvl = levels[Math.floor(i / 3) % levels.length];
    const templates = logTemplates[comp as keyof typeof logTemplates][lvl];
    const messageIndex = (i + seed) % templates.length;

    logs.push({
      id: `log-${i + 1}`,
      timestamp: new Date(Date.now() - i * 300000).toISOString(), // Each log 5 minutes apart
      level: lvl,
      message: templates[messageIndex],
      context: {
        component: comp,
        requestId: `req-${i + 1}`,
        userId: `user-${(i % 5) + 1}`,
        additionalInfo: `Sample context for ${comp} ${lvl} log`,
      },
    });

    seed = (seed + 7) % 100; // Update seed for next iteration
  }

  return logs as SystemLog[];
}
