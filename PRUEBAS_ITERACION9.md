# Plan de pruebas · Iteración 9

Marca cada caso después de ejecutarlo en tu IntelliJ y Supabase. No se consideran aprobados por el solo hecho de figurar aquí.

| ID | Prueba | Resultado esperado |
|----|--------|--------------------|
| P9-01 | Abrir Inicio sin sesión | Portada sencilla, sin carrusel ni tarjetas inferiores |
| P9-02 | Abrir Cursos desde el encabezado | Aparecen cursos originales y publicados |
| P9-03 | Filtrar por Formatos, Variantes y Publicados | Se muestran solamente resultados pertinentes |
| P9-04 | Buscar «cash» | Se encuentra Cash Games si está en catálogo |
| P9-05 | Abrir un curso publicado | Portada, progreso y lecciones siguen funcionando |
| P9-06 | Bajar al final del curso | Aparecen **primero las estrellas y después las reseñas** |
| P9-07 | Valorar un curso con 0 lecciones completadas | Se guarda la estrella, sin bloqueo por progreso |
| P9-08 | Editar, quitar valoración y escribir reseña | Conserva comportamiento de Iteración 8 |
| P9-09 | Abrir Texas Hold'em | Se muestran seis capítulos, incluidos fundamentos |
| P9-10 | Marcar una lección nueva y volver a iniciar sesión | El progreso persiste |
| P9-11 | Abrir un antiguo enlace `/guias/primeros-pasos` | Redirige al curso inicial sin error 404 |
| P9-12 | Pasar el mouse sobre Cursos en escritorio | Se abre el menú de tres cartas con animación |
| P9-13 | Usar Tab y Enter en las cartas | Los enlaces se pueden navegar con teclado |
| P9-14 | Abrir el menú hamburguesa en móvil | Aparecen enlaces de texto, sin depender del hover |
| P9-15 | Iniciar sesión y guardar un curso | Inicio ofrece «Continuar» cuando hay curso reciente |
| P9-16 | Visitar el footer en distintas páginas | El fondo ocupa todo el ancho disponible |
| P9-17 | Ingresar como administrador | El panel sigue accesible desde Cuenta |
| P9-18 | Registrar y responder en Comunidad | No hay regresión de las publicaciones |
| P9-19 | Abrir una lección con video | El reproductor se carga bajo demanda |
| P9-20 | Reducir movimiento desde el sistema operativo | El menú evita animaciones no esenciales |

### Verificación automatizada disponible

Ejecuta `npm test` para las pruebas de identificadores, fundamentos y URLs de video. Ejecuta `npm run build` antes de entregar. Esta revisión **no** reemplaza pruebas en dos navegadores ni permisos entre usuarios.
