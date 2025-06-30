"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  UserPlus,
  CheckCircle,
  Calendar,
  MousePointer,
  FileText,
} from "lucide-react";

interface Activity {
  id: string;
  type: string;
  name?: string;
  count?: number;
  action: string;
  date: string;
}

interface RecruiterActivityTimelineProps {
  activities: Activity[];
}

export function RecruiterActivityTimeline({
  activities,
}: RecruiterActivityTimelineProps) {
  // Function to get the icon based on activity type
  const getActivityIcon = (type: string) => {
    switch (type) {
      case "referral":
        return <UserPlus className="h-5 w-5 text-blue-600" />;
      case "hire":
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case "interview":
        return <Calendar className="h-5 w-5 text-purple-600" />;
      case "click":
        return <MousePointer className="h-5 w-5 text-gray-600" />;
      case "application":
        return <FileText className="h-5 w-5 text-amber-600" />;
      default:
        return <UserPlus className="h-5 w-5 text-blue-600" />;
    }
  };

  // Function to get the badge based on activity type
  const getActivityBadge = (type: string) => {
    switch (type) {
      case "referral":
        return (
          <Badge
            variant="outline"
            className="bg-blue-50 text-blue-800 border-blue-300"
          >
            Referral
          </Badge>
        );
      case "hire":
        return (
          <Badge
            variant="outline"
            className="bg-green-50 text-green-800 border-green-300"
          >
            Hire
          </Badge>
        );
      case "interview":
        return (
          <Badge
            variant="outline"
            className="bg-purple-50 text-purple-800 border-purple-300"
          >
            Interview
          </Badge>
        );
      case "click":
        return (
          <Badge
            variant="outline"
            className="bg-muted text-gray-800 border-gray-300"
          >
            Click
          </Badge>
        );
      case "application":
        return (
          <Badge
            variant="outline"
            className="bg-amber-50 text-amber-800 border-amber-300"
          >
            Application
          </Badge>
        );
      default:
        return (
          <Badge
            variant="outline"
            className="bg-blue-50 text-blue-800 border-blue-300"
          >
            Activity
          </Badge>
        );
    }
  };

  // Function to format the date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return "Today";
    } else if (diffDays === 1) {
      return "Yesterday";
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>
          Track your recent recruitment activities
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {activities.map((activity) => (
            <div key={activity.id} className="flex">
              <div className="flex flex-col items-center mr-4">
                <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                  {getActivityIcon(activity.type)}
                </div>
                {activities.indexOf(activity) !== activities.length - 1 && (
                  <div className="h-full w-0.5 bg-gray-200"></div>
                )}
              </div>
              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                  <div>
                    <div className="flex items-center">
                      {getActivityBadge(activity.type)}
                      <span className="ml-2 font-medium">
                        {activity.name
                          ? `${activity.name} ${activity.action}`
                          : activity.count
                            ? `${activity.count} ${activity.action}`
                            : activity.action}
                      </span>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500 mt-1 sm:mt-0">
                    {formatDate(activity.date)}
                  </div>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  {activity.type === "referral" &&
                    "A new candidate has signed up through your referral link."}
                  {activity.type === "hire" &&
                    "One of your referrals has been successfully hired."}
                  {activity.type === "interview" &&
                    "A candidate you referred has scheduled an interview."}
                  {activity.type === "click" &&
                    "Your referral links received clicks from potential candidates."}
                  {activity.type === "application" &&
                    "A candidate you referred has submitted their application."}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
