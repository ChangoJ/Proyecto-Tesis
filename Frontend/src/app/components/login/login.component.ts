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
  public code: string;
  public userData!: any
  public contador: any
  showVerificationCodeForm: boolean;
  constructor(
    private _route: ActivatedRoute,
    private _authService: AuthService,
    private _usuarioService: UsuarioService,
    private _router: Router) {

    this.usernameValue = ""
    this.passwordValue = ""
    this.code = ""
    this.contador = 0
    this.showVerificationCodeForm = false
  }

async verifyCode(){
 this._authService.verifyCode(this.code).subscribe( async response =>{
  if (response.token) {
    this._authService.setAuthToken(response.token);
    const tokenData = this._usuarioService.decodeToken(response.token);
    const userId = tokenData.userId;
    const userData = await this._usuarioService.getUsuario(userId).toPromise();
    this.userData = userData.usuario;
    this._usuarioService.setUserData(this.userData);
    
    this._router.navigate(['home']);

  }else {
    let mensaje = response.message
    Swal.fire(
      mensaje,
      'Por favor, asegurese de ingresar bien el codigo de verificación.',
      'error'
    )
      this.contador++
  }
  if(this.contador === 3){
    Swal.fire(
      "Muchos Intentos Fallidos",
      'Por favor, asegurese de ingresar bien el codigo de verificación.',
      'error'
    )
    setTimeout(() => {
      this.showVerificationCodeForm = false;
    }, 400);
    setTimeout(() => {
    location.reload();
    }, 1200);
  }
 })
}

  async sendCode() {
    Swal.fire({
      title: "Cargando...",
      html: `
    <div style="display: flex; justify-content: center; align-items: center; overflow: hidden;">
      <div class="spinner"></div>
    </div>
  `,
      showConfirmButton: false,
      allowOutsideClick: false,
      allowEscapeKey: false,
      
    });
    this._authService.sendCode(this.usernameValue, this.passwordValue)
      .subscribe(
        async response => {
          console.log(response)
          if(response.status === "success"){
            Swal.fire(
              response.message,
              'Por favor, revise su correo en la bandeja principal o SPAM.',
              'success',
              
            )
            this.showVerificationCodeForm = true;
          }else{
            Swal.fire(
              response.message,
              'Por favor, ingrese correctamente los datos.',
              'error'
            )
          }
        },
        error => {
          console.error(error);
        }
      );
  }



}
