"use client";

import type { Applicant } from "./applicant-dashboard";

interface ApplicantStatsProps {
  applicants: Applicant[];
}

export function ApplicantStats({ applicants }: ApplicantStatsProps) {
  // Calculate stats
  const totalApplicants = applicants.length;

  const statusCounts = applicants.reduce(
    (acc, applicant) => {
      const status = applicant.application_status;
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  // Get counts for specific statuses
  const pendingCount = statusCounts["pending"] || 0;
  const appliedCount = statusCounts["applied"] || 0;
  const hiredCount = statusCounts["hired"] || 0;

  // Calculate conversion rates
  const applicationRate =
    totalApplicants > 0 ? (appliedCount / totalApplicants) * 100 : 0;
  const hireRate = appliedCount > 0 ? (hiredCount / appliedCount) * 100 : 0;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="bg-white p-4 rounded-lg border shadow-sm">
        <p className="text-sm text-gray-500">Total Applicants</p>
        <p className="text-2xl font-bold">{totalApplicants}</p>
      </div>

      <div className="bg-white p-4 rounded-lg border shadow-sm">
        <p className="text-sm text-gray-500">Pending</p>
        <p className="text-2xl font-bold">{pendingCount}</p>
      </div>

      <div className="bg-white p-4 rounded-lg border shadow-sm">
        <p className="text-sm text-gray-500">Application Rate</p>
        <p className="text-2xl font-bold">{applicationRate.toFixed(1)}%</p>
      </div>

      <div className="bg-white p-4 rounded-lg border shadow-sm">
        <p className="text-sm text-gray-500">Hire Rate</p>
        <p className="text-2xl font-bold">{hireRate.toFixed(1)}%</p>
      </div>
    </div>
  );
}
