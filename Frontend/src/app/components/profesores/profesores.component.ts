import { ProfesorService } from './../services/profesor.service';
import { Profesor } from './../models/profesor';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-profesores',
  templateUrl: './profesores.component.html',
  styleUrls: ['./profesores.component.css'],
  providers: [ProfesorService]
})
export class ProfesoresComponent {
  public profesores!: Profesor[]
  public rutaActual!: String
  public mostrar!: boolean
  searchActual: any;
  public is_search!: boolean

  constructor(private _route: ActivatedRoute,
    private _profesorService: ProfesorService,
    private _router: Router) {
      this.is_search = false

  }

  ngOnInit(): void {
    this.rutaActual = this._router.url

    if (this._router.url === "/especificacion/profesores") {
      this._profesorService.getProfesores().subscribe(
        response => {
          if (response.profesores) {
            this.profesores = response.profesores;
          }
        },
        error => {
          console.log(error)
        }
      )
    } else {
      this._route.params.subscribe(params => {
        var search1 = params['search1'];

        this.searchActual = search1
        this.is_search = true
        this._profesorService.searchProfesora(search1).subscribe(
          response => {
            if (response.profesores) {
              this.profesores = response.profesores;
            } else {
              this.profesores = []
            }
          },
          error => {
            this.profesores = []
          }
      )
      

      })
      
    }
  }

      
    
}
