import { LESSONS, ERAS, BADGES, SOURCES, byId, shuffle } from './data.js';
import * as store from './store.js';
import { say, stop, chime } from './audio.js';
import { h, toast, confetti, wait } from './ui.js';
import { online, rpc, forgetSession } from './net.js';
import { onlineMatch, botMatch, N_Q } from './duel.js';
import { shareCard } from './share.js';

export const VERSION = '1.0.0';
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
  back ? h('button', { class: 'icon', 'aria-label': 'Geri', onclick: back }, '←') : h('span', { class: 'brand' }, 'Siyer Yolu'),
  title ? h('span', { class: 'top-title' }, title) : null,
  h('span', { class: 'top-right' },
    h('span', { class: `streak${store.doneToday() ? ' lit' : ''}`, title: 'Günlük seri' }, '🔥 ', String(store.streak())),
    back ? null : h('button', { class: 'icon', 'aria-label': 'Ayarlar', onclick: settings }, '⚙︎')));

const tabs = (cur) => h('nav', { class: 'tabs' },
  [['dersler', '📖', 'Dersler'], ['yaris', '⚡', 'Yarış'], ['rozet', '🏅', 'Rozetler']].map(([k, i, t]) =>
    h('button', { class: cur === k ? 'on' : '', 'aria-current': cur === k ? 'page' : null, onclick: () => home(k) }, h('span', {}, i), t)));

/* ───────── İlk açılış ───────── */
function onboarding() {
  show(h('main', { class: 'screen center onboard' },
    h('div', { class: 'seal', 'aria-hidden': 'true' }, '۞'),
    h('h1', { class: 'display' }, 'Siyer Yolu'),
    h('p', { class: 'lead' }, 'Günde 5 dakikada Peygamberimizin (s.a.v.) hayatı. Her gün bir ders, üç soru ve dilersen canlı bir yarış.'),
    h('p', { class: 'muted' }, 'Kimin için kullanacaksın?'),
    h('button', { class: 'btn', onclick: () => { store.set({ mode: 'adult' }); home(); } }, 'Kendim için'),
    h('button', { class: 'btn ghost', onclick: () => { store.set({ mode: 'kid' }); home(); } }, 'Çocuğumla birlikte'),
    h('p', { class: 'tiny muted' }, 'Çocuk modunda metinler sadeleşir, sesli okunur ve yalnızca bot ile yarışılır.')));
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
        h('p', { class: 'eyebrow' }, store.doneToday() ? 'Bugünün hedefi tamam' : 'Bugünün dersi'),
        h('h2', {}, next ? `${next.icon} ${next.title}` : 'Bütün yolu tamamladın 🤍'),
        h('p', { class: 'muted small' }, next ? `${ERAS[next.era]} · ${next.year}` : 'Dersleri tekrar edebilir ya da yarışabilirsin.'))),
    next ? h('button', { class: 'btn', onclick: () => lesson(next) }, store.doneToday() ? 'Bir ders daha' : 'Başla · 5 dk') : null,
    st > 0 ? h('p', { class: 'small streak-note' }, `🔥 ${st} günlük seri. ${store.doneToday() ? 'Yarın görüşmek üzere!' : 'Bugün de ders yap, seri bozulmasın.'}`) : null);

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
          h('span', { class: 'stars', 'aria-label': done ? `${store.state().done[l.n].best} doğru` : null }, done ? '★'.repeat(store.state().done[l.n].best) + '☆'.repeat(3 - store.state().done[l.n].best) : ''))),
    ];
  }));
  return [goal, h('h3', { class: 'sec' }, 'Yol'), path];
}

