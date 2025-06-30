"use client";

import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, AlertTriangle } from "lucide-react";

interface HealthCheckData {
  database: {
    status: string;
    latency: string;
    connections: number;
    uptime: string;
  };
  email: {
    status: string;
    deliveryRate: string;
    bounceRate: string;
    queueSize: number;
  };
  auth: {
    status: string;
    activeUsers: number;
    failedLogins: number;
    tokenExpiry: string;
  };
  storage: {
    status: string;
    availability: string;
    errorRate: string;
    bandwidth: string;
  };
}

interface HealthCheckProps {
  data: HealthCheckData;
}

export function HealthCheck({ data }: HealthCheckProps) {
  const StatusIcon = ({ status }: { status: string }) => {
    if (status === "healthy")
      return <CheckCircle className="h-5 w-5 text-green-500" />;
    if (status === "error") return <XCircle className="h-5 w-5 text-red-500" />;
    return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
  };

  // Calculate overall status
  const allHealthy = Object.values(data).every(
    (service) => service.status === "healthy",
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <StatusIcon status={allHealthy ? "healthy" : "error"} />
          <span className="ml-2 font-medium">Overall Status</span>
        </div>
        <Badge
          variant="outline"
          className={`
            ${
              allHealthy
                ? "bg-green-50 text-green-700 border-green-200"
                : "bg-red-50 text-red-700 border-red-200"
            }
          `}
        >
          {allHealthy ? "HEALTHY" : "ISSUES DETECTED"}
        </Badge>
      </div>

      <div className="space-y-2">
        <h3 className="font-medium mb-2">Component Status</h3>

        <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
          <div className="flex items-center">
            <StatusIcon status={data.database.status} />
            <span className="ml-2">Database</span>
          </div>
          <div className="text-sm">
            <span
              className={
                data.database.status === "healthy"
                  ? "text-green-600"
                  : "text-red-600"
              }
            >
              {data.database.status.toUpperCase()}
            </span>
            <span className="text-gray-500 ml-2">
              ({data.database.latency})
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
          <div className="flex items-center">
            <StatusIcon status={data.email.status} />
            <span className="ml-2">Email Service</span>
          </div>
          <div className="text-sm">
            <span
              className={
                data.email.status === "healthy"
                  ? "text-green-600"
                  : "text-red-600"
              }
            >
              {data.email.status.toUpperCase()}
            </span>
            <span className="text-gray-500 ml-2">
              ({data.email.deliveryRate} delivery)
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
          <div className="flex items-center">
            <StatusIcon status={data.auth.status} />
            <span className="ml-2">Authentication</span>
          </div>
          <div className="text-sm">
            <span
              className={
                data.auth.status === "healthy"
                  ? "text-green-600"
                  : "text-red-600"
              }
            >
              {data.auth.status.toUpperCase()}
            </span>
            <span className="text-gray-500 ml-2">
              ({data.auth.activeUsers} active)
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
          <div className="flex items-center">
            <StatusIcon status={data.storage.status} />
            <span className="ml-2">Storage</span>
          </div>
          <div className="text-sm">
            <span
              className={
                data.storage.status === "healthy"
                  ? "text-green-600"
                  : "text-red-600"
              }
            >
              {data.storage.status.toUpperCase()}
            </span>
            <span className="text-gray-500 ml-2">
              ({data.storage.availability} uptime)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
