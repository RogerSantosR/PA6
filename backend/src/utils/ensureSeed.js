/**
 * Verifica el estado de la base y decide si sembrar:
 *  - Si no puede conectar a MongoDB: avisa y termina SIN error (exit 0) para no
 *    bloquear el arranque de los demás servicios.
 *  - Si la base ya tiene usuarios: omite el seed.
 *  - Si la base está vacía: ejecuta el seed.
 *
 * Uso: npm run ensure-seed
 */
import 'dotenv/config';
import { connectDB, disconnectDB } from '../config/db.js';
import User from '../models/User.js';
import { seed } from './seed.js';

async function main() {
  try {
    await connectDB(process.env.MONGODB_URI);
  } catch (err) {
    console.error('[ensureSeed] AVISO: no se pudo conectar a MongoDB -> ' + err.message);
    console.error('[ensureSeed] Se OMITE el seed. Verifica que MongoDB este corriendo.');
    console.error('[ensureSeed] Los demas servicios se iniciaran igualmente.');
    process.exit(0);
  }

  try {
    const count = await User.countDocuments();
    if (count > 0) {
      console.log(`[ensureSeed] La base ya tiene datos (${count} usuarios). Seed OMITIDO.`);
    } else {
      console.log('[ensureSeed] Base vacia. Ejecutando seed inicial...');
      await seed();
      console.log('[ensureSeed] Seed completado correctamente.');
    }
  } catch (err) {
    console.error('[ensureSeed] ERROR durante el seed: ' + err.message);
    console.error('[ensureSeed] Continuando con el arranque de los servicios.');
  } finally {
    await disconnectDB();
  }
  process.exit(0);
}

main();
