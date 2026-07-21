/**
 * Servidor de desarrollo con MongoDB en memoria (sin necesidad de Atlas).
 * Útil para probar el flujo completo en local. Siembra datos demo al arrancar.
 *
 * Uso: npm run dev:mem
 */
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { createApp } from '../app.js';
import { seed } from './seed.js';

process.env.JWT_SECRET = process.env.JWT_SECRET || 'dev-mem-secret';
process.env.JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1d';
// Permitir los orígenes de desarrollo de los tres frontends.
process.env.CORS_ORIGINS =
  process.env.CORS_ORIGINS || 'http://localhost:5173,http://localhost:4200,http://localhost:3000';

const PORT = process.env.PORT || 4000;

async function main() {
  const mongod = await MongoMemoryServer.create();
  await mongoose.connect(mongod.getUri());
  console.log('[dev:mem] MongoDB en memoria listo');
  await seed();

  const app = createApp();
  app.listen(PORT, () => {
    console.log(`[dev:mem] API en http://localhost:${PORT} (datos en memoria, se pierden al reiniciar)`);
  });
}

main().catch((err) => {
  console.error('[dev:mem] Error:', err);
  process.exit(1);
});
