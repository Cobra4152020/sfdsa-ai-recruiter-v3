"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useUser } from "@/context/user-context";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent } from "@/components/ui/card";
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
  Volume2,
  VolumeX,
  Info,
  WifiOff,
} from "lucide-react";
import confetti from "canvas-confetti";
import Image from "next/image";
import { trackEngagement } from "@/lib/analytics";

export interface TriviaQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: "easy" | "medium" | "hard";
  category: string;
  imageUrl?: string;
  imageAlt?: string;
}

interface BadgeResult {
  id: string;
  badge_type: string;
  earned_at: string;
}

interface EnhancedTriviaGameProps {
  gameId: string;
  gameName: string;
  gameDescription: string;
  fetchQuestionsEndpoint: string;
  submitEndpoint: string;
  shareEndpoint: string;
  badgeTypes: {
    participant: string;
    enthusiast: string;
    master: string;
  };
  pointsPerQuestion?: number;
  pointsPerGame?: number;
  pointsForSharing?: number;
}

// Fallback questions in case API fails
const fallbackQuestions: TriviaQuestion[] = [
  {
    id: "fallback-1",
    question: "What year was the Golden Gate Bridge completed?",
    options: ["1937", "1927", "1947", "1957"],
    correctAnswer: 0,
    explanation:
      "The Golden Gate Bridge was completed in 1937 after four years of construction.",
    difficulty: "easy" as const,
    category: "landmarks",
    imageUrl: "/golden-gate-bridge.png",
    imageAlt: "The Golden Gate Bridge in San Francisco",
  },
  {
    id: "fallback-2",
    question:
      "Which famous prison is located on an island in San Francisco Bay?",
    options: ["Rikers Island", "San Quentin", "Alcatraz", "Folsom"],
    correctAnswer: 2,
    explanation:
      "Alcatraz Federal Penitentiary operated from 1934 to 1963 on Alcatraz Island in San Francisco Bay.",
    difficulty: "easy" as const,
    category: "landmarks",
    imageUrl: "/alcatraz-prison-san-francisco.png",
    imageAlt: "Alcatraz prison on its island in San Francisco Bay",
  },
  {
    id: "fallback-3",
    question:
      "What was the name of the 1906 natural disaster that devastated San Francisco?",
    options: [
      "Great Quake",
      "San Francisco Tremor",
      "Golden Gate Disaster",
      "California Shaker",
    ],
    correctAnswer: 0,
    explanation:
      "The Great Quake of 1906 caused devastating fires and destroyed over 80% of the city.",
    difficulty: "medium" as const,
    category: "history",
    imageUrl: "/1906-san-francisco-earthquake.png",
    imageAlt: "Aftermath of the 1906 San Francisco earthquake",
  },
  {
    id: "fallback-4",
    question:
      "Which famous San Francisco neighborhood is known for its LGBT history and activism?",
    options: ["Haight-Ashbury", "Mission District", "Castro", "North Beach"],
    correctAnswer: 2,
    explanation:
      "The Castro District has been the center of LGBT activism and culture in San Francisco since the 1960s.",
    difficulty: "medium" as const,
    category: "culture",
    imageUrl: "/castro-district-san-francisco.png",
    imageAlt: "The iconic Castro Theater in San Francisco's Castro District",
  },
  {
    id: "fallback-5",
    question: "What is the name of San Francisco's famous cable car system?",
    options: [
      "Market Street Railway",
      "Muni Metro",
      "BART",
      "San Francisco Municipal Railway",
    ],
    correctAnswer: 3,
    explanation:
      "San Francisco Municipal Railway (Muni) operates the historic cable car system, which is the last manually operated cable car system in the world.",
    difficulty: "easy" as const,
    category: "transportation",
    imageUrl: "/san-francisco-cable-car.png",
    imageAlt: "A San Francisco cable car climbing up a hill",
  },
];

