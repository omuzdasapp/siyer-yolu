import { LESSONS, ERAS, BADGES, SOURCES, byId, shuffle } from './data.js';
import * as store from './store.js';
import { say, stop, chime } from './audio.js';
import { h, toast, confetti, wait } from './ui.js';
import { online, rpc, forgetSession } from './net.js';
import { onlineMatch, botMatch, N_Q } from './duel.js';
import { shareCard } from './share.js';
import { t, LANG, setLang, serverMsg } from './i18n.js';

export const VERSION = '1.1.0';
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
          h('span', { class: 'step-text' }, h('b', {}, `${l.n}. ${l.title}`), h('small', {}, l.year)),
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
  show(topbar(`${l.n}/${LESSONS.length}`, () => home()),
    h('main', { class: 'screen' },
      h('article', { class: 'card lesson' },
        h('div', { class: 'lesson-icon', 'aria-hidden': 'true' }, l.icon),
        h('p', { class: 'eyebrow' }, `${ERAS[l.era]} · ${l.year}`),
        h('h1', {}, l.title),
        h('p', { class: 'lesson-text' }, text),
        listen),
      h('button', { class: 'btn', onclick: () => quiz(l) }, t('toQuiz'))));
  if (kid()) setTimeout(() => listen.click(), 400);
}

function quiz(l) {
  const qs = shuffle(l.q).slice(0, 3);
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
  const board = h('ol', { class: 'board' }, h('li', { class: 'muted small' }, online ? t('boardLoading') : t('boardSoon')));
  if (online && s.nickname) {
    rpc('me').then((m) => {
      if (!m) return;
      meBox.replaceChildren(h('b', {}, m.nickname), h('span', {}, t('points', m.rating)), h('span', {}, t('wins', m.wins)), m.games ? h('span', {}, `#${m.rank}`) : null);
    }).catch(() => {});
    rpc('leaderboard').then((rows) => {
      board.replaceChildren(...(rows.length ? rows.map((r, i) => h('li', { class: r.me ? 'me' : '' }, h('span', { class: 'rank' }, i + 1), h('span', { class: 'nick' }, r.nickname), h('span', { class: 'pts' }, r.rating))) : [h('li', { class: 'muted small' }, t('boardEmpty'))]));
    }).catch(() => board.replaceChildren(h('li', { class: 'muted small' }, t('boardErr'))));
  }
  return [intro,
    online && s.nickname ? meBox : null,
    online ? h('button', { class: 'btn', onclick: () => (s.nickname ? search() : nickname(search)) }, t('findLive'))
      : h('p', { class: 'note' }, t('liveSoon')),
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
  let st = null; let offset = 0; let alive = true; let curQ = -1; let finishing = false;
  const myAns = new Map(); // qi → {choice, correct, points}
  let opts = [];
  const meName = h('b', {}); const oppName = h('b', {});
  const meScore = h('span', { class: 'score' }, '0'); const oppScore = h('span', { class: 'score' }, '0');
  const oppDot = h('span', { class: 'dot', title: t('oppAnswered') });
  const phase = h('p', { class: 'eyebrow center' }, t('connecting'));
  const bar = h('span'); const barBox = h('div', { class: 'timer', 'aria-hidden': 'true' }, bar);
  const qBox = h('div', { class: 'duel-q' });
  const note = h('p', { class: 'feedback center', role: 'status' });
  show(h('header', { class: 'top' }, h('button', { class: 'icon', 'aria-label': t('exit'), onclick: () => { if (confirm(t('exitConfirm'))) home('yaris'); } }, '✕'), h('span', { class: 'top-title' }, match.kind === 'bot' ? t('training') : t('liveRace')), h('span')),
    h('main', { class: 'screen duel' },
      h('div', { class: 'scoreboard' },
        h('div', { class: 'side me' }, meName, meScore),
        h('span', { class: 'vs' }, 'VS'),
        h('div', { class: 'side opp' }, h('span', { class: 'opp-name' }, oppName, oppDot), oppScore)),
      phase, barBox, qBox, note));

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
      await wait(match.kind === 'bot' ? 250 : 1000);
    }
  }

  function renderQuestion(qi) {
    const q = byId(st.qids[qi]);
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
    note.textContent = `${mine ? (mine.correct ? t('youPts', mine.points) : t('youX')) : t('youNone')} · ${th ? (th.correct ? t('oppPts', th.points) : t('oppX')) : t('oppNone')}`;
  }

  async function end() {
    if (finishing) return; finishing = true;
    let s = st;
    for (let i = 0; i < 4; i++) { try { s = await match.finish(); break; } catch { await wait(800); } }
    alive = false;
    duelResult(match, s);
  }

  function tick() {
    if (!alive) return;
    if (st) {
      meName.textContent = st.me?.nickname || t('you');
      oppName.textContent = st.opp?.nickname || t('opp');
      meScore.textContent = sum([...myAns.values()]);
      oppScore.textContent = sum((st.theirs || []).filter((x) => x.points != null));
      const start = new Date(st.starts_at).getTime();
      const el = now() - start;
      if (el < 0) {
        phase.textContent = t('startsIn', Math.ceil(-el / 1000)); bar.style.width = '100%';
        if (curQ !== -2) { curQ = -2; qBox.replaceChildren(h('div', { class: 'ready' }, h('p', { class: 'big-emoji' }, '⏳'), h('p', {}, t('matchedWith', st.opp?.nickname || t('opp'))), st.opp?.bot ? h('p', { class: 'small muted' }, t('isBot')) : null)); }
      } else if (el >= st.slot_ms * N_Q) {
        phase.textContent = t('done'); end(); return;
      } else {
        const qi = Math.floor(el / st.slot_ms);
        const inQ = el - qi * st.slot_ms;
        if (qi !== curQ) { curQ = qi; renderQuestion(qi); qBox.revealed = false; }
        const open = inQ < st.open_ms;
        oppDot.classList.toggle('on', Boolean((st.theirs || []).find((x) => x.qi === qi)));
        if (open) {
          const left = st.open_ms - inQ;
          phase.textContent = t('sec', Math.ceil(left / 1000));
          bar.style.width = `${(left / st.open_ms) * 100}%`;
          bar.classList.toggle('low', left < 4000);
        } else {
          phase.textContent = qi < N_Q - 1 ? t('nextComing') : t('results');
          bar.style.width = '0%';
          if (!qBox.revealed) { qBox.revealed = true; reveal(qi); }
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
function start() {
  document.getElementById('splash')?.remove();
  if (!store.state().mode) onboarding(); else home();
}
start();
if ('serviceWorker' in navigator && location.protocol === 'https:') navigator.serviceWorker.register('sw.js').catch(() => {});
