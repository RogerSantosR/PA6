import User from '../models/User.js';
import { signToken } from '../middlewares/auth.jwt.js';

/**
 * POST /api/auth/register
 * Crea un usuario (rol 'student' por defecto) y devuelve token + usuario.
 */
export async function register(req, res, next) {
  try {
    const { name, email, password, role } = req.body;

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(409).json({ message: 'El correo ya está registrado' });
    }

    // Solo permitimos crear 'student' desde el registro público.
    // El rol 'admin' se crea vía seed o por otro admin (fuera de alcance público).
    const safeRole = role === 'admin' ? 'student' : role || 'student';

    const user = await User.createWithPassword({ name, email, password, role: safeRole });
    const token = signToken(user);

    res.status(201).json({ token, user });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/auth/login
 * Valida credenciales y devuelve token + usuario.
 */
export async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    // passwordHash tiene select:false, hay que pedirlo explícitamente.
    const user = await User.findOne({ email }).select('+passwordHash');
    if (!user) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    const ok = await user.comparePassword(password);
    if (!ok) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    const token = signToken(user);
    res.json({ token, user });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/auth/me
 * Devuelve el usuario autenticado (requireAuth).
 */
export async function me(req, res) {
  res.json({ user: req.user });
}
