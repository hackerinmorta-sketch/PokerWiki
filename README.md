# PokerWiki · Iteración 9 (React + Vite + Supabase)

Plataforma universitaria de aprendizaje del póker y comunidad. La evolución parte del contenido de la Iteración 3; **no incorpora la Iteración 4 descartada**.

**Empieza por [README_ITERACION9.md](README_ITERACION9.md)**. Aquí se explica qué cambió, cómo instalar la versión y qué pruebas están pendientes.

El sistema conserva autenticación, usuarios y administradores, cursos editables, imágenes, lecciones, videos externos, valoraciones, reseñas, comunidad, progreso persistente y registro de cursos. Los cursos editoriales originales y los cursos de Supabase comparten un único catálogo, pero conservan sus almacenes de datos por compatibilidad.

## Inicio rápido

1. Abre esta carpeta en IntelliJ IDEA y copia tu propio `.env.local` de la instalación previa.
2. Ejecuta `npm install`, `npm test`, `npm run build` y `npm run dev`.
3. Visita el Inicio y el catálogo `/academia`.

**No hay cambios en la base de datos para la Iteración 9.** Los scripts SQL 001–004 deben estar ejecutados previamente, pero no se deben repetir como parte de esta actualización.

Documentación histórica y pruebas: [README_SISTEMA.md](README_SISTEMA.md), [README_ITERACION8.md](README_ITERACION8.md), [PRUEBAS_ITERACION9.md](PRUEBAS_ITERACION9.md).
