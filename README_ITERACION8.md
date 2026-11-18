# pokerWiki · Iteración 8 · Navegación, marca, pie común y videos

**Base exacta:** Iteración 7, con funcionalidades de Iteraciones 5 y 6 y cursos originales de Iteración 3. No se recuperó la Iteración 4 descartada. No se eliminaron cursos, lecciones, usuarios, comunidad, valoraciones ni avance.

## Resumen funcional

- La marca visible cambia a **pokerWiki** en encabezado, título del navegador, textos públicos y pie de página. El nombre interno `pokerstars` de carpetas, paquete y documentación histórica se conserva para no romper enlaces ni el proyecto universitario.
- En **Inicio** se elimina el carrusel de las tres diapositivas, las flechas y las tarjetas inferiores. Queda una sola presentación con accesos directos a Cursos, Modalidades y Comunidad.
- Existe un **footer compartido** en todas las páginas con enlaces a aprendizaje, comunidad y ayuda.
- Todos los cursos (tanto originales como administrables) incluyen un botón «← Volver ...» visible antes de la portada. No depende de la posición del usuario en el índice lateral.
- El administrador puede enlazar **un video de YouTube por lección dinámica** con descripción opcional; se guarda solo el identificador validado en `public.lessons`.
- El alumno abre el reproductor bajo demanda; no se carga un `iframe` de terceros al navegar hasta el curso. Enlace alternativo «Abrir en YouTube».
- Se conservan sin modificar el registro, los roles, el progreso, las imágenes, las estrellas, los votos, las reseñas y la comunidad.

## Instalación recomendada (sin borrar datos)

1. **Respalda tu código y tu proyecto de Supabase.** No borres ninguna tabla ni los buckets de Storage.
2. En Supabase → SQL Editor, ejecuta **solo** `supabase/004_videos_de_lecciones.sql`. Debes haber instalado las migraciones 001, 002 y 003. La migración 004 agrega las columnas `youtube_video_id` y `video_caption` y dos restricciones de longitud/formato; no crea tablas nuevas ni elimina datos.
3. Abre la carpeta `pokerstars` de este ZIP en IntelliJ IDEA. Copia tu archivo `.env.local` anterior (si lo tenías) a la raíz de la nueva carpeta. **No copies claves secretas ni la clave service_role.**
4. Ejecuta:

   ```powershell
   npm install
   npm run dev
   ```

5. Entra como administrador a `/admin`, selecciona un curso dinámico y una lección. Pega un enlace **HTTPS** de un video de YouTube público o no listado que tengas permiso de incorporar, por ejemplo `https://www.youtube.com/watch?v=M7lc1UVf-VE` (ID ilustrativo de la documentación de YouTube, no es un curso de póker). Agrega una descripción y guarda.
6. Abre el curso con otra cuenta o como visitante. El video aparecerá como un módulo cerrado hasta que pulses **Mostrar video**. Marca como leída una lección y verifica que su progreso de Iteración 7 continúa funcionando.
7. Ejecuta las pruebas: `npm test` y `npm run build`. El comando `npm test` utiliza las pruebas integradas de Node.js y no añade bibliotecas.

### Si aparece un error de columna no encontrada

Si ves `column lessons.youtube_video_id does not exist` o un error del esquema, significa que todavía no se aplicó la migración 004 al **mismo proyecto Supabase** conectado en tu `.env.local`. Aplica 004 y vuelve a cargar la web. No ejecutes de nuevo las migraciones previas para arreglarlo.

## Seguridad y límites de los videos

- El formulario **no admite** HTML, iframes escritos a mano, enlaces HTTP, enlaces Base64 ni dominios externos. Se comprueba el origen exacto de YouTube y se extrae un ID de 11 caracteres; en PostgreSQL hay un `CHECK` adicional sobre el formato del ID.
- El reproductor utiliza `https://www.youtube-nocookie.com/embed/{ID}`, sin JavaScript arbitrario del editor y **sin reproducción automática**. El `iframe` aparece solo al pulsar el botón, con `loading="lazy"` y atributos de permisos reducidos.
- **No equivale a alojamiento privado ni a DRM.** Los videos públicos/no listados de YouTube pueden compartirse mediante su enlace, el proveedor puede recoger datos de reproducción, ciertos videos pueden impedir la inserción, y no hay control sobre anuncios o disponibilidad. Para cursos privados o video propio a escala, evaluar Mux/Cloudflare Stream, autorización en backend y URLs temporales en una iteración posterior.
- La configuración RLS de `public.lessons` sigue protegiendo la escritura: solo administradores pueden crear o modificar lecciones. La migración no amplía privilegios de lectura/escritura. Las IDs de videos no son secretos.
- La lección se completa **manualmente**, no por ver el video ni por adelantarlo. No se ha implementado el guardado del segundo de reproducción ni la descarga de videos desde dispositivos.

## Archivos principales

| Archivo | Cambio |
|---|---|
| `src/pages/Inicio.jsx` | Portada fija sin carrusel ni tres tarjetas |
| `src/components/Estructura.jsx` | pokerWiki, header y footer de tres columnas |
| `src/pages/Modalidades.jsx` | Botón de retorno visible en los cursos originales |
| `src/pages/Academia.jsx` | Botón de retorno, datos de videos y reproductor por lección |
| `src/pages/Admin.jsx` | Editor de video de lección con validación y descripción |
| `src/components/VideoLeccion.jsx` | Reproductor condicionado a una acción del alumno |
| `src/lib/video.js` | Validación de URLs y generación de enlace externo seguro |
| `src/Iteracion8.css` | Maquetación del inicio, footer y videos |
| `public/favicon.svg` | Icono propio pW; reemplaza el predeterminado de Vite |
| `supabase/004_videos_de_lecciones.sql` | Migración incremental |
| `tests/video.test.js` | Pruebas de seguridad de enlaces e IDs |

## Riesgos y próximos pasos recomendados

1. **Poner el sitio bajo un dominio propio** y configurar correctamente las redirecciones de autenticación de Supabase. El servidor de despliegue debe redirigir rutas como `/academia/curso-ejemplo` a `index.html` (SPA fallback).
2. **Revisar políticas de privacidad y consentimiento** antes de publicar, ya que se almacenan cuentas, opiniones y contenido de la comunidad. Incorporar mecanismos para eliminar cuenta y datos personales.
3. **Pruebas automáticas de RLS y flujo completo:** autor vs. otra cuenta, estudiante vs. administrador, cambios de publicación, reportes y progreso.
4. **Endurecer moderación:** reportes, límites de frecuencia, controles antispam, validación de cargas de imágenes, contenido ofensivo y auditoría de acciones administrativas.
5. **Contenido y licencias:** los profesores deben usar videos propios o autorizados; logo y marcas deben ser independientes de PokerStars. Sustituir el emblema temporal de pica por identidad visual propia antes de producción.
6. **Monitorización, copias y estabilidad:** límites de Storage, métricas de errores, despliegues con versiones, reversión y pruebas de rendimiento móvil.
7. **Si los videos crecen:** streaming adaptable, subtítulos y transcripciones accesibles, coste por minutos, y posiciones de reproducción por usuario. Esto no se recomienda sin cerrar primero los puntos de seguridad anteriores.

Consulta `PRUEBAS_ITERACION8.md` para una lista de comprobaciones de administrador, estudiante y visitante.
