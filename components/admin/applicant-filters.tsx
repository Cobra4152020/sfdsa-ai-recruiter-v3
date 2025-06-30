"use client";

import type React from "react";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, X } from "lucide-react";
import { format } from "date-fns";
import type { Applicant, ApplicantFiltersType } from "./applicant-dashboard";

interface ApplicantFiltersProps {
  filters: ApplicantFiltersType;
  setFilters: React.Dispatch<React.SetStateAction<ApplicantFiltersType>>;
  applicants: Applicant[];
}

export function ApplicantFilters({
  filters,
  setFilters,
  applicants,
}: ApplicantFiltersProps) {
  const [fromDate, setFromDate] = useState<Date | null>(filters.dateRange[0]);
  const [toDate, setToDate] = useState<Date | null>(filters.dateRange[1]);

  // Get unique referral sources
  const referralSources = [
    "all",
    ...new Set(applicants.map((a) => a.referral_source).filter(Boolean)),
  ];

  function handleDateRangeChange(fromDate: Date | null, toDate: Date | null) {
    setFromDate(fromDate);
    setToDate(toDate);
    setFilters((prev) => ({
      ...prev,
      dateRange: [fromDate, toDate],
    }));
  }

  function resetFilters() {
    setFromDate(null);
    setToDate(null);
    setFilters({
      status: "all",
      referralSource: "all",
      dateRange: [null, null],
      searchTerm: "",
    });
  }

  return (
    <div className="bg-muted p-4 rounded-lg border space-y-4">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="w-full md:w-1/4">
          <Label htmlFor="search">Search</Label>
          <Input
            id="search"
            placeholder="Search by name, email, or tracking #"
            value={filters.searchTerm}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, searchTerm: e.target.value }))
            }
          />
        </div>

        <div className="w-full md:w-1/4">
          <Label htmlFor="status">Status</Label>
          <Select
            value={filters.status}
            onValueChange={(value) =>
              setFilters((prev) => ({ ...prev, status: value }))
            }
          >
            <SelectTrigger id="status">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="contacted">Contacted</SelectItem>
              <SelectItem value="interested">Interested</SelectItem>
              <SelectItem value="applied">Applied</SelectItem>
              <SelectItem value="hired">Hired</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
              <SelectItem value="started">Started</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="w-full md:w-1/4">
          <Label htmlFor="referralSource">Referral Source</Label>
          <Select
            value={filters.referralSource}
            onValueChange={(value) =>
              setFilters((prev) => ({ ...prev, referralSource: value }))
            }
          >
            <SelectTrigger id="referralSource">
              <SelectValue placeholder="Select source" />
            </SelectTrigger>
            <SelectContent>
              {referralSources.map((source) => (
                <SelectItem key={source} value={source}>
                  {source === "all" ? "All Sources" : source || "Direct"}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="w-full md:w-1/4">
          <Label>Date Range</Label>
          <div className="flex gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {fromDate ? format(fromDate, "PP") : "From date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={fromDate || undefined}
                  onSelect={setFromDate}
                  initialFocus
                  onDayClick={(day) => handleDateRangeChange(day, toDate)}
                />
              </PopoverContent>
            </Popover>

            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {toDate ? format(toDate, "PP") : "To date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={toDate || undefined}
                  onSelect={setToDate}
                  initialFocus
                  onDayClick={(day) => handleDateRangeChange(fromDate, day)}
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <Button
          variant="ghost"
          onClick={resetFilters}
          className="flex items-center gap-1"
        >
          <X size={14} />
          Reset Filters
        </Button>
      </div>
    </div>
  );
}
