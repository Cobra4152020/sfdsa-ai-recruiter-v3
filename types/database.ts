export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          name: string
          email: string
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      badges: {
        Row: {
          id: string
          name: string
          description: string
          image_url: string
          criteria: string
          points: number
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          description: string
          image_url: string
          criteria: string
          points: number
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string
          image_url?: string
          criteria?: string
          points?: number
          created_at?: string
        }
      }
      user_badges: {
        Row: {
          id: string
          user_id: string
          badge_id: string
          awarded_at: string
        }
        Insert: {
          id?: string
          user_id: string
          badge_id: string
          awarded_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          badge_id?: string
          awarded_at?: string
        }
      }
      nft_awards: {
        Row: {
          id: string
          user_id: string
          name: string
          description: string
          image_url: string
          token_id: string
          blockchain: string
          contract_address: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          description: string
          image_url: string
          token_id: string
          blockchain: string
          contract_address: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          description?: string
          image_url?: string
          token_id?: string
          blockchain?: string
          contract_address?: string
          created_at?: string
        }
      }
      user_activities: {
        Row: {
          id: string
          user_id: string
          activity_type: string
          description: string
          points: number
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          activity_type: string
          description: string
          points: number
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          activity_type?: string
          description?: string
          points?: number
          created_at?: string
        }
      }
      applicants: {
        Row: {
          id: string
          user_id: string
          name: string
          email: string
          status: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          email: string
          status: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          email?: string
          status?: string
          created_at?: string
        }
      }
    }
    Views: {
      leaderboard_view: {
        Row: {
          user_id: string
          name: string
          email: string
          avatar_url: string | null
          participation_count: number
          badge_count: number
          nft_count: number
          applicant_count: number
          created_at: string
        }
      }
    }
    Functions: {
      get_leaderboard: {
        Args: {
          timeframe: string
          category: string
          limit_val: number
          offset_val: number
          search_term: string
        }
        Returns: {
          user_id: string
          name: string
          email: string
          avatar_url: string | null
          participation_count: number
          badge_count: number
          nft_count: number
          applicant_count: number
          rank: number
          created_at: string
        }[]
      }
    }
  }
}
