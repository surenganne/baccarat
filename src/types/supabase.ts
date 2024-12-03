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
      tables: {
        Row: {
          id: string
          name: string
          category: string
          status: 'active' | 'archived'
          location: string | null
          created_at: string
          updated_at: string
          archived_at: string | null
          imported_at: string | null
        }
        Insert: {
          id?: string
          name: string
          category?: string
          status?: 'active' | 'archived'
          location?: string | null
          created_at?: string
          updated_at?: string
          archived_at?: string | null
          imported_at?: string | null
        }
        Update: {
          id?: string
          name?: string
          category?: string
          status?: 'active' | 'archived'
          location?: string | null
          created_at?: string
          updated_at?: string
          archived_at?: string | null
          imported_at?: string | null
        }
      }
      hands: {
        Row: {
          id: string
          table_id: string
          result: 'player' | 'banker' | 'tie' | 'playerNatural' | 'bankerNatural'
          is_natural: boolean
          pairs: 'none' | 'player' | 'banker' | 'both'
          player_score: number
          banker_score: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          table_id: string
          result: 'player' | 'banker' | 'tie' | 'playerNatural' | 'bankerNatural'
          is_natural?: boolean
          pairs?: 'none' | 'player' | 'banker' | 'both'
          player_score: number
          banker_score: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          table_id?: string
          result?: 'player' | 'banker' | 'tie' | 'playerNatural' | 'bankerNatural'
          is_natural?: boolean
          pairs?: 'none' | 'player' | 'banker' | 'both'
          player_score?: number
          banker_score?: number
          created_at?: string
          updated_at?: string
        }
      }
      activity_logs: {
        Row: {
          id: string
          table_id: string
          type: string
          details: string
          created_at: string
        }
        Insert: {
          id?: string
          table_id: string
          type: string
          details: string
          created_at?: string
        }
        Update: {
          id?: string
          table_id?: string
          type?: string
          details?: string
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}