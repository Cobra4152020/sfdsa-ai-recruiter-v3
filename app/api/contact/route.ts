export const dynamic = "force-dynamic";

import { type NextRequest, NextResponse } from "next/server";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { v4 as uuidv4 } from "uuid";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { 
      firstName, 
      lastName, 
      email, 
      phone, 
      subject, 
      message, 
      contactReason, 
      urgency, 
      userId, 
      timestamp 
    } = body;

    console.log('📞 Contact form submission received:', {
      name: `${firstName} ${lastName}`,
      email,
      subject,
      urgency
    });

    // Validation
    if (!firstName || !lastName || !email || !subject || !message) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Get database connection
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      console.error("Missing Supabase configuration");
      return NextResponse.json(
        { error: "Database configuration error" },
        { status: 500 }
      );
    }

    const supabase = createSupabaseClient(supabaseUrl, supabaseKey);

    // Store contact form submission in database
    const contactData = {
      id: uuidv4(),
      first_name: firstName,
      last_name: lastName,
      email: email,
      phone: phone || null,
      subject: subject,
      message: message,
      contact_reason: contactReason || 'general',
      urgency_level: urgency || 'normal',
      user_id: userId || null,
      status: 'pending',
      created_at: timestamp || new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    // Insert contact submission
    const { data: contactSubmission, error: contactError } = await supabase
      .from('contact_submissions')
      .insert(contactData)
      .select()
      .single();

    if (contactError) {
      console.error('Error saving contact submission:', contactError);
      // Don't fail the request if database save fails
    } else {
      console.log('✅ Contact submission saved:', contactSubmission?.id);
    }

    // Send notification email (in production, this would integrate with email service)
    try {
      console.log('📧 Contact form notification would be sent to recruitment team');
      // In production: integrate with SendGrid, AWS SES, or similar service
    } catch (emailError) {
      console.error('Error sending notification email:', emailError);
      // Don't fail the request if email fails
    }

    // Calculate expected response time
    const getResponseTime = (urgency: string) => {
      switch (urgency) {
        case "urgent": return "4 hours";
        case "high": return "24 hours";
        case "normal": return "2-3 business days";
        case "low": return "3-5 business days";
        default: return "2-3 business days";
      }
    };

    return NextResponse.json({
      success: true,
      message: "Contact form submitted successfully",
      data: {
        submissionId: contactData.id,
        expectedResponse: getResponseTime(urgency),
        urgencyLevel: urgency,
        contactReason: contactReason
      }
    });

  } catch (error) {
    console.error("Error in contact API route:", error);
    
    return NextResponse.json(
      {
        error: "Failed to process contact form submission",
        message: "Please try again later or contact us directly at recruitment@sfgov.org"
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: "Contact API endpoint ready",
    methods: ["POST"],
    fields: {
      required: ["firstName", "lastName", "email", "subject", "message"],
      optional: ["phone", "contactReason", "urgency", "userId"]
    }
  });
} 