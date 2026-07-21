import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CategoryService } from '../../core/category.service';
import { Category } from '../../core/models';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.css',
})
export class CategoriesComponent implements OnInit {
  private fb = inject(FormBuilder);
  private categoryService = inject(CategoryService);

  categories: Category[] = [];
  loading = false;
  error = '';

  showForm = false;
  editingId: string | null = null;
  saving = false;

  form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    description: [''],
  });

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.error = '';
    this.categoryService.list().subscribe({
      next: (data) => {
        this.categories = data;
        this.loading = false;
      },
      error: () => {
        this.error = 'No se pudieron cargar las categorías.';
        this.loading = false;
      },
    });
  }

  openCreate(): void {
    this.editingId = null;
    this.form.reset({ name: '', description: '' });
    this.showForm = true;
  }

  openEdit(cat: Category): void {
    this.editingId = cat._id;
    this.form.setValue({ name: cat.name, description: cat.description || '' });
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
      ? this.categoryService.update(this.editingId, payload)
      : this.categoryService.create(payload);

    request.subscribe({
      next: () => {
        this.saving = false;
        this.showForm = false;
        this.load();
      },
      error: (err) => {
        this.saving = false;
        this.error = err.error?.message || 'No se pudo guardar la categoría';
      },
    });
  }

  remove(cat: Category): void {
    if (!confirm(`¿Eliminar la categoría "${cat.name}"?`)) return;
    this.categoryService.remove(cat._id).subscribe({
      next: () => this.load(),
      error: (err) => (this.error = err.error?.message || 'No se pudo eliminar'),
    });
  }
}
