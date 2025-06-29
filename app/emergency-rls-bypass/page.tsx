"use client";

import { useState } from "react";
import { AlertTriangle, Database, CheckCircle, AlertCircle, Settings } from "lucide-react";

// COMPLETELY BYPASSED EMERGENCY PAGE
// NO AUTH CHECKS, NO RLS QUERIES, NO SUPABASE CONTEXT
// This page can load even when everything else is broken

export default function EmergencyRLSBypassPage() {
  const [isRunning, setIsRunning] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState<boolean | null>(null);

  const runEmergencyBypass = async () => {
    setIsRunning(true);
    setResult(null);
    setIsSuccess(null);

    try {
      console.log("🚨 EMERGENCY BYPASS: Calling fix API directly...");
      
      const response = await fetch('/api/emergency-rls-fix', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: 'd1de04f1-36ee-451c-a546-0d343c950f76',
          emergency: true
        })
      });

      const data = await response.json();
      
      if (data.success) {
        setIsSuccess(true);
        setResult(`🚨 EMERGENCY BYPASS SUCCESSFUL! 🚨\n\n${data.message}\n\nThe infinite recursion deadlock has been BROKEN!\n\n✅ RLS policies completely reset\n✅ Admin access restored\n✅ Authentication system fixed\n\nYou can now:\n1. Refresh any page - errors should be gone\n2. Access /admin dashboard normally\n3. Use all admin functionality\n\nThe nightmare is over! 🎉`);
      } else {
        setIsSuccess(false);
        setResult(`❌ EMERGENCY BYPASS FAILED\n\n${data.message}\n\nThis indicates a severe system issue.\n\nMANUAL INTERVENTION REQUIRED:\n1. Open Supabase SQL Editor\n2. Copy the SQL from fix_rls_infinite_recursion.sql\n3. Run it manually\n4. Contact support if needed\n\nError Details:\n${JSON.stringify(data, null, 2)}`);
      }
    } catch (error) {
      setIsSuccess(false);
      setResult(`❌ CRITICAL SYSTEM ERROR\n\nCannot reach emergency API: ${error instanceof Error ? error.message : String(error)}\n\n🆘 COMPLETE SYSTEM BREAKDOWN DETECTED\n\nLAST RESORT OPTIONS:\n1. Restart your development server\n2. Check if Supabase is accessible\n3. Run the SQL fix manually in Supabase\n4. The RLS recursion has created a complete deadlock\n\nThis is the most severe type of database policy error.`);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="min-h-screen bg-red-900 text-white flex items-center justify-center p-4">
      <div className="max-w-3xl w-full bg-red-800 rounded-lg shadow-lg p-6 border-4 border-red-600">
        {/* EMERGENCY HEADER */}
        <div className="text-center mb-6">
          <div className="flex justify-center mb-4">
            <AlertTriangle className="h-20 w-20 text-yellow-400 animate-pulse" />
          </div>
          <h1 className="text-4xl font-bold text-yellow-400 mb-2 animate-pulse">
            🚨 SYSTEM EMERGENCY 🚨
          </h1>
          <h2 className="text-2xl font-bold text-white mb-2">
            COMPLETE RLS BYPASS REQUIRED
          </h2>
          <p className="text-red-200">
            Database Authentication System Deadlock - Emergency Recovery Mode
          </p>
        </div>

        {/* CRITICAL ALERT */}
        <div className="bg-red-700 border-4 border-yellow-400 p-4 mb-6 rounded-lg">
          <div className="flex items-start">
            <Database className="h-8 w-8 text-yellow-400 mt-0.5 mr-3 animate-bounce" />
            <div>
              <h3 className="text-yellow-400 font-bold text-lg">🚨 CRITICAL DATABASE DEADLOCK 🚨</h3>
              <p className="text-white font-medium mt-1">
                <strong>Error Code:</strong> 42P17 - "infinite recursion detected in policy for relation 'user_roles'"
              </p>
              <p className="text-red-200 mt-2">
                🆘 The RLS recursion error has created a complete authentication deadlock
              </p>
              <p className="text-red-200 mt-1">
                🆘 EVERY page is failing because admin role checks trigger recursion
              </p>
              <p className="text-yellow-300 mt-2 font-bold">
                This emergency bypass page has ZERO auth checks and can break the deadlock!
              </p>
            </div>
          </div>
        </div>

        {/* EMERGENCY ACTION BUTTON */}
        <div className="text-center mb-6">
          <button
            onClick={runEmergencyBypass}
            disabled={isRunning}
            className={`px-12 py-6 rounded-lg font-bold text-2xl transition-all duration-200 transform border-4 ${
              isRunning 
                ? 'bg-gray-600 cursor-not-allowed scale-95 border-gray-400 text-gray-300' 
                : isSuccess 
                  ? 'bg-green-600 hover:bg-green-500 scale-100 border-green-400 text-white' 
                  : 'bg-yellow-500 hover:bg-yellow-400 hover:scale-105 shadow-lg border-yellow-300 text-red-900 animate-pulse'
            }`}
          >
            {isRunning ? (
              <>
                <Settings className="inline h-8 w-8 mr-3 animate-spin" />
                🚨 BYPASSING SYSTEM...
              </>
            ) : isSuccess ? (
              <>
                <CheckCircle className="inline h-8 w-8 mr-3" />
                ✅ EMERGENCY BYPASS COMPLETE!
              </>
            ) : (
              <>
                <AlertTriangle className="inline h-8 w-8 mr-3" />
                🚨 EXECUTE EMERGENCY BYPASS
              </>
            )}
          </button>
          
          {!isRunning && !isSuccess && (
            <p className="text-yellow-300 font-medium mt-3">
              ⚡ This button bypasses ALL authentication to break the deadlock ⚡
            </p>
          )}
        </div>

        {/* RESULT DISPLAY */}
        {result && (
          <div className={`p-6 rounded-lg border-4 ${
            isSuccess 
              ? 'bg-green-800 border-green-400 text-green-100' 
              : 'bg-red-600 border-red-400 text-red-100'
          }`}>
            <div className="flex items-start">
              {isSuccess ? (
                <CheckCircle className="h-8 w-8 text-green-300 mt-0.5 mr-4" />
              ) : (
                <AlertCircle className="h-8 w-8 text-red-300 mt-0.5 mr-4" />
              )}
              <div className="flex-1">
                <h3 className="font-bold text-xl mb-3">
                  {isSuccess ? '🎉 EMERGENCY BYPASS SUCCESSFUL!' : '🆘 CRITICAL SYSTEM FAILURE'}
                </h3>
                <pre className="text-sm whitespace-pre-wrap bg-black p-4 rounded border-2 overflow-auto max-h-60 font-mono">
                  {result}
                </pre>
              </div>
            </div>
          </div>
        )}

        {/* SUCCESS INSTRUCTIONS */}
        {isSuccess && (
          <div className="mt-6 bg-green-700 border-4 border-green-400 p-4 rounded-lg">
            <div className="flex items-start">
              <CheckCircle className="h-6 w-6 text-green-300 mt-0.5 mr-3" />
              <div>
                <h3 className="text-green-300 font-bold text-lg">🎉 SYSTEM RECOVERED! Next Steps:</h3>
                <ol className="text-green-100 mt-2 space-y-2 list-decimal list-inside font-medium">
                  <li><strong>Close this emergency page</strong></li>
                  <li><strong>Refresh your main application</strong> - All RLS errors should be gone</li>
                  <li><strong>Go to <span className="bg-green-600 px-2 py-1 rounded">/admin</span></strong> - You now have full admin access</li>
                  <li><strong>Run trivia migration</strong> at <span className="bg-green-600 px-2 py-1 rounded">/admin/fix-trivia-table</span></li>
                  <li><strong>Test everything</strong> - The infinite recursion nightmare is completely over!</li>
                </ol>
                <p className="text-green-200 mt-3 text-center font-bold">
                  🎉 CONGRATULATIONS! You've survived a complete database deadlock! 🎉
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TECHNICAL EXPLANATION */}
        <div className="mt-6 bg-red-700 p-4 rounded-lg border-2 border-red-500">
          <h3 className="font-bold text-yellow-400 mb-2">🔧 How This Emergency Bypass Works:</h3>
          <ul className="text-red-100 space-y-1 text-sm">
            <li>• <strong>Zero Authentication:</strong> This page has no auth checks that could trigger recursion</li>
            <li>• <strong>Service Role Bypass:</strong> Uses service role key to bypass ALL broken RLS policies</li>
            <li>• <strong>Nuclear Reset:</strong> Completely destroys and rebuilds all user_roles policies</li>
            <li>• <strong>Deadlock Breaker:</strong> Attacks the recursion from outside the broken auth system</li>
            <li>• <strong>Bootstrap Admin:</strong> Grants emergency admin access to break the catch-22</li>
            <li>• <strong>System Recovery:</strong> Restores normal authentication without recursion</li>
          </ul>
        </div>

        {/* FOOTER */}
        <div className="mt-6 text-center text-red-300 text-sm">
          🚨 Emergency Recovery System for SF Deputy Sheriff Recruitment Platform<br/>
          <strong>DEFCON 1:</strong> Complete authentication system deadlock recovery mode<br/>
          <em>This page exists because sometimes the database wins... but not today! 💪</em>
        </div>
      </div>
    </div>
  );
} 