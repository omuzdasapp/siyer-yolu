// Yarış motoru. Canlı maç ve bot maçı aynı arayüzü sunar: state(), submit(qi, choice), finish().
// Zaman çizelgesi: başlangıçtan sonra her soru slot_ms aralığıyla açılır ve open_ms boyunca cevaplanabilir.
import { POOL, shuffle } from './data.js';
import { rpc } from './net.js';
import { recentQ } from './store.js';

export const OPEN_MS = 12000;
export const SLOT_MS = 16000;
export const N_Q = 5;

/** 3-4 kişilik yarış (oda). */
const norm = (s) => {
  const me = s.players.find((p) => p.me) || { answers: [] };
  return { ...s, me, mine: me.answers.filter((a) => a.points != null), theirs: [], others: s.players.filter((p) => !p.me) };
};
export const raceMatch = (id) => ({
  kind: 'group',
  state: async () => norm(await rpc('race_state', { p_race: id })),
  submit: (qi, choice) => rpc('race_submit', { p_race: id, p_qi: qi, p_choice: choice }),
  finish: async () => norm(await rpc('race_finish', { p_race: id })),
});

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
  const seen = recentQ();
  const qids = shuffle(POOL).sort((a, b) => seen.has(a.id) - seen.has(b.id)).slice(0, N_Q).map((x) => x.id);
  const acc = kid ? 0.55 : 0.7;
  const bot = qids.map(() => {
    const at = (kid ? 4000 : 2500) + Math.random() * (kid ? 6500 : 7000);
    const correct = Math.random() < acc;
    return { at, correct, points: correct ? 100 + Math.round(50 * (OPEN_MS - at) / OPEN_MS) : 0 };
  });
  const mine = [];
  // Zaman çizelgesi: ikisi de cevaplayınca soru erken kapanır, sonraki soru öne çekilir.
  const sched = () => {
    const opens = []; const closes = [];
    let o = starts;
    for (let qi = 0; qi < N_Q; qi++) {
      opens.push(o);
      const deadline = o + OPEN_MS;
      const m = mine.find((x) => x.qi === qi);
      const botAt = o + bot[qi].at;
      const close = m && botAt <= deadline ? Math.min(deadline, Math.max(m.at, botAt)) : deadline;
      closes.push(close);
      o = close + (SLOT_MS - OPEN_MS);
    }
    return { opens, closes, end: o };
  };
  const snapshot = () => {
    const now = Date.now();
    const { opens, closes, end } = sched();
    const finished = now >= end;
    const theirs = bot.map((b, qi) => ({ qi, ...b })).filter((b) => now >= opens[b.qi] + b.at && opens[b.qi] + b.at <= closes[b.qi])
      .map((b) => (now >= closes[b.qi] || finished ? { qi: b.qi, answered: true, correct: b.correct, points: b.points } : { qi: b.qi, answered: true }));
    const iso = (x) => new Date(x).toISOString();
    return {
      now: iso(now), starts_at: iso(starts), qids, open_ms: OPEN_MS, slot_ms: SLOT_MS,
      opens: opens.map(iso), closes: closes.map(iso), ends_at: iso(end),
      me: { nickname: nickname || 'Sen' }, opp: { nickname: '🤖 Bot', bot: true },
      mine: mine.map(({ at, ...x }) => x), theirs, finished, rated: finished, my_delta: null,
    };
  };
  return {
    kind: 'bot',
    state: async () => snapshot(),
    submit: async (qi, choice) => {
      const now = Date.now();
      const { opens, closes } = sched();
      if (now < opens[qi] || now > closes[qi] + 700) return { accepted: false };
      if (!mine.find((m) => m.qi === qi)) {
        const correct = choice === 0;
        const points = correct ? 100 + Math.round(50 * Math.max(0, opens[qi] + OPEN_MS - now) / OPEN_MS) : 0;
        mine.push({ qi, choice, correct, points, at: now });
      }
      const m = mine.find((x) => x.qi === qi);
      return { accepted: true, correct: m.correct, points: m.points };
    },
    finish: async () => snapshot(),
  };
}
