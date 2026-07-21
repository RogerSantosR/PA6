import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useEnrollments } from '../context/EnrollmentContext.jsx';

export default function MyEnrollments() {
  const { enrollments, loading, refresh, cancel } = useEnrollments();
  const [busyId, setBusyId] = useState(null);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const handleCancel = async (id) => {
    setBusyId(id);
    try {
      await cancel(id);
    } finally {
      setBusyId(null);
    }
  };

  const active = enrollments.filter((e) => e.status === 'active');

  return (
    <div className="container">
      <h1>Mis inscripciones</h1>
      {loading ? (
        <p>Cargando…</p>
      ) : active.length === 0 ? (
        <div className="empty">
          <p className="muted">Aún no tienes inscripciones activas.</p>
          <Link to="/" className="btn btn-primary">Ver catálogo</Link>
        </div>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Curso</th>
              <th>Categoría</th>
              <th>Precio</th>
              <th>Fecha</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {active.map((e) => (
              <tr key={e._id}>
                <td>{e.course?.title || 'Curso eliminado'}</td>
                <td>{e.course?.category?.name || '—'}</td>
                <td>{e.course?.price > 0 ? `S/ ${e.course.price}` : 'Gratis'}</td>
                <td>{new Date(e.enrolledAt).toLocaleDateString()}</td>
                <td>
                  <button className="btn btn-ghost btn-sm" onClick={() => handleCancel(e._id)} disabled={busyId === e._id}>
                    {busyId === e._id ? '…' : 'Cancelar'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
