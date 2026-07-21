import { body } from 'express-validator';

export const courseRules = [
  body('title').trim().isLength({ min: 3, max: 120 }).withMessage('El título debe tener entre 3 y 120 caracteres'),
  body('description').trim().isLength({ min: 1, max: 2000 }).withMessage('La descripción es obligatoria (máx. 2000)'),
  body('category').isMongoId().withMessage('La categoría debe ser un ID válido'),
  body('instructor').trim().isLength({ min: 2, max: 80 }).withMessage('El instructor es obligatorio'),
  body('price').optional().isFloat({ min: 0 }).withMessage('El precio debe ser un número >= 0'),
  body('capacity').optional().isInt({ min: 1 }).withMessage('La capacidad debe ser un entero >= 1'),
  body('imageUrl').optional({ values: 'falsy' }).isURL().withMessage('imageUrl debe ser una URL válida'),
  body('published').optional().isBoolean().withMessage('published debe ser booleano'),
];

export const categoryRules = [
  body('name').trim().isLength({ min: 2, max: 60 }).withMessage('El nombre debe tener entre 2 y 60 caracteres'),
  body('description').optional({ values: 'falsy' }).trim().isLength({ max: 300 }).withMessage('Máx. 300 caracteres'),
];
