import { LESSONS, ERAS, BADGES, SOURCES, byId, shuffle } from './data.js';
import * as store from './store.js';
import { say, stop, chime } from './audio.js';
import { h, toast, confetti, wait } from './ui.js';
import { online, rpc, forgetSession } from './net.js';
import { onlineMatch, botMatch, raceMatch, N_Q } from './duel.js';
import { shareCard } from './share.js';
import { t, LANG, setLang, serverMsg, langChosen } from './i18n.js';
import { HADIS } from './hadis.js';
import { pushSupported, enablePush, disablePush, refreshPush } from './push.js';
import { lessonMap } from './map.js';

export const VERSION = '1.5.0';
const app = document.getElementById('app');
const kid = () => store.state().mode === 'kid';
let cleanup = null; // ekrandan çıkarken durdurulacak zamanlayıcılar

function show(...nodes) {
  if (cleanup) { cleanup(); cleanup = null; }
  stop();
  document.body.classList.toggle('kid', kid());
  app.replaceChildren(...nodes);
  window.scrollTo(0, 0);
}

const topbar = (title, back) => h('header', { class: 'top' },
  back ? h('button', { class: 'icon', 'aria-label': t('back'), onclick: back }, '←') : h('span', { class: 'brand' }, 'Siyer Yolu'),
  title ? h('span', { class: 'top-title' }, title) : null,
  h('span', { class: 'top-right' },
    h('span', { class: `streak${store.doneToday() ? ' lit' : ''}`, title: t('dailyStreak') }, '🔥 ', String(store.streak())),
    back ? null : h('button', { class: 'icon', 'aria-label': t('settings'), onclick: settings }, '⚙︎')));

const tabs = (cur) => h('nav', { class: 'tabs' },
  [['dersler', '📖', t('tabLessons')], ['yaris', '⚡', t('tabRace')], ['rozet', '🏅', t('tabBadges')]].map(([k, i, label]) =>
    h('button', { class: cur === k ? 'on' : '', 'aria-current': cur === k ? 'page' : null, onclick: () => home(k) }, h('span', {}, i), label)));

/* ───────── İlk açılış ───────── */
function onboarding() {
  if (!langChosen) {
    show(h('main', { class: 'screen center onboard' },
      h('div', { class: 'seal', 'aria-hidden': 'true' }, '۞'),
      h('h1', { class: 'display' }, 'Siyer Yolu'),
      h('p', { class: 'lead' }, 'Dil seçin · Elige tu idioma'),
      h('button', { class: 'btn', onclick: () => setLang('tr') }, '🇹🇷 Türkçe'),
      h('button', { class: 'btn', onclick: () => setLang('es') }, '🌎 Español'),
      h('p', { class: 'tiny muted' }, 'Ayarlar\'dan sonra değiştirebilirsiniz · Puedes cambiarlo luego en Ajustes')));
    return;
  }
  show(h('main', { class: 'screen center onboard' },
    h('div', { class: 'seal', 'aria-hidden': 'true' }, '۞'),
    h('h1', { class: 'display' }, 'Siyer Yolu'),
    h('p', { class: 'lead' }, t('onbLead')),
    h('p', { class: 'muted' }, t('onbWho')),
    h('button', { class: 'btn', onclick: () => { store.set({ mode: 'adult' }); home(); } }, t('onbSelf')),
    h('button', { class: 'btn ghost', onclick: () => { store.set({ mode: 'kid' }); home(); } }, t('onbKid')),
    h('p', { class: 'tiny muted' }, t('onbKidNote')),
    h('button', { class: 'link', onclick: () => setLang(LANG === 'es' ? 'tr' : 'es') }, LANG === 'es' ? '🇹🇷 Türkçe' : '🌎 Español')));
}

/* ───────── Ana ekran ───────── */
function home(tab = 'dersler') {
  const body = tab === 'yaris' ? raceTab() : tab === 'rozet' ? badgesTab() : lessonsTab();
  show(topbar(), h('main', { class: 'screen' }, body), tabs(tab));
}

function lessonsTab() {
  const next = store.nextLesson();
  const st = store.streak();
  const goal = h('section', { class: 'card today' },
    h('div', { class: 'today-head' },
      h('span', { class: `ring${store.doneToday() ? ' full' : ''}`, 'aria-hidden': 'true' }, store.doneToday() ? '✓' : '1'),
      h('div', {},
        h('p', { class: 'eyebrow' }, store.doneToday() ? t('todayDone') : t('todayLesson')),
        h('h2', {}, next ? `${next.icon} ${next.title}` : t('allDone')),
        h('p', { class: 'muted small' }, next ? `${ERAS[next.era]} · ${next.year}` : t('allDoneNote')))),
    next ? h('button', { class: 'btn', onclick: () => lesson(next) }, store.doneToday() ? t('oneMore') : t('start5')) : null,
    st > 0 ? h('p', { class: 'small streak-note' }, t('streakNote', st, store.doneToday())) : null);

  const path = h('ol', { class: 'path' }, LESSONS.flatMap((l, i) => {
    const done = store.isDone(l.n);
    const open = store.unlocked(l.n);
    const eraStart = i === 0 || LESSONS[i - 1].era !== l.era;
    return [
      eraStart ? h('li', { class: 'era' }, ERAS[l.era]) : null,
      h('li', {},
        h('button', { class: `step${done ? ' done' : ''}${open ? '' : ' locked'}`, disabled: !open, onclick: () => lesson(l) },
          h('span', { class: 'step-icon', 'aria-hidden': 'true' }, open ? l.icon : '🔒'),
          h('span', { class: 'step-text' }, h('b', {}, `${i + 1}. ${l.title}`), h('small', {}, l.year)),
          h('span', { class: 'stars', 'aria-label': done ? t('nCorrect', store.state().done[l.n].best) : null }, done ? '★'.repeat(store.state().done[l.n].best) + '☆'.repeat(3 - store.state().done[l.n].best) : ''))),
    ];
  }));
  return [goal, h('h3', { class: 'sec' }, t('path')), path];
}

