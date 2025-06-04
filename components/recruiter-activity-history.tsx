"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useUser } from "@/context/user-context";

interface Activity {
  id: number;
  activityType: string;
  description: string;
  points: number;
  createdAt: string;
  recruitId?: string;
  metadata?: Record<string, unknown>;
}

const ITEMS_PER_PAGE = 8;

const activityIcons: Record<string, React.ReactNode> = {
  referral_signup: "👤",
  referral_application: "📝",
  referral_interview: "🗣️",
  referral_hire: "🎉",
  create_referral_link: "🔗",
  send_email_invite: "✉️",
  login_streak: "🔥",
  complete_training: "📚",
  reward_redemption: "🎁",
  tier_achievement: "🏆",
  social_share: "📱",
  feedback_submission: "📋",
};

export function RecruiterActivityHistory() {
  const { currentUser } = useUser();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [filteredActivities, setFilteredActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPoints, setTotalPoints] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [activityFilter, setActivityFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    if (!currentUser?.id) return;

    const fetchActivities = async () => {
      setIsLoading(true);
      try {
        // This would be an API call in a real implementation
        // For demonstration, we'll mock the data with a delay
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Mock data
        const mockActivities: Activity[] = [
          {
            id: 1,
            activityType: "referral_signup",
            description: "John Smith signed up using your referral link",
            points: 50,
            createdAt: "2023-08-10T14:30:00Z",
            recruitId: "user1",
          },
          {
            id: 2,
            activityType: "referral_application",
            description: "Maria Garcia submitted her application",
            points: 150,
            createdAt: "2023-08-08T09:15:00Z",
            recruitId: "user2",
          },
          {
            id: 3,
            activityType: "send_email_invite",
            description: "Sent email invitation to David Johnson",
            points: 20,
            createdAt: "2023-08-05T16:45:00Z",
          },
          {
            id: 4,
            activityType: "create_referral_link",
            description: "Created new referral link for LinkedIn campaign",
            points: 10,
            createdAt: "2023-08-01T11:20:00Z",
            metadata: { linkCode: "LINKEDIN2023" },
          },
          {
            id: 5,
            activityType: "login_streak",
            description: "7-day login streak achieved",
            points: 25,
            createdAt: "2023-07-28T08:00:00Z",
          },
          {
            id: 6,
            activityType: "referral_interview",
            description: "James Wilson scheduled for interview",
            points: 300,
            createdAt: "2023-07-25T15:10:00Z",
            recruitId: "user3",
          },
          {
            id: 7,
            activityType: "complete_training",
            description: "Completed advanced recruitment training",
            points: 100,
            createdAt: "2023-07-20T10:30:00Z",
          },
          {
            id: 8,
            activityType: "referral_hire",
            description: "Sarah Miller was hired",
            points: 1000,
            createdAt: "2023-07-15T09:45:00Z",
            recruitId: "user4",
          },
          {
            id: 9,
            activityType: "reward_redemption",
            description: "Redeemed: SFSD Coffee Mug",
            points: 0,
            createdAt: "2023-07-10T14:20:00Z",
            metadata: { rewardId: 2, rewardName: "SFSD Coffee Mug" },
          },
          {
            id: 10,
            activityType: "tier_achievement",
            description: "Achieved Silver Recruiter tier",
            points: 0,
            createdAt: "2023-07-05T16:30:00Z",
            metadata: { tierName: "Silver Recruiter", tierId: 2 },
          },
          {
            id: 11,
            activityType: "social_share",
            description: "Shared recruitment post on LinkedIn",
            points: 30,
            createdAt: "2023-07-01T11:15:00Z",
          },
          {
            id: 12,
            activityType: "feedback_submission",
            description: "Submitted feedback on recruitment process",
            points: 50,
            createdAt: "2023-06-28T09:00:00Z",
          },
        ];

        setActivities(mockActivities);

        // Calculate total points
        const total = mockActivities.reduce(
          (sum, activity) => sum + activity.points,
          0,
        );
        setTotalPoints(total);
      } catch (err) {
        setError("Failed to load activity history");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchActivities();
  }, [currentUser?.id]);

  // Apply filters when activities, searchTerm, or activityFilter change
  useEffect(() => {
    let filtered = activities;
    if (activityFilter !== "all") {
      filtered = filtered.filter((a) => a.activityType === activityFilter);
    }
    if (searchTerm) {
      filtered = filtered.filter((a) =>
        a.description.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }
    setFilteredActivities(filtered);
    setTotalPages(Math.ceil(filtered.length / ITEMS_PER_PAGE) || 1);
    setCurrentPage(1);
  }, [activities, searchTerm, activityFilter]);

  // Paginate filtered activities
  const paginatedActivities = filteredActivities.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  if (isLoading) return <div>Loading activity history...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>Recruiter Activity History</h2>
      <div>Total Points: {totalPoints}</div>
      <input
        type="text"
        placeholder="Search activities..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <select
        value={activityFilter}
        onChange={(e) => setActivityFilter(e.target.value)}
      >
        <option value="all">All Activities</option>
        {Object.keys(activityIcons).map((type) => (
          <option key={type} value={type}>
            {type.replace(/_/g, " ")}
          </option>
        ))}
      </select>
      <ul>
        {paginatedActivities.map((activity) => (
          <li key={activity.id}>
            <span>{activityIcons[activity.activityType] || ""}</span>{" "}
            {activity.description} ({activity.points} pts)
            <span style={{ marginLeft: 8, color: "#888" }}>
              {new Date(activity.createdAt).toLocaleString()}
            </span>
          </li>
        ))}
      </ul>
      <div>
        Page {currentPage} of {totalPages}
        <button
          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <button
          onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
}
