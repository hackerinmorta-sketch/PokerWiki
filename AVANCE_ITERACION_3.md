# Iteración 3 — Modalidades como cursos

## Objetivo
Transformar la sección «Modalidades» de un listado de fichas informativas a un catálogo de cursos breve, con páginas individuales más fáciles de leer.

## Cambios principales
- Catálogo de siete cursos organizado en **formatos de juego** y **variantes de póker**.
- Filtro por categoría y buscador de cursos mediante React (`useState`, `useMemo`).
- Portada visual independiente para cada curso, objetivos de aprendizaje e índice lateral por capítulos.
- Casillas interactivas «Marcar lección como leída». El porcentaje de progreso se calcula en memoria y **se reinicia al salir de la página**. No hay cuentas, backend ni almacenamiento persistente.
- Curso de **Cash Games** con siete lecciones, dos imágenes ilustrativas originales, glosario, preguntas frecuentes, comparación con torneos y simulador didáctico de ciegas grandes.
- Contenido inicial estructurado para Torneos, Spin & Go, Sit & Go, Texas Hold'em, Omaha y Seven Card Stud.
- Animaciones discretas, diseño adaptable a pantallas móviles y soporte para reducir movimiento si lo solicita el sistema.
- Se conservan la portada de Inicio, otras páginas, navegación existente y la paleta del documento.

## Archivos incorporados o modificados
- `src/pages/Modalidades.jsx` (reemplazado)
- `src/pages/Cursos.css` (nuevo)
- `src/contenidoCursos.js` (nuevo)
- `public/curso/cash-hero.webp` (nuevo)
- `public/curso/mesa-poker.webp` (nuevo)

## Cómo ejecutarlo en IntelliJ IDEA
1. Abrir la carpeta `pokerstars` que contiene `package.json`.
2. Ejecutar `npm install` si no están instaladas las dependencias.
3. Ejecutar `npm run dev` desde la terminal de IntelliJ.
4. Abrir la dirección mostrada por Vite, normalmente `http://localhost:5173/`.
5. Ir a **Modalidades → Cash Games**.

**No se debe ejecutar `src/App.jsx` directamente con Node.js.**

## Qué validar antes de la presentación
- Que se muestre el catálogo con sus siete cursos distribuidos entre ambas categorías.
- Que el buscador y las pestañas de categoría filtren correctamente.
- Que «Cash Games» abra su página con siete capítulos.
- Que los enlaces del índice desplacen a las lecciones correctas.
- Que el botón «Marcar lección como leída» actualice el porcentaje.
- Que el simulador `BB × valor de la ciega grande` calcule el valor correcto.
- Que las imágenes se carguen desde `public/curso`.
- Que el menú Inicio, Aprende póker y Contacto siga funcionando.

## Alcance y límites
Se trata de una **aplicación académica informativa**. Los ejemplos monetarios son didácticos, no equivalen a recomendaciones de inversión ni a asesoría para apostar. Las imágenes son ilustraciones generadas, no capturas reales de PokerStars. Los contenidos de las otras seis modalidades son introductorios y pueden ampliarse con actividades, diagramas propios y fuentes bibliográficas.

## Fuentes de consulta
- PokerStars Help, Cash Games: https://www.pokerstars.com/help/articles/ring-explanations/14982/
- PokerStars Learn, Cash Games: https://www.pokerstars.com/poker/learn/course/cash-games-course/
- PokerStars, Poker Tournament Types: https://www.pokerstars.com/poker/tournaments/types/

## Pruebas
Se verificó la transformación de JSX sin errores de sintaxis y el montaje de React en una vista de pruebas, junto con clics, búsqueda, rutas, progreso y calculadora de ciegas. Se comprobó que no existe desbordamiento horizontal a 1440 px y 390 px de ancho. La compilación de producción con `npm run build` debe comprobarse en el equipo de desarrollo con npm.
