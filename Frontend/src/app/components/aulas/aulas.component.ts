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
 

  }
}
