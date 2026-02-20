export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      conversation_participants: {
        Row: {
          conversation_id: string
          id: string
          joined_at: string
          user_id: string
        }
        Insert: {
          conversation_id: string
          id?: string
          joined_at?: string
          user_id: string
        }
        Update: {
          conversation_id?: string
          id?: string
          joined_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "conversation_participants_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      conversations: {
        Row: {
          created_at: string
          id: string
          last_message_at: string | null
          last_message_text: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          last_message_at?: string | null
          last_message_text?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          last_message_at?: string | null
          last_message_text?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      messages: {
        Row: {
          content: string
          conversation_id: string
          created_at: string
          id: string
          read: boolean
          sender_id: string
        }
        Insert: {
          content: string
          conversation_id: string
          created_at?: string
          id?: string
          read?: boolean
          sender_id: string
        }
        Update: {
          content?: string
          conversation_id?: string
          created_at?: string
          id?: string
          read?: boolean
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string
          id: string
          message: string
          metadata: Json | null
          read: boolean
          title: string
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          message: string
          metadata?: Json | null
          read?: boolean
          title: string
          type?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          message?: string
          metadata?: Json | null
          read?: boolean
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          birth_date: string | null
          created_at: string
          full_name: string | null
          id: string
          is_active: boolean
          kyc_status: string
          nationality: string | null
          password_changed_at: string | null
          phone: string | null
          subscription_plan: string
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          birth_date?: string | null
          created_at?: string
          full_name?: string | null
          id: string
          is_active?: boolean
          kyc_status?: string
          nationality?: string | null
          password_changed_at?: string | null
          phone?: string | null
          subscription_plan?: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          birth_date?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          is_active?: boolean
          kyc_status?: string
          nationality?: string | null
          password_changed_at?: string | null
          phone?: string | null
          subscription_plan?: string
          updated_at?: string
        }
        Relationships: []
      }
      properties: {
        Row: {
          address: string | null
          amenities: Json | null
          area: number | null
          bathrooms: number | null
          bedrooms: number | null
          city: string
          commune: string | null
          country: string | null
          created_at: string | null
          currency: string
          description: string | null
          furnished: boolean | null
          id: string
          images: Json | null
          is_premium: boolean | null
          latitude: number | null
          longitude: number | null
          owner_id: string
          price: number
          published_at: string | null
          quartier: string | null
          status: string
          title: string
          transaction_type: string
          type: string
          updated_at: string | null
          verified: boolean | null
        }
        Insert: {
          address?: string | null
          amenities?: Json | null
          area?: number | null
          bathrooms?: number | null
          bedrooms?: number | null
          city: string
          commune?: string | null
          country?: string | null
          created_at?: string | null
          currency?: string
          description?: string | null
          furnished?: boolean | null
          id?: string
          images?: Json | null
          is_premium?: boolean | null
          latitude?: number | null
          longitude?: number | null
          owner_id: string
          price: number
          published_at?: string | null
          quartier?: string | null
          status?: string
          title: string
          transaction_type: string
          type: string
          updated_at?: string | null
          verified?: boolean | null
        }
        Update: {
          address?: string | null
          amenities?: Json | null
          area?: number | null
          bathrooms?: number | null
          bedrooms?: number | null
          city?: string
          commune?: string | null
          country?: string | null
          created_at?: string | null
          currency?: string
          description?: string | null
          furnished?: boolean | null
          id?: string
          images?: Json | null
          is_premium?: boolean | null
          latitude?: number | null
          longitude?: number | null
          owner_id?: string
          price?: number
          published_at?: string | null
          quartier?: string | null
          status?: string
          title?: string
          transaction_type?: string
          type?: string
          updated_at?: string | null
          verified?: boolean | null
        }
        Relationships: []
      }
      rentals: {
        Row: {
          agent_commission_percent: number | null
          agent_id: string | null
          created_at: string | null
          currency: string
          end_date: string | null
          id: string
          owner_id: string
          payment_day_of_month: number | null
          payment_method: string | null
          property_id: string
          rent_amount: number
          start_date: string
          status: string
          tenant_id: string
          updated_at: string | null
        }
        Insert: {
          agent_commission_percent?: number | null
          agent_id?: string | null
          created_at?: string | null
          currency?: string
          end_date?: string | null
          id?: string
          owner_id: string
          payment_day_of_month?: number | null
          payment_method?: string | null
          property_id: string
          rent_amount: number
          start_date: string
          status?: string
          tenant_id: string
          updated_at?: string | null
        }
        Update: {
          agent_commission_percent?: number | null
          agent_id?: string | null
          created_at?: string | null
          currency?: string
          end_date?: string | null
          id?: string
          owner_id?: string
          payment_day_of_month?: number | null
          payment_method?: string | null
          property_id?: string
          rent_amount?: number
          start_date?: string
          status?: string
          tenant_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "rentals_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      transactions: {
        Row: {
          amount: number
          created_at: string
          currency: string
          description: string | null
          id: string
          metadata: Json | null
          payer_id: string
          payment_method: string
          payment_reference: string | null
          receiver_id: string
          rental_id: string | null
          status: string
          type: string
          updated_at: string
        }
        Insert: {
          amount: number
          created_at?: string
          currency?: string
          description?: string | null
          id?: string
          metadata?: Json | null
          payer_id: string
          payment_method?: string
          payment_reference?: string | null
          receiver_id: string
          rental_id?: string | null
          status?: string
          type?: string
          updated_at?: string
        }
        Update: {
          amount?: number
          created_at?: string
          currency?: string
          description?: string | null
          id?: string
          metadata?: Json | null
          payer_id?: string
          payment_method?: string
          payment_reference?: string | null
          receiver_id?: string
          rental_id?: string | null
          status?: string
          type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "transactions_rental_id_fkey"
            columns: ["rental_id"]
            isOneToOne: false
            referencedRelation: "rentals"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      wallets: {
        Row: {
          balance: number
          created_at: string
          currency: string
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          balance?: number
          created_at?: string
          currency?: string
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          balance?: number
          created_at?: string
          currency?: string
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      webhook_events: {
        Row: {
          created_at: string
          djomy_transaction_id: string | null
          event_type: string
          id: string
          payload: Json | null
          processed: boolean
          source: string
        }
        Insert: {
          created_at?: string
          djomy_transaction_id?: string | null
          event_type: string
          id?: string
          payload?: Json | null
          processed?: boolean
          source?: string
        }
        Update: {
          created_at?: string
          djomy_transaction_id?: string | null
          event_type?: string
          id?: string
          payload?: Json | null
          processed?: boolean
          source?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      complete_sandbox_payment: {
        Args: { p_is_success: boolean; p_transaction_id: string }
        Returns: Json
      }
      credit_wallet_atomic: {
        Args: { p_amount: number; p_currency?: string; p_user_id: string }
        Returns: undefined
      }
      get_or_create_conversation: {
        Args: { user_id_1: string; user_id_2: string }
        Returns: string
      }
      get_user_id_by_email: { Args: { email_input: string }; Returns: string }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_conversation_member: {
        Args: { _conversation_id: string; _user_id: string }
        Returns: boolean
      }
      process_rent_payment: {
        Args: {
          p_payment_method?: string
          p_phone_number?: string
          p_rental_id: string
        }
        Returns: Json
      }
      withdraw_funds: {
        Args: {
          p_amount: number
          p_bank_account?: string
          p_method: string
          p_phone_number?: string
        }
        Returns: Json
      }
    }
    Enums: {
      app_role: "locataire" | "proprietaire" | "agent" | "admin"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["locataire", "proprietaire", "agent", "admin"],
    },
  },
} as const
