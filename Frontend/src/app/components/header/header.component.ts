import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  especificacion() {
    this._router.navigate(['/especificacion/asignaturas'])
  }

  constructor(private _authService: AuthService,
    private _router: Router) {

  }

  logout() {

    Swal.fire({
      title: '¿Estás seguro de cerrar sesión?',
      text: 'Se perdera todo lo que no ha guardado y se cerrara sesión.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Cerrar Sesión',
    }).then((result: any) => {
      if (result.isConfirmed) {
        this._authService.logout()
        setTimeout(() => {
          this._router.navigate(['/login']);
        }, 800);


        Swal.fire('Sesión cerrada', 'Ha cerrado sesión', 'success');
      } else {
        Swal.fire('Operación cancelada', 'No ha cerrado sesón', 'warning');
      }
    });
  }
}
