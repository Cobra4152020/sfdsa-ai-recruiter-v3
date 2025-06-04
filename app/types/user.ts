export type UserRole = "recruit" | "volunteer" | "admin";
export type UserStatus = "active" | "pending" | "inactive";

export interface UserWithRole {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  created_at: string;
  type: UserRole;
  has_applied: boolean;
  has_completed_profile: boolean;
  has_verified_email: boolean;
  is_active?: boolean;
}

export interface UserStats {
  total_users: number;
  active_users: number;
  recruits: number;
  volunteers: number;
  admins: number;
  pending_volunteers: number;
  recent_signups: number;
}
