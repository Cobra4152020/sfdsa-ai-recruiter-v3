"use client"

import { useState } from "react"

export default function EmergencyAdminAccess() {
  const [showLinks, setShowLinks] = useState(false)

  const adminPages = [
    { path: "/admin/dashboard", name: "Dashboard" },
    { path: "/admin/users", name: "Users" },
    { path: "/admin/analytics", name: "Analytics" },
    { path: "/admin/applicants", name: "Applicants" },
    { path: "/admin/donation-analytics", name: "Donation Analytics" },
    { path: "/admin/setup", name: "Setup" },
    { path: "/admin/sql-runner", name: "SQL Runner" },
    { path: "/admin/database-schema", name: "Database Schema" },
    { path: "/admin/email-diagnostics", name: "Email Diagnostics" },
    { path: "/admin/fix-login", name: "Fix Login" },
    { path: "/admin/health", name: "Health Check" },
    { path: "/admin/deployment", name: "Deployment" },
  ]

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg p-6 mt-10">
        <h1 className="text-2xl font-bold text-center mb-6">Emergency Admin Access</h1>

        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                This is an emergency access page. Normal authentication is bypassed.
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={() => setShowLinks(!showLinks)}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded mb-6"
        >
          {showLinks ? "Hide Admin Links" : "Show Admin Links"}
        </button>

        {showLinks && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {adminPages.map((page) => (
              <a
                key={page.path}
                href={page.path}
                className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-2 px-4 rounded text-center"
                target="_blank"
                rel="noopener noreferrer"
              >
                {page.name}
              </a>
            ))}
          </div>
        )}

        <div className="mt-6 pt-6 border-t border-gray-200">
          <h2 className="text-lg font-semibold mb-3">Database Fixes</h2>
          <p className="text-gray-600 mb-4">
            If you're having issues with authentication, consider running one of these database fixes:
          </p>
          <div className="space-y-2">
            <a
              href="/admin/fix-login"
              className="block bg-green-100 hover:bg-green-200 text-green-800 font-semibold py-2 px-4 rounded text-center"
              target="_blank"
              rel="noopener noreferrer"
            >
              Fix Login Issues
            </a>
            <a
              href="/admin/database-schema"
              className="block bg-green-100 hover:bg-green-200 text-green-800 font-semibold py-2 px-4 rounded text-center"
              target="_blank"
              rel="noopener noreferrer"
            >
              Verify Database Schema
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
