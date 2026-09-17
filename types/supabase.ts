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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      ai_logs: {
        Row: {
          component_key: string | null
          context: Json
          created_at: string
          error: Json | null
          id: string
          latency_ms: number | null
          model: string
          program_content_id: string | null
          provider: string
          purpose: string
          request: Json
          response: Json
          status: string
          user_id: string
        }
        Insert: {
          component_key?: string | null
          context?: Json
          created_at?: string
          error?: Json | null
          id?: string
          latency_ms?: number | null
          model: string
          program_content_id?: string | null
          provider: string
          purpose: string
          request?: Json
          response?: Json
          status?: string
          user_id: string
        }
        Update: {
          component_key?: string | null
          context?: Json
          created_at?: string
          error?: Json | null
          id?: string
          latency_ms?: number | null
          model?: string
          program_content_id?: string | null
          provider?: string
          purpose?: string
          request?: Json
          response?: Json
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ai_logs_program_content_id_fkey"
            columns: ["program_content_id"]
            isOneToOne: false
            referencedRelation: "program_content"
            referencedColumns: ["id"]
          },
        ]
      }
      discounts: {
        Row: {
          application_type: string
          code: string | null
          created_at: string
          discount_type: string
          ends_at: string | null
          id: string
          metadata: Json
          name: string
          offering_id: string
          starts_at: string | null
          status: string
          updated_at: string
          value: number
        }
        Insert: {
          application_type: string
          code?: string | null
          created_at?: string
          discount_type: string
          ends_at?: string | null
          id?: string
          metadata?: Json
          name: string
          offering_id: string
          starts_at?: string | null
          status?: string
          updated_at?: string
          value: number
        }
        Update: {
          application_type?: string
          code?: string | null
          created_at?: string
          discount_type?: string
          ends_at?: string | null
          id?: string
          metadata?: Json
          name?: string
          offering_id?: string
          starts_at?: string | null
          status?: string
          updated_at?: string
          value?: number
        }
        Relationships: [
          {
            foreignKeyName: "discounts_offering_id_fkey"
            columns: ["offering_id"]
            isOneToOne: false
            referencedRelation: "offerings"
            referencedColumns: ["id"]
          },
        ]
      }
      entitlements: {
        Row: {
          created_at: string
          expires_at: string | null
          id: string
          metadata: Json
          scope: string | null
          source_id: string | null
          source_type: string
          starts_at: string
          status: string
          type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          expires_at?: string | null
          id?: string
          metadata?: Json
          scope?: string | null
          source_id?: string | null
          source_type: string
          starts_at?: string
          status?: string
          type: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          expires_at?: string | null
          id?: string
          metadata?: Json
          scope?: string | null
          source_id?: string | null
          source_type?: string
          starts_at?: string
          status?: string
          type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      offering_prices: {
        Row: {
          access_duration_months: number | null
          billing_interval: string | null
          billing_interval_count: number | null
          billing_type: string
          created_at: string
          currency: string
          id: string
          metadata: Json
          name: string
          offering_id: string
          price: number
          status: string
          updated_at: string
        }
        Insert: {
          access_duration_months?: number | null
          billing_interval?: string | null
          billing_interval_count?: number | null
          billing_type?: string
          created_at?: string
          currency?: string
          id?: string
          metadata?: Json
          name: string
          offering_id: string
          price: number
          status?: string
          updated_at?: string
        }
        Update: {
          access_duration_months?: number | null
          billing_interval?: string | null
          billing_interval_count?: number | null
          billing_type?: string
          created_at?: string
          currency?: string
          id?: string
          metadata?: Json
          name?: string
          offering_id?: string
          price?: number
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "offering_prices_offering_id_fkey"
            columns: ["offering_id"]
            isOneToOne: false
            referencedRelation: "offerings"
            referencedColumns: ["id"]
          },
        ]
      }
      offerings: {
        Row: {
          availability_status: string
          available_from: string | null
          available_until: string | null
          created_at: string
          description: string | null
          id: string
          metadata: Json
          name: string
          slug: string
          type: string
          updated_at: string
        }
        Insert: {
          availability_status?: string
          available_from?: string | null
          available_until?: string | null
          created_at?: string
          description?: string | null
          id?: string
          metadata?: Json
          name: string
          slug: string
          type: string
          updated_at?: string
        }
        Update: {
          availability_status?: string
          available_from?: string | null
          available_until?: string | null
          created_at?: string
          description?: string | null
          id?: string
          metadata?: Json
          name?: string
          slug?: string
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      order_items: {
        Row: {
          created_at: string
          discount: number
          id: string
          metadata: Json
          name: string
          offering_id: string
          offering_price_id: string | null
          order_id: string
          quantity: number
          total_price: number
          unit_price: number
        }
        Insert: {
          created_at?: string
          discount?: number
          id?: string
          metadata?: Json
          name: string
          offering_id: string
          offering_price_id?: string | null
          order_id: string
          quantity?: number
          total_price: number
          unit_price: number
        }
        Update: {
          created_at?: string
          discount?: number
          id?: string
          metadata?: Json
          name?: string
          offering_id?: string
          offering_price_id?: string | null
          order_id?: string
          quantity?: number
          total_price?: number
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_items_offering_id_fkey"
            columns: ["offering_id"]
            isOneToOne: false
            referencedRelation: "offerings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_offering_price_id_fkey"
            columns: ["offering_price_id"]
            isOneToOne: false
            referencedRelation: "offering_prices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          created_at: string
          currency: string
          discount: number
          id: string
          metadata: Json
          status: string
          subtotal: number
          tax: number
          total: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          currency: string
          discount?: number
          id?: string
          metadata?: Json
          status?: string
          subtotal?: number
          tax?: number
          total?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          currency?: string
          discount?: number
          id?: string
          metadata?: Json
          status?: string
          subtotal?: number
          tax?: number
          total?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      program_content: {
        Row: {
          ai_context_keys: Json
          audio_url: string | null
          behavioral_intent: string | null
          component_key: string
          config_version: number
          container_key: string
          container_type: string
          created_at: string
          dependencies: Json
          description: string | null
          id: string
          interaction_type: string | null
          metadata: Json
          mission_key: string
          node_key: string
          program_key: string
          quest_key: string | null
          resources: Json
          role: string
          sort_order: number
          stories: Json
          title: string | null
          updated_at: string
          video_url: string | null
        }
        Insert: {
          ai_context_keys?: Json
          audio_url?: string | null
          behavioral_intent?: string | null
          component_key: string
          config_version?: number
          container_key: string
          container_type: string
          created_at?: string
          dependencies?: Json
          description?: string | null
          id?: string
          interaction_type?: string | null
          metadata?: Json
          mission_key: string
          node_key: string
          program_key: string
          quest_key?: string | null
          resources?: Json
          role: string
          sort_order?: number
          stories?: Json
          title?: string | null
          updated_at?: string
          video_url?: string | null
        }
        Update: {
          ai_context_keys?: Json
          audio_url?: string | null
          behavioral_intent?: string | null
          component_key?: string
          config_version?: number
          container_key?: string
          container_type?: string
          created_at?: string
          dependencies?: Json
          description?: string | null
          id?: string
          interaction_type?: string | null
          metadata?: Json
          mission_key?: string
          node_key?: string
          program_key?: string
          quest_key?: string | null
          resources?: Json
          role?: string
          sort_order?: number
          stories?: Json
          title?: string | null
          updated_at?: string
          video_url?: string | null
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          cancel_at_period_end: boolean
          created_at: string
          current_period_end: string | null
          current_period_start: string | null
          id: string
          metadata: Json
          offering_price_id: string
          provider: string
          provider_subscription_id: string | null
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          cancel_at_period_end?: boolean
          created_at?: string
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          metadata?: Json
          offering_price_id: string
          provider: string
          provider_subscription_id?: string | null
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          cancel_at_period_end?: boolean
          created_at?: string
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          metadata?: Json
          offering_price_id?: string
          provider?: string
          provider_subscription_id?: string | null
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_offering_price_id_fkey"
            columns: ["offering_price_id"]
            isOneToOne: false
            referencedRelation: "offering_prices"
            referencedColumns: ["id"]
          },
        ]
      }
      transactions: {
        Row: {
          amount: number
          created_at: string
          currency: string
          id: string
          metadata: Json
          order_id: string
          provider: string
          provider_transaction_id: string | null
          status: string
          type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          currency: string
          id?: string
          metadata?: Json
          order_id: string
          provider: string
          provider_transaction_id?: string | null
          status: string
          type: string
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          currency?: string
          id?: string
          metadata?: Json
          order_id?: string
          provider?: string
          provider_transaction_id?: string | null
          status?: string
          type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "transactions_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      user_commitments: {
        Row: {
          commitment: string
          completed_at: string | null
          created_at: string
          due_at: string | null
          id: string
          metadata: Json
          reason: string | null
          source_node_id: string | null
          starts_at: string | null
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          commitment: string
          completed_at?: string | null
          created_at?: string
          due_at?: string | null
          id?: string
          metadata?: Json
          reason?: string | null
          source_node_id?: string | null
          starts_at?: string | null
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          commitment?: string
          completed_at?: string | null
          created_at?: string
          due_at?: string | null
          id?: string
          metadata?: Json
          reason?: string | null
          source_node_id?: string | null
          starts_at?: string | null
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_commitments_source_node_id_fkey"
            columns: ["source_node_id"]
            isOneToOne: false
            referencedRelation: "program_content"
            referencedColumns: ["id"]
          },
        ]
      }
      user_contacts: {
        Row: {
          contact_details: Json
          context: string | null
          created_at: string
          id: string
          name: string
          organization: string | null
          relationship: string | null
          role: string | null
          source_node_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          contact_details?: Json
          context?: string | null
          created_at?: string
          id?: string
          name: string
          organization?: string | null
          relationship?: string | null
          role?: string | null
          source_node_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          contact_details?: Json
          context?: string | null
          created_at?: string
          id?: string
          name?: string
          organization?: string | null
          relationship?: string | null
          role?: string | null
          source_node_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_contacts_source_node_id_fkey"
            columns: ["source_node_id"]
            isOneToOne: false
            referencedRelation: "program_content"
            referencedColumns: ["id"]
          },
        ]
      }
      user_content: {
        Row: {
          body: string | null
          content_type: string
          created_at: string
          id: string
          metadata: Json
          status: string
          title: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          body?: string | null
          content_type: string
          created_at?: string
          id?: string
          metadata?: Json
          status?: string
          title?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          body?: string | null
          content_type?: string
          created_at?: string
          id?: string
          metadata?: Json
          status?: string
          title?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_observations: {
        Row: {
          content: Json
          created_at: string
          id: string
          metadata: Json
          observed_at: string | null
          source_node_id: string | null
          title: string | null
          type: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          content?: Json
          created_at?: string
          id?: string
          metadata?: Json
          observed_at?: string | null
          source_node_id?: string | null
          title?: string | null
          type?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: Json
          created_at?: string
          id?: string
          metadata?: Json
          observed_at?: string | null
          source_node_id?: string | null
          title?: string | null
          type?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_observations_source_node_id_fkey"
            columns: ["source_node_id"]
            isOneToOne: false
            referencedRelation: "program_content"
            referencedColumns: ["id"]
          },
        ]
      }
      user_opportunities: {
        Row: {
          created_at: string
          customer: string | null
          description: string | null
          hypothesis: string | null
          id: string
          metadata: Json
          problem: string | null
          source: string | null
          source_node_id: string | null
          status: string
          title: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          customer?: string | null
          description?: string | null
          hypothesis?: string | null
          id?: string
          metadata?: Json
          problem?: string | null
          source?: string | null
          source_node_id?: string | null
          status?: string
          title?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          customer?: string | null
          description?: string | null
          hypothesis?: string | null
          id?: string
          metadata?: Json
          problem?: string | null
          source?: string | null
          source_node_id?: string | null
          status?: string
          title?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_opportunities_source_node_id_fkey"
            columns: ["source_node_id"]
            isOneToOne: false
            referencedRelation: "program_content"
            referencedColumns: ["id"]
          },
        ]
      }
      user_profile: {
        Row: {
          age_group: string | null
          avatar_url: string | null
          capabilities: Json
          city: string | null
          constraints: Json
          country: string | null
          created_at: string
          currency: string | null
          desired_future: Json
          experience: Json
          fears: Json
          gender: string | null
          id: string
          metadata: Json
          mobile_number: string | null
          motivations: Json
          network_context: Json
          perceived_barriers: Json
          quit_conditions: Json
          resources: Json
          updated_at: string
          user_id: string
          username: string | null
          username_key: string | null
        }
        Insert: {
          age_group?: string | null
          avatar_url?: string | null
          capabilities?: Json
          city?: string | null
          constraints?: Json
          country?: string | null
          created_at?: string
          currency?: string | null
          desired_future?: Json
          experience?: Json
          fears?: Json
          gender?: string | null
          id?: string
          metadata?: Json
          mobile_number?: string | null
          motivations?: Json
          network_context?: Json
          perceived_barriers?: Json
          quit_conditions?: Json
          resources?: Json
          updated_at?: string
          user_id: string
          username?: string | null
          username_key?: string | null
        }
        Update: {
          age_group?: string | null
          avatar_url?: string | null
          capabilities?: Json
          city?: string | null
          constraints?: Json
          country?: string | null
          created_at?: string
          currency?: string | null
          desired_future?: Json
          experience?: Json
          fears?: Json
          gender?: string | null
          id?: string
          metadata?: Json
          mobile_number?: string | null
          motivations?: Json
          network_context?: Json
          perceived_barriers?: Json
          quit_conditions?: Json
          resources?: Json
          updated_at?: string
          user_id?: string
          username?: string | null
          username_key?: string | null
        }
        Relationships: []
      }
      user_progress: {
        Row: {
          completed_at: string | null
          created_at: string
          id: string
          payload: Json
          program_content_id: string
          started_at: string | null
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          id?: string
          payload?: Json
          program_content_id: string
          started_at?: string | null
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          id?: string
          payload?: Json
          program_content_id?: string
          started_at?: string | null
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_progress_program_content_id_fkey"
            columns: ["program_content_id"]
            isOneToOne: false
            referencedRelation: "program_content"
            referencedColumns: ["id"]
          },
        ]
      }
      user_projects: {
        Row: {
          created_at: string
          description: string | null
          id: string
          metadata: Json
          name: string
          opportunity_id: string | null
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          metadata?: Json
          name: string
          opportunity_id?: string | null
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          metadata?: Json
          name?: string
          opportunity_id?: string | null
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_projects_opportunity_id_fkey"
            columns: ["opportunity_id"]
            isOneToOne: false
            referencedRelation: "user_opportunities"
            referencedColumns: ["id"]
          },
        ]
      }
      user_tasks: {
        Row: {
          completed_at: string | null
          created_at: string
          description: string | null
          due_at: string | null
          id: string
          metadata: Json
          source_node_id: string | null
          status: string
          task_type: string | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          description?: string | null
          due_at?: string | null
          id?: string
          metadata?: Json
          source_node_id?: string | null
          status?: string
          task_type?: string | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          description?: string | null
          due_at?: string | null
          id?: string
          metadata?: Json
          source_node_id?: string | null
          status?: string
          task_type?: string | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_tasks_source_node_id_fkey"
            columns: ["source_node_id"]
            isOneToOne: false
            referencedRelation: "program_content"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      create_checkout: {
        Args: {
          p_discount_code?: string
          p_offering_slug: string
          p_price_id: string
        }
        Returns: Json
      }
      is_username_available: { Args: { candidate: string }; Returns: boolean }
    }
    Enums: {
      [_ in never]: never
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
