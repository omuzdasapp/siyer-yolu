// Supabase'e kütüphanesiz, küçük bir bağlantı: anonim oturum + RPC çağrıları.
import { SUPABASE_URL, SUPABASE_ANON_KEY } from './config.js';
import { t } from './i18n.js';

const KEY = 'siyer-yolu-oturum';
export const online = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

const load = () => { try { return JSON.parse(localStorage.getItem(KEY)) || null; } catch { return null; } };
const save = (s) => { try { s ? localStorage.setItem(KEY, JSON.stringify(s)) : localStorage.removeItem(KEY); } catch { /* özel pencere */ } };
let session = load();
let pending = null;

async function auth(path, body) {
  const r = await fetch(`${SUPABASE_URL}/auth/v1/${path}`, {
    method: 'POST', headers: { apikey: SUPABASE_ANON_KEY, 'Content-Type': 'application/json' }, body: JSON.stringify(body),
  });
  const j = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(j.msg || j.error_description || j.message || t('netErr'));
  return { access_token: j.access_token, refresh_token: j.refresh_token, expires_at: j.expires_at || Math.floor(Date.now() / 1000) + (j.expires_in || 3600) };
}

async function ensureSession() {
  if (session && session.expires_at - 60 > Date.now() / 1000) return session;
  if (pending) return pending;
  pending = (async () => {
    try {
      if (session?.refresh_token) {
        try { session = await auth('token?grant_type=refresh_token', { refresh_token: session.refresh_token }); save(session); return session; }
        catch { /* yenilenemedi: yeni anonim oturum aç */ }
      }
      session = await auth('signup', { data: {} });
      save(session);
      return session;
    } finally { pending = null; }
  })();
  return pending;
}

/** Sunucu fonksiyonu çağırır; hata mesajını Türkçe olarak fırlatır. */
export async function rpc(name, args = {}) {
  if (!online) throw new Error(t('liveOff'));
  const s = await ensureSession();
  const r = await fetch(`${SUPABASE_URL}/rest/v1/rpc/${name}`, {
    method: 'POST',
    headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${s.access_token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(args),
  });
  const txt = await r.text();
  const j = txt ? JSON.parse(txt) : null;
  if (!r.ok) {
    if (r.status === 401) { session = null; save(null); }
    throw new Error(j?.message || t('serverErr'));
  }
  return j;
}

export function forgetSession() { session = null; save(null); }
