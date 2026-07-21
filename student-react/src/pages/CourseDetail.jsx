import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Check } from 'lucide-react';
import api from '../api/client.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useEnrollments } from '../context/EnrollmentContext.jsx';

export default function CourseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { enroll, isEnrolled, refresh } = useEnrollments();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState(null);
  const [working, setWorking] = useState(false);

  useEffect(() => {
    api.get(`/courses/${id}`)
      .then(({ data }) => setCourse(data))
      .catch(() => setMsg({ type: 'error', text: 'Curso no encontrado' }))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (isAuthenticated) refresh();
  }, [isAuthenticated, refresh]);

  const handleEnroll = async () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/curso/${id}` } });
      return;
    }
    setWorking(true);
    setMsg(null);
    try {
      await enroll(id);
      setMsg({ type: 'success', text: '¡Inscripción exitosa! Revisa "Mis inscripciones".' });
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.message || 'No se pudo inscribir' });
    } finally {
      setWorking(false);
    }
  };

  if (loading) return <p className="container">Cargando…</p>;
  if (!course) return <div className="container"><p>Curso no encontrado.</p><Link to="/" className="back-link"><ArrowLeft size={16} /> Volver</Link></div>;

  const enrolled = isEnrolled(course._id);

  return (
    <div className="container detail">
      <Link to="/" className="back-link"><ArrowLeft size={16} /> Volver al catálogo</Link>
      <div className="detail-grid">
        <img src={course.imageUrl || 'https://picsum.photos/seed/course/600/400'} alt={course.title} />
        <div>
          <span className="badge">{course.category?.name || 'General'}</span>
          <h1>{course.title}</h1>
          <p className="muted">Instructor: {course.instructor}</p>
          <p>{course.description}</p>
          <ul className="detail-meta">
            <li><strong>Precio:</strong> {course.price > 0 ? `S/ ${course.price}` : 'Gratis'}</li>
            <li><strong>Cupos:</strong> {course.capacity}</li>
          </ul>
          {msg && <div className={`alert alert-${msg.type}`}>{msg.text}</div>}
          {enrolled ? (
            <button className="btn btn-success btn-icon-text" disabled><Check size={16} /> Ya estás inscrito</button>
          ) : (
            <button className="btn btn-primary" onClick={handleEnroll} disabled={working}>
              {working ? 'Procesando…' : isAuthenticated ? 'Inscribirme' : 'Inicia sesión para inscribirte'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
