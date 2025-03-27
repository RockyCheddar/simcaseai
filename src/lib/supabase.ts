import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          created_at: string;
          role: string;
          institution: string | null;
        };
        Insert: {
          id: string;
          email: string;
          created_at?: string;
          role?: string;
          institution?: string | null;
        };
        Update: {
          id?: string;
          email?: string;
          created_at?: string;
          role?: string;
          institution?: string | null;
        };
      };
      cases: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          description: string;
          learning_objectives: string[];
          created_at: string;
          updated_at: string;
          status: string;
          template_id: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          description: string;
          learning_objectives: string[];
          created_at?: string;
          updated_at?: string;
          status?: string;
          template_id?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          description?: string;
          learning_objectives?: string[];
          created_at?: string;
          updated_at?: string;
          status?: string;
          template_id?: string | null;
        };
      };
      templates: {
        Row: {
          id: string;
          title: string;
          description: string;
          specialty: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description: string;
          specialty: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string;
          specialty?: string;
          created_at?: string;
        };
      };
    };
  };
}; 