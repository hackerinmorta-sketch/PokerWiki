# PokerStars · Iteración 7 · Progreso y reseñas

**Base:** proyecto React + Vite + Supabase de la Iteración 6, que a su vez conserva la experiencia de cursos de la **Iteración 3**. Esta versión no recupera la Iteración 4 descartada.

## 1. Alcance implementado

- Lecciones leídas **persistentes en Supabase**, por usuario, en los cursos creados por administradores (`/academia/:slug`).
- Guardar cursos en **Mis cursos**, con porcentaje y acceso para continuar (`/mis-cursos`).
- La misma experiencia de guardado y lectura para los **siete cursos originales** (`/modalidades/:slug`), utilizando identificadores independientes porque siguen siendo contenidos JavaScript.
- Una **reseña escrita por usuario y curso dinámico**. Puede editarse y eliminarse; no afecta a las estrellas de la Iteración 6.
- Lectura pública de reseñas visibles, botón de reportar reseñas de terceros y **moderación administrativa** para ocultar/restaurar opiniones y cerrar reportes.
- Se conserva el registro, la comunidad, las imágenes, las calificaciones y los votos anteriores.

**Fuera de alcance en esta iteración:** videos, carga de múltiples imágenes por lección, certificados, quizzes con calificación, unificación de datos estáticos a Supabase, recomendaciones algorítmicas.

## 2. Instalación, sin eliminar datos

1. **Respalda** tanto el proyecto que te funciona como tu base de datos en Supabase. El ZIP es una copia nueva; no sobrescribe tu proyecto existente hasta que decidas usarla.
2. En Supabase → **SQL Editor**, ejecuta **solo** `supabase/003_progreso_y_resenas.sql` después de haber aplicado `001_esquema.sql` y `002_multimedia_y_valoraciones.sql` previamente. **No elimines las tablas existentes y no reinicies la base.**
3. Comprueba que aparezcan las seis tablas nuevas: `course_enrollments`, `lesson_progress`, `legacy_course_enrollments`, `legacy_lesson_progress`, `course_reviews`, `course_review_reports`.
4. Abre la carpeta `pokerstars` de esta versión en IntelliJ IDEA. Copia tu `.env.local` existente a esta carpeta (o usa `.env.example` como plantilla, sin copiar claves secretas).
5. En la terminal situada en la carpeta de `package.json`, ejecuta:

   ```powershell
   npm install
   npm run dev
   ```

6. Accede como estudiante a un curso dinámico, pulsa **Guardar en Mis cursos**, marca una lección y visita `/mis-cursos`. Cierra sesión, vuelve a entrar y comprueba que el porcentaje se conserva.
7. Repite la prueba con un curso original de `/modalidades`.
8. Escribe una reseña; luego entra como administrador a `/admin` y comprueba el nuevo bloque **Moderación de reseñas**. Sigue el plan `PRUEBAS_ITERACION7.md`.

**Precauciones:** jamás coloques `service_role` o una clave secreta en un archivo frontend. Los buckets `course-media` y `community-media` existentes no cambian. No se requiere crear un tercer bucket.

## 3. Diseño de datos y reglas

| Tabla SQL nueva | Propósito | Seguridad |
| --- | --- | --- |
| `course_enrollments` | Cursos dinámicos seguidos | Cada alumno solo gestiona sus inscripciones; curso publicado |
| `lesson_progress` | Lecciones dinámicas completadas | Solo usuario propio, sobre cursos publicados |
| `legacy_course_enrollments` | Los siete cursos originales seguidos | Solo usuario propio; slug en lista permitida |
| `legacy_lesson_progress` | Lecciones originales completadas | Solo usuario propio; slug validado |
| `course_reviews` | Texto, autor, estado de moderación | Una reseña por usuario/curso, visible cuando está publicada |
| `course_review_reports` | Reportes de reseñas | No puedes reportar tu propia reseña; admins revisan |

Para `course_reviews`, un **trigger** impide que un estudiante cambie `status` o reasigne autor/curso al editar. La apariencia del panel no es la barrera de seguridad; las políticas RLS y el trigger se evalúan en PostgreSQL.

Las estrellas siguen en `course_ratings` y los votos en `lesson_votes`. No hay conversiones ni sobrescrituras de datos existentes.

## 4. Comportamientos elegidos

- Una lección se completa mediante **marcado manual**. Leer/abrir la página no la marca automáticamente.
- Marcar una lección incorpora el curso a Mis cursos si todavía no estaba inscrito.
- **Quitar un curso** de Mis cursos elimina la inscripción, **no borra las lecciones ya completadas**. Al volver a seguirlo conserva el progreso.
- Sin sesión se puede navegar y marcar temporalmente los cursos originales; ese avance temporal no se guarda al salir.
- Los cursos dinámicos **no publicados** no aparecen en Mis cursos aunque existan referencias anteriores. No hay acceso a borradores para un estudiante.
- Las reseñas ocultas son visibles para su autor y administrador, pero no para el público. El autor puede editar el contenido, **sin poder quitar la restricción**.
- Las reseñas son texto simple; React las escapa por defecto. No se interpreta HTML ni se ejecutan scripts incluidos en una reseña.
- Las reseñas sólo se admiten en **cursos dinámicos**. Los siete cursos originales ahora conservan el progreso, pero aún no admiten estrellas ni reseñas públicas.

## 5. Archivos principales

- `supabase/003_progreso_y_resenas.sql`: migración incremental y políticas.
- `src/pages/Academia.jsx`: lectura persistente, inscripción, reseñas y reportes.
- `src/pages/Modalidades.jsx`: progreso de cursos originales persistente al iniciar sesión.
- `src/pages/MisCursos.jsx`: catálogo personal combinado.
- `src/components/ModeracionResenas.jsx`: moderación para administradores.
- `src/components/Estructura.jsx`, `src/pages/Cuenta.jsx`, `src/App.jsx`: rutas y acceso.
- `src/Sistema.css`: estilos para progreso y reseñas.

## 6. Pendientes antes de producción

- `npm run build` y `npm run lint` en un entorno con dependencias instaladas.
- Pruebas RLS con al menos **dos estudiantes diferentes y un administrador**.
- Accesibilidad con teclado y lector de pantalla; revisar modos reducidos de movimiento.
- Política de privacidad, reglas de moderación y tratamiento de datos personales.
- Limitación de frecuencia de publicación, anti-spam y protección frente a abuso.
- Paginación de reseñas (actualmente se cargan hasta 70 por curso) y panel de moderación (80 reseñas recientes + reportadas antiguas).
- Pruebas de integridad al eliminar cursos y lecciones y migración a React Router si se va a publicar en un hosting que requiere redirección SPA.

## 7. Riesgos y decisiones de alcance

El progreso de los cursos estáticos utiliza slugs y claves de lección mantenidos en JavaScript. Si se renombran estas claves, el progreso anterior dejará de coincidir. No se cambia ninguna en esta iteración. En un proyecto más grande convendría migrar esos cursos a tablas estables y una experiencia de aprendizaje única.

Esta entrega fue revisada **estáticamente**; no hay conexión con tu proyecto personal de Supabase en este entorno. **No se ha acreditado** la compilación de producción ni la prueba real de RLS hasta completar el plan en tu equipo.
