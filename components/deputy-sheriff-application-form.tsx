"use client";

import { useState, useEffect } from "react";
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
import { Badge } from "@/components/ui/badge";
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
  Shield,
  Calendar,
  Clock,
  GraduationCap,
  Award,
  AlertTriangle
} from "lucide-react";
import { toast } from "@/components/ui/use-toast";
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
  dateOfBirth: string;
  motivation: string;
  
  // Position Selection
  position: string;
  
  // Qualifications
  hasAssociateDegree: boolean;
  hasBachelorsDegree: boolean;
  hasLawEnforcementExperience: boolean;
  hasMilitaryExperience: boolean;
  hasCorrectionsExperience: boolean;
  hasEMTCertification: boolean;
  hasPOSTCertification: boolean;
  
  // Experience details
  experienceDetails: string;
  
  // Availability (3 preferred time slots)
  availabilitySlots: Array<{
    date: string;
    timeRange: string;
  }>;
  
  agreeToTerms: boolean;
  agreeToBackgroundCheck: boolean;
}

interface TimeSlot {
  id: string;
  label: string;
  value: string;
}

const timeSlots: TimeSlot[] = [
  { id: "morning", label: "Morning (8:00 AM - 12:00 PM)", value: "8:00 AM - 12:00 PM" },
  { id: "afternoon", label: "Afternoon (12:00 PM - 5:00 PM)", value: "12:00 PM - 5:00 PM" },
  { id: "evening", label: "Evening (5:00 PM - 8:00 PM)", value: "5:00 PM - 8:00 PM" },
];