/* ───────── Ders ───────── */
function lesson(l) {
  const text = kid() ? l.kid : l.text;
  const listen = h('button', { class: 'btn ghost small', onclick: async () => {
    if (window.speechSynthesis?.speaking) { stop(); listen.textContent = t('listen'); return; }
    listen.textContent = t('stopListen'); await say(`${l.title}. ${text}`); listen.textContent = t('listen');
  } }, t('listen'));
  show(topbar(`${LESSONS.indexOf(l) + 1}/${LESSONS.length}`, () => home()),
    h('main', { class: 'screen' },
      h('article', { class: 'card lesson' },
        h('div', { class: 'lesson-icon', 'aria-hidden': 'true' }, l.icon),
        h('p', { class: 'eyebrow' }, `${ERAS[l.era]} · ${l.year}`),
        h('h1', {}, l.title),
        h('p', { class: 'lesson-text' }, text),
        listen),
      (() => { const m = lessonMap(l.n); return m ? h('figure', { class: 'card map-card' }, h('p', { class: 'eyebrow' }, t('mapTitle')), m, h('figcaption', { class: 'tiny muted' }, t('mapNote'))) : null; })(),
      h('button', { class: 'btn', onclick: () => quiz(l) }, t('toQuiz'))));
  if (kid()) setTimeout(() => listen.click(), 400);
}

function quiz(l) {
  const seen = store.recentQ();
  const qs = shuffle(l.q.map((x, k) => ({ ...x, id: l.n * 10 + k + 1 }))).sort((a, b) => seen.has(a.id) - seen.has(b.id)).slice(0, 3);
  store.markSeen(qs.map((x) => x.id));
  let i = 0; let correct = 0;
  const step = () => {
    if (i >= qs.length) return lessonDone(l, correct);
    const q = qs[i];
    const opts = shuffle(q.o.map((t, k) => ({ t, k })));
    const fb = h('p', { class: 'feedback', role: 'status' });
    const next = h('button', { class: 'btn', hidden: true, onclick: () => { i++; step(); } }, i === qs.length - 1 ? t('seeResult') : t('nextQ'));
    const buttons = opts.map((o) => h('button', { class: 'opt', onclick: () => {
      buttons.forEach((b) => { b.disabled = true; });
      const btn = buttons[opts.indexOf(o)];
      const right = buttons[opts.findIndex((x) => x.k === 0)];
      right.classList.add('right');
      if (o.k === 0) { correct++; chime('ok'); fb.textContent = t('right'); }
      else { btn.classList.add('wrong'); chime('no'); fb.textContent = t('rightIs', q.o[0]); }
      next.hidden = false; next.focus();
    } }, o.t));
    show(topbar(t('qOf', i + 1, 3), () => lesson(l)),
      h('main', { class: 'screen' },
        h('div', { class: 'progress', 'aria-hidden': 'true' }, h('span', { style: { width: `${(i / 3) * 100}%` } })),
        h('h2', { class: 'question' }, q.q),
        kid() ? h('button', { class: 'btn ghost small', onclick: () => say(`${q.q} ${q.o.join(', ')}`) }, t('listenQ')) : null,
        h('div', { class: 'opts' }, buttons), fb, next));
  };
  step();
}

function lessonDone(l, correct) {
  if (correct < 2) {
    chime('no');
    show(topbar(null, () => home()), h('main', { class: 'screen center' },
      h('div', { class: 'big-emoji', 'aria-hidden': 'true' }, '📖'),
      h('h1', {}, `${correct}/3`),
      h('p', { class: 'lead' }, t('retryLead')),
      h('button', { class: 'btn', onclick: () => lesson(l) }, t('reread')),
      h('button', { class: 'btn ghost', onclick: () => quiz(l) }, t('retryQuiz'))));
    return;
  }
  const { fresh, firstToday } = store.finishLesson(l.n, correct);
  chime('win'); confetti();
  const st = store.streak();
  const next = store.nextLesson();
  show(topbar(null, () => home()), h('main', { class: 'screen center' },
    h('div', { class: 'big-emoji', 'aria-hidden': 'true' }, correct === 3 ? '🎯' : '🌿'),
    h('h1', {}, correct === 3 ? t('perfect') : t('good')),
    h('p', { class: 'lead' }, t('scoreLine', correct, l.title)),
    firstToday ? h('p', { class: 'pill gold' }, t('streakPill', st)) : null,
    fresh.length ? h('div', { class: 'new-badges' }, h('p', { class: 'eyebrow' }, t('newBadge')),
      fresh.map((id) => { const b = BADGES.find((x) => x.id === id); return h('span', { class: 'badge on' }, h('b', {}, b.icon), b.name); })) : null,
    next ? h('button', { class: 'btn', onclick: () => lesson(next) }, t('nextLesson', next.title)) : null,
    h('button', { class: 'btn ghost', onclick: () => shareCard({ kind: 'seri', streak: st, lessons: store.doneCount() }) }, t('shareStreak')),
    h('button', { class: 'link', onclick: () => home() }, t('homeLink'))));
}

