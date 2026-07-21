export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'admin' | 'student';
  createdAt?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface Category {
  _id: string;
  name: string;
  description?: string;
}

export interface Course {
  _id: string;
  title: string;
  description: string;
  category: Category | string;
  instructor: string;
  price: number;
  capacity: number;
  imageUrl?: string;
  published: boolean;
  createdAt?: string;
}

export interface Enrollment {
  _id: string;
  student: User | string;
  course: Course | string;
  status: 'active' | 'cancelled';
  enrolledAt: string;
}
