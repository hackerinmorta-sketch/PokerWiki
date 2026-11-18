# Plan de pruebas · Iteración 6

**Estado inicial:** casos propuestos; pendientes de ejecución en Supabase e IntelliJ del usuario. Nunca marcar como aprobadas sin ejecutarlas.

| ID | Caso | Cuenta | Resultado esperado |
| --- | --- | --- | --- |
| P01 | Ejecutar SQL 002 después de 001 | Propietario de Supabase | Se crean dos tablas, dos vistas y las políticas de Storage sin borrar datos. |
| P01B | Crear dos buckets públicos en Storage | Propietario de Supabase | Ambos con máximo 5 MiB y MIME restringidos. |
| P02 | Abrir curso antiguo | Visitante | Mantiene texto y portada previa. |
| P03 | Subir portada JPG nueva | Admin | Se ve en el catálogo público cuando el curso está publicado. |
| P04 | Subir JPG/PNG/WebP desde celular | Admin | Se carga correctamente en Storage. |
| P05 | Subir imagen de lección con alt | Admin | Se muestra al leer la lección junto a su pie. |
| P06 | Guardar lección sin imagen | Admin | Se guarda como antes. |
| P07 | Intentar subir SVG/GIF o archivo >5 MiB | Admin/estudiante | Rechazado y no se guarda. |
| P08 | Intentar subir imagen de curso sin rol admin | Estudiante | Bloqueado por Storage RLS incluso desde API. |
| P09 | Calificar curso con 4 estrellas | Estudiante A | Media y cantidad pública se actualizan. |
| P10 | Cambiar de 4 a 5 estrellas | Estudiante A | Queda una sola calificación del usuario. |
| P11 | Repetir clic en 5 estrellas | Estudiante A | Retira su calificación. |
| P12 | Intentar valorar sin iniciar sesión | Visitante | Muestra enlace de acceso, no escribe en BD. |
| P13 | Votar Útil/No útil en una lección | Estudiante A | Solo existe un voto por estudiante y lección. |
| P14 | Cambiar Útil por No útil | Estudiante A | Recuento cambia correctamente. |
| P15 | Votar un curso borrador desde API | Estudiante A | RLS rechaza la operación. |
| P16 | Publicar tema con imagen y descripción | Estudiante A | Aparece en lista y en el hilo. |
| P17 | Responder con imagen | Estudiante B | La imagen se muestra bajo el comentario. |
| P18 | Subir imagen a la carpeta de otro estudiante | Estudiante B | Storage RLS impide la subida. |
| P19 | Borrar tema propio con imagen | Estudiante A | Tema y su imagen se borran; verificar en Storage. |
| P20 | Borrar un comentario ajeno | Estudiante A | PostgreSQL RLS rechaza la eliminación. |
| P21 | Revisar foro con cuenta admin | Admin | Puede moderar publicaciones. |
| P22 | Compilar aplicación | Desarrollador | `npm run build` termina sin errores. |
| P23 | Vista móvil | Desarrollador | Formularios, fotos y votos sin desbordamiento horizontal. |

## Evidencias para el informe universitario

Guardar capturas de la consulta de tablas y buckets, la creación de una lección ilustrada, la calificación antes/después, el voto antes/después y un hilo con adjunto. Capturar también los casos de **acceso denegado** con cuenta estudiante. Registrar fecha, navegador, datos de prueba, resultado esperado y resultado observado.
