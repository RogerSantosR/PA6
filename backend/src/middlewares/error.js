/**
 * 404 para rutas no encontradas.
 */
export function notFound(req, res) {
  res.status(404).json({ message: `Ruta no encontrada: ${req.method} ${req.originalUrl}` });
}

/**
 * Manejador de errores centralizado. Traduce errores comunes de Mongoose
 * a respuestas HTTP coherentes.
 */
// eslint-disable-next-line no-unused-vars
export function errorHandler(err, req, res, _next) {
  console.error('[error]', err.message);

  // Error de validación de Mongoose
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      message: 'Datos inválidos',
      errors: Object.values(err.errors).map((e) => ({ campo: e.path, mensaje: e.message })),
    });
  }

  // ID de Mongo con formato inválido
  if (err.name === 'CastError') {
    return res.status(400).json({ message: `Identificador inválido: ${err.value}` });
  }

  // Índice único duplicado (p. ej. email o inscripción repetida)
  if (err.code === 11000) {
    const campo = Object.keys(err.keyValue || {}).join(', ');
    return res.status(409).json({ message: `Ya existe un registro con ese ${campo}` });
  }

  const status = err.status || 500;
  res.status(status).json({
    message: err.message || 'Error interno del servidor',
  });
}
