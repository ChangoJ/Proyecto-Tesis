import { AulaService } from './../services/aula.service';
import { Aula } from './../models/aula';
import { Router, ActivatedRoute } from '@angular/router';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-aulas',
  templateUrl: './aulas.component.html',
  styleUrls: ['./aulas.component.css'],
  providers: [AulaService]
})
export class AulasComponent {
  public aulas!: Aula[]
  public rutaActual!: String
  searchActual: any;
  public is_search!: boolean


  constructor(private _route: ActivatedRoute,
    private _aulaService: AulaService,
    private _router: Router) {

  }

  ngOnInit(): void {
    this.rutaActual = this._router.url

    if (this._router.url === "/especificacion/aulas") {
    this._aulaService.getAulas().subscribe(
      response => {
        if (response.aulas) {
          this.aulas = response.aulas;
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
      console.log(this.searchActual)
      this._aulaService.searchAula(search1).subscribe(
        response => {
          if (response.aulas) {
            this.aulas = response.aulas;
          } else {
            this.aulas = []
          }
        },
        error => {
          this.aulas = []
        }
    )
    

    })
  }

  }
}
