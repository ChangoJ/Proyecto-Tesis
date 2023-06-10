import { Component } from '@angular/core';
import { AsignaturaService } from '../services/asignatura.service';
import { AulaService } from '../services/aula.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Asignatura } from '../models/asignatura';
import { UsuarioService } from '../services/usuario.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers: [AsignaturaService, AulaService, UsuarioService]
})
export class HomeComponent {

  public asignaturas!: Asignatura[];
  public indiceHora!: string
  public listaA: any[] = []
  public is_horario: boolean
  public authToken!:any
  public nombreUsuario!:any
 userData:any


  constructor(private _usuarioService: UsuarioService,
    private _route: ActivatedRoute,
    private _asignaturaService: AsignaturaService,
  ) {
    this.is_horario = false
    this.authToken = localStorage.getItem('authToken');
    this.userData = localStorage.getItem('datosUsuario');
    
  }

  ngOnInit() {
    this.getAsignaturas()
    this.getUsuario()
  }

  getUsuario(): void {
    let tokenData = this._usuarioService.decodeToken(this.authToken);
    let userId = tokenData.userId;
    this._usuarioService.getUsuario(userId).subscribe(
      response => {
        if (response.usuario) {
          this.nombreUsuario = response.usuario.nombre
        }
      },
      error => {
        console.log("No existe")
      }
    )


  }

  getAsignaturas() {
    
    this._route.params.subscribe(params => {
      var opcion2 = params['opcion2'];
      if (opcion2 !== undefined) {
        var opcion2 = params['opcion2'];
        opcion2 = opcion2.replace('_', " ");
        opcion2 = opcion2.replace('_', " ");
      }
      if(opcion2){
        this._asignaturaService.searchOne(opcion2).subscribe(
          response => {
            if (response.asignaturas) {
              this.is_horario = true
            } else {
              this.is_horario = false
            }
          },
          error => {
            console.log(error)
          }
        )
      }
     
    })
  }
}
