import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) { }

  canActivate(): boolean {
    const authToken = localStorage.getItem('authToken');
    if (authToken) {
      // Si el usuario ya está autenticado, redireccionar a la página de inicio
      this.router.navigate(['home']);
      return false; // Bloquear el acceso al componente de inicio de sesión
    }
    return true; // Permitir el acceso al componente de inicio de sesión si no está autenticado
  }
}