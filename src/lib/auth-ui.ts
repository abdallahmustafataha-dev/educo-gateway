import { getDictionary } from './copy';
import { setButtonBusy, setMessage, absoluteUrl, localePath, type Locale } from './site';
import { supabase } from './supabase';

export function authErrorMessage(error: { message?: string; code?: string } | null | undefined, locale: Locale): string {
  const copy = getDictionary(locale);
  const message = `${error?.message || ''} ${error?.code || ''}`.toLowerCase();
  if (message.includes('invalid login credentials') || message.includes('invalid credentials')) return copy['auth.invalidCredentials'];
  if (message.includes('email not confirmed') || message.includes('not confirmed')) return copy['auth.emailNotConfirmed'];
  if (message.includes('already registered') || message.includes('already exists') || message.includes('user already')) return copy['auth.emailExists'];
  if (message.includes('rate limit') || message.includes('too many')) return copy['auth.rateLimited'];
  if (message.includes('token') && (message.includes('expired') || message.includes('invalid'))) return copy['auth.expired'];
  return copy['auth.generic'];
}

export function localeFromDocument(): Locale {
  return document.documentElement.lang === 'ar' ? 'ar' : 'en';
}

export function authRedirect(locale: Locale, path: string): string {
  return absoluteUrl(localePath(locale, path));
}

export async function beginGoogleAuth(locale: Locale, button: HTMLButtonElement | null, message: HTMLElement | null): Promise<void> {
  const copy = getDictionary(locale);
  setMessage(message, '', 'info');
  setButtonBusy(button, true, copy['auth.loading']);
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: authRedirect(locale, 'apps/') },
  });
  if (error) {
    setButtonBusy(button, false);
    setMessage(message, authErrorMessage(error, locale));
  }
}

export async function resendSignup(locale: Locale, email: string, button: HTMLButtonElement | null, message: HTMLElement | null): Promise<void> {
  const copy = getDictionary(locale);
  if (!email) {
    setMessage(message, copy['auth.emailRequired']);
    return;
  }
  setButtonBusy(button, true, copy['auth.sending']);
  const { error } = await supabase.auth.resend({
    type: 'signup',
    email,
    options: { emailRedirectTo: authRedirect(locale, 'verify/') },
  });
  setButtonBusy(button, false);
  setMessage(message, error ? authErrorMessage(error, locale) : copy['auth.resendSent'], error ? 'error' : 'success');
}

export function startCooldown(button: HTMLButtonElement | null, seconds = 60): void {
  if (!button) return;
  let remaining = seconds;
  let timeout = 0;
  const original = button.dataset.defaultLabel || button.textContent?.trim() || '';
  button.disabled = true;
  const update = () => {
    button.textContent = `${original} · ${remaining}s`;
    remaining -= 1;
    if (remaining < 0) {
      window.clearTimeout(timeout);
      button.disabled = false;
      button.textContent = original;
      return;
    }
    timeout = window.setTimeout(update, 1000);
  };
  timeout = window.setTimeout(update, 1000);
}
