// Günlük hadis bildirimi: telefonun bildirim aboneliğini açar/kapatır ve sunucuya kaydeder.
import { VAPID_PUBLIC_KEY } from './config.js';
import { rpc, online } from './net.js';
import { LANG } from './i18n.js';
import * as store from './store.js';

export const pushSupported = () => Boolean(online && VAPID_PUBLIC_KEY && 'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window && location.protocol === 'https:');

const key = (b64) => {
  const pad = '='.repeat((4 - (b64.length % 4)) % 4);
  const raw = atob((b64 + pad).replace(/-/g, '+').replace(/_/g, '/'));
  return Uint8Array.from(raw, (c) => c.charCodeAt(0));
};
const tz = () => { try { return Intl.DateTimeFormat().resolvedOptions().timeZone || 'Europe/Istanbul'; } catch { return 'Europe/Istanbul'; } };

/** Bildirimi açar. Başarılıysa true; izin verilmezse 'denied' döndürür. */
export async function enablePush(hour = store.state().pushHour ?? 8) {
  const perm = await Notification.requestPermission();
  if (perm !== 'granted') return 'denied';
  const reg = await navigator.serviceWorker.ready;
  const sub = (await reg.pushManager.getSubscription()) || await reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: key(VAPID_PUBLIC_KEY) });
  const j = sub.toJSON();
  await rpc('push_subscribe', { p_endpoint: j.endpoint, p_p256dh: j.keys.p256dh, p_auth: j.keys.auth, p_lang: LANG, p_tz: tz(), p_hour: hour });
  store.set({ push: true, pushHour: hour });
  return true;
}

export async function disablePush() {
  try {
    const reg = await navigator.serviceWorker.ready;
    const sub = await reg.pushManager.getSubscription();
    if (sub) { await rpc('push_unsubscribe', { p_endpoint: sub.endpoint }).catch(() => {}); await sub.unsubscribe(); }
  } finally { store.set({ push: false }); }
}

/** Açılışta: abonelik açıksa dil/saat dilimi değişikliklerini sunucuya sessizce bildirir. */
export async function refreshPush() {
  if (!pushSupported() || !store.state().push || Notification.permission !== 'granted') return;
  try { await enablePush(store.state().pushHour ?? 8); } catch { /* sessiz */ }
}
