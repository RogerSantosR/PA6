# Guía de despliegue

Objetivo: **backend en Render**, **frontends en Vercel**, **base de datos en MongoDB Atlas**.
Orden recomendado: Atlas → Backend → Frontends.

---

## 1. MongoDB Atlas

1. Crea una cuenta en <https://www.mongodb.com/atlas> y un clúster gratuito (M0).
2. **Database Access** → crea un usuario con contraseña (permisos *readWrite*).
3. **Network Access** → agrega `0.0.0.0/0` (o las IP de Render) para permitir la conexión.
4. **Connect → Drivers** → copia la cadena `mongodb+srv://…` y añade el nombre de la base
   (`/plataforma_cursos`). Esta es tu `MONGODB_URI`.

## 2. Backend en Render

1. Sube el repositorio a GitHub.
2. En <https://render.com> → **New → Web Service** → conecta el repo.
   - **Root Directory:** `backend`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Health Check Path:** `/api/health`
   - (o usa **New → Blueprint** apuntando a `backend/render.yaml`).
3. En **Environment**, agrega las variables (ver `backend/.env.example`):
   `MONGODB_URI`, `JWT_SECRET`, `JWT_EXPIRES_IN`, `CORS_ORIGINS`, y las `SEED_*`.
   > `CORS_ORIGINS` debe contener las URLs de Vercel de los tres frontends (separadas por coma).
4. Deploy. Cuando esté activo, prueba `https://TU-API.onrender.com/api/health`.
5. (Opcional) Ejecuta el seed una vez: en **Shell** de Render corre `npm run seed`,
   o expón un endpoint temporal. Con la conexión activa también puedes sembrar desde local
   apuntando `MONGODB_URI` al clúster y corriendo `npm run seed`.

> Nota: el plan gratuito de Render "duerme" tras inactividad; la primera petición puede tardar ~30 s.

## 3. Frontends en Vercel

Para **cada** app crea un proyecto en <https://vercel.com> (**Add New → Project** → mismo repo,
seleccionando el subdirectorio como *Root Directory*):

### 3.1 Vista pública — `public-next`
- Framework: **Next.js** (autodetectado).
- Variable de entorno: `NEXT_PUBLIC_API_URL = https://TU-API.onrender.com/api`.
- (Opcional) `NEXT_PUBLIC_PORTAL_URL = https://TU-PORTAL-REACT.vercel.app`.

### 3.2 Portal del estudiante — `student-react`
- Framework: **Vite** (autodetectado). Output: `dist`. Incluye `vercel.json` (rewrites SPA).
- Variable de entorno: `VITE_API_URL = https://TU-API.onrender.com/api`.

### 3.3 Panel administrativo — `admin-angular`
- Framework: **Angular**. Incluye `vercel.json` (build + output `dist/admin-angular/browser`).
- Antes de desplegar, edita `src/environments/environment.ts` con la URL real de la API
  (o crea `environment.production.ts` y configura `fileReplacements`).

## 4. Después de desplegar

1. Copia las URLs de Vercel en `CORS_ORIGINS` del backend (Render) y vuelve a desplegar el backend.
2. Actualiza la sección **URLs desplegadas** del `README.md`.
3. Verifica el flujo completo en una **ventana de incógnito**:
   registro → login → catálogo → inscripción → mis inscripciones → panel admin.
4. Genera el reporte **Lighthouse** de la app pública (ver `docs/lighthouse/README.md`).

## 5. Checklist rápido
- [ ] `MONGODB_URI` conecta desde Render (health OK).
- [ ] `CORS_ORIGINS` incluye los dominios de Vercel.
- [ ] `.env` NO está en el repositorio; `.env.example` sí.
- [ ] Las 3 apps cargan y consumen la API en producción.
- [ ] Rutas admin devuelven 403 para estudiantes.
