"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { getClientSideSupabase } from "@/lib/supabase";

export function TestMobileRegistration() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    confirmPassword: ""
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log("🚀 TEST: Form submitted!");
    alert("Form submitted! Check console for details.");
    
    toast({
      title: "Form Submitted",
      description: "Test registration form was submitted successfully",
    });

    setIsLoading(true);

    try {
      console.log("📋 Form data:", formData);
      
      const supabase = getClientSideSupabase();
      
      if (!supabase) {
        throw new Error("Supabase not initialized");
      }

      console.log("✅ Supabase client ready");

      // Test basic validation
      if (!formData.email || !formData.password) {
        throw new Error("Email and password required");
      }

      console.log("📤 Calling Supabase auth.signUp...");

      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            first_name: formData.firstName,
            last_name: formData.lastName,
            full_name: `${formData.firstName} ${formData.lastName}`,
            user_type: 'recruit'
          }
        }
      });

      console.log("📨 Supabase response:", { data, error });

      if (error) {
        console.error("❌ Supabase error:", error);
        throw error;
      }

      console.log("✅ Registration successful!");
      
      toast({
        title: "Success!",
        description: "Test registration completed successfully",
      });

      alert("Registration successful! User ID: " + data.user?.id);

    } catch (error) {
      console.error("💥 Registration error:", error);
      
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Registration failed",
        variant: "destructive",
      });

      alert("Registration failed: " + (error instanceof Error ? error.message : "Unknown error"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Test Mobile Registration</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="firstName">First Name</Label>
          <Input
            id="firstName"
            value={formData.firstName}
            onChange={(e) => setFormData({...formData, firstName: e.target.value})}
            placeholder="First name"
          />
        </div>

        <div>
          <Label htmlFor="lastName">Last Name</Label>
          <Input
            id="lastName"
            value={formData.lastName}
            onChange={(e) => setFormData({...formData, lastName: e.target.value})}
            placeholder="Last name"
          />
        </div>

        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            placeholder="your@email.com"
          />
        </div>

        <div>
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
            placeholder="Password"
          />
        </div>

        <div>
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <Input
            id="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
            placeholder="Confirm password"
          />
        </div>

        <Button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700"
          disabled={isLoading}
        >
          {isLoading ? "Testing..." : "Test Registration"}
        </Button>
      </form>

      <div className="mt-4 p-4 bg-gray-100 rounded">
        <h3 className="font-semibold">Debug Info:</h3>
        <p>Form filled: {Object.values(formData).some(v => v) ? "Yes" : "No"}</p>
        <p>Loading: {isLoading ? "Yes" : "No"}</p>
        <p>User Agent: {typeof window !== 'undefined' ? window.navigator.userAgent.substring(0, 50) + "..." : "N/A"}</p>
      </div>
    </div>
  );
} 