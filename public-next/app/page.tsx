import Link from 'next/link';
import { Zap, ArrowRight } from 'lucide-react';
import { getCourses } from '@/lib/api';

// ISR: la página se regenera como máximo cada 60 segundos.
export const revalidate = 60;

const PORTAL_URL = process.env.NEXT_PUBLIC_PORTAL_URL || 'http://localhost:5173';

export default async function HomePage() {
  const courses = await getCourses();

  return (
    <>
      <section className="hero">
        <div className="container">
          <h1>Aprende algo nuevo hoy</h1>
          <p>Catálogo público de cursos. Regístrate en el portal para inscribirte y seguir tu progreso.</p>
          <div className="ssr-note"><Zap size={14} /> Renderizado estático con ISR (revalidate 60s)</div>
        </div>
      </section>

      <div className="container">
        <h2 className="section-title">Cursos disponibles ({courses.length})</h2>
        {courses.length === 0 ? (
          <p style={{ paddingBottom: '4rem', color: 'var(--muted)' }}>
            No hay cursos disponibles o el backend no está accesible. Verifica <code>NEXT_PUBLIC_API_URL</code>.
          </p>
        ) : (
          <div className="grid">
            {courses.map((course) => (
              <article key={course._id} className="card">
                <div
                  className="card-img"
                  style={{ backgroundImage: `url(${course.imageUrl || 'https://picsum.photos/seed/course/400/250'})` }}
                />
                <div className="card-body">
                  <span className="badge">{course.category?.name || 'General'}</span>
                  <h3>{course.title}</h3>
                  <p className="card-desc">{course.description.slice(0, 90)}{course.description.length > 90 ? '…' : ''}</p>
                  <div className="card-footer">
                    <strong>{course.price > 0 ? `S/ ${course.price}` : 'Gratis'}</strong>
                    <Link href={`/courses/${course._id}`} className="btn">Ver más</Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
        <p style={{ paddingBottom: '3rem' }}>
          ¿Listo para inscribirte? <a href={PORTAL_URL} style={{ color: 'var(--primary)', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>Entra al portal del estudiante <ArrowRight size={16} /></a>
        </p>
      </div>
    </>
  );
}
