"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  CheckCircle, 
  Loader2, 
  AlertCircle, 
  Paperclip, 
  FileText, 
  X,
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase 
} from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { SocialShareForPoints } from "@/components/social-share-for-points";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface ApplicationFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  experience: string;
  motivation: string;
  availability: string;
  agreeToTerms: boolean;
}

export function VolunteerApplicationForm() {
  const [formData, setFormData] = useState<ApplicationFormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    experience: "",
    motivation: "",
    availability: "",
    agreeToTerms: false,
  });

  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [applicationId, setApplicationId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

  const handleInputChange = (field: keyof ApplicationFormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleResumeUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type (PDF, DOC, DOCX)
      const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ];
      
      if (!allowedTypes.includes(file.type)) {
        toast({
          title: "Invalid file type",
          description: "Please upload a PDF, DOC, or DOCX file.",
          variant: "destructive",
        });
        return;
      }

      // Validate file size (max 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB in bytes
      if (file.size > maxSize) {
        toast({
          title: "File too large",
          description: "Please upload a file smaller than 5MB.",
          variant: "destructive",
        });
        return;
      }

      setResumeFile(file);
      toast({
        title: "Resume attached",
        description: `${file.name} has been attached successfully.`,
      });
    }
  };

  const removeResumeFile = () => {
    setResumeFile(null);
    const fileInput = document.getElementById('resume-upload') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  };

  const validateForm = (): boolean => {
    const requiredFields: (keyof ApplicationFormData)[] = [
      'firstName', 'lastName', 'email', 'phone', 'motivation', 'availability'
    ];

    for (const field of requiredFields) {
      if (!formData[field]) {
        toast({
          title: "Missing required field",
          description: `Please fill in ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}.`,
          variant: "destructive",
        });
        return false;
      }
    }

    if (!formData.agreeToTerms) {
      toast({
        title: "Terms agreement required",
        description: "You must agree to the terms and conditions.",
        variant: "destructive",
      });
      return false;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      // Prepare form data for submission
      const submitFormData = new FormData();
      
      // Add all form fields
      Object.entries(formData).forEach(([key, value]) => {
        submitFormData.append(key, value.toString());
      });
      
      // Add resume file if attached
      if (resumeFile) {
        submitFormData.append('resume', resumeFile);
      }

      // Add metadata
      submitFormData.append('userType', 'volunteer');
      submitFormData.append('applicationDate', new Date().toISOString());
      submitFormData.append('status', 'pending');
      
      // Add IP address for logging
      submitFormData.append('ipAddress', 'client-side'); // Will be replaced by server

      // Submit to API
      const response = await fetch("/api/volunteer-applications/submit", {
        method: "POST",
        body: submitFormData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to submit application");
      }

      // Success
      setApplicationId(data.applicationId);
      setIsSubmitted(true);
      
      toast({
        title: "Application submitted successfully!",
        description: "We'll review your application and contact you within 3-5 business days.",
      });

    } catch (error) {
      console.error("Application submission error:", error);
      setErrorMessage(
        error instanceof Error ? error.message : "An unexpected error occurred"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center text-green-700">
            <CheckCircle className="h-6 w-6 mr-2" />
            Application Submitted Successfully
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert className="bg-green-50 border-green-200">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertTitle className="text-green-800">Thank you!</AlertTitle>
            <AlertDescription className="text-green-700">
              Your volunteer recruiter application has been submitted and is under review.
            </AlertDescription>
          </Alert>
          
          {applicationId && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 mb-2">Application Reference</h4>
              <p className="text-blue-800 font-mono text-sm">{applicationId}</p>
              <p className="text-blue-700 text-xs mt-1">
                Please save this reference number for your records.
              </p>
            </div>
          )}

          <div className="space-y-2">
            <h4 className="font-medium">What happens next?</h4>
            <ul className="list-disc pl-6 space-y-1 text-sm text-gray-600">
              <li>Our team will review your application and resume</li>
              <li>We may contact you for additional information or an interview</li>
              <li>You'll receive an email notification regarding your application status</li>
              <li>If approved, you'll receive login credentials and access to the volunteer recruiter portal</li>
            </ul>
          </div>

          {/* Social Sharing for Points */}
          <div className="space-y-4">
            <SocialShareForPoints 
              pointsToEarn={500}
              shareType="application_submitted"
              customMessage="Just applied to become a volunteer recruiter for the San Francisco Sheriff's Department! 🚔⭐ Help us build a stronger community. Learn more: https://www.sfdeputysheriff.com #SFSheriff #Volunteer #CommunityService"
            />
          </div>

          <div className="flex justify-center">
            <Button 
              onClick={() => window.location.href = "/"}
              variant="outline"
            >
              Return to Home
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center">
          <User className="h-6 w-6 mr-2 text-[#0A3C1F]" />
          Volunteer Recruiter Application
        </CardTitle>
        <p className="text-gray-600">
          Apply to become a volunteer recruiter for the San Francisco Sheriff's Department. 
          All applications require admin approval before access is granted.
        </p>
      </CardHeader>
      
      <CardContent>
        {errorMessage && (
          <Alert className="mb-6 bg-red-50 border-red-200" variant="destructive">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertTitle className="text-red-800">Application Error</AlertTitle>
            <AlertDescription className="text-red-700">
              {errorMessage}
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-[#0A3C1F] border-b pb-2">
              Personal Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">
                  First Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  placeholder="John"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName">
                  Last Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  placeholder="Doe"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">
                  <Mail className="h-4 w-4 inline mr-1" />
                  Email Address <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="john.doe@example.com"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">
                  <Phone className="h-4 w-4 inline mr-1" />
                  Phone Number <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="(555) 123-4567"
                  required
                />
              </div>
            </div>
          </div>

          {/* Address Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-[#0A3C1F] border-b pb-2">
              <MapPin className="h-5 w-5 inline mr-2" />
              Address Information
            </h3>
            
            <div className="space-y-2">
              <Label htmlFor="address">
                Street Address
              </Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                placeholder="123 Main Street"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">
                  City
                </Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  placeholder="San Francisco"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="state">
                  State
                </Label>
                <Select onValueChange={(value) => handleInputChange('state', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select state" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CA">California</SelectItem>
                    <SelectItem value="NY">New York</SelectItem>
                    <SelectItem value="TX">Texas</SelectItem>
                    <SelectItem value="FL">Florida</SelectItem>
                    {/* Add more states as needed */}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="zipCode">
                  ZIP Code
                </Label>
                <Input
                  id="zipCode"
                  value={formData.zipCode}
                  onChange={(e) => handleInputChange('zipCode', e.target.value)}
                  placeholder="94102"
                />
              </div>
            </div>
          </div>

          {/* Professional Background */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-[#0A3C1F] border-b pb-2">
              <Briefcase className="h-5 w-5 inline mr-2" />
              Professional Background
            </h3>
            
            <div className="space-y-2">
              <Label htmlFor="experience">
                Relevant Experience
              </Label>
              <Textarea
                id="experience"
                value={formData.experience}
                onChange={(e) => handleInputChange('experience', e.target.value)}
                placeholder="Describe any relevant experience in law enforcement, recruitment, sales, or community outreach..."
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="motivation">
                Why do you want to become a volunteer recruiter? <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="motivation"
                value={formData.motivation}
                onChange={(e) => handleInputChange('motivation', e.target.value)}
                placeholder="Tell us about your motivation for helping recruit new deputies for the San Francisco Sheriff's Department..."
                rows={4}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="availability">
                Availability <span className="text-red-500">*</span>
              </Label>
              <Select onValueChange={(value) => handleInputChange('availability', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your availability" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="full-time">Full-time (20+ hours/week)</SelectItem>
                  <SelectItem value="part-time">Part-time (10-20 hours/week)</SelectItem>
                  <SelectItem value="flexible">Flexible (5-10 hours/week)</SelectItem>
                  <SelectItem value="minimal">Minimal (1-5 hours/week)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Resume Upload */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-[#0A3C1F] border-b pb-2">
              Supporting Documents
            </h3>
            
            <div className="space-y-2">
              <Label htmlFor="resume-upload">
                Resume/CV (Optional)
              </Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                {resumeFile ? (
                  <div className="flex items-center justify-between bg-gray-50 p-3 rounded-md">
                    <div className="flex items-center space-x-2">
                      <FileText className="h-5 w-5 text-blue-600" />
                      <span className="text-sm font-medium">{resumeFile.name}</span>
                      <span className="text-xs text-gray-500">
                        ({(resumeFile.size / 1024 / 1024).toFixed(2)} MB)
                      </span>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={removeResumeFile}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="text-center">
                    <Paperclip className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="mt-4">
                      <Label
                        htmlFor="resume-upload"
                        className="cursor-pointer inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-gray-50 h-10 px-4 py-2"
                      >
                        <Paperclip className="h-4 w-4 mr-2" />
                        Choose Resume File
                      </Label>
                      <Input
                        id="resume-upload"
                        type="file"
                        accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                        onChange={handleResumeUpload}
                        className="hidden"
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      PDF, DOC, or DOCX files up to 5MB. Optional but recommended.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Consent and Agreement */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-[#0A3C1F] border-b pb-2">
              Consent and Agreement
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <Checkbox
                  id="agreeToTerms"
                  checked={formData.agreeToTerms}
                  onCheckedChange={(checked) => handleInputChange('agreeToTerms', checked as boolean)}
                />
                <div className="space-y-1">
                  <Label
                    htmlFor="agreeToTerms"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Terms and Conditions <span className="text-red-500">*</span>
                  </Label>
                  <p className="text-xs text-gray-600">
                    I agree to the{" "}
                    <a href="/terms-of-service" className="text-[#0A3C1F] hover:underline">
                      terms and conditions
                    </a>{" "}
                    and{" "}
                    <a href="/privacy-policy" className="text-[#0A3C1F] hover:underline">
                      privacy policy
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-6">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#0A3C1F] hover:bg-[#0A3C1F]/90 h-12"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting Application...
                </>
              ) : (
                <>
                  <User className="mr-2 h-4 w-4" />
                  Submit Application for Review
                </>
              )}
            </Button>
          </div>

          <div className="text-center text-sm text-gray-600">
            <p>
              Your application will be reviewed by our team within 3-5 business days.
              You'll receive an email notification regarding your application status.
            </p>
          </div>
        </form>
      </CardContent>
    </Card>
  );
} 