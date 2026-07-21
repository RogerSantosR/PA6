# Decisiones técnicas

| Decisión | Alternativas | Elección y justificación |
|---|---|---|
| **Estado global en React** | Redux, Zustand, Context API | **Context API**. El estado (auth + inscripciones) es acotado; Context evita boilerplate y dependencias extra. Se usa en más de un componente (Catalog, CourseDetail, MyEnrollments, Navbar). |
| **Estado en Angular** | NgRx, servicios con BehaviorSubject | **Signals + servicios** (`AuthService`). Nativo de Angular 18, reactivo y simple para el alcance del panel. |
| **Autenticación** | Sesiones con cookie, OAuth | **JWT** (stateless). Encaja con backend en Render y frontends en Vercel (dominios distintos), sin estado de sesión en el servidor. |
| **Hash de contraseñas** | argon2, scrypt | **bcryptjs**. Estándar, sin dependencias nativas (facilita el build en Render). |
| **Renderizado del catálogo público** | CSR, SSR puro | **SSG + ISR** en Next.js (`revalidate: 60`). Mejor SEO y rendimiento; contenido casi estático que se regenera periódicamente. |
| **ORM/ODM** | Prisma, driver nativo | **Mongoose**. Requisito del curso; esquemas, validaciones e índices declarativos. |
| **Segunda entidad CRUD** | Instructores, Órdenes | **Categorías**. Habilita el filtrado del catálogo y mantiene el dominio cohesionado. |
| **Validación de entradas** | Joi, Zod | **express-validator**. Integración directa con middlewares de Express. |
| **Build React** | CRA, Webpack manual | **Vite**. Arranque y build rápidos; salida estática ideal para Vercel. |

## Separación de responsabilidades

- El **backend** es la única fuente de verdad y de reglas de negocio (capacidad, roles,
  duplicados). Los frontends nunca confían en datos del cliente para autorizar.
- Cada **frontend** cumple un propósito claro: Next.js (público/SEO), React (estudiante),
  Angular (administración). Todos consumen el mismo contrato REST.

## Convenciones de la API

- Respuestas JSON con códigos HTTP coherentes: `200/201` éxito, `400` validación,
  `401` no autenticado, `403` sin permiso, `404` no encontrado, `409` conflicto, `500` error.
- Errores centralizados en `middlewares/error.js` (traduce errores de Mongoose).