/* ───────── Yarış ───────── */
function raceTab() {
  const s = store.state();
  const intro = h('section', { class: 'card race-hero' },
    h('div', { class: 'vs-art', 'aria-hidden': 'true' }, h('span', {}, '⚡')),
    h('h2', {}, t('raceTitle')),
    h('p', { class: 'muted' }, t('raceIntro')));
  if (kid()) {
    return [intro,
      h('button', { class: 'btn', onclick: () => duel(botMatch({ nickname: t('you'), kid: true })) }, t('botRace')),
      h('p', { class: 'small muted center' }, t('kidRaceNote'))];
  }
  const meBox = h('div', { class: 'me-box' });
  const badge = h('span', { class: 'count', hidden: true });
  const friendsBtn = h('button', { class: 'btn ghost', onclick: () => (s.nickname ? friendsScreen() : nickname(friendsScreen)) }, t('friends'), badge);
  if (online && s.nickname) rpc('friends').then((f) => { const n = f.incoming.length + f.invites.length; if (n) { badge.textContent = n; badge.hidden = false; } }).catch(() => {});
  const board = h('ol', { class: 'board' }, h('li', { class: 'muted small' }, online ? t('boardLoading') : t('boardSoon')));
  if (online && s.nickname) {
    rpc('me').then((m) => {
      if (!m) return;
      meBox.replaceChildren(...[h('b', {}, m.nickname), h('span', {}, t('points', m.rating)), h('span', {}, t('wins', m.wins)), m.games ? h('span', {}, `#${m.rank}`) : null].filter(Boolean));
    }).catch(() => {});
    rpc('leaderboard').then((rows) => {
      board.replaceChildren(...(rows.length ? rows.map((r, i) => h('li', { class: r.me ? 'me' : '' }, h('span', { class: 'rank' }, i + 1), h('span', { class: 'nick' }, r.nickname), h('span', { class: 'pts' }, r.rating))) : [h('li', { class: 'muted small' }, t('boardEmpty'))]));
    }).catch(() => board.replaceChildren(h('li', { class: 'muted small' }, t('boardErr'))));
  }
  return [intro,
    online && s.nickname ? meBox : null,
    online ? h('button', { class: 'btn', onclick: () => (s.nickname ? search() : nickname(search)) }, t('findLive'))
      : h('p', { class: 'note' }, t('liveSoon')),
    online ? h('button', { class: 'btn', onclick: () => (s.nickname ? quickRoom() : nickname(quickRoom)) }, t('groupRace')) : null,
    online ? h('div', { class: 'two' },
      h('button', { class: 'btn ghost', onclick: () => (s.nickname ? createRoom() : nickname(createRoom)) }, t('roomCreate')),
      h('button', { class: 'btn ghost', onclick: () => (s.nickname ? joinRoom() : nickname(joinRoom)) }, t('roomJoin'))) : null,
    online ? friendsBtn : null,
    h('button', { class: 'btn ghost', onclick: () => duel(botMatch({ nickname: s.nickname || t('you'), kid: false })) }, t('botTrain')),
    h('h3', { class: 'sec' }, t('boardTitle')), board];
}

function nickname(then) {
  const input = h('input', { class: 'input', maxlength: 16, autocomplete: 'off', placeholder: t('nickPh'), value: store.state().nickname || '' });
  const err = h('p', { class: 'err', role: 'alert' });
  const btn = h('button', { class: 'btn', type: 'submit' }, t('save'));
  show(topbar(t('nickTitle'), () => home('yaris')), h('main', { class: 'screen' },
    h('form', { class: 'card stack', onsubmit: async (e) => {
      e.preventDefault(); err.textContent = ''; btn.disabled = true;
      try { const p = await rpc('set_nickname', { p_nick: input.value }); store.set({ nickname: p.nickname }); then ? then() : home('yaris'); }
      catch (x) { err.textContent = serverMsg(x.message); btn.disabled = false; }
    } },
      h('h2', {}, t('nickQ')),
      h('p', { class: 'muted small' }, t('nickNote')),
      input, err, btn)));
  input.focus();
}

function search() {
  let alive = true; let t0 = Date.now();
  const timer = h('p', { class: 'muted' }, t('sec', 0));
  const bot = h('button', { class: 'btn ghost', hidden: true, onclick: () => { alive = false; rpc('cancel_search').catch(() => {}); duel(botMatch({ nickname: store.state().nickname, kid: false })); } }, t('playBot'));
  show(topbar(t('searching'), () => { alive = false; rpc('cancel_search').catch(() => {}); home('yaris'); }),
    h('main', { class: 'screen center' },
      h('div', { class: 'radar', 'aria-hidden': 'true' }, h('span', {}), h('span', {}), h('b', {}, '⚡')),
      h('h2', {}, t('searchingDots')), timer,
      h('p', { class: 'small muted' }, t('searchNote')),
      bot));
  cleanup = () => { alive = false; };
  const loop = async () => {
    while (alive) {
      timer.textContent = t('sec', Math.floor((Date.now() - t0) / 1000));
      if (Date.now() - t0 > 12000) bot.hidden = false;
      try {
        const r = await rpc('find_match');
        if (!alive) return;
        if (r.status === 'matched') { alive = false; chime('ok'); duel(onlineMatch(r.match_id)); return; }
      } catch (e) { if (alive) { toast(serverMsg(e.message)); alive = false; home('yaris'); } return; }
      await wait(1500);
    }
  };
  loop();
}

