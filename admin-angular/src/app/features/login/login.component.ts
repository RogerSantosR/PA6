import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IconComponent } from '../../shared/icon.component';
import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, IconComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);

  submitting = false;
  error = '';

  form = this.fb.nonNullable.group({
    email: ['admin@isil.edu.pe', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.submitting = true;
    this.error = '';
    const { email, password } = this.form.getRawValue();

    this.auth.login(email, password).subscribe({
      next: (res) => {
        if (res.user.role !== 'admin') {
          this.error = 'Esta cuenta no tiene permisos de administrador.';
          this.auth.logout();
          this.submitting = false;
          return;
        }
        this.router.navigate(['/cursos']);
      },
      error: (err) => {
        this.error = err.error?.message || 'No se pudo iniciar sesión';
        this.submitting = false;
      },
    });
  }
}
