-- PokerStars · Iteración 7. Se aplica DESPUÉS de 001 y 002.
-- Migración aditiva: NO borra cursos, lecciones, calificaciones, imágenes ni comunidad.
-- Antes de ejecutar: realizar respaldo de la base de datos.
begin;

-- Inscripción a cursos creados desde el panel de administración.
create table if not exists public.course_enrollments (
  user_id uuid not null references public.profiles(id) on delete cascade,
  course_id uuid not null references public.courses(id) on delete cascade,
  enrolled_at timestamptz not null default now(),
  primary key (user_id, course_id)
);
create index if not exists course_enrollments_course_idx on public.course_enrollments(course_id);

-- Progreso de lecciones de cursos dinámicos. La FK evita referencias a lecciones inexistentes.
create table if not exists public.lesson_progress (
  user_id uuid not null references public.profiles(id) on delete cascade,
  lesson_id uuid not null references public.lessons(id) on delete cascade,
  completed_at timestamptz not null default now(),
  primary key (user_id, lesson_id)
);
create index if not exists lesson_progress_lesson_idx on public.lesson_progress(lesson_id);

-- Los cursos de la Iteración 3 son archivos JS, no filas de public.courses.
-- Se mantienen identificadores separados para no simular FK inexistentes.
create table if not exists public.legacy_course_enrollments (
  user_id uuid not null references public.profiles(id) on delete cascade,
  course_slug text not null check (course_slug in
    ('torneos','spin-and-go','sit-and-go','cash-games','texas-holdem','omaha','seven-card-stud')),
  enrolled_at timestamptz not null default now(),
  primary key (user_id, course_slug)
);
create table if not exists public.legacy_lesson_progress (
  user_id uuid not null references public.profiles(id) on delete cascade,
  course_slug text not null check (course_slug in
    ('torneos','spin-and-go','sit-and-go','cash-games','texas-holdem','omaha','seven-card-stud')),
  lesson_key text not null check (char_length(lesson_key) between 1 and 100 and lesson_key ~ '^[a-z0-9-]+$'),
  completed_at timestamptz not null default now(),
  primary key (user_id, course_slug, lesson_key)
);

-- Una reseña escrita por persona y curso dinámico; calificación 1–5 sigue en course_ratings.
create table if not exists public.course_reviews (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  course_id uuid not null references public.courses(id) on delete cascade,
  body text not null check (char_length(btrim(body)) between 20 and 1500),
  status text not null default 'visible' check (status in ('visible','hidden')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, course_id)
);
create index if not exists course_reviews_course_idx on public.course_reviews(course_id, created_at desc);
create index if not exists course_reviews_status_idx on public.course_reviews(status);

-- Avisos: un usuario puede reportar una reseña una sola vez.
create table if not exists public.course_review_reports (
  id uuid primary key default gen_random_uuid(),
  review_id uuid not null references public.course_reviews(id) on delete cascade,
  reporter_id uuid not null references public.profiles(id) on delete cascade,
  reason text not null check (char_length(btrim(reason)) between 10 and 500),
  status text not null default 'pending' check (status in ('pending','reviewed')),
  created_at timestamptz not null default now(),
  unique (review_id, reporter_id)
);
create index if not exists course_review_reports_status_idx on public.course_review_reports(status, created_at desc);

-- Timestamp automático y protección: ningún alumno puede restaurar reseñas ocultas
-- ni cambiar el curso o usuario de una reseña existente.
create or replace function public.guard_course_review_update()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  if new.user_id is distinct from old.user_id or new.course_id is distinct from old.course_id
     or new.id is distinct from old.id or new.created_at is distinct from old.created_at then
    raise exception 'No se permite cambiar la identidad de la reseña';
  end if;
  if new.status is distinct from old.status and not public.is_admin() then
    raise exception 'Solo un administrador puede cambiar el estado de moderación';
  end if;
  new.updated_at = now();
  return new;
end;
$$;
drop trigger if exists course_reviews_guard on public.course_reviews;
create trigger course_reviews_guard before update on public.course_reviews
for each row execute function public.guard_course_review_update();

alter table public.course_enrollments enable row level security;
alter table public.lesson_progress enable row level security;
alter table public.legacy_course_enrollments enable row level security;
alter table public.legacy_lesson_progress enable row level security;
alter table public.course_reviews enable row level security;
alter table public.course_review_reports enable row level security;

revoke all on public.course_enrollments,public.lesson_progress,public.legacy_course_enrollments,
  public.legacy_lesson_progress,public.course_reviews,public.course_review_reports from anon,authenticated;
grant select,insert,delete on public.course_enrollments,public.lesson_progress,
  public.legacy_course_enrollments,public.legacy_lesson_progress to authenticated;
grant select on public.course_reviews to anon,authenticated;
grant insert,update,delete on public.course_reviews to authenticated;
grant select,insert,update on public.course_review_reports to authenticated;

