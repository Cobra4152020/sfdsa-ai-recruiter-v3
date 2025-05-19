// User management types for client-side use

export type UserRole = "recruit" | "volunteer" | "admin"
export type UserStatus = "active" | "pending" | "rejected" | "inactive"

export interface UserBasic {
  id: string
  email: string
  created_at: string
  user_type?: UserRole
  status?: UserStatus
}

export interface RecruitUser extends UserBasic {
  first_name?: string
  last_name?: string
  phone?: string
  zip_code?: string
  avatar_url?: string
  points?: number
  badge_count?: number
  participation_count?: number
}

export interface VolunteerUser extends UserBasic {
  first_name?: string
  last_name?: string
  phone?: string
  organization?: string
  is_verified?: boolean
  is_active?: boolean
  verified_at?: string
  referral_count?: number
  points?: number
}

export interface AdminUser extends UserBasic {
  name?: string
  last_login?: string
}

export type UserWithRole = RecruitUser | VolunteerUser | AdminUser

export interface UserStats {
  total_users: number
  active_users: number
  recruits: number
  volunteers: number
  admins: number
  pending_volunteers: number
  recent_signups: number
}

// All async functions and Supabase logic have been moved to lib/user-management-service-server.ts
