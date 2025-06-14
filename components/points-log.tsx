"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Calendar, 
  TrendingUp, 
  Trophy, 
  User, 
  Mail, 
  FileText,
  RefreshCw
} from "lucide-react";

interface PointsLogEntry {
  id: string;
  action: string;
  points: number;
  description?: string;
  created_at: string;
}

interface PointsLogProps {
  userId: string;
}

export function PointsLog({ userId }: PointsLogProps) {
  const [pointsLog, setPointsLog] = useState<PointsLogEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPointsLog = async () => {
    if (!userId) return;
    
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/user/points-log?userId=${userId}`);
      if (response.ok) {
        const data = await response.json();
        setPointsLog(data.log || []);
      } else {
        setError("Failed to load points history");
      }
    } catch (err) {
      console.error("Error fetching points log:", err);
      setError("Error loading points history");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPointsLog();
  }, [userId]);

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'profile_completion':
        return <User className="h-4 w-4" />;
      case 'email_verification':
        return <Mail className="h-4 w-4" />;
      case 'application_submission':
        return <FileText className="h-4 w-4" />;
      case 'achievement':
        return <Trophy className="h-4 w-4" />;
      case 'daily_briefing_attendance':
        return <Calendar className="h-4 w-4" />;
      case 'sgt_ken_game_win':
        return <Trophy className="h-4 w-4" />;
      case 'chat_participation':
        return <TrendingUp className="h-4 w-4" />;
      default:
        return <TrendingUp className="h-4 w-4" />;
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'profile_completion':
        return 'bg-blue-500';
      case 'email_verification':
        return 'bg-green-500';
      case 'application_submission':
        return 'bg-purple-500';
      case 'achievement':
        return 'bg-yellow-500';
      case 'daily_briefing_attendance':
        return 'bg-indigo-500';
      case 'sgt_ken_game_win':
        return 'bg-orange-500';
      case 'chat_participation':
        return 'bg-teal-500';
      default:
        return 'bg-gray-500';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' at ' + date.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const formatAction = (action: string) => {
    switch (action) {
      case 'daily_briefing_attendance':
        return 'Daily Briefing';
      case 'sgt_ken_game_win':
        return 'Sgt Ken Says';
      case 'chat_participation':
        return 'Chat Participation';
      default:
        return action
          .split('_')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
    }
  };

  const getActionDescription = (entry: PointsLogEntry) => {
    if (entry.description) {
      return entry.description;
    }
    
    switch (entry.action) {
      case 'daily_briefing_attendance':
        return 'Attended daily briefing session';
      case 'sgt_ken_game_win':
        return `Won Sgt Ken Says game (+${entry.points} points)`;
      case 'chat_participation':
        return 'Participated in community chat';
      default:
        return `Earned ${entry.points} points for ${entry.action.replace(/_/g, ' ')}`;
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="h-5 w-5 mr-2" />
            Points History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center space-x-3">
                <Skeleton className="h-8 w-8 rounded-full" />
                <div className="flex-1">
                  <Skeleton className="h-4 w-32 mb-2" />
                  <Skeleton className="h-3 w-24" />
                </div>
                <Skeleton className="h-6 w-12" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center">
            <Calendar className="h-5 w-5 mr-2" />
            Points History
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={fetchPointsLog}
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="text-center py-4">
            <p className="text-red-500 mb-2">{error}</p>
            <Button variant="outline" size="sm" onClick={fetchPointsLog}>
              Try Again
            </Button>
          </div>
        )}

        {!error && pointsLog.length === 0 && (
          <div className="text-center py-8">
            <TrendingUp className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
              No Points Yet
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              Complete your profile and participate in activities to start earning points!
            </p>
          </div>
        )}

        {!error && pointsLog.length > 0 && (
          <ScrollArea className="h-64">
            <div className="space-y-4">
              {pointsLog.map((entry, index) => (
                <div
                  key={entry.id || index}
                  className="flex items-start space-x-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50"
                >
                  <div
                    className={`p-2 rounded-full text-white ${getActionColor(entry.action)}`}
                  >
                    {getActionIcon(entry.action)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {formatAction(entry.action)}
                      </h4>
                      <Badge 
                        variant="secondary"
                        className="text-xs font-bold text-green-700 bg-green-100 dark:text-green-300 dark:bg-green-900/30"
                      >
                        +{entry.points}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">
                      {getActionDescription(entry)}
                    </p>
                    <p className="text-xs text-gray-400">
                      {formatDate(entry.created_at)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}

        {!error && pointsLog.length > 0 && (
          <div className="mt-4 pt-4 border-t text-center">
            <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
              <Trophy className="h-4 w-4" />
              <span>
                Total: {pointsLog.reduce((sum, entry) => sum + entry.points, 0)} points
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 