function duel(match) {
  let st = null; let offset = 0; let alive = true; let curQ = -1; let finishing = false; let fastPoll = false; let wake = null;
  const myAns = new Map(); // qi → {choice, correct, points}
  let opts = [];
  const meName = h('b', {}); const oppName = h('b', {});
  const meScore = h('span', { class: 'score' }, '0'); const oppScore = h('span', { class: 'score' }, '0');
  const oppDot = h('span', { class: 'dot', title: t('oppAnswered') });
  const phase = h('p', { class: 'eyebrow center' }, t('connecting'));
  const bar = h('span'); const barBox = h('div', { class: 'timer', 'aria-hidden': 'true' }, bar);
  const qBox = h('div', { class: 'duel-q' });
  const note = h('p', { class: 'feedback center', role: 'status' });
  const group = match.kind === 'group';
  const multi = h('ol', { class: 'multi' });
  show(h('header', { class: 'top' }, h('button', { class: 'icon', 'aria-label': t('exit'), onclick: () => { if (confirm(t('exitConfirm'))) home('yaris'); } }, '✕'), h('span', { class: 'top-title' }, match.kind === 'bot' ? t('training') : group ? t('groupRace') : t('liveRace')), h('span')),
    h('main', { class: 'screen duel' },
      group ? multi : h('div', { class: 'scoreboard' },
        h('div', { class: 'side me' }, meName, meScore),
        h('span', { class: 'vs' }, 'VS'),
        h('div', { class: 'side opp' }, h('span', { class: 'opp-name' }, oppName, oppDot), oppScore)),
      phase, barBox, qBox, note));
  const paintMulti = (qi) => {
    const rows = st.players.map((p) => ({ p, score: p.me ? sum([...myAns.values()]) : sum(p.answers.filter((x) => x.points != null)) }))
      .sort((a, b) => b.score - a.score);
    multi.replaceChildren(...rows.map(({ p, score }) => h('li', { class: p.me ? 'me' : '' },
      h('span', { class: `dot${p.answers.some((x) => x.qi === qi) || (p.me && myAns.has(qi)) ? ' on' : ''}` }),
      h('b', {}, p.nickname), h('span', { class: 'score' }, score))));
  };

  const now = () => Date.now() + offset;
  const sum = (arr) => arr.reduce((a, x) => a + (x.points || 0), 0);

  async function poll() {
    while (alive) {
      try {
        const t = Date.now();
        const s = await match.state();
        const rtt = Date.now() - t;
        offset = new Date(s.now).getTime() - (t + rtt / 2);
        st = s;
        for (const m of s.mine || []) myAns.set(m.qi, m);
      } catch { phase.textContent = t('slow'); }
      const ms = match.kind === 'bot' ? 200 : fastPoll ? 350 : 800; fastPoll = false;
      await new Promise((r) => { wake = r; setTimeout(r, ms); });
    }
  }

  function renderQuestion(qi) {
    const q = byId(st.qids[qi]);
    store.markSeen([q.id]);
    opts = shuffle(q.o.map((t, k) => ({ t, k })));
    note.textContent = '';
    const buttons = opts.map((o, idx) => h('button', { class: 'opt', onclick: async () => {
      if (myAns.has(qi)) return;
      buttons.forEach((b) => { b.disabled = true; });
      buttons[idx].classList.add('picked');
      myAns.set(qi, { choice: o.k, pending: true });
      try {
        const r = await match.submit(qi, o.k);
        if (!r.accepted) { note.textContent = t('timeUp'); myAns.set(qi, { choice: o.k, correct: false, points: 0 }); return; }
        myAns.set(qi, { choice: o.k, correct: r.correct, points: r.points });
        fastPoll = true; wake?.();
        chime(r.correct ? 'ok' : 'no');
        note.textContent = r.correct ? t('rightPts', r.points) : t('wrong');
        buttons[idx].classList.add(r.correct ? 'right' : 'wrong');
      } catch (e) { note.textContent = serverMsg(e.message); }
    } }, o.t));
    qBox.replaceChildren(h('p', { class: 'qno' }, t('qOf', qi + 1, N_Q)), h('h2', { class: 'question' }, q.q), h('div', { class: 'opts' }, buttons));
    qBox.buttons = buttons;
  }

  function reveal(qi) {
    const buttons = qBox.buttons || [];
    buttons.forEach((b) => { b.disabled = true; });
    const right = opts.findIndex((o) => o.k === 0);
    buttons[right]?.classList.add('right');
    const th = (st.theirs || []).find((x) => x.qi === qi);
    const mine = myAns.get(qi);
    if (group) {
      const others = st.others.map((p) => p.answers.find((x) => x.qi === qi)).filter((x) => x && x.correct != null);
      if (st.others.some((p) => p.answers.find((x) => x.qi === qi && x.correct == null))) fastPoll = true;
      note.textContent = `${mine ? (mine.correct ? t('youPts', mine.points) : t('youX')) : t('youNone')} · ${t('othersRight', others.filter((x) => x.correct).length, st.others.length)}`;
      return;
    }
    note.textContent = `${mine ? (mine.pending ? t('youPending') : mine.correct ? t('youPts', mine.points) : t('youX')) : t('youNone')} · ${th ? (th.correct == null ? t('oppPending') : th.correct ? t('oppPts', th.points) : t('oppX')) : t('oppNone')}`;
  }

  async function end() {
    if (finishing) return; finishing = true;
    let s = st;
    for (let i = 0; i < 4; i++) { try { s = await match.finish(); break; } catch { await wait(800); } }
    alive = false;
    if (group) groupResult(s); else duelResult(match, s);
  }

  function tick() {
    if (!alive) return;
    if (st) {
      meName.textContent = st.me?.nickname || t('you');
      oppName.textContent = st.opp?.nickname || t('opp');
      meScore.textContent = sum([...myAns.values()]);
      oppScore.textContent = sum((st.theirs || []).filter((x) => x.points != null));
      const T = (x) => new Date(x).getTime();
      // Eski sunucu sürümü zaman dizisi göndermezse sabit çizelgeye düş
      const base = T(st.starts_at);
      const opens = st.opens ? st.opens.map(T) : [0, 1, 2, 3, 4].map((k) => base + k * st.slot_ms);
      const closes = st.closes ? st.closes.map(T) : opens.map((o) => o + st.open_ms);
      const endAt = st.ends_at ? T(st.ends_at) : base + N_Q * st.slot_ms;
      const n = now();
      let qi = -1; for (let k = 0; k < opens.length; k++) if (n >= opens[k]) qi = k;
      if (group) paintMulti(Math.max(qi, 0));
      if (qi < 0) {
        phase.textContent = t('startsIn', Math.ceil((opens[0] - n) / 1000)); bar.style.width = '100%';
        if (curQ !== -2) { curQ = -2; qBox.replaceChildren(h('div', { class: 'ready' }, h('p', { class: 'big-emoji' }, '⏳'), h('p', {}, t('matchedWith', group ? st.others.map((p) => p.nickname).join(', ') : st.opp?.nickname || t('opp'))), st.opp?.bot ? h('p', { class: 'small muted' }, t('isBot')) : null)); }
      } else if (n >= endAt) {
        phase.textContent = t('done'); end(); return;
      } else {
        if (qi !== curQ) { curQ = qi; renderQuestion(qi); qBox.revealed = false; }
        // Kapanış sonrası alınmış bir durum gelmeden sonuç gösterilmez (rakibin sonucu eksik görünmesin)
        const stale = T(st.now) < closes[qi];
        if (n >= closes[qi] && stale) fastPoll = true;
        const open = n < closes[qi] || stale;
        oppDot.classList.toggle('on', Boolean((st.theirs || []).find((x) => x.qi === qi)));
        if (open) {
          const left = opens[qi] + st.open_ms - n;
          phase.textContent = t('sec', Math.ceil(left / 1000));
          bar.style.width = `${(left / st.open_ms) * 100}%`;
          bar.classList.toggle('low', left < 4000);
        } else {
          phase.textContent = qi < N_Q - 1 ? t('nextComing') : t('results');
          bar.style.width = '0%';
          if (!qBox.revealed) { qBox.revealed = true; reveal(qi); fastPoll = true; }
          else reveal(qi); // rakip sonucu geç gelirse güncelle
        }
      }
    }
    setTimeout(tick, 100);
  }
  cleanup = () => { alive = false; };
  poll(); tick();
}

