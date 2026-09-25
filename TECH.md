# EduCo. — Tech Stack (Level 2 — Agent-Ready, Free Startup, No Visa)

## 1. Philosophy
- **Free Start (Now)**: zero cost, no visa, works on 8GB laptop not always on.
- **Paid Scale (Later)**: funded by EduVerse sponsors + paid courses.
- **Auth is CLOUD, not local**: EduID is issued by **Supabase Auth Cloud** (same project for all apps). No local user store. Works even when your 8GB laptop is off — SSO via Supabase JWT + HttpOnly cookie on `*.pages.dev`.

## 2. Stack — Free Start (Locked)
- **Frontend**: Astro 4.12+ (static, `output: static`) — i18n routing `/en` default + `/ar`. No SSR.
- **Hosting**: Cloudflare Pages (free) — unlimited bandwidth, 500 builds/mo, `*.pages.dev`. Not Vercel (100GB cap).
- **Auth & DB**: **Supabase Auth Cloud** (free tier: 50k MAU, 500MB DB, 1GB storage) — **CLOUD, not local**
  - Providers: **Email+Password + Google only**. Facebook removed.
  - Email confirmation via Supabase Cloud templates (free).
  - Reset link 1h expiry.
- **Env**: `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SITE_URL` (e.g., `https://educo.pages.dev`). No secrets committed.

## 3. Architecture
```
[Browser] → Cloudflare Pages (Astro static, 100% edge cached except /apps)
   ├─ /login, /signup, /verify, /forgot, /reset → supabase-js directly (PKCE, HttpOnly cookie handled by Supabase)
   └─ /apps (private) → middleware checks supabase.auth.getUser() → shows EduID + 4 deep-links ?token=
Children verify via `supabase.auth.getUser(token)` — single EduID JWT, SSO.
```

## 4. Supabase Setup (Exact Steps for Agent)

### 4.1 Project
1. Create Supabase project (free) → copy `SUPABASE_URL` + `anon` key.
2. Auth → Providers → enable **Email** (confirm email ON) + **Google** (add Google Cloud OAuth Client ID/Secret). Disable others.

### 4.2 SQL — Run in Supabase SQL Editor
```sql
-- Profiles table: one row per EduID user, shared across apps
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  display_name text,
  locale text default 'en' check (locale in ('en','ar')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Keep updated_at fresh
create or replace function public.handle_updated_at() returns trigger as $$
begin new.updated_at = now(); return new; end; $$ language plpgsql;
drop trigger if exists trg_profiles_updated_at on public.profiles;
create trigger trg_profiles_updated_at before update on public.profiles
  for each row execute function public.handle_updated_at();

-- Auto-create profile on signup
create or replace function public.handle_new_user() returns trigger as $$
begin
  insert into public.profiles (id, email) values (new.id, new.email);
  return new;
end; $$ language plpgsql security definer;
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

-- Enable RLS
alter table public.profiles enable row level security;

-- Policies: user can read/update only own row
drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own" on public.profiles
  for select using (auth.uid() = id);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id) with check (auth.uid() = id);

-- No insert policy needed (trigger creates row as definer); no delete.
```

### 4.3 RLS Verification (Agent must run)
```sql
-- As anon without auth, should return 0 rows:
select * from public.profiles;
-- As authed user, should return 1 row:
select * from public.profiles where id = auth.uid();
```

## 5. Auth Flows — Code Contracts

### 5.1 supabase client (`src/lib/supabase.ts`)
```ts
import { createClient } from '@supabase/supabase-js';
export const supabase = createClient(
  import.meta.env.SUPABASE_URL,
  import.meta.env.SUPABASE_ANON_KEY,
  { auth: { flowType: 'pkce', autoRefreshToken: true, persistSession: true } }
);
```

### 5.2 Signup
```ts
const { data, error } = await supabase.auth.signUp({ email, password, options:{ emailRedirectTo: `${SITE_URL}/verify` } });
// success: error == null, data.user.identities empty until confirm
// duplicate: error.message includes "already registered"
// weak password: error.message includes "at least 8"
// UI: show "Check your inbox" + [Resend] → supabase.auth.resend({type:'signup', email})
```

### 5.3 Login
```ts
const { data, error } = await supabase.auth.signInWithPassword({ email, password });
// unverified: error.message includes "Email not confirmed" → show resend
// wrong: "Invalid login credentials"
```

### 5.4 Google
```ts
await supabase.auth.signInWithOAuth({ provider:'google', options:{ redirectTo: `${SITE_URL}/apps` } });
```

### 5.5 Verify (`/verify?code=...` or `?token_hash=...&type=signup`)
```ts
// Astro /verify.astro on mount:
const params = new URLSearchParams(location.search);
const code = params.get('code');
if (code) { const { error } = await supabase.auth.exchangeCodeForSession(code); }
// else token_hash flow: supabase.auth.verifyOtp({token_hash, type:'signup'})
// Show: success → redirect /apps in 2s | expired → [Resend] | invalid → error
```

### 5.6 Forgot/Reset
```ts
// /forgot
await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${SITE_URL}/reset` });
// /reset (user arrives with recovery token in hash)
const newPassword = form.password;
const { error } = await supabase.auth.updateUser({ password: newPassword });
// expired: "Token has expired" → link back to /forgot
```

### 5.7 Private route guard (`/apps` middleware)
```ts
const { data: { user } } = await supabase.auth.getUser();
if (!user) return Astro.redirect('/login');
if (!user.email_confirmed_at) return Astro.redirect('/verify?reason=unconfirmed');
```

## 6. i18n (Locked)
- `src/i18n/en.json` and `ar.json` with keys: `hero.title`, `hero.sub`, `apps.verse.title` etc. (exact copy from PLAN.md:5).
- `src/middleware.ts` reads `localStorage:locale` or `Accept-Language` fallback EN, sets `<html lang dir>`. Pages are `/en/*` and `/ar/*` via `src/pages/[locale]/...` or Astro i18n routing.

## 7. API / No Custom Backend
- **No custom API in Phase 0** — all auth is `supabase-js` directly. This is intentional for free + no visa.
- Future `/api/exchange-token` for children SSO is stubbed but not required now; children call `supabase.auth.getUser()` same project.

## 8. Env Example (`G:\EduCo\.env.example` — Agent must create)
```
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_ANON_KEY=eyJ...
SITE_URL=https://educo.pages.dev
# For local dev:
# SITE_URL=http://localhost:4321
```

## 9. Security Checklist (Agent must satisfy)
- [ ] RLS enabled and policies as in §4.2
- [ ] No `service_role` key in frontend
- [ ] PKCE flow, HttpOnly cookie via Supabase (not manual JWT storage)
- [ ] Rate limit resend/forgot to 4/hour (Supabase default + UI disable button 60s)
- [ ] No Facebook provider in code or dashboard

## 10. Limits (Free Tier)
- Pages 25MB/asset, Supabase 50k MAU/500MB, email 4/hour/user. Build must stay under.

## 11. Dev on 8GB Laptop
- `npm run dev` ~300MB. No Docker. `npm run build` must pass before deploy. No always-on needed.

## 12. Paid Scale (Later)
- Custom domain, Cloudflare DNS, Supabase Pro/Keycloak, Resend for email.

## 13. Verification Commands (Agent)
```bash
npm i
npm run build   # must pass
# Manual QA per PLAN.md:11
wrangler pages deploy dist
```

## 14. Non-Goals
- No vector DB, no LLM, no course logic — those belong to Verse/Chat/Rafiq/Agent.
