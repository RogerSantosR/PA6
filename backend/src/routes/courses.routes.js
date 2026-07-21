import { Router } from 'express';
import {
  listCourses,
  getCourse,
  createCourse,
  updateCourse,
  deleteCourse,
} from '../controllers/course.controller.js';
import { courseRules } from '../validators/course.validators.js';
import { validate } from '../middlewares/validate.js';
import { requireAuth } from '../middlewares/auth.jwt.js';
import { requireRole } from '../middlewares/role.js';

const router = Router();

// Público
router.get('/', listCourses);
router.get('/:id', getCourse);

// Admin
router.post('/', requireAuth, requireRole('admin'), courseRules, validate, createCourse);
router.put('/:id', requireAuth, requireRole('admin'), courseRules, validate, updateCourse);
router.delete('/:id', requireAuth, requireRole('admin'), deleteCourse);

export default router;
