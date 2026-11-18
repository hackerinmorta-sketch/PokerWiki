# Plan de pruebas manuales · Sistema PokerStars · Iteración 5

**Estado de este documento:** casos definidos, **no ejecutados contra una instancia real de Supabase**. No marcar un caso como Aprobado hasta realizarlo en tu equipo.

| ID | Actor | Caso | Resultado esperado | Estado |
| --- | --- | --- | --- | --- |
| P01 | Visitante | Entrar a Inicio y abrir Cash Games | Portada y curso de Iteración 3 se conservan | Pendiente |
| P02 | Visitante | Abrir header en móvil | Menú hamburguesa muestra enlaces, cierra al navegar o pulsar Escape | Pendiente |
| P03 | Visitante | Crear cuenta con correo válido | Perfil `student`; si se requiere, correo de confirmación | Pendiente |
| P04 | Visitante | Intentar escribir sin sesión | No aparece formulario de publicación y RLS rechaza la inserción directa | Pendiente |
| P05 | Estudiante | Crear post y responder | Datos persisten tras actualizar el navegador | Pendiente |
| P06 | Estudiante | Borrar publicación propia | Solo puede eliminar la suya | Pendiente |
| P07 | Estudiante | Entrar a `/admin` | Acceso denegado y escritura SQL prohibida por RLS | Pendiente |
| P08 | Estudiante | Intentar cambiar `profiles.role` desde cliente SQL/API | UPDATE rechazado por permisos/RLS | Pendiente |
| P09 | Administrador | Crear curso como borrador | Guardado en BD, no visible en catálogo público | Pendiente |
| P10 | Administrador | Añadir una lección | Aparece en el temario del curso | Pendiente |
| P11 | Administrador | Publicar curso con lección | Visible desde otro navegador/cuenta | Pendiente |
| P12 | Administrador | Editar una lección | La modificación se ve tras actualizar | Pendiente |
| P13 | Administrador | Modificar publicación ajena | Puede borrarla en contexto de moderación | Pendiente |
| P14 | Usuario | Reportar un tema | Aparece para revisión en el panel de administración | Pendiente |
| P15 | Visitante | Acceder a borrador mediante URL/API | Contenido no visible por políticas RLS | Pendiente |
| P16 | Usuario | Incluir `<script>` en texto de comunidad | Se presenta como texto sin ejecutarse | Pendiente |
| P17 | Estudiante | Cerrar sesión | Deja de poder publicar; el catálogo público sigue visible | Pendiente |
| P18 | Usuario | Navegar con teclado/lector de pantalla | Enlaces y botones tienen foco y etiquetas adecuadas | Pendiente |

**Pruebas de seguridad imprescindibles antes de un despliegue público:** validar RLS para `anon`, `student` y `admin` (SELECT/INSERT/UPDATE/DELETE), rate limiting y antiflood, revisión de permisos de Supabase, HTTPS, eliminación de datos y políticas de privacidad. La existencia de SQL no equivale a haber pasado estas pruebas.

**Validación en esta entrega:** análisis de sintaxis JSX y revisión estática del esquema/políticas. No hubo despliegue ni usuarios reales, así que los casos de la tabla permanecen en estado Pendiente.
