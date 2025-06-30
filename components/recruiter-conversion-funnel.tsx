"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  MousePointer,
  Eye,
  FileText,
  CheckCircle,
  MessageSquare,
  Calendar,
  UserCheck,
} from "lucide-react";

interface FunnelData {
  linkClicks: number;
  pageViews: number;
  formStarts: number;
  formCompletions: number;
  initialContacts: number;
  interviews: number;
  hires: number;
}

interface RecruiterConversionFunnelProps {
  data: FunnelData;
}

export function RecruiterConversionFunnel({
  data,
}: RecruiterConversionFunnelProps) {
  // Calculate conversion rates between steps
  const calculateRate = (current: number, previous: number) => {
    return previous === 0 ? 0 : (current / previous) * 100;
  };

  const rates = {
    pageViewRate: calculateRate(data.pageViews, data.linkClicks),
    formStartRate: calculateRate(data.formStarts, data.pageViews),
    formCompletionRate: calculateRate(data.formCompletions, data.formStarts),
    initialContactRate: calculateRate(
      data.initialContacts,
      data.formCompletions,
    ),
    interviewRate: calculateRate(data.interviews, data.initialContacts),
    hireRate: calculateRate(data.hires, data.interviews),
    overallRate: calculateRate(data.hires, data.linkClicks),
  };

  // Calculate progress percentages relative to the first step
  const calculateProgress = (value: number) => {
    return (value / data.linkClicks) * 100;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Conversion Funnel</CardTitle>
        <CardDescription>
          Track how potential recruits move through the hiring process
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center mr-2">
                  <MousePointer className="h-4 w-4 text-blue-600" />
                </div>
                <span className="font-medium">Link Clicks</span>
              </div>
              <span className="font-bold">{data.linkClicks}</span>
            </div>
            <Progress value={100} className="h-2" />
            <div className="flex justify-end">
              <span className="text-xs text-gray-500">100%</span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center mr-2">
                  <Eye className="h-4 w-4 text-blue-600" />
                </div>
                <span className="font-medium">Page Views</span>
              </div>
              <span className="font-bold">{data.pageViews}</span>
            </div>
            <Progress
              value={calculateProgress(data.pageViews)}
              className="h-2"
            />
            <div className="flex justify-between">
              <span className="text-xs text-gray-500">
                {rates.pageViewRate.toFixed(1)}% of clicks view the page
              </span>
              <span className="text-xs text-gray-500">
                {calculateProgress(data.pageViews).toFixed(1)}%
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center mr-2">
                  <FileText className="h-4 w-4 text-blue-600" />
                </div>
                <span className="font-medium">Form Starts</span>
              </div>
              <span className="font-bold">{data.formStarts}</span>
            </div>
            <Progress
              value={calculateProgress(data.formStarts)}
              className="h-2"
            />
            <div className="flex justify-between">
              <span className="text-xs text-gray-500">
                {rates.formStartRate.toFixed(1)}% of page viewers start the form
              </span>
              <span className="text-xs text-gray-500">
                {calculateProgress(data.formStarts).toFixed(1)}%
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center mr-2">
                  <CheckCircle className="h-4 w-4 text-blue-600" />
                </div>
                <span className="font-medium">Form Completions</span>
              </div>
              <span className="font-bold">{data.formCompletions}</span>
            </div>
            <Progress
              value={calculateProgress(data.formCompletions)}
              className="h-2"
            />
            <div className="flex justify-between">
              <span className="text-xs text-gray-500">
                {rates.formCompletionRate.toFixed(1)}% of form starts are
                completed
              </span>
              <span className="text-xs text-gray-500">
                {calculateProgress(data.formCompletions).toFixed(1)}%
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center mr-2">
                  <MessageSquare className="h-4 w-4 text-blue-600" />
                </div>
                <span className="font-medium">Initial Contacts</span>
              </div>
              <span className="font-bold">{data.initialContacts}</span>
            </div>
            <Progress
              value={calculateProgress(data.initialContacts)}
              className="h-2"
            />
            <div className="flex justify-between">
              <span className="text-xs text-gray-500">
                {rates.initialContactRate.toFixed(1)}% of form completions are
                contacted
              </span>
              <span className="text-xs text-gray-500">
                {calculateProgress(data.initialContacts).toFixed(1)}%
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center mr-2">
                  <Calendar className="h-4 w-4 text-blue-600" />
                </div>
                <span className="font-medium">Interviews</span>
              </div>
              <span className="font-bold">{data.interviews}</span>
            </div>
            <Progress
              value={calculateProgress(data.interviews)}
              className="h-2"
            />
            <div className="flex justify-between">
              <span className="text-xs text-gray-500">
                {rates.interviewRate.toFixed(1)}% of contacts get interviews
              </span>
              <span className="text-xs text-gray-500">
                {calculateProgress(data.interviews).toFixed(1)}%
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center mr-2">
                  <UserCheck className="h-4 w-4 text-green-600" />
                </div>
                <span className="font-medium">Hires</span>
              </div>
              <span className="font-bold">{data.hires}</span>
            </div>
            <Progress
              value={calculateProgress(data.hires)}
              className="h-2 bg-green-100"
              indicatorClassName="bg-green-600"
            />
            <div className="flex justify-between">
              <span className="text-xs text-gray-500">
                {rates.hireRate.toFixed(1)}% of interviews result in hires
              </span>
              <span className="text-xs text-gray-500">
                {calculateProgress(data.hires).toFixed(1)}%
              </span>
            </div>
          </div>

          <div className="mt-6 p-4 bg-primary/10 rounded-lg">
            <h3 className="font-medium text-primary">
              Overall Conversion Rate
            </h3>
            <div className="flex items-center mt-2">
              <div className="text-2xl font-bold text-primary">
                {rates.overallRate.toFixed(1)}%
              </div>
              <div className="ml-2 text-sm text-gray-600">
                of link clicks result in hires
              </div>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              The industry average is around 2-5%. Your conversion rate is{" "}
              {rates.overallRate > 5 ? "above" : "below"} average.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
