"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, Eye, MoreHorizontal } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Applicant } from "./applicant-dashboard";

type SortField = "name" | "email" | "created_at" | "status";
type SortDirection = "asc" | "desc";

interface ApplicantTableProps {
  applicants: Applicant[];
  isLoading: boolean;
  onViewDetails: (applicant: Applicant) => void;
  onUpdateStatus: (id: string, status: string) => void;
}

export function ApplicantTable({
  applicants,
  isLoading,
  onViewDetails,
  onUpdateStatus,
}: ApplicantTableProps) {
  const [sortField, setSortField] = useState<SortField>("created_at");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

  function handleSort(field: SortField) {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  }

  const sortedApplicants = [...applicants].sort((a, b) => {
    let comparison = 0;

    switch (sortField) {
      case "name":
        comparison = `${a.last_name} ${a.first_name}`.localeCompare(
          `${b.last_name} ${b.first_name}`,
        );
        break;
      case "email":
        comparison = a.email.localeCompare(b.email);
        break;
      case "status":
        comparison = a.application_status.localeCompare(b.application_status);
        break;
      case "created_at":
        comparison =
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        break;
    }

    return sortDirection === "asc" ? comparison : -comparison;
  });

  function getStatusBadge(status: string) {
    switch (status) {
      case "pending":
        return (
          <Badge
            variant="outline"
            className="bg-yellow-50 text-yellow-700 border-yellow-200"
          >
            Pending
          </Badge>
        );
      case "contacted":
        return (
          <Badge
            variant="outline"
            className="bg-blue-50 text-blue-700 border-blue-200"
          >
            Contacted
          </Badge>
        );
      case "interested":
        return (
          <Badge
            variant="outline"
            className="bg-green-50 text-green-700 border-green-200"
          >
            Interested
          </Badge>
        );
      case "applied":
        return (
          <Badge
            variant="outline"
            className="bg-purple-50 text-purple-700 border-purple-200"
          >
            Applied
          </Badge>
        );
      case "hired":
        return (
          <Badge
            variant="outline"
            className="bg-green-100 text-green-800 border-green-300"
          >
            Hired
          </Badge>
        );
      case "rejected":
        return (
          <Badge
            variant="outline"
            className="bg-red-50 text-red-700 border-red-200"
          >
            Rejected
          </Badge>
        );
      case "started":
        return (
          <Badge
            variant="outline"
            className="bg-blue-50 text-blue-700 border-blue-200"
          >
            Started
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  }

  if (isLoading) {
    return (
      <div className="text-center py-10">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
        <p className="mt-4 text-gray-500">Loading applicant data...</p>
      </div>
    );
  }

  if (applicants.length === 0) {
    return (
      <div className="text-center py-10 border rounded-lg bg-gray-50">
        <p className="text-gray-500">
          No applicants found matching your criteria.
        </p>
      </div>
    );
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead
              className="w-[250px] cursor-pointer"
              onClick={() => handleSort("name")}
            >
              <div className="flex items-center">
                Name
                {sortField === "name" && (
                  <ChevronDown
                    className={`ml-1 h-4 w-4 ${sortDirection === "desc" ? "transform rotate-180" : ""}`}
                  />
                )}
              </div>
            </TableHead>
            <TableHead
              className="cursor-pointer"
              onClick={() => handleSort("email")}
            >
              <div className="flex items-center">
                Email
                {sortField === "email" && (
                  <ChevronDown
                    className={`ml-1 h-4 w-4 ${sortDirection === "desc" ? "transform rotate-180" : ""}`}
                  />
                )}
              </div>
            </TableHead>
            <TableHead>Tracking #</TableHead>
            <TableHead>Referral</TableHead>
            <TableHead
              className="cursor-pointer"
              onClick={() => handleSort("created_at")}
            >
              <div className="flex items-center">
                Date
                {sortField === "created_at" && (
                  <ChevronDown
                    className={`ml-1 h-4 w-4 ${sortDirection === "desc" ? "transform rotate-180" : ""}`}
                  />
                )}
              </div>
            </TableHead>
            <TableHead
              className="cursor-pointer"
              onClick={() => handleSort("status")}
            >
              <div className="flex items-center">
                Status
                {sortField === "status" && (
                  <ChevronDown
                    className={`ml-1 h-4 w-4 ${sortDirection === "desc" ? "transform rotate-180" : ""}`}
                  />
                )}
              </div>
            </TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedApplicants.map((applicant) => (
            <TableRow key={applicant.id}>
              <TableCell className="font-medium">
                {applicant.first_name} {applicant.last_name}
              </TableCell>
              <TableCell>{applicant.email}</TableCell>
              <TableCell className="font-mono text-sm">
                {applicant.tracking_number}
              </TableCell>
              <TableCell>{applicant.referral_source || "Direct"}</TableCell>
              <TableCell>
                {new Date(applicant.created_at).toLocaleDateString()}
              </TableCell>
              <TableCell>
                {getStatusBadge(applicant.application_status)}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onViewDetails(applicant)}
                    title="View Details"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => onUpdateStatus(applicant.id, "pending")}
                      >
                        Mark as Pending
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() =>
                          onUpdateStatus(applicant.id, "contacted")
                        }
                      >
                        Mark as Contacted
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() =>
                          onUpdateStatus(applicant.id, "interested")
                        }
                      >
                        Mark as Interested
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => onUpdateStatus(applicant.id, "applied")}
                      >
                        Mark as Applied
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => onUpdateStatus(applicant.id, "hired")}
                      >
                        Mark as Hired
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => onUpdateStatus(applicant.id, "rejected")}
                      >
                        Mark as Rejected
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
