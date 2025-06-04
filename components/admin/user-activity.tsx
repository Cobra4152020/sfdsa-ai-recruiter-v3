"use client";

import { useEffect, useState } from "react";

interface UserActivityProps {
  userId: string;
}

export function UserActivity({ userId }: UserActivityProps) {
  const [activities, setActivities] = useState<unknown[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchActivities() {
      try {
        setIsLoading(true);
        const response = await fetch(
          `/api/user-management?action=activity&userId=${userId}`,
        );
        if (!response.ok) {
          throw new Error("Failed to fetch activities");
        }
        const data = await response.json();
        setActivities(data);
      } catch (err) {
        console.error("Error fetching user activity:", err);
        setError("Failed to load user activity");
      } finally {
        setIsLoading(false);
      }
    }

    fetchActivities();
  }, [userId]);

  if (isLoading) {
    return <div>Loading activity...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (activities.length === 0) {
    return <div>No activity found</div>;
  }

  return (
    <div className="space-y-4">
      {activities.map((activity) => (
        <div key={activity.id} className="border rounded-lg p-4">
          <div className="flex justify-between items-start">
            <div>
              <p className="font-medium">{activity.action}</p>
              <p className="text-sm text-gray-500">{activity.details}</p>
            </div>
            <p className="text-sm text-gray-500">
              {new Date(activity.created_at).toLocaleString()}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
