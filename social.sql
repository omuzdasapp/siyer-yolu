-- Siyer Yolu · arkadaşlık + 3-4 kişilik yarış odaları (Supabase)
-- schema.sql'den SONRA çalıştırılır. Supabase panelinde: SQL Editor → bu dosyanın tamamını yapıştır → Run.
-- Tekrar çalıştırmak güvenlidir.
-- Kurgu:
--   * Arkadaşlık: takma adla istek → karşı taraf kabul eder. İki taraf da istek atarsa otomatik kabul.
--   * Oda: 4 haneli kodla kurulan özel oda (arkadaş davet edilebilir) ya da rastgele herkese açık oda.
--     Herkese açık oda 4 kişi olunca ya da 3 kişiyle 20 sn bekleyince kendiliğinden başlar.
--   * Yarış: 1'e 1 düelloyla aynı zaman çizelgesi (5 soru, 16 sn'lik dilimler). Herkese açık yarışlar puanlıdır.
--   * Sorular: oyuncuların son yarışlarında çıkan sorular mümkün olduğunca tekrar sorulmaz.

alter table players add column if not exists seen_at timestamptz not null default now();

create table if not exists friend_reqs (
  from_id uuid references players(id) on delete cascade,
  to_id uuid references players(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (from_id, to_id)
);
create table if not exists friendships (
  a uuid references players(id) on delete cascade,
  b uuid references players(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (a, b),
  check (a < b)
);
create index if not exists friendships_b on friendships(b);

create table if not exists races (
  id uuid primary key default gen_random_uuid(),
  players uuid[] not null,
  qids int[] not null,
  starts_at timestamptz not null,
  ranked boolean not null default false,
  rated boolean not null default false,
  deltas jsonb,
  created_at timestamptz not null default now()
);
create index if not exists races_players on races using gin(players);

create table if not exists race_answers (
  race_id uuid references races(id) on delete cascade,
  player uuid,
  qi smallint not null check (qi between 0 and 4),
  choice smallint not null,
  correct boolean not null,
  points int not null,
  at timestamptz not null default now(),
  primary key (race_id, player, qi)
);

create table if not exists rooms (
  id uuid primary key default gen_random_uuid(),
  code text,
  public boolean not null default false,
  host uuid references players(id) on delete cascade,
  race_id uuid references races(id) on delete set null,
  created_at timestamptz not null default now(),
  full_at timestamptz
);
create unique index if not exists rooms_code on rooms(code) where race_id is null and code is not null;

create table if not exists room_players (
  room_id uuid references rooms(id) on delete cascade,
  player uuid references players(id) on delete cascade,
  joined_at timestamptz not null default now(),
  seen_at timestamptz not null default now(),
  primary key (room_id, player)
);
create index if not exists room_players_player on room_players(player);

create table if not exists room_invites (
  room_id uuid references rooms(id) on delete cascade,
  to_id uuid references players(id) on delete cascade,
  from_id uuid references players(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (room_id, to_id)
);

alter table friend_reqs enable row level security;
alter table friendships enable row level security;
alter table races enable row level security;
alter table race_answers enable row level security;
alter table rooms enable row level security;
alter table room_players enable row level security;
alter table room_invites enable row level security;

-- Soru kimlikleri: ders no × 10 + soru sırası. Yeni dersler/sorular eklendikçe aşağıdaki liste güncellenir.
-- 280 soru (40 ders × 7)
insert into questions(id) select l * 10 + q from generate_series(1, 40) l, generate_series(1, 7) q on conflict do nothing;

-- ───────── yardımcılar ─────────
create or replace function _me() returns uuid
language plpgsql security definer set search_path = public as $$
declare uid uuid := auth.uid();
begin
  if uid is null or not exists (select 1 from players where id = uid) then raise exception 'Önce takma ad seç.'; end if;
  update players set seen_at = now() where id = uid and seen_at < now() - interval '5 seconds';
  return uid;
end $$;

create or replace function _player_by_nick(p_nick text) returns uuid
language sql stable security definer set search_path = public as $$
  select id from players where lower(nickname) = lower(btrim(coalesce(p_nick, '')))
$$;

create or replace function _are_friends(x uuid, y uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from friendships where a = least(x, y) and b = greatest(x, y))
$$;

-- Verilen oyuncuların son yarışlarında çıkmamış 5 soru; yetmezse rastgele tamamlar.
create or replace function _pick_qids(ps uuid[]) returns int[]
language plpgsql security definer set search_path = public as $$
declare recent int[]; picked int[];
begin
  select coalesce(array_agg(distinct q), '{}') into recent from (
    select unnest(qids) q from (
      select qids from matches where (p1 = any(ps) or p2 = any(ps)) and created_at > now() - interval '7 days'
      order by created_at desc limit 8) m
    union all
    select unnest(qids) from (
      select qids from races where players && ps and created_at > now() - interval '7 days'
      order by created_at desc limit 8) r) x;
  select array_agg(id) into picked from (select id from questions where id <> all(recent) order by random() limit 5) q;
  if coalesce(array_length(picked, 1), 0) < 5 then
    select array_agg(id) into picked from (
      select id from questions order by (id = any(coalesce(picked, '{}'))) desc, random() limit 5) q;
  end if;
  return picked;
end $$;

-- 1'e 1 eşleşme de tekrar önleyen soru seçimini kullansın.
create or replace function find_match() returns json
language plpgsql security definer set search_path = public as $$
declare uid uuid := _me(); other uuid; mid uuid; m matches;
begin
  perform pg_advisory_xact_lock(424242);
  select * into m from matches
   where (p1 = uid or p2 = uid) and now() < _match_end(matches) and created_at > now() - interval '3 minutes'
   order by created_at desc limit 1;
  if found then return json_build_object('status', 'matched', 'match_id', m.id); end if;
  delete from queue where seen_at < now() - interval '6 seconds';
  select player into other from queue where player <> uid order by seen_at limit 1;
  if other is null then
    insert into queue(player) values (uid) on conflict (player) do update set seen_at = now();
    return json_build_object('status', 'waiting', 'waiting', (select count(*) from queue));
  end if;
  delete from queue where player in (uid, other);
  insert into matches(p1, p2, qids, starts_at)
  values (other, uid, _pick_qids(array[other, uid]), now() + interval '5 seconds')
  returning id into mid;
  return json_build_object('status', 'matched', 'match_id', mid);
end $$;

-- ───────── arkadaşlık ─────────
create or replace function friend_request(p_nick text) returns text
language plpgsql security definer set search_path = public as $$
declare uid uuid := _me(); other uuid := _player_by_nick(p_nick);
begin
  if other is null then raise exception 'Bu takma adla bir oyuncu yok.'; end if;
  if other = uid then raise exception 'Kendine istek gönderemezsin.'; end if;
  if _are_friends(uid, other) then raise exception 'Zaten arkadaşsınız.'; end if;
  if exists (select 1 from friend_reqs where from_id = other and to_id = uid) then
    delete from friend_reqs where (from_id, to_id) in ((other, uid), (uid, other));
    insert into friendships(a, b) values (least(uid, other), greatest(uid, other)) on conflict do nothing;
    return 'accepted';
  end if;
  if (select count(*) from friend_reqs where from_id = uid and created_at > now() - interval '1 day') >= 30 then
    raise exception 'Bugün çok fazla istek gönderdin.';
  end if;
  insert into friend_reqs(from_id, to_id) values (uid, other) on conflict do nothing;
  return 'sent';
end $$;

create or replace function friend_respond(p_nick text, p_accept boolean) returns void
language plpgsql security definer set search_path = public as $$
declare uid uuid := _me(); other uuid := _player_by_nick(p_nick);
begin
  delete from friend_reqs where from_id = other and to_id = uid;
  if not found then raise exception 'İstek bulunamadı.'; end if;
  if p_accept then
    insert into friendships(a, b) values (least(uid, other), greatest(uid, other)) on conflict do nothing;
  end if;
end $$;

-- Arkadaşlığı bitirir ya da gönderilen isteği geri çeker.
create or replace function friend_remove(p_nick text) returns void
language plpgsql security definer set search_path = public as $$
declare uid uuid := _me(); other uuid := _player_by_nick(p_nick);
begin
  delete from friendships where a = least(uid, other) and b = greatest(uid, other);
  delete from friend_reqs where from_id = uid and to_id = other;
end $$;

create or replace function friends() returns json
language plpgsql security definer set search_path = public as $$
declare uid uuid := _me();
begin
  delete from room_invites where created_at < now() - interval '10 minutes';
  return json_build_object(
    'friends', coalesce((select json_agg(json_build_object('nickname', p.nickname, 'rating', p.rating,
                  'online', p.seen_at > now() - interval '2 minutes') order by p.seen_at desc)
               from friendships f join players p on p.id = case when f.a = uid then f.b else f.a end
               where uid in (f.a, f.b)), '[]'),
    'incoming', coalesce((select json_agg(p.nickname order by r.created_at desc)
               from friend_reqs r join players p on p.id = r.from_id where r.to_id = uid), '[]'),
    'outgoing', coalesce((select json_agg(p.nickname order by r.created_at desc)
               from friend_reqs r join players p on p.id = r.to_id where r.from_id = uid), '[]'),
    'invites', coalesce((select json_agg(json_build_object('code', ro.code, 'from', p.nickname) order by i.created_at desc)
               from room_invites i join rooms ro on ro.id = i.room_id join players p on p.id = i.from_id
               where i.to_id = uid and ro.race_id is null), '[]'));
end $$;

-- ───────── odalar ─────────
create or replace function _room_json(r rooms, uid uuid) returns json
language sql stable security definer set search_path = public as $$
  select json_build_object(
    'room_id', r.id, 'code', r.code, 'public', r.public, 'host', (select nickname from players where id = r.host),
    'is_host', r.host = uid, 'race_id', r.race_id,
    'players', coalesce((select json_agg(json_build_object('nickname', p.nickname, 'rating', p.rating, 'me', p.id = uid) order by rp.joined_at)
               from room_players rp join players p on p.id = rp.player where rp.room_id = r.id), '[]'))
$$;

create or replace function _room_cleanup(p_room uuid) returns void
language plpgsql security definer set search_path = public as $$
declare r rooms;
begin
  delete from room_players where room_id = p_room and seen_at < now() - interval '10 seconds'
    and exists (select 1 from rooms where id = p_room and race_id is null);
  select * into r from rooms where id = p_room;
  if r.race_id is null and not exists (select 1 from room_players where room_id = p_room) then
    delete from rooms where id = p_room;
  elsif r.race_id is null and not exists (select 1 from room_players where room_id = p_room and player = r.host) then
    update rooms set host = (select player from room_players where room_id = p_room order by joined_at limit 1) where id = p_room;
  end if;
end $$;

create or replace function _room_start(p_room uuid) returns uuid
language plpgsql security definer set search_path = public as $$
declare r rooms; ps uuid[]; rid uuid;
begin
  select * into r from rooms where id = p_room for update;
  if r.race_id is not null then return r.race_id; end if;
  select array_agg(player order by joined_at) into ps from room_players where room_id = p_room;
  insert into races(players, qids, starts_at, ranked) values (ps, _pick_qids(ps), now() + interval '5 seconds', r.public)
  returning id into rid;
  update rooms set race_id = rid where id = p_room;
  delete from room_invites where room_id = p_room;
  return rid;
end $$;

create or replace function _leave_rooms(uid uuid) returns void
language plpgsql security definer set search_path = public as $$
declare x uuid;
begin
  for x in select rp.room_id from room_players rp join rooms r on r.id = rp.room_id where rp.player = uid and r.race_id is null loop
    delete from room_players where room_id = x and player = uid;
    perform _room_cleanup(x);
  end loop;
end $$;

create or replace function room_create() returns json
language plpgsql security definer set search_path = public as $$
declare uid uuid := _me(); c text; r rooms; tries int := 0;
begin
  perform _leave_rooms(uid);
  delete from rooms where created_at < now() - interval '1 hour';
  loop
    c := lpad((floor(random() * 10000))::int::text, 4, '0');
    exit when not exists (select 1 from rooms where code = c and race_id is null);
    tries := tries + 1;
    if tries > 50 then raise exception 'Şu an oda kurulamıyor, biraz sonra dene.'; end if;
  end loop;
  insert into rooms(code, host) values (c, uid) returning * into r;
  insert into room_players(room_id, player) values (r.id, uid);
  return _room_json(r, uid);
end $$;

create or replace function room_join(p_code text) returns json
language plpgsql security definer set search_path = public as $$
declare uid uuid := _me(); r rooms;
begin
  select * into r from rooms where code = btrim(p_code) and race_id is null and not public;
  if not found then raise exception 'Bu kodla açık bir oda yok.'; end if;
  perform _room_cleanup(r.id);
  if not exists (select 1 from room_players where room_id = r.id and player = uid) then
    if (select count(*) from room_players where room_id = r.id) >= 4 then raise exception 'Oda dolu.'; end if;
    perform _leave_rooms(uid);
    insert into room_players(room_id, player) values (r.id, uid);
  end if;
  delete from room_invites where room_id = r.id and to_id = uid;
  select * into r from rooms where id = r.id;
  return _room_json(r, uid);
end $$;

create or replace function room_invite(p_room uuid, p_nick text) returns void
language plpgsql security definer set search_path = public as $$
declare uid uuid := _me(); other uuid := _player_by_nick(p_nick);
begin
  if not exists (select 1 from room_players rp join rooms r on r.id = rp.room_id
                 where rp.room_id = p_room and rp.player = uid and r.race_id is null and not r.public) then
    raise exception 'Oda bulunamadı.';
  end if;
  if other is null or not _are_friends(uid, other) then raise exception 'Yalnızca arkadaşlarını davet edebilirsin.'; end if;
  insert into room_invites(room_id, to_id, from_id) values (p_room, other, uid)
  on conflict (room_id, to_id) do update set created_at = now(), from_id = excluded.from_id;
end $$;

-- Lobi durumu (istemci ~1,5 sn'de bir çağırır). Herkese açık odada başlatma kararı da burada verilir.
create or replace function room_state(p_room uuid) returns json
language plpgsql security definer set search_path = public as $$
declare uid uuid := _me(); r rooms; n int;
begin
  update room_players set seen_at = now() where room_id = p_room and player = uid;
  if not found then raise exception 'Oda bulunamadı.'; end if;
  perform _room_cleanup(p_room);
  select * into r from rooms where id = p_room;
  if r.public and r.race_id is null then
    select count(*) into n from room_players where room_id = p_room;
    if n >= 3 and r.full_at is null then update rooms set full_at = now() where id = p_room; r.full_at := now(); end if;
    if n < 3 and r.full_at is not null then update rooms set full_at = null where id = p_room; r.full_at := null; end if;
    if n >= 4 or (n >= 3 and r.full_at < now() - interval '20 seconds') then
      perform _room_start(p_room);
      select * into r from rooms where id = p_room;
    end if;
  end if;
  return _room_json(r, uid);
end $$;

create or replace function room_start(p_room uuid) returns json
language plpgsql security definer set search_path = public as $$
declare uid uuid := _me(); r rooms;
begin
  select * into r from rooms where id = p_room;
  if not found or r.host <> uid or r.public then raise exception 'Yarışı yalnızca oda sahibi başlatabilir.'; end if;
  perform _room_cleanup(p_room);
  if (select count(*) from room_players where room_id = p_room) < 2 then raise exception 'Başlamak için en az 2 kişi gerekli.'; end if;
  perform _room_start(p_room);
  select * into r from rooms where id = p_room;
  return _room_json(r, uid);
end $$;

create or replace function room_leave(p_room uuid) returns void
language plpgsql security definer set search_path = public as $$
declare uid uuid := auth.uid();
begin
  delete from room_players where room_id = p_room and player = uid
    and exists (select 1 from rooms where id = p_room and race_id is null);
  perform _room_cleanup(p_room);
end $$;

-- Rastgele 3-4 kişilik oda: boş yeri olan açık odaya girer, yoksa yeni açar.
create or replace function quick_room() returns json
language plpgsql security definer set search_path = public as $$
declare uid uuid := _me(); r rooms; x uuid;
begin
  perform pg_advisory_xact_lock(434343);
  select r2.* into r from rooms r2 join room_players rp on rp.room_id = r2.id
   where rp.player = uid and r2.race_id is null and r2.public limit 1;
  if found then return room_state(r.id); end if;
  perform _leave_rooms(uid);
  for x in select id from rooms where public and race_id is null loop perform _room_cleanup(x); end loop;
  select * into r from rooms ro where ro.public and ro.race_id is null
     and (select count(*) from room_players where room_id = ro.id) < 4
   order by ro.created_at limit 1;
  if not found then
    insert into rooms(public, host) values (true, uid) returning * into r;
  end if;
  insert into room_players(room_id, player) values (r.id, uid);
  return room_state(r.id);
end $$;

-- ───────── yarış ─────────
-- Yarış sonu: herkese açık yarışta her oyuncu çifti için Elo (K = 32 / (n-1)). Bir kez işlenir.
create or replace function race_finish(p_race uuid) returns json
language plpgsql security definer set search_path = public as $$
declare uid uuid := auth.uid(); r races; n int; d jsonb := '{}'; top int;
        x record; y record; e numeric; s numeric; acc numeric;
begin
  select * into r from races where id = p_race for update;
  if not found or not (uid = any(r.players)) then raise exception 'Maç bulunamadı'; end if;
  if now() < _race_end(r) then raise exception 'Maç henüz bitmedi'; end if;
  if not r.rated then
    create temp table if not exists _sc (pid uuid, score int, rating int) on commit drop;
    delete from _sc;
    insert into _sc select p.id, coalesce((select sum(points) from race_answers where race_id = r.id and player = p.id), 0), p.rating
      from players p where p.id = any(r.players);
    n := (select count(*) from _sc);
    if r.ranked and n >= 2 then
      select max(score) into top from _sc;
      for x in select * from _sc loop
        acc := 0;
        for y in select * from _sc where pid <> x.pid loop
          e := 1 / (1 + power(10, (y.rating - x.rating) / 400.0));
          s := case when x.score > y.score then 1 when x.score < y.score then 0 else 0.5 end;
          acc := acc + (s - e);
        end loop;
        d := d || jsonb_build_object(x.pid::text, round(32.0 / (n - 1) * acc)::int);
        update players set rating = greatest(100, rating + round(32.0 / (n - 1) * acc)::int), games = games + 1,
          wins = wins + (x.score = top and (select count(*) from _sc where score = top) = 1)::int,
          draws = draws + (x.score = top and (select count(*) from _sc where score = top) > 1)::int,
          losses = losses + (x.score < top)::int
        where id = x.pid;
      end loop;
    end if;
    update races set rated = true, deltas = d where id = r.id;
  end if;
  return race_state(p_race);
end $$;

-- Hesap silme: yarış cevapları da silinir (oyuncu, arkadaşlık, oda kayıtları zincirleme silinir).
create or replace function delete_me() returns void
language plpgsql security definer set search_path = public, auth as $$
begin
  if auth.uid() is null then return; end if;
  delete from answers where player = auth.uid();
  delete from race_answers where player = auth.uid();
  delete from rooms where host = auth.uid() and race_id is null;
  delete from auth.users where id = auth.uid();
end $$;

revoke all on function _me(), _player_by_nick(text), _are_friends(uuid, uuid), _pick_qids(uuid[]), _room_json(rooms, uuid),
  _room_cleanup(uuid), _room_start(uuid), _leave_rooms(uuid) from public, anon, authenticated;

-- ───────── Erken geçiş: herkes cevaplayınca soru kapanır, sonraki soru öne çekilir ─────────
-- Her maç/yarış için soru açılış (opens) ve kapanış (closes) zamanları tutulur. Sonuç gösterimi = slot − açık süre (4 sn).
alter table matches add column if not exists opens timestamptz[];
alter table matches add column if not exists closes timestamptz[];
alter table races add column if not exists opens timestamptz[];
alter table races add column if not exists closes timestamptz[];

create or replace function _sched_opens(s timestamptz) returns timestamptz[] language sql immutable as $$
  select array_agg(s + _q_slot() * i order by i) from generate_series(0, 4) i $$;
create or replace function _sched_closes(s timestamptz) returns timestamptz[] language sql immutable as $$
  select array_agg(s + _q_slot() * i + _q_open() order by i) from generate_series(0, 4) i $$;

create or replace function _sched_fill() returns trigger language plpgsql as $$
begin
  if new.opens is null then new.opens := _sched_opens(new.starts_at); end if;
  if new.closes is null then new.closes := _sched_closes(new.starts_at); end if;
  return new;
end $$;
drop trigger if exists matches_sched on matches;
create trigger matches_sched before insert on matches for each row execute function _sched_fill();
drop trigger if exists races_sched on races;
create trigger races_sched before insert on races for each row execute function _sched_fill();
update matches set opens = _sched_opens(starts_at), closes = _sched_closes(starts_at) where opens is null;
update races set opens = _sched_opens(starts_at), closes = _sched_closes(starts_at) where opens is null;

create or replace function _match_end(m matches) returns timestamptz language sql immutable as $$
  select coalesce(m.closes[5], m.starts_at + _q_slot() * 4 + _q_open()) + (_q_slot() - _q_open()) $$;
create or replace function _race_end(r races) returns timestamptz language sql immutable as $$
  select coalesce(r.closes[5], r.starts_at + _q_slot() * 4 + _q_open()) + (_q_slot() - _q_open()) $$;

-- i. soruyu şimdi kapatır ve sonraki soruları aradaki fark kadar öne çeker.
create or replace function _shift(op timestamptz[], cl timestamptz[], i int, out o timestamptz[], out c timestamptz[])
language plpgsql as $$
declare d interval := cl[i] - now(); k int;
begin
  o := op; c := cl;
  if d <= interval '0' then return; end if;
  c[i] := now();
  for k in i + 1 .. 5 loop o[k] := op[k] - d; c[k] := cl[k] - d; end loop;
end $$;

create or replace function match_state(p_match uuid) returns json
language plpgsql security definer set search_path = public as $$
declare uid uuid := auth.uid(); m matches; opp uuid; fin boolean;
begin
  select * into m from matches where id = p_match;
  if not found or uid not in (m.p1, m.p2) then raise exception 'Maç bulunamadı'; end if;
  opp := case when uid = m.p1 then m.p2 else m.p1 end;
  fin := now() >= _match_end(m);
  return json_build_object(
    'now', now(), 'starts_at', m.starts_at, 'qids', m.qids, 'opens', m.opens, 'closes', m.closes, 'ends_at', _match_end(m),
    'open_ms', extract(epoch from _q_open()) * 1000, 'slot_ms', extract(epoch from _q_slot()) * 1000,
    'me', (select json_build_object('nickname', nickname, 'rating', rating) from players where id = uid),
    'opp', (select json_build_object('nickname', nickname, 'rating', rating) from players where id = opp),
    'mine', coalesce((select json_agg(json_build_object('qi', qi, 'choice', choice, 'correct', correct, 'points', points) order by qi)
                       from answers where match_id = m.id and player = uid), '[]'),
    'theirs', coalesce((select json_agg(case
                         when now() >= m.closes[qi + 1] or fin
                           then json_build_object('qi', qi, 'answered', true, 'correct', correct, 'points', points)
                         else json_build_object('qi', qi, 'answered', true) end order by qi)
                       from answers where match_id = m.id and player = opp), '[]'),
    'finished', fin, 'rated', m.rated,
    'my_delta', case when uid = m.p1 then m.p1_delta else m.p2_delta end);
end $$;

create or replace function submit_answer(p_match uuid, p_qi int, p_choice int) returns json
language plpgsql security definer set search_path = public as $$
declare uid uuid := auth.uid(); m matches; deadline timestamptz; left_s numeric; ok boolean; pts int; s record;
begin
  select * into m from matches where id = p_match for update;
  if not found or uid not in (m.p1, m.p2) then raise exception 'Maç bulunamadı'; end if;
  if p_qi < 0 or p_qi > 4 then raise exception 'Geçersiz soru'; end if;
  if now() < m.opens[p_qi + 1] or now() > m.closes[p_qi + 1] + interval '700 milliseconds' then
    return json_build_object('accepted', false, 'reason', 'Süre doldu');
  end if;
  deadline := m.opens[p_qi + 1] + _q_open();
  ok := p_choice = (select correct from questions where id = m.qids[p_qi + 1]);
  left_s := greatest(0, extract(epoch from (deadline - now())));
  pts := case when ok then 100 + round(50 * left_s / extract(epoch from _q_open()))::int else 0 end;
  insert into answers(match_id, player, qi, choice, correct, points) values (m.id, uid, p_qi, p_choice, ok, pts)
  on conflict do nothing;
  if (select count(distinct player) from answers where match_id = m.id and qi = p_qi) >= 2 then
    s := _shift(m.opens, m.closes, p_qi + 1);
    update matches set opens = s.o, closes = s.c where id = m.id;
  end if;
  return (select json_build_object('accepted', true, 'correct', correct, 'points', points)
          from answers where match_id = m.id and player = uid and qi = p_qi);
end $$;

create or replace function race_state(p_race uuid) returns json
language plpgsql security definer set search_path = public as $$
declare uid uuid := auth.uid(); r races; fin boolean;
begin
  select * into r from races where id = p_race;
  if not found or not (uid = any(r.players)) then raise exception 'Maç bulunamadı'; end if;
  fin := now() >= _race_end(r);
  return json_build_object(
    'now', now(), 'starts_at', r.starts_at, 'qids', r.qids, 'opens', r.opens, 'closes', r.closes, 'ends_at', _race_end(r),
    'open_ms', extract(epoch from _q_open()) * 1000, 'slot_ms', extract(epoch from _q_slot()) * 1000,
    'finished', fin, 'ranked', r.ranked, 'rated', r.rated,
    'my_delta', (r.deltas ->> uid::text)::int,
    'players', (select json_agg(json_build_object(
        'nickname', coalesce(p.nickname, '—'), 'rating', p.rating, 'me', pid = uid,
        'delta', (r.deltas ->> pid::text)::int,
        'answers', coalesce((select json_agg(case
            when pid = uid or now() >= r.closes[a.qi + 1] or fin
              then json_build_object('qi', a.qi, 'answered', true, 'choice', case when pid = uid then a.choice end, 'correct', a.correct, 'points', a.points)
            else json_build_object('qi', a.qi, 'answered', true) end order by a.qi)
          from race_answers a where a.race_id = r.id and a.player = pid), '[]')) order by ord)
      from unnest(r.players) with ordinality u(pid, ord) left join players p on p.id = pid));
end $$;

create or replace function race_submit(p_race uuid, p_qi int, p_choice int) returns json
language plpgsql security definer set search_path = public as $$
declare uid uuid := auth.uid(); r races; deadline timestamptz; left_s numeric; ok boolean; pts int; s record;
begin
  select * into r from races where id = p_race for update;
  if not found or not (uid = any(r.players)) then raise exception 'Maç bulunamadı'; end if;
  if p_qi < 0 or p_qi > 4 then raise exception 'Geçersiz soru'; end if;
  if now() < r.opens[p_qi + 1] or now() > r.closes[p_qi + 1] + interval '700 milliseconds' then
    return json_build_object('accepted', false, 'reason', 'Süre doldu');
  end if;
  deadline := r.opens[p_qi + 1] + _q_open();
  ok := p_choice = (select correct from questions where id = r.qids[p_qi + 1]);
  left_s := greatest(0, extract(epoch from (deadline - now())));
  pts := case when ok then 100 + round(50 * left_s / extract(epoch from _q_open()))::int else 0 end;
  insert into race_answers(race_id, player, qi, choice, correct, points) values (r.id, uid, p_qi, p_choice, ok, pts)
  on conflict do nothing;
  -- Herkes (hesabı silinmemiş oyuncular) cevapladıysa soruyu kapat
  if (select count(distinct a.player) from race_answers a where a.race_id = r.id and a.qi = p_qi)
     >= (select count(*) from players where id = any(r.players)) then
    s := _shift(r.opens, r.closes, p_qi + 1);
    update races set opens = s.o, closes = s.c where id = r.id;
  end if;
  return (select json_build_object('accepted', true, 'correct', correct, 'points', points)
          from race_answers where race_id = r.id and player = uid and qi = p_qi);
end $$;

revoke all on function _shift(timestamptz[], timestamptz[], int), _sched_fill() from public, anon, authenticated;
