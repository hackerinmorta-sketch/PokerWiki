# Instrucción sugerida para Codex en IntelliJ

Analiza este proyecto React + Vite basado en la Iteración 3 de PokerStars. En la raíz hay un README_SISTEMA.md y un PLAN_PRUEBAS.md. NO utilices la Iteración 4 como punto de partida. Su nueva arquitectura usa Supabase para Auth, cursos administrables y comunidad, con SQL en supabase/001_esquema.sql.

Quiero que trabajes en un único cambio cada vez. Antes de editar archivos, lee la arquitectura y comprueba que no se rompan los cursos originales, en especial /modalidades/cash-games. Al editar, muestra qué ficheros tocarás, cuál es el riesgo, ejecuta npm install/npm run build y describe cómo comprobarlo. No elimines archivos ni reescribas todo el diseño sin autorización. No alteres las políticas RLS para que el acceso parezca funcionar si no lo hace. No incluyas claves de servicio en el navegador ni en Git.

Primera tarea concreta: revisa el sistema de autenticación, asegura que se muestran mensajes de error comprensibles y genera pruebas de integración/manuales para roles, cursos publicados/borradores y publicaciones comunitarias. Explica al final qué has comprobado realmente y qué queda pendiente.
