import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getCourse, getCourses } from '@/lib/api';

export const revalidate = 60;

const PORTAL_URL = process.env.NEXT_PUBLIC_PORTAL_URL || 'http://localhost:5173';

/**
 * SSG: pre-genera las páginas de detalle de los cursos existentes en build.
 * Las nuevas se generan on-demand (ISR) gracias a revalidate.
 */
export async function generateStaticParams() {
  const courses = await getCourses();
  return courses.map((c) => ({ id: c._id }));
}

export async function generateMetadata({ params }: { params: { id: string } }) {
  const course = await getCourse(params.id);
  return {
    title: course ? `${course.title} | EduPlatform` : 'Curso no encontrado',
    description: course?.description?.slice(0, 150),
  };
}

export default async function CoursePage({ params }: { params: { id: string } }) {
  const course = await getCourse(params.id);
  if (!course) notFound();

  return (
    <div className="container detail">
      <Link href="/" className="back">← Volver al catálogo</Link>
      <div className="detail-grid">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={course.imageUrl || 'https://picsum.photos/seed/course/600/400'} alt={course.title} />
        <div>
          <span className="badge">{course.category?.name || 'General'}</span>
          <h1>{course.title}</h1>
          <p style={{ color: 'var(--muted)' }}>Instructor: {course.instructor}</p>
          <p>{course.description}</p>
          <ul className="detail-meta">
            <li><strong>Precio:</strong> {course.price > 0 ? `S/ ${course.price}` : 'Gratis'}</li>
            <li><strong>Cupos:</strong> {course.capacity}</li>
          </ul>
          <a className="btn" href={`${PORTAL_URL}/curso/${course._id}`}>Inscribirme en el portal →</a>
        </div>
      </div>
    </div>
  );
}
