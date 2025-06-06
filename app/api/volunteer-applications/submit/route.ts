export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getServiceSupabase } from "@/app/lib/supabase/server";
import { sendEmail } from "@/lib/email/send-email";
import { getSystemSetting } from "@/lib/system-settings";

export async function POST(request: Request) {
  try {
    // Get client IP address for logging
    const forwarded = request.headers.get('x-forwarded-for');
    const realIp = request.headers.get('x-real-ip');
    const ipAddress = forwarded?.split(',')[0] || realIp || 'unknown';

    // Handle FormData for file uploads
    const formData = await request.formData();
    
    // Extract form fields
    const applicationData = {
      firstName: formData.get('firstName') as string,
      lastName: formData.get('lastName') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      address: formData.get('address') as string || '',
      city: formData.get('city') as string || '',
      state: formData.get('state') as string || '',
      zipCode: formData.get('zipCode') as string || '',
      experience: formData.get('experience') as string || '',
      motivation: formData.get('motivation') as string,
      availability: formData.get('availability') as string,

      agreeToTerms: formData.get('agreeToTerms') === 'true',
      userType: 'volunteer',
      applicationDate: new Date().toISOString(),
      status: 'pending',
      ipAddress: ipAddress
    };

    const resumeFile = formData.get('resume') as File | null;

    // Validate required fields (now fewer fields are required)
    const requiredFields = [
      'firstName', 'lastName', 'email', 'phone', 'motivation', 'availability'
    ];
    
    for (const field of requiredFields) {
      if (!applicationData[field as keyof typeof applicationData]) {
        return NextResponse.json(
          { message: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    if (!applicationData.agreeToTerms) {
      return NextResponse.json(
        { message: "You must agree to the terms and conditions" },
        { status: 400 }
      );
    }

    // Generate application ID
    const applicationId = `VOL-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;

    const supabase = getServiceSupabase();

    // Upload resume to Supabase Storage (if provided)
    let resumeUrl = null;
    let resumeFilename = null;

    if (resumeFile) {
      resumeFilename = `${applicationId}_${resumeFile.name}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('volunteer-applications')
        .upload(`resumes/${resumeFilename}`, resumeFile, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.error('Resume upload error:', uploadError);
        return NextResponse.json(
          { message: "Failed to upload resume file" },
          { status: 500 }
        );
      }

      // Get public URL for the uploaded file
      const { data: urlData } = supabase.storage
        .from('volunteer-applications')
        .getPublicUrl(`resumes/${resumeFilename}`);
      
      resumeUrl = urlData.publicUrl;
    }

    // Save application to database
    const { data: dbData, error: dbError } = await supabase
      .from('volunteer_applications')
      .insert({
        application_id: applicationId,
        first_name: applicationData.firstName,
        last_name: applicationData.lastName,
        email: applicationData.email,
        phone: applicationData.phone,
        address: applicationData.address,
        city: applicationData.city,
        state: applicationData.state,
        zip_code: applicationData.zipCode,
        experience: applicationData.experience,
        motivation: applicationData.motivation,
        availability: applicationData.availability,

        terms_agreement: applicationData.agreeToTerms,
        resume_url: resumeUrl,
        resume_filename: resumeFilename,
        status: 'pending',
        ip_address: applicationData.ipAddress,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (dbError) {
      console.error('Database error:', dbError);
      
      // Clean up uploaded file if database insert failed
      if (resumeFilename) {
        await supabase.storage
          .from('volunteer-applications')
          .remove([`resumes/${resumeFilename}`]);
      }
      
      return NextResponse.json(
        { message: "Failed to save application to database" },
        { status: 500 }
      );
    }

    // Send confirmation email to applicant
    try {
      const emailResult = await sendEmail({
        to: applicationData.email,
        subject: "Volunteer Recruiter Application Received",
        html: `
          <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <h2 style="color: #0A3C1F;">Application Received</h2>
            <p>Dear ${applicationData.firstName},</p>
            <p>Thank you for your interest in becoming a volunteer recruiter for the San Francisco Sheriff's Department.</p>
            
            <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <strong>Application Reference:</strong> ${applicationId}<br>
              <strong>Submitted:</strong> ${new Date().toLocaleDateString()}
            </div>
            
            <h3>What happens next?</h3>
            <ul>
              <li>Our team will review your application and resume</li>
              <li>We may contact you for additional information or an interview</li>
              <li>You'll receive an email notification regarding your application status</li>
              <li>If approved, you'll receive login credentials and access to the volunteer recruiter portal</li>
            </ul>
            
            <p>We typically review applications within 3-5 business days.</p>
            
            <p>If you have any questions, please contact us at <a href="mailto:volunteer@sfdeputysheriff.com">volunteer@sfdeputysheriff.com</a></p>
            
            <p>Best regards,<br>
            SF Deputy Sheriff Volunteer Recruitment Team</p>
          </div>
        `,
      });

      console.log('Confirmation email sent:', emailResult);
    } catch (emailError) {
      console.error('Failed to send confirmation email:', emailError);
      // Don't fail the request if email fails
    }

    // Send notification to administrators
    try {
      const adminEmail = await getSystemSetting('admin_notification_email') || 'admin@sfdeputysheriff.com';
      
      await sendEmail({
        to: adminEmail,
        subject: "New Volunteer Recruiter Application",
        html: `
          <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <h2 style="color: #0A3C1F;">New Volunteer Application</h2>
            <p>A new volunteer recruiter application has been submitted and requires review.</p>
            
            <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <strong>Application ID:</strong> ${applicationId}<br>
              <strong>Applicant:</strong> ${applicationData.firstName} ${applicationData.lastName}<br>
              <strong>Email:</strong> ${applicationData.email}<br>
              <strong>Phone:</strong> ${applicationData.phone}<br>
              <strong>Submitted:</strong> ${new Date().toLocaleDateString()}
            </div>
            
            <p><strong>Motivation:</strong></p>
            <p style="background-color: #f9f9f9; padding: 10px; border-left: 3px solid #0A3C1F;">${applicationData.motivation}</p>
            
            <p>Please review this application in the admin dashboard:</p>
            <p><a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://sfdeputysheriff.com'}/admin/volunteer-applications" style="background-color: #0A3C1F; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Review Application</a></p>
          </div>
        `,
      });
    } catch (emailError) {
      console.error('Failed to send admin notification:', emailError);
      // Don't fail the request if email fails
    }

    return NextResponse.json({
      success: true,
      message: "Application submitted successfully",
      applicationId: applicationId,
      data: dbData
    });

  } catch (error) {
    console.error("Application submission error:", error);
    return NextResponse.json(
      { 
        message: "Internal server error",
        error: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
} 