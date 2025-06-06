"use client";

import type React from "react";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { CheckCircle, Loader2, AlertCircle, Paperclip, FileText, X } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export function RecruiterContactForm() {
  const [formState, setFormState] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    message: "",
  });
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  
  // Debug log to verify component is loading with resume functionality
  console.log('RecruiterContactForm loaded with resume state:', resumeFile);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
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
    // Reset the file input
    const fileInput = document.getElementById('resume-upload') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formState.firstName || !formState.lastName || !formState.email) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      // Prepare form data for file upload
      const formData = new FormData();
      formData.append('firstName', formState.firstName);
      formData.append('lastName', formState.lastName);
      formData.append('email', formState.email);
      formData.append('phone', formState.phone);
      formData.append('message', formState.message);
      
      if (resumeFile) {
        formData.append('resume', resumeFile);
      }

      // API call to send email with resume attachment
      const response = await fetch("/api/volunteer-recruiter/send-contact", {
        method: "POST",
        body: formData, // Send as FormData to handle file upload
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to send email");
      }

      // Success
      setSuccessMessage(
        `Your message has been sent to ${formState.firstName} ${formState.lastName} from our official email address${resumeFile ? ' with their resume attached' : ''}. We've also saved their information to your dashboard.`,
      );
      setFormState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        message: "",
      });
      setResumeFile(null);
      // Reset file input
      const fileInput = document.getElementById('resume-upload') as HTMLInputElement;
      if (fileInput) {
        fileInput.value = '';
      }
    } catch (error) {
      console.error("Error sending email:", error);
      setErrorMessage(
        error instanceof Error ? error.message : "An unexpected error occurred",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Contact Potential Recruits</CardTitle>
          <CardDescription>
            Send a personalized email directly from our official email address
            (email@protectingsanfrancisco.com). You can also attach the volunteer's resume
            which will be stored securely and forwarded to the recruitment team.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {successMessage && (
            <Alert className="mb-6 bg-green-50 border-green-200">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertTitle className="text-green-800">Success!</AlertTitle>
              <AlertDescription className="text-green-700">
                {successMessage}
              </AlertDescription>
            </Alert>
          )}

          {errorMessage && (
            <Alert
              className="mb-6 bg-red-50 border-red-200"
              variant="destructive"
            >
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertTitle className="text-red-800">Error</AlertTitle>
              <AlertDescription className="text-red-700">
                {errorMessage}
              </AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">
                  First Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="firstName"
                  name="firstName"
                  placeholder="John"
                  value={formState.firstName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName">
                  Last Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="lastName"
                  name="lastName"
                  placeholder="Doe"
                  value={formState.lastName}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">
                  Email Address <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="john.doe@example.com"
                  value={formState.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number (Optional)</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="(555) 123-4567"
                  value={formState.phone}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">Personalized Message</Label>
              <Textarea
                id="message"
                name="message"
                placeholder="Enter your personalized message here. This will be included in the email sent to the recruit."
                value={formState.message}
                onChange={handleChange}
                rows={5}
              />
            </div>



            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#0A3C1F] hover:bg-[#0A3C1F]/90"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Paperclip className="mr-2 h-4 w-4" />
                  Send Email & Save Contact
                </>
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="bg-gray-50 dark:bg-gray-800/50 border-t px-6 py-4">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            <p className="mb-2">
              <strong>Note:</strong> The email will be sent from our official
              email address (email@protectingsanfrancisco.com) with your name in
              the signature. Any attached resume will be securely stored and
              forwarded to the recruitment team.
            </p>
            <p>
              All information will be stored securely and used only for
              recruitment purposes.
            </p>
          </div>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Contacts</CardTitle>
          <CardDescription>
            A list of potential recruits you&apos;ve recently contacted.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Name</th>
                  <th className="text-left py-3 px-4">Email</th>
                  <th className="text-center py-3 px-4">Date Contacted</th>
                  <th className="text-center py-3 px-4">Status</th>
                  <th className="text-center py-3 px-4">Action</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="py-3 px-4">
                    <div className="font-medium">Emily Johnson</div>
                  </td>
                  <td className="py-3 px-4 text-sm">
                    emily.johnson@example.com
                  </td>
                  <td className="text-center py-3 px-4 text-sm">
                    May 15, 2023
                  </td>
                  <td className="text-center py-3 px-4">
                    <span className="px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800">
                      Pending
                    </span>
                  </td>
                  <td className="text-center py-3 px-4">
                    <Button variant="outline" size="sm">
                      Follow Up
                    </Button>
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="py-3 px-4">
                    <div className="font-medium">Michael Chen</div>
                  </td>
                  <td className="py-3 px-4 text-sm">
                    michael.chen@example.com
                  </td>
                  <td className="text-center py-3 px-4 text-sm">
                    June 2, 2023
                  </td>
                  <td className="text-center py-3 px-4">
                    <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                      Signed Up
                    </span>
                  </td>
                  <td className="text-center py-3 px-4">
                    <Button variant="outline" size="sm">
                      View Profile
                    </Button>
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="py-3 px-4">
                    <div className="font-medium">Sophia Rodriguez</div>
                  </td>
                  <td className="py-3 px-4 text-sm">
                    sophia.rodriguez@example.com
                  </td>
                  <td className="text-center py-3 px-4 text-sm">
                    June 10, 2023
                  </td>
                  <td className="text-center py-3 px-4">
                    <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                      Responded
                    </span>
                  </td>
                  <td className="text-center py-3 px-4">
                    <Button variant="outline" size="sm">
                      Follow Up
                    </Button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