-- Inscripciones individuales: solo a cursos publicados.
drop policy if exists enroll_read on public.course_enrollments;
create policy enroll_read on public.course_enrollments for select to authenticated
using (user_id = (select auth.uid()));
drop policy if exists enroll_insert on public.course_enrollments;
create policy enroll_insert on public.course_enrollments for insert to authenticated
with check (user_id=(select auth.uid()) and exists
  (select 1 from public.courses c where c.id=course_id and c.published));
drop policy if exists enroll_delete on public.course_enrollments;
create policy enroll_delete on public.course_enrollments for delete to authenticated
using (user_id=(select auth.uid()));

-- Marcar lección: solo propia y perteneciente a un curso publicado.
drop policy if exists progress_read on public.lesson_progress;
create policy progress_read on public.lesson_progress for select to authenticated
using (user_id=(select auth.uid()));
drop policy if exists progress_insert on public.lesson_progress;
create policy progress_insert on public.lesson_progress for insert to authenticated
with check (user_id=(select auth.uid()) and exists
  (select 1 from public.lessons l join public.courses c on c.id=l.course_id
   where l.id=lesson_id and c.published));
drop policy if exists progress_delete on public.lesson_progress;
create policy progress_delete on public.lesson_progress for delete to authenticated
using (user_id=(select auth.uid()));

-- Progreso de cursos originales, solo del dueño.
drop policy if exists legacy_enroll_read on public.legacy_course_enrollments;
create policy legacy_enroll_read on public.legacy_course_enrollments for select to authenticated
using (user_id=(select auth.uid()));
drop policy if exists legacy_enroll_insert on public.legacy_course_enrollments;
create policy legacy_enroll_insert on public.legacy_course_enrollments for insert to authenticated
with check (user_id=(select auth.uid()));
drop policy if exists legacy_enroll_delete on public.legacy_course_enrollments;
create policy legacy_enroll_delete on public.legacy_course_enrollments for delete to authenticated
using (user_id=(select auth.uid()));
drop policy if exists legacy_progress_read on public.legacy_lesson_progress;
create policy legacy_progress_read on public.legacy_lesson_progress for select to authenticated
using (user_id=(select auth.uid()));
drop policy if exists legacy_progress_insert on public.legacy_lesson_progress;
create policy legacy_progress_insert on public.legacy_lesson_progress for insert to authenticated
with check (user_id=(select auth.uid()));
drop policy if exists legacy_progress_delete on public.legacy_lesson_progress;
create policy legacy_progress_delete on public.legacy_lesson_progress for delete to authenticated
using (user_id=(select auth.uid()));

-- Reseñas visibles: cualquiera las lee si el curso está publicado; autor y admin
-- pueden consultar las ocultas para revisión.
drop policy if exists reviews_public_read on public.course_reviews;
create policy reviews_public_read on public.course_reviews for select to anon,authenticated
using (status='visible' and exists
 (select 1 from public.courses c where c.id=course_id and c.published));
drop policy if exists reviews_own_read on public.course_reviews;
create policy reviews_own_read on public.course_reviews for select to authenticated
using (user_id=(select auth.uid()));
drop policy if exists reviews_admin_read on public.course_reviews;
create policy reviews_admin_read on public.course_reviews for select to authenticated
using ((select public.is_admin()));
drop policy if exists reviews_own_insert on public.course_reviews;
create policy reviews_own_insert on public.course_reviews for insert to authenticated
with check (user_id=(select auth.uid()) and status='visible' and exists
 (select 1 from public.courses c where c.id=course_id and c.published));
drop policy if exists reviews_own_or_admin_update on public.course_reviews;
create policy reviews_own_or_admin_update on public.course_reviews for update to authenticated
using (user_id=(select auth.uid()) or (select public.is_admin()))
with check (user_id=(select auth.uid()) or (select public.is_admin()));
drop policy if exists reviews_own_or_admin_delete on public.course_reviews;
create policy reviews_own_or_admin_delete on public.course_reviews for delete to authenticated
using (user_id=(select auth.uid()) or (select public.is_admin()));

-- Reportes solo para reseñas visibles de terceros; los reporteros no pueden
-- modificar status ni leer los reportes de otras personas.
drop policy if exists review_reports_insert on public.course_review_reports;
create policy review_reports_insert on public.course_review_reports for insert to authenticated
with check (reporter_id=(select auth.uid()) and status='pending' and exists
 (select 1 from public.course_reviews r where r.id=review_id and r.status='visible'
  and r.user_id<>(select auth.uid())));
drop policy if exists review_reports_read on public.course_review_reports;
create policy review_reports_read on public.course_review_reports for select to authenticated
using (reporter_id=(select auth.uid()) or (select public.is_admin()));
drop policy if exists review_reports_admin_update on public.course_review_reports;
create policy review_reports_admin_update on public.course_review_reports for update to authenticated
using ((select public.is_admin())) with check ((select public.is_admin()));

commit;

-- Consultas de verificación (opcionales):
-- select table_name from information_schema.tables where table_schema='public' and table_name in
-- ('course_enrollments','lesson_progress','legacy_course_enrollments','legacy_lesson_progress','course_reviews','course_review_reports');
-- select count(*) from public.courses;
