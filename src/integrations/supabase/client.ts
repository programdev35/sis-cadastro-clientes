// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://uczuyijswhrxhuapcxbj.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVjenV5aWpzd2hyeGh1YXBjeGJqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA2MTA0MDEsImV4cCI6MjA2NjE4NjQwMX0.Vy_634GBL0TcMRoVoK2iQv8UIyUqJkbQUCCAvKCq_Vk";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);