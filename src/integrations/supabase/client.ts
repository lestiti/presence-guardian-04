import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const supabaseUrl = "https://dezcoasxzuqxyaycdtba.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRlemNvYXN4enVxeHlheWNkdGJhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzIyNjU2MTAsImV4cCI6MjA0Nzg0MTYxMH0.dxqiWPvfF2q5StVDwWuP_uuAMdY1PR6_tgA44y88fuc";

export const supabase = createClient<Database>(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  }
});