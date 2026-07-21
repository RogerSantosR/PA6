import { createContext, useContext, useState, useCallback } from 'react';
import api from '../api/client.js';
import { useAuth } from './AuthContext.jsx';

const EnrollmentContext = createContext(null);

/**
 * Estado global de inscripciones del estudiante autenticado.
 * Se usa en Catalog, CourseDetail y MyEnrollments (>1 componente).
 */
export function EnrollmentProvider({ children }) {
  const { isAuthenticated } = useAuth();
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    if (!isAuthenticated) {
      setEnrollments([]);
      return;
    }
    setLoading(true);
    try {
      const { data } = await api.get('/enrollments/me');
      setEnrollments(data);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  const enroll = useCallback(
    async (courseId) => {
      await api.post('/enrollments', { courseId });
      await refresh();
    },
    [refresh]
  );

  const cancel = useCallback(
    async (enrollmentId) => {
      await api.patch(`/enrollments/${enrollmentId}/cancel`);
      await refresh();
    },
    [refresh]
  );

  // ¿El estudiante ya está inscrito y activo en un curso?
  const isEnrolled = useCallback(
    (courseId) =>
      enrollments.some(
        (e) => (e.course?._id || e.course) === courseId && e.status === 'active'
      ),
    [enrollments]
  );

  const value = { enrollments, loading, refresh, enroll, cancel, isEnrolled };
  return <EnrollmentContext.Provider value={value}>{children}</EnrollmentContext.Provider>;
}

export function useEnrollments() {
  const ctx = useContext(EnrollmentContext);
  if (!ctx) throw new Error('useEnrollments debe usarse dentro de <EnrollmentProvider>');
  return ctx;
}
