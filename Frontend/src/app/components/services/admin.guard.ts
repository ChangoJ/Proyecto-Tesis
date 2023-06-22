import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  constructor(private router: Router) { }

 
  canActivate(): boolean {
    let authToken = localStorage.getItem('datosUsuario');
    let UserData = JSON.parse(authToken!)

    if (UserData.rol === "Administrador" || UserData.rol === "Superadministrador") {
      return true;
    } else {
      this.router.navigate(['home']);
      return false;
    }
  }
}