/* ───────── Ders ───────── */
function lesson(l) {
  const text = kid() ? l.kid : l.text;
  const listen = h('button', { class: 'btn ghost small', onclick: async () => {
    if (window.speechSynthesis?.speaking) { stop(); listen.textContent = '🔊 Dinle'; return; }
    listen.textContent = '■ Durdur'; await say(`${l.title}. ${text}`); listen.textContent = '🔊 Dinle';
  } }, '🔊 Dinle');
  show(topbar(`${l.n}/${LESSONS.length}`, () => home()),
    h('main', { class: 'screen' },
      h('article', { class: 'card lesson' },
        h('div', { class: 'lesson-icon', 'aria-hidden': 'true' }, l.icon),
        h('p', { class: 'eyebrow' }, `${ERAS[l.era]} · ${l.year}`),
        h('h1', {}, l.title),
        h('p', { class: 'lesson-text' }, text),
        listen),
      h('button', { class: 'btn', onclick: () => quiz(l) }, 'Teste geç · 3 soru')));
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
    const next = h('button', { class: 'btn', hidden: true, onclick: () => { i++; step(); } }, i === qs.length - 1 ? 'Sonucu gör' : 'Sonraki soru');
    const buttons = opts.map((o) => h('button', { class: 'opt', onclick: () => {
      buttons.forEach((b) => { b.disabled = true; });
      const btn = buttons[opts.indexOf(o)];
      const right = buttons[opts.findIndex((x) => x.k === 0)];
      right.classList.add('right');
      if (o.k === 0) { correct++; chime('ok'); fb.textContent = 'Doğru! 🌿'; }
      else { btn.classList.add('wrong'); chime('no'); fb.textContent = `Doğrusu: ${q.o[0]}`; }
      next.hidden = false; next.focus();
    } }, o.t));
    show(topbar(`Soru ${i + 1}/3`, () => lesson(l)),
      h('main', { class: 'screen' },
        h('div', { class: 'progress', 'aria-hidden': 'true' }, h('span', { style: { width: `${(i / 3) * 100}%` } })),
        h('h2', { class: 'question' }, q.q),
        kid() ? h('button', { class: 'btn ghost small', onclick: () => say(`${q.q} ${q.o.join(', ')}`) }, '🔊 Soruyu dinle') : null,
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
      h('p', { class: 'lead' }, 'Dersi bir kez daha okuyup tekrar deneyelim. Acele yok.'),
      h('button', { class: 'btn', onclick: () => lesson(l) }, 'Dersi tekrar oku'),
      h('button', { class: 'btn ghost', onclick: () => quiz(l) }, 'Testi tekrar çöz')));
    return;
  }
  const { fresh, firstToday } = store.finishLesson(l.n, correct);
  chime('win'); confetti();
  const st = store.streak();
  const next = store.nextLesson();
  show(topbar(null, () => home()), h('main', { class: 'screen center' },
    h('div', { class: 'big-emoji', 'aria-hidden': 'true' }, correct === 3 ? '🎯' : '🌿'),
    h('h1', {}, correct === 3 ? 'Tam isabet!' : 'Güzel!'),
    h('p', { class: 'lead' }, `${correct}/3 doğru · ${l.title}`),
    firstToday ? h('p', { class: 'pill gold' }, `🔥 ${st} günlük seri`) : null,
    fresh.length ? h('div', { class: 'new-badges' }, h('p', { class: 'eyebrow' }, 'Yeni rozet'),
      fresh.map((id) => { const b = BADGES.find((x) => x.id === id); return h('span', { class: 'badge on' }, h('b', {}, b.icon), b.name); })) : null,
    next ? h('button', { class: 'btn', onclick: () => lesson(next) }, `Sıradaki: ${next.title}`) : null,
    h('button', { class: 'btn ghost', onclick: () => shareCard({ kind: 'seri', streak: st, lessons: store.doneCount() }) }, '📤 Serini paylaş'),
    h('button', { class: 'link', onclick: () => home() }, 'Ana sayfa')));
}

