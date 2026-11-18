# Arquitectura y decisiones técnicas · Sistema PokerStars

**Versión:** 0.5 · **Base:** Iteración 3 · **Tipo:** plataforma académica e informativa (no oficial).

## Necesidad del sistema

La versión inicial era informativa y su contenido se definía en archivos JavaScript. La nueva necesidad es que un administrador pueda **crear cursos y lecciones desde el navegador**, y que existan **cuentas** para que estudiantes participen en un foro compartido. Estos requisitos necesitan persistencia de datos, autenticación real y control de acceso.

## Arquitectura elegida y justificación

- **React + Vite** conserva la experiencia de aprendizaje y los componentes anteriores.
- **Supabase Auth** evita programar de cero almacenamiento de contraseñas y sesiones.
- **PostgreSQL + RLS** controla permisos sobre los registros reales, independientemente de lo que muestre React.
- **Sin servidor Java propio en esta fase:** un backend Spring Boot aumentaría el trabajo inicial. Si el profesor exige implementar explícitamente un backend propio, ese requerimiento deberá revisarse antes de la entrega final.
- **Editor de texto plano:** es suficiente para demostrar creación, edición y publicación de cursos. Un editor enriquecido con imágenes incrustadas exige sanitización y gestión de archivos adicionales.

## Actores y casos de uso

| Actor | Acciones autorizadas | Restricciones |
| --- | --- | --- |
| Visitante | Consultar inicio, modalidades, cursos publicados, guías y comunidad | No puede escribir ni ver borradores |
| Estudiante | Registrarse, iniciar sesión, publicar preguntas, responder, reportar temas y borrar publicaciones propias | No puede cambiar roles ni crear/editar cursos |
| Administrador | Todo lo anterior y crear/editar/publicar/eliminar cursos, gestionar lecciones y moderar comunidad | El rol se asigna mediante acceso privilegiado a Supabase, nunca desde el navegador |

## Modelo de datos

```text
Supabase Auth: auth.users
       │ (1:1)
       ▼
profiles (id, display_name, role)
   │  (1:N)       │ (1:N)
   ▼              ▼
courses           posts ────── comments
   │ (1:N)         │              │
   ▼               └── reports    └── author_id → profiles
lessons
```

- `courses.published = false` significa **borrador privado**. Las políticas RLS restringen su lectura.
- `lessons.position` determina el orden de lectura en cada curso.
- Las relaciones de foro usan las claves de la cuenta, no cadenas de nombres.
- Los textos publicados se renderizan como texto, no HTML arbitrario.

## Riesgos técnicos de esta primera versión

| Riesgo | Impacto | Control actual | Pendiente |
| --- | --- | --- | --- |
| Elevación de privilegios | Alto | Admin solo por SQL y RLS | Probar escritura directa con cuentas de estudiante |
| Filtración de secretos | Alto | Solo publishable key en Vite | Revisar Git, variables de despliegue y permisos |
| Spam en la comunidad | Alto | Autenticación requerida y moderación básica | Limitar frecuencia, CAPTCHA, antiabuso y seguimiento |
| Suplantación de identidad | Medio | UUID de Auth, no nombre libre como identidad | Verificación de correo, recuperación de cuenta y MFA si procede |
| Publicación de contenido incorrecto | Medio | Estado borrador/publicado y edición | Flujo de revisión, bibliografía, historial de cambios |
| Caídas de servicio externo | Medio | Contenido original público funciona sin Supabase | Estados offline, reintentos y backups |
| Incumplimiento de privacidad | Alto | No se solicitan pagos ni datos financieros | Política de privacidad, consentimiento y borrado de datos |

## Criterios mínimos antes de declararlo terminado

1. Ejecutar `npm run build` con dependencias instaladas y resolver errores.
2. Probar manualmente registro, verificación, cierre de sesión y recuperación de cuenta cuando exista.
3. Ejecutar pruebas de acceso con **dos cuentas** distintas y una cuenta admin.
4. Demostrar que los borradores no pueden leerse con una cuenta estudiante ni por la API.
5. Demostrar que publicar, editar y borrar cursos desde el panel modifica los datos para otros usuarios.
6. Registrar resultados de pruebas (capturas, fecha, navegador, error esperado/observado).
7. Probar menú hamburguesa, teclado y tres tamaños de pantalla.
8. No publicar información personal, contraseñas o claves de servicio en Git.

**Estado de validación de esta entrega:** código y CSS revisados estáticamente; sin pruebas integrales con cuenta Supabase real. La separación entre diseño, implementación y validación forma parte de la documentación universitaria.
