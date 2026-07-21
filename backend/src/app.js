import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';

import authRoutes from './routes/auth.routes.js';
import courseRoutes from './routes/courses.routes.js';
import categoryRoutes from './routes/categories.routes.js';
import enrollmentRoutes from './routes/enrollments.routes.js';
import userRoutes from './routes/users.routes.js';
import { notFound, errorHandler } from './middlewares/error.js';

export function createApp() {
  const app = express();

  // --- Seguridad ---
  app.use(helmet());

  // CORS restringido a los orígenes declarados en CORS_ORIGINS.
  const allowedOrigins = (process.env.CORS_ORIGINS || '')
    .split(',')
    .map((o) => o.trim())
    .filter(Boolean);

  app.use(
    cors({
      origin(origin, callback) {
        // Permitir herramientas sin origin (Postman/curl) y orígenes en la lista.
        if (!origin || allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
          return callback(null, true);
        }
        return callback(new Error(`Origen no permitido por CORS: ${origin}`));
      },
      credentials: true,
    })
  );

  // --- Parsers y logging ---
  app.use(express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ extended: true }));
  if (process.env.NODE_ENV !== 'test') {
    app.use(morgan('dev'));
  }

  // --- Healthcheck ---
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', service: 'plataforma-cursos-api', time: new Date().toISOString() });
  });

  // --- Rutas ---
  app.use('/api/auth', authRoutes);
  app.use('/api/courses', courseRoutes);
  app.use('/api/categories', categoryRoutes);
  app.use('/api/enrollments', enrollmentRoutes);
  app.use('/api/users', userRoutes);

  // --- Errores ---
  app.use(notFound);
  app.use(errorHandler);

  return app;
}