/* ───────── Yarış ───────── */
function raceTab() {
  const s = store.state();
  const intro = h('section', { class: 'card race-hero' },
    h('div', { class: 'vs-art', 'aria-hidden': 'true' }, h('span', {}, '⚡')),
    h('h2', {}, 'Siyer Yarışı'),
    h('p', { class: 'muted' }, '5 soru, her biri 12 saniye. Doğru ve hızlı cevap daha çok puan getirir.'));
  if (kid()) {
    return [intro,
      h('button', { class: 'btn', onclick: () => duel(botMatch({ nickname: 'Sen', kid: true })) }, '🤖 Bot ile yarış'),
      h('p', { class: 'small muted center' }, 'Çocuk modunda canlı yarış kapalıdır; yalnızca bot ile oynanır. Ayarlardan değiştirebilirsin.')];
  }
  const meBox = h('div', { class: 'me-box' });
  const board = h('ol', { class: 'board' }, h('li', { class: 'muted small' }, online ? 'Sıralama yükleniyor…' : 'Canlı yarış açılınca sıralama burada görünecek.'));
  if (online && s.nickname) {
    rpc('me').then((m) => {
      if (!m) return;
      meBox.replaceChildren(h('b', {}, m.nickname), h('span', {}, `Puan ${m.rating}`), h('span', {}, `${m.wins} galibiyet`), m.games ? h('span', {}, `#${m.rank}`) : null);
    }).catch(() => {});
    rpc('leaderboard').then((rows) => {
      board.replaceChildren(...(rows.length ? rows.map((r, i) => h('li', { class: r.me ? 'me' : '' }, h('span', { class: 'rank' }, i + 1), h('span', { class: 'nick' }, r.nickname), h('span', { class: 'pts' }, r.rating))) : [h('li', { class: 'muted small' }, 'Henüz kimse yarışmadı. İlk sen ol!')]));
    }).catch(() => board.replaceChildren(h('li', { class: 'muted small' }, 'Sıralama şu an yüklenemedi.')));
  }
  return [intro,
    online && s.nickname ? meBox : null,
    online ? h('button', { class: 'btn', onclick: () => (s.nickname ? search() : nickname(search)) }, '⚡ Canlı rakip bul')
      : h('p', { class: 'note' }, 'Canlı eşleşme çok yakında açılıyor. Şimdilik bot ile antrenman yapabilirsin.'),
    h('button', { class: 'btn ghost', onclick: () => duel(botMatch({ nickname: s.nickname || 'Sen', kid: false })) }, '🤖 Bot ile antrenman'),
    h('h3', { class: 'sec' }, 'Sıralama · ilk 20'), board];
}

function nickname(then) {
  const input = h('input', { class: 'input', maxlength: 16, autocomplete: 'off', placeholder: 'örn. Medine_Yolcusu', value: store.state().nickname || '' });
  const err = h('p', { class: 'err', role: 'alert' });
  const btn = h('button', { class: 'btn', type: 'submit' }, 'Kaydet');
  show(topbar('Takma ad', () => home('yaris')), h('main', { class: 'screen' },
    h('form', { class: 'card stack', onsubmit: async (e) => {
      e.preventDefault(); err.textContent = ''; btn.disabled = true;
      try { const p = await rpc('set_nickname', { p_nick: input.value }); store.set({ nickname: p.nickname }); then ? then() : home('yaris'); }
      catch (x) { err.textContent = x.message; btn.disabled = false; }
    } },
      h('h2', {}, 'Rakiplerin seni nasıl görsün?'),
      h('p', { class: 'muted small' }, '3-16 harf ya da rakam. Gerçek adını yazmana gerek yok; e-posta veya telefon istemiyoruz.'),
      input, err, btn)));
  input.focus();
}

