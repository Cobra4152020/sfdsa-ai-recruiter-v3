"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useUser } from "@/context/user-context";
import { useToast } from "@/components/ui/use-toast";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { motion, AnimatePresence } from "framer-motion";
import {
  Share2,
  Award,
  RefreshCw,
  CheckCircle,
  XCircle,
  AlertCircle,
  Clock,
  Trophy,
  Facebook,
  Twitter,
  Linkedin,
  Mail,
  ImageIcon,
} from "lucide-react";
import Image from "next/image";
import { logError } from "@/lib/error-monitoring";
import { getClientSideSupabase } from "@/lib/supabase";

interface TriviaQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: "easy" | "medium" | "hard";
  category: string;
  imageUrl?: string;
  imageAlt?: string;
  points: number;
}

interface BadgeResult {
  id: string;
  badge_type: string;
  earned_at: string;
  progress: number;
  requirements: {
    correctAnswers: number;
    attempts: number;
    categories?: string[];
  };
}

interface GameStats {
  currentStreak: number;
  maxStreak: number;
  difficultyMultiplier: number;
  totalPoints: number;
  correctAnswers: number;
  totalAttempts: number;
  averageResponseTime: number;
  categories: Record<string, number>;
}

interface TriviaResponse {
  questions: TriviaQuestion[];
  error?: string;
}

// Fallback questions in case API fails
const FALLBACK_QUESTIONS: TriviaQuestion[] = [
  {
    id: "fallback-1",
    question: "What year was the Golden Gate Bridge completed?",
    options: ["1927", "1937", "1947", "1957"],
    correctAnswer: 1,
    explanation:
      "The Golden Gate Bridge was completed in 1937 and opened to the public on May 27 of that year.",
    difficulty: "medium",
    category: "San Francisco Landmarks",
    points: 10,
  },
  {
    id: "fallback-2",
    question: "Which San Francisco neighborhood is known as 'Little Italy'?",
    options: [
      "Mission District",
      "North Beach",
      "Chinatown",
      "Fisherman's Wharf",
    ],
    correctAnswer: 1,
    explanation:
      "North Beach is San Francisco's Little Italy, known for its Italian restaurants, cafes, and history.",
    difficulty: "easy",
    category: "San Francisco Neighborhoods",
    points: 5,
  },
  {
    id: "fallback-3",
    question:
      "What was the name of the famous prison located on Alcatraz Island?",
    options: [
      "San Quentin",
      "Folsom",
      "Alcatraz Federal Penitentiary",
      "Leavenworth",
    ],
    correctAnswer: 2,
    explanation:
      "Alcatraz Federal Penitentiary operated from 1934 to 1963 and housed notorious criminals like Al Capone.",
    difficulty: "easy",
    category: "San Francisco History",
    points: 5,
  },
  {
    id: "fallback-4",
    question:
      "In what year did the great San Francisco earthquake and fire occur?",
    options: ["1896", "1906", "1916", "1926"],
    correctAnswer: 1,
    explanation:
      "The devastating earthquake and subsequent fires occurred on April 18, 1906, destroying over 80% of the city.",
    difficulty: "medium",
    category: "San Francisco History",
    points: 10,
  },
  {
    id: "fallback-5",
    question:
      "Which famous San Francisco street is known for its eight hairpin turns?",
    options: [
      "Market Street",
      "Lombard Street",
      "California Street",
      "Van Ness Avenue",
    ],
    correctAnswer: 1,
    explanation:
      "Lombard Street between Hyde and Leavenworth Streets is famous for its eight sharp turns and is often called 'the crookedest street in the world.'",
    difficulty: "easy",
    category: "San Francisco Landmarks",
    points: 5,
  },
];

interface TriviaGameProps {
  mode?: "normal" | "study" | "challenge";
  onGameComplete?: (stats: GameStats) => void;
}

