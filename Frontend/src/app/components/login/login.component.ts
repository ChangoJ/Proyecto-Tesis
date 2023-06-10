import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UsuarioService } from '../services/usuario.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [UsuarioService]
})
export class LoginComponent {
  public usernameValue: string;
  public passwordValue: string;
  public userData!: any
  constructor(
    private _route: ActivatedRoute,
    private _authService: AuthService,
    private _usuarioService: UsuarioService,
    private _router: Router) {

    this.usernameValue = ""
    this.passwordValue = ""
  }

  async login() {
    this._authService.login(this.usernameValue, this.passwordValue)
      .subscribe(
        async response => {
          if (response.token) {
            this._authService.setAuthToken(response.token);
            const tokenData = this._usuarioService.decodeToken(response.token);
            const userId = tokenData.userId;
            const userData = await this._usuarioService.getUsuario(userId).toPromise();
            this.userData = userData.usuario;
            console.log(this.userData )
            this._usuarioService.setUserData(this.userData);

            this._router.navigate(['home']);

          } else {
            let mensaje = response.message
            Swal.fire(
              mensaje,
              'Por favor, revise las credenciales',
              'error'
            )
          }
        },
        error => {
          console.error(error);
          // Mostrar un mensaje de error en el inicio de sesión
        }
      );
  }



}
