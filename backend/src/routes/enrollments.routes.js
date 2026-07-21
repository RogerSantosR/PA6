import { Router } from 'express';
import {
  enroll,
  myEnrollments,
  cancelEnrollment,
  listAllEnrollments,
} from '../controllers/enrollment.controller.js';
import { requireAuth } from '../middlewares/auth.jwt.js';
import { requireRole } from '../middlewares/role.js';

const router = Router();

// Estudiante autenticado
router.post('/', requireAuth, requireRole('student', 'admin'), enroll);
router.get('/me', requireAuth, myEnrollments);
router.patch('/:id/cancel', requireAuth, cancelEnrollment);

// Admin: todas las inscripciones
router.get('/', requireAuth, requireRole('admin'), listAllEnrollments);

export default router;
