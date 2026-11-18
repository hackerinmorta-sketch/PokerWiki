-- PokerWiki · Iteración 8. Ejecutar una sola vez después de 001, 002 y 003.
-- Migración incremental: NO elimina ni reemplaza cursos, lecciones ni datos.
-- Solo almacenamos el ID validado de un video de YouTube, NO el archivo multimedia.

begin;

alter table public.lessons
  add column if not exists youtube_video_id text;

alter table public.lessons
  add column if not exists video_caption text;

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conrelid = 'public.lessons'::regclass
      and conname = 'lessons_youtube_video_id_formato'
  ) then
    alter table public.lessons
      add constraint lessons_youtube_video_id_formato
      check (youtube_video_id is null or youtube_video_id ~ '^[a-zA-Z0-9_-]{11}$');
  end if;

  if not exists (
    select 1 from pg_constraint
    where conrelid = 'public.lessons'::regclass
      and conname = 'lessons_video_caption_longitud'
  ) then
    alter table public.lessons
      add constraint lessons_video_caption_longitud
      check (video_caption is null or char_length(video_caption) <= 300);
  end if;
end
$$;

comment on column public.lessons.youtube_video_id is 'ID de 11 caracteres de YouTube. Reproductor externo activado bajo demanda.';
comment on column public.lessons.video_caption is 'Texto descriptivo opcional del video, máximo 300 caracteres.';

-- Se heredan las políticas RLS ya existentes de public.lessons.
-- No se conceden permisos nuevos a estudiantes ni al rol anon.
commit;
