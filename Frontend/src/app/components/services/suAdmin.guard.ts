import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class suAdminGuard implements CanActivate {
  constructor(private router: Router) { }

 
  canActivate(): boolean {
    let authToken = localStorage.getItem('datosUsuario');
    let UserData = JSON.parse(authToken!)

    if (UserData.rol === "Superadministrador") {
      return true;
    } else {
      this.router.navigate(['home']);
      return false;
    }
  }
}