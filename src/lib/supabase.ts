
import { createClient } from '@supabase/supabase-js';

// Use the provided Supabase URL and anon key
const supabaseUrl = 'https://fkuzdgnidoiksdrulcav.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZrdXpkZ25pZG9pa3NkcnVsY2F2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM5NDQzNjEsImV4cCI6MjA1OTUyMDM2MX0.EgKhYZAJGnJfu9Eq5NQRAO7e6lHsUCc5FBy7oKv0Am0';

// Make sure URL and key are defined before creating client
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
