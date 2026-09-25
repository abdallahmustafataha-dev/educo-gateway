# EduCo. — Frontend Developer Brief

> Read this to understand the project. You own all UI/design decisions.
> The only design inputs from us: logo files + brand colors (Section 7).
> Do NOT look for layout/typography/component guidance here — that's your call.

## 1. Project Idea
EduCo. is the parent company of an Egyptian learning ecosystem for the
Egyptian student. It owns one identity system (EduID) and four products:
- **EduVerse** — everything the Egyptian student needs (Egyptian curricula
  only). Future goal: serve 1M concurrent users. Revenue comes from sponsors
  + paid courses.
- **EduChat** — AI assistant with open-source models. If a question is from
  the student's curriculum, it answers ONLY from attached books (PDF/text),
  never from model weights.
- **EduRafiq** — Islamic companion (same tech, separate server). Answers only
  from Quran + tafsir + Seerah + Sunnah. Non-religious questions get redirected
  to EduChat.
- **EduAgent** — open-source local harness, BYOK (bring your own key).

## 2. What This Website Is
An informational gateway + the login authority:
1. Introduces the company, its ambition, and the four apps.
2. Issues the single **EduID**: sign in once here → auto-signed in everywhere.
It does NOT host courses, AI chat, or Islamic content — only links to them.

## 3. Audience & Language
- Egyptian students (primary), parents, sponsors, course creators.
- Bilingual, **English default** (`/en`, LTR), Arabic secondary (`/ar`, RTL).
  Same content both languages. Locale switcher persists choice.

## 4. Pages & Exact Copy (EN primary)
### `/` Landing
- Header: EduCo. logo + `EN | عربي` + `[Login with EduID]` (or `[Apps]` if signed in)
- Hero — Title: `The Parent Company Behind Your Learning`
  Sub: `One EduID unlocks EduVerse, EduChat, EduRafiq, and EduAgent. Sign in once — you're in everywhere, automatically.`
  CTAs: `[Get your EduID] → /signup`, `[Explore apps] → #apps`
- About — `Who we are`: `EduCo. is the umbrella. We build one identity (EduID) and four focused products so the Egyptian student finds everything in one place — curricula, AI help, Islamic guidance, and local power.`
- Ambition (4 bullets):
  `Serve 1M concurrent users on EduVerse.` /
  `Curriculum-grounded AI (no hallucinations).` /
  `Islamic-only companion with full Quran/tafsir/seerah/sunnah grounding.` /
  `Local-first open-source harness for those who want control.`
- Apps (4 cards, exact text each):
  - EduVerse: `Everything the Egyptian student needs — Egyptian curricula only. Built to serve 1M users in the same second. Sponsors + paid courses will fund the ecosystem.`
  - EduChat: `Open-source models on an always-on external server. If your question is from your curriculum, it answers only from your attached books — PDF or text — never from weights.`
  - EduRafiq: `Your Islamic path companion. Same open models on a separate logical server, grounded only in Quran with tafsir, Seerah, and Sunnah. Outside religion? It redirects you to EduChat.`
  - EduAgent: `A local Harness you run on your device. BYOK — bring your own key. Open-source, yet secured by your EduID.`
- EduID explainer (3 steps): `1. Register with email` /
  `2. Confirm from the verification message sent to your account` /
  `3. You're in everywhere automatically`
- Footer: links to the four apps + locale + light/dark.

### `/apps` (private — redirect to `/login` if no session)
- Shows account email + verification status + 4 deep-links carrying the
  session token (`?eduid=...`) + Logout.

### Auth pages (Email+Password + Google only — NO Facebook)
- `/login`: Email + Password + `[Continue with Google]` + Forgot + Signup link.
  Wrong password → `Invalid credentials`. Unverified email → prompt to resend.
- `/signup`: Email + Password → `Check your inbox for the confirmation message.`
  + `[Resend]`. Duplicate email → error.
- `/verify`: handles confirmation link → success (auto-login, go `/apps`),
  expired (show resend), invalid (show error).
- `/forgot`: enter email → reset link sent, valid 1 hour.
- `/reset`: set new password (token link) → auto-login → `/apps`.
- `404`: branded, links to `/en/` + `/ar/`.

## 5. Auth Rules (Must Hold)
- Signup requires email confirmation before the account activates (Google
  accounts are pre-verified, no confirmation needed).
- After any successful auth, the user lands on `/apps` with a valid session.
- `/apps` must be unreachable without a session.
- No Facebook provider anywhere.

## 6. Tech Constraints (Do Not Change)
- Static site (current stack: Astro) deployed on Cloudflare Pages (`dist/`).
- Auth + DB: Supabase Cloud project shared with all apps (no local user store).
- Client lib: `src/lib/supabase.ts` (PKCE, persistent session). Reuse, don't rewrite.
- Env: `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SITE_URL` (fallbacks embedded).
- Keep `educo-logos/` untouched. No secrets in the repo (`.env` is gitignored).

## 7. Brand Assets (The ONLY Design Inputs)
- Logo light: `G:\EduCo\educo-logos\educo-light.svg` (dark mark `#323232` on `#F1F1F1`)
- Logo dark: `G:\EduCo\educo-logos\educo-dark.svg` (light mark `#F1F1F1` on `#323232`)
- Palette: `#F1F1F1` (light bg), `#323232` (dark fg), borders `#E5E5E5`,
  muted `#6B6B6B`, error `#DC2626` on `#FEE2E2`.
- Children chips (for the 4 app cards only): Verse `#7F1D1D` on `#F5F1E8`,
  Chat `#1A1A1A` on `#FFFEFA`, Rafiq `#052A2B` on `#EFE7DD`,
  Agent `#121212` on `#F4F1EA`.
- Everything else (layout, typography, components, motion): YOUR design.

## 8. Done Means
- All pages above render EN + AR with the exact copy.
- Signup → confirm → login → `/apps` works; Google works; forgot/reset works.
- `npm run build` passes; no secrets committed.
