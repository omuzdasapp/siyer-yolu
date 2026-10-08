// İlerleme yalnızca bu cihazda saklanır.
import { LESSONS } from './data.js';

const KEY = 'siyer-yolu-v1';
const blank = () => ({ mode: null, done: {}, days: [], badges: [], duels: { played: 0, won: 0 }, nickname: '', sound: true });
let s;
try { s = { ...blank(), ...JSON.parse(localStorage.getItem(KEY) || '{}') }; } catch { s = blank(); }
const persist = () => { try { localStorage.setItem(KEY, JSON.stringify(s)); } catch { /* özel pencere */ } };

export const state = () => s;
export const set = (patch) => { Object.assign(s, patch); persist(); };
export const reset = () => { const keep = { mode: s.mode, sound: s.sound }; s = { ...blank(), ...keep }; persist(); };

export const today = (d = new Date()) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
const dayBefore = (iso) => { const d = new Date(iso + 'T12:00:00'); d.setDate(d.getDate() - 1); return today(d); };

/** Ardışık gün serisi (bugün ya da dün biten). */
export function streak() {
  const set_ = new Set(s.days);
  let d = set_.has(today()) ? today() : dayBefore(today());
  let n = 0;
  while (set_.has(d)) { n++; d = dayBefore(d); }
  return n;
}
export const doneToday = () => s.days.includes(today());

export const isDone = (n) => Boolean(s.done[n]);
export const unlocked = (n) => n === 1 || isDone(n - 1);
export const nextLesson = () => LESSONS.find((l) => !isDone(l.n)) || null;
export const doneCount = () => LESSONS.filter((l) => isDone(l.n)).length;

function markDay() { if (!s.days.includes(today())) s.days = [...s.days, today()].slice(-400); }

/** Yeni kazanılan rozetleri döndürür. */
function award() {
  const has = new Set(s.badges);
  const want = [];
  const st = streak();
  if (doneCount() >= 1) want.push('ilk');
  if (Object.values(s.done).some((d) => d.best === 3)) want.push('tam');
  if (st >= 3) want.push('seri3');
  if (st >= 7) want.push('seri7');
  if (st >= 30) want.push('seri30');
  if (LESSONS.slice(0, 11).every((l) => isDone(l.n))) want.push('mekke');
  if (isDone(12)) want.push('hicret');
  if (LESSONS.every((l) => isDone(l.n))) want.push('medine');
  if (s.duels.played >= 1) want.push('yaris');
  if (s.duels.won >= 1) want.push('galip');
  if (s.duels.won >= 10) want.push('galip10');
  const fresh = want.filter((b) => !has.has(b));
  if (fresh.length) s.badges = [...s.badges, ...fresh];
  return fresh;
}

export function finishLesson(n, correct) {
  const prev = s.done[n];
  s.done = { ...s.done, [n]: { best: Math.max(prev?.best || 0, correct), at: today() } };
  const firstToday = !doneToday();
  markDay();
  const fresh = award();
  persist();
  return { fresh, firstToday };
}

export function finishDuel(won) {
  s.duels = { played: s.duels.played + 1, won: s.duels.won + (won ? 1 : 0) };
  const firstToday = !doneToday();
  markDay();
  const fresh = award();
  persist();
  return { fresh, firstToday };
}
