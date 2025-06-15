"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { PageWrapper } from "@/components/page-wrapper";
import { AuthRequiredWrapper } from "@/components/auth-required-wrapper";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Clock, Share2, Trophy, Star, RefreshCw } from "lucide-react";
import { useUser } from "@/context/user-context";
import { useToast } from "@/components/ui/use-toast";
import { GameResults } from "@/components/game/game-results";
import { gameScenarios } from "@/lib/game-scenarios";

interface GameState {
  currentQuestion: number;
  score: number;
  answers: number[];
  timeRemaining: number;
  isComplete: boolean;
  startTime: number;
}

export default function CouldYouMakeTheCutPage() {
  const [gameState, setGameState] = useState<GameState>({
    currentQuestion: 0,
    score: 0,
    answers: [],
    timeRemaining: 600, // 10 minutes total
    isComplete: false,
    startTime: Date.now(),
  });
  
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  
  const { currentUser } = useUser();
  const { toast } = useToast();

  // Timer countdown
  useEffect(() => {
    if (!hasStarted || gameState.isComplete) return;
    
    const timer = setInterval(() => {
      setGameState(prev => {
        if (prev.timeRemaining <= 1) {
          clearInterval(timer);
          return { ...prev, timeRemaining: 0, isComplete: true };
        }
        return { ...prev, timeRemaining: prev.timeRemaining - 1 };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [hasStarted, gameState.isComplete]);

  // Auto-complete when time runs out
  useEffect(() => {
    if (gameState.timeRemaining === 0 && !gameState.isComplete && hasStarted) {
      const finalAnswers = [...gameState.answers];
      
      // Fill in remaining answers with -1 (no answer)
      while (finalAnswers.length < gameScenarios.length) {
        finalAnswers.push(-1);
      }
      
      setGameState(prev => ({
        ...prev,
        answers: finalAnswers,
        isComplete: true,
      }));
      
      completeGame();
    }
  }, [gameState.timeRemaining, gameState.isComplete, hasStarted]);

  const startGame = () => {
    setHasStarted(true);
    setGameState({
      currentQuestion: 0,
      score: 0,
      answers: [],
      timeRemaining: 600,
      isComplete: false,
      startTime: Date.now(),
    });
  };

  const selectAnswer = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
  };

  const nextQuestion = () => {
    if (selectedAnswer === null) return;

    const currentScenario = gameScenarios[gameState.currentQuestion];
    const isCorrect = selectedAnswer === currentScenario.correctAnswer;
    const newScore = gameState.score + (isCorrect ? 10 : 0);
    const newAnswers = [...gameState.answers, selectedAnswer];

    if (gameState.currentQuestion === gameScenarios.length - 1) {
      // Game complete
      setGameState(prev => ({
        ...prev,
        score: newScore,
        answers: newAnswers,
        isComplete: true,
      }));
      completeGame();
    } else {
      // Next question
      setGameState(prev => ({
        ...prev,
        currentQuestion: prev.currentQuestion + 1,
        score: newScore,
        answers: newAnswers,
      }));
      setSelectedAnswer(null);
    }
  };

  const completeGame = async () => {
    setShowResults(true);
    
    // Award points to user if logged in
    if (currentUser?.id) {
      const finalScore = gameState.score;
      const percentage = Math.round((finalScore / (gameScenarios.length * 10)) * 100);
      const timeBonus = Math.max(0, Math.floor((600 - (600 - gameState.timeRemaining)) / 60) * 5); // 5 points per minute saved
      const totalPoints = finalScore + timeBonus;
      
      // Award live points
      await awardLivePoints(currentUser.id, totalPoints, percentage);
      
      toast({
        title: "Game Complete!",
        description: `You scored ${percentage}% and earned ${totalPoints} points! ${timeBonus > 0 ? `(+${timeBonus} time bonus)` : ''}`,
        variant: "default",
      });
      
      // Award badges based on performance
      if (percentage >= 90) {
        await awardPerformanceBadge(currentUser.id, 'expert-level');
      } else if (percentage >= 80) {
        await awardPerformanceBadge(currentUser.id, 'hard-charger');
      } else if (percentage >= 70) {
        await awardPerformanceBadge(currentUser.id, 'frequent-user');
      }
    }
  };

  // Award points to live user system
  const awardLivePoints = async (userId: string, points: number, percentage: number) => {
    try {
      const response = await fetch('/api/demo-user-points', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          action: 'deputy_skills_test',
          points,
          gameDetails: {
            score: gameState.score,
            percentage,
            timeUsed: 600 - gameState.timeRemaining,
            totalQuestions: gameScenarios.length,
            date: new Date().toISOString(),
          }
        }),
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Live points awarded:', result);
      }
    } catch (error) {
      console.error('Failed to award live points:', error);
    }
  };

  // Award performance badge for high scores
  const awardPerformanceBadge = async (userId: string, badgeType: string) => {
    try {
      const response = await fetch('/api/badges', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          badgeType,
          source: 'deputy_skills_challenge',
        }),
      });

      if (response.ok) {
        const badgeNames = {
          'expert-level': 'Elite Performer',
          'hard-charger': 'Deputy Material', 
          'frequent-user': 'Academy Ready'
        };
        
        toast({
          title: "🏅 Badge Earned!",
          description: `Outstanding! You've earned the ${badgeNames[badgeType as keyof typeof badgeNames]} badge for your exceptional performance!`,
          duration: 6000,
        });
      }
    } catch (error) {
      console.error('Failed to award performance badge:', error);
    }
  };

  const restartGame = () => {
    setHasStarted(false);
    setShowResults(false);
    setSelectedAnswer(null);
    setGameState({
      currentQuestion: 0,
      score: 0,
      answers: [],
      timeRemaining: 600,
      isComplete: false,
      startTime: Date.now(),
    });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const currentScenario = gameScenarios[gameState.currentQuestion];
  const progress = ((gameState.currentQuestion) / gameScenarios.length) * 100;

  // Safety check for missing scenarios
  if (hasStarted && !currentScenario && !gameState.isComplete) {
    return (
      <PageWrapper>
        <Card className="text-center">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Error Loading Challenge</h2>
            <p className="text-gray-600 mb-4">
              Sorry, there was an issue loading the challenge scenarios. Please try refreshing the page.
            </p>
            <Button onClick={() => window.location.reload()}>
              Refresh Page
            </Button>
          </CardContent>
        </Card>
      </PageWrapper>
    );
  }

  if (showResults) {
    return (
      <GameResults
        score={gameState.score}
        totalQuestions={gameScenarios.length}
        timeUsed={600 - gameState.timeRemaining}
        answers={gameState.answers}
        onRestart={restartGame}
      />
    );
  }

  return (
    <PageWrapper>
      <AuthRequiredWrapper
        requiredFeature="games"
        title="Deputy Skills Challenge"
        description="Test your law enforcement decision-making skills with real scenarios"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
        {!hasStarted ? (
          // Game Introduction
          <div className="container mx-auto px-4 py-8">
            <Card className="text-center">
              <CardHeader>
                <motion.div
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <Trophy className="w-16 h-16 mx-auto text-secondary mb-4" />
                </motion.div>
                <CardTitle className="text-3xl font-bold text-foreground mb-2">
                  Could You Make the Cut?
                </CardTitle>
                <p className="text-lg text-muted-foreground">
                  Test your law enforcement instincts with real deputy scenarios
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-3 gap-4 text-sm">
                  <div className="bg-primary/10 p-4 rounded-lg">
                    <Clock className="w-8 h-8 mx-auto text-primary mb-2" />
                    <div className="font-semibold text-foreground">10 Minutes</div>
                    <div className="text-muted-foreground">Time Limit</div>
                  </div>
                  <div className="bg-primary/10 p-4 rounded-lg">
                    <Star className="w-8 h-8 mx-auto text-primary mb-2" />
                    <div className="font-semibold text-foreground">10 Scenarios</div>
                    <div className="text-muted-foreground">Real Situations</div>
                  </div>
                  <div className="bg-primary/10 p-4 rounded-lg">
                    <Share2 className="w-8 h-8 mx-auto text-primary mb-2" />
                    <div className="font-semibold text-foreground">Share Results</div>
                    <div className="text-muted-foreground">Challenge Friends</div>
                  </div>
                </div>
                
                <div className="bg-secondary/20 border border-secondary/40 rounded-lg p-4">
                  <h3 className="font-semibold text-foreground mb-2">💪 Sgt. Ken Says:</h3>
                  <p className="text-muted-foreground italic">
                    "Think you've got what it takes to protect and serve San Francisco? 
                    Let's see how you handle the real situations our deputies face every day. 
                    Good luck, recruit!"
                  </p>
                </div>

                {/* Points System Explanation */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-left">
                  <h4 className="font-semibold text-blue-900 mb-1">How Points Work:</h4>
                  <ul className="list-disc pl-5 text-blue-900 text-sm">
                    <li><span className="font-semibold">+10 points</span> for each correct answer</li>
                    <li><span className="font-semibold">+5 points</span> for every full minute left when you finish</li>
                    <li>Try to answer quickly and accurately for the highest score!</li>
                  </ul>
                </div>

                <Button
                  onClick={startGame}
                  size="lg"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 text-lg"
                >
                  Start the Challenge
                </Button>
              </CardContent>
            </Card>
          </div>
        ) : (
          // Game Interface
          <div className="container mx-auto px-4 py-8 space-y-6">
            {/* Header with progress and timer */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <Badge variant="outline" className="mb-2">
                      Question {gameState.currentQuestion + 1} of {gameScenarios.length}
                    </Badge>
                    <Progress value={progress} className="w-48" />
                  </div>
                  <div className="text-right">
                    <div className="flex items-center text-lg font-semibold">
                      <Clock className="w-5 h-5 mr-2" />
                      {formatTime(gameState.timeRemaining)}
                    </div>
                    <div className="text-sm text-gray-600">
                      Score: {gameState.score}/100
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Question Card */}
            <motion.div
              key={gameState.currentQuestion}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">
                    {currentScenario.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {/* Scenario Image */}
                  <div className="mb-6">
                    <img 
                      src={currentScenario.image} 
                      alt={currentScenario.title}
                      className="w-full h-64 object-cover rounded-lg shadow-md"
                      loading="lazy"
                    />
                  </div>
                  
                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg mb-6">
                    <p className="text-lg leading-relaxed">
                      {currentScenario.scenario}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {currentScenario.options.map((option: string, index: number) => {
                      // Kahoot-style colors
                      const colorClasses = [
                        'bg-red-500 hover:bg-red-600 border-red-600 text-white shadow-lg shadow-red-500/25', // Red
                        'bg-blue-500 hover:bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-500/25', // Blue  
                        'bg-yellow-500 hover:bg-yellow-600 border-yellow-600 text-white shadow-lg shadow-yellow-500/25', // Yellow
                        'bg-green-500 hover:bg-green-600 border-green-600 text-white shadow-lg shadow-green-500/25' // Green
                      ];
                      
                      const selectedClass = selectedAnswer === index
                        ? 'ring-4 ring-white ring-offset-4 ring-offset-gray-200 scale-105 transform'
                        : 'hover:scale-102 transform';
                      
                      return (
                        <motion.button
                          key={index}
                          whileHover={{ scale: selectedAnswer === index ? 1.05 : 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => selectAnswer(index)}
                          className={`p-6 text-left rounded-xl border-2 transition-all duration-200 ${colorClasses[index]} ${selectedClass}`}
                        >
                          <div className="flex items-start">
                            <span className="font-bold text-2xl mr-4 bg-white/20 w-10 h-10 rounded-full flex items-center justify-center">
                              {String.fromCharCode(65 + index)}
                            </span>
                            <span className="text-lg font-semibold leading-relaxed">{option}</span>
                          </div>
                        </motion.button>
                      );
                    })}
                  </div>

                  <div className="mt-6 flex justify-end">
                    <Button
                      onClick={nextQuestion}
                      disabled={selectedAnswer === null}
                      className="bg-primary hover:bg-primary/90 text-primary-foreground"
                    >
                      {gameState.currentQuestion === gameScenarios.length - 1 ? 'Finish' : 'Next Question'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        )}
      </motion.div>
      </AuthRequiredWrapper>
    </PageWrapper>
  );
} 