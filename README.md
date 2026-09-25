# EduCo. — Parent Gateway

Informational website + EduID login authority for the EduCo. learning ecosystem
(EduVerse, EduChat, EduRafiq, EduAgent).

- Static site (Astro) on Cloudflare Pages → `https://educo.pages.dev`
- Auth + DB: Supabase Cloud (shared EduID). **Auth is CLOUD, not local.**
- Bilingual, English default (`/en`), Arabic secondary (`/ar`).
- Login: Email+Password + Google (no Facebook).

Docs: `PLAN.md` (product), `DESIGN.md` (design system), `TECH.md` (stack + SQL),
`FRONTEND-BRIEF.md` (handoff for frontend devs).
