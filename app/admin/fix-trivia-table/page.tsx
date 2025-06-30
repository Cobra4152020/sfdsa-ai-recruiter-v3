"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

export default function FixTriviaTablePage() {
  const [isRunning, setIsRunning] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const { toast } = useToast();

  const runMigration = async () => {
    setIsRunning(true);
    setResult(null);
    
    try {
      const response = await fetch('/api/admin/fix-trivia-schema', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      const data = await response.json();
      
      if (data.success) {
        setResult(`✅ Success: ${data.message}`);
        toast({
          title: "Migration Completed",
          description: "Trivia table schema has been fixed successfully!",
        });
      } else {
        setResult(`❌ Error: ${data.message}`);
        console.error('Migration error:', data.error);
        toast({
          title: "Migration Failed",
          description: data.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      const errorMessage = `❌ Failed to run migration: ${error instanceof Error ? error.message : 'Unknown error'}`;
      setResult(errorMessage);
      toast({
        title: "Migration Failed",
        description: "Could not connect to migration endpoint",
        variant: "destructive",
      });
    } finally {
      setIsRunning(false);
    }
  };

  const testTrivia = async () => {
    try {
      const response = await fetch('/api/trivia/games/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: 'd1de04f1-36ee-451c-a546-0d343c950f76', // John Baker's ID from the logs
          gameId: 'sf-districts',
          score: 5,
          totalQuestions: 5,
          correctAnswers: 5,
          timeSpent: 60,
        }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        toast({
          title: "Test Successful",
          description: `Trivia submission working! Awarded ${data.pointsAwarded} points.`,
        });
        setResult(`✅ Test successful: ${data.message}`);
      } else {
        toast({
          title: "Test Failed",
          description: data.message,
          variant: "destructive",
        });
        setResult(`❌ Test failed: ${data.message}`);
      }
    } catch (error) {
      const errorMessage = `❌ Test failed: ${error instanceof Error ? error.message : 'Unknown error'}`;
      setResult(errorMessage);
      toast({
        title: "Test Failed",
        description: "Could not submit test trivia",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Fix Trivia Table Schema</CardTitle>
          <p className="text-sm text-gray-600">
            This tool will create/fix the trivia_attempts table to resolve the 500 error when submitting trivia games.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h3 className="font-semibold">Step 1: Run Migration</h3>
            <p className="text-sm text-gray-600">
              Click this button to create/update the trivia_attempts table with all required columns.
            </p>
            <Button 
              onClick={runMigration} 
              disabled={isRunning}
              className="w-full"
            >
              {isRunning ? "Running Migration..." : "Run Trivia Table Migration"}
            </Button>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold">Step 2: Test Trivia Submission</h3>
            <p className="text-sm text-gray-600">
              After running the migration, test if trivia submissions work correctly.
            </p>
            <Button 
              onClick={testTrivia} 
              variant="outline"
              className="w-full"
            >
              Test Trivia Submission
            </Button>
          </div>

          {result && (
            <div className="mt-4 p-4 bg-gray-100 rounded-lg">
              <h4 className="font-semibold mb-2">Result:</h4>
              <pre className="text-sm whitespace-pre-wrap">{result}</pre>
            </div>
          )}

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-semibold mb-2">What this migration does:</h4>
            <ul className="text-sm space-y-1 list-disc list-inside">
              <li>Creates the trivia_attempts table if it doesn't exist</li>
              <li>Adds missing columns: game_id, correct_answers, time_spent</li>
              <li>Creates indexes for better performance</li>
              <li>Tests the table with a sample insert</li>
            </ul>
          </div>

          <div className="mt-4 p-4 bg-yellow-50 rounded-lg">
            <h4 className="font-semibold mb-2">Current Issue:</h4>
            <p className="text-sm">
              Trivia games are returning "Failed to record attempt" with a 500 error. 
              This is likely due to missing table columns or the table not existing.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 