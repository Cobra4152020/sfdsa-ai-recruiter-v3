import { NextResponse } from "next/server";
import { getServiceSupabase } from "@/app/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const userId = params.id;

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    const serviceClient = getServiceSupabase();

    // 1. Fetch all possible application steps
    const { data: allSteps, error: stepsError } = await serviceClient
      .from("application_steps")
      .select("*")
      .order("step_order", { ascending: true });

    if (stepsError) {
      console.error("Error fetching application steps:", stepsError);
      return NextResponse.json(
        { error: "Could not fetch application steps." },
        { status: 500 }
      );
    }

    // 2. Fetch the user's completed steps
    const { data: userProgress, error: progressError } = await serviceClient
      .from("user_application_progress")
      .select("step_id, is_completed, completed_at")
      .eq("user_id", userId);

    if (progressError) {
      console.error("Error fetching user application progress:", progressError);
      // We can continue and just show all steps as not completed
    }
    
    // 3. Combine the two to create the final user-specific step list
    const combinedSteps = allSteps.map(step => {
      const userStep = userProgress?.find(p => p.step_id === step.id);
      return {
        step_id: step.id,
        step_name: step.step_name,
        description: step.description,
        is_completed: userStep?.is_completed || false,
        completed_at: userStep?.completed_at || null,
      };
    });

    return NextResponse.json(combinedSteps);

  } catch (error) {
    console.error("Unexpected error fetching application progress:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
} 