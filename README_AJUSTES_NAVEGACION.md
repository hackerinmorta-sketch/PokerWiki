# PokerWiki · Ajuste de navegación (Iteración 9.1)

Se parte exactamente del código de la **Iteración 9**, con las modificaciones de navegación solicitadas. **No se eliminan ni cambian los datos de Supabase**.

## Qué cambia

- **Mi aprendizaje** (`/mis-cursos`) vuelve al encabezado como pestaña independiente y se puede acceder desde escritorio o desde el menú hamburguesa. Para usuarios sin sesión, la página mantiene su comportamiento de acceso actual.
- **Info** (`/info`) es una pestaña nueva que agrupa enlaces a Sobre el proyecto, Contacto y Juego responsable. Las direcciones originales `/empresa`, `/contacto` y `/juego-responsable` siguen funcionando.
- **Cursos** (`/academia`) contiene únicamente cursos administrables publicados en Supabase.
- **Modalidades** (`/modalidades`) vuelve a mostrar exclusivamente los siete cursos originales con sus tarjetas, filtros de formatos/variantes y páginas detalladas en `/modalidades/:slug`.
- El encabezado usa **texto mayor** y un símbolo animado por pestaña (♠ para Inicio, ♣ para Mi aprendizaje) al pasar el cursor o usar Tab. En móvil se usan enlaces visibles con símbolos estáticos.
- El footer permanece **fuera del `.contenedor`**, ocupando el ancho completo, como se corrigió en la versión anterior.
- Se conservan los enlaces, el progreso, reseñas, valoraciones y videos de ambas familias de cursos.

## Instalación

1. Guarda una copia de tu proyecto actual, sobre todo si editaste archivos localmente.
2. Abre la nueva carpeta `pokerstars` en IntelliJ IDEA y copia tu `.env.local` anterior junto al `package.json`.
3. Ejecuta `npm install`, `npm test`, `npm run build`, `npm run dev`.
4. Entra a `/academia`, `/modalidades`, `/mis-cursos` y `/info` para comprobar la separación.
5. Prueba el encabezado a ancho completo, con teclado (Tab) y en móvil.

**No ejecutes de nuevo SQL:** esta versión no requiere migraciones nuevas ni buckets de Storage adicionales.

## Archivos modificados

- `src/App.jsx`: rutas `/modalidades` y `/info`.
- `src/components/Estructura.jsx`: enlaces del encabezado, símbolos y footer.
- `src/pages/Academia.jsx`: lista exclusiva de cursos publicados.
- `src/pages/Modalidades.jsx`: migas de navegación hacia el catálogo original.
- `src/pages/Informacion.jsx`: página central de información.
- `src/NavegacionAjustes.css`: tamaño y animaciones del encabezado, ajustes móviles.
- `tests/navegacion-ajustes.test.js`: pruebas estructurales de los cambios.

## Límites

Los cursos originales siguen siendo contenido local en JavaScript; los creados desde Administración siguen en Supabase. El progreso ya existente en ambos se conserva. No se ha añadido una migración ni se han modificado las políticas de seguridad.
