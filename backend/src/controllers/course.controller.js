import Course from '../models/Course.js';
import Enrollment from '../models/Enrollment.js';

/**
 * GET /api/courses — público
 * Soporta ?search=texto&category=<id>&published=true
 */
export async function listCourses(req, res, next) {
  try {
    const { search, category, published } = req.query;
    const filter = {};

    if (category) filter.category = category;
    if (published !== undefined) filter.published = published === 'true';

    if (search) {
      // Búsqueda simple por título o descripción (case-insensitive).
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { instructor: { $regex: search, $options: 'i' } },
      ];
    }

    const courses = await Course.find(filter)
      .populate('category', 'name')
      .sort({ createdAt: -1 });

    res.json(courses);
  } catch (err) {
    next(err);
  }
}

/** GET /api/courses/:id — público */
export async function getCourse(req, res, next) {
  try {
    const course = await Course.findById(req.params.id).populate('category', 'name description');
    if (!course) return res.status(404).json({ message: 'Curso no encontrado' });
    res.json(course);
  } catch (err) {
    next(err);
  }
}

/** POST /api/courses — admin */
export async function createCourse(req, res, next) {
  try {
    const course = await Course.create(req.body);
    const populated = await course.populate('category', 'name');
    res.status(201).json(populated);
  } catch (err) {
    next(err);
  }
}

/** PUT /api/courses/:id — admin */
export async function updateCourse(req, res, next) {
  try {
    const course = await Course.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate('category', 'name');
    if (!course) return res.status(404).json({ message: 'Curso no encontrado' });
    res.json(course);
  } catch (err) {
    next(err);
  }
}

/** DELETE /api/courses/:id — admin */
export async function deleteCourse(req, res, next) {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);
    if (!course) return res.status(404).json({ message: 'Curso no encontrado' });
    // Limpiar inscripciones asociadas.
    await Enrollment.deleteMany({ course: req.params.id });
    res.json({ message: 'Curso eliminado', id: req.params.id });
  } catch (err) {
    next(err);
  }
}
