export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Profile = {
  id: string;
  email?: string;
  full_name?: string;
  username?: string;
  avatar_url?: string;
  bio?: string;
  created_at: string;
  updated_at?: string;
  is_admin?: boolean;
};

export type Database = {
  public: {
    Tables: {
      bible_studies: {
        Row: {
          content: string
          created_at: string
          id: string
          likes_count: number | null
          profile_id: string
          scripture_reference: string
          title: string
          user_id: string
          user_likes: string[] | null
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          likes_count?: number | null
          profile_id: string
          scripture_reference: string
          title: string
          user_id: string
          user_likes: string[] | null
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          likes_count?: number | null
          profile_id?: string
          scripture_reference?: string
          title?: string
          user_id?: string
          user_likes: string[] | null
        }
        Relationships: [
          {
            foreignKeyName: "bible_studies_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      biblestudy_responses: {
        Row: {
          content: string
          created_at: string
          id: string
          profile_id: string
          study_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          profile_id: string
          study_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          profile_id?: string
          study_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "biblestudy_responses_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "biblestudy_responses_study_id_fkey"
            columns: ["study_id"]
            isOneToOne: false
            referencedRelation: "bible_studies"
            referencedColumns: ["id"]
          },
        ]
      }
      newsletter_subscriptions: {
        Row: {
          created_at: string
          email: string
          id: string
          status: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          status?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          status?: string | null
        }
        Relationships: []
      }
      prayer_requests: {
        Row: {
          content: string
          created_at: string
          id: string
          is_anonymous: boolean | null
          moderation_status: string | null
          prayer_count: number | null
          profile_id: string
          status: string | null
          title: string
          user_id: string
          user_likes: string[] | null
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          is_anonymous?: boolean | null
          moderation_status?: string | null
          prayer_count?: number | null
          profile_id: string
          status?: string | null
          title: string
          user_id: string
          user_likes: string[] | null
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          is_anonymous?: boolean | null
          moderation_status?: string | null
          prayer_count?: number | null
          profile_id?: string
          status?: string | null
          title?: string
          user_id?: string
          user_likes: string[] | null
        }
        Relationships: [
          {
            foreignKeyName: "prayer_requests_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      prayer_responses: {
        Row: {
          content: string
          created_at: string
          id: string
          profile_id: string
          request_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          profile_id: string
          request_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          profile_id?: string
          request_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "prayer_responses_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "prayer_responses_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "prayer_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: Profile;
        Insert: Omit<Profile, 'updated_at'>;
        Update: Partial<Profile>;
      }
      testimonies: {
        Row: {
          content: string
          created_at: string
          id: string
          is_anonymous: boolean | null
          likes_count: number | null
          profile_id: string
          title: string
          user_id: string
          user_likes: string[] | null
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          is_anonymous?: boolean | null
          likes_count?: number | null
          profile_id: string
          title: string
          user_id: string
          user_likes: string[] | null
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          is_anonymous?: boolean | null
          likes_count?: number | null
          profile_id?: string
          title?: string
          user_id?: string
          user_likes: string[] | null
        }
        Relationships: [
          {
            foreignKeyName: "testimonies_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      spiritual_questions: {
        Row: {
          id: string
          title: string
          content: string
          created_at: string
          profile_id: string
          user_id: string
          is_anonymous: boolean | null
          likes_count: number | null
          user_likes: string[] | null
          moderation_status: 'pending' | 'approved' | 'rejected'
        }
        Insert: {
          title: string
          content: string
          created_at?: string
          profile_id: string
          user_id: string
          is_anonymous?: boolean | null
          likes_count?: number | null
          user_likes?: string[] | null
          moderation_status?: 'pending' | 'approved' | 'rejected'
        }
        Update: {
          title?: string
          content?: string
          created_at?: string
          profile_id?: string
          user_id?: string
          is_anonymous?: boolean | null
          likes_count?: number | null
          user_likes?: string[] | null
          moderation_status?: 'pending' | 'approved' | 'rejected'
        }
        Relationships: [
          {
            foreignKeyName: "spiritual_questions_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      spiritual_question_responses: {
        Row: {
          id: string
          content: string
          created_at: string
          question_id: string
          profile_id: string
          user_id: string
          updated_at: string
          moderation_status: 'pending' | 'approved' | 'rejected'
        }
        Insert: {
          content: string
          created_at?: string
          question_id: string
          profile_id: string
          user_id: string
          updated_at?: string
          moderation_status?: 'pending' | 'approved' | 'rejected'
        }
        Update: {
          content?: string
          created_at?: string
          question_id?: string
          profile_id?: string
          user_id?: string
          updated_at?: string
          moderation_status?: 'pending' | 'approved' | 'rejected'
        }
        Relationships: [
          {
            foreignKeyName: "spiritual_question_responses_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "spiritual_question_responses_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "spiritual_questions"
            referencedColumns: ["id"]
          }
        ]
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
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
