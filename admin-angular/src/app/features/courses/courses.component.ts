import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { IconComponent } from '../../shared/icon.component';
import { CourseService } from '../../core/course.service';
import { CategoryService } from '../../core/category.service';
import { Category, Course } from '../../core/models';

@Component({
  selector: 'app-courses',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, IconComponent],
  templateUrl: './courses.component.html',
  styleUrl: './courses.component.css',
})
export class CoursesComponent implements OnInit {
  private fb = inject(FormBuilder);
  private courseService = inject(CourseService);
  private categoryService = inject(CategoryService);

  courses: Course[] = [];
  categories: Category[] = [];
  loading = false;
  error = '';
  search = '';

  showForm = false;
  editingId: string | null = null;
  saving = false;

  form = this.fb.nonNullable.group({
    title: ['', [Validators.required, Validators.minLength(3)]],
    description: ['', [Validators.required]],
    category: ['', [Validators.required]],
    instructor: ['', [Validators.required]],
    price: [0, [Validators.required, Validators.min(0)]],
    capacity: [30, [Validators.required, Validators.min(1)]],
    imageUrl: [''],
    published: [true],
  });

  ngOnInit(): void {
    this.loadCategories();
    this.loadCourses();
  }

  loadCategories(): void {
    this.categoryService.list().subscribe({ next: (c) => (this.categories = c) });
  }

  loadCourses(): void {
    this.loading = true;
    this.error = '';
    this.courseService.list(this.search).subscribe({
      next: (data) => {
        this.courses = data;
        this.loading = false;
      },
      error: () => {
        this.error = 'No se pudieron cargar los cursos. ¿Backend activo?';
        this.loading = false;
      },
    });
  }

  categoryName(course: Course): string {
    return typeof course.category === 'object' ? course.category?.name : '—';
  }

  openCreate(): void {
    this.editingId = null;
    this.form.reset({ price: 0, capacity: 30, published: true, title: '', description: '', category: '', instructor: '', imageUrl: '' });
    this.showForm = true;
  }

  openEdit(course: Course): void {
    this.editingId = course._id;
    this.form.setValue({
      title: course.title,
      description: course.description,
      category: typeof course.category === 'object' ? course.category._id : course.category,
      instructor: course.instructor,
      price: course.price,
      capacity: course.capacity,
      imageUrl: course.imageUrl || '',
      published: course.published,
    });
    this.showForm = true;
  }

  closeForm(): void {
    this.showForm = false;
    this.error = '';
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.saving = true;
    this.error = '';
    const payload = this.form.getRawValue();

    const request = this.editingId
      ? this.courseService.update(this.editingId, payload)
      : this.courseService.create(payload);

    request.subscribe({
      next: () => {
        this.saving = false;
        this.showForm = false;
        this.loadCourses();
      },
      error: (err) => {
        this.saving = false;
        this.error = err.error?.message || 'No se pudo guardar el curso';
      },
    });
  }

  remove(course: Course): void {
    if (!confirm(`¿Eliminar el curso "${course.title}"?`)) return;
    this.courseService.remove(course._id).subscribe({
      next: () => this.loadCourses(),
      error: (err) => (this.error = err.error?.message || 'No se pudo eliminar'),
    });
  }
}
