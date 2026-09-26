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

// flowType 'implicit' (NOT pkce) — deliberate choice, do not "upgrade":
// Our users open email links from phone Gmail apps / different browsers.
// PKCE stores its code verifier in the requesting browser's storage, so any
// link opened elsewhere dies with "code verifier not found". Implicit sends
// token_hash links (verifyOtp works cross-browser) and hash sessions that
// supabase-js auto-detects on page load. RLS still enforces all security.
// Revisit only with true SSR (cookie-based verifier) — never for static.
export const supabase = createClient(url, anon, {
  auth: { flowType: 'implicit', autoRefreshToken: true, persistSession: true },
});

export const SITE_URL =
  (import.meta.env.SITE_URL as string) ||
  (typeof location !== 'undefined' ? location.origin : 'http://localhost:4321');
