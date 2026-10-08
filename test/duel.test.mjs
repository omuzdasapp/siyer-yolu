import { PGlite } from '@electric-sql/pglite';
import fs from 'fs';
const db = new PGlite();
const ok = (c, m) => { if (!c) { console.error('✗', m); process.exitCode = 1; } else console.log('✓', m); };
await db.exec(`create role anon; create role authenticated; create schema auth;
create table auth.users (id uuid primary key);
create function auth.uid() returns uuid language sql stable as $$ select nullif(current_setting('app.uid', true),'')::uuid $$;`);
await db.exec(fs.readFileSync(new URL('../schema.sql', import.meta.url), 'utf8'));
const U = {};
for (const n of ['A', 'B', 'C']) { U[n] = crypto.randomUUID(); await db.query('insert into auth.users values ($1)', [U[n]]); }
const as = async (n, sql, p = []) => { await db.query(`select set_config('app.uid',$1,false)`, [U[n]]); return (await db.query(sql, p)).rows[0]; };
const fails = async (n, sql, p, m) => { try { await as(n, sql, p); ok(false, m); } catch (e) { ok(true, m + ' → ' + e.message); } };

await fails('A', `select find_match()`, [], 'takma adsız eşleşme yok');
await fails('A', `select set_nickname('ab')`, [], 'kısa ad reddedilir');
await fails('A', `select set_nickname('siktir git')`, [], 'kaba ad reddedilir');
await as('A', `select set_nickname('Yakup 34')`);
await fails('B', `select set_nickname('yakup 34')`, [], 'aynı ad (büyük/küçük) reddedilir');
await as('B', `select set_nickname('Bilal_Fan')`);
await as('C', `select set_nickname('Cemre')`);

let r = (await as('A', `select find_match() j`)).j;
ok(r.status === 'waiting', 'A kuyrukta bekliyor');
r = (await as('B', `select find_match() j`)).j;
ok(r.status === 'matched', 'B gelince eşleşti');
const mid = r.match_id;
r = (await as('A', `select find_match() j`)).j;
ok(r.status === 'matched' && r.match_id === mid, 'A da aynı maçı görüyor');
r = (await as('C', `select find_match() j`)).j;
ok(r.status === 'waiting', 'C maça girmedi, bekliyor');
await fails('C', `select match_state($1)`, [mid], 'C başkasının maçını göremez');

// Henüz başlamadı → cevap kabul edilmez
r = (await as('A', `select submit_answer($1,0,0) j`, [mid])).j;
ok(r.accepted === false, 'başlamadan cevap yok');
// Saati ilerlet: maç 1 sn önce başlamış olsun
await db.query(`update matches set starts_at = now() - interval '1 second' where id=$1`, [mid]);
r = (await as('A', `select submit_answer($1,0,0) j`, [mid])).j;
ok(r.accepted && r.correct && r.points > 140, 'A hızlı doğru: ' + r.points);
r = (await as('B', `select submit_answer($1,0,2) j`, [mid])).j;
ok(r.accepted && !r.correct && r.points === 0, 'B yanlış: 0');
r = (await as('A', `select submit_answer($1,0,1) j`, [mid])).j;
ok(r.points > 140, 'ikinci cevap ilkini değiştirmez');
let st = (await as('B', `select match_state($1) j`, [mid])).j;
ok(st.theirs.length === 1 && st.theirs[0].correct === undefined, 'açık soruda rakibin doğruluğu gizli');
await fails('A', `select finish_match($1)`, [mid], 'bitmeden puan işlenmez');
await fails('A', `select submit_answer($1,7,0)`, [mid], 'geçersiz soru no');

// 2. soruya geç (16 sn sonra)
await db.query(`update matches set starts_at = now() - interval '17 seconds' where id=$1`, [mid]);
st = (await as('B', `select match_state($1) j`, [mid])).j;
ok(st.theirs[0].correct === true, 'soru kapanınca rakibin sonucu görünür');
r = (await as('A', `select submit_answer($1,0,0) j`, [mid])).j;
ok(r.accepted === false, 'kapanan soruya cevap yok');
r = (await as('B', `select submit_answer($1,1,0) j`, [mid])).j;
ok(r.correct, 'B 2. soruyu bildi');
r = (await as('A', `select submit_answer($1,1,0) j`, [mid])).j;
ok(r.correct, 'A da 2. soruyu bildi');

// Maç bitti
await db.query(`update matches set starts_at = now() - interval '81 seconds' where id=$1`, [mid]);
st = (await as('A', `select finish_match($1) j`, [mid])).j;
ok(st.finished && st.rated, 'maç bitti, puanlandı');
const A = (await as('A', `select me() j`)).j, B = (await as('B', `select me() j`)).j;
ok(A.wins === 1 && B.losses === 1 && A.rating === 1016 && B.rating === 984, `Elo: A ${A.rating}, B ${B.rating}`);
await as('B', `select finish_match($1)`, [mid]);
const A2 = (await as('A', `select me() j`)).j;
ok(A2.rating === 1016 && A2.games === 1, 'ikinci finish puanı tekrar işlemez');
ok(A.rank === 1, 'A sıralamada 1.');
const lb = (await as('C', `select leaderboard() j`)).j;
ok(lb.length === 2 && lb[0].nickname === 'Yakup 34' && !lb[0].me, 'liderlik tablosu (C oynamadı)');
r = (await as('A', `select find_match() j`)).j;
ok(r.status === 'matched' && r.match_id !== mid, 'yeni aramada A, bekleyen C ile eşleşir');

// Bekleme süresi dolan kuyruk temizlenir
await as('B', `select delete_me()`);
ok((await db.query(`select count(*)::int c from players where nickname='Bilal_Fan'`)).rows[0].c === 0, 'hesap silme oyuncuyu siler');
ok((await db.query(`select count(*)::int c from answers where player=$1`, [U.B])).rows[0].c === 0, 'cevapları da silinir');
const mm = (await db.query(`select p1,p2 from matches where id=$1`, [mid])).rows[0];
ok(mm.p2 === null, 'eski maçta B anonimleşir');