function duelResult(match, s) {
  const mine = (s.mine || []).reduce((a, x) => a + x.points, 0);
  const theirs = (s.theirs || []).reduce((a, x) => a + (x.points || 0), 0);
  const res = mine > theirs ? 'win' : mine < theirs ? 'lose' : 'draw';
  const { fresh } = store.finishDuel(res === 'win');
  if (res === 'win') { chime('win'); confetti(); }
  const again = () => (match.kind === 'bot' ? duel(botMatch({ nickname: store.state().nickname || t('you'), kid: kid() })) : search());
  show(topbar(null, () => home('yaris')), h('main', { class: 'screen center' },
    h('div', { class: 'big-emoji', 'aria-hidden': 'true' }, res === 'win' ? '🏆' : res === 'lose' ? '🌱' : '🤝'),
    h('h1', {}, res === 'win' ? t('won') : res === 'lose' ? t('lost') : t('draw')),
    h('div', { class: 'final' },
      h('div', {}, h('small', {}, s.me?.nickname || t('you')), h('b', {}, mine)),
      h('span', {}, '–'),
      h('div', {}, h('small', {}, s.opp?.nickname || t('opp')), h('b', {}, theirs))),
    s.my_delta != null ? h('p', { class: `pill ${s.my_delta >= 0 ? 'gold' : ''}` }, t('ratingDelta', s.my_delta)) : null,
    res === 'lose' ? h('p', { class: 'muted small' }, t('loseNote')) : null,
    fresh.length ? h('div', { class: 'new-badges' }, fresh.map((id) => { const b = BADGES.find((x) => x.id === id); return h('span', { class: 'badge on' }, h('b', {}, b.icon), b.name); })) : null,
    h('button', { class: 'btn', onclick: again }, match.kind === 'bot' ? t('playAgain') : t('newOpp')),
    h('button', { class: 'btn ghost', onclick: () => shareCard({ kind: 'yaris', me: s.me?.nickname || t('me'), opp: s.opp?.nickname || t('opp'), mine, theirs, res }) }, t('shareResult')),
    h('button', { class: 'link', onclick: () => home('yaris') }, t('racePage'))));
}

/* ───────── Arkadaşlar ───────── */
function friendsScreen() {
  let alive = true;
  const input = h('input', { class: 'input', maxlength: 16, autocomplete: 'off', placeholder: t('friendPh') });
  const err = h('p', { class: 'err', role: 'alert' });
  const box = h('div', { class: 'stack' }, h('p', { class: 'muted small center' }, t('boardLoading')));
  const act = async (fn, okMsg) => { try { await fn(); if (okMsg) toast(okMsg); load(); } catch (e) { toast(serverMsg(e.message)); } };
  const load = async () => {
    let f;
    try { f = await rpc('friends'); } catch (e) { box.replaceChildren(h('p', { class: 'err' }, serverMsg(e.message))); return; }
    if (!alive) return;
    const list = (title, items) => (items.length ? [h('h3', { class: 'sec' }, title), h('ul', { class: 'board' }, items)] : []);
    box.replaceChildren(
      ...list(t('invites'), f.invites.map((x) => h('li', {}, h('span', { class: 'nick' }, t('inviteFrom', x.from)),
        h('button', { class: 'btn small', onclick: () => { alive = false; enterRoom(() => rpc('room_join', { p_code: x.code })); } }, t('joinBtn'))))),
      ...list(t('incoming'), f.incoming.map((n) => h('li', {}, h('span', { class: 'nick' }, n),
        h('button', { class: 'btn small', onclick: () => act(() => rpc('friend_respond', { p_nick: n, p_accept: true }), t('friendAdded')) }, t('accept')),
        h('button', { class: 'icon', 'aria-label': t('decline'), onclick: () => act(() => rpc('friend_respond', { p_nick: n, p_accept: false })) }, '✕')))),
      ...list(t('myFriends'), f.friends.map((x) => h('li', {}, h('span', { class: `dot${x.online ? ' on' : ''}`, title: x.online ? t('onlineNow') : '' }),
        h('span', { class: 'nick' }, x.nickname), h('span', { class: 'pts' }, x.rating),
        h('button', { class: 'icon', 'aria-label': t('removeFriend', x.nickname), onclick: () => { if (confirm(t('removeFriend', x.nickname))) act(() => rpc('friend_remove', { p_nick: x.nickname })); } }, '✕')))),
      ...list(t('outgoing'), f.outgoing.map((n) => h('li', {}, h('span', { class: 'nick muted' }, n), h('small', { class: 'muted' }, t('pending')),
        h('button', { class: 'icon', 'aria-label': t('cancel'), onclick: () => act(() => rpc('friend_remove', { p_nick: n })) }, '✕')))),
      ...(f.friends.length || f.incoming.length || f.outgoing.length || f.invites.length ? [] : [h('p', { class: 'muted small center' }, t('noFriends'))]));
  };
  show(topbar(t('friends'), () => home('yaris')), h('main', { class: 'screen' },
    h('form', { class: 'card stack', onsubmit: async (e) => {
      e.preventDefault(); err.textContent = '';
      try { const r = await rpc('friend_request', { p_nick: input.value }); input.value = ''; toast(r === 'accepted' ? t('friendAdded') : t('requestSent')); load(); }
      catch (x) { err.textContent = serverMsg(x.message); }
    } },
      h('h2', {}, t('addFriend')), h('p', { class: 'muted small' }, t('addFriendNote', store.state().nickname)),
      input, err, h('button', { class: 'btn' }, t('sendRequest'))),
    box));
  cleanup = () => { alive = false; };
  load();
  (async () => { while (alive) { await wait(6000); if (alive) load(); } })();
}