export function DeputySheriffApplicationForm() {
  const [formData, setFormData] = useState<ApplicationFormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    dateOfBirth: "",
    motivation: "",
    
    position: "",
    
    hasAssociateDegree: false,
    hasBachelorsDegree: false,
    hasLawEnforcementExperience: false,
    hasMilitaryExperience: false,
    hasCorrectionsExperience: false,
    hasEMTCertification: false,
    hasPOSTCertification: false,
    
    experienceDetails: "",
    
    availabilitySlots: [
      { date: "", timeRange: "" },
      { date: "", timeRange: "" },
      { date: "", timeRange: "" },
    ],
    
    agreeToTerms: false,
    agreeToBackgroundCheck: false,
  });

  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [applicationId, setApplicationId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [redirectUrl, setRedirectUrl] = useState<string | null>(null);

  const handleInputChange = (field: keyof ApplicationFormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAvailabilityChange = (index: number, field: 'date' | 'timeRange', value: string) => {
    setFormData(prev => ({
      ...prev,
      availabilitySlots: prev.availabilitySlots.map((slot, i) => 
        i === index ? { ...slot, [field]: value } : slot
      )
    }));
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
      'firstName', 'lastName', 'email', 'phone', 'dateOfBirth', 'motivation', 'position'
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

    // Validate that at least one availability slot is filled
    const validSlots = formData.availabilitySlots.filter(slot => slot.date && slot.timeRange);
    if (validSlots.length === 0) {
      toast({
        title: "Availability required",
        description: "Please provide at least one availability slot for our recruiter to contact you.",
        variant: "destructive",
      });
      return false;
    }

    if (!formData.agreeToTerms) {
      toast({
        title: "Terms agreement required",
        description: "You must agree to the terms and conditions.",
        variant: "destructive",
      });
      return false;
    }

    if (!formData.agreeToBackgroundCheck) {
      toast({
        title: "Background check consent required",
        description: "You must consent to background check for law enforcement positions.",
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

    // Age validation (must be 18+)
    const birthDate = new Date(formData.dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    if (age < 18) {
      toast({
        title: "Age requirement",
        description: "You must be at least 18 years old to apply for a deputy sheriff position.",
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
        if (key === 'availabilitySlots') {
          submitFormData.append(key, JSON.stringify(value));
        } else {
          submitFormData.append(key, value.toString());
        }
      });
      
      // Add resume file if attached
      if (resumeFile) {
        submitFormData.append('resume', resumeFile);
      }

      // Add metadata
      submitFormData.append('userType', 'recruit');
      submitFormData.append('applicationDate', new Date().toISOString());
      submitFormData.append('status', 'pending');
      
      // Submit to API
      const response = await fetch("/api/deputy-applications/submit", {
        method: "POST",
        body: submitFormData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to submit application");
      }

      // Success
      setApplicationId(data.applicationId);
      setRedirectUrl(data.redirectUrl);
      setIsSubmitted(true);
      
      toast({
        title: "Application submitted successfully!",
        description: "We'll contact you during your selected availability window within 2-3 business days.",
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

  // Get minimum date (today)
  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  // Get maximum date (30 days from today)
  const getMaxDate = () => {
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 30);
    return maxDate.toISOString().split('T')[0];
  };

  // Count qualifications
  const qualificationCount = [
    formData.hasAssociateDegree,
    formData.hasBachelorsDegree,
    formData.hasLawEnforcementExperience,
    formData.hasMilitaryExperience,
    formData.hasCorrectionsExperience,
    formData.hasEMTCertification,
    formData.hasPOSTCertification,
  ].filter(Boolean).length;

  // Auto-redirect countdown effect
  useEffect(() => {
    if (isSubmitted && redirectUrl) {
      let countdown = 10;
      const timer = setInterval(() => {
        const countdownElement = document.getElementById('countdown');
        if (countdownElement) {
          countdownElement.textContent = countdown.toString();
        }
        countdown--;
        if (countdown < 0) {
          clearInterval(timer);
          window.location.href = redirectUrl;
        }
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [isSubmitted, redirectUrl]);

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
            <AlertTitle className="text-green-800">Thank you for your interest!</AlertTitle>
            <AlertDescription className="text-green-700">
              Your deputy sheriff application interest form has been submitted and our recruitment team will contact you soon.
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
              <li>Our recruitment team will review your application and qualifications</li>
              <li>You'll receive a call during one of your selected availability windows</li>
              <li>We'll discuss the next steps in the deputy sheriff application process</li>
              <li>If qualified, you'll be guided through the official application process</li>
              <li>Continue engaging with our platform to earn points and prepare for assessments</li>
            </ul>
          </div>

          <div className="space-y-4">
            {redirectUrl && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h4 className="font-medium text-yellow-900 mb-2">🎯 Next Step: Official Application</h4>
                <p className="text-yellow-800 text-sm mb-3">
                  You'll be redirected to the official SF careers page to complete your {formData.position === "8302" ? "Entry-Level Deputy Sheriff" : "Academy Graduate/Lateral Officer"} application in <span id="countdown">10</span> seconds.
                </p>
                <Button 
                  onClick={() => window.location.href = redirectUrl}
                  className="bg-yellow-600 hover:bg-yellow-700 text-white"
                >
                  Go to Official Application Now →
                </Button>
              </div>
            )}
            
            <div className="flex gap-4">
              <Button 
                onClick={() => window.location.href = "/roadmap"}
                variant="outline"
              >
                View Roadmap
              </Button>
              <Button 
                onClick={() => window.location.href = "/"}
                variant="outline"
              >
                Return to Home
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Shield className="h-6 w-6 mr-2 text-[#0A3C1F]" />
          Deputy Sheriff Application Interest
        </CardTitle>
        <p className="text-gray-600">
          Express your interest in becoming a San Francisco Deputy Sheriff. Our recruitment team will contact you 
          to discuss opportunities and guide you through the application process.
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

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Personal Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-[#0A3C1F] border-b pb-2">
              <User className="h-5 w-5 inline mr-2" />
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

            <div className="space-y-2">
              <Label htmlFor="dateOfBirth">
                Date of Birth <span className="text-red-500">*</span>
                <span className="text-sm text-gray-500 ml-2">(Must be 18+ years old)</span>
              </Label>
              <Input
                id="dateOfBirth"
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                max={new Date(new Date().setFullYear(new Date().getFullYear() - 18)).toISOString().split('T')[0]}
                required
              />
            </div>
          </div>

          {/* Position Selection */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-[#0A3C1F] border-b pb-2">
              <Shield className="h-5 w-5 inline mr-2" />
              Position Selection
            </h3>
            
            <div className="space-y-2">
              <Label htmlFor="position">
                Which position are you applying for? <span className="text-red-500">*</span>
              </Label>
              <Select onValueChange={(value) => handleInputChange('position', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select the position you're interested in" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="8302">
                    <div className="space-y-1">
                      <div className="font-medium">8302 - Entry-Level Deputy Sheriff</div>
                      <div className="text-sm text-gray-600">No prior law enforcement experience required • $91,182 - $116,428</div>
                    </div>
                  </SelectItem>
                  <SelectItem value="8504">
                    <div className="space-y-1">
                      <div className="font-medium">8504 - Academy Graduate/Lateral Officer</div>
                      <div className="text-sm text-gray-600">Requires POST certification • $91,182 - $141,362</div>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
              
              {formData.position && (
                <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-blue-900">
                        {formData.position === "8302" ? "Entry-Level Deputy Sheriff (8302)" : "Academy Graduate/Lateral Officer (8504)"}
                      </h4>
                      <p className="text-sm text-blue-800 mt-1">
                        {formData.position === "8302" 
                          ? "Perfect for candidates new to law enforcement. You'll complete POST Basic Academy training as part of the hiring process." 
                          : "For candidates with existing POST certification or law enforcement experience. Faster entry into the role."
                        }
                      </p>
                      <p className="text-xs text-blue-700 mt-2">
                        📍 After submission, you'll be redirected to the official SF careers application page for this position.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Address Information (Optional) */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-[#0A3C1F] border-b pb-2">
              <MapPin className="h-5 w-5 inline mr-2" />
              Address Information (Optional)
            </h3>
            
            <div className="space-y-2">
              <Label htmlFor="address">Street Address</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                placeholder="123 Main Street"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  placeholder="San Francisco"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="state">State</Label>
                <Select onValueChange={(value) => handleInputChange('state', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select state" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CA">California</SelectItem>
                    <SelectItem value="NV">Nevada</SelectItem>
                    <SelectItem value="OR">Oregon</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="zipCode">ZIP Code</Label>
                <Input
                  id="zipCode"
                  value={formData.zipCode}
                  onChange={(e) => handleInputChange('zipCode', e.target.value)}
                  placeholder="94102"
                />
              </div>
            </div>
          </div>

          {/* Qualifications */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-[#0A3C1F] border-b pb-2">
                <GraduationCap className="h-5 w-5 inline mr-2" />
                Qualifications & Experience
              </h3>
              <Badge variant="outline" className="text-[#0A3C1F]">
                {qualificationCount} selected
              </Badge>
            </div>
            
            <p className="text-sm text-gray-600 mb-4">
              Please check all that apply to you. This helps us understand your background and qualifications.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="hasAssociateDegree"
                    checked={formData.hasAssociateDegree}
                    onCheckedChange={(checked) => handleInputChange('hasAssociateDegree', checked as boolean)}
                  />
                  <Label htmlFor="hasAssociateDegree" className="font-medium">
                    Associate's Degree or Higher
                  </Label>
                </div>

                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="hasBachelorsDegree"
                    checked={formData.hasBachelorsDegree}
                    onCheckedChange={(checked) => handleInputChange('hasBachelorsDegree', checked as boolean)}
                  />
                  <Label htmlFor="hasBachelorsDegree" className="font-medium">
                    Bachelor's Degree or Higher
                  </Label>
                </div>

                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="hasLawEnforcementExperience"
                    checked={formData.hasLawEnforcementExperience}
                    onCheckedChange={(checked) => handleInputChange('hasLawEnforcementExperience', checked as boolean)}
                  />
                  <Label htmlFor="hasLawEnforcementExperience" className="font-medium">
                    Law Enforcement Experience
                  </Label>
                </div>

                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="hasMilitaryExperience"
                    checked={formData.hasMilitaryExperience}
                    onCheckedChange={(checked) => handleInputChange('hasMilitaryExperience', checked as boolean)}
                  />
                  <Label htmlFor="hasMilitaryExperience" className="font-medium">
                    Military Experience
                  </Label>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="hasCorrectionsExperience"
                    checked={formData.hasCorrectionsExperience}
                    onCheckedChange={(checked) => handleInputChange('hasCorrectionsExperience', checked as boolean)}
                  />
                  <Label htmlFor="hasCorrectionsExperience" className="font-medium">
                    Corrections Experience
                  </Label>
                </div>

                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="hasEMTCertification"
                    checked={formData.hasEMTCertification}
                    onCheckedChange={(checked) => handleInputChange('hasEMTCertification', checked as boolean)}
                  />
                  <Label htmlFor="hasEMTCertification" className="font-medium">
                    Emergency Medical Technician (EMT) Certification
                  </Label>
                </div>

                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="hasPOSTCertification"
                    checked={formData.hasPOSTCertification}
                    onCheckedChange={(checked) => handleInputChange('hasPOSTCertification', checked as boolean)}
                  />
                  <Label htmlFor="hasPOSTCertification" className="font-medium">
                    POST Basic or Higher Certification
                  </Label>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="experienceDetails">
                Experience Details (Optional)
              </Label>
              <Textarea
                id="experienceDetails"
                value={formData.experienceDetails}
                onChange={(e) => handleInputChange('experienceDetails', e.target.value)}
                placeholder="Please provide details about your relevant experience, education, or certifications..."
                rows={3}
              />
            </div>
          </div>

          {/* Motivation */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-[#0A3C1F] border-b pb-2">
              Motivation & Interest
            </h3>
            
            <div className="space-y-2">
              <Label htmlFor="motivation">
                Why are you interested in becoming a Deputy Sheriff? <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="motivation"
                value={formData.motivation}
                onChange={(e) => handleInputChange('motivation', e.target.value)}
                placeholder="Tell us about your motivation for joining the San Francisco Sheriff's Department and how you want to serve the community..."
                rows={4}
                required
              />
            </div>
          </div>

          {/* Availability Calendar */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-[#0A3C1F] border-b pb-2">
              <Calendar className="h-5 w-5 inline mr-2" />
              Availability for Recruiter Contact
            </h3>
            
            <p className="text-sm text-gray-600">
              Please provide 3 dates and time ranges when our recruiter can contact you. We'll call during one of these windows.
            </p>

            <div className="space-y-4">
              {formData.availabilitySlots.map((slot, index) => (
                <div key={index} className="border rounded-lg p-4 bg-gray-50">
                  <h4 className="font-medium mb-3">
                    Option {index + 1} {index === 0 && <span className="text-red-500">*</span>}
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor={`date-${index}`}>
                        <Calendar className="h-4 w-4 inline mr-1" />
                        Preferred Date
                      </Label>
                      <Input
                        id={`date-${index}`}
                        type="date"
                        value={slot.date}
                        onChange={(e) => handleAvailabilityChange(index, 'date', e.target.value)}
                        min={getMinDate()}
                        max={getMaxDate()}
                        required={index === 0}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`time-${index}`}>
                        <Clock className="h-4 w-4 inline mr-1" />
                        Time Range
                      </Label>
                      <Select onValueChange={(value) => handleAvailabilityChange(index, 'timeRange', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select time range" />
                        </SelectTrigger>
                        <SelectContent>
                          {timeSlots.map((timeSlot) => (
                            <SelectItem key={timeSlot.id} value={timeSlot.value}>
                              {timeSlot.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Resume Upload */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-[#0A3C1F] border-b pb-2">
              <FileText className="h-5 w-5 inline mr-2" />
              Resume Upload (Optional)
            </h3>
            
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
              {resumeFile ? (
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <FileText className="h-8 w-8 text-green-600 mr-3" />
                    <div>
                      <p className="font-medium">{resumeFile.name}</p>
                      <p className="text-sm text-gray-500">
                        {(resumeFile.size / (1024 * 1024)).toFixed(1)} MB
                      </p>
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={removeResumeFile}
                  >
                    <X className="h-4 w-4 mr-1" />
                    Remove
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

          {/* Consent and Agreement */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-[#0A3C1F] border-b pb-2">
              <AlertTriangle className="h-5 w-5 inline mr-2" />
              Consent and Agreement
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <Checkbox
                  id="agreeToBackgroundCheck"
                  checked={formData.agreeToBackgroundCheck}
                  onCheckedChange={(checked) => handleInputChange('agreeToBackgroundCheck', checked as boolean)}
                />
                <div className="space-y-1">
                  <Label
                    htmlFor="agreeToBackgroundCheck"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Background Check Consent <span className="text-red-500">*</span>
                  </Label>
                  <p className="text-xs text-gray-600">
                    I understand and consent to background check requirements for law enforcement positions,
                    including criminal history, employment verification, and reference checks.
                  </p>
                </div>
              </div>

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
          <div className="space-y-4">
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
                  <Shield className="mr-2 h-4 w-4" />
                  Submit Application Interest
                </>
              )}
            </Button>
          </div>

          <div className="text-center text-sm text-gray-600">
            <p>
              Our recruitment team will contact you within 2-3 business days during your selected availability window.
              Continue engaging with our platform to earn points and prepare for your law enforcement career!
            </p>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}