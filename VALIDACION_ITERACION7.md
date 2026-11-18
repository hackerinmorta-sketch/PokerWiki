# Validación de entrega · Iteración 7

- Se usó como base el código completo de la Iteración 6 (derivada de la Iteración 3).
- Migración 003 **aditiva** sin `DROP TABLE` de datos existentes.
- Se agregaron 6 tablas con RLS explícito, consultas por dueño e índices para claves foráneas principales.
- El frontend mantiene calificaciones, votos, uploads de imágenes y comunidad de la versión anterior.
- Se comprobaron imports relativos y sintaxis JS/JSX con el parser de TypeScript disponible localmente.
- **Limitación:** npm no pudo descargar dependencias (`EAI_AGAIN` al consultar registry.npmjs.org); por tanto **no se pudo ejecutar `npm run build` ni `npm run lint`**.
- No se ejecutó la migración en una instancia real de Supabase, ni las pruebas de permisos con usuarios reales. La validación funcional sigue pendiente.

Al instalar en IntelliJ, sigue `README_ITERACION7.md` y después `PRUEBAS_ITERACION7.md`.
