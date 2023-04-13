import { Component } from '@angular/core';
import { AsignaturaService } from '../services/asignatura.service';
import { AulaService } from '../services/aula.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Asignatura } from '../models/asignatura';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers: [AsignaturaService, AulaService]
})
export class HomeComponent {

  public asignaturas!: Asignatura[];
  public indiceHora!: string
  public listaA: any[] = []
  public is_horario: boolean


  constructor(
    private _route: ActivatedRoute,
    private _asignaturaService: AsignaturaService,
  ) {
    this.is_horario = false
  }

  ngOnInit() {
    this.getAsignaturas()
  }

  getAsignaturas() {
    this._route.params.subscribe(params => {
      var opcion2 = params['opcion2'];
      if (opcion2 !== undefined) {
        var opcion2 = params['opcion2'];
        opcion2 = opcion2.replace('_', " ");
        opcion2 = opcion2.replace('_', " ");
      }
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
    })
  }
}
