/**
 * Smoke test end-to-end del backend SIN necesidad de MongoDB Atlas.
 * Levanta un MongoDB en memoria, arranca la app y ejerce el flujo completo:
 *   health -> register -> login student -> login admin ->
 *   crear categoría (admin) -> crear curso (admin) -> listar cursos ->
 *   inscribir (student) -> mis inscripciones -> admin lista inscripciones ->
 *   verifica que student NO puede crear curso (403).
 *
 * Uso: npm run smoke
 */
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { createApp } from '../app.js';
import { seed } from './seed.js';

process.env.JWT_SECRET = process.env.JWT_SECRET || 'smoke-test-secret';
process.env.JWT_EXPIRES_IN = '1h';
process.env.CORS_ORIGINS = '';
process.env.NODE_ENV = 'test';

let passed = 0;
let failed = 0;

function check(name, condition, extra = '') {
  if (condition) {
    passed++;
    console.log(`  [OK]   ${name}`);
  } else {
    failed++;
    console.log(`  [FAIL] ${name} ${extra}`);
  }
}

async function main() {
  const mongod = await MongoMemoryServer.create();
  await mongoose.connect(mongod.getUri());
  await seed();

  const app = createApp();
  const server = app.listen(0);
  const { port } = server.address();
  const base = `http://127.0.0.1:${port}/api`;

  const api = async (method, path, { token, body } = {}) => {
    const res = await fetch(base + path, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      ...(body ? { body: JSON.stringify(body) } : {}),
    });
    const data = await res.json().catch(() => ({}));
    return { status: res.status, data };
  };

  console.log('\n=== SMOKE TEST BACKEND ===\n');

  // Health
  let r = await api('GET', '/health');
  check('GET /health responde 200', r.status === 200);

  // Registro de un nuevo estudiante
  r = await api('POST', '/auth/register', {
    body: { name: 'Nuevo Alumno', email: 'nuevo@isil.edu.pe', password: 'Passw0rd*' },
  });
  check('POST /auth/register crea usuario (201) con token', r.status === 201 && !!r.data.token, JSON.stringify(r.data));
  check('register no expone passwordHash', r.data.user && r.data.user.passwordHash === undefined);

  // Registro con email inválido -> 400
  r = await api('POST', '/auth/register', { body: { name: 'X', email: 'no-email', password: '123' } });
  check('register inválido responde 400', r.status === 400);

  // Login estudiante (seed)
  r = await api('POST', '/auth/login', {
    body: { email: process.env.SEED_STUDENT_EMAIL || 'estudiante@isil.edu.pe', password: process.env.SEED_STUDENT_PASSWORD || 'Estudiante123*' },
  });
  check('login estudiante responde 200', r.status === 200 && !!r.data.token);
  const studentToken = r.data.token;

  // Login admin (seed)
  r = await api('POST', '/auth/login', {
    body: { email: process.env.SEED_ADMIN_EMAIL || 'admin@isil.edu.pe', password: process.env.SEED_ADMIN_PASSWORD || 'Admin123*' },
  });
  check('login admin responde 200', r.status === 200 && r.data.user.role === 'admin');
  const adminToken = r.data.token;

  // Login credenciales incorrectas -> 401
  r = await api('POST', '/auth/login', { body: { email: 'admin@isil.edu.pe', password: 'malaClave' } });
  check('login incorrecto responde 401', r.status === 401);

  // Listar categorías (público)
  r = await api('GET', '/categories');
  check('GET /categories (público) responde 200 con datos', r.status === 200 && r.data.length >= 1);
  const categoryId = r.data[0]._id;

  // Estudiante NO puede crear categoría -> 403
  r = await api('POST', '/categories', { token: studentToken, body: { name: 'Prohibida' } });
  check('estudiante NO crea categoría (403)', r.status === 403);

  // Admin crea categoría
  r = await api('POST', '/categories', { token: adminToken, body: { name: 'Marketing Digital', description: 'SEO y ads' } });
  check('admin crea categoría (201)', r.status === 201 && r.data.name === 'Marketing Digital');

  // Admin crea curso
  r = await api('POST', '/courses', {
    token: adminToken,
    body: { title: 'Curso de prueba', description: 'Curso creado en smoke test', category: categoryId, instructor: 'Docente', price: 99, capacity: 2 },
  });
  check('admin crea curso (201)', r.status === 201 && r.data.title === 'Curso de prueba', JSON.stringify(r.data));
  const courseId = r.data._id;

  // Estudiante NO puede crear curso -> 403
  r = await api('POST', '/courses', { token: studentToken, body: { title: 'Hack', description: 'x', category: categoryId, instructor: 'x' } });
  check('estudiante NO crea curso (403)', r.status === 403);

  // Crear curso sin token -> 401
  r = await api('POST', '/courses', { body: { title: 'Anon', description: 'x', category: categoryId, instructor: 'x' } });
  check('crear curso sin token (401)', r.status === 401);

  // Listar cursos (público) con búsqueda
  r = await api('GET', '/courses?search=prueba');
  check('GET /courses?search filtra resultados', r.status === 200 && r.data.some((c) => c._id === courseId));

  // Inscripción del estudiante
  r = await api('POST', '/enrollments', { token: studentToken, body: { courseId } });
  check('estudiante se inscribe (201)', r.status === 201);

  // Inscripción duplicada -> 409
  r = await api('POST', '/enrollments', { token: studentToken, body: { courseId } });
  check('inscripción duplicada responde 409', r.status === 409);

  // Mis inscripciones
  r = await api('GET', '/enrollments/me', { token: studentToken });
  check('GET /enrollments/me devuelve la inscripción', r.status === 200 && r.data.length >= 1);
  const enrollmentId = r.data[0]._id;

  // Admin lista todas las inscripciones
  r = await api('GET', '/enrollments', { token: adminToken });
  check('admin lista inscripciones (200)', r.status === 200 && r.data.length >= 1);

  // Estudiante cancela su inscripción
  r = await api('PATCH', `/enrollments/${enrollmentId}/cancel`, { token: studentToken });
  check('estudiante cancela su inscripción (200)', r.status === 200 && r.data.enrollment.status === 'cancelled');

  // Validación de curso inválido al crear -> 400
  r = await api('POST', '/courses', { token: adminToken, body: { title: 'x', description: '', category: 'no-id', instructor: '' } });
  check('curso inválido responde 400', r.status === 400);

  // Ruta inexistente -> 404
  r = await api('GET', '/no-existe');
  check('ruta inexistente responde 404', r.status === 404);

  // Cierre
  await new Promise((resolve) => server.close(resolve));
  await mongoose.disconnect();
  await mongod.stop();

  console.log(`\n=== RESULTADO: ${passed} passed, ${failed} failed ===\n`);
  process.exit(failed === 0 ? 0 : 1);
}

main().catch((err) => {
  console.error('Smoke test falló con excepción:', err);
  process.exit(1);
});
