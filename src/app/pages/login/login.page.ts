import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth';
import { LoaderService } from 'src/app/services/loader';
import { ToastService } from 'src/app/services/toast'; 


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false
})
export class LoginPage {
  email = '';
  password = '';
  showPassword = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private toast: ToastService,
    private loader: LoaderService
  ) {}

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  async onLogin() {
    if (!this.email || !this.password) {
      return;
    }

    try {
      await this.authService.login(this.email, this.password);
      await this.loader.present();
      setTimeout(() => this.router.navigate(['/dashboard']), 3000);
    } catch (error: any) {
      console.error('Error al iniciar sesión:', error);
      this.toast.present('🛑 Usuario o credenciales incorrectos.', 'danger'); 
    }
  }

  async onLoginWithGoogle() {
    try {
      await this.authService.loginWithGoogle();
      await this.loader.present('Bienvenido con Google, será redirigido al Dashboard.');
      setTimeout(() => this.router.navigate(['/dashboard']), 3000);
    } catch (error: any) {
      console.error('Error en login con Google:', error);
      this.toast.present('🛑 Error al iniciar sesión con Google.', 'danger');
    }
  }
}