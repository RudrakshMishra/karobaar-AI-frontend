import { createClient } from "@supabase/supabase-js";

/*
  ===========================================
  SUPABASE POSTGRESQL SCHEMA REQUIREMENT
  ===========================================
  To fully unlock this backend, run the following DDL in your Supabase SQL editor:

  CREATE TABLE public.trades (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      asset VARCHAR(255) NOT NULL,
      amount NUMERIC NOT NULL,
      usd_price NUMERIC NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  );

  CREATE TABLE public.analytics (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      month VARCHAR(50) NOT NULL,
      value_1 NUMERIC,
      value_2 NUMERIC
  );
*/

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://mock.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.mock";

// Initialize the Supabase client.
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function fetchLiveDashboardMetrics() {
  // If no real ENV vars, gracefully return fallback so the frontend doesn't crash 500
  if (supabaseUrl.includes('mock.supabase')) {
    return {
      success: true,
      data: { revenue: 284500, orders: 1847 },
      fallbackMode: true
    };
  }

  // Real Database Query!
  const { data, error } = await supabase
    .from('analytics')
    .select('value_1, value_2')
    .limit(30);

  if (error) {
    console.error("Supabase Query Error:", error);
    return { success: false, error };
  }

  return { success: true, data };
}
