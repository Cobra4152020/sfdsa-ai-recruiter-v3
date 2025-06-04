export const dynamic = "force-dynamic";
export const revalidate = 0; // No caching for real-time briefings

import { NextResponse } from "next/server";
import { getServiceSupabase } from "@/app/lib/supabase/server";
import {
  getBriefingStats,
  updateBriefingCycle,
  calculateCycleDay,
} from "@/lib/daily-briefing-service";

// Fallback briefing data
const fallbackBriefing = {
  id: "fallback-briefing",
  title: "San Francisco Deputy Sheriff's Daily Briefing",
  content: `
    <h3>Today's Focus: Community Safety</h3>
    <p>
      Welcome to today's briefing. We continue our commitment to serving the San Francisco 
      community with dedication and integrity.
    </p>
    
    <h4>Safety Reminders:</h4>
    <ul>
      <li>Always be aware of your surroundings</li>
      <li>Check your equipment before starting your shift</li>
      <li>Report any safety concerns immediately</li>
    </ul>
    
    <h4>Community Engagement:</h4>
    <p>
      Our presence in the community is vital for building trust and ensuring safety. 
      Remember to engage positively with community members and be a visible presence 
      in your assigned areas.
    </p>
    
    <h4>Department Updates:</h4>
    <p>
      Regular training sessions continue next week. Please ensure all required documentation 
      is completed properly and promptly.
    </p>
  `,
  date: new Date().toISOString(),
  theme: "Safety",
  created_at: new Date().toISOString(),
};

