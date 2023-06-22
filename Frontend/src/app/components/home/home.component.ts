import { Component } from '@angular/core';
import { AsignaturaService } from '../services/asignatura.service';
import { AulaService } from '../services/aula.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Asignatura } from '../models/asignatura';
import { UsuarioService } from '../services/usuario.service';
import Swal from 'sweetalert2';

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
  public authToken!: any
  public nombreUsuario!: any
  public userData: any


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
    let periodoTipo: any
    this._route.params.subscribe(params => {
      let opcion2 = params['opcion2'];
      let opcion3 = params['opcion3'];


      if (params['opcion1'] === "Horario_Nocturno") {
        periodoTipo = "Ciclo"
      } else {

        periodoTipo = "semestre"
      }
      if (opcion2 !== undefined || opcion3 !== undefined) {
        let opcion2 = params['opcion2'];
        opcion2 = opcion2.replace(/_/g, " ");
        let opcion3 = params['opcion3'];
        opcion3 = opcion3.replace(/_/g, " ");

        if (opcion2 && opcion3) {
          this._asignaturaService.search(opcion2, opcion3).subscribe(
            response => {
              if (response.asignaturas) {
                this.is_horario = true
              } else {
                this.is_horario = false
              }

            },
            error => {
              Swal.fire(
                'Horario de la Carrera de ' + opcion2 + ' del ' + periodoTipo + ' ' + opcion3,
                error.error.message,
                'error'
              )
            }
          )
        }
      }

    })
  }
}
