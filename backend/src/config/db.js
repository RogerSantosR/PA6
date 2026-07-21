import mongoose from 'mongoose';

/**
 * Conecta a MongoDB usando la URI de entorno.
 * Lanza el error hacia arriba para que server.js decida si aborta.
 */
export async function connectDB(uri) {
  if (!uri) {
    throw new Error('MONGODB_URI no está definida en las variables de entorno');
  }
  mongoose.set('strictQuery', true);
  await mongoose.connect(uri, {
    // Opciones seguras por defecto; Mongoose 8 ya usa el nuevo parser.
    serverSelectionTimeoutMS: 10000,
  });
  console.log('[db] Conectado a MongoDB');
  return mongoose.connection;
}

export async function disconnectDB() {
  await mongoose.disconnect();
  console.log('[db] Desconectado de MongoDB');
}
