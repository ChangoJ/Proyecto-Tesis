import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) { }

 
  canActivate(): boolean {
    const authToken = localStorage.getItem('authToken');
    if (authToken) {
      return true;
    } else {
      this.router.navigate(['login']);
      return false;
    }
  }
}