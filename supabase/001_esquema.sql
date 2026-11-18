-- PokerStars académico · Migración inicial (Supabase / PostgreSQL)
-- Ejecutar desde SQL Editor de un proyecto Supabase NUEVO.
-- Los roles y RLS se validan en el servidor, no en React.

create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null default 'Usuario' check (char_length(display_name) between 1 and 40),
  role text not null default 'student' check (role in ('student','admin')),
  created_at timestamptz not null default now()
);

create table if not exists public.courses (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references public.profiles(id),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$' and char_length(slug) <= 70),
  title text not null check (char_length(title) between 3 and 100),
  summary text not null check (char_length(summary) between 15 and 1000),
  level text not null default 'Principiante' check (level in ('Principiante','Intermedio','Avanzado')),
  cover_url text check (cover_url is null or char_length(cover_url) <= 500),
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.lessons (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses(id) on delete cascade,
  title text not null check (char_length(title) between 1 and 130),
  body text not null check (char_length(body) between 30 and 20000),
  position integer not null default 1 check (position between 1 and 999),
  created_at timestamptz not null default now()
);

create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references public.profiles(id) on delete cascade,
  category text not null check (category in ('Preguntas','Estrategia','Modalidades','Presentaciones','General')),
  title text not null check (char_length(title) between 8 and 140),
  body text not null check (char_length(body) between 20 and 5000),
  created_at timestamptz not null default now()
);

create table if not exists public.comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.posts(id) on delete cascade,
  author_id uuid not null references public.profiles(id) on delete cascade,
  body text not null check (char_length(body) between 2 and 3000),
  created_at timestamptz not null default now()
);

create table if not exists public.reports (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.posts(id) on delete cascade,
  reporter_id uuid not null references public.profiles(id) on delete cascade,
  reason text not null check (char_length(reason) between 10 and 500),
  status text not null default 'pending' check (status in ('pending','reviewed')),
  created_at timestamptz not null default now(),
  unique (post_id, reporter_id)
);

create index if not exists courses_author_idx on public.courses(author_id);
create index if not exists lessons_course_order_idx on public.lessons(course_id, position);
create index if not exists posts_author_idx on public.posts(author_id);
create index if not exists posts_created_idx on public.posts(created_at desc);
create index if not exists comments_post_created_idx on public.comments(post_id, created_at);
create index if not exists comments_author_idx on public.comments(author_id);
create index if not exists reports_reporter_idx on public.reports(reporter_id);

-- Trigger de perfil: se ejecuta con permisos de servidor.
-- Los metadatos públicos NUNCA definen el rol del usuario.
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  insert into public.profiles(id, display_name, role)
  values (new.id,
          coalesce(nullif(left(trim(new.raw_user_meta_data ->> 'display_name'),40),''),'Usuario'),
          'student')
  on conflict (id) do nothing;
  return new;
end;
$$;
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
for each row execute function public.handle_new_user();

-- is_admin() usa SECURITY DEFINER para no crear una política RLS recursiva.
create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = '' as $$
  select exists(select 1 from public.profiles where id = (select auth.uid()) and role='admin');
$$;
revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to authenticated;

create or replace function public.touch_course()
returns trigger language plpgsql set search_path = '' as $$
begin new.updated_at=now(); return new; end;
$$;
drop trigger if exists courses_timestamp on public.courses;
create trigger courses_timestamp before update on public.courses
for each row execute function public.touch_course();

alter table public.profiles enable row level security;
alter table public.courses enable row level security;
alter table public.lessons enable row level security;
alter table public.posts enable row level security;
alter table public.comments enable row level security;
alter table public.reports enable row level security;

-- Permisos explícitos; NO se concede UPDATE sobre perfiles/roles.
revoke all on public.profiles, public.courses, public.lessons, public.posts, public.comments, public.reports from anon, authenticated;
grant select on public.profiles to anon, authenticated;
grant select on public.courses, public.lessons, public.posts, public.comments to anon, authenticated;
grant insert, update, delete on public.courses, public.lessons to authenticated;
grant insert, delete on public.posts, public.comments to authenticated;
grant insert, select, update on public.reports to authenticated;