export async function GET() {
  try {
    const supabase = getServiceSupabase();

    // Get today's date in YYYY-MM-DD format
    const today = new Date();
    const todayStr = today.toISOString().split("T")[0];

    // Calculate the current cycle day (1-365)
    const cycleDay = calculateCycleDay(today);

    // First, try to get today's briefing by exact date match
    const { data, error } = await supabase
      .from("daily_briefings")
      .select("*")
      .eq("date", todayStr)
      .eq("active", true)
      .single();

    if (!error && data) {
      // Transform the data to match expected format using all available fields
      const transformedBriefing = {
        id: data.id,
        title: `Sgt. Ken's Daily Briefing - ${data.theme}`,
        content: `
          <div class="space-y-6">
            <div class="bg-gradient-to-r from-[#0A3C1F]/10 to-[#0A3C1F]/5 border-l-4 border-[#0A3C1F] p-4 rounded-r-lg">
              <h3 class="text-xl font-bold text-[#0A3C1F] mb-3">📣 Sgt. Ken Says...</h3>
              <p class="text-gray-800 leading-relaxed">${data.sgt_ken_take || 'Stay focused, stay safe, and remember why we serve our community.'}</p>
            </div>

            <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 class="text-lg font-semibold text-blue-800 mb-3">💬 Today's Inspiration</h4>
              <blockquote class="text-lg italic text-blue-700 border-l-4 border-blue-400 pl-4 mb-2">
                "${data.quote}"
              </blockquote>
              <footer class="text-sm text-blue-600 font-medium">— ${data.quote_author}</footer>
            </div>
            
            <div>
              <h4 class="text-lg font-semibold text-gray-800 mb-3">🎯 Today's Focus: ${data.theme}</h4>
              <p class="text-gray-700 leading-relaxed mb-4">
                Welcome to today's briefing, deputies. Let this wisdom guide your service to the San Francisco community. 
                Remember that every interaction is an opportunity to build trust and demonstrate our commitment to justice.
              </p>
            </div>
            
            <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h4 class="text-lg font-semibold text-yellow-800 mb-3">⚡ Call to Action</h4>
              <p class="text-yellow-700 font-medium">${data.call_to_action || 'Justice needs boots on the ground. Yours. Become a Deputy → https://sfdeputysheriff.com/'}</p>
            </div>

            <div class="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h4 class="text-lg font-semibold text-gray-800 mb-3">📋 Daily Reminders</h4>
              <ul class="space-y-2 text-gray-700">
                <li class="flex items-start"><span class="text-green-500 mr-2">✓</span> Carry this inspiration with you throughout your shift</li>
                <li class="flex items-start"><span class="text-green-500 mr-2">✓</span> Remember the values that drive your service</li>
                <li class="flex items-start"><span class="text-green-500 mr-2">✓</span> Stay connected to your purpose and mission</li>
                <li class="flex items-start"><span class="text-green-500 mr-2">✓</span> Support your fellow officers and community members</li>
              </ul>
            </div>
          </div>
        `,
        theme: data.theme,
        date: data.date,
        created_at: data.created_at,
        cycle_day: cycleDay,
        quote: data.quote,
        quote_author: data.quote_author,
        sgt_ken_take: data.sgt_ken_take,
        call_to_action: data.call_to_action
      };

      // Get stats for the briefing
      const stats = await getBriefingStats(data.id);

      return NextResponse.json({
        briefing: transformedBriefing,
        stats,
        error: null,
      });
    }

    // If no exact date match, use cycle-based selection from the 365 available briefings
    console.log(`No briefing for today (${todayStr}), using cycle day ${cycleDay} from available briefings`);
    
    const { data: allBriefings, error: allError } = await supabase
      .from("daily_briefings")
      .select("*")
      .eq("active", true)
      .order("date", { ascending: true });

    if (allError || !allBriefings || allBriefings.length === 0) {
      console.error("Error fetching briefings:", allError);
      return NextResponse.json({
        briefing: { ...fallbackBriefing, cycle_day: cycleDay },
        stats: {
          total_attendees: 0,
          total_shares: 0,
          user_attended: false,
          user_shared: false,
          user_platforms_shared: [],
        },
        error: "Failed to load briefings from database",
      });
    }

    // Select briefing based on cycle day (1-365)
    const briefingIndex = (cycleDay - 1) % allBriefings.length;
    const selectedBriefing = allBriefings[briefingIndex];

    // Transform the selected briefing to match expected format using all available fields
    const transformedBriefing = {
      id: selectedBriefing.id,
      title: `Sgt. Ken's Daily Briefing - ${selectedBriefing.theme}`,
      content: `
        <div class="space-y-6">
          <div class="bg-gradient-to-r from-[#0A3C1F]/10 to-[#0A3C1F]/5 border-l-4 border-[#0A3C1F] p-4 rounded-r-lg">
            <h3 class="text-xl font-bold text-[#0A3C1F] mb-3">📣 Sgt. Ken Says...</h3>
            <p class="text-gray-800 leading-relaxed">${selectedBriefing.sgt_ken_take || 'Stay focused, stay safe, and remember why we serve our community.'}</p>
          </div>

          <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 class="text-lg font-semibold text-blue-800 mb-3">💬 Today's Inspiration</h4>
            <blockquote class="text-lg italic text-blue-700 border-l-4 border-blue-400 pl-4 mb-2">
              "${selectedBriefing.quote}"
            </blockquote>
            <footer class="text-sm text-blue-600 font-medium">— ${selectedBriefing.quote_author}</footer>
          </div>
          
          <div>
            <h4 class="text-lg font-semibold text-gray-800 mb-3">🎯 Today's Focus: ${selectedBriefing.theme}</h4>
            <p class="text-gray-700 leading-relaxed mb-4">
              Welcome to today's briefing, deputies. Let this wisdom guide your service to the San Francisco community. 
              Remember that every interaction is an opportunity to build trust and demonstrate our commitment to justice.
            </p>
          </div>
          
          <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h4 class="text-lg font-semibold text-yellow-800 mb-3">⚡ Call to Action</h4>
            <p class="text-yellow-700 font-medium">${selectedBriefing.call_to_action || 'Justice needs boots on the ground. Yours. Become a Deputy → https://sfdeputysheriff.com/'}</p>
          </div>

          <div class="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h4 class="text-lg font-semibold text-gray-800 mb-3">📋 Daily Reminders</h4>
            <ul class="space-y-2 text-gray-700">
              <li class="flex items-start"><span class="text-green-500 mr-2">✓</span> Carry this inspiration with you throughout your shift</li>
              <li class="flex items-start"><span class="text-green-500 mr-2">✓</span> Remember the values that drive your service</li>
              <li class="flex items-start"><span class="text-green-500 mr-2">✓</span> Stay connected to your purpose and mission</li>
              <li class="flex items-start"><span class="text-green-500 mr-2">✓</span> Support your fellow officers and community members</li>
            </ul>
          </div>
        </div>
      `,
      theme: selectedBriefing.theme,
      date: todayStr, // Use today's date for display
      created_at: selectedBriefing.created_at,
      cycle_day: cycleDay,
      quote: selectedBriefing.quote,
      quote_author: selectedBriefing.quote_author,
      sgt_ken_take: selectedBriefing.sgt_ken_take,
      call_to_action: selectedBriefing.call_to_action
    };

    // Get stats for the selected briefing
    const stats = await getBriefingStats(selectedBriefing.id);

    return NextResponse.json({
      briefing: transformedBriefing,
      stats,
      error: null,
    });
  } catch (error) {
    console.error("Exception in GET /api/daily-briefing/today:", error);
    const today = new Date();
    return NextResponse.json({
      briefing: { 
        ...fallbackBriefing, 
        cycle_day: calculateCycleDay(today),
        date: today.toISOString().split("T")[0]
      },
      stats: {
        total_attendees: 0,
        total_shares: 0,
        user_attended: false,
        user_shared: false,
        user_platforms_shared: [],
      },
      error: "An unexpected error occurred",
    });
  }
}
