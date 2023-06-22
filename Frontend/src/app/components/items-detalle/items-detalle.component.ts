import { Component, Input, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Detalle } from '../models/detalle';
import { ActivatedRoute, Router } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import Swal from 'sweetalert2';
import { DetalleService } from '../services/detalle.service';

@Component({
  selector: 'app-items-detalle',
  templateUrl: './items-detalle.component.html',
  styleUrls: ['./items-detalle.component.css'],
  providers: [DetalleService]
})
export class ItemsDetalleComponent {
  public url: string
  public detallesFiltrados!: MatTableDataSource<any>;
  public terminoBusquedaUsuarios: string = '';

  @Input() detalles!: Detalle[]
  columnas = ['N°', 'Carreras', 'Semestres', 'Ciclos', 'HorasDiurnas','HorasNocturnas', 'Acciones' ];
  public detallesObtenidos: any[] = [];

  constructor(private _detalleService: DetalleService,
    private _route: ActivatedRoute,
    private _router: Router) {
    this.url = this._detalleService.Global.url

  }

  @ViewChild('paginatorD', { static: false }) paginator!: MatPaginator;

  ngOnInit() {
    this._detalleService.getDetalles().subscribe(
      response => {
        if (response.detalles) {
          this.detallesObtenidos = response.detalles
          this.detallesFiltrados = new MatTableDataSource<any>(this.detallesObtenidos);
          this.detallesFiltrados.paginator = this.paginator;
        }
      },
      error => {
        console.log(error)
      }
    )

  }

  delete(id: string) {

    Swal.fire({
      title: '¿Estás seguro?',
      text: 'El detalle se eliminará permanentemente',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Delete',
    }).then((result: any) => {
      if (result.isConfirmed) {
        this._detalleService.delete(id).subscribe(
          (response) => {
            setTimeout(() => {
              location.reload();
            }, 1200);
          },
          (error) => {
            console.log(error);
            this._router.navigate(['/especificacion/detalles']);
          }
        );

        Swal.fire('Detalle borrado', 'El detalle ha sido borrado', 'success');
      } else {
        Swal.fire('Operación cancelada', 'El detalle no ha sido borrado', 'warning');
      }
    });


  }


  filtrarDetalles() {
    let terminosBusqueda = this.terminoBusquedaUsuarios.split(' ').join(' | ');
    console.log(terminosBusqueda)
    let regexBusqueda = new RegExp(terminosBusqueda, 'gi');
    this.detallesFiltrados = new MatTableDataSource<any>(this.detallesObtenidos.filter(detalle =>
      detalle.roles.toString().toLowerCase().match(regexBusqueda) ||
      detalle.tiposHorario.toString().toLowerCase().match(regexBusqueda) ||
      detalle.ubicaciones.toString().toLowerCase().match(regexBusqueda) ||
      detalle.phoneNumber.toString().toLowerCase().match(regexBusqueda) ||
      detalle.carreras.toString().toLowerCase().match(regexBusqueda)
    ));
  }

  allDetalles() {
    this._router.navigate(['/especificacion/detalles'])
    location.reload();
  }


  redirectEdit(id: any) {
    this._router.navigate(['/especificacion/detalles/editarDetalle/', id])

  }
}
