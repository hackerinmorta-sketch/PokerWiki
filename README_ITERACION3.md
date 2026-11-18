# PokerStars · Sitio informativo académico (Iteración 2)

Proyecto de Ingeniería de Software en **React + Vite**. Es una demostración educativa **no oficial**; no ofrece juegos, apuestas, transacciones, registros ni atención al cliente.

## Abrir en IntelliJ IDEA

1. Descomprime el ZIP (no es necesario conservar la carpeta `node_modules` antigua de Windows).
2. Abre la carpeta `pokerstars` como proyecto en IntelliJ IDEA.
3. Desde la terminal del proyecto ejecuta:

   ```bash
   npm install
   npm run dev
   ```

4. Abre la URL local que indique Vite, normalmente `http://localhost:5173/`.

**No necesitas instalar React Router ni otras dependencias.** Esta versión usa una navegación ligera con la API `history` del navegador, implementada en `src/lib/navegacion.jsx`. Las rutas funcionan en desarrollo con Vite. Si publicas la web en un alojamiento estático, configura un fallback de las rutas hacia `index.html`.

## Funciones agregadas

- Menú principal: Inicio, Modalidades, Aprende póker y Contacto.
- Portada: botones Explorar guías y Conocer más.
- Carrusel inicial con flechas anterior/siguiente (tres diapositivas).
- Tarjetas de inicio navegables.
- Modalidades: pestañas **Formatos de juego** y **Variantes de póker**.
- Fichas individuales de Torneos multimesa, Spin & Go, Sit & Go, Cash Games, Texas Hold'em, Omaha y Seven Card Stud.
- Guías: Primeros pasos, Jerarquía de manos y Glosario, cada una con página de detalle.
- Páginas de empresa, contacto, juego responsable y error 404.
- Preguntas frecuentes desplegables, efectos hover, entrada animada entre páginas y soporte para preferencias de movimiento reducido.
- Enlaces reales y navegación con historial: permite usar Atrás y Adelante del navegador.

## Estructura principal

- `src/App.jsx`: identifica la ruta actual y muestra la página correspondiente.
- `src/lib/navegacion.jsx`: enlaces internos y navegación mediante History API.
- `src/components/Estructura.jsx`: encabezado, menú, franja, tarjetas y pie compartidos.
- `src/pages/`: contenido y componentes de cada sección.
- `src/data.js`: datos informativos que puedes ampliar sin editar el diseño.
- `src/App.css`: diseño original y estilos adicionales.
- `public/`: imágenes originales del proyecto.

## Pruebas sugeridas

1. Desde Inicio, abre Modalidades y entra a Spin & Go.
2. Usa el botón «Todas las modalidades» y cambia a «Variantes de póker».
3. Abre Texas Hold'em y usa Atrás en el navegador.
4. Desde Inicio, abre Guías, Jerarquía de manos y vuelve a la lista.
5. Prueba Contacto, despliega una pregunta frecuente y abre el enlace al sitio oficial.
6. Pulsa las flechas del carrusel tres veces y observa el cambio de textos e imágenes.
7. Comprueba la interfaz en tamaño móvil y usando el teclado (Tab y Enter).
8. Prueba una dirección inexistente como `/pagina-inexistente` para comprobar el aviso 404.

## Límites reales del alcance

No se implementaron cuentas, búsqueda de torneos en tiempo real, chat de atención, backend, conexión a PokerStars ni juego de dinero. Los textos son una introducción y deben revisarse antes de una entrega final. Algunas características de las modalidades y su disponibilidad varían según el mercado.

**Fuente para revisar información de formatos:** https://www.pokerstars.com/es-419/poker/tournaments/types/
