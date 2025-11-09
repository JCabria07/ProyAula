import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth';
import { ToastService } from 'src/app/services/toast';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  standalone: false
})
export class NavbarComponent {

  constructor(
    private router: Router,
    private authService: AuthService,
    private toast: ToastService
  ) {}

  async cerrarSesion() {
    await this.toast.present('Cerrando sesión. ¡Hasta la próxima!', 'success');
    await this.authService.logout();

    setTimeout(() => {
      this.router.navigate(['/home']);
    }, 1000);
  }
}