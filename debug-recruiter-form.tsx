"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Paperclip, FileText, X } from "lucide-react";

export function DebugRecruiterForm() {
  const [resumeFile, setResumeFile] = useState<File | null>(null);

  const handleResumeUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setResumeFile(file);
      console.log('Resume file selected:', file.name, file.size);
    }
  };

  const removeResumeFile = () => {
    setResumeFile(null);
    const fileInput = document.getElementById('debug-resume-upload') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Debug: Resume Upload Test</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p>This is a test component to verify resume upload functionality.</p>
          
          {/* Resume Upload Section */}
          <div className="space-y-2">
            <Label htmlFor="debug-resume-upload">
              Attach Resume (Test)
            </Label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
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
                  <Paperclip className="mx-auto h-8 w-8 text-gray-400" />
                  <div className="mt-2">
                    <Label
                      htmlFor="debug-resume-upload"
                      className="cursor-pointer inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-gray-50 h-10 px-4 py-2"
                    >
                      <Paperclip className="h-4 w-4 mr-2" />
                      Choose Resume File (Debug)
                    </Label>
                    <Input
                      id="debug-resume-upload"
                      type="file"
                      accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                      onChange={handleResumeUpload}
                      className="hidden"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    PDF, DOC, or DOCX files up to 5MB
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="text-sm text-gray-600">
            <p><strong>File selected:</strong> {resumeFile ? resumeFile.name : 'None'}</p>
            <p><strong>Component loaded:</strong> Yes</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 