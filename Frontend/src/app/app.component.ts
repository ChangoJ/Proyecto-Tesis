import { Component, HostListener, OnInit } from '@angular/core';
import { DetalleService } from './components/services/detalle.service';
import { AuthService } from './components/services/auth.service';
import { NavigationEnd, Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [DetalleService, AuthService]
})
export class AppComponent {
  public title = 'sistema-web-creacion-de-horarios-unibe';

  private timeoutId: any;
  private timeoutId2: any;
  private readonly inactivityTimeout = 5 * 60 * 60 * 1000;; 
  private readonly secondWarningTimeout = 6 * 60 * 60 * 1000; 

  private firstWarningShown = false;



  constructor(private _router: Router, private _authService: AuthService) {
    this.resetTimeout();
  }


  @HostListener('window:mousemove')
  @HostListener('window:keypress')
  resetTimeout() {
    this.firstWarningShown = false;
    clearTimeout(this.timeoutId);
    clearTimeout(this.timeoutId2);
    this.timeoutId = setTimeout(() => {
      if (localStorage.length > 0) {
        this.firstWarningShown = true;
        Swal.fire({
          title: "Sesión a punto de expirar",
          text: "La sesión está a punto de expirar. ¿Desea mantenerse en sesión?",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Mantener sesión',
          cancelButtonText: 'Cerrar sesión'
        }).then((result) => {
          if (result.isConfirmed) {
            // El usuario ha decidido mantener la sesión, reiniciamos el temporizador
            this.resetTimeout();

            this.firstWarningShown = false;
          } else if (result.isDismissed) {
            // El usuario ha decidido cerrar sesión
            localStorage.clear();
            // Aquí puedes redirigir al usuario a la página de inicio de sesión o realizar otras acciones necesarias
            this._router.navigate(['/login']);
          }
        });


        if (this.firstWarningShown) {
          this.timeoutId2 = setTimeout(() => {
            Swal.fire(
              "Sesión Expirada",
              'La sesión ha expirado.',
              'error'
            )
            localStorage.clear();
            this._router.navigate(['/login']);
          }, this.secondWarningTimeout);
        }

      }
    }, this.inactivityTimeout);
  }

  @HostListener('window:beforeunload')
  resetTimeoutOnPageReload() {
    this.resetTimeout();

  }

}


