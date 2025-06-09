"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/use-toast";
import { useUser } from "@/context/user-context";
import {
  Trophy,
  Share2,
  Clock,
  Target,
  Star,
  Facebook,
  Twitter,
  Linkedin,
  Copy,
  Zap,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

// Confetti type declaration
declare global {
  interface Window {
    confetti?: (options: {
      particleCount: number;
      spread: number;
      origin: { x: number; y: number };
    }) => void;
  }
}

// Law enforcement themed 5-letter words
const LAW_ENFORCEMENT_WORDS = [
  "BADGE", "CHIEF", "COURT", "CRIME", "GUARD", "JUDGE", "ALERT", "ARMOR", 
  "BATON", "BENCH", "BIKES", "CARES", "CATCH", "CHASE", "CHECK", "CIVIC",
  "CODES", "CRASH", "DRONE", "DUTY", "FIELD", "FORCE", "HONOR", "KNIFE",
  "LEADS", "LEGAL", "MEDAL", "NIGHT", "ORDER", "PATCH", "PEACE", "PILOT",
  "RADAR", "RADIO", "RANKS", "RAPID", "RULES", "SAFER", "SIREN", "SQUAD",
  "STERN", "STUDY", "SWIFT", "TASKS", "TEAMS", "TORCH", "TRACK", "TRAIN",
  "TRUST", "TRUTH", "UNION", "VITAL", "WATCH", "YOUTH"
].filter(word => word.length === 5);

// Sgt. Ken's motivational phrases
const SGT_KEN_PHRASES = {
  start: [
    "Your word for today is classified. Solve it, rookie.",
    "Time to prove your detective skills, cadet.",
    "Another day, another puzzle to crack.",
    "Let's see if you've got what it takes, recruit."
  ],
  success: [
    "You cracked it. Barely. See you on patrol tomorrow.",
    "Not bad for a rookie. You've earned that donut.",
    "Outstanding work, cadet! You're ready for the streets.",
    "Impressive deduction skills. The squad could use you.",
    "You've got the instincts of a true detective.",
    "Share your win, cadet. Show them what SFDSA trains."
  ],
  failure: [
    "That's a fail, cadet. Try again tomorrow.",
    "Back to the academy for more training.",
    "Better luck next patrol, rookie.",
    "Don't worry, even the best cops have off days.",
    "Tomorrow's another chance to prove yourself."
  ],
  ranks: {
    1: "🏆 Detective Elite",
    2: "🥇 Patrol Pro", 
    3: "🥈 Squad Leader",
    4: "🥉 Field Officer",
    5: "👮 Beat Cop",
    6: "🚨 Rookie"
  }
};

interface GameState {
  currentWord: string;
  guesses: string[];
  currentGuess: string;
  gameStatus: 'playing' | 'won' | 'lost';
  attempts: number;
  maxAttempts: number;
  points: number;
  streak: number;
  lastPlayedDate: string;
  totalGamesPlayed: number;
  totalWins: number;
}

interface LetterState {
  letter: string;
  status: 'correct' | 'present' | 'absent' | 'empty';
}

export function SgtKenSaysGame() {
  const { currentUser } = useUser();
  const { toast } = useToast();
  
  const [gameState, setGameState] = useState<GameState>({
    currentWord: '',
    guesses: [],
    currentGuess: '',
    gameStatus: 'playing',
    attempts: 0,
    maxAttempts: 6,
    points: 0,
    streak: 0,
    lastPlayedDate: '',
    totalGamesPlayed: 0,
    totalWins: 0,
  });
  
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [dailyWord, setDailyWord] = useState('');
  const [todayDate, setTodayDate] = useState('');
  const [timeUntilNext, setTimeUntilNext] = useState('');

  // Get today's date string
  const getTodayDateString = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  // Get daily word based on date (deterministic)
  const getDailyWord = useCallback((dateString: string) => {
    const date = new Date(dateString);
    const dayOfYear = Math.floor((date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / 86400000);
    return LAW_ENFORCEMENT_WORDS[dayOfYear % LAW_ENFORCEMENT_WORDS.length];
  }, []);

  // Calculate time until next puzzle
  const calculateTimeUntilNext = useCallback(() => {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    
    const diff = tomorrow.getTime() - now.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  }, []);

  // Initialize game
  useEffect(() => {
    const today = getTodayDateString();
    const word = getDailyWord(today);
    setDailyWord(word);
    setTodayDate(today);

    // Load saved game state
    const savedGame = localStorage.getItem('sgt-ken-says-game');
    if (savedGame) {
      try {
        const parsed = JSON.parse(savedGame);
        if (parsed.lastPlayedDate === today) {
          setGameState(parsed);
          return;
        }
      } catch (error) {
        console.error('Error parsing saved game:', error);
        localStorage.removeItem('sgt-ken-says-game');
      }
    }

    // Start new game
    setGameState(prev => ({
      ...prev,
      currentWord: word,
      lastPlayedDate: today,
    }));

    // Update timer
    const updateTimer = () => setTimeUntilNext(calculateTimeUntilNext());
    updateTimer();
    const timer = setInterval(updateTimer, 60000);
    return () => clearInterval(timer);
  }, [getDailyWord, calculateTimeUntilNext]);

  // Save game state
  useEffect(() => {
    if (gameState.currentWord) {
      try {
        localStorage.setItem('sgt-ken-says-game', JSON.stringify(gameState));
      } catch (error) {
        console.error('Error saving game state:', error);
      }
    }
  }, [gameState]);

  // Check if guess is valid
  const isValidGuess = (guess: string) => {
    return guess.length === 5 && /^[A-Z]+$/.test(guess);
  };

  // Get letter states for a guess
  const getLetterStates = (guess: string, targetWord: string): LetterState[] => {
    const result: LetterState[] = [];
    const targetLetters = targetWord.split('');
    const guessLetters = guess.split('');
    
    // First pass: mark correct letters
    const remainingTarget = [...targetLetters];
    const remainingGuess = [...guessLetters];
    
    for (let i = 0; i < 5; i++) {
      if (guessLetters[i] === targetLetters[i]) {
        result[i] = { letter: guessLetters[i], status: 'correct' };
        remainingTarget[i] = '';
        remainingGuess[i] = '';
      }
    }
    
    // Second pass: mark present letters
    for (let i = 0; i < 5; i++) {
      if (remainingGuess[i] && remainingTarget.includes(remainingGuess[i])) {
        result[i] = { letter: guessLetters[i], status: 'present' };
        const targetIndex = remainingTarget.indexOf(remainingGuess[i]);
        remainingTarget[targetIndex] = '';
      } else if (!result[i]) {
        result[i] = { letter: guessLetters[i], status: 'absent' };
      }
    }
    
    return result;
  };

  // Calculate points based on attempts
  const calculatePoints = (attempts: number) => {
    const basePoints = 100;
    const bonusMultiplier = Math.max(0, 7 - attempts);
    return basePoints + (bonusMultiplier * 20);
  };

  // Submit guess
  const submitGuess = () => {
    if (!isValidGuess(gameState.currentGuess)) {
      toast({
        title: "Invalid guess",
        description: "Please enter a 5-letter word using only letters.",
        variant: "destructive",
      });
      return;
    }

    const newGuesses = [...gameState.guesses, gameState.currentGuess];
    const newAttempts = gameState.attempts + 1;
    const isCorrect = gameState.currentGuess === dailyWord;
    const maxAttemptsReached = newAttempts >= gameState.maxAttempts;
    
    let newGameStatus: 'playing' | 'won' | 'lost' = 'playing';
    let points = 0;
    let newStreak = gameState.streak;
    let newTotalWins = gameState.totalWins;
    
    if (isCorrect) {
      newGameStatus = 'won';
      points = calculatePoints(newAttempts);
      newStreak = gameState.streak + 1;
      newTotalWins = gameState.totalWins + 1;
      
      // Show confetti
      setTimeout(() => {
        if (typeof window !== 'undefined' && window.confetti) {
          window.confetti({
            particleCount: 100,
            spread: 70,
            origin: { x: 0.5, y: 0.6 }
          });
        }
      }, 100);
      
      // Award live points
      if (currentUser) {
        awardLivePoints(currentUser.id, points, newAttempts);
      }
      
      toast({
        title: "Excellent work, cadet!",
        description: `You solved it in ${newAttempts} attempts! +${points} points`,
      });
    } else if (maxAttemptsReached) {
      newGameStatus = 'lost';
      newStreak = 0; // Reset streak on failure
      
      toast({
        title: "Mission failed, cadet",
        description: `The word was ${dailyWord}. Try again tomorrow!`,
        variant: "destructive",
      });
    }

    setGameState(prev => ({
      ...prev,
      guesses: newGuesses,
      currentGuess: '',
      attempts: newAttempts,
      gameStatus: newGameStatus,
      points,
      streak: newStreak,
      totalGamesPlayed: newGameStatus !== 'playing' ? prev.totalGamesPlayed + 1 : prev.totalGamesPlayed,
      totalWins: newTotalWins,
    }));
  };

  // Award points to live user system
  const awardLivePoints = async (userId: string, points: number, attempts: number) => {
    try {
      const response = await fetch('/api/demo-user-points', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          action: 'sgt_ken_game_win',
          points,
          gameDetails: {
            attempts,
            maxAttempts: gameState.maxAttempts,
            date: todayDate,
          }
        }),
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Live points awarded:', result);
        
        // Check if user should get a badge for consecutive wins
        if (gameState.streak + 1 >= 3) {
          awardStreakBadge(userId, gameState.streak + 1);
        }
      }
    } catch (error) {
      console.error('Failed to award live points:', error);
    }
  };

  // Award streak badge
  const awardStreakBadge = async (userId: string, streak: number) => {
    try {
      const response = await fetch('/api/demo-user-points', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          action: 'badge_earned',
          points: 50,
          badge: `${streak}_day_sgt_ken_streak`
        }),
      });

      if (response.ok) {
        toast({
          title: "Streak Badge Earned!",
          description: `${streak} day winning streak! +50 bonus points`,
        });
      }
    } catch (error) {
      console.error('Failed to award streak badge:', error);
    }
  };

  // Handle input change
  const handleInputChange = (value: string) => {
    setGameState(prev => ({
      ...prev,
      currentGuess: value.toUpperCase().slice(0, 5)
    }));
  };

  // Generate share text
  const generateShareText = () => {
    const attempts = gameState.gameStatus === 'won' ? gameState.attempts : 'X';
    const squares = gameState.guesses.map(guess => {
      return getLetterStates(guess, dailyWord).map(state => {
        switch (state.status) {
          case 'correct': return '🟩';
          case 'present': return '🟨';
          case 'absent': return '⬜';
          default: return '⬜';
        }
      }).join('');
    }).join('\n');

    return `Sgt. Ken Says ${todayDate}\n${attempts}/6\n\n${squares}\n\nJoin the SFSO recruitment challenge!\nhttps://sfdeputysheriff.com/sgt-ken-says`;
  };

  // Share functions
  const shareToTwitter = () => {
    const text = encodeURIComponent(generateShareText());
    window.open(`https://twitter.com/intent/tweet?text=${text}`, '_blank');
  };

  const shareToLinkedIn = () => {
    const text = encodeURIComponent(generateShareText());
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent('https://sfdeputysheriff.com/sgt-ken-says')}&summary=${text}`, '_blank');
  };

  const shareToFacebook = () => {
    const url = encodeURIComponent('https://sfdeputysheriff.com/sgt-ken-says');
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generateShareText());
    toast({
      title: "Copied to clipboard!",
      description: "Share your results with the squad.",
    });
  };

  // Get current phrase
  const getCurrentPhrase = () => {
    if (gameState.gameStatus === 'playing') {
      return SGT_KEN_PHRASES.start[Math.floor(Math.random() * SGT_KEN_PHRASES.start.length)];
    } else if (gameState.gameStatus === 'won') {
      return SGT_KEN_PHRASES.success[Math.floor(Math.random() * SGT_KEN_PHRASES.success.length)];
    } else {
      return SGT_KEN_PHRASES.failure[Math.floor(Math.random() * SGT_KEN_PHRASES.failure.length)];
    }
  };

  // Get rank based on attempts
  const getRank = () => {
    const attempts = gameState.gameStatus === 'won' ? gameState.attempts : 6;
    return SGT_KEN_PHRASES.ranks[attempts as keyof typeof SGT_KEN_PHRASES.ranks] || "🚨 Rookie";
  };

  return (
    <div className="space-y-6">
      {/* Sgt. Ken's Message */}
      <Card className="bg-gradient-to-r from-[#0A3C1F]/10 to-transparent border-[#0A3C1F]/20">
        <CardContent className="p-6">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-[#0A3C1F] rounded-full flex items-center justify-center mr-4">
              <span className="text-white font-bold text-lg">SK</span>
            </div>
            <div>
              <h3 className="font-bold text-[#0A3C1F]">Sgt. Ken says:</h3>
              <p className="text-gray-700 italic">"{getCurrentPhrase()}"</p>
            </div>
          </div>
          
          {gameState.gameStatus !== 'playing' && (
            <div className="mt-4">
              <Badge variant="outline" className="mr-2">
                Your Rank: {getRank()}
              </Badge>
              {gameState.gameStatus === 'won' && (
                <Badge className="bg-[#0A3C1F] text-white">
                  +{gameState.points} Points
                </Badge>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Game Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <Trophy className="h-6 w-6 text-primary mx-auto mb-2" />
            <div className="text-2xl font-bold text-foreground">{gameState.totalWins}</div>
            <div className="text-sm text-muted-foreground">Total Wins</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <Target className="h-6 w-6 text-primary mx-auto mb-2" />
            <div className="text-2xl font-bold text-foreground">{gameState.totalGamesPlayed}</div>
            <div className="text-sm text-muted-foreground">Games Played</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <Zap className="h-6 w-6 text-primary mx-auto mb-2" />
            <div className="text-2xl font-bold text-foreground">{gameState.streak}</div>
            <div className="text-sm text-muted-foreground">Current Streak</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <Clock className="h-6 w-6 text-primary mx-auto mb-2" />
            <div className="text-2xl font-bold text-foreground">{timeUntilNext}</div>
            <div className="text-sm text-muted-foreground">Next Game</div>
          </CardContent>
        </Card>
      </div>

      {/* Game Board */}
      <Card>
        <CardHeader>
          <CardTitle className="text-center">
            Daily Challenge - {todayDate}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Previous Guesses */}
          <div className="space-y-2">
            {Array.from({ length: gameState.maxAttempts }).map((_, rowIndex) => (
              <div key={rowIndex} className="flex gap-2 justify-center">
                {Array.from({ length: 5 }).map((_, colIndex) => {
                  const guess = gameState.guesses[rowIndex];
                  let letter = '';
                  let status: 'correct' | 'present' | 'absent' | 'empty' = 'empty';
                  
                  if (guess) {
                    const letterStates = getLetterStates(guess, dailyWord);
                    letter = letterStates[colIndex]?.letter || '';
                    status = letterStates[colIndex]?.status || 'empty';
                  }
                  
                  return (
                    <div
                      key={colIndex}
                      className={`w-12 h-12 border-2 rounded flex items-center justify-center font-bold text-lg
                        ${status === 'correct' ? 'bg-green-500 text-white border-green-500' :
                          status === 'present' ? 'bg-yellow-500 text-white border-yellow-500' :
                          status === 'absent' ? 'bg-gray-400 text-white border-gray-400' :
                          'border-gray-300'}`}
                    >
                      {letter}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>

          {/* Current Input */}
          {gameState.gameStatus === 'playing' && (
            <div className="space-y-4">
              <div className="flex gap-2 max-w-md mx-auto">
                <Input
                  value={gameState.currentGuess}
                  onChange={(e) => handleInputChange(e.target.value)}
                  placeholder="Enter 5-letter word..."
                  maxLength={5}
                  className="text-center text-lg font-bold uppercase"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      submitGuess();
                    }
                  }}
                />
                <Button onClick={submitGuess} className="bg-[#0A3C1F] hover:bg-[#0A3C1F]/90">
                  Submit
                </Button>
              </div>
              
              <div className="text-center text-sm text-gray-600">
                Attempt {gameState.attempts + 1} of {gameState.maxAttempts}
              </div>
              
              <Progress 
                value={(gameState.attempts / gameState.maxAttempts) * 100} 
                className="max-w-md mx-auto"
              />
            </div>
          )}

          {/* Game Complete Actions */}
          {gameState.gameStatus !== 'playing' && (
            <div className="space-y-4 text-center">
              <div className="text-lg font-semibold">
                {gameState.gameStatus === 'won' 
                  ? `Solved in ${gameState.attempts} tries!` 
                  : `The word was: ${dailyWord}`}
              </div>
              
              <div className="flex gap-2 justify-center">
                <Button
                  onClick={() => setShowShareDialog(true)}
                  className="bg-[#0A3C1F] hover:bg-[#0A3C1F]/90"
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  Share Results
                </Button>
                
                <Button
                  variant="outline"
                  onClick={() => setShowStats(true)}
                >
                  <Trophy className="h-4 w-4 mr-2" />
                  View Stats
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Share Dialog */}
      <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Share Your Results</DialogTitle>
            <DialogDescription>
              Show the squad how you performed! Earn bonus points for sharing.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Button onClick={shareToTwitter} className="bg-[#1DA1F2] hover:bg-[#1DA1F2]/90">
                <Twitter className="h-4 w-4 mr-2" />
                Twitter
              </Button>
              
              <Button onClick={shareToLinkedIn} className="bg-[#0A66C2] hover:bg-[#0A66C2]/90">
                <Linkedin className="h-4 w-4 mr-2" />
                LinkedIn
              </Button>
              
              <Button onClick={shareToFacebook} className="bg-[#1877F2] hover:bg-[#1877F2]/90">
                <Facebook className="h-4 w-4 mr-2" />
                Facebook
              </Button>
              
              <Button onClick={copyToClipboard} variant="outline">
                <Copy className="h-4 w-4 mr-2" />
                Copy
              </Button>
            </div>
            
            <div className="p-3 bg-gray-50 rounded text-sm">
              <strong>Preview:</strong>
              <div className="mt-2 whitespace-pre-line text-xs">
                {generateShareText().substring(0, 200)}...
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* How to Play */}
      <Card>
        <CardHeader>
          <CardTitle>How to Play</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div>🎯 <strong>Objective:</strong> Guess the 5-letter law enforcement word in 6 tries</div>
          <div>🟩 <strong>Green:</strong> Letter is correct and in the right position</div>
          <div>🟨 <strong>Yellow:</strong> Letter is in the word but wrong position</div>
          <div>⬜ <strong>Gray:</strong> Letter is not in the word</div>
          <div>🏆 <strong>Points:</strong> Earn more points for solving in fewer tries</div>
          <div>📱 <strong>Share:</strong> Get bonus points for sharing your results</div>
          <div>⏰ <strong>Daily:</strong> New puzzle every day at midnight</div>
        </CardContent>
      </Card>
    </div>
  );
}

export default SgtKenSaysGame; 