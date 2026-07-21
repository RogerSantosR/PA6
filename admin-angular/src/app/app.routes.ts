import { Routes } from '@angular/router';
import { adminGuard } from './core/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./features/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: '',
    canActivate: [adminGuard],
    loadComponent: () => import('./features/dashboard/dashboard.component').then((m) => m.DashboardComponent),
    children: [
      { path: '', redirectTo: 'cursos', pathMatch: 'full' },
      {
        path: 'cursos',
        loadComponent: () => import('./features/courses/courses.component').then((m) => m.CoursesComponent),
      },
      {
        path: 'categorias',
        loadComponent: () => import('./features/categories/categories.component').then((m) => m.CategoriesComponent),
      },
    ],
  },
  { path: '**', redirectTo: '' },
];
