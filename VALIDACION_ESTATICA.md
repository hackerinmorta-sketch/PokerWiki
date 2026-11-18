# Validación realizada · 16 de noviembre de 2026

- Se inspeccionó el ZIP original de **Iteración 3** antes de modificar el proyecto.
- Archivos originales de cursos `contenidoCursos.js`, `data.js`, `Guias.jsx`, `Informacion.jsx`, `Cursos.css` e imágenes clave: comparación de hashes SHA-256 (sin modificaciones).
- Se analizaron archivos JavaScript/JSX mediante el parser de TypeScript y **no se detectaron errores sintácticos**.
- Se revisaron las rutas de todos los imports relativos dentro de `src` y **no quedaron referencias faltantes**.
- Se analizaron los archivos CSS con `tinycss2` y **no se detectaron errores de parseo de hojas de estilos**.
- Se verificó por inspección estática que las seis tablas SQL contienen `ENABLE ROW LEVEL SECURITY` y políticas de lectura/escritura diferenciadas. Esto **NO sustituye las pruebas RLS reales**.

## Limitaciones

- `npm install` no pudo completarse en el contenedor de generación porque no se pudieron recuperar los paquetes del registro; por eso **no se ejecutó `npm run build`**.
- No se configuró una instancia de Supabase del usuario: la autenticación, creación/edición de cursos, publicación y moderación **no están verificadas extremo a extremo**.
- No se ejecutaron pruebas visuales en el navegador contra la aplicación compilada.
- La entrega incluye el plan de pruebas manuales para completar la verificación en IntelliJ y Supabase.

**Conclusión:** esta es una implementación inicial técnicamente estructurada y revisada estáticamente, no un sistema de producción certificado ni un conjunto de pruebas aprobadas. Se requiere conexión y prueba real antes de presentarlo como totalmente operativo.
