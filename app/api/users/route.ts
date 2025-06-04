import { NextResponse } from "next/server";

export const dynamic = "force-static";

interface User {
  id: string;
  email: string;
  name: string;
  avatar_url: string | null;
  user_type: string;
  created_at: string;
  updated_at: string;
}

// Mock users data
const STATIC_USERS: User[] = [
  {
    id: "1",
    email: "john.smith@example.com",
    name: "John Smith",
    avatar_url: null,
    user_type: "recruit",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "2",
    email: "jane.doe@example.com",
    name: "Jane Doe",
    avatar_url: null,
    user_type: "recruit",
    created_at: "2024-01-02T00:00:00Z",
    updated_at: "2024-01-02T00:00:00Z",
  },
  {
    id: "3",
    email: "bob.wilson@example.com",
    name: "Bob Wilson",
    avatar_url: null,
    user_type: "recruit",
    created_at: "2024-01-03T00:00:00Z",
    updated_at: "2024-01-03T00:00:00Z",
  },
];

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const search = url.searchParams.get("search") || "";
    const limit = Number(url.searchParams.get("limit") || "10");
    const offset = Number(url.searchParams.get("offset") || "0");

    let users = [...STATIC_USERS];

    // Apply search filter if provided
    if (search) {
      users = users.filter(
        (user) =>
          user.name.toLowerCase().includes(search.toLowerCase()) ||
          user.email.toLowerCase().includes(search.toLowerCase()),
      );
    }

    // Get total count before pagination
    const total = users.length;

    // Apply pagination
    users = users.slice(offset, offset + limit);

    return NextResponse.json({
      success: true,
      users,
      total,
      source: "static",
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}

// Note: POST endpoint removed as it cannot be static
// User creation should be handled through a separate admin interface
// or serverless functions
