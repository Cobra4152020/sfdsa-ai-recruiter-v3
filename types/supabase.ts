export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      chat_interactions: {
        Row: {
          id: string
          user_id: string
          message: string
          response: string
          created_at: string
          updated_at: string
        }
      }
      tiktok_challenges: {
        Row: {
          id: string
          title: string
          description: string
          requirements: string
          status: string
          created_at: string
          updated_at: string
        }
      }
      trivia_games: {
        Row: {
          id: string
          title: string
          description: string
          questions: Json[]
          created_at: string
          updated_at: string
        }
      }
      daily_briefings: {
        Row: {
          id: string
          title: string
          content: string
          date: string
          created_at: string
          updated_at: string
        }
      }
      user_types: {
        Row: {
          user_id: string
          user_type: 'admin' | 'volunteer' | 'recruit'
        }
      }
      'volunteer.recruiters': {
        Row: {
          id: string
          is_active: boolean
          created_at: string
          updated_at: string
        }
      }
    }
    Functions: {
      add_timestamps_to_table: {
        Args: {
          table_name: string
        }
        Returns: void
      }
    }
  }
} 