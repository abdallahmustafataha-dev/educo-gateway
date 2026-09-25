# EduCo. — Parent Gateway PLAN (Level 2 — Agent-Ready)

> Informational website that introduces the company, its ambition, and its apps. Single EduID unlocks everything.

## 1. Role
- **Parent company** for all Edu* products. The SDXC volume itself is labeled `EduCo.` (`G:\` exFAT 64GB, 64GB total).
- **Gateway**: informational + authentication. No courses or AI inference here — that lives in children apps.
- **Identity provider**: issues a single **EduID (JWT)** used for SSO across EduVerse, EduChat, EduRafiq, EduAgent. Sign in once → auto-signed in everywhere.

## 2. Audience
- Egyptian students (primary), parents, sponsors, course creators. 14yo founder constraint → zero-cost, no-visa, 8GB laptop not always on.

## 3. Site Purpose (Informational)
1. **Who we are**: Egyptian startup building an ecosystem for the Egyptian student.
2. **Ambition**: Serve **1M concurrent users in the same second** on EduVerse; become the top revenue driver via sponsors + paid courses; bring open-source AI to curriculum and to Islamic learning without hallucinations.
3. **Apps**: showcase 4 children with clear CTAs.

## 4. Sitemap (Bilingual, EN default)
| Route | Purpose | Auth |
|-------|---------|------|
| `/` | Landing: `Hero → About EduCo. → Ambition → Apps (4 cards) → EduID Explainer → Footer` | public |
| `/apps` | Post-login dashboard: account status + 4 deep-links with token | private |
| `/login` | Email+Password + Continue with Google | public (redirect if authed) |
| `/signup` | Email+Password → verification email required | public |
| `/verify` | success / expired / resend | public |
| `/forgot` | request reset link (valid 1h) | public |
| `/reset` | set new password → auto-login | public (token) |
| `404` | branded | public |

Default locale `/en` (LTR), secondary `/ar` (RTL). Locale switcher persists choice in `localStorage:locale`. SEO primary EN.

## 5. Landing Sections & Copy (EN primary — exact)
**Header**: EduCo. logo `G:\EduCo\educo-logos\educo-light.svg:2` + `EN | عربي` + `[Login with EduID]` (or `[Apps]` if authed)

**Hero**
- Title: `The Parent Company Behind Your Learning`
- Sub: `One EduID unlocks EduVerse, EduChat, EduRafiq, and EduAgent. Sign in once — you're in everywhere, automatically.`
- CTA: `[Get your EduID] → /signup` `[Explore apps] → #apps`

**About EduCo.**
> EduCo. is the umbrella. We build one identity (EduID) and four focused products so the Egyptian student finds everything in one place — curricula, AI help, Islamic guidance, and local power.

**Ambition**
- Serve 1M concurrent users on EduVerse.
- Curriculum-grounded AI (no hallucinations).
- Islamic-only companion with full Quran/tafsir/seerah/sunnah grounding.
- Local-first open-source harness for those who want control.

**Apps (4 cards — exact copy)**
- **EduVerse — jewel**: `Everything the Egyptian student needs — Egyptian curricula only. Built to serve 1M users in the same second. Sponsors + paid courses will fund the ecosystem.`
- **EduChat — AI start**: `Open-source models on an always-on external server. If your question is from your curriculum, it answers only from your attached books — PDF or text — never from weights.`
- **EduRafiq — Islamic companion**: `Your Islamic path companion. Same open models on a separate logical server, grounded only in Quran with tafsir, Seerah, and Sunnah. Outside religion? It redirects you to EduChat.`
- **EduAgent — local harness**: `A local Harness you run on your device. BYOK — bring your own key. Open-source, yet secured by your EduID.`

**EduID Explainer (3 steps)**
1. Register with email
2. Confirm from the verification message sent to your account
3. You're in everywhere automatically

**Footer**: links to children + locale + light/dark + © EduCo.

## 6. Auth Flows (Free Start — Deterministic)

### 6.1 Signup (Email+Password)
1. POST form `email, password(≥8 chars)` → `supabase.auth.signUp`
2. Supabase sends confirmation email (free template)
3. User inactive until click → `/verify?code=xxx` → `supabase.auth.verifyOtp` → active → set HttpOnly cookie `eduid` → redirect `/apps`
4. Resend: button calls `resend({type:'signup', email})` max 4/hour

### 6.2 Google OAuth
1. Click `Continue with Google` → `supabase.auth.signInWithOAuth({provider:'google', options:{redirectTo: SITE_URL+'/apps'}})`
2. Instant active (no confirm) → cookie → `/apps`

### 6.3 Login
- Same as signup but `signInWithPassword`. Wrong password → 401 with message.

### 6.4 Forgot/Reset
1. `/forgot` POST `email` → `supabase.auth.resetPasswordForEmail(email,{redirectTo: SITE_URL+'/reset'})` (1h expiry)
2. `/reset` with token → `supabase.auth.updateUser({password})` → auto-login → `/apps`

## 7. Business Model
- EduCo. itself is **free**. Revenue comes from EduVerse (sponsors + paid courses) and funds Chat/Rafiq servers later.

## 8. Phases
- **Phase 0 (Free)**: Informational + Auth only, static site, no visa.
- **Phase 1 (Funded)**: Add sponsor slots on landing, analytics, custom email domain.

## 9. Success Metrics
- EduID creation rate, verification rate (target ≥70%), cross-app SSO success (100% if cookie present), bounce on landing.

## 10. Non-Goals
- No course delivery, no inference, no Islamic corpus here — only links.

## 11. Acceptance Criteria (Agent Must Pass)
- [ ] Landing renders all 4 app cards with exact copy above, bilingual EN/AR toggle works and persists, dark/light toggle works.
- [ ] Signup creates user, sends confirmation, blocks login until verified, resend works, duplicate email shows error.
- [ ] Google OAuth creates/links user and lands on `/apps` with valid EduID JWT (verified via `supabase.auth.getUser()`).
- [ ] Login with correct password lands on `/apps`; wrong password shows `Invalid credentials`.
- [ ] `/verify` handles `success` (auto-login), `expired` (show resend), `invalid` (show error).
- [ ] Forgot sends 1h link; Reset with valid token allows new password and auto-login; expired token shows error.
- [ ] `/apps` is private (redirect to `/login` if no session), shows email + verification status + 4 deep-links with token query `?eduid=...`.
- [ ] No Facebook provider exists in code or Supabase dashboard.
- [ ] Build passes `npm run build` and deploys to `*.pages.dev` with no secrets in repo.

## 12. File Structure (Expected by Agent)
```
G:\EduCo\
  educo-logos/ (existing)
  PLAN.md, DESIGN.md, TECH.md (this file)
  src/pages/{index.astro, login, signup, verify, forgot, reset, apps}
  src/i18n/{en.json, ar.json}
  src/lib/supabase.ts
  .env.example
```
