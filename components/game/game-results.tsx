"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Trophy, 
  Share2, 
  Clock, 
  Target, 
  Star, 
  Award,
  Download,
  RefreshCw
} from "lucide-react";
import { gameScenarios } from "@/lib/game-scenarios";
import { GameShare } from "@/components/game-share";

interface GameResultsProps {
  score: number;
  totalQuestions: number;
  timeUsed: number;
  answers: number[];
  onRestart: () => void;
}

interface RankInfo {
  name: string;
  color: string;
  icon: string;
  message: string;
  description: string;
}

const getRankInfo = (percentage: number): RankInfo => {
  if (percentage >= 90) {
    return {
      name: "Sheriff Material",
      color: "text-yellow-600",
      icon: "🏆",
      message: "Outstanding work, Deputy! You've got the instincts and judgment of a seasoned law enforcement professional. You'd make an excellent addition to our team!",
      description: "90-100% - Exceptional performance"
    };
  } else if (percentage >= 80) {
    return {
      name: "Deputy Ready",
      color: "text-blue-600",
      icon: "🎖️",
      message: "Impressive! You show strong decision-making skills and a good understanding of police work. With a little more training, you'd be ready to serve and protect!",
      description: "80-89% - Strong performance"
    };
  } else if (percentage >= 70) {
    return {
      name: "Academy Candidate",
      color: "text-green-600",
      icon: "🎯",
      message: "Good work! You've got solid instincts, but there's room for improvement. Keep studying those procedures and you'll be wearing the badge in no time!",
      description: "70-79% - Good performance"
    };
  } else if (percentage >= 60) {
    return {
      name: "Cadet in Training",
      color: "text-orange-600",
      icon: "📚",
      message: "You're on the right track, but you need more training. Police work requires split-second decisions based on solid knowledge. Hit the books and try again!",
      description: "60-69% - Needs improvement"
    };
  } else {
    return {
      name: "Civilian Observer",
      color: "text-red-600",
      icon: "👮‍♂️",
      message: "Don't give up! Law enforcement is challenging and requires extensive training. Consider doing some ride-alongs with local officers to learn more about the job!",
      description: "Below 60% - Requires significant training"
    };
  }
};

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export function GameResults({ score, totalQuestions, timeUsed, answers, onRestart }: GameResultsProps) {
  const [showGameShare, setShowGameShare] = useState(false);
  const [pointsAwarded, setPointsAwarded] = useState(0);
  const percentage = Math.round((score / (totalQuestions * 10)) * 100);
  const rank = getRankInfo(percentage);

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Main Results Card */}
        <Card className="text-center mb-8">
          <CardHeader>
            <motion.div
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mb-4"
            >
              <div className="text-6xl mb-4">{rank.icon}</div>
              <Badge 
                variant="outline" 
                className={`text-lg px-4 py-2 ${rank.color} border-current`}
              >
                {rank.name}
              </Badge>
            </motion.div>
            <CardTitle className="text-3xl font-bold text-[#0A3C1F] mb-2">
              Challenge Complete!
            </CardTitle>
            <div className="text-4xl font-bold text-[#0A3C1F] mb-2">
              {percentage}%
            </div>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              {score} out of {totalQuestions * 10} points
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Progress Bar */}
            <div className="space-y-2">
              <Progress value={percentage} className="h-4" />
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {rank.description}
              </p>
            </div>

            {/* Sgt. Ken's Feedback */}
            <div className="bg-[#0A3C1F]/5 border border-[#0A3C1F]/20 rounded-lg p-6">
              <h3 className="font-semibold text-[#0A3C1F] mb-3 text-lg">
                💬 Sgt. Ken Says:
              </h3>
              <p className="text-gray-700 dark:text-gray-300 italic text-left">
                "{rank.message}"
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <Target className="w-8 h-8 mx-auto text-blue-600 mb-2" />
                <div className="font-semibold text-2xl">{score}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Points Earned</div>
              </div>
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                <Clock className="w-8 h-8 mx-auto text-green-600 mb-2" />
                <div className="font-semibold text-2xl">{formatTime(timeUsed)}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Time Used</div>
              </div>
              <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
                <Star className="w-8 h-8 mx-auto text-yellow-600 mb-2" />
                <div className="font-semibold text-2xl">{Math.round(score / totalQuestions * 10)}/10</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Correct Answers</div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              {/* Primary Actions */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  onClick={() => setShowGameShare(true)}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <Share2 className="w-4 h-4" />
                  Share Results
                </Button>
                <Button
                  onClick={onRestart}
                  className="bg-[#0A3C1F] hover:bg-[#0A3C1F]/90 flex items-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  Try Again
                </Button>
              </div>
              {/* New GameShare Dialog */}
              {showGameShare && (
                <GameShare
                  score={score}
                  gameName={"Could You Make the Cut"}
                  gameDescription={rank.message}
                  onPointsAdded={(points) => setPointsAwarded(points)}
                />
              )}
            </div>

            {/* Encourage Action */}
            <div className="bg-gradient-to-r from-[#0A3C1F]/10 to-[#0A3C1F]/5 rounded-lg p-6 mt-8">
              <h3 className="font-semibold text-[#0A3C1F] mb-3">
                Ready for the Real Challenge?
              </h3>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Think you've got what it takes to serve and protect San Francisco? 
                Learn more about joining the San Francisco Sheriff's Department.
              </p>
              <Button 
                variant="outline"
                className="border-[#0A3C1F] text-[#0A3C1F] hover:bg-[#0A3C1F] hover:text-white"
                onClick={() => window.open('https://sfdeputysheriff.com', '_blank')}
              >
                Learn About Careers
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Question Review */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="w-5 h-5" />
              Question Review
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {gameScenarios.map((scenario, index) => {
              const userAnswer = answers[index];
              const isCorrect = userAnswer === scenario.correctAnswer;
              
              // Kahoot-style colors for answers
              const answerColors = [
                'bg-red-100 border-red-300 text-red-800', // Red
                'bg-blue-100 border-blue-300 text-blue-800', // Blue
                'bg-yellow-100 border-yellow-300 text-yellow-800', // Yellow
                'bg-green-100 border-green-300 text-green-800' // Green
              ];
              
              return (
                <div 
                  key={scenario.id}
                  className={`p-4 rounded-lg border-2 ${
                    isCorrect 
                      ? 'border-green-200 bg-green-50 dark:bg-green-900/20' 
                      : 'border-red-200 bg-red-50 dark:bg-red-900/20'
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h4 className="font-semibold text-lg mb-2">
                        {index + 1}. {scenario.title}
                      </h4>
                      
                      {/* Scenario Image */}
                      <div className="mb-3">
                        <img 
                          src={scenario.image} 
                          alt={scenario.title}
                          className="w-full max-w-md h-32 object-cover rounded-lg shadow-sm"
                          loading="lazy"
                        />
                      </div>
                      
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                        {scenario.scenario}
                      </p>
                    </div>
                    
                    <Badge 
                      variant={isCorrect ? "default" : "destructive"}
                      className="ml-4 shrink-0"
                    >
                      {isCorrect ? "✓ Correct" : "✗ Incorrect"}
                    </Badge>
                  </div>
                  
                  {/* Show all answers with colors */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-3">
                    {scenario.options.map((option, optionIndex) => {
                      const isUserAnswer = userAnswer === optionIndex;
                      const isCorrectAnswer = scenario.correctAnswer === optionIndex;
                      
                      let className = `p-3 rounded-lg border text-sm ${answerColors[optionIndex]}`;
                      
                      if (isCorrectAnswer) {
                        className += ' ring-2 ring-green-500 ring-offset-2';
                      } else if (isUserAnswer && !isCorrect) {
                        className += ' ring-2 ring-red-500 ring-offset-2';
                      }
                      
                      return (
                        <div key={optionIndex} className={className}>
                          <div className="flex items-start">
                            <span className="font-bold mr-2 bg-white/50 w-6 h-6 rounded-full flex items-center justify-center text-xs">
                              {String.fromCharCode(65 + optionIndex)}
                            </span>
                            <span className="flex-1">{option}</span>
                            {isCorrectAnswer && <span className="ml-2">✓</span>}
                            {isUserAnswer && !isCorrect && <span className="ml-2">✗</span>}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  
                  {!isCorrect && (
                    <div className="mt-3 p-3 bg-white dark:bg-gray-800 rounded border">
                      <p className="text-sm">
                        <strong>Explanation:</strong> {scenario.explanation}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
} 