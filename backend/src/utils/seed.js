import 'dotenv/config';
import { connectDB, disconnectDB } from '../config/db.js';
import User from '../models/User.js';
import Category from '../models/Category.js';
import Course from '../models/Course.js';

/**
 * Siembra datos iniciales: usuarios de prueba (admin + estudiante),
 * categorías y cursos demo. Idempotente por email/nombre.
 *
 * Uso: npm run seed
 */
export async function seed() {
  const adminEmail = process.env.SEED_ADMIN_EMAIL || 'admin@isil.edu.pe';
  const adminPass = process.env.SEED_ADMIN_PASSWORD || 'Admin123*';
  const studentEmail = process.env.SEED_STUDENT_EMAIL || 'estudiante@isil.edu.pe';
  const studentPass = process.env.SEED_STUDENT_PASSWORD || 'Estudiante123*';

  // Usuarios
  if (!(await User.findOne({ email: adminEmail }))) {
    await User.createWithPassword({ name: 'Administrador', email: adminEmail, password: adminPass, role: 'admin' });
    console.log(`[seed] Admin creado: ${adminEmail}`);
  }
  if (!(await User.findOne({ email: studentEmail }))) {
    await User.createWithPassword({ name: 'Estudiante Demo', email: studentEmail, password: studentPass, role: 'student' });
    console.log(`[seed] Estudiante creado: ${studentEmail}`);
  }

  // Categorías
  const catDefs = [
    { name: 'Desarrollo Web', description: 'Frontend, backend y full stack' },
    { name: 'Ciencia de Datos', description: 'Análisis, ML e IA' },
    { name: 'Diseño', description: 'UX/UI y diseño gráfico' },
  ];
  const categories = {};
  for (const def of catDefs) {
    let cat = await Category.findOne({ name: def.name });
    if (!cat) cat = await Category.create(def);
    categories[def.name] = cat;
  }
  console.log('[seed] Categorías listas');

  // Cursos
  const courseDefs = [
    { title: 'JavaScript desde cero', description: 'Fundamentos de JS moderno (ES6+).', category: categories['Desarrollo Web']._id, instructor: 'Ana Torres', price: 120, capacity: 40, imageUrl: 'https://picsum.photos/seed/js/400/250' },
    { title: 'React y Hooks', description: 'SPA con React, Hooks y React Router.', category: categories['Desarrollo Web']._id, instructor: 'Luis Gómez', price: 150, capacity: 35, imageUrl: 'https://picsum.photos/seed/react/400/250' },
    { title: 'Node.js y APIs REST', description: 'Backend con Express y MongoDB.', category: categories['Desarrollo Web']._id, instructor: 'Carla Ruiz', price: 160, capacity: 30, imageUrl: 'https://picsum.photos/seed/node/400/250' },
    { title: 'Python para Data', description: 'Pandas, NumPy y visualización.', category: categories['Ciencia de Datos']._id, instructor: 'Marco Díaz', price: 180, capacity: 25, imageUrl: 'https://picsum.photos/seed/py/400/250' },
    { title: 'Fundamentos de UX/UI', description: 'Principios de diseño de experiencia.', category: categories['Diseño']._id, instructor: 'Sofía León', price: 110, capacity: 30, imageUrl: 'https://picsum.photos/seed/ux/400/250' },
  ];
  for (const def of courseDefs) {
    if (!(await Course.findOne({ title: def.title }))) {
      await Course.create(def);
    }
  }
  console.log('[seed] Cursos listos');
  console.log('\n[seed] Credenciales de prueba:');
  console.log(`  Admin      -> ${adminEmail} / ${adminPass}`);
  console.log(`  Estudiante -> ${studentEmail} / ${studentPass}`);
}

// Ejecutar como script independiente.
const isMain = process.argv[1] && process.argv[1].replace(/\\/g, '/').endsWith('utils/seed.js');
if (isMain) {
  (async () => {
    try {
      await connectDB(process.env.MONGODB_URI);
      await seed();
    } catch (err) {
      console.error('[seed] Error:', err.message);
      process.exitCode = 1;
    } finally {
      await disconnectDB();
    }
  })();
}
