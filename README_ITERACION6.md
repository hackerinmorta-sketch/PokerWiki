# PokerStars · Iteración 6: multimedia y retroalimentación

Proyecto académico no oficial. **Base de código:** sistema v0.5 construido sobre la **Iteración 3** de cursos. No se utilizó la Iteración 4.

## Qué implementa

- En **Administración**, portada de curso y **una imagen por lección**, subidas desde la computadora o celular. Vista previa, texto alternativo y pie de imagen.
- En **Academia**, calificaciones de **1 a 5 estrellas** por curso y promedio público. Solo una calificación por cuenta y curso; se puede cambiar o quitar.
- En **cada lección**, un voto **Útil / No útil** por cuenta, que también se puede modificar o quitar. Totales públicos sin revelar quién votó.
- En **Comunidad**, una imagen por tema y otra por respuesta. La captura se muestra en la conversación y queda almacenada en Supabase Storage.
- Conserva los cursos, lecciones, usuarios, publicaciones y respuestas existentes mediante **migración incremental**.

## Importante: orden de instalación

1. **Haz una copia de seguridad** de tu proyecto actual y exporta/respáldate la base de datos de Supabase antes de ejecutar SQL. No borres las seis tablas existentes.
2. En el proyecto de Supabase que YA estás utilizando, abre **SQL Editor → New Query** y ejecuta **solo** `supabase/002_multimedia_y_valoraciones.sql`. **NO vuelvas a ejecutar `001_esquema.sql`** ni modifiques manualmente los roles.
3. Debería aparecer `Success. No rows returned.`. Verifica que existen `course_ratings`, `lesson_votes`, `course_rating_summary` y `lesson_vote_summary`.
4. **Crea los buckets desde el Dashboard de Supabase → Storage → New bucket**:
   - `course-media` · **Public** · 5 MiB · JPG, PNG y WebP.
   - `community-media` · **Public** · 5 MiB · JPG, PNG y WebP.
   Si tu interfaz permite restringir MIME, introduce `image/jpeg`, `image/png` e `image/webp`.
   No se crean buckets mediante el SQL porque la documentación de Supabase recomienda administrarlos desde Storage y no modificar directamente sus tablas internas. **Configura el límite de 5 MiB en cada bucket**, incluso si ya existe un límite en el formulario React.
5. Actualiza el proyecto React: abre esta versión del ZIP en una carpeta nueva, **no sobrescribas tu proyecto funcional sin guardar copia**. Copia tu propio `.env.local` de la versión actual a esta carpeta (no viene dentro del ZIP).
6. Abre la carpeta que contiene `package.json` en IntelliJ y ejecuta `npm install`, `npm run dev`, y, una vez que funcione, `npm run build`.
7. Prueba con **dos cuentas**, una administradora y otra estudiante; revisa los casos de `PRUEBAS_ITERACION6.md`.

### Comandos en IntelliJ

```powershell
npm install
npm run dev
```

Dirección típica: `http://localhost:5173/` (puede variar si el puerto está ocupado).

**No ejecutar `node src/App.jsx`**: los componentes `.jsx` se procesan con Vite.

### Comprobaciones SQL opcionales

```sql
select table_name from information_schema.tables
where table_schema = 'public' and table_name in ('course_ratings','lesson_votes');

select id, name, public, file_size_limit from storage.buckets
where id in ('course-media','community-media');

select * from public.course_rating_summary limit 5;
select * from public.lesson_vote_summary limit 5;
```

### Seguridad y privacidad

- Las imágenes están en buckets **públicos**: cualquiera con la URL puede acceder, incluso si un curso se guarda como borrador. No subas datos privados ni archivos que no tengas derecho a publicar.
- Límites: JPG, PNG o WebP; **5 MiB** por imagen (frontend y bucket de Storage). SVG y GIF no están habilitados.
- **Administradores:** cargan portadas y fotos de lecciones. **Usuarios autenticados:** solo cargan imágenes de comunidad en una carpeta propia. La autorización depende de políticas **RLS de PostgreSQL/Storage**, no de esconder botones.
- El código del frontend solo usa una clave **publishable/anon**. Nunca uses `service_role` ni claves secretas en `.env.local`.
- Las valoraciones individuales solo las consulta su autor. Las vistas públicas devuelven **promedios y conteos, sin identificadores de usuarios**. Son vistas agregadas con filtro explícito de cursos publicados; revisa ese filtro si alguna vez modificas las vistas.
- Las imágenes de los cursos y comunidad son públicas. Por ahora el sistema **no elimina automáticamente metadatos EXIF**. Antes de subir capturas o fotos, revisa si muestran datos personales.

### Limitaciones realistas

- Se permite **una imagen por lección, una por publicación y una por respuesta**. Una galería o editor con imágenes intercaladas entre múltiples párrafos requerirá un modelo de bloques de contenido.
- La retroalimentación aplica a los **cursos dinámicos de `/academia`**, no automáticamente a los siete cursos estáticos originales de `/modalidades`.
- No hay moderación automática de imágenes, análisis antivirus, prevención avanzada de spam, redimensionamiento de imágenes ni compresión en cliente. Antes de abrir registros al público, habría que incorporar estos controles.
- Si se borra un curso o publicación con muchos comentarios fuera de la pantalla actual, podría quedar algún archivo huérfano en Storage. También pueden quedar archivos huérfanos por interrupciones de red. Requiere rutina administrativa de limpieza programada.
- Las calificaciones/likes se actualizan al enviar una valoración o refrescar. **No son eventos en tiempo real entre navegadores**.
- El borrado de una cuenta y sus archivos asociados todavía no está automatizado.

## Archivos principales modificados

| Archivo | Cambio |
| --- | --- |
| `supabase/002_multimedia_y_valoraciones.sql` | Columnas, tablas, vistas, buckets y políticas RLS. |
| `src/components/SelectorImagen.jsx` | Selección y vista previa de archivos locales. |
| `src/lib/media.js` | Validación, carga y eliminación de imágenes. |
| `src/pages/Admin.jsx` | Editor de portada e imágenes de lecciones. |
| `src/pages/Academia.jsx` | Lectura de imágenes, estrellas y votos. |
| `src/pages/Comunidad.jsx` | Adjuntos en publicaciones y respuestas. |
| `src/Sistema.css` | Estilos correspondientes. |

## Recomendación de despliegue

En el entorno real, configura límites de tamaño, políticas anti-spam, conservación y eliminación de datos, reporte/moderación de imágenes, privacidad y pruebas con usuarios distintos. La presente implementación es una **base de ingeniería de software para tu proyecto universitario**, no una plataforma comercial auditada.
