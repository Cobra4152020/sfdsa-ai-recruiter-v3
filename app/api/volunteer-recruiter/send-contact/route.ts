export const dynamic = "force-dynamic";
// Remove revalidate for dynamic routes

import { NextResponse } from "next/server";
import { getServiceSupabase } from "@/app/lib/supabase/server";
import { sendEmail } from "@/lib/email/send-email";
import { getSystemSetting } from "@/lib/system-settings";

export async function POST(request: Request) {
  try {
    // Handle FormData for file uploads
    const formData = await request.formData();
    
    // Extract form fields
    const firstName = formData.get('firstName') as string;
    const lastName = formData.get('lastName') as string;
    const email = formData.get('email') as string;
    const phone = formData.get('phone') as string;
    const message = formData.get('message') as string;
    const recruiterId = formData.get('recruiterId') as string;
    const recruiterName = formData.get('recruiterName') as string;
    const resumeFile = formData.get('resume') as File | null;

    // Validate required fields
    if (!firstName || !lastName || !email) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 },
      );
    }

    // Handle resume file upload if present
    let resumeUrl = null;
    let resumeFileName = null;
    
    if (resumeFile && resumeFile.size > 0) {
      try {
        const supabase = getServiceSupabase();
        
        // Generate unique filename
        const fileExtension = resumeFile.name.split('.').pop();
        const uniqueFileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExtension}`;
        const filePath = `volunteer-resumes/${uniqueFileName}`;
        
        // Convert File to ArrayBuffer for upload
        const fileBuffer = await resumeFile.arrayBuffer();
        
        // Upload to Supabase Storage
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('volunteer-documents')
          .upload(filePath, fileBuffer, {
            contentType: resumeFile.type,
            upsert: false
          });

        if (uploadError) {
          console.error('Resume upload error:', uploadError);
          return NextResponse.json(
            { success: false, message: "Failed to upload resume" },
            { status: 500 },
          );
        }

        // Get public URL for the uploaded file
        const { data: { publicUrl } } = supabase.storage
          .from('volunteer-documents')
          .getPublicUrl(filePath);

        resumeUrl = publicUrl;
        resumeFileName = resumeFile.name;
        
      } catch (uploadError) {
        console.error('Resume processing error:', uploadError);
        return NextResponse.json(
          { success: false, message: "Failed to process resume file" },
          { status: 500 },
        );
      }
    }

    // Format personalized message
    const formattedMessage = message
      ? `\n\n${message}\n\n`
      : `\n\nI would like to invite you to learn more about career opportunities with the San Francisco Sheriff's Department. We offer competitive salaries, excellent benefits, and meaningful work that makes a difference in our community.\n\n`;

    // Generate a unique tracking ID
    const trackingId = `REC-${Date.now()}-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;

    // Get the admin email from system settings
    const adminEmail = await getSystemSetting(
      "RECRUITMENT_EMAIL",
      "recruitment@sfdeputysheriff.com",
    );
    const fromEmail = await getSystemSetting(
      "DEFAULT_REPLY_TO",
      "no-reply@sfdeputysheriff.com",
    );

    // Save referral to database
    const supabase = getServiceSupabase();
    const { error: dbError } = await supabase
      .from("volunteer_referrals")
      .insert({
        recruiter_id: recruiterId || "system",
        referral_email: email,
        referral_name: `${firstName} ${lastName}`,
        referral_phone: phone || null,
        status: "contacted",
        tracking_id: trackingId,
        notes: message || "Initial contact from volunteer recruiter program",
        resume_url: resumeUrl,
        resume_filename: resumeFileName,
        created_at: new Date().toISOString(),
      });

    if (dbError) {
      console.error("Database error:", dbError);
      return NextResponse.json(
        { success: false, message: "Failed to save contact information" },
        { status: 500 },
      );
    }

    // Html email template
    const resumeSection = resumeUrl ? 
      `<p><strong>Resume:</strong> The volunteer has provided their resume, which has been forwarded to our recruitment team for review.</p>` : '';

    const htmlEmail = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>San Francisco Sheriff's Department Recruitment</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            margin: 0;
            padding: 0;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .header {
            background-color: #0A3C1F;
            color: white;
            padding: 20px;
            text-align: center;
          }
          .content {
            padding: 20px;
            background-color: #f9f9f9;
          }
          .footer {
            text-align: center;
            padding: 20px;
            font-size: 12px;
            color: #666;
          }
          .button {
            display: inline-block;
            background-color: #0A3C1F;
            color: white;
            text-decoration: none;
            padding: 10px 20px;
            border-radius: 4px;
            margin-top: 20px;
            font-weight: bold;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>San Francisco Sheriff's Department</h1>
          </div>
          <div class="content">
            <p>Hello ${firstName},</p>
            
            <p>My name is ${recruiterName || "a volunteer recruiter with the San Francisco Sheriff's Department"} and I'm reaching out because I think you would be an excellent candidate for the San Francisco Sheriff's Department.</p>
            
            ${formattedMessage}
            
            ${resumeSection}
            
            <p>Some of the benefits of joining the San Francisco Sheriff's Department include:</p>
            <ul>
              <li>Competitive starting salary</li>
              <li>Excellent health benefits</li>
              <li>Paid training</li>
              <li>Retirement benefits</li>
              <li>Career advancement opportunities</li>
              <li>Serving your community</li>
            </ul>
            
            <p>I'd be happy to answer any questions you might have or connect you with a recruiter who can provide more detailed information.</p>
            
            <div style="text-align: center; margin-top: 30px;">
              <a href="${process.env.NEXT_PUBLIC_SITE_URL || "https://sfdeputysheriff.com"}/register?ref=${trackingId}" class="button">Learn More About Joining SFSD</a>
            </div>
            
            <p style="margin-top: 30px;">Thank you for your time and consideration.</p>
            
            <p>Best regards,<br>${recruiterName || "Volunteer Recruiter"}<br>San Francisco Sheriff's Department</p>
          </div>
          <div class="footer">
            <p>This email was sent by the San Francisco Sheriff's Department Recruitment Team.</p>
            <p>If you have any questions, please contact us at ${adminEmail}</p>
            <p>© ${new Date().getFullYear()} San Francisco Sheriff's Department. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    // Send email to the volunteer
    try {
      await sendEmail({
        to: email,
        subject: "San Francisco Sheriff's Department - Career Opportunity",
        html: htmlEmail,
        from: `SF Deputy Sheriff Recruitment <${fromEmail}>`,
        replyTo: adminEmail,
      });

      // Prepare admin notification email
      const adminNotificationHtml = `
        <h2>New Recruit Referral</h2>
        <p><strong>Tracking ID:</strong> ${trackingId}</p>
        <p><strong>Recruit Name:</strong> ${firstName} ${lastName}</p>
        <p><strong>Recruit Email:</strong> ${email}</p>
        <p><strong>Recruit Phone:</strong> ${phone || "Not provided"}</p>
        ${recruiterId ? `<p><strong>Referred by:</strong> ${recruiterName} (ID: ${recruiterId})</p>` : ""}
        <p><strong>Notes:</strong> ${message || "No additional notes"}</p>
        ${resumeUrl ? `<p><strong>Resume:</strong> <a href="${resumeUrl}">Download Resume (${resumeFileName})</a></p>` : ""}
      `;

      // Forward the recruit information to the admin email
      await sendEmail({
        to: adminEmail,
        subject: "New Recruit Referral" + (resumeFile ? " (with Resume)" : ""),
        html: adminNotificationHtml,
      });
    } catch (emailError) {
      console.error("Email error:", emailError);
      return NextResponse.json(
        { success: false, message: "Failed to send email" },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Contact email sent successfully" + (resumeFile ? " with resume attachment" : ""),
      trackingId,
      resumeUploaded: !!resumeFile,
    });
  } catch (error) {
    console.error("Error in send-contact route:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}
