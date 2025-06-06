"use client";

import type React from "react";
import type { Metadata } from "next";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";
import { 
  Send, 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  MessageSquare, 
  HelpCircle, 
  Star,
  Users,
  Shield,
  AlertCircle,
  CheckCircle,
  ExternalLink,
  Gamepad2
} from "lucide-react";
import { PageWrapper } from "@/components/page-wrapper";
import { useUser } from "@/context/user-context";
import { useAuthModal } from "@/context/auth-modal-context";
import Link from "next/link";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const metadata: Metadata = {
  title: "Contact Us | SF Deputy Sheriff Recruitment",
  description: "Have questions about joining the San Francisco Sheriff's Department? Contact our recruitment team for personalized assistance with the application process.",
  keywords: "contact SF sheriff, recruitment questions, deputy sheriff application help, San Francisco law enforcement contact",
  openGraph: {
    title: "Contact SF Deputy Sheriff Recruitment Team",
    description: "Get answers to your questions about becoming a deputy sheriff in San Francisco",
    type: "website",
  },
};

export default function ContactPage() {
  const { currentUser } = useUser();
  const { openModal } = useAuthModal();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
    contactReason: "general",
    urgency: "normal"
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submissionCount, setSubmissionCount] = useState(0);

  // Track form submissions for enhanced user experience
  useEffect(() => {
    const storedCount = localStorage.getItem('contact_form_submissions');
    if (storedCount) {
      setSubmissionCount(parseInt(storedCount, 10));
    }
  }, []);

  const contactReasons = [
    { value: "general", label: "General Inquiry" },
    { value: "application", label: "Application Process" },
    { value: "requirements", label: "Requirements & Qualifications" },
    { value: "training", label: "Training & Academy" },
    { value: "benefits", label: "Salary & Benefits" },
    { value: "technical", label: "Technical Support" },
    { value: "recruitment", label: "Recruitment Events" },
    { value: "other", label: "Other" }
  ];

  const urgencyLevels = [
    { value: "low", label: "Low - General Information" },
    { value: "normal", label: "Normal - Standard Inquiry" },
    { value: "high", label: "High - Time Sensitive" },
    { value: "urgent", label: "Urgent - Immediate Response Needed" }
  ];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    if (!formData.subject.trim()) {
      newErrors.subject = "Subject is required";
    }
    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    } else if (formData.message.length < 10) {
      newErrors.message = "Message must be at least 10 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast({
        title: "Form Validation Error",
        description: "Please check the form and correct any errors.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Real API call to contact endpoint
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          userId: currentUser?.id,
          timestamp: new Date().toISOString(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to send message");
      }

      // Award points for contact form submission
      if (currentUser) {
        try {
          await fetch("/api/demo-user-points", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              userId: currentUser.id,
              action: "contact_form_submission",
              points: 10,
            }),
          });
        } catch (pointsError) {
          console.error("Error awarding points:", pointsError);
        }
      }

      toast({
        title: "Message Sent Successfully! 🎉",
        description: `Thank you for contacting us! We'll respond within ${getResponseTime(formData.urgency)}. ${currentUser ? '+10 points earned!' : ''}`,
      });

      // Track successful submission
      const newCount = submissionCount + 1;
      setSubmissionCount(newCount);
      localStorage.setItem('contact_form_submissions', newCount.toString());

      // Reset form
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
        contactReason: "general",
        urgency: "normal"
      });

    } catch (error) {
      console.error("Contact form error:", error);
      toast({
        title: "Error Sending Message",
        description: error instanceof Error ? error.message : "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getResponseTime = (urgency: string) => {
    switch (urgency) {
      case "urgent": return "4 hours";
      case "high": return "24 hours";
      case "normal": return "2-3 business days";
      case "low": return "3-5 business days";
      default: return "2-3 business days";
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "urgent": return "bg-red-100 text-red-800 border-red-200";
      case "high": return "bg-orange-100 text-orange-800 border-orange-200";
      case "normal": return "bg-blue-100 text-blue-800 border-blue-200";
      case "low": return "bg-gray-100 text-gray-800 border-gray-200";
      default: return "bg-blue-100 text-blue-800 border-blue-200";
    }
  };

  return (
    <PageWrapper>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-[#0A3C1F] to-[#0A3C1F]/80 bg-clip-text text-transparent mb-6">
              📞 Contact Us
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-8">
              Have questions about the recruitment process? We're here to help you every step of the way. 
              {currentUser ? " Earn 10 points for submitting a contact form!" : " Sign in to earn points for your engagement!"}
              {submissionCount > 0 && (
                <span className="block text-sm text-blue-600 mt-2">
                  Welcome back! You've successfully contacted us {submissionCount} time{submissionCount !== 1 ? 's' : ''} before.
                </span>
              )}
            </p>

            {/* Quick Stats */}
            <div className="bg-gradient-to-r from-[#0A3C1F]/10 to-transparent border border-[#0A3C1F]/20 rounded-lg p-6 mb-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                <div>
                  <div className="text-3xl font-bold text-[#0A3C1F]">24/7</div>
                  <div className="text-sm text-gray-600 font-medium">Online Support</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-[#0A3C1F]">4hr</div>
                  <div className="text-sm text-gray-600 font-medium">Urgent Response</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-[#0A3C1F]">8</div>
                  <div className="text-sm text-gray-600 font-medium">Contact Methods</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-[#0A3C1F]">95%</div>
                  <div className="text-sm text-gray-600 font-medium">Satisfaction Rate</div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Enhanced Contact Form */}
            <div className="lg:col-span-2">
              <Card className="shadow-lg">
                <CardHeader className="bg-gradient-to-r from-[#0A3C1F] to-[#0A3C1F]/90 text-white">
                  <CardTitle className="flex items-center text-xl">
                    <MessageSquare className="h-6 w-6 mr-3" />
                    Send Us a Message
                    {currentUser && (
                      <Badge variant="secondary" className="ml-auto bg-white/20 text-white border-white/30">
                        <Star className="h-3 w-3 mr-1" />
                        +10 Points
                      </Badge>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Name Fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          First Name <span className="text-red-500">*</span>
                        </label>
                        <Input
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleChange}
                          required
                          placeholder="Enter your first name"
                          className={errors.firstName ? "border-red-500" : ""}
                        />
                        {errors.firstName && (
                          <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Last Name <span className="text-red-500">*</span>
                        </label>
                        <Input
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleChange}
                          required
                          placeholder="Enter your last name"
                          className={errors.lastName ? "border-red-500" : ""}
                        />
                        {errors.lastName && (
                          <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>
                        )}
                      </div>
                    </div>

                    {/* Contact Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email Address <span className="text-red-500">*</span>
                        </label>
                        <Input
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          placeholder="Enter your email address"
                          className={errors.email ? "border-red-500" : ""}
                        />
                        {errors.email && (
                          <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Phone Number (Optional)
                        </label>
                        <Input
                          name="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="(415) 555-0123"
                        />
                      </div>
                    </div>

                    {/* Contact Reason & Urgency */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Contact Reason
                        </label>
                        <Select 
                          value={formData.contactReason} 
                          onValueChange={(value) => handleSelectChange("contactReason", value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select a reason" />
                          </SelectTrigger>
                          <SelectContent>
                            {contactReasons.map((reason) => (
                              <SelectItem key={reason.value} value={reason.value}>
                                {reason.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Urgency Level
                        </label>
                        <Select 
                          value={formData.urgency} 
                          onValueChange={(value) => handleSelectChange("urgency", value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select urgency" />
                          </SelectTrigger>
                          <SelectContent>
                            {urgencyLevels.map((level) => (
                              <SelectItem key={level.value} value={level.value}>
                                {level.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <div className="mt-2">
                          <Badge variant="outline" className={getUrgencyColor(formData.urgency)}>
                            Expected Response: {getResponseTime(formData.urgency)}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    {/* Subject */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Subject <span className="text-red-500">*</span>
                      </label>
                      <Input
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        placeholder="Brief description of your inquiry"
                        className={errors.subject ? "border-red-500" : ""}
                      />
                      {errors.subject && (
                        <p className="text-red-500 text-xs mt-1">{errors.subject}</p>
                      )}
                    </div>

                    {/* Message */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Message <span className="text-red-500">*</span>
                      </label>
                      <Textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        placeholder="Please provide detailed information about your inquiry..."
                        className={`min-h-[150px] ${errors.message ? "border-red-500" : ""}`}
                      />
                      {errors.message && (
                        <p className="text-red-500 text-xs mt-1">{errors.message}</p>
                      )}
                      <p className="text-xs text-gray-500 mt-1">
                        {formData.message.length}/1000 characters
                      </p>
                    </div>

                    {/* Auth Prompt for Non-Users */}
                    {!currentUser && (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div className="flex items-center">
                          <AlertCircle className="h-5 w-5 text-blue-600 mr-2" />
                          <div>
                            <p className="text-sm font-medium text-blue-900">
                              Earn Points & Track Your Inquiries
                            </p>
                            <p className="text-xs text-blue-700 mt-1">
                              Sign in to earn 10 points for each contact form submission and track your inquiries in your dashboard.
                            </p>
                            <Button 
                              type="button" 
                              size="sm" 
                              className="mt-2"
                              onClick={() => openModal("signin", "recruit")}
                            >
                              Sign In for Points
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}

                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-[#0A3C1F] hover:bg-[#0A3C1F]/90 shadow-md hover:shadow-lg transition-all"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                          Sending Message...
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4 mr-2" />
                          Send Message {currentUser && "(+10 Points)"}
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Enhanced Sidebar */}
            <div className="space-y-6">
              {/* Contact Information */}
              <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                <CardHeader className="bg-gradient-to-r from-[#0A3C1F] to-[#0A3C1F]/90 text-white">
                  <CardTitle className="flex items-center">
                    <Phone className="h-5 w-5 mr-2" />
                    Contact Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <Mail className="h-5 w-5 text-[#0A3C1F] mr-3 mt-0.5" />
                      <div>
                        <p className="font-medium">Recruitment Email</p>
                        <a 
                          href="mailto:recruitment@sfgov.org" 
                          className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
                        >
                          recruitment@sfgov.org
                        </a>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <Phone className="h-5 w-5 text-[#0A3C1F] mr-3 mt-0.5" />
                      <div>
                        <p className="font-medium">Recruitment Phone</p>
                        <a 
                          href="tel:+14155547225" 
                          className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
                        >
                          (415) 554-7225
                        </a>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <MapPin className="h-5 w-5 text-[#0A3C1F] mr-3 mt-0.5" />
                      <div>
                        <p className="font-medium">Main Office</p>
                        <p className="text-sm text-gray-600">
                          San Francisco Sheriff's Department
                          <br />
                          1 Dr. Carlton B. Goodlett Place
                          <br />
                          Room 456, City Hall
                          <br />
                          San Francisco, CA 94102
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Office Hours */}
              <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                <CardHeader className="bg-gradient-to-r from-green-600 to-green-700 text-white">
                  <CardTitle className="flex items-center">
                    <Clock className="h-5 w-5 mr-2" />
                    Office Hours
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-green-800 font-medium">Monday - Friday</span>
                      <Badge variant="outline" className="bg-green-200 text-green-800">
                        8:00 AM - 5:00 PM
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-green-800">Saturday</span>
                      <Badge variant="outline" className="bg-yellow-200 text-yellow-800">
                        By Appointment
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-green-800">Sunday</span>
                      <Badge variant="outline" className="bg-gray-200 text-gray-800">
                        Closed
                      </Badge>
                    </div>
                    <div className="mt-4 p-3 bg-white rounded border border-green-200">
                      <p className="text-xs text-green-700">
                        💡 <strong>Tip:</strong> For urgent matters, use our online chat or mark your inquiry as "High" priority.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Help Options */}
              <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
                <CardHeader className="bg-gradient-to-r from-yellow-600 to-yellow-700 text-white">
                  <CardTitle className="flex items-center">
                    <HelpCircle className="h-5 w-5 mr-2" />
                    Quick Help
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-3">
                  <Link href="/chat-with-sgt-ken">
                    <Button variant="outline" className="w-full justify-start border-yellow-300 text-yellow-800 hover:bg-yellow-200">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Chat with Sgt. Ken AI
                    </Button>
                  </Link>
                  <Link href="/faq">
                    <Button variant="outline" className="w-full justify-start border-yellow-300 text-yellow-800 hover:bg-yellow-200">
                      <HelpCircle className="h-4 w-4 mr-2" />
                      Frequently Asked Questions
                    </Button>
                  </Link>
                  <Link href="/application-process">
                    <Button variant="outline" className="w-full justify-start border-yellow-300 text-yellow-800 hover:bg-yellow-200">
                      <Shield className="h-4 w-4 mr-2" />
                      Application Process Guide
                    </Button>
                  </Link>
                  <Link href="/trivia">
                    <Button variant="outline" className="w-full justify-start border-yellow-300 text-yellow-800 hover:bg-yellow-200">
                      <Gamepad2 className="h-4 w-4 mr-2" />
                      Play Games & Earn Points
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              {/* Emergency Contact */}
              <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
                <CardHeader className="bg-gradient-to-r from-red-600 to-red-700 text-white">
                  <CardTitle className="flex items-center">
                    <AlertCircle className="h-5 w-5 mr-2" />
                    Emergency Contact
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="text-center">
                    <p className="text-sm text-red-800 mb-3">
                      For emergency situations or immediate assistance
                    </p>
                    <a 
                      href="tel:911" 
                      className="block w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded transition-colors"
                    >
                      Call 911
                    </a>
                    <p className="text-xs text-red-600 mt-2">
                      For non-emergency police matters: (415) 553-0123
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