function search() {
  let alive = true; let t0 = Date.now();
  const timer = h('p', { class: 'muted' }, '0 sn');
  const bot = h('button', { class: 'btn ghost', hidden: true, onclick: () => { alive = false; rpc('cancel_search').catch(() => {}); duel(botMatch({ nickname: store.state().nickname, kid: false })); } }, '🤖 Beklemeden bot ile oyna');
  show(topbar('Rakip aranıyor', () => { alive = false; rpc('cancel_search').catch(() => {}); home('yaris'); }),
    h('main', { class: 'screen center' },
      h('div', { class: 'radar', 'aria-hidden': 'true' }, h('span', {}), h('span', {}), h('b', {}, '⚡')),
      h('h2', {}, 'Rakip aranıyor…'), timer,
      h('p', { class: 'small muted' }, 'Arkadaşına da uygulamayı açıp "Canlı rakip bul"a basmasını söylersen birbirinizle eşleşirsiniz.'),
      bot));
  cleanup = () => { alive = false; };
  const loop = async () => {
    while (alive) {
      timer.textContent = `${Math.floor((Date.now() - t0) / 1000)} sn`;
      if (Date.now() - t0 > 12000) bot.hidden = false;
      try {
        const r = await rpc('find_match');
        if (!alive) return;
        if (r.status === 'matched') { alive = false; chime('ok'); duel(onlineMatch(r.match_id)); return; }
      } catch (e) { if (alive) { toast(e.message); alive = false; home('yaris'); } return; }
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
  const oppDot = h('span', { class: 'dot', title: 'Rakip cevapladı' });
  const phase = h('p', { class: 'eyebrow center' }, 'Bağlanıyor…');
  const bar = h('span'); const barBox = h('div', { class: 'timer', 'aria-hidden': 'true' }, bar);
  const qBox = h('div', { class: 'duel-q' });
  const note = h('p', { class: 'feedback center', role: 'status' });
  show(h('header', { class: 'top' }, h('button', { class: 'icon', 'aria-label': 'Çık', onclick: () => { if (confirm('Yarıştan çıkılsın mı? Kalan soruların puanı 0 sayılır.')) home('yaris'); } }, '✕'), h('span', { class: 'top-title' }, match.kind === 'bot' ? 'Antrenman' : 'Canlı yarış'), h('span')),
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
      } catch { phase.textContent = 'Bağlantı yavaş…'; }
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
        if (!r.accepted) { note.textContent = 'Süre doldu.'; myAns.set(qi, { choice: o.k, correct: false, points: 0 }); return; }
        myAns.set(qi, { choice: o.k, correct: r.correct, points: r.points });
        chime(r.correct ? 'ok' : 'no');
        note.textContent = r.correct ? `Doğru! +${r.points}` : 'Yanlış';
        buttons[idx].classList.add(r.correct ? 'right' : 'wrong');
      } catch (e) { note.textContent = e.message; }
    } }, o.t));
    qBox.replaceChildren(h('p', { class: 'qno' }, `Soru ${qi + 1}/${N_Q}`), h('h2', { class: 'question' }, q.q), h('div', { class: 'opts' }, buttons));
    qBox.buttons = buttons;
  }

  function reveal(qi) {
    const buttons = qBox.buttons || [];
    buttons.forEach((b) => { b.disabled = true; });
    const right = opts.findIndex((o) => o.k === 0);
    buttons[right]?.classList.add('right');
    const t = (st.theirs || []).find((x) => x.qi === qi);
    const mine = myAns.get(qi);
    note.textContent = `${mine ? (mine.correct ? `Sen +${mine.points}` : 'Sen ✗') : 'Sen cevap vermedin'} · ${t ? (t.correct ? `Rakip +${t.points}` : 'Rakip ✗') : 'Rakip cevap vermedi'}`;
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
      meName.textContent = st.me?.nickname || 'Sen';
      oppName.textContent = st.opp?.nickname || 'Rakip';
      meScore.textContent = sum([...myAns.values()]);
      oppScore.textContent = sum((st.theirs || []).filter((x) => x.points != null));
      const start = new Date(st.starts_at).getTime();
      const t = now() - start;
      if (t < 0) {
        phase.textContent = `Başlıyor: ${Math.ceil(-t / 1000)}`; bar.style.width = '100%';
        if (curQ !== -2) { curQ = -2; qBox.replaceChildren(h('div', { class: 'ready' }, h('p', { class: 'big-emoji' }, '⏳'), h('p', {}, `${st.opp?.nickname || 'Rakip'} ile eşleştin`), st.opp?.bot ? h('p', { class: 'small muted' }, 'Bu bir bilgisayar rakiptir.') : null)); }
      } else if (t >= st.slot_ms * N_Q) {
        phase.textContent = 'Bitti'; end(); return;
      } else {
        const qi = Math.floor(t / st.slot_ms);
        const inQ = t - qi * st.slot_ms;
        if (qi !== curQ) { curQ = qi; renderQuestion(qi); qBox.revealed = false; }
        const open = inQ < st.open_ms;
        oppDot.classList.toggle('on', Boolean((st.theirs || []).find((x) => x.qi === qi)));
        if (open) {
          const left = st.open_ms - inQ;
          phase.textContent = `${Math.ceil(left / 1000)} sn`;
          bar.style.width = `${(left / st.open_ms) * 100}%`;
          bar.classList.toggle('low', left < 4000);
        } else {
          phase.textContent = qi < N_Q - 1 ? 'Sıradaki soru geliyor…' : 'Sonuçlar…';
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
  const again = () => (match.kind === 'bot' ? duel(botMatch({ nickname: store.state().nickname || 'Sen', kid: kid() })) : search());
  show(topbar(null, () => home('yaris')), h('main', { class: 'screen center' },
    h('div', { class: 'big-emoji', 'aria-hidden': 'true' }, res === 'win' ? '🏆' : res === 'lose' ? '🌱' : '🤝'),
    h('h1', {}, res === 'win' ? 'Kazandın!' : res === 'lose' ? 'Bu sefer rakip kazandı' : 'Berabere'),
    h('div', { class: 'final' },
      h('div', {}, h('small', {}, s.me?.nickname || 'Sen'), h('b', {}, mine)),
      h('span', {}, '–'),
      h('div', {}, h('small', {}, s.opp?.nickname || 'Rakip'), h('b', {}, theirs))),
    s.my_delta != null ? h('p', { class: `pill ${s.my_delta >= 0 ? 'gold' : ''}` }, `Puanın ${s.my_delta >= 0 ? '+' : ''}${s.my_delta}`) : null,
    res === 'lose' ? h('p', { class: 'muted small' }, 'Kaybetmek de öğrenmektir. Dersleri tekrar edip yeniden dene.') : null,
    fresh.length ? h('div', { class: 'new-badges' }, fresh.map((id) => { const b = BADGES.find((x) => x.id === id); return h('span', { class: 'badge on' }, h('b', {}, b.icon), b.name); })) : null,
    h('button', { class: 'btn', onclick: again }, match.kind === 'bot' ? 'Tekrar oyna' : 'Yeni rakip bul'),
    h('button', { class: 'btn ghost', onclick: () => shareCard({ kind: 'yaris', me: s.me?.nickname || 'Ben', opp: s.opp?.nickname || 'Rakip', mine, theirs, res }) }, '📤 Sonucu paylaş'),
    h('button', { class: 'link', onclick: () => home('yaris') }, 'Yarış sayfası')));
}

/* ───────── Rozetler ───────── */
function badgesTab() {
  const has = new Set(store.state().badges);
  const s = store.state();
  return [
    h('section', { class: 'card stats' },
      h('div', {}, h('b', {}, store.streak()), h('small', {}, 'günlük seri')),
      h('div', {}, h('b', {}, `${store.doneCount()}/${LESSONS.length}`), h('small', {}, 'ders')),
      h('div', {}, h('b', {}, s.duels.won), h('small', {}, 'galibiyet'))),
    h('div', { class: 'badges' }, BADGES.map((b) => h('div', { class: `badge-card${has.has(b.id) ? ' on' : ''}` },
      h('span', { class: 'b-icon', 'aria-hidden': 'true' }, has.has(b.id) ? b.icon : '🔒'), h('b', {}, b.name), h('small', {}, b.desc)))),
    h('button', { class: 'btn ghost', onclick: () => shareCard({ kind: 'seri', streak: store.streak(), lessons: store.doneCount() }) }, '📤 İlerlemeni paylaş'),
  ];
}

/* ───────── Ayarlar ───────── */
function settings() {
  const s = store.state();
  const row = (label, control) => h('div', { class: 'row' }, h('span', {}, label), control);
  show(topbar('Ayarlar', () => home()), h('main', { class: 'screen' },
    h('section', { class: 'card stack' },
      row('Mod', h('button', { class: 'btn small ghost', onclick: () => (kid() ? gate(() => { store.set({ mode: 'adult' }); settings(); }) : (store.set({ mode: 'kid' }), settings())) }, kid() ? 'Çocuk modu → Yetişkin' : 'Yetişkin → Çocuk modu')),
      row('Ses ve sesli okuma', h('button', { class: 'btn small ghost', 'aria-pressed': String(s.sound), onclick: () => { store.set({ sound: !s.sound }); settings(); } }, s.sound ? 'Açık' : 'Kapalı')),
      online && !kid() ? row('Takma ad', h('button', { class: 'btn small ghost', onclick: () => nickname(() => settings()) }, s.nickname || 'Seç')) : null),
    h('section', { class: 'card stack' },
      h('button', { class: 'link left', onclick: sources }, '📚 Kaynaklar ve içerik hakkında'),
      h('a', { class: 'link left', href: 'gizlilik.html' }, '🔒 Gizlilik politikası'),
      h('button', { class: 'link left', onclick: () => { if (confirm('Ders ilerlemen, serin ve rozetlerin bu cihazdan silinsin mi?')) { store.reset(); toast('İlerleme sıfırlandı.'); home(); } } }, '↺ İlerlemeyi sıfırla'),
      online && s.nickname ? h('button', { class: 'link left danger', onclick: async () => {
        if (!confirm('Takma adın, yarış puanın ve yarış geçmişin sunucudan kalıcı olarak silinsin mi?')) return;
        try { await rpc('delete_me'); forgetSession(); store.set({ nickname: '' }); toast('Yarış hesabın silindi.'); settings(); } catch (e) { toast(e.message); }
      } }, '🗑 Yarış hesabımı sil') : null),
    h('p', { class: 'tiny muted center' }, `Siyer Yolu ${VERSION} · Bir Saadet Evreni projesi`)));
}

function sources() {
  show(topbar('Kaynaklar', settings), h('main', { class: 'screen' },
    h('section', { class: 'card prose' },
      h('p', {}, 'Dersler, siyer alanında yaygın kabul gören bilgilerden kısa ve sade bir dille derlenmiştir. Tarihler miladi yıl olarak ve yaklaşık verilmiştir; bazı ayrıntılarda kaynaklar arasında farklı rivayetler bulunabilir.'),
      h('p', {}, 'Uygulamada Peygamberimizin, ehl-i beytin ve sahabenin resmi ya da tasviri bilerek yer almaz.'),
      h('h3', {}, 'Başlıca kaynaklar'),
      h('ul', {}, SOURCES.map((x) => h('li', {}, x))),
      h('p', {}, 'Bir hata ya da eksik görürsen lütfen bize yaz: ', h('a', { href: 'mailto:saadetevreni3@gmail.com?subject=Siyer%20Yolu%20d%C3%BCzeltme' }, 'saadetevreni3@gmail.com')))));
}

/** Ebeveyn kapısı: yazıyla verilen iki sayının toplamı. */
function gate(onPass) {
  const words = ['', 'bir', 'iki', 'üç', 'dört', 'beş', 'altı', 'yedi', 'sekiz', 'dokuz'];
  const a = 3 + Math.floor(Math.random() * 6); const b = 2 + Math.floor(Math.random() * 7);
  const input = h('input', { class: 'input', inputmode: 'numeric', maxlength: 2, 'aria-label': 'Cevap' });
  show(topbar('Ebeveyn onayı', settings), h('main', { class: 'screen' },
    h('form', { class: 'card stack', onsubmit: (e) => { e.preventDefault(); if (Number(input.value) === a + b) onPass(); else { toast('Olmadı, tekrar dene.'); gate(onPass); } } },
      h('p', {}, 'Bu ayarı değiştirmek için bir yetişkin şu soruyu cevaplasın:'),
      h('h2', {}, `${words[a]} artı ${words[b]} kaç eder?`), input, h('button', { class: 'btn' }, 'Onayla'))));
  input.focus();
}

/* ───────── Başlat ───────── */
function start() {
  document.getElementById('splash')?.remove();
  if (!store.state().mode) onboarding(); else home();
}
start();
if ('serviceWorker' in navigator && location.protocol === 'https:') navigator.serviceWorker.register('sw.js').catch(() => {});
