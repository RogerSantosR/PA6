import 'dotenv/config';
import { createApp } from './app.js';
import { connectDB } from './config/db.js';

const PORT = process.env.PORT || 4000;

async function start() {
  try {
    await connectDB(process.env.MONGODB_URI);
    const app = createApp();
    app.listen(PORT, () => {
      console.log(`[server] API escuchando en http://localhost:${PORT}`);
      console.log(`[server] Healthcheck: http://localhost:${PORT}/api/health`);
    });
  } catch (err) {
    console.error('[server] No se pudo iniciar:', err.message);
    process.exit(1);
  }
}

start();
