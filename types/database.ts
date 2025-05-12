export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      // ... existing tables

      daily_briefings: {
        Row: {
          id: string
          date: string
          theme: string
          quote: string
          quote_author: string
          sgt_ken_take: string
          call_to_action: string
          created_at: string
          active: boolean
        }
        Insert: {
          id?: string
          date: string
          theme: string
          quote: string
          quote_author: string
          sgt_ken_take: string
          call_to_action: string
          created_at?: string
          active?: boolean
        }
        Update: {
          id?: string
          date?: string
          theme?: string
          quote?: string
          quote_author?: string
          sgt_ken_take?: string
          call_to_action?: string
          created_at?: string
          active?: boolean
        }
      }

      briefing_attendance: {
        Row: {
          id: string
          user_id: string
          briefing_id: string
          attended_at: string
          points_awarded: number
        }
        Insert: {
          id?: string
          user_id: string
          briefing_id: string
          attended_at?: string
          points_awarded?: number
        }
        Update: {
          id?: string
          user_id?: string
          briefing_id?: string
          attended_at?: string
          points_awarded?: number
        }
      }

      briefing_shares: {
        Row: {
          id: string
          user_id: string
          briefing_id: string
          platform: string
          shared_at: string
          points_awarded: number
        }
        Insert: {
          id?: string
          user_id: string
          briefing_id: string
          platform: string
          shared_at?: string
          points_awarded?: number
        }
        Update: {
          id?: string
          user_id?: string
          briefing_id?: string
          platform?: string
          shared_at?: string
          points_awarded?: number
        }
      }

      briefing_streaks: {
        Row: {
          user_id: string
          current_streak: number
          longest_streak: number
          last_briefing_date: string | null
          updated_at: string
        }
        Insert: {
          user_id: string
          current_streak?: number
          longest_streak?: number
          last_briefing_date?: string | null
          updated_at?: string
        }
        Update: {
          user_id?: string
          current_streak?: number
          longest_streak?: number
          last_briefing_date?: string | null
          updated_at?: string
        }
      }

      // You may have other tables here
    }
    // You may have other schema elements here
  }
}
