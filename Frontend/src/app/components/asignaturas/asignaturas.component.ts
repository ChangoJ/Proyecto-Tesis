
import { Asignatura } from './../models/asignatura';
import { AsignaturaService } from './../services/asignatura.service';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { Component } from '@angular/core';
import { DetalleService } from '../services/detalle.service';

@Component({
  selector: 'app-asignaturas',
  templateUrl: './asignaturas.component.html',
  styleUrls: ['./asignaturas.component.css'],
  providers: [AsignaturaService, DetalleService]
})
export class AsignaturasComponent {
  public asignaturas!: Asignatura[];
  public url: string
  public selected!: string
  public searchCarrera!: string
  public searchSemestre!: string
  public searchActual!: string
  public is_searchTodo!: boolean
  public is_searchCarrera!: boolean
  public is_searchSemestre!: boolean
  public opcionSeleccionada1: any;
  public opcionSeleccionada2: any;
  public asignaturanumber!: number

  constructor(private _asignaturaService: AsignaturaService,
    private _router: Router,
    private _route: ActivatedRoute,
    private _detalleService: DetalleService) {
    this.opcionSeleccionada1 = null;
    this.opcionSeleccionada2 = null;
    this.url = this._detalleService.Global.url
    this.is_searchSemestre = false
    this.is_searchCarrera = false
    this.is_searchTodo = false
  }

  seleccionarCarrera(event: any) {
    this.opcionSeleccionada1 = event.target.value;
  }

  seleccionarSemestre(event: any) {
    this.opcionSeleccionada2 = event.target.value;
  }

  searchTodo() {
    this._router.navigate(['/especificacion/asignaturas'], { relativeTo: this._route })
  }

  search() {
    if (this.opcionSeleccionada1 == null) {
      this._router.navigate(['/especificacion/asignaturas/search/', this.opcionSeleccionada2], { relativeTo: this._route })


    } else if (this.opcionSeleccionada2 == null) {
      this._router.navigate(['/especificacion/asignaturas/search/', this.opcionSeleccionada1], { relativeTo: this._route })

      this.is_searchCarrera = true
    } else {
      this._router.navigate(['/especificacion/asignaturas/search/', this.opcionSeleccionada1, this.opcionSeleccionada2], { relativeTo: this._route })
     
    }

  }



  ngOnInit() {

    if (this._router.url === "/especificacion/asignaturas") {
      this._asignaturaService.getAsignaturas().subscribe(
        response => {
          if (response.asignaturas) {
            this.asignaturas = response.asignaturas;
          } else {

          }
        },
        error => {
          console.log(error)
        }
      )
    } else {
      this._route.params.subscribe(params => {
        var search1 = params['search1'];
        var search2 = params['search2'];
        var search = params['search'];



        if (params['search'] !== undefined) {

          this.searchActual = search
          if (this.searchActual.length <= 2) {

            this.is_searchSemestre = true
            this.is_searchCarrera = false
          } else {
            this.is_searchSemestre = false
            this.is_searchCarrera = true
          }
          this._asignaturaService.searchOne(search).subscribe(
            response => {
              if (response.asignaturas) {
                this.asignaturas = response.asignaturas;
              } else {
                this.asignaturas = []
              }
            },
            error => {
              this.asignaturas = []
            }
          )

        } else {
          this.is_searchTodo = true
          this.searchCarrera = search1
          this.searchSemestre = search2
          this._asignaturaService.search(search1, search2).subscribe(
            response => {
              if (response.asignaturas) {
                this.asignaturas = response.asignaturas;
              } else {
                this.asignaturas = []
              }
            },
            error => {
              console.log(error);
              this.asignaturas = []
              /* this._router.navigate(['/home']) */
            }
          )
        }

      })
    }

  }

}
