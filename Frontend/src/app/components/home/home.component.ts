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
    private _asignaturaService: AsignaturaService
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
    let horario: any
    this._route.params.subscribe(params => {
      let opcion2 = params['opcion2'];
      let opcion3 = params['opcion3'];
      let opcion4 = params['opcion4'];
      let opcion5 = params['opcion5'];


      if (params['opcion1'] === "Horario_Nocturno") {
        periodoTipo = "ciclo"
        horario = "Nocturno"
      } else {

        periodoTipo = "semestre"
        horario = "Diurno"
      }
      if(opcion2 === "Inglés"){
        periodoTipo = "nivel"
      }

      if (opcion2 !== "undefined" && opcion3 !== "undefined") {
        let opcion2 = params['opcion2'];
        opcion2 = opcion2.replace(/_/g, " ");
        let opcion3 = params['opcion3'];
        opcion3 = opcion3.replace(/_/g, " ");
        console.log(opcion2)

        console.log(opcion3)

        if (opcion2 && opcion3 && !opcion4) {
          this._asignaturaService.search(opcion2, opcion3).subscribe(
            response => {
              console.log(response)
              if (response.asignaturas) {
                let asignaturas = []
                asignaturas = response.asignaturas
                console.log(asignaturas)
                asignaturas.forEach((asignatura: any) => {
                  if (asignatura.horario === horario && asignatura.paralelo!.length === 0 && asignatura.ciclo!.length === 0) {

                    this.is_horario = true
                  }
                });
                /* this.is_horario = true */
                if (!this.is_horario) {
                  Swal.fire(
                    'Horario de la Carrera de ' + opcion2 + ' del ' + periodoTipo + ' ' + opcion3,
                    'No hay asignaturas para mostrar',
                    'error'
                  )
                }
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
        } else if (opcion2 && opcion3 && opcion4 && !opcion5) {
          this._asignaturaService.searchThree(opcion2, opcion3, opcion4).subscribe(
            response => {
              
              if (response.asignaturas) {

                let asignaturas = []
                asignaturas = response.asignaturas
                asignaturas.forEach((asignatura: any) => {
                  if (horario === "Diurno") {

                    if (asignatura.horario === horario && asignatura.ciclo!.length === 0) {

                      this.is_horario = true
                    }
                  } else {
                    if (asignatura.horario === horario && asignatura.paralelo!.length === 0) {

                      this.is_horario = true
                    }
                  }
                });
                /* this.is_horario = true */
                if (!this.is_horario) {
                  Swal.fire(
                    'Horario ' + horario + ' de la Carrera de ' + opcion2 + ' del ' + periodoTipo + ' ' + opcion3 + ' del paralelo ' + opcion4,
                    'No hay asignaturas para mostrar',
                    'error'
                  )
                }
              } else {
                this.is_horario = false
              }

            },
            error => {
              
              Swal.fire(
                'Horario ' + horario + ' de la Carrera de ' + opcion2 + ' del ' + periodoTipo + ' ' + opcion3 + ' del paralelo ' + opcion4,
                error.error.message,
                'error'
              )
            }
          )
        } else {
          this._asignaturaService.searchFour(opcion2, opcion3, opcion4, opcion5).subscribe(
            response => {
              if (response.asignaturas) {

                let asignaturas = []
                asignaturas = response.asignaturas
                asignaturas.forEach((asignatura: any) => {
                  if (asignatura.horario === horario) {

                    this.is_horario = true
                  }
                });
                /* this.is_horario = true */
                if (!this.is_horario) {
                  Swal.fire(
                    'Horario ' + horario + ' de la Carrera de ' + opcion2 + ' del semestre ' + opcion3 + ' '+ periodoTipo + ' ' + opcion4 + ' paralelo ' + opcion5,
                    'No hay asignaturas para mostrar',
                    'error'
                  )
                }
              } else {
                this.is_horario = false
              }

            },
            error => {
              Swal.fire(
                'Horario ' + horario + ' de la Carrera de ' + opcion2 + ' del semestre ' + opcion3 + ' '+ periodoTipo + ' ' + opcion4 + ' paralelo ' + opcion5,
                'No hay asignaturas para mostrar',
                'error'
              )
            }
          )
        }
      } else {
        Swal.fire(
          "Error al mostrar",
          "Por favor, selecciona los datos.",
          'error'
        )
      }
    })
  }
}
