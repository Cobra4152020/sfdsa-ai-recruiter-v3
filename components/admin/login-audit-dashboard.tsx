"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { LogIn, LogOut, AlertTriangle, Shield, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LoginEvent {
  id: string;
  userId: string;
  userEmail: string;
  eventType: "login" | "logout" | "failed_attempt" | "password_reset";
  timestamp: string;
  ipAddress: string;
  userAgent: string;
  location?: string;
}

interface LoginAuditDashboardProps {
  events: LoginEvent[];
  onRefresh?: () => void;
}

export function LoginAuditDashboard({
  events,
  onRefresh,
}: LoginAuditDashboardProps) {
  const getEventIcon = (eventType: LoginEvent["eventType"]) => {
    switch (eventType) {
      case "login":
        return <LogIn className="h-4 w-4 text-green-600" />;
      case "logout":
        return <LogOut className="h-4 w-4 text-gray-600" />;
      case "failed_attempt":
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case "password_reset":
        return <Shield className="h-4 w-4 text-blue-600" />;
    }
  };

  const getEventBadge = (eventType: LoginEvent["eventType"]) => {
    switch (eventType) {
      case "login":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700">
            Login Success
          </Badge>
        );
      case "logout":
        return (
          <Badge variant="outline" className="bg-gray-50 text-gray-700">
            Logout
          </Badge>
        );
      case "failed_attempt":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700">
            Failed Attempt
          </Badge>
        );
      case "password_reset":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700">
            Password Reset
          </Badge>
        );
    }
  };

  const failedAttempts = events.filter(
    (event) => event.eventType === "failed_attempt",
  );
  const hasRecentFailedAttempts = failedAttempts.length > 0;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-bold text-[#0A3C1F]">
              Login Activity
            </CardTitle>
            <CardDescription>
              Recent login events and security alerts
            </CardDescription>
          </div>
          {onRefresh && (
            <Button variant="outline" size="icon" onClick={onRefresh}>
              <RefreshCw className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {hasRecentFailedAttempts && (
          <Alert variant="destructive" className="mb-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              {failedAttempts.length} failed login attempt
              {failedAttempts.length > 1 ? "s" : ""} detected. Please review the
              activity below.
            </AlertDescription>
          </Alert>
        )}

        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-4">
            {events.map((event) => (
              <div
                key={event.id}
                className="flex items-start justify-between p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-start gap-4">
                  <div className="mt-1">{getEventIcon(event.eventType)}</div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{event.userEmail}</p>
                      {getEventBadge(event.eventType)}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      IP: {event.ipAddress}
                      {event.location && ` • ${event.location}`}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {event.userAgent}
                    </p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  {event.timestamp}
                </p>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
