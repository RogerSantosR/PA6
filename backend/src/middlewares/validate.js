import { validationResult } from 'express-validator';

/**
 * Middleware que recoge los errores de express-validator y responde 400
 * con una lista comprensible. Se coloca al final de la cadena de validadores.
 */
export function validate(req, res, next) {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    return res.status(400).json({
      message: 'Errores de validación',
      errors: result.array().map((e) => ({ campo: e.path, mensaje: e.msg })),
    });
  }
  next();
}
