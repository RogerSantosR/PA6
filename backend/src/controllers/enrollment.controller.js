import Enrollment from '../models/Enrollment.js';
import Course from '../models/Course.js';

/**
 * POST /api/enrollments — student
 * Body: { courseId }. Inscribe al usuario autenticado.
 */
export async function enroll(req, res, next) {
  try {
    const { courseId } = req.body;
    if (!courseId) return res.status(400).json({ message: 'courseId es obligatorio' });

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: 'Curso no encontrado' });
    if (!course.published) {
      return res.status(400).json({ message: 'El curso no está disponible para inscripción' });
    }

    // ¿Ya está inscrito y activo?
    const existing = await Enrollment.findOne({ student: req.user._id, course: courseId });
    if (existing) {
      if (existing.status === 'active') {
        return res.status(409).json({ message: 'Ya estás inscrito en este curso' });
      }
      // Reactivar una inscripción previamente cancelada.
      existing.status = 'active';
      existing.enrolledAt = new Date();
      await existing.save();
      const populated = await existing.populate('course', 'title instructor price');
      return res.status(200).json(populated);
    }

    // Control simple de capacidad.
    const activeCount = await Enrollment.countDocuments({ course: courseId, status: 'active' });
    if (activeCount >= course.capacity) {
      return res.status(409).json({ message: 'El curso alcanzó su capacidad máxima' });
    }

    const enrollment = await Enrollment.create({ student: req.user._id, course: courseId });
    const populated = await enrollment.populate('course', 'title instructor price');
    res.status(201).json(populated);
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/enrollments/me — student
 * Inscripciones del usuario autenticado.
 */
export async function myEnrollments(req, res, next) {
  try {
    const enrollments = await Enrollment.find({ student: req.user._id })
      .populate({ path: 'course', select: 'title instructor price imageUrl category', populate: { path: 'category', select: 'name' } })
      .sort({ enrolledAt: -1 });
    res.json(enrollments);
  } catch (err) {
    next(err);
  }
}

/**
 * PATCH /api/enrollments/:id/cancel — student (propia) o admin
 */
export async function cancelEnrollment(req, res, next) {
  try {
    const enrollment = await Enrollment.findById(req.params.id);
    if (!enrollment) return res.status(404).json({ message: 'Inscripción no encontrada' });

    const isOwner = enrollment.student.toString() === req.user._id.toString();
    if (!isOwner && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'No puedes cancelar esta inscripción' });
    }

    enrollment.status = 'cancelled';
    await enrollment.save();
    res.json({ message: 'Inscripción cancelada', enrollment });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/enrollments — admin
 * Todas las inscripciones (con datos de estudiante y curso).
 */
export async function listAllEnrollments(req, res, next) {
  try {
    const enrollments = await Enrollment.find()
      .populate('student', 'name email')
      .populate('course', 'title instructor')
      .sort({ enrolledAt: -1 });
    res.json(enrollments);
  } catch (err) {
    next(err);
  }
}
