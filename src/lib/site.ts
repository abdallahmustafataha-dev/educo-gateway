import { SITE_URL, supabase } from './supabase';

export type Locale = 'en' | 'ar';

export const childApps = [
  { key: 'verse', name: 'EduVerse', url: 'https://eduverse.pages.dev' },
  { key: 'chat', name: 'EduChat', url: 'https://educhat.pages.dev' },
  { key: 'rafiq', name: 'EduRafiq', url: 'https://edurafiq.pages.dev' },
  { key: 'agent', name: 'EduAgent', url: 'https://eduagent.pages.dev' },
] as const;

export const appLogos = {
  verse: { light: '/app-logos/eduverse-light.svg', dark: '/app-logos/eduverse-dark.svg' },
  chat: { light: '/app-logos/educhat-light.svg', dark: '/app-logos/educhat-dark.svg' },
  rafiq: { light: '/app-logos/edurafiq-light.svg', dark: '/app-logos/edurafiq-dark.svg' },
  agent: { light: '/app-logos/eduagent-light.svg', dark: '/app-logos/eduagent-dark.svg' },
} as const;

export function localePath(locale: Locale, path = ''): string {
  const normalized = path.replace(/^\/+/, '');
  return normalized ? `/${locale}/${normalized}` : `/${locale}/`;
}

export function absoluteUrl(path: string): string {
  const base = SITE_URL.replace(/\/+$/, '') || 'http://localhost:4321';
  return `${base}${path.startsWith('/') ? path : `/${path}`}`;
}

export function getStoredLocale(): Locale {
  if (typeof window === 'undefined') return 'en';
  return window.localStorage.getItem('locale') === 'ar' ? 'ar' : 'en';
}

export function setStoredLocale(locale: Locale): void {
  window.localStorage.setItem('locale', locale);
}

function setTheme(theme: 'light' | 'dark'): void {
  document.documentElement.dataset.theme = theme;
  document.querySelectorAll<HTMLElement>('[data-logo]').forEach((logo) => {
    const source = theme === 'dark' ? logo.dataset.dark : logo.dataset.light;
    if (source) logo.setAttribute('src', source);
  });
  document.querySelectorAll<HTMLButtonElement>('[data-theme-toggle]').forEach((button) => {
    const label = theme === 'dark' ? button.dataset.labelDark : button.dataset.labelLight;
    if (label) button.setAttribute('aria-label', label);
    button.setAttribute('aria-pressed', String(theme === 'dark'));
  });
}

function getInitialTheme(): 'light' | 'dark' {
  const stored = window.localStorage.getItem('theme');
  if (stored === 'dark' || stored === 'light') return stored;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

async function updateAuthNavigation(): Promise<void> {
  const login = document.querySelector<HTMLElement>('[data-auth-login]');
  const apps = document.querySelector<HTMLElement>('[data-auth-apps]');
  if (!login && !apps) return;

  const { data } = await supabase.auth.getUser();
  const isAuthenticated = Boolean(data.user);
  if (login) login.hidden = isAuthenticated;
  if (apps) apps.hidden = !isAuthenticated;
}

export function initSite(): void {
  const theme = getInitialTheme();
  setTheme(theme);

  document.querySelectorAll<HTMLButtonElement>('[data-theme-toggle]').forEach((button) => {
    button.addEventListener('click', () => {
      const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
      window.localStorage.setItem('theme', next);
      setTheme(next);
    });
  });

  document.querySelectorAll<HTMLAnchorElement>('[data-locale-link]').forEach((link) => {
    link.addEventListener('click', () => {
      const locale = link.dataset.localeLink;
      if (locale === 'en' || locale === 'ar') setStoredLocale(locale);
    });
  });

  const navToggle = document.querySelector<HTMLButtonElement>('[data-nav-toggle]');
  const navMenu = document.querySelector<HTMLElement>('[data-nav-menu]');
  if (navToggle && navMenu) {
    const closeNav = () => {
      navMenu.removeAttribute('data-open');
      navToggle.setAttribute('aria-expanded', 'false');
    };
    navToggle.addEventListener('click', () => {
      const isOpen = navMenu.hasAttribute('data-open');
      if (isOpen) {
        closeNav();
      } else {
        navMenu.setAttribute('data-open', '');
        navToggle.setAttribute('aria-expanded', 'true');
      }
    });
    navMenu.querySelectorAll<HTMLAnchorElement>('a').forEach((link) => link.addEventListener('click', closeNav));
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') closeNav();
    });
  }

  void updateAuthNavigation();
}

export function setMessage(target: HTMLElement | null, message: string, tone: 'error' | 'success' | 'info' = 'error'): void {
  if (!target) return;
  target.replaceChildren();
  if (!message) return;
  const alert = document.createElement('div');
  alert.className = `alert alert--${tone}`;
  alert.setAttribute('role', tone === 'error' ? 'alert' : 'status');
  alert.textContent = message;
  target.append(alert);
}

export function setButtonBusy(button: HTMLButtonElement | null, busy: boolean, busyLabel = 'Working…'): void {
  if (!button) return;
  if (!button.dataset.defaultLabel) button.dataset.defaultLabel = button.textContent?.trim() || '';
  button.disabled = busy;
  button.textContent = busy ? busyLabel : button.dataset.defaultLabel;
}

export function replaceLocation(path: string): void {
  window.location.replace(path);
}
