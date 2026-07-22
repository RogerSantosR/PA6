# Plataforma de Gestión de Cursos e Inscripciones

Proyecto integrador full stack — **Programación Web II (ISIL, código 30690)**.
Aplicación web moderna que integra frontend, backend, persistencia, autenticación,
gestión de estado, optimización para producción y controles básicos de seguridad.

> **Antes de entregar**, completa las secciones marcadas con `⟨…⟩`
> (integrantes, URLs desplegadas, enlace de YouTube y capturas).

---

## 1. Descripción y problema

Las instituciones necesitan una plataforma donde los estudiantes puedan **descubrir cursos
e inscribirse en línea**, mientras un equipo administrativo **gestiona el catálogo**. Esta
solución resuelve ese flujo de principio a fin: registro/login, catálogo público, inscripción,
panel del estudiante y panel administrativo, todo con datos persistidos en MongoDB.

## 2. Objetivos

- Ofrecer un catálogo de cursos consultable y filtrable (público y autenticado).
- Permitir a estudiantes autenticados inscribirse y ver sus inscripciones.
- Dar a administradores un CRUD de cursos y categorías protegido por rol.
- Desplegar la solución en la nube con controles básicos de seguridad.

## 3. Integrantes

| Nombre | Rol / aporte principal | Usuario GitHub |
|---|---|---|
| ⟨Renato Marmanillo Santi⟩ | ⟨Backend / API⟩ | ⟨@usuario⟩ |
| ⟨Roger Angel Santos Ramos⟩ | ⟨React / estado⟩ | ⟨@usuario⟩ |
| ⟨Alexis Sebastian Quispe Ramos⟩ | ⟨Angular / admin⟩ | ⟨@usuario⟩ |
| ⟨Esli Rodrigo Julca Luis⟩ | ⟨Next.js / seguridad⟩ | ⟨@usuario⟩ |

## 4. Arquitectura y tecnologías

| Capa | Tecnología | Carpeta |
|---|---|---|
| Backend / API REST | Node.js, Express, Mongoose, JWT, bcrypt | [`backend/`](backend/) |
| Vista pública (SSG/ISR) | Next.js (App Router), TypeScript | [`public-next/`](public-next/) |
| Portal del estudiante (SPA) | React, Vite, React Router, Context API | [`student-react/`](student-react/) |
| Panel administrativo | Angular 18, formularios reactivos | [`admin-angular/`](admin-angular/) |
| Base de datos | MongoDB Atlas | — |

Diagramas y detalle en [`docs/arquitectura.md`](docs/arquitectura.md) y
[`docs/modelo-datos.md`](docs/modelo-datos.md).

```
┌── public-next (Vercel) ──┐
│   catálogo público SSG   │
├── student-react (Vercel)─┤ ──HTTP/JWT──▶  backend (Render) ──Mongoose──▶ MongoDB Atlas
│   portal del estudiante  │
├── admin-angular (Vercel)─┤
│   panel administrativo   │
└──────────────────────────┘
```

## 5. Instalación y ejecución local

**Requisitos:** Node.js ≥ 18 y una base MongoDB (Atlas o local).

```bash
# 1) Backend
cd backend
cp .env.example .env          # completa MONGODB_URI y JWT_SECRET
npm install
npm run seed                  # crea usuarios y datos demo
npm run dev                   # http://localhost:4000

# 2) Portal del estudiante (React)
cd ../student-react
cp .env.example .env          # VITE_API_URL=http://localhost:4000/api
npm install
npm run dev                   # http://localhost:5173

# 3) Vista pública (Next.js)
cd ../public-next
cp .env.example .env          # NEXT_PUBLIC_API_URL=http://localhost:4000/api
npm install
npm run dev                   # http://localhost:3000

# 4) Panel administrativo (Angular)
cd ../admin-angular
npm install
npm start                     # http://localhost:4200
# (la URL de la API se configura en src/environments/environment.ts)
```

## 6. Variables de entorno

Ver [`.env.example`](.env.example) en la raíz y en cada app. Resumen:

| App | Variable | Ejemplo |
|---|---|---|
| backend | `MONGODB_URI` | `mongodb+srv://…/plataforma_cursos` |
| backend | `JWT_SECRET` | cadena larga aleatoria |
| backend | `CORS_ORIGINS` | `https://portal.vercel.app,https://admin.vercel.app` |
| student-react | `VITE_API_URL` | `https://api.onrender.com/api` |
| public-next | `NEXT_PUBLIC_API_URL` | `https://api.onrender.com/api` |
| admin-angular | `apiUrl` (environment.ts) | `https://api.onrender.com/api` |

## 7. Credenciales de prueba

Generadas por `npm run seed` (cámbialas con las variables `SEED_*`):

| Rol | Correo | Contraseña |
|---|---|---|
| Administrador | `admin@isil.edu.pe` | `Admin123*` |
| Estudiante | `estudiante@isil.edu.pe` | `Estudiante123*` |

> No se exponen secretos reales; estas son credenciales de datos sembrados de demostración.

## 8. Endpoints principales de la API

Base: `/api` — colección completa en [`docs/postman_collection.json`](docs/postman_collection.json).

| Método | Ruta | Acceso | Descripción |
|---|---|---|---|
| POST | `/auth/register` | público | Registro de estudiante |
| POST | `/auth/login` | público | Login (devuelve JWT) |
| GET | `/auth/me` | autenticado | Usuario actual |
| GET | `/courses` | público | Lista/busca/filtra cursos |
| GET | `/courses/:id` | público | Detalle de curso |
| POST/PUT/DELETE | `/courses/:id` | admin | CRUD de cursos |
| GET | `/categories` | público | Lista de categorías |
| POST/PUT/DELETE | `/categories/:id` | admin | CRUD de categorías |
| POST | `/enrollments` | estudiante | Inscribirse en un curso |
| GET | `/enrollments/me` | estudiante | Mis inscripciones |
| PATCH | `/enrollments/:id/cancel` | dueño/admin | Cancelar inscripción |
| GET | `/enrollments` | admin | Todas las inscripciones |
| GET | `/users` | admin | Lista de usuarios |

## 9. Pruebas

```bash
cd backend && npm run smoke   # smoke test E2E con MongoDB en memoria (21 verificaciones)
```

## 10. Despliegue

Guía paso a paso en [`docs/despliegue.md`](docs/despliegue.md).
Resumen: **backend → Render**, **frontends → Vercel**, **base de datos → MongoDB Atlas**.

## 11. URLs desplegadas

| Aplicación | URL |
|---|---|
| Vista pública (Next.js) | ⟨https://…vercel.app⟩ |
| Portal del estudiante (React) | ⟨https://…vercel.app⟩ |
| Panel administrativo (Angular) | ⟨https://…vercel.app⟩ |
| API (Render) | ⟨https://…onrender.com/api⟩ |

## 12. Video de exposición (YouTube)

⟨https://youtu.be/…⟩  *(12–15 min, todos los integrantes con cámara)*

## 13. Documentación técnica (`/docs`)

- [Arquitectura](docs/arquitectura.md) · [Modelo de datos](docs/modelo-datos.md)
- [Decisiones técnicas](docs/decisiones-tecnicas.md) · [Checklist de seguridad](docs/checklist-seguridad.md)
- [Colección Postman](docs/postman_collection.json) · [Lighthouse](docs/lighthouse/README.md)
- [Guía de despliegue](docs/despliegue.md)

## 14. Capturas

⟨Agrega capturas del catálogo, la inscripción, "mis inscripciones" y el panel admin.⟩
