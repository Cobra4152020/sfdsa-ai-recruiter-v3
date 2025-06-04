"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Clock, ArrowRight } from "lucide-react";

interface Applicant {
  id: string;
  name: string;
  email: string;
  position: string;
  status: "pending" | "approved" | "rejected";
  appliedDate: string;
  avatarUrl?: string;
}

interface RecentApplicantsWrapperProps {
  applicants: Applicant[];
  onViewAll?: () => void;
}

export function RecentApplicantsWrapper({
  applicants,
  onViewAll,
}: RecentApplicantsWrapperProps) {
  const getStatusBadge = (status: Applicant["status"]) => {
    switch (status) {
      case "approved":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700">
            <CheckCircle className="mr-1 h-3 w-3" /> Approved
          </Badge>
        );
      case "rejected":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700">
            <XCircle className="mr-1 h-3 w-3" /> Rejected
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700">
            <Clock className="mr-1 h-3 w-3" /> Pending
          </Badge>
        );
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-bold text-[#0A3C1F]">
              Recent Applicants
            </CardTitle>
            <CardDescription>Latest deputy sheriff applicants</CardDescription>
          </div>
          {onViewAll && (
            <Button
              variant="outline"
              className="text-[#0A3C1F]"
              onClick={onViewAll}
            >
              View All
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-4">
            {applicants.map((applicant) => (
              <div
                key={applicant.id}
                className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarImage src={applicant.avatarUrl} />
                    <AvatarFallback>
                      {applicant.name.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{applicant.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {applicant.email}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {applicant.position}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  {getStatusBadge(applicant.status)}
                  <p className="text-xs text-muted-foreground">
                    Applied: {applicant.appliedDate}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
