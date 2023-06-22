import { ActivatedRoute, Router } from '@angular/router';
import { Component } from '@angular/core';

@Component({
  selector: 'app-especificacion',
  templateUrl: './especificacion.component.html',
  styleUrls: ['./especificacion.component.css']
})
export class EspecificacionComponent {
  public rutaActual!: String
  public focus!: boolean

  constructor(private _route: ActivatedRoute,
    private _router: Router) {
  }

  ngOnInit(): void {
    this.rutaActual = this._router.url
    if (this.rutaActual === ( "/especificacion")) {
      this._router.navigate(['asignaturas'], { relativeTo: this._route });
    }

  }


}
