# EduCo. — Design Language (Level 2 — Agent-Ready)

Source of truth: `G:\EduCo\educo-logos\educo-light.svg:2` (64322 B) and `educo-dark.svg` (64455 B). 2000×2000, single organic path `fill-rule:evenodd`. Keep C2PA manifest.

## 1. Tokens (Copy-Paste Ready)

### 1.1 `src/tokens.json`
```json
{
  "color": {
    "bgLight": "#F1F1F1",
    "fgLight": "#323232",
    "bgDark": "#323232",
    "fgDark": "#F1F1F1",
    "border": "#E5E5E5",
    "borderStrong": "#CFCFCF",
    "muted": "#6B6B6B"
  },
  "radius": { "sm": "8px", "md": "10px", "lg": "16px", "pill": "999px" },
  "space": { "xs": "8px", "sm": "12px", "md": "16px", "lg": "24px", "xl": "40px" },
  "font": {
    "displayEn": "Inter, system-ui, sans-serif",
    "displayAr": "Tajawal, IBM Plex Sans Arabic, system-ui",
    "bodyEn": "Inter, system-ui, sans-serif",
    "bodyAr": "IBM Plex Sans Arabic, Tajawal, system-ui",
    "mono": "JetBrains Mono, monospace"
  },
  "size": { "base": "16px", "hero": "48px", "h2": "32px", "small": "14px", "xs": "12px" }
}
```

### 1.2 CSS Variables (`src/styles/tokens.css`)
```css
:root {
  --bg: #F1F1F1; --fg: #323232; --border: #E5E5E5; --border-strong: #CFCFCF; --muted: #6B6B6B;
  --radius-md: 10px; --radius-lg: 16px; --space-lg: 24px;
}
[data-theme="dark"] { --bg: #323232; --fg: #F1F1F1; --border: #4A4A4A; --border-strong: #5A5A5A; }
html[dir="rtl"] { --font-display: var(--font-ar); }
html[dir="ltr"] { --font-display: var(--font-en); }
```
- Contrast: `#323232` on `#F1F1F1` = 12.5:1 (passes AA/AAA). Do not use lighter fg.

## 2. Typography Spec
- EN display: `Inter 700` for hero/H2. AR display: `Tajawal 700` + `IBM Plex Sans Arabic` fallback.
- Body: `Inter 400` 16px/1.6. Small: 14px/1.5 muted.
- Bilingual: EN LTR default (`/en`), AR RTL (`/ar`) — full mirror (grid, margins, icons). Locale toggles `html[lang]` + `dir` + persists `localStorage:locale`.

## 3. Logo Usage (Exact)
- Light logo on `--bg:#F1F1F1` (light theme), dark logo on `--bg:#323232` (dark). Clear space = x-height of mark. Min 24px. Never recolor path `fill="#323232"/"#F1F1F1"` as inspected. Favicon: crop mark to 512×512.
- Keep `educo-logos/` untouched; reference `../educo-logos/educo-light.svg` with `width="32" height="32"`.

## 4. Layout
- Max width `1120px`, centered, `24px` gutters.
- Landing stack: `Header (sticky 64px) → Hero (full, 80vh min) → About (2-col 1:1, stack <768px) → Ambition (3 stat cards) → Apps (4 cards, grid 4→2→1 at 1024/640) → EduID 3-steps (horizontal 3→1) → Footer`.
- Edge cache: static sections cached `s-maxage=3600` on Pages (except `/apps`).

## 5. Components (Props + Spec)

### 5.1 Button
```tsx
type ButtonProps = { variant: 'primary'|'secondary'|'ghost', size?: 'md'|'lg', loading?: boolean, children: ReactNode }
// primary: bg #323232 / fg #F1F1F1 (inverse in dark), radius 10px, px 20 py 12, 700, hover: opacity 0.9, disabled opacity 0.5
// secondary: border 1.5px #323232 / fg #323232 (inverse in dark), same padding
// focus: ring 2px #323232 offset 2px
```

### 5.2 Input
```tsx
type InputProps = { label: string, type: 'email'|'password', error?: string, required?: boolean }
// border 1px var(--border), radius 10px, px 14 py 10, focus border 2px var(--fg), error border #DC2626 + message 12px
// password: reveal toggle inside right (RTL mirrored)
```

### 5.3 Card (App Card)
```tsx
type AppCardProps = { app: 'verse'|'chat'|'rafiq'|'agent', title: string, desc: string, href: string }
// border 1px #E5E5E5, radius 16px, pad 20, hover lift translateY(-2px) shadow 0 8 24 rgba(0,0,0,0.08)
// Top chip: verse #7F1D1D on #F5F1E8 / rafiq #052A2B on #EFE7DD / chat #1A1A1A on #FFFEFA / agent #121212 on #F4F1EA (from children palettes, as small pill)
// dark: border #4A4A4A, no lift shadow
```

### 5.4 Locale & Theme Toggle
```tsx
type ToggleProps = { locale: 'en'|'ar', theme: 'light'|'dark', onChange: fn }
// Header right cluster: [EN|عربي] segmented + [☀/☾] icon button 32×32, focus ring, persists to localStorage:theme
```

### 5.5 Alert / Banner
- Info: border-left 3px #323232, bg #EAEAEA, pad 12. Error: border #DC2626, bg #FEE2E2. All text 14px.

## 6. Page Wireframes (Text)
- **Hero**: centered mark? No — left-aligned title 48px + sub 18px muted (max 640ch) + 2 CTAs gap 12px. Right decorative organic path at 8% opacity (use logo path as SVG background).
- **Apps grid**: 4 cards equal height, CTA `Explore →` at bottom.
- **Auth pages**: centered card `max 440px`, logo top, title, form (2 inputs + primary button + divider `or` + Google button with G icon + links to forgot/signup), error banner top.

## 7. Motion
- Transitions `150ms ease` for hover, `200ms` for theme. No JS animation. Respect `prefers-reduced-motion: reduce` → no lift.

## 8. Accessibility (Checklist)
- [ ] Contrast ≥4.5:1 (already 12.5:1)
- [ ] All inputs have `<label>` + `aria-describedby` for errors
- [ ] Toggle buttons have `aria-label` + `aria-pressed`
- [ ] Auth error banners have `role="alert"`
- [ ] Keyboard: Tab order header→main→footer, focus ring visible

## 9. Assets
- Keep `G:\EduCo\educo-logos\` untouched. Do not rasterize. Use `width/height` attrs to avoid CLS.

## 10. Responsive Breakpoints
- `640px` (sm), `768px` (md, sidebar collapse), `1024px` (lg, 4-col). Hero CTA `full-width <640px`, else `auto`.

## 11. Verification (Agent)
- [ ] `npm run build` with no CLS warnings, Lighthouse ≥95 perf/a11y
- [ ] Toggle persists and syncs with OS preference on first visit
- [ ] RTL mirror verified on `/ar` (no LTR leftovers)
