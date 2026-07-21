import { Link } from 'react-router-dom';

export default function CourseCard({ course }) {
  return (
    <article className="card">
      <div className="card-img" style={{ backgroundImage: `url(${course.imageUrl || 'https://picsum.photos/seed/course/400/250'})` }} />
      <div className="card-body">
        <span className="badge">{course.category?.name || 'General'}</span>
        <h3>{course.title}</h3>
        <p className="muted">{course.instructor}</p>
        <p className="card-desc">{course.description?.slice(0, 90)}{course.description?.length > 90 ? '…' : ''}</p>
        <div className="card-footer">
          <strong>{course.price > 0 ? `S/ ${course.price}` : 'Gratis'}</strong>
          <Link to={`/curso/${course._id}`} className="btn btn-primary btn-sm">Ver detalle</Link>
        </div>
      </div>
    </article>
  );
}
