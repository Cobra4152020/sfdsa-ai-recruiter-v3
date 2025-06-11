import { NextResponse } from "next/server";
import { getServiceSupabase } from "@/app/lib/supabase/server";
import { sendEmail } from "@/lib/email/send-email";

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
      dateOfBirth: formData.get('dateOfBirth') as string,
      motivation: formData.get('motivation') as string,
      
      // Position Selection
      position: formData.get('position') as string,
      
      // Qualifications
      hasAssociateDegree: formData.get('hasAssociateDegree') === 'true',
      hasBachelorsDegree: formData.get('hasBachelorsDegree') === 'true',
      hasLawEnforcementExperience: formData.get('hasLawEnforcementExperience') === 'true',
      hasMilitaryExperience: formData.get('hasMilitaryExperience') === 'true',
      hasCorrectionsExperience: formData.get('hasCorrectionsExperience') === 'true',
      hasEMTCertification: formData.get('hasEMTCertification') === 'true',
      hasPOSTCertification: formData.get('hasPOSTCertification') === 'true',
      
      experienceDetails: formData.get('experienceDetails') as string || '',
      availabilitySlots: JSON.parse(formData.get('availabilitySlots') as string || '[]'),
      
      agreeToTerms: formData.get('agreeToTerms') === 'true',
      agreeToBackgroundCheck: formData.get('agreeToBackgroundCheck') === 'true',
      
      userType: 'recruit',
      applicationDate: new Date().toISOString(),
      status: 'pending',
      ipAddress: ipAddress
    };

    const resumeFile = formData.get('resume') as File | null;

    // Validate required fields
    const requiredFields = [
      'firstName', 'lastName', 'email', 'phone', 'dateOfBirth', 'motivation', 'position'
    ];
    
    for (const field of requiredFields) {
      if (!applicationData[field as keyof typeof applicationData]) {
        return NextResponse.json(
          { message: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Validate consent checkboxes
    if (!applicationData.agreeToTerms) {
      return NextResponse.json(
        { message: "Terms and conditions agreement is required" },
        { status: 400 }
      );
    }

    if (!applicationData.agreeToBackgroundCheck) {
      return NextResponse.json(
        { message: "Background check consent is required for law enforcement positions" },
        { status: 400 }
      );
    }

    // Validate availability slots
    const validSlots = applicationData.availabilitySlots.filter(
      (slot: { date: string; timeRange: string }) => slot.date && slot.timeRange
    );
    
    if (validSlots.length === 0) {
      return NextResponse.json(
        { message: "At least one availability slot is required" },
        { status: 400 }
      );
    }

    // Age validation (must be 18+)
    const birthDate = new Date(applicationData.dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    if (age < 20) {
      return NextResponse.json(
        { message: "Applicant must be at least 20 years old" },
        { status: 400 }
      );
    }

    // Generate application ID
    const applicationId = `DEPUTY-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;

    // Determine redirect URL based on position
    const redirectUrl = applicationData.position === "8302" 
      ? "https://careers.sf.gov/role?id=3743990005451766"  // Entry Level
      : "https://careers.sf.gov/role?id=3743990005310816";   // Academy Graduate/Lateral

    const supabase = getServiceSupabase();
    let resumeUrl = null;
    let resumeFilename = null;

    // Handle resume file upload if provided
    if (resumeFile) {
      try {
        const fileExtension = resumeFile.name.split('.').pop();
        const fileName = `deputy-applications/${applicationId}/resume.${fileExtension}`;
        
        // Convert File to ArrayBuffer then to Buffer
        const arrayBuffer = await resumeFile.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('applications')
          .upload(fileName, buffer, {
            contentType: resumeFile.type,
            upsert: false
          });

        if (uploadError) {
          console.error('Resume upload error:', uploadError);
          // Don't fail the entire application for resume upload issues
        } else {
          const { data: urlData } = supabase.storage
            .from('applications')
            .getPublicUrl(fileName);
          
          resumeUrl = urlData.publicUrl;
          resumeFilename = resumeFile.name;
        }
      } catch (error) {
        console.error('Resume processing error:', error);
        // Continue without failing the application
      }
    }

    // Insert application into database
    const { data: insertData, error: insertError } = await supabase
      .from('deputy_applications')
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
        date_of_birth: applicationData.dateOfBirth,
        motivation: applicationData.motivation,
        
        // Position Selection
        position: applicationData.position,
        
        // Qualifications
        has_associate_degree: applicationData.hasAssociateDegree,
        has_bachelors_degree: applicationData.hasBachelorsDegree,
        has_law_enforcement_experience: applicationData.hasLawEnforcementExperience,
        has_military_experience: applicationData.hasMilitaryExperience,
        has_corrections_experience: applicationData.hasCorrectionsExperience,
        has_emt_certification: applicationData.hasEMTCertification,
        has_post_certification: applicationData.hasPOSTCertification,
        
        experience_details: applicationData.experienceDetails,
        availability_slots: applicationData.availabilitySlots,
        
        // Consent
        background_check_consent: applicationData.agreeToBackgroundCheck,
        terms_agreement: applicationData.agreeToTerms,
        
        // Resume
        resume_url: resumeUrl,
        resume_filename: resumeFilename,
        
        // Metadata
        status: applicationData.status,
        ip_address: applicationData.ipAddress,
      })
      .select()
      .single();

    if (insertError) {
      console.error('Database insert error:', insertError);
      return NextResponse.json(
        { message: "Failed to save application. Please try again." },
        { status: 500 }
      );
    }

    // Send confirmation emails
    try {
      // Email to applicant
      await sendEmail({
        to: applicationData.email,
        subject: "Deputy Sheriff Application Interest Received - SF Sheriff's Department",
        html: `
          <h2>Thank you for your application interest, ${applicationData.firstName}!</h2>
          <p>We have received your deputy sheriff application interest form with the following details:</p>
          <ul>
            <li><strong>Application ID:</strong> ${applicationId}</li>
            <li><strong>Qualifications:</strong> ${[
              applicationData.hasAssociateDegree,
              applicationData.hasBachelorsDegree,
              applicationData.hasLawEnforcementExperience,
              applicationData.hasMilitaryExperience,
              applicationData.hasCorrectionsExperience,
              applicationData.hasEMTCertification,
              applicationData.hasPOSTCertification,
            ].filter(Boolean).length} selected</li>
            <li><strong>Availability Slots:</strong> ${validSlots.length} provided</li>
          </ul>
          <p>Our recruitment team will contact you within 2-3 business days during one of your selected availability windows.</p>
          <p>Continue engaging with our platform to earn points and prepare for your law enforcement career!</p>
        `
      });

      // Email to recruitment team (primary)
      const primaryEmail = process.env.RECRUITMENT_EMAIL_PRIMARY || 'recruitment@sfdeputysheriff.com';
      const secondaryEmail = process.env.RECRUITMENT_EMAIL_SECONDARY || 'hr@sfdeputysheriff.com';
      
      await sendEmail({
        to: primaryEmail,
        subject: `New Deputy Sheriff Application Interest - ${applicationData.firstName} ${applicationData.lastName}`,
        html: `
          <h2>New Deputy Sheriff Application Interest</h2>
          <p><strong>Application ID:</strong> ${applicationId}</p>
          
          <h3>Applicant Information:</h3>
          <ul>
            <li><strong>Name:</strong> ${applicationData.firstName} ${applicationData.lastName}</li>
            <li><strong>Email:</strong> ${applicationData.email}</li>
                         <li><strong>Phone:</strong> ${applicationData.phone}</li>
             <li><strong>Date of Birth:</strong> ${applicationData.dateOfBirth}</li>
             <li><strong>Position:</strong> ${applicationData.position === "8302" ? "8302 - Entry-Level Deputy Sheriff" : "8504 - Academy Graduate/Lateral Officer"}</li>
           </ul>
          
          <h3>Qualifications:</h3>
          <ul>
            ${applicationData.hasAssociateDegree ? '<li>✓ Associate\'s Degree or Higher</li>' : ''}
            ${applicationData.hasBachelorsDegree ? '<li>✓ Bachelor\'s Degree or Higher</li>' : ''}
            ${applicationData.hasLawEnforcementExperience ? '<li>✓ Law Enforcement Experience</li>' : ''}
            ${applicationData.hasMilitaryExperience ? '<li>✓ Military Experience</li>' : ''}
            ${applicationData.hasCorrectionsExperience ? '<li>✓ Corrections Experience</li>' : ''}
            ${applicationData.hasEMTCertification ? '<li>✓ EMT Certification</li>' : ''}
            ${applicationData.hasPOSTCertification ? '<li>✓ POST Certification</li>' : ''}
          </ul>
          
          <h3>Availability Slots:</h3>
          <ul>
            ${validSlots.map((slot: { date: string; timeRange: string }) => `<li>${slot.date} - ${slot.timeRange}</li>`).join('')}
          </ul>
          
          <p><strong>Resume Attached:</strong> ${resumeFile ? 'Yes' : 'No'}</p>
          
          <h3>Motivation:</h3>
                     <p>${applicationData.motivation}</p>
         `
      });

      // Email to recruitment team (secondary)
      await sendEmail({
        to: secondaryEmail,
        subject: `New Deputy Sheriff Application Interest - ${applicationData.firstName} ${applicationData.lastName}`,
        html: `
          <h2>New Deputy Sheriff Application Interest</h2>
          <p><strong>Application ID:</strong> ${applicationId}</p>
          
          <h3>Applicant Information:</h3>
          <ul>
            <li><strong>Name:</strong> ${applicationData.firstName} ${applicationData.lastName}</li>
            <li><strong>Email:</strong> ${applicationData.email}</li>
            <li><strong>Phone:</strong> ${applicationData.phone}</li>
            <li><strong>Date of Birth:</strong> ${applicationData.dateOfBirth}</li>
            <li><strong>Position:</strong> ${applicationData.position === "8302" ? "8302 - Entry-Level Deputy Sheriff" : "8504 - Academy Graduate/Lateral Officer"}</li>
          </ul>
          
          <h3>Qualifications:</h3>
          <ul>
            ${applicationData.hasAssociateDegree ? '<li>✓ Associate\'s Degree or Higher</li>' : ''}
            ${applicationData.hasBachelorsDegree ? '<li>✓ Bachelor\'s Degree or Higher</li>' : ''}
            ${applicationData.hasLawEnforcementExperience ? '<li>✓ Law Enforcement Experience</li>' : ''}
            ${applicationData.hasMilitaryExperience ? '<li>✓ Military Experience</li>' : ''}
            ${applicationData.hasCorrectionsExperience ? '<li>✓ Corrections Experience</li>' : ''}
            ${applicationData.hasEMTCertification ? '<li>✓ EMT Certification</li>' : ''}
            ${applicationData.hasPOSTCertification ? '<li>✓ POST Certification</li>' : ''}
          </ul>
          
          <h3>Availability Slots:</h3>
          <ul>
            ${validSlots.map((slot: { date: string; timeRange: string }) => `<li>${slot.date} - ${slot.timeRange}</li>`).join('')}
          </ul>
          
          <p><strong>Resume Attached:</strong> ${resumeFile ? 'Yes' : 'No'}</p>
          
          <h3>Motivation:</h3>
          <p>${applicationData.motivation}</p>
        `
      });
    } catch (emailError) {
      console.error('Email sending error:', emailError);
      // Don't fail the application for email issues
    }

    // Award points for application submission
    try {
      // Get user ID from session or request (we'll need to pass this from the frontend)
      const userId = formData.get('userId') as string;
      
      if (userId) {
        const pointsResponse = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/points`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId,
            action: 'application_submission',
            points: 500,
            description: 'Submitted deputy sheriff application'
          }),
        });

        if (!pointsResponse.ok) {
          console.error('Failed to award application submission points');
        } else {
          const pointsResult = await pointsResponse.json();
          console.log('Successfully awarded 500 points for application submission:', pointsResult);
        }

        // Award application completion badge directly to user_badges table
        try {
          const supabase = getServiceSupabase();
          
          // Check if user already has this badge
          const { data: existingBadge } = await supabase
            .from('user_badges')
            .select('*')
            .eq('user_id', userId)
            .eq('badge_name', 'Application Completed')
            .single();

          if (!existingBadge) {
            // Award the badge
            const { data: newBadge, error: badgeError } = await supabase
              .from('user_badges')
              .insert([
                {
                  user_id: userId,
                  badge_name: 'Application Completed',
                  metadata: {
                    badge_type: 'application-completed',
                    description: 'Completed the full deputy sheriff application process',
                    points_earned: 500,
                    awarded_for: 'Deputy Sheriff Application Completion',
                    application_id: applicationId
                  }
                }
              ])
              .select()
              .single();

            if (badgeError) {
              console.error('Error awarding application completion badge:', badgeError);
            } else {
              console.log('Successfully awarded application completion badge:', newBadge);
            }
          } else {
            console.log('User already has application completion badge');
          }
        } catch (badgeError) {
          console.error('Error in badge awarding process:', badgeError);
        }
      }
    } catch (pointsError) {
      console.error('Error awarding application points:', pointsError);
      // Don't fail the application for points issues
    }

    return NextResponse.json({
      success: true,
      message: "Application submitted successfully",
      applicationId: applicationId,
      redirectUrl: redirectUrl,
      data: insertData
    });

  } catch (error) {
    console.error('Application submission error:', error);
    return NextResponse.json(
      { message: "An unexpected error occurred. Please try again." },
      { status: 500 }
    );
  }
} 