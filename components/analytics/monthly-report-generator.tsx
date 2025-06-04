"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import {
  generateMonthlyReport,
  getAvailableMonths,
} from "@/lib/analytics-service";
import { FileText, Download, Loader2 } from "lucide-react";
import type { MonthlyReport } from "@/lib/analytics-service";

export function MonthlyReportGenerator() {
  const { toast } = useToast();
  const [selectedMonth, setSelectedMonth] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [reportData, setReportData] = useState<MonthlyReport | null>(null);

  const availableMonths = getAvailableMonths();

  const handleGenerateReport = async () => {
    if (!selectedMonth) {
      toast({
        title: "Error",
        description: "Please select a month to generate a report",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    try {
      const data = await generateMonthlyReport(new Date(selectedMonth));
      setReportData(data);
      toast({
        title: "Report Generated",
        description: "Monthly report has been generated successfully",
      });
    } catch (error) {
      console.error("Error generating report:", error);
      toast({
        title: "Error",
        description: "Failed to generate report. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownloadReport = () => {
    if (!reportData) {
      toast({
        title: "Error",
        description: "No report data available to download",
        variant: "destructive",
      });
      return;
    }

    // Format the report data as a pretty-printed JSON string
    const jsonString = JSON.stringify(reportData, null, 2);

    // Create a blob and download it
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `monthly-report-${selectedMonth.split("T")[0]}.json`,
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Download Started",
      description: "Your report is being downloaded",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4">
        <Select value={selectedMonth} onValueChange={setSelectedMonth}>
          <SelectTrigger className="w-full md:w-[300px]">
            <SelectValue placeholder="Select Month" />
          </SelectTrigger>
          <SelectContent>
            {availableMonths.map((month) => (
              <SelectItem key={month.value} value={month.value}>
                {month.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button
          onClick={handleGenerateReport}
          disabled={isGenerating || !selectedMonth}
        >
          {isGenerating ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <FileText className="h-4 w-4 mr-2" />
              Generate Report
            </>
          )}
        </Button>

        {reportData && (
          <Button onClick={handleDownloadReport} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Download Report
          </Button>
        )}
      </div>

      {reportData && (
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-medium mb-4">Report Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-500">Users</h4>
                <p className="text-2xl font-bold">
                  {reportData.totalUsers} total users
                </p>
                <div className="text-sm text-gray-500">
                  <div>{reportData.activeUsers} active users</div>
                  <div>{reportData.newUsers} new users</div>
                </div>
              </div>
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-500">
                  Engagement
                </h4>
                <p className="text-2xl font-bold">
                  {reportData.engagementMetrics.totalActions} total actions
                </p>
                <div className="text-sm text-gray-500">
                  <div>
                    {reportData.engagementMetrics.averageActionsPerUser.toFixed(
                      1,
                    )}{" "}
                    avg actions per user
                  </div>
                  <div>Top actions:</div>
                  <ul className="list-disc ml-4">
                    {reportData.engagementMetrics.topActions.map((action) => (
                      <li key={action.action}>
                        {action.action}: {action.count}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-500">
                  Conversions
                </h4>
                <p className="text-2xl font-bold">
                  {reportData.conversionMetrics.totalConversions} conversions
                </p>
                <div className="text-sm text-gray-500">
                  <div>
                    {reportData.conversionMetrics.conversionRate.toFixed(1)}%
                    conversion rate
                  </div>
                  <div>Top conversion paths:</div>
                  <ul className="list-disc ml-4">
                    {reportData.conversionMetrics.topConversionPaths.map(
                      (path) => (
                        <li key={path.path}>
                          {path.path}: {path.count}
                        </li>
                      ),
                    )}
                  </ul>
                </div>
              </div>
              {reportData.revenueMetrics && (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-gray-500">Revenue</h4>
                  <p className="text-2xl font-bold">
                    ${reportData.revenueMetrics.totalRevenue.toFixed(2)}
                  </p>
                  <div className="text-sm text-gray-500">
                    <div>
                      $
                      {reportData.revenueMetrics.averageRevenuePerUser.toFixed(
                        2,
                      )}{" "}
                      avg revenue per user
                    </div>
                    <div>Top revenue sources:</div>
                    <ul className="list-disc ml-4">
                      {reportData.revenueMetrics.topRevenueSources.map(
                        (source) => (
                          <li key={source.source}>
                            {source.source}: ${source.amount.toFixed(2)}
                          </li>
                        ),
                      )}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
