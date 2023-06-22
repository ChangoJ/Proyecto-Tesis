import { Component } from '@angular/core';
import { Detalle } from '../models/detalle';
import { ActivatedRoute, Router } from '@angular/router';
import { DetalleService } from '../services/detalle.service';


@Component({
  selector: 'app-detalles',
  templateUrl: './detalles.component.html',
  styleUrls: ['./detalles.component.css'],
  providers: [DetalleService]
})
export class DetallesComponent {
  public detalles!: Detalle[]
  public rutaActual!: String
  public mostrar!: boolean

  constructor(private _route: ActivatedRoute,
    private _detalleService: DetalleService,
    private _router: Router) {
     

  }

  ngOnInit(): void {
    this.rutaActual = this._router.url

     this._detalleService.getDetalles().subscribe(
        response => {
          if (response.detalles) {
            this.detalles = response.detalles;
          }
        },
        error => {
          console.log(error)
        }
      ) 
  }
}
