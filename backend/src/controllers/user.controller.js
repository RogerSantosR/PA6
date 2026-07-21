import User from '../models/User.js';

/** GET /api/users — admin: lista de usuarios */
export async function listUsers(req, res, next) {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    next(err);
  }
}
