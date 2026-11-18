# PokerWiki · Iteración 9: simplificación del aprendizaje

Esta versión continúa directamente desde **Iteración 8**. Mantiene React, Vite, la autenticación con Supabase, las migraciones 001 a 004, la comunidad, el panel de administración, las imágenes, los videos, el progreso, las valoraciones y las reseñas.

## Cambios

1. **Calificación al final.** El formulario de estrellas se movió debajo de todas las lecciones, junto a las reseñas escritas. Sigue siendo voluntario y no exige un porcentaje de avance. El promedio de estrellas permanece visible en las tarjetas del catálogo. No se modificó el esquema de la base de datos ni se eliminaron valoraciones.
2. **Catálogo único.** `/academia` presenta los siete cursos originales y los publicados desde Administración, con búsqueda y filtros. `/modalidades` conserva una entrada compatible al mismo catálogo filtrado por formatos.
3. **Aprende póker integrado.** El enlace independiente desaparece del encabezado y del footer. Se ampliaron las lecciones del curso original Texas Hold'em con acciones, jerarquía de manos y glosario. Los antiguos enlaces `/guias` y `/guias/...` redirigen a las secciones vigentes.
4. **Navegación más sencilla.** El encabezado muestra Inicio, Cursos, Comunidad y acceso a Cuenta; el panel del administrador sigue disponible dentro de Cuenta. En escritorio, al pasar el puntero o enfocar Cursos aparece un menú opcional de tres cartas con accesos a catálogo, modalidades y Mis cursos. En móvil hay un menú de texto tradicional.
5. **Inicio personalizado y sobrio.** Un estudiante con una inscripción previa puede ver un enlace a su último curso guardado. Para otros usuarios, la portada se mantiene simple; no se recuperan el antiguo carrusel ni las tres tarjetas inferiores.
6. **Footer de ancho completo.** Se conserva explícitamente la corrección local del usuario: `<PiePagina />` está fuera de `.contenedor`, dentro de `.pagina`.

## Instalación sin migraciones nuevas

1. Guarda una copia de tu Iteración 8 y respalda tu trabajo local.
2. Descomprime este proyecto en una carpeta nueva y ábrelo desde IntelliJ IDEA.
3. Copia **solo** tu archivo `.env.local` anterior a la carpeta del proyecto, junto a `package.json`. No compartas ni publiques claves secretas.
4. Ejecuta `npm install`, `npm test`, `npm run build` y `npm run dev`.
5. Abre el catálogo y comprueba los cursos de ambos orígenes; inicia sesión y verifica progreso, estrella y reseña.

**No hay migración SQL 005.** No vuelvas a ejecutar 001–004 si ya están instaladas. Los nuevos capítulos del curso original utilizan el mismo `course_slug = texas-holdem` y nuevas claves válidas dentro de `legacy_lesson_progress`.

## Archivos principales

- `src/pages/Academia.jsx`: catálogo consolidado y valoración al final del curso.
- `src/components/Estructura.jsx`: encabezado, menú de cartas y footer.
- `src/pages/Inicio.jsx`: portada y acceso al último curso guardado.
- `src/contenidoCursos.js`: tres lecciones básicas adicionales en Texas Hold'em.
- `src/App.jsx`: rutas de compatibilidad y footer fuera del contenedor.
- `src/Iteracion9.css`: presentación responsiva del menú y nuevos componentes.

## Límites reconocidos

- Los cursos originales siguen siendo editoriales (JavaScript), mientras los administrables permanecen en Supabase. **Compartimos catálogo, no hemos migrado su contenido a la misma tabla.** Por tanto, valoraciones y reseñas escritas siguen disponibles solamente en los cursos administrables; el progreso de los originales continúa utilizando las tablas `legacy_*`.
- El menú de cartas es una mejora opcional y decorativa de accesos, **no sustituye** enlaces normales ni utiliza imágenes externas.
- No se realizó una auditoría de seguridad ni una revisión completa de accesibilidad en esta versión. Eso seguirá siendo necesario antes de un despliegue público.
- Las pruebas del repositorio comprueban contenido y video, pero el registro, el progreso y las valoraciones deben verificarse manualmente con tu proyecto Supabase.

Consulta `PRUEBAS_ITERACION9.md` para la lista de comprobación.
