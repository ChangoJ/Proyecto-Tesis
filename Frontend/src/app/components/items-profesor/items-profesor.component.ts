import { Global } from './../services/global';
import { ActivatedRoute, Router } from '@angular/router';
import { Profesor } from './../models/profesor';
import { ProfesorService } from './../services/profesor.service';
import { Component, Input, ViewChild } from '@angular/core';
import Swal from 'sweetalert2';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-items-profesor',
  templateUrl: './items-profesor.component.html',
  styleUrls: ['./items-profesor.component.css'],
  providers: [ProfesorService]
})
export class ItemsProfesorComponent {
  public colorCuadro = document.querySelector(".color-square")
  public url: string
  public profesoresFiltrados!: MatTableDataSource<any>;
  public terminoBusquedaProfesor: string = '';
  public is_admin!: boolean
  public is_aprobador!: boolean
  authToken!: any;
  UserData!: any;
  carrerasFiltradas: any[] = [];

  @Input() profesores!: Profesor[]
  columnas = ['N°', 'Nombre', 'Contrato', 'Carreras', 'Acciones'];
  profesoresObtenidos: any[] = [];

  rolesCarreras: any = {
    enfermeria: 'Enfermeria',
    fisioterapia: 'Fisioterapia',
    nutricion: 'Nutricion',
    psicologia: 'Psicologia',
    educacionBasica: 'Educacion Basica',
    produccionAudiovisual: 'Produccion Audiovisual',
    contabilidad: 'Contabilidad',
    derecho: 'Derecho',
    economia: 'Economia',
    software: 'Software',
    administracionEmpresas: 'Administracion de Empresas',
    gastronomia: 'Gastronomia',
    turismo: 'Turismo'
  };

  constructor(private _profesorService: ProfesorService,
    private _route: ActivatedRoute,
    private _router: Router) {
    this.url = Global.url
    this.is_admin = false
    this.is_aprobador = false

  }

  @ViewChild('paginatorP', { static: false }) paginator!: MatPaginator;

  ngOnInit() {

    this.getProfesores()
    this.authToken = localStorage.getItem('datosUsuario');
    this.UserData = JSON.parse(this.authToken!)
  }

  getProfesores() {

    this._profesorService.getProfesores().subscribe(
      response => {
        if (response.profesores) {
          this.profesoresObtenidos = response.profesores
          let carreraActual = this.rolesCarreras[this.UserData.rol.toLowerCase()];

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
  }

  redirectEdit(id: any) {
    this._router.navigate(['/especificacion/profesores/editarProfesor/', id])

  }
}
