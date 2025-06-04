"use client";

import type React from "react";

import { useState } from "react";
import {
  ArrowRight,
  AlertTriangle,
  Database,
  Shield,
  Mail,
  Activity,
  Users,
  BarChart,
  Settings,
  Terminal,
} from "lucide-react";

export default function EmergencyAdminAccess() {
  const [showLinks, setShowLinks] = useState(true);

  const openInNewTab = (url: string) => {
    // Add the emergency bypass parameter to all URLs
    const urlWithBypass = `${url}${url.includes("?") ? "&" : "?"}emergency_bypass=true`;
    window.open(urlWithBypass, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="container mx-auto p-4 max-w-3xl">
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <h1 className="text-3xl font-bold text-center mb-6 text-green-800">
          Emergency Admin Access
        </h1>

        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
          <div className="flex items-start">
            <AlertTriangle className="h-5 w-5 text-yellow-500 mr-2 mt-0.5" />
            <p className="text-yellow-700">
              This is an emergency access page. Normal authentication is
              bypassed.
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowLinks(!showLinks)}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 px-4 rounded-md transition-colors mb-6"
        >
          {showLinks ? "Hide Admin Links" : "Show Admin Links"}
        </button>

        {showLinks && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <AdminLink
              title="Dashboard"
              icon={<Activity />}
              onClick={() => openInNewTab("/admin/dashboard")}
            />
            <AdminLink
              title="Users"
              icon={<Users />}
              onClick={() => openInNewTab("/admin/users")}
            />
            <AdminLink
              title="Analytics"
              icon={<BarChart />}
              onClick={() => openInNewTab("/admin/analytics")}
            />
            <AdminLink
              title="Applicants"
              icon={<Users />}
              onClick={() => openInNewTab("/admin/applicants")}
            />
            <AdminLink
              title="Donation Analytics"
              icon={<BarChart />}
              onClick={() => openInNewTab("/admin/donation-analytics")}
            />
            <AdminLink
              title="Setup"
              icon={<Settings />}
              onClick={() => openInNewTab("/admin/setup")}
            />
            <AdminLink
              title="SQL Runner"
              icon={<Terminal />}
              onClick={() => openInNewTab("/admin/sql-runner")}
            />
            <AdminLink
              title="Database Schema"
              icon={<Database />}
              onClick={() => openInNewTab("/admin/database-schema")}
            />
            <AdminLink
              title="Email Diagnostics"
              icon={<Mail />}
              onClick={() => openInNewTab("/admin/email-diagnostics")}
            />
            <AdminLink
              title="Fix Login"
              icon={<Shield />}
              onClick={() => openInNewTab("/admin/fix-login")}
            />
            <AdminLink
              title="Health Check"
              icon={<Activity />}
              onClick={() => openInNewTab("/admin/health")}
            />
            <AdminLink
              title="Deployment"
              icon={<Settings />}
              onClick={() => openInNewTab("/admin/deployment")}
            />
          </div>
        )}

        <h2 className="text-xl font-semibold mb-4 text-green-800">
          Database Fixes
        </h2>
        <p className="mb-4">
          If you&apos;re having issues with authentication, consider running one
          of these database fixes:
        </p>

        <div className="space-y-4 mb-6">
          <button
            onClick={() => openInNewTab("/admin/fix-login")}
            className="w-full bg-green-100 hover:bg-green-200 text-green-800 py-3 px-4 rounded-md transition-colors"
          >
            Fix Login Issues
          </button>
          <button
            onClick={() => openInNewTab("/admin/database-schema")}
            className="w-full bg-green-100 hover:bg-green-200 text-green-800 py-3 px-4 rounded-md transition-colors"
          >
            Verify Database Schema
          </button>
        </div>

        <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
          <div className="flex">
            <AlertTriangle className="h-5 w-5 text-blue-500 mr-2" />
            <p className="text-blue-700">
              <strong>Note:</strong> All links will open in a new tab with the
              emergency bypass parameter added automatically.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function AdminLink({
  title,
  icon,
  onClick,
}: {
  title: string;
  icon: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="bg-gray-100 hover:bg-gray-200 rounded-md p-4 transition-colors flex items-center justify-between"
    >
      <div className="flex items-center">
        <span className="mr-2 text-gray-700">{icon}</span>
        <span>{title}</span>
      </div>
      <ArrowRight className="h-5 w-5 text-gray-500" />
    </button>
  );
}
