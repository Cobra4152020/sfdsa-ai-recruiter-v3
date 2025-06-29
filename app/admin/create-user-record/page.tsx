"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { User, Database, CheckCircle, AlertCircle, Settings } from "lucide-react";

export default function CreateUserRecordPage() {
  const [isRunning, setIsRunning] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState<boolean | null>(null);

  const createUserRecord = async () => {
    setIsRunning(true);
    setResult(null);
    setIsSuccess(null);

    try {
      const response = await fetch('/api/admin/create-user-record', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: 'd1de04f1-36ee-451c-a546-0d343c950f76',
          email: 'refundpolice50@gmail.com'
        })
      });

      const data = await response.json();
      
      if (data.success) {
        setIsSuccess(true);
        setResult(`✅ SUCCESS!\n\nUser Record Created Successfully!\n\n${data.message}\n\nDetails:\n${JSON.stringify(data.details, null, 2)}\n\n🎯 You can now play trivia and earn points!\nThe foreign key constraint issue has been resolved.`);
      } else {
        setIsSuccess(false);
        setResult(`❌ FAILED\n\n${data.message}\n\nError:\n${JSON.stringify(data.error, null, 2)}`);
      }
    } catch (error) {
      setIsSuccess(false);
      setResult(`❌ NETWORK ERROR\n\nFailed to call API: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <Card className="mb-6">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <User className="h-16 w-16 text-blue-500" />
          </div>
          <CardTitle className="text-3xl font-bold text-gray-900">
            Create User Record Fix
          </CardTitle>
          <p className="text-gray-600 mt-2">
            Fix foreign key constraint error for trivia submissions
          </p>
        </CardHeader>
      </Card>

      {/* Problem Description */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
            <div className="flex items-start">
              <Database className="h-5 w-5 text-red-500 mt-0.5 mr-3" />
              <div>
                <h3 className="text-red-800 font-medium">Foreign Key Constraint Error</h3>
                <p className="text-red-700 text-sm mt-1">
                  <strong>Error:</strong> "insert or update on table 'trivia_attempts' violates foreign key constraint 'trivia_attempts_user_id_fkey'"
                </p>
                <p className="text-red-600 text-sm mt-2">
                  <strong>Problem:</strong> Your user ID exists in Supabase Auth but not in the application's public.users table.
                </p>
                <p className="text-red-600 text-sm mt-1">
                  <strong>Result:</strong> Trivia submissions fail and you get 0 points instead of 100 points for perfect scores.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
            <div className="flex items-start">
              <User className="h-5 w-5 text-blue-500 mt-0.5 mr-3" />
              <div>
                <h3 className="text-blue-800 font-medium">Solution</h3>
                <p className="text-blue-700 text-sm mt-1">
                  This fix creates your user record in the public.users table, resolving the foreign key constraint and enabling trivia points.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Button */}
      <Card className="mb-6">
        <CardContent className="p-6 text-center">
          <Button
            onClick={createUserRecord}
            disabled={isRunning}
            size="lg"
            className={`px-8 py-4 text-lg transition-all duration-200 ${
              isRunning 
                ? 'opacity-50 cursor-not-allowed' 
                : isSuccess 
                  ? 'bg-green-600 hover:bg-green-700' 
                  : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {isRunning ? (
              <>
                <Settings className="mr-2 h-5 w-5 animate-spin" />
                Creating User Record...
              </>
            ) : isSuccess ? (
              <>
                <CheckCircle className="mr-2 h-5 w-5" />
                User Record Created ✅
              </>
            ) : (
              <>
                <User className="mr-2 h-5 w-5" />
                Create User Record
              </>
            )}
          </Button>
          
          {!isRunning && !isSuccess && (
            <p className="text-sm text-gray-600 mt-2">
              Creates your user record in public.users table
            </p>
          )}
        </CardContent>
      </Card>

      {/* Result Display */}
      {result && (
        <Card className="mb-6">
          <CardContent className="p-6">
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
                    {isSuccess ? 'User Record Created Successfully!' : 'User Creation Failed'}
                  </h3>
                  <pre className="text-sm whitespace-pre-wrap bg-white p-3 rounded border overflow-auto max-h-60">
                    {result}
                  </pre>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Success Instructions */}
      {isSuccess && (
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="bg-green-50 border-l-4 border-green-500 p-4">
              <div className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 mr-3" />
                <div>
                  <h3 className="text-green-800 font-medium">🎉 Success! Next Steps:</h3>
                  <ol className="text-green-700 text-sm mt-2 space-y-1 list-decimal list-inside">
                    <li>Go to <a href="/trivia" className="underline font-medium">Trivia Game</a></li>
                    <li>Play a game and get a perfect 5/5 score</li>
                    <li>You should now earn <strong>100 points</strong> (not 0 points!)</li>
                    <li>Check your dashboard to see the points</li>
                    <li>The foreign key constraint error is completely resolved! 🎯</li>
                  </ol>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Technical Details */}
      <Card>
        <CardContent className="p-6">
          <h3 className="font-medium text-gray-800 mb-2">🔧 What This Fix Does:</h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• <strong>Creates user record</strong> in public.users table with your ID and email</li>
            <li>• <strong>Ensures admin role</strong> exists in user_roles table</li>
            <li>• <strong>Tests foreign key constraint</strong> with a sample trivia_attempts insert</li>
            <li>• <strong>Resolves constraint error</strong> that was preventing trivia point awards</li>
            <li>• <strong>Enables proper scoring</strong> - 50 base + 30 completion + 20 perfect = 100 points</li>
          </ul>
          
          <div className="mt-4 text-xs text-gray-500">
            User ID: d1de04f1-36ee-451c-a546-0d343c950f76<br/>
            Email: refundpolice50@gmail.com
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 