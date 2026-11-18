# PokerStars académico · Iteración 5 · Sistema educativo

**Estado:** primera versión integrada de frontend + esquema de base de datos. Se basa en **Iteración 3**, no en la 4. El frontend está implementado; la autenticación real, los permisos, la persistencia y la comunidad necesitan **tu propio proyecto Supabase** y ejecutar la migración SQL. Las pruebas integrales en el servidor todavía están pendientes.

## 1. Qué incluye

- Se conserva la portada, el carrusel, las siete modalidades y sus cursos informativos de la **Iteración 3**.
- Barra de navegación en el **header** para escritorio y menú hamburguesa en móviles.
- **Ingresar/Crear cuenta/Cerrar sesión** mediante Supabase Auth.
- **Perfiles** de estudiante y administrador. Nadie se convierte en admin por marcar una casilla.
- Panel `/admin` para **crear, editar, publicar y borrar cursos** y **añadir, editar o borrar lecciones** sin escribir código JSX.
- Catálogo público `/academia` y lector de lecciones `/academia/<slug>`.
- **Comunidad** `/comunidad`: leer conversaciones, crear temas y responder; se permite reportar publicaciones, y el administrador puede moderar y revisar reportes.
- Datos persistentes en PostgreSQL con políticas **Row Level Security (RLS)**.
- Estilos en `src/Sistema.css`, sin deshacer el diseño de la Iteración 3.

## 2. Arrancar el proyecto en IntelliJ IDEA

1. Descomprime el ZIP y abre la carpeta `pokerstars` que contiene `package.json`.
2. En la terminal de IntelliJ (`Alt + F12`), ejecuta `npm install`.
3. Ejecuta `npm run dev`. Vite mostrará la dirección local, normalmente `http://localhost:5173`.
4. **No ejecutes `src/App.jsx` con el botón verde como si fuera Java**: usa el script `dev` de `package.json`.
5. Antes de configurar Supabase, la portada y los cursos originales funcionan; las nuevas secciones de usuarios muestran instrucciones de conexión y no inventan publicaciones ni usuarios.

## 3. Crear la base de datos y autenticar usuarios

1. Crea un proyecto nuevo en https://supabase.com/dashboard (se requiere una cuenta externa).
2. Abre **SQL Editor** y ejecuta el archivo completo `supabase/001_esquema.sql` en **un proyecto vacío**. Revisa siempre el SQL antes de ejecutarlo.
3. En **Authentication → Providers**, habilita el acceso por **Email**. Mantén la confirmación de correo activada. Configura **URL Configuration / Site URL** con `http://localhost:5173` para el entorno local y agrega los redirects necesarios si cambias el puerto o despliegas el sitio.
4. Abre **Project Connect / API Keys** y copia **Project URL** y **Publishable key**. No copies la **Secret key** ni la antigua clave **service_role**.
5. En la raíz de `pokerstars`, copia `.env.example` a `.env.local` y rellena:

```env
VITE_SUPABASE_URL=https://TU-PROYECTO.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_TU_CLAVE_PUBLICA
```

6. Reinicia Vite (`Ctrl + C`, después `npm run dev`). Las variables de Vite se leen al arrancar.
7. En `/cuenta`, **registra un usuario real** y confirma su correo si el proveedor lo solicita. El trigger SQL crea automáticamente su perfil de estudiante.
8. Para convertir TU cuenta en el primer administrador, desde SQL Editor de Supabase y con permisos de propietario del proyecto ejecuta lo siguiente, sustituyendo el correo con el que te registraste:

```sql
update public.profiles
set role = 'admin'
where id = (
  select id from auth.users
  where email = 'TU_CORREO@EJEMPLO.COM'
);
```

9. Cierra sesión, vuelve a entrar y abre `/admin`. No implementes un botón de «hacerme administrador» en la web.
10. Crea un curso, **guárdalo como borrador**, añade al menos una lección, activa **Publicar curso** y vuelve a guardar. Aparecerá en `/academia`.
11. Registra una **segunda cuenta de estudiante** y comprueba que puede publicar en `/comunidad` pero **no puede modificar cursos**.

> **Advertencia:** `.env.local` no debe subirse a repositorios públicos. La clave **publishable** está diseñada para el frontend; la seguridad la garantizan las políticas RLS del servidor. Nunca utilices una `service_role` o `secret key` en `VITE_*`.

