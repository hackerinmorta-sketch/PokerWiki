# PokerWiki · Plan de pruebas de aceptación · Iteración 8

**Criterio:** marcar PASS solo después de probar cada caso en IntelliJ y en Supabase real. Las pruebas automáticas de URLs han pasado en el entorno de preparación; la integración con tu proyecto Supabase no se ha ejecutado desde aquí.

| ID | Caso | Resultado esperado |
|---|---|---|
| UI-01 | Abrir `/` como visitante | Hero fijo, sin flechas ni las tres tarjetas inferiores |
| UI-02 | Abrir Inicio / Academia / Comunidad | El mismo footer aparece en todas ellas |
| UI-03 | Logo de encabezado y título del navegador | Muestra pokerWiki, no la marca anterior |
| UI-04 | Navegación por teclado | Todos los enlaces de footer y botones son accesibles con Tab y muestran foco |
| UI-05 | Abrir `/academia/curso` | Botón visible «Volver al catálogo» antes de portada |
| UI-06 | Abrir `/modalidades/cash-games` | Botón visible «Volver a modalidades» antes de portada |
| UI-07 | Abrir desde un móvil (375px) | Sin scroll horizontal, footer apilado y menú hamburguesa funcional |
| DB-01 | Ejecutar SQL 004 después de 001–003 | SQL sin errores; tabla `lessons` conserva sus filas y añade 2 columnas |
| DB-02 | Ejecutar SQL 004 otra vez | No crea columnas o restricciones duplicadas |
| VID-01 | Curso dinámico previo sin video | Las lecciones originales siguen mostrándose sin errores |
| VID-02 | Administrador edita lección con URL HTTPS de YouTube válida | Se guarda ID y aparece módulo de video en curso publicado |
| VID-03 | Administrador usa `youtu.be/ID`, Shorts o embed oficial | Validación acepta URL válida |
| VID-04 | Administrador introduce `https://youtube.com.evil.net/...` | El formulario rechaza el enlace |
| VID-05 | Administrador introduce `http://youtube.com/...` o `javascript:...` | El formulario rechaza el enlace |
| VID-06 | Estudiante abre lección con video | No se carga iframe hasta pulsar «Mostrar video» |
| VID-07 | Estudiante pulsa «Mostrar video» | Iframe funciona o informa indisponibilidad desde YouTube; la página sigue usable |
| VID-08 | Estudiante pulsa «Ocultar reproductor» | Iframe se desmonta y deja de reproducirse |
| VID-09 | Estudiante abre «Abrir en YouTube» | Nueva pestaña segura con dominio www.youtube.com |
| VID-10 | Administrador borra URL del campo y guarda | Se elimina video de la lección sin borrar el texto, progreso ni imagen |
| SEC-01 | Estudiante intenta actualizar `lessons.youtube_video_id` mediante API | Supabase rechaza por RLS |
| SEC-02 | Administrador actualiza lección | Supabase permite guardar por RLS |
| REG-01 | Estudiante marca lección como leída | Se conserva progreso en `Mis cursos` después de recargar |
| REG-02 | Estudiante publica en foro o califica curso | Comunidad y valoración de Iteración 7 siguen funcionando |
| REG-03 | Curso original con capítulos y calculadora | Mantiene contenido y simulador sin errores |
| REG-04 | Un enlace directo a subpágina en despliegue | No genera 404 si se configuró fallback SPA |

## Consultas SQL de comprobación (solo lectura)

```sql
select column_name, data_type
from information_schema.columns
where table_schema='public' and table_name='lessons'
  and column_name in ('youtube_video_id','video_caption')
order by column_name;
```

```sql
select title, youtube_video_id, video_caption
from public.lessons
order by created_at desc
limit 10;
```

## Pruebas locales

```powershell
npm install
npm test
npm run build
npm run dev
```

**No atribuir PASSED a casos que todavía no se hayan ejecutado.** Documentar captura, cuenta usada, fecha, resultado y error si existe.
