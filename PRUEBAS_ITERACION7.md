# Plan de pruebas · Iteración 7

Marca cada prueba como aprobada solo cuando la ejecutes en tu Supabase. Captura la pantalla y registra fecha, cuenta usada, resultado y error si ocurre.

| ID | Cuenta | Acción | Resultado esperado |
| --- | --- | --- | --- |
| P7-01 | Admin | Ejecutar 003 tras 001 y 002 | Migración correcta; sin perder cursos ni valoraciones |
| P7-02 | Estudiante A | Abrir curso dinámico y pulsar Guardar | Aparece en Mis cursos al volver |
| P7-03 | Estudiante A | Marcar 1 de 4 lecciones | Progreso 25%; icono de leída |
| P7-04 | Estudiante A | Cerrar sesión y volver a ingresar | Se conserva 25% |
| P7-05 | Estudiante A | Desmarcar lección | Porcentaje baja y se guarda |
| P7-06 | Estudiante A | Quitar curso de Mis cursos | Desaparece de lista; progreso no se borra |
| P7-07 | Estudiante A | Volver a seguir el curso | Reaparece el progreso previo |
| P7-08 | Estudiante A | Marcar lección de un curso original | Queda guardada en Supabase |
| P7-09 | Estudiante A | Reiniciar navegador | Curso original conserva avance |
| P7-10 | Anónimo | Marcar lección original | Funciona temporalmente y se pierde al salir |
| P7-11 | Estudiante B | Consultar curso de A | No ve inscripciones/progreso de A |
| P7-12 | Estudiante B | Intentar SELECT de progreso ajeno | RLS no devuelve registros |
| P7-13 | Estudiante B | Intentar INSERT/DELETE con el user_id de A | RLS bloquea operación |
| P7-14 | Estudiante A | Escribir una reseña de 20–1500 caracteres | La reseña aparece en curso público |
| P7-15 | Estudiante A | Cambiar texto de reseña | Se actualiza, no crea una segunda |
| P7-16 | Estudiante A | Intentar crear otra reseña en el mismo curso | Clave única lo impide |
| P7-17 | Estudiante B | Leer reseña de A y reportarla | Reporte creado una sola vez |
| P7-18 | Estudiante A | Intentar reportar su propia reseña | RLS lo rechaza |
| P7-19 | Admin | Ocultar reseña reportada | Deja de aparecer para otros estudiantes |
| P7-20 | Estudiante A | Editar una reseña oculta | Puede editar texto, pero no restaurar su estado |
| P7-21 | Estudiante A | Intentar UPDATE status='visible' | Trigger lo impide, aun mediante llamada API |
| P7-22 | Admin | Restaurar reseña oculta | Vuelve a ser pública |
| P7-23 | Admin | Marcar reporte revisado | Sale de pendientes |
| P7-24 | Estudiante A | Intentar valorar curso borrador | Denegado por RLS |
| P7-25 | Todos | Probar navbar móvil y escritorio | Mis cursos accesible solo para sesión activa |
| P7-26 | Todos | Comprobar rutas y acciones de Iteración 6 | Registro, imágenes, estrellas, votos, comunidad siguen funcionando |
| P7-27 | Desarrollo | `npm run build` y `npm run lint` | Compilación y análisis satisfactorios; corregir errores detectados |

## Verificación SQL inicial

```sql
select table_name
from information_schema.tables
where table_schema='public'
  and table_name in (
    'course_enrollments', 'lesson_progress',
    'legacy_course_enrollments', 'legacy_lesson_progress',
    'course_reviews', 'course_review_reports'
  )
order by table_name;
```

## Precaución al verificar permisos

No basta con ejecutar `SELECT` en el SQL Editor para probar RLS: el editor suele tener permisos de mantenimiento y puede ver datos que un usuario no puede. Para comprobar aislamiento, utiliza **sesiones autenticadas reales** en diferentes navegadores/perfiles o pruebas con JWT de cada usuario. No incluyas tokens ni contraseñas en capturas.
