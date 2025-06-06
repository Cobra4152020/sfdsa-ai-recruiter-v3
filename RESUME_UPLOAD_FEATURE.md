# Resume Upload Feature for Volunteer Recruiter Portal

## Overview
The volunteer recruiter portal now supports resume attachment functionality, allowing volunteer recruiters to attach potential recruits' resumes when contacting them through the system.

## Features Implemented

### Frontend (components/recruiter-contact-form.tsx)
- ✅ **File Upload Interface**: Drag-and-drop style file upload area
- ✅ **File Validation**: 
  - Accepts PDF, DOC, and DOCX files only
  - Maximum file size: 5MB
  - Real-time validation with user feedback
- ✅ **File Preview**: Shows selected file name and size before upload
- ✅ **File Removal**: Option to remove selected file before submission
- ✅ **Visual Feedback**: Toast notifications for upload status

### Backend (app/api/volunteer-recruiter/send-contact/route.ts)
- ✅ **FormData Handling**: Updated to handle multipart form data with files
- ✅ **File Storage**: Secure upload to Supabase Storage bucket `volunteer-documents`
- ✅ **Database Integration**: Resume metadata stored in `volunteer_referrals` table
- ✅ **Email Integration**: 
  - Resume information included in recruitment emails
  - Direct download links sent to recruitment team
  - Admin notifications include resume attachments

### Database Schema (supabase/migrations/add_resume_fields_to_volunteer_referrals.sql)
- ✅ **New Columns Added**:
  - `resume_url`: URL to uploaded resume file
  - `resume_filename`: Original filename for reference
  - `tracking_id`: Enhanced tracking for referral campaigns
- ✅ **Performance Optimizations**: Indexes added for better query performance

## User Experience

### For Volunteer Recruiters:
1. Navigate to volunteer recruiter portal → "Contact Recruits" tab
2. Fill out recruit information (name, email, phone, message)
3. **NEW**: Click "Choose Resume File" to attach recruit's resume
4. File validation ensures only appropriate file types/sizes
5. Submit form to send personalized email with resume to recruitment team

### For Recruitment Team:
1. Receives email notification with recruit details
2. **NEW**: Direct download link to attached resume (if provided)
3. Resume files stored securely in Supabase Storage
4. All data tracked in database for follow-up

## Technical Implementation

### File Storage Structure
```
supabase-storage/
└── volunteer-documents/
    └── volunteer-resumes/
        ├── 1733515234567-abc123.pdf
        ├── 1733515789012-def456.docx
        └── ...
```

### Security Features
- ✅ File type validation (PDF, DOC, DOCX only)
- ✅ File size limits (5MB maximum)
- ✅ Unique filename generation to prevent conflicts
- ✅ Secure storage with proper access controls
- ✅ Resume URLs only accessible to recruitment team

### Error Handling
- ✅ Invalid file type rejection with user feedback
- ✅ File size validation with clear error messages
- ✅ Network error handling during upload
- ✅ Database error recovery
- ✅ Email delivery failure handling

## Usage Statistics
The system tracks:
- Number of referrals with vs. without resumes
- Resume file types and sizes
- Download activity by recruitment team
- Conversion rates for resume vs. non-resume referrals

## Future Enhancements
Consider adding:
- [ ] Resume preview functionality
- [ ] Bulk resume upload for multiple candidates
- [ ] Resume parsing for automatic field population
- [ ] Integration with ATS (Applicant Tracking System)
- [ ] Resume format standardization tools

## Testing
✅ **Build Verification**: Application builds successfully with new features
✅ **File Upload**: Tested with various file types and sizes
✅ **Database Schema**: Migration successfully adds required columns
✅ **Email Integration**: Resume links properly included in notifications

## Deployment Notes
1. Ensure Supabase Storage bucket `volunteer-documents` exists
2. Run database migration: `add_resume_fields_to_volunteer_referrals.sql`
3. Configure proper storage policies for volunteer recruiters
4. Test email delivery with resume attachments

---

**Last Updated**: December 6, 2024  
**Feature Status**: ✅ Implemented and Ready for Production 