## 4. Rutas

| URL | Qué hay | Permisos |
| --- | --- | --- |
| `/` | Inicio de Iteración 3 y comunidad destacada | Público |
| `/modalidades` | Catálogo original de 7 formatos/variantes | Público |
| `/modalidades/cash-games` | Curso original detallado de Cash Games | Público |
| `/guias` | Guías originales de Iteración 3 | Público |
| `/academia` | Cursos nuevos creados por administradores | Público (solo publicados) |
| `/academia/:slug` | Lecciones de un curso | Público si publicado; borrador visible para admin |
| `/cuenta` | Registro, acceso y sesión | Público |
| `/comunidad` | Conversaciones públicas y respuestas | Lectura pública; escribir requiere sesión |
| `/admin` | Editor de cursos y revisión de reportes | Solo admin (servidor + interfaz) |

## 5. Base de datos y seguridad

- `profiles`: seudónimo, rol y `auth.users.id`; **sin contraseñas**.
- `courses`: datos de curso, estado borrador/publicado y administrador creador.
- `lessons`: contenido de las lecciones, orden y curso asociado.
- `posts`: conversaciones de comunidad.
- `comments`: respuestas de una conversación.
- `reports`: denuncias de publicaciones con estado pendiente/revisado.

La autorización real se implementa con políticas SQL. Un usuario puede cambiar la apariencia de su navegador, pero eso **no** le concede permiso para escribir en la base de datos. Se evita utilizar `user_metadata` para determinar el rol. Los textos de los usuarios se presentan como texto React, **sin usar `dangerouslySetInnerHTML`**.

**Lo que aún no constituye seguridad de producción:** no se probaron políticas RLS con usuarios reales en un proyecto Supabase; quedan por añadir políticas de privacidad, consentimiento y borrado de cuentas, anti-spam/rate limiting, tratamiento de abusos, CAPTCHA si hiciera falta, recuperación de contraseñas y monitorización. Debes verificar también la disponibilidad/legalidad de servicios en tu jurisdicción antes de publicar contenido sobre apuestas.

## 6. Arquitectura

```text
Navegador (React + Vite)
  ├── App.jsx ── rutas de la Iteración 3 + rutas nuevas
  ├── Estructura.jsx ── header + menú móvil
  ├── AuthContext.jsx ── estado de sesión/rol
  ├── Cuenta.jsx ── login / registro
  ├── Admin.jsx ── gestor de cursos/lecciones
  ├── Academia.jsx ── catálogo dinámico + lector
  └── Comunidad.jsx ── publicaciones y comentarios
              │
              ▼
    Supabase Auth + API de datos (HTTPS)
              │
              ▼
    PostgreSQL con RLS (admin, autor, público)
```

Es una arquitectura **frontend + backend gestionado**. Supabase actúa como backend de autenticación y datos. Una aplicación React sin backend no puede guardar de forma segura usuarios, roles y publicaciones compartidas.

## 7. Código conservado

No se recrearon los cursos existentes ni se reemplazaron los datos de `src/contenidoCursos.js`, `src/data.js`, `src/pages/Modalidades.jsx` o sus imágenes. Se reubicó el menú para que no aparezca repetido en cada pantalla. La navegación propia de la Iteración 3 sigue usando `src/lib/navegacion.jsx` (API History). Una futura fase puede migrar a React Router después de añadir pruebas de regresión.

## 8. Próximos incrementos recomendados

1. Pruebas reales con dos estudiantes y un administrador (ver `PLAN_PRUEBAS.md`).
2. Editor enriquecido, carga de imágenes a Storage y vista previa antes de publicar.
3. Edición de publicaciones y reportes más precisos con motivos y sanciones.
4. Progreso de cursos persistente, inscripciones, cuestionarios y recuperación de contraseña.
5. Auditoría de accesibilidad, protección contra spam, backups y despliegue.

## 9. ¿Codex o ChatGPT?

Para **edición directa sobre tu copia de IntelliJ**, Codex tiene ventaja: puede inspeccionar el repositorio local, proponer cambios, ejecutar comandos y mostrar diffs. Para **arquitectura, revisión de requisitos y explicación de conceptos**, este chat sigue siendo útil. La combinación aconsejable es planear cambios pequeños aquí, ejecutarlos con Codex y revisar el resultado con Git y pruebas. No concedas acceso completo del equipo ni claves secretas por comodidad.
