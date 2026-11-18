-- POKERSTARS / ITERACION 6
-- Ejecutar SOLO DESPUES de 001_esquema.sql, desde SQL Editor de Supabase.
-- Migracion incremental: conserva cursos, lecciones, usuarios y conversaciones existentes.
-- No introduce nuevos administradores ni cambia roles.

begin;

-- 1. Imagenes (UNA por leccion, tema y respuesta de comunidad en esta iteracion).
alter table public.lessons
  add column if not exists image_url text check (image_url is null or char_length(image_url) <= 1000),
  add column if not exists image_alt text check (image_alt is null or char_length(image_alt) <= 180),
  add column if not exists image_caption text check (image_caption is null or char_length(image_caption) <= 300);

alter table public.comments
  add column if not exists image_url text check (image_url is null or char_length(image_url) <= 1000),
  add column if not exists image_alt text check (image_alt is null or char_length(image_alt) <= 180);

alter table public.posts
  add column if not exists image_url text check (image_url is null or char_length(image_url) <= 1000),
  add column if not exists image_alt text check (image_alt is null or char_length(image_alt) <= 180);

-- El texto alternativo es obligatorio cuando se guarda una imagen nueva.
do $$ begin
  if not exists (select 1 from pg_constraint where conname='lessons_image_alt_required' and conrelid='public.lessons'::regclass) then
    alter table public.lessons add constraint lessons_image_alt_required
      check (image_url is null or (image_alt is not null and char_length(btrim(image_alt)) between 5 and 180));
  end if;
  if not exists (select 1 from pg_constraint where conname='comments_image_alt_required' and conrelid='public.comments'::regclass) then
    alter table public.comments add constraint comments_image_alt_required
      check (image_url is null or (image_alt is not null and char_length(btrim(image_alt)) between 5 and 180));
  end if;
  if not exists (select 1 from pg_constraint where conname='posts_image_alt_required' and conrelid='public.posts'::regclass) then
    alter table public.posts add constraint posts_image_alt_required
      check (image_url is null or (image_alt is not null and char_length(btrim(image_alt)) between 5 and 180));
  end if;
end $$;

