import { Router } from 'express';
import { listUsers } from '../controllers/user.controller.js';
import { requireAuth } from '../middlewares/auth.jwt.js';
import { requireRole } from '../middlewares/role.js';

const router = Router();

router.get('/', requireAuth, requireRole('admin'), listUsers);

export default router;
