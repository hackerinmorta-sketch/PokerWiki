# Avance de desarrollo 2 · Navegación e interfaces

**Fecha de elaboración:** 11 de noviembre de 2026  
**Proyecto:** Sitio web informativo de PokerStars  
**Tipo:** Proyecto académico no oficial

## Objetivo del incremento

Convertir la portada estática en una aplicación navegable con páginas informativas para modalidades, guías, empresa, contacto y juego responsable, conservando la identidad visual del prototipo.

## Elementos desarrollados

| Función | Ruta o ubicación | Estado |
|---|---|---|
| Inicio y navegación | `/` | Implementado |
| Formatos de juego y variantes | `/modalidades` | Implementado |
| Torneos, Spin & Go, Sit & Go, Cash Games | `/modalidades/...` | Fichas introductorias |
| Texas Hold'em, Omaha, Seven Card Stud | `/modalidades/...` | Fichas introductorias |
| Guías y tres artículos básicos | `/guias/...` | Contenido inicial |
| Información de empresa | `/empresa` | Provisional |
| Orientación y contacto | `/contacto` | Provisional, sin formulario |
| Juego responsable | `/juego-responsable` | Introducción |
| Carrusel y animaciones | Inicio y CSS | Implementado |
| Página no encontrada | Rutas no válidas | Implementado |

## Pruebas de desarrollo

Se verificaron el renderizado del contenido, las rutas y la interacción principal usando una vista de pruebas con React, sin acceso a dependencias externas nuevas. Se revisaron los diseños en tamaños de pantalla de 1440 px y 390 px sin desbordamiento horizontal en las pantallas capturadas.

**Pendiente:** ejecutar y registrar el resultado de `npm run build` en el equipo del estudiante; comprobar navegadores distintos y medir accesibilidad/rendimiento con herramientas específicas.

## Trabajo pendiente

- Revisar y ampliar las fuentes bibliográficas del contenido.
- Incorporar pruebas funcionales automatizadas como parte de la entrega universitaria.
- En una iteración posterior, migrar la navegación a React Router para aprovechar su ecosistema y alinear el código con la documentación de arquitectura.
- Completar textos institucionales y comprobar sus referencias antes de publicación.
- Publicar la aplicación si el profesor lo solicita y configurar fallback hacia `index.html`.

## Nota de alcance

No se desarrollaron servicios de apuestas, cuentas, bases de datos, pagos ni atención oficial al usuario. La funcionalidad implementada es navegación y presentación de información.
