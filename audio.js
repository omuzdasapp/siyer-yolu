// Sesli okuma (seslendirme dosyası ya da cihazın konuşma motoru) ve küçük ses efektleri.
import { state } from './store.js';
import { LANG } from './i18n.js';

let voice = null;
const pick = () => { voice = (window.speechSynthesis?.getVoices() || []).find((v) => v.lang?.toLowerCase().startsWith(LANG)) || null; };
pick();
window.speechSynthesis?.addEventListener?.('voiceschanged', pick);

// Kısaltmalar sesli okunurken açılır.
const BCP = { tr: 'tr-TR', es: 'es-419', en: 'en-US', de: 'de-DE', ru: 'ru-RU' };
const expand = (t) => (LANG === 'en' ? t.replace(/\(pbuh\)/g, ', peace be upon him, ').replace(/["“”]/g, '')
  : LANG === 'de' || LANG === 'ru' ? t.replace(/["“”„«»]/g, '')
  : LANG === 'es' ? t
  .replace(/\(s\.a\.w\.\)/g, ', la paz y las bendiciones de Allah sean con él, ')
  .replace(/["“”]/g, '') : t
  .replace(/\(s\.a\.v\.\)/g, ' sallallahu aleyhi ve sellem ')
  .replace(/\bHz\./g, 'Hazreti')
  .replace(/\bb\. /g, 'bin ')
  .replace(/["“”]/g, ''));

let clip = null; // seslendirilmiş ders dosyası (ses/<dil>/<ders>-<a|k>.mp3)
export const speaking = () => Boolean(window.speechSynthesis?.speaking) || Boolean(clip && !clip.paused);
export const stop = () => { window.speechSynthesis?.cancel(); if (clip) { clip.pause(); clip = null; } };

/** Dersi okur: önce profesyonel seslendirme dosyası, yoksa cihazın konuşma motoru. */
export const playLesson = (l, kid, fallbackText) => playFile(`ses/${LANG}/${l.n}-${kid ? 'k' : 'a'}.mp3`, fallbackText);
/** Hikâye seslendirmesi: yalnızca TR ve ES için dosya var, diğer dillerde cihaz okur. */
export const playStory = (i, fallbackText) => (LANG === 'tr' || LANG === 'es' ? playFile(`ses/${LANG}/h${i + 1}.mp3`, fallbackText) : say(fallbackText));

function playFile(src, fallbackText) {
  if (!state().sound) return Promise.resolve();
  stop();
  return new Promise((res) => {
    const a = new Audio(src);
    clip = a;
    let fell = false;
    const fallback = () => { if (fell || clip !== a) return; fell = true; clip = null; say(fallbackText).then(res); };
    a.onended = () => { if (clip === a) clip = null; res(); };
    a.onerror = fallback;
    a.onpause = () => { if (clip !== a) res(); };
    a.play().catch(fallback);
  });
}

export function say(text, rate = 0.95) {
  const s = window.speechSynthesis;
  if (!s || !state().sound) return Promise.resolve();
  s.cancel();
  return new Promise((res) => {
    const u = new SpeechSynthesisUtterance(expand(text));
    u.lang = BCP[LANG] || 'tr-TR';
    if (voice) u.voice = voice;
    u.rate = rate;
    u.onend = u.onerror = () => res();
    s.speak(u);
  });
}

let ctx = null;
export function chime(kind = 'ok') {
  if (!state().sound) return;
  try {
    ctx = ctx || new (window.AudioContext || window.webkitAudioContext)();
    const notes = { ok: [660, 880], no: [260], win: [523, 659, 784, 1047], tick: [1200] }[kind] || [600];
    notes.forEach((f, i) => {
      const o = ctx.createOscillator(); const g = ctx.createGain();
      o.type = kind === 'no' ? 'triangle' : 'sine'; o.frequency.value = f;
      const t = ctx.currentTime + i * 0.11;
      g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(kind === 'tick' ? 0.05 : 0.16, t + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, t + (kind === 'tick' ? 0.06 : 0.3));
      o.connect(g).connect(ctx.destination); o.start(t); o.stop(t + 0.35);
    });
  } catch { /* ses desteklenmiyor */ }
}
