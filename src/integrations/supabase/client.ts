// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://eggkustytdsywxjccuiw.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVnZ2t1c3R5dGRzeXd4amNjdWl3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ5ODE1MTMsImV4cCI6MjA1MDU1NzUxM30.eLKNZz4hJg3Lz992QKE9yO90G4abMXGYk6ZAI_d61bo";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);