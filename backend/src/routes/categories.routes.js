import { Router } from 'express';
import {
  listCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../controllers/category.controller.js';
import { categoryRules } from '../validators/course.validators.js';
import { validate } from '../middlewares/validate.js';
import { requireAuth } from '../middlewares/auth.jwt.js';
import { requireRole } from '../middlewares/role.js';

const router = Router();

// Público
router.get('/', listCategories);
router.get('/:id', getCategory);

// Admin
router.post('/', requireAuth, requireRole('admin'), categoryRules, validate, createCategory);
router.put('/:id', requireAuth, requireRole('admin'), categoryRules, validate, updateCategory);
router.delete('/:id', requireAuth, requireRole('admin'), deleteCategory);

export default router;