/* ───────── Odalar (3-4 kişi) ───────── */
const createRoom = () => enterRoom(() => rpc('room_create'));
const quickRoom = () => enterRoom(() => rpc('quick_room'));

function joinRoom() {
  const input = h('input', { class: 'input code', inputmode: 'numeric', maxlength: 4, autocomplete: 'off', placeholder: '0000', 'aria-label': t('roomCode') });
  const err = h('p', { class: 'err', role: 'alert' });
  show(topbar(t('roomJoin'), () => home('yaris')), h('main', { class: 'screen' },
    h('form', { class: 'card stack', onsubmit: async (e) => {
      e.preventDefault(); err.textContent = '';
      try { const r = await rpc('room_join', { p_code: input.value }); lobby(r); } catch (x) { err.textContent = serverMsg(x.message); }
    } }, h('h2', {}, t('roomCodeQ')), input, err, h('button', { class: 'btn' }, t('joinBtn')))));
  input.focus();
}

async function enterRoom(open) {
  try { lobby(await open()); } catch (e) { toast(serverMsg(e.message)); home('yaris'); }
}

function lobby(room) {
  let alive = true; const t0 = Date.now(); let friends = null;
  const leave = () => { alive = false; rpc('room_leave', { p_room: room.room_id }).catch(() => {}); };
  const slots = h('ul', { class: 'slots' });
  const status = h('p', { class: 'muted center' });
  const startBtn = h('button', { class: 'btn', hidden: true, onclick: async () => {
    startBtn.disabled = true;
    try { paint(await rpc('room_start', { p_room: room.room_id })); } catch (e) { toast(serverMsg(e.message)); startBtn.disabled = false; }
  } }, t('startRace'));
  const inviteBox = h('div', { class: 'stack' });
  const botBtn = h('button', { class: 'btn ghost', hidden: true, onclick: () => { leave(); duel(botMatch({ nickname: store.state().nickname, kid: false })); } }, t('playBot'));
  const code = room.public ? null : h('div', { class: 'room-code' },
    h('p', { class: 'eyebrow' }, t('roomCode')), h('b', {}, room.code),
    h('button', { class: 'btn small ghost', onclick: () => shareCode(room.code) }, t('shareCode')));
  show(topbar(room.public ? t('groupRace') : t('privateRoom'), () => { leave(); home('yaris'); }),
    h('main', { class: 'screen' }, ...[code].filter(Boolean), h('h3', { class: 'sec' }, t('players')), slots, status, startBtn, inviteBox, botBtn));
  cleanup = () => { if (alive) leave(); };

  function paint(r) {
    room = r;
    if (r.race_id) { alive = false; chime('ok'); duel(raceMatch(r.race_id)); return; }
    slots.replaceChildren(...[0, 1, 2, 3].map((i) => {
      const p = r.players[i];
      return h('li', { class: p ? (p.me ? 'me' : '') : 'empty' }, p ? [h('b', {}, p.nickname), p.nickname === r.host && !r.public ? h('small', {}, ' 👑') : null, h('span', { class: 'pts' }, p.rating)] : t('emptySlot'));
    }));
    const n = r.players.length;
    if (r.public) {
      status.textContent = n >= 3 ? t('startingSoon') : t('waitingPlayers', n);
      botBtn.hidden = !(n < 2 && Date.now() - t0 > 30000);
    } else {
      startBtn.hidden = !r.is_host;
      startBtn.disabled = n < 2;
      status.textContent = r.is_host ? (n < 2 ? t('needTwo') : t('canStart', n)) : t('hostStarts', r.host);
    }
  }

  async function paintFriends() {
    if (room.public) return;
    try { friends = (await rpc('friends')).friends; } catch { return; }
    if (!alive) return;
    const inRoom = new Set(room.players.map((p) => p.nickname));
    const list = friends.filter((f) => !inRoom.has(f.nickname));
    inviteBox.replaceChildren(...(list.length ? [h('h3', { class: 'sec' }, t('inviteFriends')),
      h('ul', { class: 'board' }, list.map((f) => h('li', {}, h('span', { class: `dot${f.online ? ' on' : ''}` }), h('span', { class: 'nick' }, f.nickname),
        h('button', { class: 'btn small ghost', onclick: async (e) => {
          e.target.disabled = true;
          try { await rpc('room_invite', { p_room: room.room_id, p_nick: f.nickname }); e.target.textContent = t('invited'); } catch (x) { toast(serverMsg(x.message)); e.target.disabled = false; }
        } }, t('invite')))))] : []));
  }

  paint(room); paintFriends();
  (async () => {
    let k = 0;
    while (alive) {
      await wait(1500);
      if (!alive) return;
      try { paint(await rpc('room_state', { p_room: room.room_id })); }
      catch (e) { if (alive) { alive = false; toast(serverMsg(e.message)); home('yaris'); } return; }
      if (++k % 8 === 0) paintFriends();
    }
  })();
}