-- Lectura pública de seudónimos; sin emails ni contraseñas en esta tabla.
drop policy if exists profiles_read on public.profiles;
create policy profiles_read on public.profiles for select to anon,authenticated using (true);

-- Cursos públicos solo si están publicados; administradores pueden leer borradores.
drop policy if exists courses_public_read on public.courses;
create policy courses_public_read on public.courses for select to anon,authenticated using (published);
drop policy if exists courses_admin_read on public.courses;
create policy courses_admin_read on public.courses for select to authenticated using ((select public.is_admin()));
drop policy if exists courses_admin_insert on public.courses;
create policy courses_admin_insert on public.courses for insert to authenticated
with check ((select public.is_admin()) and author_id = (select auth.uid()));
drop policy if exists courses_admin_update on public.courses;
create policy courses_admin_update on public.courses for update to authenticated
using ((select public.is_admin())) with check ((select public.is_admin()));
drop policy if exists courses_admin_delete on public.courses;
create policy courses_admin_delete on public.courses for delete to authenticated using ((select public.is_admin()));

-- Lecciones visibles solo si el curso está publicado o se es administrador.
drop policy if exists lessons_public_read on public.lessons;
create policy lessons_public_read on public.lessons for select to anon,authenticated
using (exists(select 1 from public.courses c where c.id = course_id and c.published));
drop policy if exists lessons_admin_read on public.lessons;
create policy lessons_admin_read on public.lessons for select to authenticated using ((select public.is_admin()));
drop policy if exists lessons_admin_insert on public.lessons;
create policy lessons_admin_insert on public.lessons for insert to authenticated with check ((select public.is_admin()));
drop policy if exists lessons_admin_update on public.lessons;
create policy lessons_admin_update on public.lessons for update to authenticated
using ((select public.is_admin())) with check ((select public.is_admin()));
drop policy if exists lessons_admin_delete on public.lessons;
create policy lessons_admin_delete on public.lessons for delete to authenticated using ((select public.is_admin()));

-- Foro: cualquier persona lee, solo autenticados publican y cada autor controla lo suyo.
drop policy if exists posts_read on public.posts;
create policy posts_read on public.posts for select to anon,authenticated using (true);
drop policy if exists posts_insert on public.posts;
create policy posts_insert on public.posts for insert to authenticated
with check (author_id = (select auth.uid()));
drop policy if exists posts_delete on public.posts;
create policy posts_delete on public.posts for delete to authenticated
using (author_id=(select auth.uid()) or (select public.is_admin()));

drop policy if exists comments_read on public.comments;
create policy comments_read on public.comments for select to anon,authenticated using (true);
drop policy if exists comments_insert on public.comments;
create policy comments_insert on public.comments for insert to authenticated
with check (author_id=(select auth.uid()));
drop policy if exists comments_delete on public.comments;
create policy comments_delete on public.comments for delete to authenticated
using (author_id=(select auth.uid()) or (select public.is_admin()));

-- Reportes: un estudiante solo puede crear los suyos; el admin puede revisarlos.
drop policy if exists reports_insert on public.reports;
create policy reports_insert on public.reports for insert to authenticated
with check (reporter_id=(select auth.uid()));
drop policy if exists reports_read on public.reports;
create policy reports_read on public.reports for select to authenticated
using (reporter_id=(select auth.uid()) or (select public.is_admin()));
drop policy if exists reports_admin_update on public.reports;
create policy reports_admin_update on public.reports for update to authenticated
using ((select public.is_admin())) with check ((select public.is_admin()));

-- Al registrar al primer administrador, usar SQL Editor (con permisos de proyecto):
-- update public.profiles set role = 'admin'
-- where id = (select id from auth.users where email = 'TU_CORREO@EJEMPLO.COM');
-- NO pongas esa consulta en el frontend ni expongas una clave de servicio.
