"use client";

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface AdminAuthBypassProps {
  children: React.ReactNode;
}

export default function AdminAuthBypass({ children }: AdminAuthBypassProps) {
  const [bypassCode, setBypassCode] = useState('');
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [error, setError] = useState('');

  // Temporary bypass codes for emergency access
  const validCodes = [
    'SFDSA2025',
    'ADMIN_BYPASS_RLS',
    'EMERGENCY_ACCESS',
    '10278ec9-3a35-45bd-b051-eb6f805d0002' // Your user ID
  ];

  const handleBypass = () => {
    if (validCodes.includes(bypassCode)) {
      setIsAuthorized(true);
      setError('');
      
      // Store bypass in localStorage for this session
      localStorage.setItem('admin_bypass_active', 'true');
      localStorage.setItem('admin_bypass_timestamp', Date.now().toString());
    } else {
      setError('Invalid bypass code');
    }
  };

  // Check if bypass is already active
  React.useEffect(() => {
    const bypassActive = localStorage.getItem('admin_bypass_active');
    const bypassTimestamp = localStorage.getItem('admin_bypass_timestamp');
    
    if (bypassActive === 'true' && bypassTimestamp) {
      const timestamp = parseInt(bypassTimestamp);
      const oneHour = 60 * 60 * 1000; // 1 hour in milliseconds
      
      // Check if bypass is still valid (less than 1 hour old)
      if (Date.now() - timestamp < oneHour) {
        setIsAuthorized(true);
      } else {
        // Bypass expired
        localStorage.removeItem('admin_bypass_active');
        localStorage.removeItem('admin_bypass_timestamp');
      }
    }
  }, []);

  if (isAuthorized) {
    return (
      <div>
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm">
                <strong>Emergency Admin Access Active</strong> - This bypass is temporary and expires in 1 hour. Please fix the RLS policies ASAP.
              </p>
            </div>
          </div>
        </div>
        {children}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">🚨 Admin Access Bypass</CardTitle>
          <p className="text-center text-sm text-gray-600">
            RLS policy error detected. Use emergency bypass code to access admin functions.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label htmlFor="bypassCode" className="block text-sm font-medium text-gray-700 mb-1">
              Emergency Bypass Code
            </label>
            <Input
              id="bypassCode"
              type="password"
              value={bypassCode}
              onChange={(e) => setBypassCode(e.target.value)}
              placeholder="Enter bypass code"
              onKeyPress={(e) => e.key === 'Enter' && handleBypass()}
            />
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          </div>
          
          <Button onClick={handleBypass} className="w-full">
            Access Admin Panel
          </Button>
          
          <div className="text-xs text-gray-500 space-y-1">
            <p><strong>Valid codes:</strong></p>
            <ul className="list-disc list-inside pl-2">
              <li>SFDSA2025</li>
              <li>ADMIN_BYPASS_RLS</li>
              <li>Your User ID</li>
            </ul>
          </div>
          
          <div className="bg-blue-50 p-3 rounded text-xs">
            <p><strong>To permanently fix this issue:</strong></p>
            <ol className="list-decimal list-inside space-y-1 mt-1">
              <li>Go to Supabase Dashboard → SQL Editor</li>
              <li>Run the SQL script I provided earlier</li>
              <li>This will fix the infinite recursion in RLS policies</li>
            </ol>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 