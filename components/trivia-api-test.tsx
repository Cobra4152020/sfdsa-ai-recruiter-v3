"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, CheckCircle } from "lucide-react";
import type { TriviaQuestion } from "@/components/trivia/enhanced-trivia-game";

export function TriviaApiTest() {
  const [questions, setQuestions] = useState<TriviaQuestion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [source, setSource] = useState<string>("unknown");

  const fetchQuestions = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/trivia/questions?count=3");

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      if (data.questions && data.questions.length > 0) {
        setQuestions(data.questions);

        // Try to determine the source of questions
        if (data.source) {
          setSource(data.source);
        } else if (data.error && data.error.includes("fallback")) {
          setSource("fallback");
        } else {
          // Check if questions match any of our fallback questions
          const isFallback = data.questions.some(
            (q: TriviaQuestion) =>
              q.question.includes("Golden Gate Bridge") ||
              q.question.includes("Alcatraz") ||
              q.question.includes("cable car"),
          );
          setSource(isFallback ? "likely fallback" : "database or OpenAI");
        }
      } else {
        throw new Error("No questions returned");
      }
    } catch (error) {
      console.error("Error fetching trivia questions:", error);
      setError(
        error instanceof Error ? error.message : "Unknown error occurred",
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Trivia API Test</span>
          <Button size="sm" onClick={fetchQuestions} disabled={isLoading}>
            Refresh Questions
          </Button>
        </CardTitle>
      </CardHeader>

      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-8 w-full" />
          </div>
        ) : error ? (
          <div className="p-4 bg-red-50 text-red-800 rounded-md flex items-start">
            <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-semibold">Error fetching questions</p>
              <p className="text-sm">{error}</p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="p-3 bg-green-50 text-green-800 rounded-md flex items-center">
              <CheckCircle className="h-5 w-5 mr-2 flex-shrink-0" />
              <div>
                <p className="font-semibold">
                  Successfully fetched {questions.length} questions
                </p>
                <p className="text-sm">Likely source: {source}</p>
              </div>
            </div>

            {questions.map((q: TriviaQuestion, i) => (
              <div key={i} className="border rounded-md p-4">
                <h3 className="font-medium text-lg mb-2">{q.question}</h3>
                <div className="grid gap-2 mb-3">
                  {q.options.map((option: string, j: number) => (
                    <div
                      key={j}
                      className={`p-2 rounded-md ${j === q.correctAnswer ? "bg-green-100 border border-green-300" : "bg-gray-50 border border-gray-200"}`}
                    >
                      <span className="inline-block w-6">
                        {String.fromCharCode(65 + j)}.
                      </span>
                      {option}
                      {j === q.correctAnswer && (
                        <CheckCircle className="h-4 w-4 inline ml-2 text-green-600" />
                      )}
                    </div>
                  ))}
                </div>
                <div className="text-sm bg-blue-50 p-3 rounded-md">
                  <p className="font-medium text-blue-800">Explanation:</p>
                  <p className="text-blue-700">{q.explanation}</p>
                </div>
                <div className="mt-2 flex justify-between text-xs text-gray-500">
                  <span>Difficulty: {q.difficulty}</span>
                  <span>Category: {q.category}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>

      <CardFooter className="text-sm text-gray-500 border-t pt-4">
        This component tests if the trivia questions API is working correctly
        with fallback questions.
      </CardFooter>
    </Card>
  );
}
