import { createClient } from '@supabase/supabase-js';

// NOTE: Auth is CLOUD (Supabase), not local.
// Env vars are inlined at build time, but Pages builds have proven flaky
// at injecting them — so safe public fallbacks are embedded. The anon key
// is public by design (RLS protects the data), never commit service_role.
const url =
  (import.meta.env.SUPABASE_URL as string) ||
  'https://qmvhbptvpdskyzbftabc.supabase.co';
const anon =
  (import.meta.env.SUPABASE_ANON_KEY as string) ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFtdmhicHR2cGRza3l6YmZ0YWJjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk4NzcwMjMsImV4cCI6MjEwNTQ1MzAyM30.imv7tJGQSuYBMca_XG5rJj4dJHDFZ9BQkGr85q4GtMw';

export const supabase = createClient(url, anon, {
  auth: { flowType: 'pkce', autoRefreshToken: true, persistSession: true },
});

export const SITE_URL =
  (import.meta.env.SITE_URL as string) ||
  (typeof location !== 'undefined' ? location.origin : 'http://localhost:4321');