async function shareCode(code) {
  const text = t('shareCodeText', code);
  try {
    if (navigator.share) await navigator.share({ text, url: 'https://play.google.com/store/apps/details?id=com.saadetevreni.siyeryolu' });
    else { await navigator.clipboard.writeText(text); toast(t('copied')); }
  } catch { /* vazgeçildi */ }
}

function groupResult(s) {
  const rows = s.players.map((p) => ({ ...p, score: p.answers.reduce((a, x) => a + (x.points || 0), 0) })).sort((a, b) => b.score - a.score);
  const top = rows[0].score;
  const me = rows.find((p) => p.me);
  const place = rows.filter((p) => p.score > me.score).length + 1;
  const won = me.score === top && rows.filter((p) => p.score === top).length === 1;
  const { fresh } = store.finishDuel(won);
  if (won) { chime('win'); confetti(); }
  show(topbar(null, () => home('yaris')), h('main', { class: 'screen center' },
    h('div', { class: 'big-emoji', 'aria-hidden': 'true' }, ['🏆', '🥈', '🥉', '🌱'][place - 1]),
    h('h1', {}, t('place', place)),
    h('ol', { class: 'board podium' }, rows.map((p, i) => h('li', { class: p.me ? 'me' : '' },
      h('span', { class: 'rank' }, i + 1), h('span', { class: 'nick' }, p.nickname), h('span', { class: 'pts' }, p.score),
      p.delta != null && s.ranked ? h('small', { class: 'muted' }, `${p.delta >= 0 ? '+' : ''}${p.delta}`) : null))),
    s.ranked && s.my_delta != null ? h('p', { class: `pill ${s.my_delta >= 0 ? 'gold' : ''}` }, t('ratingDelta', s.my_delta)) : null,
    !s.ranked ? h('p', { class: 'muted small' }, t('friendlyNote')) : null,
    fresh.length ? h('div', { class: 'new-badges' }, fresh.map((id) => { const b = BADGES.find((x) => x.id === id); return h('span', { class: 'badge on' }, h('b', {}, b.icon), b.name); })) : null,
    h('button', { class: 'btn', onclick: () => (s.ranked ? quickRoom() : createRoom()) }, s.ranked ? t('newGroup') : t('newRoom')),
    h('button', { class: 'link', onclick: () => home('yaris') }, t('racePage'))));
}

/* ───────── Rozetler ───────── */
function badgesTab() {
  const has = new Set(store.state().badges);
  const s = store.state();
  return [
    h('section', { class: 'card stats' },
      h('div', {}, h('b', {}, store.streak()), h('small', {}, t('statStreak'))),
      h('div', {}, h('b', {}, `${store.doneCount()}/${LESSONS.length}`), h('small', {}, t('statLessons'))),
      h('div', {}, h('b', {}, s.duels.won), h('small', {}, t('statWins')))),
    h('div', { class: 'badges' }, BADGES.map((b) => h('div', { class: `badge-card${has.has(b.id) ? ' on' : ''}` },
      h('span', { class: 'b-icon', 'aria-hidden': 'true' }, has.has(b.id) ? b.icon : '🔒'), h('b', {}, b.name), h('small', {}, b.desc)))),
    h('button', { class: 'btn ghost', onclick: () => shareCard({ kind: 'seri', streak: store.streak(), lessons: store.doneCount() }) }, t('shareProgress')),
  ];
}

/* ───────── Ayarlar ───────── */
function settings() {
  const s = store.state();
  const row = (label, control) => h('div', { class: 'row' }, h('span', {}, label), control);
  show(topbar(t('settings'), () => home()), h('main', { class: 'screen' },
    h('section', { class: 'card stack' },
      row(t('mode'), h('button', { class: 'btn small ghost', onclick: () => (kid() ? gate(() => { store.set({ mode: 'adult' }); settings(); }) : (store.set({ mode: 'kid' }), settings())) }, kid() ? t('kidToAdult') : t('adultToKid'))),
      row(t('hadisSetting'), h('button', { class: 'btn small ghost', 'aria-pressed': String(s.hadis !== false), onclick: () => { store.set({ hadis: s.hadis === false }); settings(); } }, s.hadis !== false ? t('on') : t('off'))),
      pushSupported() ? row(t('pushSetting'), h('button', { class: 'btn small ghost', 'aria-pressed': String(Boolean(s.push)), onclick: async () => { await pushToggle(!s.push); settings(); } }, s.push ? t('on') : t('off'))) : null,
      pushSupported() && s.push ? row(t('pushHour'), h('select', { class: 'btn small ghost', 'aria-label': t('pushHour'), onchange: async (e) => { await pushToggle(true, Number(e.target.value)); settings(); } },
        Array.from({ length: 17 }, (_, k) => k + 6).map((hh) => h('option', { value: hh, selected: hh === (s.pushHour ?? 8) }, `${String(hh).padStart(2, '0')}:00`)))) : null,
      row(t('sound'), h('button', { class: 'btn small ghost', 'aria-pressed': String(s.sound), onclick: () => { store.set({ sound: !s.sound }); settings(); } }, s.sound ? t('on') : t('off'))),
      online && !kid() ? row(t('nickname'), h('button', { class: 'btn small ghost', onclick: () => nickname(() => settings()) }, s.nickname || t('choose'))) : null,
      row(t('language'), h('button', { class: 'btn small ghost', onclick: () => setLang(LANG === 'es' ? 'tr' : 'es') }, LANG === 'es' ? 'Español → Türkçe' : 'Türkçe → Español'))),
    h('section', { class: 'card stack' },
      h('button', { class: 'link left', onclick: sources }, t('sourcesLink')),
      h('a', { class: 'link left', href: t('privacyHref') }, t('privacy')),
      h('button', { class: 'link left', onclick: () => { if (confirm(t('resetConfirm'))) { store.reset(); toast(t('resetDone')); home(); } } }, t('resetLink')),
      online && s.nickname ? h('button', { class: 'link left danger', onclick: async () => {
        if (!confirm(t('deleteConfirm'))) return;
        try { await rpc('delete_me'); forgetSession(); store.set({ nickname: '' }); toast(t('deleteDone')); settings(); } catch (e) { toast(serverMsg(e.message)); }
      } }, t('deleteLink')) : null),
    h('p', { class: 'tiny muted center' }, t('footer', VERSION))));
}

