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
      academy_documents: {
        Row: {
          created_at: string
          doc_type: string
          file_name: string
          file_path: string
          id: string
          mime_type: string | null
          reviewer_note: string | null
          size_bytes: number
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          doc_type: string
          file_name: string
          file_path: string
          id?: string
          mime_type?: string | null
          reviewer_note?: string | null
          size_bytes?: number
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          doc_type?: string
          file_name?: string
          file_path?: string
          id?: string
          mime_type?: string | null
          reviewer_note?: string | null
          size_bytes?: number
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      academy_payments: {
        Row: {
          amount_ngn: number | null
          application_reference: string | null
          created_at: string
          id: string
          provider: string
          provider_reference: string | null
          purpose: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          amount_ngn?: number | null
          application_reference?: string | null
          created_at?: string
          id?: string
          provider?: string
          provider_reference?: string | null
          purpose: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          amount_ngn?: number | null
          application_reference?: string | null
          created_at?: string
          id?: string
          provider?: string
          provider_reference?: string | null
          purpose?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      academy_profiles: {
        Row: {
          city: string | null
          consent_at: string | null
          country: string | null
          created_at: string
          date_of_birth: string | null
          first_name: string
          gender: string | null
          interest: string | null
          last_name: string
          middle_name: string | null
          nationality: string | null
          occupation: string | null
          organisation: string | null
          phone: string | null
          qualification: string | null
          state: string | null
          student_id: string
          updated_at: string
          user_id: string
          years_experience: number | null
        }
        Insert: {
          city?: string | null
          consent_at?: string | null
          country?: string | null
          created_at?: string
          date_of_birth?: string | null
          first_name?: string
          gender?: string | null
          interest?: string | null
          last_name?: string
          middle_name?: string | null
          nationality?: string | null
          occupation?: string | null
          organisation?: string | null
          phone?: string | null
          qualification?: string | null
          state?: string | null
          student_id?: string
          updated_at?: string
          user_id: string
          years_experience?: number | null
        }
        Update: {
          city?: string | null
          consent_at?: string | null
          country?: string | null
          created_at?: string
          date_of_birth?: string | null
          first_name?: string
          gender?: string | null
          interest?: string | null
          last_name?: string
          middle_name?: string | null
          nationality?: string | null
          occupation?: string | null
          organisation?: string | null
          phone?: string | null
          qualification?: string | null
          state?: string | null
          student_id?: string
          updated_at?: string
          user_id?: string
          years_experience?: number | null
        }
        Relationships: []
      }
      admin_bootstrap: {
        Row: {
          attempts: number
          code_hash: string
          id: number
          used_at: string | null
          used_by: string | null
        }
        Insert: {
          attempts?: number
          code_hash: string
          id?: number
          used_at?: string | null
          used_by?: string | null
        }
        Update: {
          attempts?: number
          code_hash?: string
          id?: number
          used_at?: string | null
          used_by?: string | null
        }
        Relationships: []
      }
      admin_invitations: {
        Row: {
          accepted_at: string | null
          accepted_by: string | null
          created_at: string
          email: string
          expires_at: string
          id: string
          invited_by: string | null
          revoked_at: string | null
          role: Database["public"]["Enums"]["app_role"]
          token_hash: string
        }
        Insert: {
          accepted_at?: string | null
          accepted_by?: string | null
          created_at?: string
          email: string
          expires_at?: string
          id?: string
          invited_by?: string | null
          revoked_at?: string | null
          role: Database["public"]["Enums"]["app_role"]
          token_hash: string
        }
        Update: {
          accepted_at?: string | null
          accepted_by?: string | null
          created_at?: string
          email?: string
          expires_at?: string
          id?: string
          invited_by?: string | null
          revoked_at?: string | null
          role?: Database["public"]["Enums"]["app_role"]
          token_hash?: string
        }
        Relationships: []
      }
      admin_permissions: {
        Row: {
          created_at: string
          granted_by: string | null
          permission: string
          user_id: string
        }
        Insert: {
          created_at?: string
          granted_by?: string | null
          permission: string
          user_id: string
        }
        Update: {
          created_at?: string
          granted_by?: string | null
          permission?: string
          user_id?: string
        }
        Relationships: []
      }
      audit_log: {
        Row: {
          action: string
          actor_email: string | null
          actor_id: string | null
          created_at: string
          entity_id: string | null
          entity_type: string
          id: string
          new_value: Json | null
          old_value: Json | null
        }
        Insert: {
          action: string
          actor_email?: string | null
          actor_id?: string | null
          created_at?: string
          entity_id?: string | null
          entity_type: string
          id?: string
          new_value?: Json | null
          old_value?: Json | null
        }
        Update: {
          action?: string
          actor_email?: string | null
          actor_id?: string | null
          created_at?: string
          entity_id?: string | null
          entity_type?: string
          id?: string
          new_value?: Json | null
          old_value?: Json | null
        }
        Relationships: []
      }
      certification_employers: {
        Row: {
          certification_code: string
          created_at: string
          employer_name: string
          id: string
          recognised_on: string
        }
        Insert: {
          certification_code: string
          created_at?: string
          employer_name: string
          id?: string
          recognised_on?: string
        }
        Update: {
          certification_code?: string
          created_at?: string
          employer_name?: string
          id?: string
          recognised_on?: string
        }
        Relationships: []
      }
      certification_settings: {
        Row: {
          code: string
          fee_approved: boolean
          fee_ngn: number | null
          updated_at: string
        }
        Insert: {
          code: string
          fee_approved?: boolean
          fee_ngn?: number | null
          updated_at?: string
        }
        Update: {
          code?: string
          fee_approved?: boolean
          fee_ngn?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      electricity_agents: {
        Row: {
          business_address: string | null
          business_name: string
          city_lga: string | null
          commission_rate: number
          commission_type: string
          created_at: string
          id: string
          state: string | null
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          business_address?: string | null
          business_name: string
          city_lga?: string | null
          commission_rate?: number
          commission_type?: string
          created_at?: string
          id?: string
          state?: string | null
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          business_address?: string | null
          business_name?: string
          city_lga?: string | null
          commission_rate?: number
          commission_type?: string
          created_at?: string
          id?: string
          state?: string | null
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      electricity_api_connector_logs: {
        Row: {
          connector_id: string | null
          created_at: string
          error_message: string | null
          id: string
          request_payload: Json
          request_type: string
          response_payload: Json
          response_status: string | null
          transaction_id: string | null
        }
        Insert: {
          connector_id?: string | null
          created_at?: string
          error_message?: string | null
          id?: string
          request_payload?: Json
          request_type: string
          response_payload?: Json
          response_status?: string | null
          transaction_id?: string | null
        }
        Update: {
          connector_id?: string | null
          created_at?: string
          error_message?: string | null
          id?: string
          request_payload?: Json
          request_type?: string
          response_payload?: Json
          response_status?: string | null
          transaction_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "electricity_api_connector_logs_connector_id_fkey"
            columns: ["connector_id"]
            isOneToOne: false
            referencedRelation: "electricity_api_connectors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "electricity_api_connector_logs_transaction_id_fkey"
            columns: ["transaction_id"]
            isOneToOne: false
            referencedRelation: "electricity_transactions"
            referencedColumns: ["id"]
          },
        ]
      }
      electricity_api_connectors: {
        Row: {
          auth_type: string | null
          base_url: string | null
          contact_person: string | null
          created_at: string
          fallback_provider: string | null
          id: string
          live_status: string
          priority_order: number
          provider_name: string
          provider_type: string
          sandbox_status: string
          support_email: string | null
          support_phone: string | null
          supported_discos: string[]
          updated_at: string
        }
        Insert: {
          auth_type?: string | null
          base_url?: string | null
          contact_person?: string | null
          created_at?: string
          fallback_provider?: string | null
          id?: string
          live_status?: string
          priority_order?: number
          provider_name: string
          provider_type: string
          sandbox_status?: string
          support_email?: string | null
          support_phone?: string | null
          supported_discos?: string[]
          updated_at?: string
        }
        Update: {
          auth_type?: string | null
          base_url?: string | null
          contact_person?: string | null
          created_at?: string
          fallback_provider?: string | null
          id?: string
          live_status?: string
          priority_order?: number
          provider_name?: string
          provider_type?: string
          sandbox_status?: string
          support_email?: string | null
          support_phone?: string | null
          supported_discos?: string[]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "electricity_api_connectors_fallback_provider_fkey"
            columns: ["fallback_provider"]
            isOneToOne: false
            referencedRelation: "electricity_api_connectors"
            referencedColumns: ["id"]
          },
        ]
      }
      electricity_corporate_accounts: {
        Row: {
          address: string | null
          admin_notes: string | null
          contact_person: string
          created_at: string
          email: string
          id: string
          main_disco: string | null
          monthly_electricity_spend_ngn: number | null
          number_of_meters: number
          organisation_name: string
          phone: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          address?: string | null
          admin_notes?: string | null
          contact_person: string
          created_at?: string
          email: string
          id?: string
          main_disco?: string | null
          monthly_electricity_spend_ngn?: number | null
          number_of_meters?: number
          organisation_name: string
          phone: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          address?: string | null
          admin_notes?: string | null
          contact_person?: string
          created_at?: string
          email?: string
          id?: string
          main_disco?: string | null
          monthly_electricity_spend_ngn?: number | null
          number_of_meters?: number
          organisation_name?: string
          phone?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      electricity_corporate_meters: {
        Row: {
          corporate_account_id: string
          created_at: string
          department: string | null
          disco: string
          id: string
          location_name: string | null
          meter_number: string
          meter_type: string
          status: string
        }
        Insert: {
          corporate_account_id: string
          created_at?: string
          department?: string | null
          disco: string
          id?: string
          location_name?: string | null
          meter_number: string
          meter_type: string
          status?: string
        }
        Update: {
          corporate_account_id?: string
          created_at?: string
          department?: string | null
          disco?: string
          id?: string
          location_name?: string | null
          meter_number?: string
          meter_type?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "electricity_corporate_meters_corporate_account_id_fkey"
            columns: ["corporate_account_id"]
            isOneToOne: false
            referencedRelation: "electricity_corporate_accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      electricity_disco_api_routes: {
        Row: {
          backup_connector_id: string | null
          created_at: string
          disco_code: string
          disco_name: string
          id: string
          preferred_connector_id: string | null
          status: string
          supports_meter_verification: boolean
          supports_postpaid: boolean
          supports_prepaid: boolean
          updated_at: string
        }
        Insert: {
          backup_connector_id?: string | null
          created_at?: string
          disco_code: string
          disco_name: string
          id?: string
          preferred_connector_id?: string | null
          status?: string
          supports_meter_verification?: boolean
          supports_postpaid?: boolean
          supports_prepaid?: boolean
          updated_at?: string
        }
        Update: {
          backup_connector_id?: string | null
          created_at?: string
          disco_code?: string
          disco_name?: string
          id?: string
          preferred_connector_id?: string | null
          status?: string
          supports_meter_verification?: boolean
          supports_postpaid?: boolean
          supports_prepaid?: boolean
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "electricity_disco_api_routes_backup_connector_id_fkey"
            columns: ["backup_connector_id"]
            isOneToOne: false
            referencedRelation: "electricity_api_connectors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "electricity_disco_api_routes_preferred_connector_id_fkey"
            columns: ["preferred_connector_id"]
            isOneToOne: false
            referencedRelation: "electricity_api_connectors"
            referencedColumns: ["id"]
          },
        ]
      }
      electricity_meter_verification_logs: {
        Row: {
          api_provider: string
          created_at: string
          customer_address: string | null
          customer_name: string
          disco: string
          error_message: string | null
          id: string
          meter_number: string
          meter_type: string
          minimum_amount_ngn: number
          tariff_class: string | null
          user_id: string
          verification_status: string
        }
        Insert: {
          api_provider?: string
          created_at?: string
          customer_address?: string | null
          customer_name: string
          disco: string
          error_message?: string | null
          id?: string
          meter_number: string
          meter_type: string
          minimum_amount_ngn?: number
          tariff_class?: string | null
          user_id: string
          verification_status?: string
        }
        Update: {
          api_provider?: string
          created_at?: string
          customer_address?: string | null
          customer_name?: string
          disco?: string
          error_message?: string | null
          id?: string
          meter_number?: string
          meter_type?: string
          minimum_amount_ngn?: number
          tariff_class?: string | null
          user_id?: string
          verification_status?: string
        }
        Relationships: []
      }
      electricity_payment_logs: {
        Row: {
          amount_ngn: number
          created_at: string
          error_message: string | null
          id: string
          payment_reference: string
          payment_status: string
          provider_name: string
          response_payload: Json
          transaction_id: string | null
        }
        Insert: {
          amount_ngn?: number
          created_at?: string
          error_message?: string | null
          id?: string
          payment_reference: string
          payment_status?: string
          provider_name?: string
          response_payload?: Json
          transaction_id?: string | null
        }
        Update: {
          amount_ngn?: number
          created_at?: string
          error_message?: string | null
          id?: string
          payment_reference?: string
          payment_status?: string
          provider_name?: string
          response_payload?: Json
          transaction_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "electricity_payment_logs_transaction_id_fkey"
            columns: ["transaction_id"]
            isOneToOne: false
            referencedRelation: "electricity_transactions"
            referencedColumns: ["id"]
          },
        ]
      }
      electricity_payment_providers: {
        Row: {
          created_at: string
          id: string
          provider_name: string
          provider_type: string
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          provider_name: string
          provider_type: string
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          provider_name?: string
          provider_type?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      electricity_platform_settings: {
        Row: {
          convenience_fee_ngn: number
          id: number
          live_mode_enabled: boolean
          mode: string
          updated_at: string
        }
        Insert: {
          convenience_fee_ngn?: number
          id?: number
          live_mode_enabled?: boolean
          mode?: string
          updated_at?: string
        }
        Update: {
          convenience_fee_ngn?: number
          id?: number
          live_mode_enabled?: boolean
          mode?: string
          updated_at?: string
        }
        Relationships: []
      }
      electricity_saved_meters: {
        Row: {
          created_at: string
          disco: string
          id: string
          label: string
          meter_number: string
          meter_type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          disco: string
          id?: string
          label: string
          meter_number: string
          meter_type: string
          user_id: string
        }
        Update: {
          created_at?: string
          disco?: string
          id?: string
          label?: string
          meter_number?: string
          meter_type?: string
          user_id?: string
        }
        Relationships: []
      }
      electricity_support_tickets: {
        Row: {
          admin_notes: string | null
          assigned_to: string | null
          created_at: string
          id: string
          issue_type: string
          message: string
          status: string
          transaction_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          admin_notes?: string | null
          assigned_to?: string | null
          created_at?: string
          id?: string
          issue_type: string
          message: string
          status?: string
          transaction_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          admin_notes?: string | null
          assigned_to?: string | null
          created_at?: string
          id?: string
          issue_type?: string
          message?: string
          status?: string
          transaction_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "electricity_support_tickets_transaction_id_fkey"
            columns: ["transaction_id"]
            isOneToOne: false
            referencedRelation: "electricity_transactions"
            referencedColumns: ["id"]
          },
        ]
      }
      electricity_token_requests: {
        Row: {
          admin_notes: string | null
          amount_ngn: number
          assigned_to: string | null
          city_lga: string
          consent_at: string
          created_at: string
          disco: string
          email: string
          full_name: string
          id: string
          meter_number: string
          meter_type: string
          phone: string
          preferred_contact_method: string
          request_reference: string
          state: string
          status: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          admin_notes?: string | null
          amount_ngn: number
          assigned_to?: string | null
          city_lga: string
          consent_at?: string
          created_at?: string
          disco: string
          email: string
          full_name: string
          id?: string
          meter_number: string
          meter_type: string
          phone: string
          preferred_contact_method: string
          request_reference: string
          state: string
          status?: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          admin_notes?: string | null
          amount_ngn?: number
          assigned_to?: string | null
          city_lga?: string
          consent_at?: string
          created_at?: string
          disco?: string
          email?: string
          full_name?: string
          id?: string
          meter_number?: string
          meter_type?: string
          phone?: string
          preferred_contact_method?: string
          request_reference?: string
          state?: string
          status?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      electricity_transactions: {
        Row: {
          amount_ngn: number
          api_provider: string
          api_reference: string | null
          convenience_fee_ngn: number
          created_at: string
          customer_name: string
          disco: string
          id: string
          meter_number: string
          meter_type: string
          mode: string
          payment_method: string
          payment_status: string
          token_status: string
          token_value: string | null
          total_amount_ngn: number
          transaction_reference: string
          units: number | null
          user_id: string
        }
        Insert: {
          amount_ngn: number
          api_provider?: string
          api_reference?: string | null
          convenience_fee_ngn?: number
          created_at?: string
          customer_name: string
          disco: string
          id?: string
          meter_number: string
          meter_type: string
          mode?: string
          payment_method: string
          payment_status?: string
          token_status: string
          token_value?: string | null
          total_amount_ngn: number
          transaction_reference: string
          units?: number | null
          user_id: string
        }
        Update: {
          amount_ngn?: number
          api_provider?: string
          api_reference?: string | null
          convenience_fee_ngn?: number
          created_at?: string
          customer_name?: string
          disco?: string
          id?: string
          meter_number?: string
          meter_type?: string
          mode?: string
          payment_method?: string
          payment_status?: string
          token_status?: string
          token_value?: string | null
          total_amount_ngn?: number
          transaction_reference?: string
          units?: number | null
          user_id?: string
        }
        Relationships: []
      }
      electricity_user_roles: {
        Row: {
          created_at: string
          id: string
          role: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      electricity_wallet_transactions: {
        Row: {
          amount_ngn: number
          created_at: string
          id: string
          reference: string
          status: string
          transaction_type: string
          wallet_id: string
        }
        Insert: {
          amount_ngn: number
          created_at?: string
          id?: string
          reference: string
          status?: string
          transaction_type: string
          wallet_id: string
        }
        Update: {
          amount_ngn?: number
          created_at?: string
          id?: string
          reference?: string
          status?: string
          transaction_type?: string
          wallet_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "electricity_wallet_transactions_wallet_id_fkey"
            columns: ["wallet_id"]
            isOneToOne: false
            referencedRelation: "electricity_wallets"
            referencedColumns: ["id"]
          },
        ]
      }
      electricity_wallets: {
        Row: {
          balance_ngn: number
          created_at: string
          id: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          balance_ngn?: number
          created_at?: string
          id?: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          balance_ngn?: number
          created_at?: string
          id?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          account_type: string
          company_name: string | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          phone: string | null
          updated_at: string
        }
        Insert: {
          account_type?: string
          company_name?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          phone?: string | null
          updated_at?: string
        }
        Update: {
          account_type?: string
          company_name?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      service_requests: {
        Row: {
          company_name: string | null
          contact_email: string
          contact_name: string
          contact_phone: string | null
          created_at: string
          delete_reason: string | null
          deleted_at: string | null
          deleted_by: string | null
          details: Json
          id: string
          is_test: boolean
          location: string | null
          reference: string
          request_type: string
          service_name: string
          status: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          company_name?: string | null
          contact_email: string
          contact_name: string
          contact_phone?: string | null
          created_at?: string
          delete_reason?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          details?: Json
          id?: string
          is_test?: boolean
          location?: string | null
          reference?: string
          request_type: string
          service_name: string
          status?: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          company_name?: string | null
          contact_email?: string
          contact_name?: string
          contact_phone?: string | null
          created_at?: string
          delete_reason?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          details?: Json
          id?: string
          is_test?: boolean
          location?: string | null
          reference?: string
          request_type?: string
          service_name?: string
          status?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      service_statuses: {
        Row: {
          label: string
          path: string
          public_note: string | null
          slug: string
          sort_order: number
          status: string
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          label: string
          path: string
          public_note?: string | null
          slug: string
          sort_order?: number
          status?: string
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          label?: string
          path?: string
          public_note?: string | null
          slug?: string
          sort_order?: number
          status?: string
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      site_notices: {
        Row: {
          active: boolean
          id: number
          link_label: string | null
          link_url: string | null
          message: string
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          active?: boolean
          id?: number
          link_label?: string | null
          link_url?: string | null
          message?: string
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          active?: boolean
          id?: number
          link_label?: string | null
          link_url?: string | null
          message?: string
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      sophia_messages: {
        Row: {
          created_at: string
          id: string
          message: Json
          message_id: string
          role: string
          thread_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          message: Json
          message_id: string
          role: string
          thread_id: string
        }
        Update: {
          created_at?: string
          id?: string
          message?: Json
          message_id?: string
          role?: string
          thread_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "sophia_messages_thread_id_fkey"
            columns: ["thread_id"]
            isOneToOne: false
            referencedRelation: "sophia_threads"
            referencedColumns: ["id"]
          },
        ]
      }
      sophia_threads: {
        Row: {
          created_at: string
          id: string
          title: string
          updated_at: string
          user_id: string | null
          visitor_token: string
        }
        Insert: {
          created_at?: string
          id?: string
          title?: string
          updated_at?: string
          user_id?: string | null
          visitor_token: string
        }
        Update: {
          created_at?: string
          id?: string
          title?: string
          updated_at?: string
          user_id?: string | null
          visitor_token?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      accept_admin_invitation: { Args: { p_token: string }; Returns: string }
      archive_service_request: {
        Args: { p_id: string; p_reason?: string }
        Returns: undefined
      }
      claim_first_admin: { Args: { p_code: string }; Returns: string }
      create_admin_invitation: {
        Args: {
          p_email: string
          p_role: Database["public"]["Enums"]["app_role"]
        }
        Returns: string
      }
      first_admin_available: { Args: never; Returns: boolean }
      generate_request_reference: { Args: never; Returns: string }
      has_permission: {
        Args: { _permission: string; _user_id: string }
        Returns: boolean
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      list_team_members: {
        Args: never
        Returns: {
          email: string
          permissions: string[]
          role: string
          user_id: string
        }[]
      }
      restore_service_request: { Args: { p_id: string }; Returns: undefined }
      revoke_admin_invitation: { Args: { p_id: string }; Returns: undefined }
      run_electricity_sandbox_transaction: {
        Args: {
          p_amount_ngn: number
          p_customer_name: string
          p_disco: string
          p_meter_number: string
          p_meter_type: string
          p_payment_method: string
        }
        Returns: Json
      }
      set_admin_permission: {
        Args: { p_granted: boolean; p_permission: string; p_user_id: string }
        Returns: undefined
      }
      submit_electricity_token_request: {
        Args: {
          p_amount_ngn: number
          p_city_lga: string
          p_consent: boolean
          p_disco: string
          p_email: string
          p_full_name: string
          p_meter_number: string
          p_meter_type: string
          p_phone: string
          p_preferred_contact_method: string
          p_state: string
        }
        Returns: string
      }
      submit_service_request: {
        Args: {
          p_company_name?: string
          p_contact_email: string
          p_contact_name: string
          p_contact_phone?: string
          p_details?: Json
          p_location?: string
          p_request_type: string
          p_service_name: string
        }
        Returns: string
      }
      verify_electricity_meter_sandbox: {
        Args: { p_disco: string; p_meter_number: string; p_meter_type: string }
        Returns: Json
      }
    }
    Enums: {
      app_role: "admin" | "staff"
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
    Enums: {
      app_role: ["admin", "staff"],
    },
  },
} as const
