"use client";

import { useState, useEffect } from "react";
import { notFound } from "next/navigation";
import { PageWrapper } from "@/components/page-wrapper";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Shield, BrainCircuit, Clock, CheckCircle, XCircle } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { availableTests, testQuestions } from "@/lib/practice-test-data";

// MOCK DATA - This should be moved to a lib/api file later
interface Question {
  id: number;
  text: string;
  options: {
    id: string;
    text: string;
  }[];
  correctAnswerId: string;
  domain: string;
}

// This should ideally be fetched from a shared source or API

interface TestPageParams {
  params: {
    testId: string;
  };
}

export default function PracticeTestPage({ params }: TestPageParams) {
  const { testId } = params;
  const test = availableTests.find((t) => t.id === testId);
  const questions = testQuestions[testId] || [];

  const [testStatus, setTestStatus] = useState<"not-started" | "in-progress" | "completed">("not-started");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<{[key: number]: string}>({});
  const [score, setScore] = useState(0);
  const [domainScores, setDomainScores] = useState({ Writing: 0, Reading: 0, Reasoning: 0, Physical: 0 });
  const [timeLeft, setTimeLeft] = useState(0);
  const [checkedItems, setCheckedItems] = useState<Set<number>>(new Set());

  useEffect(() => {
    if (test && testStatus === "in-progress") {
      setTimeLeft(test.durationMinutes * 60);
      const timer = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timer);
            finishTest();
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [testStatus, test]);

  useEffect(() => {
    if(testId === 'physical-ability') {
        // For checklist, set status to in-progress immediately
        setTestStatus('in-progress');
    }
  }, [testId]);

  if (!test) {
    notFound();
  }

  const handleStartTest = () => {
    setCurrentQuestionIndex(0);
    setUserAnswers({});
    setScore(0);
    setTestStatus("in-progress");
  };

  const handleAnswerSelect = (questionId: number, answerId: string) => {
    setUserAnswers(prev => ({ ...prev, [questionId]: answerId }));
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      finishTest();
    }
  };
  
  const finishTest = () => {
    let calculatedScore = 0;
    const scores = { Writing: 0, Reading: 0, Reasoning: 0, Physical: 0 };
    const correctAnswers = { Writing: 0, Reading: 0, Reasoning: 0 };

    questions.forEach(q => {
        if(userAnswers[q.id] === q.correctAnswerId) {
            calculatedScore++;
            scores[q.domain]++;
        }
    });

    setScore(calculatedScore);
    setDomainScores(scores);
    setTestStatus("completed");
  }

  const handleCheckboxChange = (questionId: number) => {
    setCheckedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(questionId)) {
        newSet.delete(questionId);
      } else {
        newSet.add(questionId);
      }
      return newSet;
    });
  };

  const Icon = test.icon;
  const currentQuestion = questions[currentQuestionIndex];
  
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  return (
    <PageWrapper>
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <div className="flex items-center gap-4 mb-2">
            <Icon className="h-10 w-10 text-primary" />
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl">
              {test.title}
            </h1>
          </div>
          <p className="text-muted-foreground">{test.description}</p>
          <div className="mt-4 flex items-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>{test.durationMinutes} minutes</span>
            </div>
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span>{test.questions} questions</span>
            </div>
          </div>
        </header>

        <Card>
          <CardHeader>
            <CardTitle>
                {test.id === 'physical-ability' 
                    ? 'Preparation Checklist' 
                    : testStatus === 'not-started' 
                        ? 'Ready to Begin?'
                        : testStatus === 'in-progress'
                            ? `Question ${currentQuestionIndex + 1} of ${questions.length}`
                            : 'Test Completed'
                }
            </CardTitle>
             {testStatus === 'in-progress' && currentQuestion && test.id !== 'physical-ability' && (
                <div className="text-sm text-muted-foreground font-medium bg-secondary rounded-full px-3 py-1 inline-block">
                    {currentQuestion.domain}
                </div>
             )}
          </CardHeader>
          <CardContent>
            {test.id === 'physical-ability' && (
              <div>
                <p className="text-lg mb-4">Use this checklist to track your progress as you prepare for the Physical Ability Test.</p>
                <div className="space-y-3">
                  {questions.map((item) => (
                    <div key={item.id} className="flex items-center p-4 border rounded-lg">
                      <input
                        type="checkbox"
                        id={`item-${item.id}`}
                        className="h-6 w-6 rounded border-gray-300 text-primary focus:ring-primary"
                        checked={checkedItems.has(item.id)}
                        onChange={() => handleCheckboxChange(item.id)}
                      />
                      <label htmlFor={`item-${item.id}`} className="ml-3 block text-gray-900 dark:text-gray-100">
                        <span className="text-lg font-medium">{item.text}</span>
                        <span className="block text-sm text-muted-foreground">{item.options[0].text}</span>
                      </label>
                    </div>
                  ))}
                </div>
                 <div className="mt-6">
                    <Progress value={(checkedItems.size / questions.length) * 100} />
                    <p className="text-center mt-2 text-sm text-muted-foreground">{checkedItems.size} of {questions.length} items completed</p>
                </div>
              </div>
            )}
            
            {test.id !== 'physical-ability' && testStatus === 'not-started' && (
                <div className="prose dark:prose-invert max-w-none text-center">
                    <p>You have <strong>{test.durationMinutes} minutes</strong> to answer <strong>{test.questions} questions</strong>.</p>
                    <p>When you are ready, click the button below to begin.</p>
                    <Button size="lg" className="mt-4" onClick={handleStartTest}>Begin Test</Button>
                </div>
            )}

            {test.id !== 'physical-ability' && testStatus === 'in-progress' && currentQuestion && (
              <div>
                <div className="flex justify-between items-center mb-4">
                    <Progress value={((currentQuestionIndex + 1) / questions.length) * 100} className="w-full mr-4" />
                    <div className="flex items-center gap-2 text-lg font-semibold">
                        <Clock className="h-5 w-5" />
                        <span>{formatTime(timeLeft)}</span>
                    </div>
                </div>
                <p className="text-lg font-semibold mb-4">{currentQuestion.text}</p>
                <div className="space-y-2">
                  {currentQuestion.options.map((option) => (
                    <Button
                      key={option.id}
                      variant={userAnswers[currentQuestion.id] === option.id ? "default" : "outline"}
                      className="w-full justify-start text-left h-auto py-3"
                      onClick={() => handleAnswerSelect(currentQuestion.id, option.id)}
                    >
                      <span className="font-bold mr-4">{option.id.toUpperCase()}.</span>
                      <span>{option.text}</span>
                    </Button>
                  ))}
                </div>
                <div className="mt-6 flex justify-end">
                    <Button onClick={handleNextQuestion}>
                        {currentQuestionIndex < questions.length - 1 ? "Next Question" : "Finish Test"}
                    </Button>
                </div>
              </div>
            )}

            {test.id !== 'physical-ability' && testStatus === 'completed' && (
              <div className="text-center">
                <h2 className="text-2xl font-bold">Your Results</h2>
                <p className="text-4xl font-bold my-4">
                  {score} / {questions.length}
                </p>
                <Progress value={(score / questions.length) * 100} className="w-1/2 mx-auto mb-6" />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center my-8">
                  <div>
                    <p className="text-lg font-semibold">Writing</p>
                    <p className="text-2xl font-bold">{domainScores.Writing} / {questions.filter(q => q.domain === 'Writing').length}</p>
                  </div>
                  <div>
                    <p className="text-lg font-semibold">Reading</p>
                    <p className="text-2xl font-bold">{domainScores.Reading} / {questions.filter(q => q.domain === 'Reading').length}</p>
                  </div>
                  <div>
                    <p className="text-lg font-semibold">Reasoning</p>
                    <p className="text-2xl font-bold">{domainScores.Reasoning} / {questions.filter(q => q.domain === 'Reasoning').length}</p>
                  </div>
                </div>

                <div className="mt-6 prose dark:prose-invert max-w-none">
                  <h3 className="text-xl font-bold">Review Your Answers</h3>
                  <ul className="text-left space-y-4 mt-4">
                    {questions.map(q => (
                       <li key={q.id} className="p-4 border rounded-md">
                         <p className="font-semibold">{q.text}</p>
                         <p className={`flex items-center gap-2 ${userAnswers[q.id] === q.correctAnswerId ? 'text-green-500' : 'text-red-500'}`}>
                           {userAnswers[q.id] === q.correctAnswerId ? <CheckCircle size={16} /> : <XCircle size={16} />}
                           Your answer: {userAnswers[q.id] ? q.options.find(opt => opt.id === userAnswers[q.id])?.text : "Not answered"}
                         </p>
                         {userAnswers[q.id] !== q.correctAnswerId && (
                           <p className="text-green-500 flex items-center gap-2">
                             <CheckCircle size={16} />
                             Correct answer: {q.options.find(opt => opt.id === q.correctAnswerId)?.text}
                           </p>
                         )}
                       </li>
                    ))}
                  </ul>
                </div>
                <Button size="lg" className="mt-8" onClick={() => window.location.href = '/practice-tests'}>
                  Back to Practice Tests
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </PageWrapper>
  );
} 