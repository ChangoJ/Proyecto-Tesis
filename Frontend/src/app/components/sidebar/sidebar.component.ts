import { ActivatedRoute, Router } from '@angular/router';
import { Component } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  public rutaActual!: String
  public asignatura!: boolean
  public aula!: boolean
  public profesor!: boolean
  public searchString!: string;
  

  constructor(private _route: ActivatedRoute,
    private _router: Router) {
    this.asignatura = false;
    this.aula = false;
    this.profesor = false;

  }

  ngOnInit(): void {
    this.rutaActual = this._router.url

    if (this.rutaActual.includes("/asignatura")) {
      this.asignatura = true;
    } else if (this.rutaActual.includes("aulas")) {
      this.aula = true;
    } else if (this.rutaActual.includes("profesor")) {
      this.profesor = true;

    }

  }

  goSearchAulas(){
    this._router.navigate(['/especificacion/aulas/searchAula/', this.searchString])
  }

  goSearchProfesores(){
    this._router.navigate(['/especificacion/profesores/searchProfesor/', this.searchString])
  }
  goSearchAsignaturas(){
    this._router.navigate(['/especificacion/asignaturas/search/', this.searchString])
  }

  allProfesores(){
    this._router.navigate(['/especificacion/profesores'])
  }

  allAulas(){
    this._router.navigate(['/especificacion/aulas'])
  }

  allAsignaturas(){
    this._router.navigate(['/especificacion/asignaturas'])
  }

  

}
