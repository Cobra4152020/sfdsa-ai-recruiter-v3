"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { getClientSideSupabase } from "@/lib/supabase";

export default function TestRegistrationPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    confirmPassword: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (message: string) => {
    console.log(message);
    setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    addLog("🚀 Form submitted - starting registration test");
    
    toast({
      title: "Test Started",
      description: "Registration test beginning...",
    });

    setIsLoading(true);

    try {
      addLog("📋 Form data validation...");
      addLog(`Email: ${formData.email ? "✓" : "✗"}`);
      addLog(`Password: ${formData.password ? "✓" : "✗"}`);
      addLog(`First Name: ${formData.firstName ? "✓" : "✗"}`);
      addLog(`Last Name: ${formData.lastName ? "✓" : "✗"}`);
      
      if (!formData.email || !formData.password || !formData.firstName || !formData.lastName) {
        throw new Error("All fields are required for testing");
      }

      if (formData.password !== formData.confirmPassword) {
        throw new Error("Passwords do not match");
      }

      addLog("✅ Form validation passed");
      
      addLog("📡 Initializing Supabase client...");
      const supabase = getClientSideSupabase();
      
      if (!supabase) {
        throw new Error("Supabase client not available");
      }

      addLog("✅ Supabase client initialized");
      addLog("📤 Sending registration request...");

      const { data, error } = await supabase.auth.signUp({
        email: formData.email.trim(),
        password: formData.password,
        options: {
          data: {
            first_name: formData.firstName.trim(),
            last_name: formData.lastName.trim(),
            full_name: `${formData.firstName.trim()} ${formData.lastName.trim()}`,
            user_type: 'recruit'
          }
        }
      });

      addLog(`📨 Supabase response received`);
      addLog(`Has data: ${!!data}`);
      addLog(`Has user: ${!!data?.user}`);
      addLog(`Has error: ${!!error}`);
      addLog(`User ID: ${data?.user?.id || "None"}`);
      addLog(`Email confirmed: ${!!data?.user?.email_confirmed_at}`);

      if (error) {
        addLog(`❌ Supabase error: ${error.message}`);
        throw error;
      }

      if (!data?.user) {
        addLog("❌ No user data returned");
        throw new Error("No user data returned from registration");
      }

      addLog("✅ Registration successful!");
      
      toast({
        title: "✅ Success!",
        description: `User created with ID: ${data.user.id}`,
      });

    } catch (error) {
      addLog(`💥 Error: ${error instanceof Error ? error.message : "Unknown error"}`);
      
      toast({
        title: "❌ Test Failed",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      addLog("🔄 Test completed");
    }
  };

  const clearLogs = () => {
    setLogs([]);
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-3xl font-bold mb-6 text-center">Mobile Registration Test</h1>
          
          <form onSubmit={handleSubmit} className="space-y-4 mb-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                  placeholder="John"
                  className="text-base"
                />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                  placeholder="Doe"
                  className="text-base"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                placeholder="john.doe@example.com"
                className="text-base"
              />
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                placeholder="Minimum 6 characters"
                className="text-base"
              />
            </div>

            <div>
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                placeholder="Repeat password"
                className="text-base"
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 text-white py-3 text-lg"
              disabled={isLoading}
            >
              {isLoading ? "Testing Registration..." : "🧪 Test Registration"}
            </Button>
          </form>

          <div className="border-t pt-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Debug Log</h3>
              <Button onClick={clearLogs} variant="outline" size="sm">
                Clear Logs
              </Button>
            </div>
            
            <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm max-h-64 overflow-y-auto">
              {logs.length === 0 ? (
                <p className="text-gray-500">No logs yet. Submit the form to see debug information.</p>
              ) : (
                logs.map((log, index) => (
                  <div key={index} className="mb-2">
                    {log}
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-semibold text-blue-800 mb-2">Device Info:</h4>
            <div className="text-sm text-blue-600 space-y-1">
              <p>Screen Width: {typeof window !== 'undefined' ? window.innerWidth : 'N/A'}px</p>
              <p>Screen Height: {typeof window !== 'undefined' ? window.innerHeight : 'N/A'}px</p>
              <p>User Agent: {typeof window !== 'undefined' ? window.navigator.userAgent.substring(0, 60) + "..." : 'N/A'}</p>
              <p>Is Mobile: {typeof window !== 'undefined' && window.innerWidth <= 768 ? 'Yes' : 'No'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 