# Checklist de seguridad

Controles implementados en la plataforma (rúbrica: *Despliegue, producción y seguridad*).

## Autenticación y autorización
- [x] Contraseñas hasheadas con **bcrypt** (10 rondas). Nunca se almacenan ni devuelven en claro (`select: false`).
- [x] **JWT** firmado con `JWT_SECRET` y expiración (`JWT_EXPIRES_IN`).
- [x] Middleware `requireAuth` valida el token en cada ruta protegida.
- [x] Middleware `requireRole('admin')` protege el CRUD administrativo.
- [x] El registro público no permite crear cuentas `admin` (se fuerza a `student`).
- [x] Frontends: guard/route protection e interceptores que limpian sesión ante 401.

## Cabeceras y transporte
- [x] **Helmet** activo (cabeceras de seguridad HTTP por defecto).
- [x] **HTTPS** provisto por Vercel (frontends) y Render (backend) en producción.
- [x] **CORS restringido** por lista blanca (`CORS_ORIGINS`); rechaza orígenes no autorizados.

## Validación y entrada de datos
- [x] Validación de entradas con **express-validator** en auth, cursos y categorías.
- [x] Validaciones de esquema a nivel Mongoose (longitudes, tipos, enums, formato de email).
- [x] Límite de tamaño de body (`express.json({ limit: '1mb' })`).
- [x] **Rate limiting** en `/api/auth` (protección básica contra fuerza bruta).

## Protección XSS / CSRF
- [x] **XSS**: React y Angular escapan el contenido por defecto; no se usa `innerHTML`/`dangerouslySetInnerHTML` con datos de usuario.
- [x] **CSRF**: el token viaja en el header `Authorization` (no en cookies automáticas), por lo que la superficie CSRF clásica no aplica; CORS restringido refuerza el control.

## Gestión de secretos
- [x] `.env` **no** se sube al repositorio (incluido en `.gitignore`).
- [x] Se entrega `.env.example` en la raíz y en cada app.
- [x] Secretos (URI de Mongo, JWT) se configuran como variables de entorno en Render/Vercel.
- [x] Sin credenciales ni cadenas de conexión hardcodeadas en el código.

## Manejo de errores
- [x] Manejador de errores centralizado; no se filtran stack traces al cliente.
- [x] Códigos HTTP coherentes por tipo de error.

## Auditoría
- [x] Reporte **Lighthouse** de la app pública (ver `docs/lighthouse/`).
- [x] Smoke test end-to-end que verifica auth, roles (403), validaciones (400) y flujo completo.

## Pendiente de configurar por el equipo en producción
- [ ] Restringir el acceso de red en MongoDB Atlas (IP allowlist / usuario con permisos mínimos).
- [ ] Colocar los dominios reales de Vercel en `CORS_ORIGINS` del backend en Render.
- [ ] Verificar que las apps funcionan desde una ventana de incógnito.
