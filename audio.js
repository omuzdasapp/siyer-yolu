// Sesli okuma (cihazın Türkçe konuşma motoru) ve küçük ses efektleri.
import { state } from './store.js';

let voice = null;
const pick = () => { voice = (window.speechSynthesis?.getVoices() || []).find((v) => v.lang?.toLowerCase().startsWith('tr')) || null; };
pick();
window.speechSynthesis?.addEventListener?.('voiceschanged', pick);

// Kısaltmalar sesli okunurken açılır.
const expand = (t) => t
  .replace(/\(s\.a\.v\.\)/g, ' sallallahu aleyhi ve sellem ')
  .replace(/\bHz\./g, 'Hazreti')
  .replace(/\bb\. /g, 'bin ')
  .replace(/["“”]/g, '');

export const speaking = () => Boolean(window.speechSynthesis?.speaking);
export const stop = () => window.speechSynthesis?.cancel();

export function say(text, rate = 0.95) {
  const s = window.speechSynthesis;
  if (!s || !state().sound) return Promise.resolve();
  s.cancel();
  return new Promise((res) => {
    const u = new SpeechSynthesisUtterance(expand(text));
    u.lang = 'tr-TR';
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
