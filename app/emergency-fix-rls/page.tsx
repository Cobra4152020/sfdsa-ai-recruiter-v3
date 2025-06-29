"use client";

import { useState } from "react";
import { AlertTriangle, Database, CheckCircle, AlertCircle, Settings } from "lucide-react";

export default function EmergencyRLSFixPage() {
  const [isRunning, setIsRunning] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState<boolean | null>(null);

  const runEmergencyFix = async () => {
    setIsRunning(true);
    setResult(null);
    setIsSuccess(null);

    try {
      // Call the new bypassed endpoint
      const response = await fetch('/api/emergency-rls-fix', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: 'd1de04f1-36ee-451c-a546-0d343c950f76'
        })
      });

      const data = await response.json();
      
      if (data.success) {
        setIsSuccess(true);
        setResult(`🚨 EMERGENCY FIX SUCCESSFUL! 🚨\n\n${data.message}\n\nDetails:\n${JSON.stringify(data.details, null, 2)}\n\n✅ The infinite recursion error has been completely eliminated!\n✅ All RLS policies were reset from scratch!\n✅ You now have admin access restored!`);
      } else {
        setIsSuccess(false);
        setResult(`❌ EMERGENCY FIX FAILED\n\n${data.message}\n\nError: ${JSON.stringify(data.error, null, 2)}\n\nSuggestion: ${data.suggestion || 'Try running the SQL manually in Supabase SQL Editor'}`);
      }
    } catch (error) {
      setIsSuccess(false);
      setResult(`❌ CRITICAL ERROR\n\nFailed to reach emergency API: ${error instanceof Error ? error.message : String(error)}\n\n🆘 This may indicate a deeper system issue.\n\nAs a last resort, you may need to:\n1. Go to Supabase SQL Editor\n2. Run the emergency SQL fix manually\n3. Contact support if the issue persists`);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-lg shadow-lg p-6">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="flex justify-center mb-4">
            <AlertTriangle className="h-16 w-16 text-red-500 animate-pulse" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            🚨 EMERGENCY DATABASE FIX 🚨
          </h1>
          <p className="text-gray-600">
            Complete RLS Policy Reset & Recovery
          </p>
        </div>

        {/* Error Info */}
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
          <div className="flex items-start">
            <Database className="h-5 w-5 text-red-500 mt-0.5 mr-3" />
            <div>
              <h3 className="text-red-800 font-medium">Critical Database Policy Error</h3>
              <p className="text-red-700 text-sm mt-1">
                <strong>Error Code:</strong> 42P17 - "infinite recursion detected in policy for relation 'user_roles'"
              </p>
              <p className="text-red-600 text-sm mt-2">
                This error blocks ALL admin access and creates a catch-22 situation where the fix can't run because auth is broken.
              </p>
              <p className="text-red-600 text-sm mt-1 font-medium">
                🆘 This emergency fix bypasses ALL authentication to break the deadlock.
              </p>
            </div>
          </div>
        </div>

        {/* Fix Button */}
        <div className="text-center mb-6">
          <button
            onClick={runEmergencyFix}
            disabled={isRunning}
            className={`px-8 py-4 rounded-lg font-medium text-white text-lg transition-all duration-200 transform ${
              isRunning 
                ? 'bg-gray-400 cursor-not-allowed scale-95' 
                : isSuccess 
                  ? 'bg-green-600 hover:bg-green-700 scale-100' 
                  : 'bg-red-600 hover:bg-red-700 hover:scale-105 shadow-lg'
            }`}
          >
            {isRunning ? (
              <>
                <Settings className="inline h-5 w-5 mr-2 animate-spin" />
                🚨 RUNNING EMERGENCY FIX...
              </>
            ) : isSuccess ? (
              <>
                <CheckCircle className="inline h-5 w-5 mr-2" />
                ✅ EMERGENCY FIX COMPLETED!
              </>
            ) : (
              <>
                <Database className="inline h-5 w-5 mr-2" />
                🚨 RUN EMERGENCY BYPASS FIX
              </>
            )}
          </button>
          
          {!isRunning && !isSuccess && (
            <p className="text-sm text-gray-600 mt-2">
              This uses service role bypass to fix the RLS recursion
            </p>
          )}
        </div>

        {/* Result */}
        {result && (
          <div className={`p-4 rounded-lg border-l-4 ${
            isSuccess 
              ? 'bg-green-50 border-green-500 text-green-800' 
              : 'bg-red-50 border-red-500 text-red-800'
          }`}>
            <div className="flex items-start">
              {isSuccess ? (
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 mr-3" />
              ) : (
                <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 mr-3" />
              )}
              <div className="flex-1">
                <h3 className="font-medium mb-2">
                  {isSuccess ? '🚨 EMERGENCY FIX SUCCESSFUL!' : '🚨 EMERGENCY FIX FAILED'}
                </h3>
                <pre className="text-sm whitespace-pre-wrap bg-white p-3 rounded border overflow-auto max-h-60">
                  {result}
                </pre>
              </div>
            </div>
          </div>
        )}

        {/* Success Instructions */}
        {isSuccess && (
          <div className="mt-6 bg-blue-50 border-l-4 border-blue-500 p-4">
            <div className="flex items-start">
              <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5 mr-3" />
              <div>
                <h3 className="text-blue-800 font-medium">🎉 SUCCESS! Next Steps:</h3>
                <ol className="text-blue-700 text-sm mt-2 space-y-1 list-decimal list-inside">
                  <li><strong>Refresh this page</strong> - the RLS error should be gone</li>
                  <li>Go to <a href="/admin" className="underline font-medium">Admin Dashboard</a> - you should now have access</li>
                  <li>Run the trivia table migration at <a href="/admin/fix-trivia-table" className="underline font-medium">Fix Trivia Table</a></li>
                  <li>Test all admin functionality</li>
                  <li>The infinite recursion nightmare is over! 🎉</li>
                </ol>
              </div>
            </div>
          </div>
        )}

        {/* What This Does */}
        <div className="mt-6 bg-gray-50 p-4 rounded-lg">
          <h3 className="font-medium text-gray-800 mb-2">🔧 What This Emergency Fix Does:</h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• <strong>Bypasses ALL authentication</strong> using service role key</li>
            <li>• <strong>Completely resets</strong> all RLS policies on user_roles table</li>
            <li>• <strong>Removes ALL existing policies</strong> that might be causing recursion</li>
            <li>• <strong>Creates fresh policies</strong> with unique names to avoid conflicts</li>
            <li>• <strong>Grants admin privileges</strong> to user: d1de04f1-36ee-451c-a546-0d343c950f76</li>
            <li>• <strong>Creates safe admin function</strong> with error handling</li>
            <li>• <strong>Breaks the deadlock</strong> and restores admin access</li>
          </ul>
        </div>

        {/* Technical Details */}
        <div className="mt-4 bg-yellow-50 p-4 rounded-lg">
          <h3 className="font-medium text-yellow-800 mb-2">⚠️ Why This Is Necessary:</h3>
          <p className="text-sm text-yellow-700">
            The RLS recursion error creates a catch-22: you can't fix the policies because you can't authenticate, 
            and you can't authenticate because the policies are broken. This emergency fix uses the service role 
            key to bypass the broken authentication system entirely and fix it from the "outside."
          </p>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center text-xs text-gray-500">
          🚨 Emergency Recovery System for SF Deputy Sheriff Recruitment Platform<br/>
          Last resort fix for RLS infinite recursion deadlock situations
        </div>
      </div>
    </div>
  );
} 