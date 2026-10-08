// Yarış motoru. Canlı maç ve bot maçı aynı arayüzü sunar: state(), submit(qi, choice), finish().
// Zaman çizelgesi: başlangıçtan sonra her soru slot_ms aralığıyla açılır ve open_ms boyunca cevaplanabilir.
import { POOL, shuffle } from './data.js';
import { rpc } from './net.js';

export const OPEN_MS = 12000;
export const SLOT_MS = 16000;
export const N_Q = 5;

export function onlineMatch(id) {
  return {
    kind: 'online',
    state: () => rpc('match_state', { p_match: id }),
    submit: (qi, choice) => rpc('submit_answer', { p_match: id, p_qi: qi, p_choice: choice }),
    finish: () => rpc('finish_match', { p_match: id }),
  };
}

/** Bot rakip. Kendini bot olarak tanıtır; gerçek bir kişi gibi davranmaz. */
export function botMatch({ nickname, kid }) {
  const starts = Date.now() + 4000;
  const qids = shuffle(POOL).slice(0, N_Q).map((x) => x.id);
  const acc = kid ? 0.55 : 0.7;
  const bot = qids.map(() => {
    const at = (kid ? 4000 : 2500) + Math.random() * (kid ? 6500 : 7000);
    const correct = Math.random() < acc;
    return { at, correct, points: correct ? 100 + Math.round(50 * (OPEN_MS - at) / OPEN_MS) : 0 };
  });
  const mine = [];
  const opensAt = (qi) => starts + qi * SLOT_MS;
  const snapshot = () => {
    const now = Date.now();
    const cur = Math.floor((now - starts) / SLOT_MS);
    const finished = now >= starts + N_Q * SLOT_MS;
    const theirs = bot.map((b, qi) => ({ qi, ...b })).filter((b) => now >= opensAt(b.qi) + b.at)
      .map((b) => (b.qi < cur || finished ? { qi: b.qi, answered: true, correct: b.correct, points: b.points } : { qi: b.qi, answered: true }));
    return {
      now: new Date(now).toISOString(), starts_at: new Date(starts).toISOString(), qids, open_ms: OPEN_MS, slot_ms: SLOT_MS,
      me: { nickname: nickname || 'Sen' }, opp: { nickname: '🤖 Bot', bot: true },
      mine: [...mine], theirs, finished, rated: finished, my_delta: null,
    };
  };
  return {
    kind: 'bot',
    state: async () => snapshot(),
    submit: async (qi, choice) => {
      const now = Date.now();
      const o = opensAt(qi);
      if (now < o || now > o + OPEN_MS + 700) return { accepted: false };
      if (!mine.find((m) => m.qi === qi)) {
        const correct = choice === 0;
        const points = correct ? 100 + Math.round(50 * Math.max(0, o + OPEN_MS - now) / OPEN_MS) : 0;
        mine.push({ qi, choice, correct, points });
      }
      const m = mine.find((x) => x.qi === qi);
      return { accepted: true, correct: m.correct, points: m.points };
    },
    finish: async () => snapshot(),
  };
}
