const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

export interface Category {
  _id: string;
  name: string;
  description?: string;
}

export interface Course {
  _id: string;
  title: string;
  description: string;
  category?: Category | null;
  instructor: string;
  price: number;
  capacity: number;
  imageUrl?: string;
  published: boolean;
}

/**
 * Obtiene los cursos publicados.
 * `revalidate: 60` habilita ISR: la página se regenera como máximo cada 60s.
 */
export async function getCourses(params: { search?: string; category?: string } = {}): Promise<Course[]> {
  const qs = new URLSearchParams({ published: 'true' });
  if (params.search) qs.set('search', params.search);
  if (params.category) qs.set('category', params.category);

  try {
    const res = await fetch(`${API_URL}/courses?${qs.toString()}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return [];
    return res.json();
  } catch {
    // Backend no accesible (p. ej. durante el build sin API activa).
    return [];
  }
}

export async function getCourse(id: string): Promise<Course | null> {
  try {
    const res = await fetch(`${API_URL}/courses/${id}`, { next: { revalidate: 60 } });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function getCategories(): Promise<Category[]> {
  try {
    const res = await fetch(`${API_URL}/categories`, { next: { revalidate: 300 } });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}
