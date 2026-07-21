import { useEffect, useState, useCallback } from 'react';
import api from '../api/client.js';
import CourseCard from '../components/CourseCard.jsx';

export default function Catalog() {
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = { published: true };
      if (search) params.search = search;
      if (category) params.category = category;
      const { data } = await api.get('/courses', { params });
      setCourses(data);
    } catch {
      setError('No se pudieron cargar los cursos. ¿El backend está activo?');
    } finally {
      setLoading(false);
    }
  }, [search, category]);

  useEffect(() => {
    api.get('/categories').then(({ data }) => setCategories(data)).catch(() => {});
  }, []);

  useEffect(() => {
    const t = setTimeout(load, 250); // debounce de búsqueda
    return () => clearTimeout(t);
  }, [load]);

  return (
    <div className="container">
      <section className="hero">
        <h1>Explora nuestros cursos</h1>
        <p className="muted">Aprende con los mejores instructores. Inscríbete en minutos.</p>
      </section>

      <div className="filters">
        <input
          type="search"
          placeholder="Buscar por título, instructor…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">Todas las categorías</option>
          {categories.map((c) => (
            <option key={c._id} value={c._id}>{c.name}</option>
          ))}
        </select>
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {loading ? (
        <p>Cargando cursos…</p>
      ) : courses.length === 0 ? (
        <p className="muted">No se encontraron cursos con esos filtros.</p>
      ) : (
        <div className="grid">
          {courses.map((c) => <CourseCard key={c._id} course={c} />)}
        </div>
      )}
    </div>
  );
}
