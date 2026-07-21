import Category from '../models/Category.js';
import Course from '../models/Course.js';

/** GET /api/categories — público */
export async function listCategories(req, res, next) {
  try {
    const categories = await Category.find().sort({ name: 1 });
    res.json(categories);
  } catch (err) {
    next(err);
  }
}

/** GET /api/categories/:id — público */
export async function getCategory(req, res, next) {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ message: 'Categoría no encontrada' });
    res.json(category);
  } catch (err) {
    next(err);
  }
}

/** POST /api/categories — admin */
export async function createCategory(req, res, next) {
  try {
    const { name, description } = req.body;
    const category = await Category.create({ name, description });
    res.status(201).json(category);
  } catch (err) {
    next(err);
  }
}

/** PUT /api/categories/:id — admin */
export async function updateCategory(req, res, next) {
  try {
    const { name, description } = req.body;
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      { name, description },
      { new: true, runValidators: true }
    );
    if (!category) return res.status(404).json({ message: 'Categoría no encontrada' });
    res.json(category);
  } catch (err) {
    next(err);
  }
}

/** DELETE /api/categories/:id — admin */
export async function deleteCategory(req, res, next) {
  try {
    // No permitir borrar categorías con cursos asociados.
    const inUse = await Course.countDocuments({ category: req.params.id });
    if (inUse > 0) {
      return res.status(409).json({
        message: `No se puede eliminar: ${inUse} curso(s) usan esta categoría`,
      });
    }
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) return res.status(404).json({ message: 'Categoría no encontrada' });
    res.json({ message: 'Categoría eliminada', id: req.params.id });
  } catch (err) {
    next(err);
  }
}
