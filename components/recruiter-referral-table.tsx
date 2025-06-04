"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  ChevronDown,
  ChevronUp,
  Search,
  Mail,
  MessageSquare,
  FileText,
  Calendar,
  CheckCircle,
  XCircle,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Referral {
  id: string;
  name: string;
  email: string;
  source: string;
  status: string;
  date: string;
  daysToHire?: number;
  daysInProcess?: number;
}

interface RecruiterReferralTableProps {
  referrals: Referral[];
}

export function RecruiterReferralTable({
  referrals,
}: RecruiterReferralTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sourceFilter, setSourceFilter] = useState("all");
  const [sortField, setSortField] = useState("date");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [expandedReferral, setExpandedReferral] = useState<string | null>(null);

  // Filter referrals based on search term and filters
  const filteredReferrals = referrals.filter((referral) => {
    const matchesSearch =
      referral.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      referral.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || referral.status === statusFilter;
    const matchesSource =
      sourceFilter === "all" || referral.source === sourceFilter;

    return matchesSearch && matchesStatus && matchesSource;
  });

  // Sort referrals based on sort field and direction
  const sortedReferrals = [...filteredReferrals].sort((a, b) => {
    if (sortField === "date") {
      return sortDirection === "asc"
        ? new Date(a.date).getTime() - new Date(b.date).getTime()
        : new Date(b.date).getTime() - new Date(a.date).getTime();
    }

    if (sortField === "name") {
      return sortDirection === "asc"
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name);
    }

    if (sortField === "status") {
      return sortDirection === "asc"
        ? a.status.localeCompare(b.status)
        : b.status.localeCompare(a.status);
    }

    if (sortField === "source") {
      return sortDirection === "asc"
        ? a.source.localeCompare(b.source)
        : b.source.localeCompare(a.source);
    }

    return 0;
  });

  // Toggle sort direction or set new sort field
  const handleSort = (field: string) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Toggle expanded referral
  const toggleReferralDetails = (id: string) => {
    setExpandedReferral(expandedReferral === id ? null : id);
  };

  // Get status badge based on status
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Initial Contact":
        return (
          <Badge
            variant="outline"
            className="bg-blue-50 text-blue-800 border-blue-300"
          >
            Initial Contact
          </Badge>
        );
      case "Application":
        return (
          <Badge
            variant="outline"
            className="bg-purple-50 text-purple-800 border-purple-300"
          >
            Application
          </Badge>
        );
      case "Interview":
        return (
          <Badge
            variant="outline"
            className="bg-amber-50 text-amber-800 border-amber-300"
          >
            Interview
          </Badge>
        );
      case "Hired":
        return (
          <Badge
            variant="outline"
            className="bg-green-50 text-green-800 border-green-300"
          >
            Hired
          </Badge>
        );
      case "Rejected":
        return (
          <Badge
            variant="outline"
            className="bg-red-50 text-red-800 border-red-300"
          >
            Rejected
          </Badge>
        );
      default:
        return (
          <Badge
            variant="outline"
            className="bg-gray-50 text-gray-800 border-gray-300"
          >
            {status}
          </Badge>
        );
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <CardTitle>Referral Details</CardTitle>
            <CardDescription>
              Detailed information about your referrals
            </CardDescription>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                type="search"
                placeholder="Search referrals..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="Initial Contact">Initial Contact</SelectItem>
                <SelectItem value="Application">Application</SelectItem>
                <SelectItem value="Interview">Interview</SelectItem>
                <SelectItem value="Hired">Hired</SelectItem>
                <SelectItem value="Rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sourceFilter} onValueChange={setSourceFilter}>
              <SelectTrigger className="w-full md:w-40">
                <SelectValue placeholder="Source" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sources</SelectItem>
                <SelectItem value="Email">Email</SelectItem>
                <SelectItem value="Facebook">Facebook</SelectItem>
                <SelectItem value="LinkedIn">LinkedIn</SelectItem>
                <SelectItem value="Twitter">Twitter</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[300px]">
                  <Button
                    variant="ghost"
                    className="p-0 font-medium flex items-center"
                    onClick={() => handleSort("name")}
                  >
                    Name
                    {sortField === "name" &&
                      (sortDirection === "asc" ? (
                        <ChevronUp className="ml-1 h-4 w-4" />
                      ) : (
                        <ChevronDown className="ml-1 h-4 w-4" />
                      ))}
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    className="p-0 font-medium flex items-center"
                    onClick={() => handleSort("source")}
                  >
                    Source
                    {sortField === "source" &&
                      (sortDirection === "asc" ? (
                        <ChevronUp className="ml-1 h-4 w-4" />
                      ) : (
                        <ChevronDown className="ml-1 h-4 w-4" />
                      ))}
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    className="p-0 font-medium flex items-center"
                    onClick={() => handleSort("status")}
                  >
                    Status
                    {sortField === "status" &&
                      (sortDirection === "asc" ? (
                        <ChevronUp className="ml-1 h-4 w-4" />
                      ) : (
                        <ChevronDown className="ml-1 h-4 w-4" />
                      ))}
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    className="p-0 font-medium flex items-center"
                    onClick={() => handleSort("date")}
                  >
                    Date
                    {sortField === "date" &&
                      (sortDirection === "asc" ? (
                        <ChevronUp className="ml-1 h-4 w-4" />
                      ) : (
                        <ChevronDown className="ml-1 h-4 w-4" />
                      ))}
                  </Button>
                </TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedReferrals.length > 0 ? (
                sortedReferrals.map((referral) => (
                  <>
                    <TableRow key={referral.id}>
                      <TableCell className="font-medium">
                        <div>
                          <div>{referral.name}</div>
                          <div className="text-sm text-gray-500">
                            {referral.email}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{referral.source}</TableCell>
                      <TableCell>{getStatusBadge(referral.status)}</TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span>
                            {new Date(referral.date).toLocaleDateString()}
                          </span>
                          {referral.daysToHire && (
                            <span className="text-xs text-green-600">
                              {referral.daysToHire} days to hire
                            </span>
                          )}
                          {referral.daysInProcess && (
                            <span className="text-xs text-gray-500">
                              {referral.daysInProcess} days in process
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleReferralDetails(referral.id)}
                          >
                            {expandedReferral === referral.id ? (
                              <ChevronUp className="h-4 w-4" />
                            ) : (
                              <ChevronDown className="h-4 w-4" />
                            )}
                            <span className="sr-only">Toggle details</span>
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Mail className="h-4 w-4" />
                            <span className="sr-only">Email</span>
                          </Button>
                          <Button variant="ghost" size="sm">
                            <MessageSquare className="h-4 w-4" />
                            <span className="sr-only">Message</span>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                    {expandedReferral === referral.id && (
                      <TableRow>
                        <TableCell colSpan={5} className="p-4 bg-gray-50">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <h4 className="font-medium mb-2">
                                Referral Details
                              </h4>
                              <div className="space-y-2">
                                <div className="flex items-start">
                                  <div className="w-32 text-sm font-medium text-gray-500">
                                    ID:
                                  </div>
                                  <div className="text-sm">{referral.id}</div>
                                </div>
                                <div className="flex items-start">
                                  <div className="w-32 text-sm font-medium text-gray-500">
                                    Name:
                                  </div>
                                  <div className="text-sm">{referral.name}</div>
                                </div>
                                <div className="flex items-start">
                                  <div className="w-32 text-sm font-medium text-gray-500">
                                    Email:
                                  </div>
                                  <div className="text-sm">
                                    {referral.email}
                                  </div>
                                </div>
                                <div className="flex items-start">
                                  <div className="w-32 text-sm font-medium text-gray-500">
                                    Source:
                                  </div>
                                  <div className="text-sm">
                                    {referral.source}
                                  </div>
                                </div>
                                <div className="flex items-start">
                                  <div className="w-32 text-sm font-medium text-gray-500">
                                    Status:
                                  </div>
                                  <div className="text-sm">
                                    {referral.status}
                                  </div>
                                </div>
                                <div className="flex items-start">
                                  <div className="w-32 text-sm font-medium text-gray-500">
                                    Referred On:
                                  </div>
                                  <div className="text-sm">
                                    {new Date(
                                      referral.date,
                                    ).toLocaleDateString()}
                                  </div>
                                </div>
                                {referral.daysToHire && (
                                  <div className="flex items-start">
                                    <div className="w-32 text-sm font-medium text-gray-500">
                                      Days to Hire:
                                    </div>
                                    <div className="text-sm">
                                      {referral.daysToHire} days
                                    </div>
                                  </div>
                                )}
                                {referral.daysInProcess && (
                                  <div className="flex items-start">
                                    <div className="w-32 text-sm font-medium text-gray-500">
                                      Days in Process:
                                    </div>
                                    <div className="text-sm">
                                      {referral.daysInProcess} days
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>

                            <div>
                              <h4 className="font-medium mb-2">Timeline</h4>
                              <div className="space-y-4">
                                <div className="flex">
                                  <div className="flex flex-col items-center mr-4">
                                    <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                                      <CheckCircle className="h-4 w-4 text-green-600" />
                                    </div>
                                    <div className="h-full w-0.5 bg-gray-200"></div>
                                  </div>
                                  <div>
                                    <div className="font-medium">
                                      Referral Created
                                    </div>
                                    <div className="text-sm text-gray-500">
                                      {new Date(
                                        referral.date,
                                      ).toLocaleDateString()}
                                    </div>
                                    <div className="text-sm text-gray-600 mt-1">
                                      Initial referral created via{" "}
                                      {referral.source}
                                    </div>
                                  </div>
                                </div>

                                {referral.status === "Initial Contact" ||
                                referral.status === "Application" ||
                                referral.status === "Interview" ||
                                referral.status === "Hired" ||
                                referral.status === "Rejected" ? (
                                  <div className="flex">
                                    <div className="flex flex-col items-center mr-4">
                                      <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                                        <MessageSquare className="h-4 w-4 text-green-600" />
                                      </div>
                                      <div className="h-full w-0.5 bg-gray-200"></div>
                                    </div>
                                    <div>
                                      <div className="font-medium">
                                        Initial Contact
                                      </div>
                                      <div className="text-sm text-gray-500">
                                        {new Date(
                                          new Date(referral.date).getTime() +
                                            2 * 24 * 60 * 60 * 1000,
                                        ).toLocaleDateString()}
                                      </div>
                                      <div className="text-sm text-gray-600 mt-1">
                                        Candidate was contacted by recruitment
                                        team
                                      </div>
                                    </div>
                                  </div>
                                ) : null}

                                {referral.status === "Application" ||
                                referral.status === "Interview" ||
                                referral.status === "Hired" ||
                                referral.status === "Rejected" ? (
                                  <div className="flex">
                                    <div className="flex flex-col items-center mr-4">
                                      <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                                        <FileText className="h-4 w-4 text-green-600" />
                                      </div>
                                      <div className="h-full w-0.5 bg-gray-200"></div>
                                    </div>
                                    <div>
                                      <div className="font-medium">
                                        Application Submitted
                                      </div>
                                      <div className="text-sm text-gray-500">
                                        {new Date(
                                          new Date(referral.date).getTime() +
                                            5 * 24 * 60 * 60 * 1000,
                                        ).toLocaleDateString()}
                                      </div>
                                      <div className="text-sm text-gray-600 mt-1">
                                        Candidate submitted their application
                                      </div>
                                    </div>
                                  </div>
                                ) : null}

                                {referral.status === "Interview" ||
                                referral.status === "Hired" ||
                                referral.status === "Rejected" ? (
                                  <div className="flex">
                                    <div className="flex flex-col items-center mr-4">
                                      <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                                        <Calendar className="h-4 w-4 text-green-600" />
                                      </div>
                                      <div className="h-full w-0.5 bg-gray-200"></div>
                                    </div>
                                    <div>
                                      <div className="font-medium">
                                        Interview Scheduled
                                      </div>
                                      <div className="text-sm text-gray-500">
                                        {new Date(
                                          new Date(referral.date).getTime() +
                                            10 * 24 * 60 * 60 * 1000,
                                        ).toLocaleDateString()}
                                      </div>
                                      <div className="text-sm text-gray-600 mt-1">
                                        Candidate scheduled for interview
                                      </div>
                                    </div>
                                  </div>
                                ) : null}

                                {referral.status === "Hired" ? (
                                  <div className="flex">
                                    <div className="flex flex-col items-center mr-4">
                                      <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                                        <CheckCircle className="h-4 w-4 text-green-600" />
                                      </div>
                                    </div>
                                    <div>
                                      <div className="font-medium">Hired</div>
                                      <div className="text-sm text-gray-500">
                                        {new Date(
                                          new Date(referral.date).getTime() +
                                            (referral.daysToHire || 20) *
                                              24 *
                                              60 *
                                              60 *
                                              1000,
                                        ).toLocaleDateString()}
                                      </div>
                                      <div className="text-sm text-gray-600 mt-1">
                                        Candidate was successfully hired
                                      </div>
                                    </div>
                                  </div>
                                ) : null}

                                {referral.status === "Rejected" ? (
                                  <div className="flex">
                                    <div className="flex flex-col items-center mr-4">
                                      <div className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center">
                                        <XCircle className="h-4 w-4 text-red-600" />
                                      </div>
                                    </div>
                                    <div>
                                      <div className="font-medium">
                                        Not Selected
                                      </div>
                                      <div className="text-sm text-gray-500">
                                        {new Date(
                                          new Date(referral.date).getTime() +
                                            15 * 24 * 60 * 60 * 1000,
                                        ).toLocaleDateString()}
                                      </div>
                                      <div className="text-sm text-gray-600 mt-1">
                                        Candidate was not selected for the
                                        position
                                      </div>
                                    </div>
                                  </div>
                                ) : null}
                              </div>
                            </div>
                          </div>

                          <div className="mt-4 flex justify-end space-x-2">
                            <Button variant="outline" size="sm">
                              <Mail className="h-4 w-4 mr-2" />
                              Send Email
                            </Button>
                            <Button variant="outline" size="sm">
                              <MessageSquare className="h-4 w-4 mr-2" />
                              Send Message
                            </Button>
                            <Button variant="outline" size="sm">
                              <FileText className="h-4 w-4 mr-2" />
                              View Application
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    No referrals found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