-- 2. Un único voto por usuario y curso; el valor puede actualizarse o borrarse.
create table if not exists public.course_ratings (
  course_id uuid not null references public.courses(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  rating smallint not null check (rating between 1 and 5),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (course_id, user_id)
);
create index if not exists course_ratings_user_idx on public.course_ratings(user_id);

-- 3. Una reacción por usuario y lección: 1 = útil, -1 = no útil.
create table if not exists public.lesson_votes (
  lesson_id uuid not null references public.lessons(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  vote smallint not null check (vote in (-1, 1)),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (lesson_id, user_id)
);
create index if not exists lesson_votes_user_idx on public.lesson_votes(user_id);

create or replace function public.touch_feedback()
returns trigger language plpgsql set search_path = '' as $$
begin new.updated_at = now(); return new; end;
$$;
drop trigger if exists course_ratings_timestamp on public.course_ratings;
create trigger course_ratings_timestamp before update on public.course_ratings
for each row execute function public.touch_feedback();
drop trigger if exists lesson_votes_timestamp on public.lesson_votes;
create trigger lesson_votes_timestamp before update on public.lesson_votes
for each row execute function public.touch_feedback();

alter table public.course_ratings enable row level security;
alter table public.lesson_votes enable row level security;
revoke all on public.course_ratings, public.lesson_votes from anon, authenticated;
grant select, insert, update, delete on public.course_ratings, public.lesson_votes to authenticated;

-- Las calificaciones individuales son privadas para el propio usuario;
-- solo se permite valorar cursos PUBLICADOS.
drop policy if exists course_ratings_own_read on public.course_ratings;
create policy course_ratings_own_read on public.course_ratings for select to authenticated
using (user_id = (select auth.uid()));
drop policy if exists course_ratings_own_insert on public.course_ratings;
create policy course_ratings_own_insert on public.course_ratings for insert to authenticated
with check (user_id = (select auth.uid()) and exists (
  select 1 from public.courses c where c.id=course_id and c.published
));
drop policy if exists course_ratings_own_update on public.course_ratings;
create policy course_ratings_own_update on public.course_ratings for update to authenticated
using (user_id = (select auth.uid()))
with check (user_id = (select auth.uid()) and exists (
  select 1 from public.courses c where c.id=course_id and c.published
));
drop policy if exists course_ratings_own_delete on public.course_ratings;
create policy course_ratings_own_delete on public.course_ratings for delete to authenticated
using (user_id = (select auth.uid()));

-- Solo se puede votar sobre lecciones de cursos publicados.
drop policy if exists lesson_votes_own_read on public.lesson_votes;
create policy lesson_votes_own_read on public.lesson_votes for select to authenticated
using (user_id = (select auth.uid()));
drop policy if exists lesson_votes_own_insert on public.lesson_votes;
create policy lesson_votes_own_insert on public.lesson_votes for insert to authenticated
with check (user_id = (select auth.uid()) and exists (
  select 1 from public.lessons l join public.courses c on c.id=l.course_id
  where l.id=lesson_id and c.published
));
drop policy if exists lesson_votes_own_update on public.lesson_votes;
create policy lesson_votes_own_update on public.lesson_votes for update to authenticated
using (user_id = (select auth.uid()))
with check (user_id = (select auth.uid()) and exists (
  select 1 from public.lessons l join public.courses c on c.id=l.course_id
  where l.id=lesson_id and c.published
));
drop policy if exists lesson_votes_own_delete on public.lesson_votes;
create policy lesson_votes_own_delete on public.lesson_votes for delete to authenticated
using (user_id = (select auth.uid()));

-- 4. Vistas agregadas, de lectura publica, sin identificadores de usuarios.
-- Son vistas bajo el propietario: filtramos explicitamente por published.
-- No ampliar para exponer datos individuales ni cursos borrador.
create or replace view public.course_rating_summary
with (security_barrier = true)
as select c.id as course_id,
    count(r.rating)::bigint as rating_count,
    round(avg(r.rating)::numeric, 1) as rating_average
from public.courses c
left join public.course_ratings r on r.course_id=c.id
where c.published = true
group by c.id;

create or replace view public.lesson_vote_summary
with (security_barrier = true)
as select l.id as lesson_id,
    l.course_id,
    coalesce(sum(case when v.vote=1 then 1 else 0 end),0)::bigint as likes,
    coalesce(sum(case when v.vote=-1 then 1 else 0 end),0)::bigint as dislikes
from public.lessons l
join public.courses c on c.id=l.course_id and c.published = true
left join public.lesson_votes v on v.lesson_id=l.id
group by l.id, l.course_id;

revoke all on public.course_rating_summary, public.lesson_vote_summary from public, anon, authenticated;
grant select on public.course_rating_summary, public.lesson_vote_summary to anon, authenticated;

-- 5. Políticas de Storage. IMPORTANTE: crea PRIMERO los buckets DESDE EL DASHBOARD.
-- En Storage -> New bucket, crear 'course-media' y 'community-media', ambos PUBLICOS,
-- con limite de 5 MiB y MIME image/jpeg, image/png e image/webp.
-- No modificar storage.buckets directamente desde SQL: usar la API o el Dashboard oficial.
-- Los archivos públicos son visibles por URL; cargar o borrar requiere las siguientes politicas.

-- Solo administradores suben imágenes de cursos (carpetas covers/ y lessons/).
drop policy if exists ps_course_media_admin_insert on storage.objects;
create policy ps_course_media_admin_insert on storage.objects for insert to authenticated
with check (bucket_id='course-media' and (select public.is_admin()) and
  (storage.foldername(name))[1] in ('covers','lessons'));
drop policy if exists ps_course_media_admin_select on storage.objects;
create policy ps_course_media_admin_select on storage.objects for select to authenticated
using (bucket_id='course-media' and (select public.is_admin()));
drop policy if exists ps_course_media_admin_delete on storage.objects;
create policy ps_course_media_admin_delete on storage.objects for delete to authenticated
using (bucket_id='course-media' and (select public.is_admin()));

-- En comunidad, cada persona solo sube y borra archivos en su carpeta <uuid>/.
drop policy if exists ps_community_media_insert on storage.objects;
create policy ps_community_media_insert on storage.objects for insert to authenticated
with check (bucket_id='community-media' and (storage.foldername(name))[1] = (select auth.uid())::text);
drop policy if exists ps_community_media_select on storage.objects;
create policy ps_community_media_select on storage.objects for select to authenticated
using (bucket_id='community-media' and
  ((storage.foldername(name))[1] = (select auth.uid())::text or (select public.is_admin())));
drop policy if exists ps_community_media_delete on storage.objects;
create policy ps_community_media_delete on storage.objects for delete to authenticated
using (bucket_id='community-media' and
  ((storage.foldername(name))[1] = (select auth.uid())::text or (select public.is_admin())));

commit;

-- COMPROBACION (opcional):
-- select table_name from information_schema.tables where table_schema='public' order by 1;
-- select id, name, public from storage.buckets where id in ('course-media','community-media');
-- select * from public.course_rating_summary limit 5;
