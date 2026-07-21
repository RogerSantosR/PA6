import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { IconComponent } from '../../shared/icon.component';
import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, IconComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {
  private auth = inject(AuthService);
  private router = inject(Router);

  readonly user = this.auth.user;

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
