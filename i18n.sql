-- Siyer Yolu · bildirim aboneliği 5 dil (tr, es, en, de, ru). Tekrar çalıştırmak güvenlidir.
alter table push_subs drop constraint if exists push_subs_lang_check;
alter table push_subs add constraint push_subs_lang_check check (lang in ('tr', 'es', 'en', 'de', 'ru'));

create or replace function push_subscribe(p_endpoint text, p_p256dh text, p_auth text, p_lang text, p_tz text, p_hour int)
returns void
language plpgsql security definer set search_path = public as $$
begin
  if auth.uid() is null then raise exception 'Oturum yok'; end if;
  if p_endpoint !~ '^https://' or length(p_endpoint) > 1000 or length(p_p256dh) > 200 or length(p_auth) > 100 then
    raise exception 'Geçersiz abonelik';
  end if;
  if p_lang is null or p_lang not in ('tr', 'es', 'en', 'de', 'ru') then p_lang := 'tr'; end if;
  if p_hour is null or p_hour < 0 or p_hour > 23 then p_hour := 8; end if;
  if p_tz is null or not exists (select 1 from pg_timezone_names where name = p_tz) then p_tz := 'Europe/Istanbul'; end if;
  insert into push_subs(endpoint, p256dh, auth, lang, tz, hour, owner)
  values (p_endpoint, p_p256dh, p_auth, p_lang, p_tz, p_hour, auth.uid())
  on conflict (endpoint) do update
    set p256dh = excluded.p256dh, auth = excluded.auth, lang = excluded.lang,
        tz = excluded.tz, hour = excluded.hour, owner = excluded.owner;
end $$;
