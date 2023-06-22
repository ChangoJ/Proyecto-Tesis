
import { Profesor } from './../models/profesor';
import { ProfesorService } from './../services/profesor.service';
import { Component, Input, ViewChild } from '@angular/core';
import Swal from 'sweetalert2';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { DetalleService } from '../services/detalle.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-items-profesor',
  templateUrl: './items-profesor.component.html',
  styleUrls: ['./items-profesor.component.css'],
  providers: [ProfesorService, DetalleService]
})
export class ItemsProfesorComponent {
  public colorCuadro = document.querySelector(".color-square")
  public url: string
  public profesoresFiltrados!: MatTableDataSource<any>;
  public terminoBusquedaProfesor: string = '';
  public is_admin!: boolean
  public is_aprobador!: boolean
  public authToken!: any;
  public userData!: any;
  public carrerasFiltradas: any[] = [];
  public rolesCarreras: any
  public columnas = ['N°', 'Nombre', 'Contrato', 'Carreras', 'Acciones'];
  public profesoresObtenidos: any[] = [];
  @Input() profesores!: Profesor[]

 

  constructor(private _profesorService: ProfesorService,
    private _router: Router,
    private _detalleService: DetalleService) {
    this.url = this._detalleService.Global.url
    this.is_admin = false
    this.is_aprobador = false
    this.authToken = this._detalleService.authToken
    this.userData = this._detalleService.userData

  }

  @ViewChild('paginatorP', { static: false }) paginator!: MatPaginator;

  ngOnInit() {

    this.getProfesores()
    this.getDataDetalles()
  }

  getDataDetalles(){

    this._detalleService.getRolesIndex().subscribe(roles => {
      this.rolesCarreras = roles
    });
  }

  getProfesores() {

    this._profesorService.getProfesores().subscribe(
      response => {
        if (response.profesores) {
          this.profesoresObtenidos = response.profesores
          let carreraActual = this.rolesCarreras[this.userData.rol.toLowerCase().replace(/\s/g, "")];

          this.carrerasFiltradas = [];

          if (carreraActual) {
            this.carrerasFiltradas = this.profesoresObtenidos.filter(elemento => elemento.carrera.includes(carreraActual));
          } else {
            this.carrerasFiltradas = this.profesoresObtenidos;
          }

          this.profesoresFiltrados = new MatTableDataSource<any>(this.carrerasFiltradas);
          this.profesoresFiltrados.paginator = this.paginator;
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
      text: 'El profesor se eliminará permanentemente',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Delete',
    }).then((result: any) => {
      if (result.isConfirmed) {
        this._profesorService.delete(id).subscribe(
          (response) => {
            setTimeout(() => {
              location.reload();
            }, 1200);
          },
          (error) => {
            console.log(error);
            this._router.navigate(['/especificacion/profesores']);
          }
        );

        Swal.fire('Profesor borrada', 'El profesor ha sido borrado.', 'success');
      } else {
        Swal.fire('Operación cancelada', 'El profesor no ha sido borrado.', 'warning');
      }
    });


  }


  filtrarProfesores() {
    let terminosBusqueda = this.terminoBusquedaProfesor.split(' ').join(' | ');
    console.log(terminosBusqueda)
    let regexBusqueda = new RegExp(terminosBusqueda, 'gi');
    this.profesoresFiltrados = new MatTableDataSource<any>(this.carrerasFiltradas.filter(profesor =>
      profesor.nombre.toString().toLowerCase().match(regexBusqueda) ||
      profesor.carrera.toString().toLowerCase().match(regexBusqueda) ||
      profesor.contrato.toString().toLowerCase().match(regexBusqueda)
    ));
  }

  allProfesores() {
    this._router.navigate(['/especificacion/profesores'])
    location.reload();
  }

  resumenProfesores() {
    this._router.navigate(['/especificacion/profesores/resumen-profesores'])
   /*  setTimeout(() => {
      location.reload();
    }, 400); */
  }

  redirectEdit(id: any) {
    this._router.navigate(['/especificacion/profesores/editarProfesor/', id])

  }
}
