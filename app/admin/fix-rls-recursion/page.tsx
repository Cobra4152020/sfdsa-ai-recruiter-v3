"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, CheckCircle, Settings, Database } from "lucide-react";

export default function FixRLSRecursionPage() {
  const [isRunning, setIsRunning] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState<boolean | null>(null);

  const runRLSFix = async () => {
    setIsRunning(true);
    setResult(null);
    setIsSuccess(null);

    try {
      const response = await fetch('/api/admin/fix-rls-recursion', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: 'd1de04f1-36ee-451c-a546-0d343c950f76' // Your user ID from the debug info
        })
      });

      const data = await response.json();
      
      if (data.success) {
        setIsSuccess(true);
        setResult(`✅ SUCCESS!\n\n${data.message}\n\nDetails:\n${JSON.stringify(data.details, null, 2)}`);
      } else {
        setIsSuccess(false);
        setResult(`❌ FAILED\n\n${data.message}\n\nError: ${JSON.stringify(data.error, null, 2)}`);
      }
    } catch (error) {
      setIsSuccess(false);
      setResult(`❌ NETWORK ERROR\n\nFailed to call API: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Database className="h-6 w-6 text-red-500" />
            <CardTitle className="text-2xl">Fix RLS Infinite Recursion</CardTitle>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <AlertCircle className="h-4 w-4 text-red-500" />
            <span className="text-sm text-red-600 font-medium">
              Critical Database Error Detected
            </span>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Error Description */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h3 className="font-semibold text-red-800 mb-2">Current Issue:</h3>
            <p className="text-sm text-red-700">
              <strong>Error:</strong> "infinite recursion detected in policy for relation 'user_roles'"
            </p>
            <p className="text-sm text-red-700 mt-1">
              <strong>Code:</strong> 42P17
            </p>
            <p className="text-sm text-red-600 mt-2">
              This error prevents admin role checks and blocks access to admin functionality.
            </p>
          </div>

          {/* Fix Description */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-800 mb-2">What this fix does:</h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Removes recursive RLS policies on user_roles table</li>
              <li>• Creates safe, non-recursive admin policies</li>
              <li>• Grants you admin role: <code className="bg-blue-100 px-1 rounded">d1de04f1-36ee-451c-a546-0d343c950f76</code></li>
              <li>• Creates a safe admin-checking function</li>
              <li>• Restores access to admin dashboard and functionality</li>
            </ul>
          </div>

          {/* Action Button */}
          <div className="flex justify-center">
            <Button 
              onClick={runRLSFix} 
              disabled={isRunning}
              size="lg"
              className="w-full max-w-md"
              variant={isSuccess === true ? "default" : "destructive"}
            >
              {isRunning ? (
                <>
                  <Settings className="h-4 w-4 mr-2 animate-spin" />
                  Fixing Database Policies...
                </>
              ) : isSuccess === true ? (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  RLS Fix Completed ✅
                </>
              ) : (
                <>
                  <Database className="h-4 w-4 mr-2" />
                  Run RLS Recursion Fix
                </>
              )}
            </Button>
          </div>

          {/* Result Display */}
          {result && (
            <Card className={`${isSuccess ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
              <CardHeader>
                <div className="flex items-center gap-2">
                  {isSuccess ? (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-red-600" />
                  )}
                  <CardTitle className={`text-lg ${isSuccess ? 'text-green-800' : 'text-red-800'}`}>
                    {isSuccess ? 'Fix Successful' : 'Fix Failed'}
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <pre className={`text-sm whitespace-pre-wrap p-3 rounded-lg ${
                  isSuccess ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {result}
                </pre>
              </CardContent>
            </Card>
          )}

          {/* Success Next Steps */}
          {isSuccess && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="font-semibold text-green-800 mb-2">✅ Next Steps:</h3>
              <ol className="text-sm text-green-700 space-y-1 list-decimal list-inside">
                <li>Refresh this page or try accessing admin functionality</li>
                <li>Test admin dashboard access</li>
                <li>Run the trivia table migration if still needed</li>
                <li>The infinite recursion error should now be resolved</li>
              </ol>
            </div>
          )}

          {/* Warning */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h3 className="font-semibold text-yellow-800 mb-2">⚠️ Important Notes:</h3>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>• This modifies database security policies</li>
              <li>• Only run this if you're experiencing the RLS recursion error</li>
              <li>• This grants admin privileges to your user account</li>
              <li>• The fix should only need to be run once</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 