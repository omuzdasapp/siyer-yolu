-- Siyer Yolu · canlı yarış sunucusu (Supabase)
-- Supabase panelinde: SQL Editor → bu dosyanın tamamını yapıştır → Run.
-- Ayrıca: Authentication → Sign In / Providers → "Allow anonymous sign-ins" AÇIK olmalı.
--
-- Kurgu: Oyuncular e-posta vermez; uygulama anonim bir oturum açar ve oyuncu yalnızca takma ad seçer.
-- Tablolara doğrudan erişim kapalıdır (RLS açık, politika yok); her şey aşağıdaki fonksiyonlarla yapılır.
-- Zaman çizelgesi sunucudadır: 5 soru, her soru 12 sn açık + 4 sn cevap gösterimi. Puanı sunucu hesaplar.


create table if not exists players (
  id uuid primary key references auth.users(id) on delete cascade,
  nickname text not null unique,
  rating int not null default 1000,
  games int not null default 0,
  wins int not null default 0,
  draws int not null default 0,
  losses int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists questions (
  id int primary key,
  correct smallint not null default 0  -- uygulamadaki soru bankasında doğru cevap her zaman 0. seçenektir
);

create table if not exists queue (
  player uuid primary key references players(id) on delete cascade,
  seen_at timestamptz not null default now()
);

create table if not exists matches (
  id uuid primary key default gen_random_uuid(),
  p1 uuid references players(id) on delete set null,
  p2 uuid references players(id) on delete set null,
  qids int[] not null,
  starts_at timestamptz not null,
  rated boolean not null default false,
  p1_delta int, p2_delta int,
  created_at timestamptz not null default now()
);
create index if not exists matches_p1 on matches(p1, created_at desc);
create index if not exists matches_p2 on matches(p2, created_at desc);

create table if not exists answers (
  match_id uuid references matches(id) on delete cascade,
  player uuid,
  qi smallint not null check (qi between 0 and 4),
  choice smallint not null,
  correct boolean not null,
  points int not null,
  at timestamptz not null default now(),
  primary key (match_id, player, qi)
);

alter table players enable row level security;
alter table questions enable row level security;
alter table queue enable row level security;
alter table matches enable row level security;
alter table answers enable row level security;

-- Soru kimlikleri: 20 ders × 4 soru (11..14, 21..24, … 201..204)
insert into questions(id) select l * 10 + q from generate_series(1, 20) l, generate_series(1, 4) q on conflict do nothing;

-- Zaman sabitleri
create or replace function _q_open() returns interval language sql immutable as $$ select interval '12 seconds' $$;
create or replace function _q_slot() returns interval language sql immutable as $$ select interval '16 seconds' $$;
create or replace function _match_end(m matches) returns timestamptz language sql immutable as $$ select m.starts_at + _q_slot() * 5 $$;

-- Takma ad
create or replace function set_nickname(p_nick text) returns json
language plpgsql security definer set search_path = public as $$
declare n text := btrim(regexp_replace(coalesce(p_nick, ''), '\s+', ' ', 'g'));
begin
  if auth.uid() is null then raise exception 'Oturum yok'; end if;
  if n !~ '^[A-Za-zÇĞİÖŞÜçğıöşü0-9_ ]{3,16}$' then
    raise exception 'Takma ad 3-16 harf/rakam olmalı.';
  end if;
  if lower(n) ~ '(amk|aq|sik|siktir|oç|orospu|piç|yarrak|göt|ibne|kahpe|şerefsiz|admin|moderat)' then
    raise exception 'Bu takma ad kullanılamaz.';
  end if;
  if exists (select 1 from players where lower(nickname) = lower(n) and id <> auth.uid()) then
    raise exception 'Bu takma ad alınmış.';
  end if;
  insert into players(id, nickname) values (auth.uid(), n)
  on conflict (id) do update set nickname = excluded.nickname;
  return (select row_to_json(p) from (select nickname, rating, games, wins, draws, losses from players where id = auth.uid()) p);
end $$;

create or replace function me() returns json
language sql security definer set search_path = public as $$
  select row_to_json(p) from (
    select nickname, rating, games, wins, draws, losses,
      (select count(*) + 1 from players o where o.rating > pl.rating and o.games > 0) as rank
    from players pl where id = auth.uid()) p
$$;

-- Eşleşme: kuyrukta bekleyen biri varsa maç kurar, yoksa kuyruğa girer. İstemci ~1,5 sn'de bir çağırır.
create or replace function find_match() returns json
language plpgsql security definer set search_path = public as $$
declare uid uuid := auth.uid(); other uuid; mid uuid; m matches;
begin
  if uid is null or not exists (select 1 from players where id = uid) then raise exception 'Önce takma ad seç.'; end if;
  perform pg_advisory_xact_lock(424242);

  -- Zaten kurulmuş ve bitmemiş bir maçım var mı?
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
  values (other, uid,
          (select array_agg(id) from (select id from questions order by random() limit 5) q),
          now() + interval '5 seconds')
  returning id into mid;
  return json_build_object('status', 'matched', 'match_id', mid);
end $$;

create or replace function cancel_search() returns void
language sql security definer set search_path = public as $$ delete from queue where player = auth.uid() $$;

-- Maç durumu. Rakibin o anki sorudaki cevabı açıklanmaz; yalnızca "cevapladı" bilgisi döner.
create or replace function match_state(p_match uuid) returns json
language plpgsql security definer set search_path = public as $$
declare uid uuid := auth.uid(); m matches; opp uuid; cur int; res json;
begin
  select * into m from matches where id = p_match;
  if not found or uid not in (m.p1, m.p2) then raise exception 'Maç bulunamadı'; end if;
  opp := case when uid = m.p1 then m.p2 else m.p1 end;
  cur := floor(extract(epoch from (now() - m.starts_at)) / extract(epoch from _q_slot()))::int;
  select json_build_object(
    'now', now(), 'starts_at', m.starts_at, 'qids', m.qids,
    'open_ms', extract(epoch from _q_open()) * 1000, 'slot_ms', extract(epoch from _q_slot()) * 1000,
    'me', (select json_build_object('nickname', nickname, 'rating', rating) from players where id = uid),
    'opp', (select json_build_object('nickname', nickname, 'rating', rating) from players where id = opp),
    'mine', coalesce((select json_agg(json_build_object('qi', qi, 'choice', choice, 'correct', correct, 'points', points) order by qi)
                       from answers where match_id = m.id and player = uid), '[]'),
    'theirs', coalesce((select json_agg(case
                         when qi < cur or now() >= _match_end(m)
                           then json_build_object('qi', qi, 'answered', true, 'correct', correct, 'points', points)
                         else json_build_object('qi', qi, 'answered', true) end order by qi)
                       from answers where match_id = m.id and player = opp), '[]'),
    'finished', now() >= _match_end(m),
    'rated', m.rated,
    'my_delta', case when uid = m.p1 then m.p1_delta else m.p2_delta end
  ) into res;
  return res;
end $$;

-- Cevap: yalnızca sorunun açık olduğu süre içinde, her soruya bir kez. Puan = 100 + hız bonusu (en fazla 50).
create or replace function submit_answer(p_match uuid, p_qi int, p_choice int) returns json
language plpgsql security definer set search_path = public as $$
declare uid uuid := auth.uid(); m matches; opens timestamptz; left_s numeric; ok boolean; pts int;
begin
  select * into m from matches where id = p_match;
  if not found or uid not in (m.p1, m.p2) then raise exception 'Maç bulunamadı'; end if;
  if p_qi < 0 or p_qi > 4 then raise exception 'Geçersiz soru'; end if;
  opens := m.starts_at + _q_slot() * p_qi;
  if now() < opens or now() > opens + _q_open() + interval '700 milliseconds' then
    return json_build_object('accepted', false, 'reason', 'Süre doldu');
  end if;
  ok := p_choice = (select correct from questions where id = m.qids[p_qi + 1]);
  left_s := greatest(0, extract(epoch from (opens + _q_open() - now())));
  pts := case when ok then 100 + round(50 * left_s / extract(epoch from _q_open()))::int else 0 end;
  insert into answers(match_id, player, qi, choice, correct, points) values (m.id, uid, p_qi, p_choice, ok, pts)
  on conflict do nothing;
  return (select json_build_object('accepted', true, 'correct', correct, 'points', points)
          from answers where match_id = m.id and player = uid and qi = p_qi);
end $$;

-- Maç sonu: puanları bir kez işler (Elo, K=32). Her iki istemci de çağırabilir; ikinci çağrı bir şey değiştirmez.
create or replace function finish_match(p_match uuid) returns json
language plpgsql security definer set search_path = public as $$
declare uid uuid := auth.uid(); m matches; s1 int; s2 int; r1 int; r2 int; e1 numeric; res1 numeric; d1 int;
begin
  select * into m from matches where id = p_match for update;
  if not found or uid not in (m.p1, m.p2) then raise exception 'Maç bulunamadı'; end if;
  if now() < _match_end(m) then raise exception 'Maç henüz bitmedi'; end if;
  if not m.rated and m.p1 is not null and m.p2 is not null then
    select coalesce(sum(points), 0) into s1 from answers where match_id = m.id and player = m.p1;
    select coalesce(sum(points), 0) into s2 from answers where match_id = m.id and player = m.p2;
    select rating into r1 from players where id = m.p1;
    select rating into r2 from players where id = m.p2;
    e1 := 1 / (1 + power(10, (r2 - r1) / 400.0));
    res1 := case when s1 > s2 then 1 when s1 < s2 then 0 else 0.5 end;
    d1 := round(32 * (res1 - e1));
    update players set rating = greatest(100, rating + d1), games = games + 1,
      wins = wins + (res1 = 1)::int, draws = draws + (res1 = 0.5)::int, losses = losses + (res1 = 0)::int where id = m.p1;
    update players set rating = greatest(100, rating - d1), games = games + 1,
      wins = wins + (res1 = 0)::int, draws = draws + (res1 = 0.5)::int, losses = losses + (res1 = 1)::int where id = m.p2;
    update matches set rated = true, p1_delta = d1, p2_delta = -d1 where id = m.id;
  end if;
  return match_state(p_match);
end $$;

create or replace function leaderboard() returns json
language sql security definer set search_path = public as $$
  select coalesce(json_agg(r), '[]') from (
    select nickname, rating, wins, games, (id = auth.uid()) as me
    from players where games > 0 order by rating desc, wins desc limit 20) r
$$;

-- Hesabı ve tüm yarış verisini sil (Google Play hesap silme şartı)
create or replace function delete_me() returns void
language plpgsql security definer set search_path = public, auth as $$
begin
  if auth.uid() is null then return; end if;
  delete from answers where player = auth.uid();
  delete from auth.users where id = auth.uid();  -- players ve queue kayıtları zincirleme silinir
end $$;

revoke all on all functions in schema public from public, anon;
grant execute on function set_nickname(text), me(), find_match(), cancel_search(), match_state(uuid),
  submit_answer(uuid, int, int), finish_match(uuid), leaderboard(), delete_me() to authenticated;