function sources() {
  show(topbar(t('sources'), settings), h('main', { class: 'screen' },
    h('section', { class: 'card prose' },
      h('p', {}, t('src1')),
      h('p', {}, t('src2')),
      h('h3', {}, t('srcMain')),
      h('ul', {}, SOURCES.map((x) => h('li', {}, x))),
      h('p', {}, t('srcMail'), h('a', { href: `mailto:saadetevreni3@gmail.com?subject=${t('mailSubject')}` }, 'saadetevreni3@gmail.com')))));
}

/** Ebeveyn kapısı: yazıyla verilen iki sayının toplamı. */
function gate(onPass) {
  const a = 3 + Math.floor(Math.random() * 6); const b = 2 + Math.floor(Math.random() * 7);
  const input = h('input', { class: 'input', inputmode: 'numeric', maxlength: 2, 'aria-label': t('gateAns') });
  show(topbar(t('gateTitle'), settings), h('main', { class: 'screen' },
    h('form', { class: 'card stack', onsubmit: (e) => { e.preventDefault(); if (Number(input.value) === a + b) onPass(); else { toast(t('gateTry')); gate(onPass); } } },
      h('p', {}, t('gateAsk')),
      h('h2', {}, t('gateQ', a, b)), input, h('button', { class: 'btn' }, t('confirm')))));
  input.focus();
}

/* ───────── Başlat ───────── */
/* ───────── Açılış hadisi ───────── */
async function pushToggle(on, hour) {
  try {
    const r = on ? await enablePush(hour) : (await disablePush(), true);
    if (r === 'denied') toast(t('pushDenied'), 4500); else if (on) toast(t('pushOn'));
  } catch { toast(t('pushErr')); }
}

function hadis(then, startAt) {
  const n = HADIS.length;
  const last = store.state().lastHadis;
  let i = Number.isInteger(startAt) && startAt >= 0 && startAt < n ? startAt : Math.floor(Math.random() * n);
  if (startAt == null && n > 1 && i === last) i = (i + 1) % n;
  const es = LANG === 'es';
  const ar = h('p', { class: 'hadis-ar', lang: 'ar', dir: 'rtl' });
  const text = h('blockquote', { class: 'hadis-text' });
  const src = h('p', { class: 'hadis-src' });
  const count = h('span', { class: 'hadis-count', 'aria-live': 'polite' });
  const paint = () => {
    const x = HADIS[i];
    store.set({ lastHadis: i });
    ar.textContent = x.ar;
    text.textContent = `“${es ? x.es : x.tr}”`;
    main.classList.toggle('long', (es ? x.es : x.tr).length > 130);
    src.textContent = `— ${x.src[es ? 1 : 0]}`;
    count.textContent = `${i + 1} / ${n}`;
  };
  const go = (d) => { i = (i + d + n) % n; paint(); };
  const main = h('main', { class: 'screen center hadis' },
    h('div', { class: 'seal', 'aria-hidden': 'true' }, '۞'),
    h('p', { class: 'eyebrow' }, t('hadisEyebrow')),
    ar, text, src,
    h('div', { class: 'hadis-nav' },
      h('button', { class: 'icon', 'aria-label': t('hadisPrev'), onclick: () => go(-1) }, '‹'),
      count,
      h('button', { class: 'icon', 'aria-label': t('hadisNext'), onclick: () => go(1) }, '›')),
    h('button', { class: 'btn', onclick: then }, t('hadisGo')),
    pushSupported() && !store.state().push ? h('button', { class: 'link', onclick: async (e) => { e.target.disabled = true; await pushToggle(true); if (store.state().push) e.target.remove(); else e.target.disabled = false; } }, t('pushAsk')) : null);
  // Kaydırarak da geçilebilir.
  let x0 = null;
  main.addEventListener('touchstart', (e) => { x0 = e.touches[0].clientX; }, { passive: true });
  main.addEventListener('touchend', (e) => {
    if (x0 == null) return;
    const dx = e.changedTouches[0].clientX - x0; x0 = null;
    if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
  });
  paint();
  show(main);
}

function start() {
  document.getElementById('splash')?.remove();
  const q = new URLSearchParams(location.search).get('hadis');
  if (q != null) history.replaceState(null, '', location.pathname);
  if (!store.state().mode) onboarding();
  else if (q != null) hadis(() => home(), Number(q));
  else if (store.state().hadis !== false) hadis(() => home());
  else home();
  refreshPush();
}
start();
if ('serviceWorker' in navigator && location.protocol === 'https:') navigator.serviceWorker.register('sw.js').catch(() => {});