export function EnhancedTriviaGame({
  gameId,
  gameName,
  gameDescription, // eslint-disable-line @typescript-eslint/no-unused-vars
  fetchQuestionsEndpoint,
  submitEndpoint,
  shareEndpoint,
  badgeTypes,
  pointsPerQuestion = 10,
  pointsPerGame = 50,
  pointsForSharing = 15,
}: EnhancedTriviaGameProps) {
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
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrectAnswer, setIsCorrectAnswer] = useState(false);
  const [volume, setVolume] = useState<number>(0.7); // Default volume: 70%
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [retryCount, setRetryCount] = useState(0);
  // const [isOnline, setIsOnline] = useState<boolean>(true);
  const [showNetworkError, setShowNetworkError] = useState<boolean>(false);
  const [questionSource, setQuestionSource] = useState<string>("loading");
  const [requestId, setRequestId] = useState<string | null>(null);

  // Create refs for audio elements
  const correctAudioRef = useRef<HTMLAudioElement | null>(null);
  const wrongAudioRef = useRef<HTMLAudioElement | null>(null);

  const sharePromptShown = useRef(false);
  const imageRetries = useRef<Record<number, number>>({});
  const abortControllerRef = useRef<AbortController | null>(null);
  const fetchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const { currentUser, isLoggedIn } = useUser();
  const { toast } = useToast();

  // Network status monitoring
  useEffect(() => {
    const handleOnline = () => {
      // setIsOnline(true);
      toast({
        title: "You&apos;re back online!",
        description: "Reconnected to the network. Game functionality restored.",
        variant: "default",
      });
    };

    const handleOffline = () => {
      // setIsOnline(false);
      toast({
        title: "You&apos;re offline",
        description: "Some game features may be limited until you reconnect.",
        variant: "destructive",
      });
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Set initial online status
    // setIsOnline(navigator.onLine);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [toast]);

  // Initialize audio elements
  useEffect(() => {
    try {
      correctAudioRef.current = new Audio("/sounds/correct-answer.mp3");
      wrongAudioRef.current = new Audio("/sounds/wrong-answer.mp3");
    } catch (error) {
      console.error("Error initializing audio:", error);
    }

    // Cleanup function
    return () => {
      if (correctAudioRef.current) {
        correctAudioRef.current.pause();
        correctAudioRef.current = null;
      }
      if (wrongAudioRef.current) {
        wrongAudioRef.current.pause();
        wrongAudioRef.current = null;
      }
    };
  }, []);

  // Fetch trivia questions
  useEffect(() => {
    fetchQuestions();

    // Cleanup function to abort any in-progress fetches when component unmounts
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      if (fetchTimeoutRef.current) {
        clearTimeout(fetchTimeoutRef.current);
      }
    };
  }, []);

  // Timer logic
  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (isTimerRunning && timeLeft > 0) {
      timer = setTimeout(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (isTimerRunning && timeLeft === 0) {
      // Time's up, auto-submit current answer or mark as incorrect
      handleAnswerSubmit();
    }

    return () => clearTimeout(timer);
  }, [timeLeft, isTimerRunning]);

  // Start timer when questions are loaded
  useEffect(() => {
    if (
      questions.length > 0 &&
      !isGameOver &&
      !isAnswerSubmitted &&
      questions[currentQuestionIndex]
    ) {
      setIsTimerRunning(true);
    }
  }, [questions, currentQuestionIndex, isAnswerSubmitted, isGameOver]);

  // Show mid-game share prompt after the second question
  useEffect(() => {
    if (
      currentQuestionIndex === 2 &&
      !isAnswerSubmitted &&
      !sharePromptShown.current &&
      !hasSharedMidGame
    ) {
      sharePromptShown.current = true;
      // Pause the timer while showing the share dialog
      setIsTimerRunning(false);
      setShowMidGameShareDialog(true);
    }
  }, [currentQuestionIndex, isAnswerSubmitted, hasSharedMidGame]);

  // Hide feedback after 2 seconds
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (showFeedback) {
      timer = setTimeout(() => {
        setShowFeedback(false);
      }, 2000);
    }
    return () => clearTimeout(timer);
  }, [showFeedback]);

  // Initialize volume from localStorage and set up event listeners
  useEffect(() => {
    try {
      // Load volume settings from localStorage
      const savedVolume = localStorage.getItem("triviaGameVolume");
      const savedMuted = localStorage.getItem("triviaGameMuted");

      if (savedVolume !== null) {
        setVolume(Number.parseFloat(savedVolume));
      }

      if (savedMuted !== null) {
        setIsMuted(savedMuted === "true");
      }

      // Apply initial volume settings to audio elements
      if (correctAudioRef.current) {
        correctAudioRef.current.volume = isMuted ? 0 : volume;
      }
      if (wrongAudioRef.current) {
        wrongAudioRef.current.volume = isMuted ? 0 : volume;
      }
    } catch (error) {
      console.error("Error initializing volume settings:", error);
    }
  }, []);

  const handleVolumeChange = (newVolume: number) => {
    try {
      setVolume(newVolume);
      localStorage.setItem("triviaGameVolume", newVolume.toString());

      // Apply volume to audio elements
      if (correctAudioRef.current) {
        correctAudioRef.current.volume = isMuted ? 0 : newVolume;
      }
      if (wrongAudioRef.current) {
        wrongAudioRef.current.volume = isMuted ? 0 : newVolume;
      }
    } catch (error) {
      console.error("Error changing volume:", error);
    }
  };

  const toggleMute = () => {
    try {
      const newMuted = !isMuted;
      setIsMuted(newMuted);
      localStorage.setItem("triviaGameMuted", newMuted.toString());

      // Apply mute state to audio elements
      if (correctAudioRef.current) {
        correctAudioRef.current.volume = newMuted ? 0 : volume;
      }
      if (wrongAudioRef.current) {
        wrongAudioRef.current.volume = newMuted ? 0 : volume;
      }
    } catch (error) {
      console.error("Error toggling mute:", error);
    }
  };

  const fetchQuestions = useCallback(async () => {
    // Reset state for a new fetch
    setIsLoading(true);
    setFetchError(null);
    setShowNetworkError(false);

    // Cancel any previous fetch
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Clear any existing timeout
    if (fetchTimeoutRef.current) {
      clearTimeout(fetchTimeoutRef.current);
    }

    // Create a new abort controller for this fetch
    abortControllerRef.current = new AbortController();

    // Set a timeout for the fetch operation
    const fetchTimeout = setTimeout(() => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
        setFetchError(
          `Request timed out after 10 seconds. Please check your connection and try again.`,
        );
        setIsLoading(false);
      }
    }, 10000);

    fetchTimeoutRef.current = fetchTimeout;

    try {
      // Check if we're online before attempting to fetch
      if (!navigator.onLine) {
        throw new Error(
          "You appear to be offline. Please check your internet connection and try again.",
        );
      }

      // Add cache busting parameter to avoid cached responses
      const cacheBuster = new Date().getTime();
      const response = await fetch(
        `${fetchQuestionsEndpoint}?count=5&gameId=${gameId}&_=${cacheBuster}`,
        {
          signal: abortControllerRef.current.signal,
          headers: {
            "Cache-Control": "no-cache, no-store, must-revalidate",
            Pragma: "no-cache",
            Expires: "0",
          },
        },
      );

      // Clear the timeout since we got a response
      clearTimeout(fetchTimeout);
      fetchTimeoutRef.current = null;

      if (!response.ok) {
        throw new Error(`API returned status: ${response.status}`);
      }

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      if (!data.questions || data.questions.length === 0) {
        throw new Error(`No questions returned for ${gameName}`);
      }

      // Store the request ID and source for diagnostics
      setRequestId(data.requestId || null);
      setQuestionSource(data.source || "unknown");

      // Pre-load images to avoid loading delays during gameplay
      data.questions.forEach((question: TriviaQuestion) => {
        if (question.imageUrl && !question.imageUrl.startsWith("data:")) {
          try {
            const img = new window.Image();
            img.src = question.imageUrl;
            img.crossOrigin = "anonymous";
          } catch (error) {
            console.error("Error preloading image:", error);
          }
        }
      });

      setQuestions(data.questions);
      console.log(
        `Loaded ${data.questions.length} questions for ${gameId} from ${data.source}`,
      );

      // Reset retry count on successful fetch
      setRetryCount(0);

      // Track successful question load
      try {
        trackEngagement("trivia_questions_loaded", {
          gameId,
          source: data.source,
          questionCount: data.questions.length,
          requestId: data.requestId,
        });
      } catch (error) {
        console.error("Error tracking engagement:", error);
      }
    } catch (error) {
      // Clear the timeout if there was an error
      clearTimeout(fetchTimeout);
      fetchTimeoutRef.current = null;

      // Handle abort errors differently
      if (error instanceof Error && error.name === "AbortError") {
        setFetchError("Request was cancelled. Please try again.");
        // Use fallback questions
        setQuestions(fallbackQuestions);
        setQuestionSource("fallback-abort");
        return;
      }

      // Check if it's a network error
      if (
        !navigator.onLine ||
        (error instanceof Error &&
          error.message &&
          (error.message.includes("offline") ||
            error.message.includes("network")))
      ) {
        setShowNetworkError(true);
      }

      // Safely handle the error without destructuring
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      console.error(`Error fetching ${gameId} trivia questions:`, error);
      setFetchError(
        `We're having trouble loading ${gameName} questions. ${errorMessage}`,
      );

      // Use fallback questions
      setQuestions(fallbackQuestions);
      setQuestionSource("fallback-error");

      // Increment retry count
      setRetryCount((prev) => prev + 1);

      // Track failed question load
      try {
        trackEngagement("trivia_questions_error", {
          gameId,
          error: errorMessage,
          retryCount: retryCount + 1,
        });
      } catch (trackError) {
        console.error("Error tracking engagement:", trackError);
      }

      toast({
        title: "Using backup questions",
        description:
          "We're having trouble connecting to our servers. Using local questions instead.",
        variant: "default",
      });
    } finally {
      setIsLoading(false);
      setIsTimerRunning(true);

      // Clear the abort controller reference
      abortControllerRef.current = null;
    }
  }, [fetchQuestionsEndpoint, gameId, gameName, retryCount, toast]);

  const handleAnswerSelect = (answerIndex: number) => {
    if (!isAnswerSubmitted) {
      setSelectedAnswer(answerIndex);
      handleAnswerSubmit(answerIndex);
    }
  };

  const handleSubmitClick = () => {
    handleAnswerSubmit();
  };

  const handleAnswerSubmit = async (selectedIdx?: number) => {
    const answerIndex = selectedIdx ?? selectedAnswer;
    if (answerIndex === null) return;

    setIsTimerRunning(false);
    setIsAnswerSubmitted(true);

    const currentQuestion = questions[currentQuestionIndex];
    if (!currentQuestion) return; // Safety check

    console.log("Checking answer:", {
      selected: answerIndex,
      correct: currentQuestion.correctAnswer,
      selectedType: typeof answerIndex,
      correctType: typeof currentQuestion.correctAnswer,
    });

    const isCorrect = answerIndex === currentQuestion.correctAnswer;
    setIsCorrectAnswer(isCorrect);
    setShowFeedback(true);

    if (isCorrect) {
      // Play correct sound effect
      try {
        if (correctAudioRef.current) {
          correctAudioRef.current.volume = isMuted ? 0 : volume;
          correctAudioRef.current.currentTime = 0;
          correctAudioRef.current
            .play()
            .catch((err) => console.error("Error playing sound:", err));
        }
      } catch (error) {
        console.error("Error playing correct sound:", error);
      }

      // Update scores
      setScore((prev) => prev + 1);
      setCorrectAnswers((prev) => prev + 1);

      // Show confetti for correct answers
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { x: 0.5, y: 0.6 },
          colors: ["#FFD700", "#0A3C1F", "#FFFFFF"],
        });
      } catch (error) {
        console.error("Error showing confetti:", error);
      }
    } else {
      // Play wrong sound effect
      try {
        if (wrongAudioRef.current) {
          wrongAudioRef.current.volume = isMuted ? 0 : volume;
          wrongAudioRef.current.currentTime = 0;
          wrongAudioRef.current
            .play()
            .catch((err) => console.error("Error playing sound:", err));
        }
      } catch (error) {
        console.error("Error playing wrong sound:", error);
      }
    }

    // Track this answer in analytics
    /*
    try {
      trackEngagement("trivia_answer", {
        gameId,
        questionId: currentQuestion.id,
        isCorrect,
        timeSpent: 30 - timeLeft,
        difficulty: currentQuestion.difficulty,
        requestId,
      });
    } catch (error) {
      console.error("Error tracking answer:", error);
    }
    */

    // If this is the last question, end the game
    if (currentQuestionIndex === questions.length - 1) {
      if (isLoggedIn && currentUser) {
        try {
          const response = await fetch(submitEndpoint, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              userId: currentUser.id,
              gameId: gameId,
              score: isCorrect ? score + 1 : score,
              totalQuestions: questions.length,
              correctAnswers: isCorrect ? correctAnswers + 1 : correctAnswers,
              timeSpent: questions.length * 30 - timeLeft,
              requestId,
            }),
          });

          const result = await response.json();

          if (result.success) {
            setPointsAwarded(
              result.pointsAwarded || score * pointsPerQuestion + pointsPerGame,
            );

            // If a badge was awarded, show the badge dialog
            if (result.badgeAwarded) {
              setEarnedBadge(result.badgeAwarded);
              setTimeout(() => {
                setShowBadgeDialog(true);
              }, 2000); // Show after feedback disappears
            } else {
              setTimeout(() => {
                setIsGameOver(true);
              }, 2000); // Show after feedback disappears
            }
          } else {
            setTimeout(() => {
              setIsGameOver(true);
            }, 2000);
          }
        } catch (error) {
          console.error(`Error submitting ${gameId} trivia results:`, error);
          setTimeout(() => {
            setIsGameOver(true);
          }, 2000); // Show after feedback disappears
        }
      } else {
        setTimeout(() => {
          setIsGameOver(true);
        }, 2000); // Show after feedback disappears
      }
    }
  };

  const handleNextQuestion = () => {
    setSelectedAnswer(null);
    setIsAnswerSubmitted(false);
    setCurrentQuestionIndex((prev) => prev + 1);
    setTimeLeft(30); // Reset timer for next question
    setIsTimerRunning(true);
  };

  const handleRestartGame = () => {
    setQuestions([]);
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setIsAnswerSubmitted(false);
    setIsGameOver(false);
    setScore(0);
    setCorrectAnswers(0);
    setTimeLeft(30);
    setHasSharedMidGame(false);
    setImageLoadError({});
    imageRetries.current = {};
    sharePromptShown.current = false;
    fetchQuestions();
  };

  const handleShareBadge = () => {
    setShowBadgeDialog(false);
    setShowShareDialog(true);
  };

  const handleShare = async (platform: string) => {
    const isMidGameShare = showMidGameShareDialog;
    const shareText = isMidGameShare
      ? `I'm playing the ${gameName} with Sgt. Ken! Test your knowledge of SF and see if you can beat my score!`
      : earnedBadge
        ? `I just earned the ${getBadgeName(earnedBadge?.badge_type || "")} badge playing the ${gameName}! Test your knowledge too!`
        : `I scored ${score}/${questions.length} on the ${gameName}! Think you can beat me?`;

    const shareUrl = `${window.location.origin}/trivia/${gameId}`;
    let shareLink = "";

    switch (platform) {
      case "twitter":
        shareLink = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
        break;
      case "facebook":
        shareLink = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`;
        break;
      case "linkedin":
        shareLink = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(shareText)}`;
        break;
      default:
        // Copy to clipboard
        try {
          navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
          toast({
            title: "Link copied!",
            description: "Share link copied to clipboard",
          });
        } catch (error) {
          console.error("Error copying to clipboard:", error);
          toast({
            title: "Couldn't copy link",
            description: "Please try another sharing method",
            variant: "destructive",
          });
        }

        if (isMidGameShare) {
          setShowMidGameShareDialog(false);
          setIsTimerRunning(true);
          setHasSharedMidGame(true);
        } else {
          setShowShareDialog(false);
        }

        // Record the share and award points
        if (isLoggedIn && currentUser) {
          recordShare("clipboard", isMidGameShare);
        }
        return;
    }

    // Open share link in new window
    try {
      window.open(shareLink, "_blank");
    } catch (error) {
      console.error("Error opening share link:", error);
      toast({
        title: "Couldn't open sharing page",
        description: "Please try another sharing method",
        variant: "destructive",
      });
    }

    if (isMidGameShare) {
      setShowMidGameShareDialog(false);
      setIsTimerRunning(true);
      setHasSharedMidGame(true);
    } else {
      setShowShareDialog(false);
    }

    // Record the share and award points
    if (isLoggedIn && currentUser) {
      recordShare(platform, isMidGameShare);
    }
  };

  const recordShare = async (platform: string, isMidGameShare: boolean) => {
    try {
      const currentQuestion =
        isMidGameShare && questions[currentQuestionIndex]
          ? currentQuestionIndex
          : null;

      const response = await fetch(shareEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: currentUser?.id,
          gameId: gameId,
          platform,
          questionId: currentQuestion,
          requestId,
        }),
      });

      const result = await response.json();

      if (result.success) {
        toast({
          title: "Points awarded!",
          description: `You earned ${pointsForSharing} points for sharing!`,
          duration: 3000,
        });
      }
    } catch (error) {
      console.error(`Error recording ${gameId} share:`, error);
    }
  };

  const handleSkipShare = () => {
    setShowMidGameShareDialog(false);
    setIsTimerRunning(true);
  };

  const handleImageError = (index: number) => {
    // Track retry attempts for this image
    const retries = imageRetries.current[index] || 0;

    // Only allow 2 retries before marking as error
    if (retries < 2) {
      imageRetries.current[index] = retries + 1;

      // Try to reload with a cache buster
      const question = questions[index];
      if (question && question.imageUrl) {
        try {
          // Add timestamp to bust cache
          const cacheBuster = new Date().getTime();
          let newUrl = question.imageUrl;

          // If it's a placeholder.svg URL, regenerate it
          if (question.imageUrl.includes("placeholder.svg")) {
            newUrl = `/placeholder.svg?height=300&width=500&query=${encodeURIComponent(question.question)}&_=${cacheBuster}`;
          } else if (!question.imageUrl.includes("?")) {
            newUrl = `${question.imageUrl}?_=${cacheBuster}`;
          } else {
            newUrl = `${question.imageUrl}&_=${cacheBuster}`;
          }

          // Update the image URL
          const updatedQuestions = [...questions];
          updatedQuestions[index] = {
            ...question,
            imageUrl: newUrl,
          };
          setQuestions(updatedQuestions);

          // Don't mark as error yet
          return;
        } catch (error) {
          console.error("Error updating image URL:", error);
        }
      }
    }

    // If we've exceeded retries or couldn't reload, mark as error
    setImageLoadError((prev) => ({ ...prev, [index]: true }));
  };

  const getBadgeName = (badgeType: string): string => {
    switch (badgeType) {
      case badgeTypes.participant:
        return `${gameName} Participant`;
      case badgeTypes.enthusiast:
        return `${gameName} Enthusiast`;
      case badgeTypes.master:
        return `${gameName} Master`;
      default:
        return `SF Trivia Badge`;
    }
  };

  const getBadgeDescription = (badgeType: string): string => {
    switch (badgeType) {
      case badgeTypes.participant:
        return `Awarded for participating in your first ${gameName} round.`;
      case badgeTypes.enthusiast:
        return `Awarded for completing 5 rounds of the ${gameName}.`;
      case badgeTypes.master:
        return `Awarded for achieving 3 perfect scores in the ${gameName}.`;
      default:
        return `A special badge earned through the ${gameName}.`;
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
          <h2 className="text-2xl font-bold text-[#0A3C1F] mb-4">Game Over!</h2>

          <div className="bg-[#0A3C1F]/10 rounded-lg p-6 mb-6">
            <div className="text-4xl font-bold text-[#0A3C1F] mb-2">
              {score} / {questions.length}
            </div>
            <p className="text-gray-600">
              {score === questions.length
                ? "Perfect score! Amazing job!"
                : score >= questions.length / 2
                  ? `Great job! You know ${gameName.replace("Trivia", "")} well!`
                  : `Good effort! Keep learning about ${gameName.replace("Trivia", "")}!`}
            </p>

            {isLoggedIn && (
              <div className="mt-4 p-3 bg-[#FFD700]/20 rounded-lg">
                <p className="font-semibold text-[#0A3C1F]">
                  <Trophy className="h-5 w-5 inline-block mr-2" />
                  You earned {pointsAwarded} points!
                </p>
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button
              onClick={handleRestartGame}
              className="bg-[#0A3C1F] hover:bg-[#0A3C1F]/90"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Play Again
            </Button>

            {isLoggedIn ? (
              <Button
                onClick={() => setShowShareDialog(true)}
                variant="outline"
                className="border-[#0A3C1F] text-[#0A3C1F]"
              >
                <Share2 className="h-4 w-4 mr-2" />
                Share Results
              </Button>
            ) : (
              <Button
                onClick={() => (window.location.href = "/badges")}
                variant="outline"
                className="border-[#0A3C1F] text-[#0A3C1F]"
              >
                <Award className="h-4 w-4 mr-2" />
                View Badges
              </Button>
            )}
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
          <h2 className="text-2xl font-bold text-[#0A3C1F] mb-4">
            {fetchError ? "Error Loading Questions" : "Loading Questions..."}
          </h2>

          {fetchError && (
            <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-md text-amber-800">
              <AlertCircle className="h-5 w-5 inline-block mr-2" />
              {fetchError}
            </div>
          )}

          {showNetworkError && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md text-red-800">
              <WifiOff className="h-5 w-5 inline-block mr-2" />
              <p className="font-medium">Network connection issue detected</p>
              <p className="text-sm mt-1">
                Please check your internet connection and try again.
              </p>
            </div>
          )}

          <Button
            onClick={fetchQuestions}
            className="bg-[#0A3C1F] hover:bg-[#0A3C1F]/90"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Loading...
              </>
            ) : (
              <>
                <RefreshCw className="h-4 w-4 mr-2" />
                {fetchError ? "Try Again" : "Retry Loading Questions"}
              </>
            )}
          </Button>

          {retryCount > 2 && (
            <div className="mt-4 text-sm text-gray-600">
              <Info className="h-4 w-4 inline-block mr-1" />
              Still having trouble? Try refreshing the page or coming back
              later.
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <>
      {/* Hidden audio elements for sounds */}
      <audio
        ref={correctAudioRef}
        src="/sounds/correct-answer.mp3"
        preload="auto"
      />
      <audio
        ref={wrongAudioRef}
        src="/sounds/wrong-answer.mp3"
        preload="auto"
      />

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

          {/* Volume Control */}
          <div className="mb-4 flex items-center space-x-2 bg-gray-50 dark:bg-gray-800 p-2 rounded-lg">
            <button
              onClick={toggleMute}
              className="p-1 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              aria-label={
                isMuted ? "Unmute sound effects" : "Mute sound effects"
              }
            >
              {isMuted ? (
                <VolumeX className="h-5 w-5 text-gray-500" />
              ) : (
                <Volume2 className="h-5 w-5 text-gray-700 dark:text-gray-300" />
              )}
            </button>

            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={(e) =>
                handleVolumeChange(Number.parseFloat(e.target.value))
              }
              className="w-24 h-2 bg-gray-300 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer"
              aria-label="Volume control"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={Math.round(volume * 100)}
              aria-valuetext={`Volume ${Math.round(volume * 100)}%`}
              disabled={isMuted}
            />

            <span className="text-xs text-gray-500 dark:text-gray-400 min-w-[40px]">
              {isMuted ? "Muted" : `${Math.round(volume * 100)}%`}
            </span>
          </div>

          {/* Question Image with Feedback Overlay */}
          <div className="mb-4 rounded-lg overflow-hidden relative w-full h-48 md:h-64 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden flex items-center justify-center">
            {imageLoadError[currentQuestionIndex] ||
            !currentQuestion.imageUrl ? (
              <div className="text-center text-gray-500 dark:text-gray-400 p-4">
                <ImageIcon className="h-12 w-12 mx-auto text-gray-400" />
                <p className="mt-2 text-sm">Image not available</p>
              </div>
            ) : (
              <Image
                src={currentQuestion.imageUrl}
                alt={
                  currentQuestion.imageAlt || "Trivia question image"
                }
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                onError={() => handleImageError(currentQuestionIndex)}
                priority={currentQuestionIndex === 0}
              />
            )}

            {/* Feedback overlay */}
            <AnimatePresence>
              {showFeedback && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10"
                >
                  <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", damping: 10 }}
                  >
                    {isCorrectAnswer ? (
                      <div className="text-6xl font-bold text-white text-center drop-shadow-[0_0_10px_rgba(0,255,0,0.5)]">
                        CORRECT
                      </div>
                    ) : (
                      <div className="text-6xl font-bold text-white text-center drop-shadow-[0_0_10px_rgba(255,0,0,0.5)]">
                        INCORRECT
                      </div>
                    )}
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

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
            {isAnswerSubmitted && !showFeedback && (
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
                onClick={handleSubmitClick}
                disabled={selectedAnswer === null}
                className="bg-[#0A3C1F] hover:bg-[#0A3C1F]/90"
              >
                Submit Answer
              </Button>
            ) : (
              <Button
                onClick={handleNextQuestion}
                className="bg-[#0A3C1F] hover:bg-[#0A3C1F]/90"
              >
                {currentQuestionIndex === questions.length - 1
                  ? "See Results"
                  : "Next Question"}
              </Button>
            )}

            <Button
              variant="outline"
              onClick={handleRestartGame}
              className="border-[#0A3C1F] text-[#0A3C1F]"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Restart
            </Button>
          </div>

          {/* Question source indicator (for debugging) */}
          {process.env.NODE_ENV !== "production" && (
            <div className="mt-4 text-xs text-gray-400 flex items-center">
              <Info className="h-3 w-3 mr-1" />
              Source: {questionSource}
              {requestId && (
                <span className="ml-1">| ID: {requestId.substring(0, 8)}</span>
              )}
            </div>
          )}
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
            Share this trivia game with friends and earn {pointsForSharing}{" "}
            bonus points!
          </DialogDescription>

          <div className="py-4 flex flex-col items-center">
            <div className="w-24 h-24 rounded-full bg-[#0A3C1F]/10 flex items-center justify-center mb-4">
              <Share2 className="h-12 w-12 text-[#0A3C1F]" />
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
                className="border-[#0A3C1F] text-[#0A3C1F]"
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
            <h3 className="text-xl font-bold text-[#0A3C1F] mb-2">
              {getBadgeName(earnedBadge?.badge_type || "")}
            </h3>
            <p className="text-center text-gray-600">
              {getBadgeDescription(earnedBadge?.badge_type || "")}
            </p>
          </div>
          <DialogFooter>
            <Button onClick={handleShareBadge} className="w-full bg-[#0A3C1F]">
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
              : `Share your ${gameName} score of ${score}/${questions.length} with friends!`}
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
              className="border-[#0A3C1F] text-[#0A3C1F]"
            >
              <Mail className="h-4 w-4 mr-2" />
              Copy Link
            </Button>
          </div>

          <div className="bg-[#0A3C1F]/5 p-3 rounded-lg text-sm">
            <p className="font-medium">Customize your message:</p>
            <textarea
              className="w-full mt-2 p-2 border rounded-md text-sm"
              rows={3}
              defaultValue={
                earnedBadge
                  ? `I just earned the ${getBadgeName(earnedBadge.badge_type)} badge playing the ${gameName}! Test your knowledge too!`
                  : `I scored ${score}/${questions.length} on the ${gameName}! Think you can beat me?`
              }
            ></textarea>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
