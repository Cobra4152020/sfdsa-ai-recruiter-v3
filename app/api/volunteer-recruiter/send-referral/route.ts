export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getServiceSupabase } from "@/app/lib/supabase/server";
import { sendEmail } from "@/lib/email/send-email";
import { getSystemSetting } from "@/lib/system-settings";

export async function POST(request: Request) {
  try {
    const { recruiterId, message, recipientEmail, recipientName } = await request.json();

    if (!recruiterId || !message) {
      return NextResponse.json(
        { success: false, message: "Recruiter ID and message are required" },
        { status: 400 }
      );
    }

    const supabase = getServiceSupabase();

    // Get recruiter information
    const { data: recruiterData } = await supabase
      .from("user_profiles")
      .select("first_name, last_name, email")
      .eq("user_id", recruiterId)
      .single();

    const recruiterName = recruiterData 
      ? `${recruiterData.first_name} ${recruiterData.last_name}` 
      : "Volunteer Recruiter";

    // If specific recipient provided, send to them
    if (recipientEmail && recipientName) {
      try {
        await sendReferralEmail(recipientEmail, recipientName, recruiterName, message);
        
        // Store the referral in database
        await supabase.from("volunteer_referrals").insert({
          recruiter_id: recruiterId,
          referral_email: recipientEmail,
          referral_name: recipientName,
          status: "contacted",
          notes: message,
        });

        // Update recruiter stats
        await updateRecruiterStats(recruiterId, "referral_sent");

        return NextResponse.json({
          success: true,
          message: "Referral sent successfully",
        });

      } catch (error) {
        console.error("Error sending referral:", error);
        return NextResponse.json(
          { success: false, message: "Failed to send referral" },
          { status: 500 }
        );
      }
    } 

    // If no specific recipient, just acknowledge the message for social sharing
    return NextResponse.json({
      success: true,
      message: "Referral message prepared for sharing",
      shareMessage: generateShareMessage(recruiterName, message),
      referralLink: generateReferralLink(recruiterId),
    });

  } catch (error) {
    console.error("Error in send-referral route:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

async function sendReferralEmail(recipientEmail: string, recipientName: string, recruiterName: string, message: string) {
  const adminEmail = await getSystemSetting("RECRUITMENT_EMAIL", "recruitment@sfdeputysheriff.com");
  const fromEmail = await getSystemSetting("DEFAULT_REPLY_TO", "no-reply@sfdeputysheriff.com");
  
  const trackingId = `REF-${Date.now()}-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
  
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>San Francisco Sheriff's Department - Career Opportunity</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #0A3C1F; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background-color: #f9f9f9; }
        .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
        .button { display: inline-block; background-color: #0A3C1F; color: white; text-decoration: none; padding: 10px 20px; border-radius: 4px; margin-top: 20px; font-weight: bold; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>San Francisco Sheriff's Department</h1>
        </div>
        <div class="content">
          <p>Hello ${recipientName},</p>
          
          <p>My name is ${recruiterName} and I'm a volunteer recruiter with the San Francisco Sheriff's Department. I'm reaching out because I believe you would be an excellent candidate for our team.</p>
          
          <div style="border-left: 4px solid #0A3C1F; padding-left: 15px; margin: 20px 0; font-style: italic;">
            ${message}
          </div>
          
          <p>Some of the benefits of joining the San Francisco Sheriff's Department include:</p>
          <ul>
            <li>Competitive starting salary ($70,000 - $90,000)</li>
            <li>Excellent health and dental benefits</li>
            <li>Comprehensive paid training program</li>
            <li>Retirement benefits (CalPERS)</li>
            <li>Career advancement opportunities</li>
            <li>Meaningful work serving our community</li>
          </ul>
          
          <p>I'd be happy to answer any questions you might have or connect you with a recruiter who can provide more detailed information.</p>
          
          <div style="text-align: center; margin-top: 30px;">
            <a href="${process.env.NEXT_PUBLIC_SITE_URL || "https://sfdeputysheriff.com"}/register?ref=${trackingId}" class="button">Learn More About Joining SFSD</a>
          </div>
          
          <p style="margin-top: 30px;">Thank you for your time and consideration.</p>
          
          <p>Best regards,<br>${recruiterName}<br>Volunteer Recruiter<br>San Francisco Sheriff's Department</p>
        </div>
        <div class="footer">
          <p>This email was sent by the San Francisco Sheriff's Department Volunteer Recruitment Program.</p>
          <p>If you have any questions, please contact us at ${adminEmail}</p>
          <p>© ${new Date().getFullYear()} San Francisco Sheriff's Department. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  await sendEmail({
    to: recipientEmail,
    subject: "San Francisco Sheriff's Department - Career Opportunity",
    html: htmlContent,
    from: `SF Deputy Sheriff Recruitment <${fromEmail}>`,
    replyTo: adminEmail,
  });
}

async function updateRecruiterStats(recruiterId: string, action: string) {
  const supabase = getServiceSupabase();
  
  try {
    // Get current stats
    const { data: currentStats } = await supabase
      .from("volunteer_recruiter_stats")
      .select("*")
      .eq("user_id", recruiterId)
      .single();

    if (currentStats) {
      // Update existing stats
      const updates: any = { last_active: new Date().toISOString() };
      
      if (action === "referral_sent") {
        updates.referrals_count = (currentStats.referrals_count || 0) + 1;
        updates.total_points = (currentStats.total_points || 0) + 25; // Points for sending referral
      }

      await supabase
        .from("volunteer_recruiter_stats")
        .update(updates)
        .eq("user_id", recruiterId);
    } else {
      // Create new stats record
      await supabase.from("volunteer_recruiter_stats").insert({
        user_id: recruiterId,
        referrals_count: 1,
        total_points: 25,
        last_active: new Date().toISOString(),
      });
    }

    // Record the activity
    await supabase.from("recruiter_activities").insert({
      recruiter_id: recruiterId,
      activity_type: action,
      points: 25,
      description: "Sent referral to potential candidate",
    });

  } catch (error) {
    console.error("Error updating recruiter stats:", error);
  }
}

function generateShareMessage(recruiterName: string, message: string): string {
  return `Hi! I'm ${recruiterName}, a volunteer recruiter for the San Francisco Sheriff's Department. 

${message}

If you're interested in a meaningful career in law enforcement with excellent benefits and training, I'd love to tell you more about opportunities with SFSD.

Check out: ${process.env.NEXT_PUBLIC_SITE_URL || "https://sfdeputysheriff.com"}

#SFSheriff #LawEnforcementCareers #SanFranciscoJobs`;
}

function generateReferralLink(recruiterId: string): string {
  const code = `VR2024-${recruiterId.substring(0, 8)}`;
  return `${process.env.NEXT_PUBLIC_SITE_URL || "https://sfdeputysheriff.com"}/register?ref=${code}`;
} 