export function TriviaGame({
  mode = "normal",
  onGameComplete,
}: TriviaGameProps) {
  const [questions, setQuestions] = useState<TriviaQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [score, setScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [showBadgeDialog, setShowBadgeDialog] = useState(false);
  const [earnedBadge, setEarnedBadge] = useState<BadgeResult | null>(null);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [showMidGameShareDialog, setShowMidGameShareDialog] = useState(false);
  const [pointsAwarded, setPointsAwarded] = useState(0);
  const [hasSharedMidGame, setHasSharedMidGame] = useState(false);
  const [imageLoadError, setImageLoadError] = useState<Record<number, boolean>>(
    {},
  );
  const sharePromptShown = useRef(false);
  const imageRetries = useRef<Record<number, number>>({});
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [gameStats, setGameStats] = useState<GameStats>({
    currentStreak: 0,
    maxStreak: 0,
    difficultyMultiplier: 1,
    totalPoints: 0,
    correctAnswers: 0,
    totalAttempts: 0,
    averageResponseTime: 0,
    categories: {},
  });
  const [reviewCards, setReviewCards] = useState<TriviaQuestion[]>([]);
  const [showExplanation, setShowExplanation] = useState(false);
  const questionStartTime = useRef<number>(0);

  const { currentUser } = useUser();
  const { toast } = useToast();

  const isLoggedIn = !!currentUser;

  const handleAnswerSubmit = useCallback(async () => {
    if (selectedAnswer === null || isAnswerSubmitted) return;

    setIsAnswerSubmitted(true);
    setIsTimerRunning(false);

    const currentQuestion = questions[currentQuestionIndex];
    const isCorrect = selectedAnswer === currentQuestion.correctAnswer;
    const responseTime = Date.now() - questionStartTime.current;
    const streakBonus = getStreakBonus(gameStats.currentStreak);
    const timeBonus = Math.max(0, 1 - responseTime / 30000); // Bonus for quick answers
    const points = Math.round(
      currentQuestion.points *
        (isCorrect ? 1 : 0) *
        (1 + streakBonus + timeBonus),
    );

    setPointsAwarded(points);
    setScore((prev) => prev + points);

    // Update game stats
    const newStats = {
      ...gameStats,
      currentStreak: isCorrect ? gameStats.currentStreak + 1 : 0,
      maxStreak: isCorrect
        ? Math.max(gameStats.maxStreak, gameStats.currentStreak + 1)
        : gameStats.maxStreak,
      totalPoints: gameStats.totalPoints + points,
      correctAnswers: isCorrect
        ? gameStats.correctAnswers + 1
        : gameStats.correctAnswers,
      totalAttempts: gameStats.totalAttempts + 1,
      averageResponseTime:
        (gameStats.averageResponseTime * gameStats.totalAttempts +
          responseTime) /
        (gameStats.totalAttempts + 1),
      categories: {
        ...gameStats.categories,
        [currentQuestion.category]:
          (gameStats.categories[currentQuestion.category] || 0) +
          (isCorrect ? 1 : 0),
      },
    };
    setGameStats(newStats);

    // Check for badge progress
    if (isLoggedIn) {
      try {
        const supabase = getClientSideSupabase();
        const { data: badgeProgress, error: badgeError } = await supabase
          .from("badge_progress")
          .select("*")
          .eq("user_id", currentUser.id)
          .eq("badge_type", "trivia_master");

        if (badgeError) throw badgeError;

        if (badgeProgress && badgeProgress.length > 0) {
          const progress = badgeProgress[0];
          const updatedProgress = {
            ...progress,
            progress: Math.min(100, progress.progress + (isCorrect ? 10 : 0)),
            actions_completed: [
              ...(progress.actions_completed || []),
              `question_${currentQuestion.id}`,
            ],
          };

          const { error: updateError } = await supabase
            .from("badge_progress")
            .update(updatedProgress)
            .eq("id", progress.id);

          if (updateError) throw updateError;

          if (updatedProgress.progress >= 100 && !progress.is_unlocked) {
            setEarnedBadge({
              id: progress.id,
              badge_type: "trivia_master",
              earned_at: new Date().toISOString(),
              progress: 100,
              requirements: {
                correctAnswers: newStats.correctAnswers,
                attempts: newStats.totalAttempts,
                categories: Object.keys(newStats.categories),
              },
            });
            setShowBadgeDialog(true);
          }
        }
      } catch (error) {
        logError(
          "Error updating badge progress",
          error instanceof Error ? error : new Error(String(error)),
          "TriviaGame",
        );
      }
    }

    // Add to review cards if incorrect
    if (!isCorrect) {
      setReviewCards((prev) => [...prev, currentQuestion]);
    }

    // Show explanation
    setShowExplanation(true);
  }, [
    selectedAnswer,
    isAnswerSubmitted,
    questions,
    currentQuestionIndex,
    gameStats,
    isLoggedIn,
    currentUser?.id,
    setPointsAwarded,
    setScore,
    setGameStats,
    setEarnedBadge,
    setShowBadgeDialog,
    setReviewCards,
    setShowExplanation,
  ]);

  // Fetch trivia questions
  const fetchQuestions = useCallback(async () => {
    setIsLoading(true);
    setFetchError(null);

    try {
      // Add cache busting parameter to avoid cached responses
      const cacheBuster = new Date().getTime();
      const response = await fetch(
        `/api/trivia/questions?count=5&_=${cacheBuster}`,
      );

      if (!response.ok) {
        throw new Error(`API returned status: ${response.status}`);
      }

      const data = (await response.json()) as TriviaResponse;

      if (data.questions && data.questions.length > 0) {
        // Pre-load images to avoid loading delays during gameplay
        data.questions.forEach((question: TriviaQuestion, index: number) => {
          if (question.imageUrl && !question.imageUrl.startsWith("data:")) {
            const img = new window.Image();
            img.src = question.imageUrl;
            img.crossOrigin = "anonymous";
            img.onload = () => {
              console.log(`Image pre-loaded: ${question.imageUrl}`);
            };
            img.onerror = () => {
              console.warn(`Image failed to pre-load: ${question.imageUrl}`);
              setImageLoadError((prev) => ({ ...prev, [index]: true }));
            };
          }
        });

        setQuestions(data.questions);
      } else {
        console.warn(
          "No questions returned from API, using fallback questions",
        );
        setQuestions(FALLBACK_QUESTIONS);
      }
    } catch (error) {
      logError(
        "Error fetching trivia questions",
        error instanceof Error ? error : new Error(String(error)),
        "TriviaGame",
      );
      setFetchError(
        "We're having trouble loading questions. Using offline questions instead.",
      );
      setQuestions(FALLBACK_QUESTIONS);

      toast({
        title: "Using offline questions",
        description:
          "We're having trouble connecting to our servers. Using local questions instead.",
        variant: "default",
      });
    } finally {
      setIsLoading(false);
      setIsTimerRunning(true);
    }
  }, [toast]);

  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

  // Timer logic
  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (isTimerRunning && timeLeft > 0) {
      timer = setTimeout(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (isTimerRunning && timeLeft === 0) {
      // Time's up, auto-submit current answer or mark as incorrect
      if (selectedAnswer === null) {
        handleAnswerSubmit();
      }
    }

    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [isTimerRunning, timeLeft, selectedAnswer, handleAnswerSubmit]);

  // Reset timer when moving to next question
  useEffect(() => {
    if (isTimerRunning) {
      setTimeLeft(mode === "challenge" ? 15 : 30);
      questionStartTime.current = Date.now();
    }
  }, [currentQuestionIndex, isTimerRunning, mode]);

  // Handle game completion
  useEffect(() => {
    if (isGameOver && onGameComplete) {
      onGameComplete(gameStats);
    }
  }, [isGameOver, onGameComplete, gameStats]);

  // Handle mid-game share prompt
  useEffect(() => {
    if (
      !sharePromptShown.current &&
      !hasSharedMidGame &&
      currentQuestionIndex > 0 &&
      currentQuestionIndex < questions.length - 1 &&
      score > 0
    ) {
      setShowMidGameShareDialog(true);
      sharePromptShown.current = true;
    }
  }, [currentQuestionIndex, questions.length, score, hasSharedMidGame]);

  const handleAnswerSelect = (answerIndex: number) => {
    if (!isAnswerSubmitted) {
      setSelectedAnswer(answerIndex);
    }
  };

  const getStreakBonus = (streak: number): number => {
    if (streak >= 5) return 3;
    if (streak >= 3) return 2;
    if (streak >= 2) return 1.5;
    return 1;
  };

  const handleNextQuestion = () => {
    setShowExplanation(false);
    setSelectedAnswer(null);
    setIsAnswerSubmitted(false);
    setPointsAwarded(0);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      setIsGameOver(true);
      if (onGameComplete) {
        onGameComplete(gameStats);
      }
    }
  };

  const handleRestartGame = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setIsAnswerSubmitted(false);
    setIsGameOver(false);
    setScore(0);
    setTimeLeft(mode === "challenge" ? 15 : 30);
    setShowBadgeDialog(false);
    setShowShareDialog(false);
    setShowMidGameShareDialog(false);
    setPointsAwarded(0);
    setHasSharedMidGame(false);
    setReviewCards([]);
    setShowExplanation(false);
    setGameStats({
      currentStreak: 0,
      maxStreak: 0,
      difficultyMultiplier: 1,
      totalPoints: 0,
      correctAnswers: 0,
      totalAttempts: 0,
      averageResponseTime: 0,
      categories: {},
    });
    sharePromptShown.current = false;
    fetchQuestions();
  };

  const handleShareBadge = () => {
    setShowBadgeDialog(false);
    setShowShareDialog(true);
  };

  const handleShare = async (platform: string) => {
    try {
      const shareText = `I earned the ${getBadgeName(earnedBadge?.badge_type || "")} badge in the SFDSA Trivia Challenge! 🏆`;
      const shareUrl = window.location.href;

      switch (platform) {
        case "facebook":
          window.open(
            `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`,
            "_blank",
          );
          break;
        case "twitter":
          window.open(
            `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
            "_blank",
          );
          break;
        case "linkedin":
          window.open(
            `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
            "_blank",
          );
          break;
        case "email":
          window.location.href = `mailto:?subject=${encodeURIComponent("I earned a badge!")}&body=${encodeURIComponent(`${shareText}\n\n${shareUrl}`)}`;
          break;
        default:
          if (navigator.share) {
            await navigator.share({
              title: "SFDSA Trivia Badge",
              text: shareText,
              url: shareUrl,
            });
          }
      }

      await recordShare(platform, false);
      setShowShareDialog(false);
    } catch (error) {
      if (error instanceof Error && error.name !== "AbortError") {
        logError("Error sharing badge", error, "TriviaGame");
        toast({
          title: "Share failed",
          description: "Could not share badge. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  const recordShare = async (platform: string, isMidGameShare: boolean) => {
    if (!isLoggedIn) return;

    try {
      const supabase = getClientSideSupabase();
      const { error } = await supabase.from("social_shares").insert({
        user_id: currentUser.id,
        platform,
        content_type: "trivia_game",
        is_mid_game: isMidGameShare,
        game_stats: gameStats,
      });

      if (error) throw error;

      // Update points for sharing
      const sharePoints = isMidGameShare ? 5 : 10;
      setScore((prev) => prev + sharePoints);
      setGameStats((prev) => ({
        ...prev,
        totalPoints: prev.totalPoints + sharePoints,
      }));

      toast({
        title: "Points awarded!",
        description: `You earned ${sharePoints} points for sharing!`,
        variant: "default",
      });
    } catch (error) {
      logError(
        "Error recording share",
        error instanceof Error ? error : new Error(String(error)),
        "TriviaGame",
      );
      toast({
        title: "Error",
        description: "Failed to record your share. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSkipShare = () => {
    setShowMidGameShareDialog(false);
    setIsTimerRunning(true);
  };

  const handleImageError = (index: number) => {
    const retryCount = imageRetries.current[index] || 0;
    if (retryCount < 3) {
      imageRetries.current[index] = retryCount + 1;
      // Retry loading the image after a short delay
      setTimeout(() => {
        setImageLoadError((prev) => ({ ...prev, [index]: false }));
      }, 1000);
    } else {
      setImageLoadError((prev) => ({ ...prev, [index]: true }));
    }
  };

  const getBadgeName = (badgeType: string): string => {
    switch (badgeType) {
      case "trivia-master":
        return "Trivia Master";
      case "speed-demon":
        return "Speed Demon";
      case "challenge-champion":
        return "Challenge Champion";
      default:
        return "Trivia Badge";
    }
  };

  const getBadgeDescription = (badgeType: string): string => {
    switch (badgeType) {
      case "trivia-master":
        return "Achieve a perfect score in a trivia round";
      case "speed-demon":
        return "Answer 10 questions in under 5 seconds each";
      case "challenge-champion":
        return "Complete a perfect round in Challenge Mode";
      default:
        return "Earned a trivia badge";
    }
  };

  if (isLoading) {
    return (
      <Card className="shadow-md">
        <CardContent className="p-6">
          <Skeleton className="h-8 w-3/4 mb-4" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-full mb-6" />
          <Skeleton className="h-48 w-full mb-6 rounded-lg" />{" "}
          {/* Image placeholder */}
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
          <div className="flex justify-between mt-6">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-24" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isGameOver) {
    return (
      <Card className="shadow-md">
        <CardContent className="p-6 text-center">
          <h2 className="text-2xl font-bold text-foreground mb-4">Game Over!</h2>
          <div className="mb-6">
            <div className="text-4xl font-bold text-primary mb-2">
              {score}
            </div>
            <p className="text-muted-foreground">Final Score</p>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="text-center">
              <div className="text-lg font-semibold text-foreground">
                {gameStats.correctAnswers}
              </div>
              <p className="text-sm text-muted-foreground">Correct</p>
            </div>
            <div className="text-center">
              <p className="font-semibold text-primary">
                {Math.round((gameStats.correctAnswers / gameStats.totalAttempts) * 100)}%
              </p>
              <p className="text-sm text-muted-foreground">Accuracy</p>
            </div>
          </div>

          <div className="space-y-2 mb-6">
            <Button
              onClick={handleRestartGame}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Play Again
            </Button>
            <Button
              onClick={() => setIsGameOver(false)}
              variant="outline"
              className="w-full border-primary text-primary"
            >
              View Results
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Make sure we have questions and a valid currentQuestion before rendering
  if (!questions.length || !questions[currentQuestionIndex]) {
    return (
      <Card className="shadow-md">
        <CardContent className="p-6 text-center">
          <h2 className="text-2xl font-bold text-primary mb-4">
            {fetchError ? "Error Loading Questions" : "Loading Questions..."}
          </h2>

          {fetchError && (
            <div className="mb-4 p-4 bg-amber-50 border border-amber-200 rounded-md text-amber-800">
              <AlertCircle className="h-5 w-5 inline-block mr-2" />
              {fetchError}
            </div>
          )}

          <Button
            onClick={fetchQuestions}
            className="bg-primary hover:bg-primary/90"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            {fetchError ? "Try Again" : "Retry Loading Questions"}
          </Button>
        </CardContent>
      </Card>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div>
      {/* Mode selector with challenge mode */}
      <div className="flex justify-end mb-4">
        <Badge
          variant={
            mode === "study"
              ? "default"
              : mode === "challenge"
                ? "destructive"
                : "outline"
          }
          className="text-sm"
        >
          {mode === "study"
            ? "Study Mode"
            : mode === "challenge"
              ? "Challenge Mode"
              : "Normal Mode"}
        </Badge>
      </div>

      {/* Add challenge mode warning */}
      {mode === "challenge" && (
        <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/30 rounded-lg">
          <h3 className="text-red-600 dark:text-red-300 font-medium flex items-center">
            <AlertCircle className="w-4 h-4 mr-2" />
            Challenge Mode Active
          </h3>
          <p className="text-sm text-red-600 dark:text-red-300 mt-1">
            You have only 15 seconds per question, but earn double points! Stay
            focused!
          </p>
        </div>
      )}

      <Card className="shadow-md">
        <CardContent className="p-6">
          {/* Progress bar */}
          <div className="mb-6">
            <div className="flex justify-between mb-2">
              <span className="text-sm text-gray-500">
                Question {currentQuestionIndex + 1} of {questions.length}
              </span>
              <span className="text-sm text-gray-500">
                Score: {score}/{currentQuestionIndex}
              </span>
            </div>
            <Progress
              value={(currentQuestionIndex / questions.length) * 100}
              className="h-2"
            />
          </div>

          {/* Timer */}
          <div className="flex justify-between items-center mb-4">
            <Badge variant="outline" className="px-3 py-1">
              {currentQuestion.difficulty.toUpperCase()}
            </Badge>
            <div
              className={`flex items-center gap-1 ${timeLeft <= 10 ? "text-red-500" : "text-gray-600"}`}
            >
              <Clock className="h-4 w-4" />
              <span className="font-mono">{timeLeft}s</span>
            </div>
          </div>

          {/* Streak Indicator */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Badge
                variant={gameStats.currentStreak >= 3 ? "default" : "outline"}
                className="text-sm"
              >
                <Trophy className="w-4 h-4 mr-1" />
                Streak: {gameStats.currentStreak}
              </Badge>
              {currentQuestion && (
                <Badge variant="outline" className="text-sm">
                  {currentQuestion.difficulty.toUpperCase()}
                  {gameStats.difficultyMultiplier > 1 &&
                    ` (${gameStats.difficultyMultiplier}x)`}
                </Badge>
              )}
            </div>
            <div className="text-sm text-muted-foreground">
              Total Points: {gameStats.totalPoints}
            </div>
          </div>

          {/* Question Image */}
          {currentQuestion.imageUrl && (
            <div className="mb-4 rounded-lg overflow-hidden relative w-full h-48 md:h-64 bg-gray-100">
              {!imageLoadError[currentQuestionIndex] ? (
                <Image
                  src={currentQuestion.imageUrl || "/placeholder.svg"}
                  alt={
                    currentQuestion.imageAlt ||
                    `Image for question about ${currentQuestion.category}`
                  }
                  fill
                  className="object-cover"
                  onError={() => handleImageError(currentQuestionIndex)}
                  priority
                  sizes="(max-width: 768px) 100vw, 768px"
                  crossOrigin="anonymous"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                  <div className="text-center">
                    <ImageIcon className="h-12 w-12 mx-auto text-gray-400" />
                    <p className="text-sm text-gray-500 mt-2">
                      {currentQuestion.category
                        ? `Image related to ${currentQuestion.category}`
                        : "Image unavailable"}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Question */}
          <h3 className="text-xl font-semibold mb-6">
            {currentQuestion.question}
          </h3>

          {/* Answer options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentQuestion.options.map((option, index) => {
              // Kahoot-style colors
              const colorClasses = [
                'bg-red-500 hover:bg-red-600 border-red-600 text-white shadow-lg shadow-red-500/25', // Red
                'bg-blue-500 hover:bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-500/25', // Blue  
                'bg-yellow-500 hover:bg-yellow-600 border-yellow-600 text-white shadow-lg shadow-yellow-500/25', // Yellow
                'bg-green-500 hover:bg-green-600 border-green-600 text-white shadow-lg shadow-green-500/25' // Green
              ];
              
              // Selected state styling
              const selectedClass = selectedAnswer === index
                ? 'ring-4 ring-white ring-offset-4 ring-offset-gray-200 scale-105 transform'
                : 'hover:scale-102 transform';
              
              // Post-answer feedback styling
              let feedbackClass = '';
              if (isAnswerSubmitted) {
                if (index === currentQuestion.correctAnswer) {
                  feedbackClass = 'ring-4 ring-green-300 ring-offset-2';
                } else if (selectedAnswer === index && index !== currentQuestion.correctAnswer) {
                  feedbackClass = 'ring-4 ring-red-300 ring-offset-2 opacity-75';
                }
              }
              
              return (
                <motion.button
                  key={index}
                  whileHover={{ scale: isAnswerSubmitted ? 1 : (selectedAnswer === index ? 1.05 : 1.02) }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleAnswerSelect(index)}
                  disabled={isAnswerSubmitted}
                  className={`p-6 text-left rounded-xl border-2 transition-all duration-200 ${colorClasses[index]} ${selectedClass} ${feedbackClass} ${
                    isAnswerSubmitted ? 'cursor-default' : 'cursor-pointer'
                  }`}
                >
                  <div className="flex items-start">
                    <div className="mr-4 mt-0.5">
                      {isAnswerSubmitted ? (
                        index === currentQuestion.correctAnswer ? (
                          <div className="bg-white/20 w-10 h-10 rounded-full flex items-center justify-center">
                            <CheckCircle className="h-6 w-6 text-white" />
                          </div>
                        ) : selectedAnswer === index ? (
                          <div className="bg-white/20 w-10 h-10 rounded-full flex items-center justify-center">
                            <XCircle className="h-6 w-6 text-white" />
                          </div>
                        ) : (
                          <div className="bg-white/20 w-10 h-10 rounded-full flex items-center justify-center">
                            <span className="font-bold text-2xl text-white">
                              {String.fromCharCode(65 + index)}
                            </span>
                          </div>
                        )
                      ) : (
                        <div className="bg-white/20 w-10 h-10 rounded-full flex items-center justify-center">
                          <span className="font-bold text-2xl text-white">
                            {String.fromCharCode(65 + index)}
                          </span>
                        </div>
                      )}
                    </div>
                    <span className="text-lg font-semibold leading-relaxed text-white">{option}</span>
                  </div>
                </motion.button>
              );
            })}
          </div>

          {/* Explanation (shown after answering) */}
          <AnimatePresence>
            {isAnswerSubmitted && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-6 p-4 rounded-lg bg-blue-50 border border-blue-200 dark:bg-blue-900/20 dark:border-blue-800"
              >
                <div className="flex items-start">
                  <AlertCircle className="h-5 w-5 text-blue-500 mr-2 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-blue-700 dark:text-blue-300 mb-1">
                      Explanation
                    </h4>
                    <p className="text-sm text-blue-600 dark:text-blue-200">
                      {currentQuestion.explanation}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Action buttons */}
          <div className="flex justify-between mt-6">
            {!isAnswerSubmitted ? (
              <Button
                onClick={handleAnswerSubmit}
                disabled={selectedAnswer === null}
                className="bg-primary hover:bg-primary/90"
              >
                Submit Answer
              </Button>
            ) : (
              <Button
                onClick={handleNextQuestion}
                className="bg-primary hover:bg-primary/90"
              >
                {currentQuestionIndex === questions.length - 1
                  ? "See Results"
                  : "Next Question"}
              </Button>
            )}

            <Button
              variant="outline"
              onClick={handleRestartGame}
              className="border-primary text-primary"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Restart
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Mid-Game Share Dialog */}
      <Dialog
        open={showMidGameShareDialog}
        onOpenChange={setShowMidGameShareDialog}
      >
        <DialogContent className="sm:max-w-md">
          <DialogTitle className="text-center">
            Share and Earn Points!
          </DialogTitle>
          <DialogDescription className="text-center">
            Share this trivia game with friends and earn 15 bonus points!
          </DialogDescription>

          <div className="py-4 flex flex-col items-center">
            <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Share2 className="h-12 w-12 text-primary" />
            </div>
            <p className="text-center mb-4">
              Help us recruit more deputies by sharing this trivia game on
              social media!
            </p>

            <div className="grid grid-cols-2 gap-4 w-full">
              <Button
                className="bg-[#1877F2] hover:bg-[#1877F2]/90"
                onClick={() => handleShare("facebook")}
              >
                <Facebook className="h-4 w-4 mr-2" />
                Facebook
              </Button>
              <Button
                className="bg-[#1DA1F2] hover:bg-[#1DA1F2]/90"
                onClick={() => handleShare("twitter")}
              >
                <Twitter className="h-4 w-4 mr-2" />
                Twitter
              </Button>
              <Button
                className="bg-[#0A66C2] hover:bg-[#0A66C2]/90"
                onClick={() => handleShare("linkedin")}
              >
                <Linkedin className="h-4 w-4 mr-2" />
                LinkedIn
              </Button>
              <Button
                variant="outline"
                onClick={() => handleShare("copy")}
                className="border-primary text-primary"
              >
                <Mail className="h-4 w-4 mr-2" />
                Copy Link
              </Button>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={handleSkipShare}
              className="w-full"
            >
              Skip for now
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Badge Earned Dialog */}
      <Dialog open={showBadgeDialog} onOpenChange={setShowBadgeDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogTitle className="text-center">Badge Earned!</DialogTitle>
          <div className="py-6 flex flex-col items-center">
            <div className="w-32 h-32 rounded-full bg-[#FFD700]/20 flex items-center justify-center mb-4">
              <Award className="h-16 w-16 text-[#FFD700]" />
            </div>
            <h3 className="text-xl font-bold text-primary mb-2">
              {getBadgeName(earnedBadge?.badge_type || "")}
            </h3>
            <p className="text-center text-gray-600">
              {getBadgeDescription(earnedBadge?.badge_type || "")}
            </p>
          </div>
          <DialogFooter>
            <Button onClick={handleShareBadge} className="w-full bg-primary">
              <Share2 className="h-4 w-4 mr-2" />
              Share Badge
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Share Dialog */}
      <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogTitle>Share Your Achievement</DialogTitle>
          <DialogDescription>
            {earnedBadge
              ? `Share your new "${getBadgeName(earnedBadge.badge_type)}" badge with friends!`
              : `Share your trivia score of ${score}/${questions.length} with friends!`}
          </DialogDescription>

          <div className="grid grid-cols-2 gap-4 my-4">
            <Button
              className="bg-[#1877F2] hover:bg-[#1877F2]/90"
              onClick={() => handleShare("facebook")}
            >
              <Facebook className="h-4 w-4 mr-2" />
              Facebook
            </Button>
            <Button
              className="bg-[#1DA1F2] hover:bg-[#1DA1F2]/90"
              onClick={() => handleShare("twitter")}
            >
              <Twitter className="h-4 w-4 mr-2" />
              Twitter
            </Button>
            <Button
              className="bg-[#0A66C2] hover:bg-[#0A66C2]/90"
              onClick={() => handleShare("linkedin")}
            >
              <Linkedin className="h-4 w-4 mr-2" />
              LinkedIn
            </Button>
            <Button
              variant="outline"
              onClick={() => handleShare("copy")}
              className="border-primary text-primary"
            >
              <Mail className="h-4 w-4 mr-2" />
              Copy Link
            </Button>
          </div>

          <div className="bg-primary/5 p-3 rounded-lg text-sm">
            <p className="font-medium">Customize your message:</p>
            <textarea
              className="w-full mt-2 p-2 border rounded-md text-sm"
              rows={3}
              defaultValue={
                earnedBadge
                  ? `I just earned the ${getBadgeName(earnedBadge.badge_type)} badge playing the San Francisco Trivia Game! Test your knowledge too!`
                  : `I scored ${score}/${questions.length} on the San Francisco Trivia Game! Think you can beat me?`
              }
            ></textarea>
          </div>
        </DialogContent>
      </Dialog>

      {/* Show explanation in study mode */}
      {mode === "study" && showExplanation && currentQuestion && (
        <Card className="mt-4 bg-muted">
          <CardContent className="pt-4">
            <h3 className="font-medium mb-2">Explanation</h3>
            <p className="text-sm text-gray-600">
              {currentQuestion.explanation}
            </p>
            {currentQuestion.imageUrl && (
              <div className="mt-2">
                <Image
                  src={currentQuestion.imageUrl}
                  alt={currentQuestion.imageAlt || "Question illustration"}
                  width={300}
                  height={200}
                  className="rounded-md"
                  onError={() => handleImageError(currentQuestionIndex)}
                />
              </div>
            )}
            <div className="mt-4">
              <Button
                onClick={() => {
                  setShowExplanation(false);
                  handleNextQuestion();
                }}
                className="w-full"
              >
                Next Question
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Review cards at the end of study mode */}
      {mode === "study" && isGameOver && reviewCards.length > 0 && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Review These Questions</CardTitle>
            <CardDescription>
              You had trouble with {reviewCards.length} question
              {reviewCards.length > 1 ? "s" : ""}. Take some time to review
              them.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {reviewCards.map((card, index) => (
                <Card key={index} className="bg-muted">
                  <CardContent className="pt-4">
                    <p className="font-medium mb-2">{card.question}</p>
                    <p className="text-sm text-green-600 mb-2">
                      Correct Answer: {card.options[card.correctAnswer]}
                    </p>
                    <p className="text-sm text-gray-600">{card.explanation}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
