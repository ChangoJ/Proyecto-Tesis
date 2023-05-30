import { Component } from '@angular/core';
import { Usuario } from '../models/usuario';
import { ActivatedRoute, Router } from '@angular/router';
import { UsuarioService } from '../services/usuario.service';


@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css'],
  providers: [UsuarioService]
})
export class UsuariosComponent {
  public usuarios!: Usuario[]
  public rutaActual!: String
  public mostrar!: boolean

  constructor(private _route: ActivatedRoute,
    private _usuarioService: UsuarioService,
    private _router: Router) {
     

  }

  ngOnInit(): void {
    this.rutaActual = this._router.url

      this._usuarioService.getUsuarios().subscribe(
        response => {
          if (response.usuarios) {
            this.usuarios = response.usuarios;
          }
        },
        error => {
          console.log(error)
        }
      )
  }

}
