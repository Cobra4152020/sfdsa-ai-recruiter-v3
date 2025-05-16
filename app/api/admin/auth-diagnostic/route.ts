
export const dynamic = 'force-dynamic';

import { NextResponse } from "next/server"
import { diagnoseUserAuth } from "@/lib/auth-diagnostic"

export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json(
        {
          success: false,
          message: "Email address is required",
        },
        { status: 400 },
      )
    }

    const diagnosticResult = await diagnoseUserAuth(email)

    return NextResponse.json({
      success: true,
      result: diagnosticResult,
    })
  } catch (error) {
    console.error("Error in auth diagnostic:", error)
    return NextResponse.json(
      {
        success: false,
        message: "An unexpected error occurred",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
