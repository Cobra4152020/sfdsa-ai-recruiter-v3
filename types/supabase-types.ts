export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      active_tiktok_challenges: {
        Row: {
          id: number
          title: string
          description: string
          instructions: string
          hashtags: string[]
          badge_reward: string
          example_video_url: string
          thumbnail_url: string
          status: string
          start_date: string
          end_date: string
          points_reward: number
          requirements: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          title: string
          description: string
          instructions: string
          hashtags?: string[]
          badge_reward?: string
          example_video_url?: string
          thumbnail_url?: string
          status?: string
          start_date?: string
          end_date?: string
          points_reward?: number
          requirements?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          title?: string
          description?: string
          instructions?: string
          hashtags?: string[]
          badge_reward?: string
          example_video_url?: string
          thumbnail_url?: string
          status?: string
          start_date?: string
          end_date?: string
          points_reward?: number
          requirements?: Json
          created_at?: string
          updated_at?: string
        }
      }
      applicants: {
        Row: {
          id: string
          first_name: string
          last_name: string
          email: string
          phone: string
          zip_code: string
          referral_source: string
          referral_code: string
          tracking_number: string
          application_status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          first_name: string
          last_name: string
          email: string
          phone?: string
          zip_code?: string
          referral_source?: string
          referral_code?: string
          tracking_number?: string
          application_status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          first_name?: string
          last_name?: string
          email?: string
          phone?: string
          zip_code?: string
          referral_source?: string
          referral_code?: string
          tracking_number?: string
          application_status?: string
          created_at?: string
          updated_at?: string
        }
      }
      badge_shares: {
        Row: {
          id: string
          user_id: string
          badge_id: string
          platform: string
          shared_at: string
          click_count: number
          share_url: string
        }
        Insert: {
          id?: string
          user_id: string
          badge_id: string
          platform: string
          shared_at?: string
          click_count?: number
          share_url?: string
        }
        Update: {
          id?: string
          user_id?: string
          badge_id?: string
          platform?: string
          shared_at?: string
          click_count?: number
          share_url?: string
        }
      }
      daily_briefings: {
        Row: {
          id: string
          title: string
          content: string
          date: string
          theme: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          content: string
          date: string
          theme?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          content?: string
          date?: string
          theme?: string
          created_at?: string
          updated_at?: string
        }
      }
      user_roles: {
        Row: {
          id: string
          user_id: string
          role: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          role: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          role?: string
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
