import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Global } from './../services/global';
import { Asignatura } from './../models/asignatura';
import { Component, Input, ViewChild } from '@angular/core';
import { AsignaturaService } from '../services/asignatura.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-items-asignatura',
  templateUrl: './items-asignatura.component.html',
  styleUrls: ['./items-asignatura.component.css'],
  providers: [AsignaturaService]
})
export class ItemsAsignaturaComponent {

  public colorCuadro = document.querySelector(".color-square")
  public url: string
  public asignaturasFiltrados!: MatTableDataSource<any>;
  public terminoBusquedaAsignatura: string = '';

  public selectedCarrera!: any
  public selectedSemestre!: any

  @Input() asignaturas!: Asignatura[]
  columnas = ['N°', 'Nombre', 'Carrera', 'Semestre', 'Profesor', 'Horario', 'Creditos', 'Color', 'Acciones'];
  carreras = ["Enfermeria", "Fisioterapia", "Nutricion", "Psicologia", "Educacion Basica", "Produccion Audiovisual", "Contabilidad", "Derecho", "Economia", "Software", "Administracion de Empresas",
    "Gastronomia", "Turismo"];
  semestres = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10",];
  asignaturasObtenidos: any[] = [];
  authToken!: any;
  UserData!: any;
  carrerasFiltradas: any[] = [];
  public is_admin!: boolean
  public is_aprobador!: boolean

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

  constructor(private _asignaturaService: AsignaturaService,
    private _route: ActivatedRoute,
    private _router: Router) {
    this.url = Global.url

    this.is_admin = false
    this.is_aprobador = false
  }

  @ViewChild('paginatorAs', { static: false }) paginator!: MatPaginator;



  ngOnInit() {

    this.getAsignaturas()
    this.authToken = localStorage.getItem('datosUsuario');
    this.UserData = JSON.parse(this.authToken!)
    if (this.UserData.rol === "Administrador" || this.UserData.rol === "Aprobador") {
      this.is_admin = true
      this.is_aprobador = true
    }


  }

  getAsignaturas() {
    this._asignaturaService.getAsignaturas().subscribe(
      response => {
        if (response.asignaturas) {
          this.asignaturasObtenidos = response.asignaturas
          let carreraActual = this.rolesCarreras[this.UserData.rol.toLowerCase()];

          this.carrerasFiltradas = [];

          if (carreraActual) {
            this.carrerasFiltradas = this.asignaturasObtenidos.filter(elemento => elemento.carrera.includes(carreraActual));
          } else {
            this.carrerasFiltradas = this.asignaturasObtenidos;
          }
          
          this.asignaturasFiltrados = new MatTableDataSource<any>(this.carrerasFiltradas);
          this.asignaturasFiltrados.paginator = this.paginator;
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
      text: 'La asignatura se eliminará permanentemente',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Delete',
    }).then((result: any) => {
      if (result.isConfirmed) {
        this._asignaturaService.delete(id).subscribe(
          (response) => {
            setTimeout(() => {
              location.reload();
            }, 1200);
          },
          (error) => {
            console.log(error);
            this._router.navigate(['/especificacion/asignaturas']);
          }
        );

        Swal.fire('Asignatura borrada', 'La Asignatura ha sido borrado', 'success');
      } else {
        Swal.fire('Operación cancelada', 'La Asignatura no ha sido borrado', 'warning');
      }
    });


  }

  filtrarAsignaturas() {

    let terminosBusqueda = this.terminoBusquedaAsignatura.trim().toLowerCase();

    let asignaturasFiltrados = this.carrerasFiltradas;

    if (this.selectedCarrera !== undefined) {
      asignaturasFiltrados = asignaturasFiltrados.filter(asignatura => {
        return asignatura.carrera.some((carrera: any) => carrera.toLowerCase() === this.selectedCarrera.toLowerCase());
      });
    }

    if (this.selectedSemestre !== undefined) {
      asignaturasFiltrados = asignaturasFiltrados.filter(asignatura => {
        return asignatura.semestre.some((semestre: any) => semestre.toLowerCase() === this.selectedSemestre.toLowerCase());
      });
    }

    if (this.selectedCarrera === "Todas" || this.selectedSemestre === "Todas") {
      asignaturasFiltrados = this.carrerasFiltradas;
    }

    if (terminosBusqueda !== '') {
      let regexBusqueda = new RegExp(`\\b${terminosBusqueda}\\b`, 'gi');
      asignaturasFiltrados = asignaturasFiltrados.filter(asignaturas =>
        asignaturas.nombre.toString().toLowerCase().match(regexBusqueda) ||
        asignaturas.profesor[0].nombre.toString().toLowerCase().match(regexBusqueda) ||
        asignaturas.creditos.toString().toLowerCase().match(regexBusqueda) ||
        asignaturas.abreviatura.toString().toLowerCase().match(regexBusqueda) ||
        asignaturas.color.toString().toLowerCase().match(regexBusqueda)
      );

      if (asignaturasFiltrados.length === 0) {
        let terminosBusquedaSeparados = terminosBusqueda.split(' ');
        regexBusqueda = new RegExp(`(${terminosBusquedaSeparados.join('|')})`, 'gi');
        asignaturasFiltrados = this.carrerasFiltradas.filter(asignaturas =>
          asignaturas.nombre.toString().toLowerCase().match(regexBusqueda) ||
          asignaturas.profesor[0].nombre.toString().toLowerCase().match(regexBusqueda) ||
          asignaturas.creditos.toString().toLowerCase().match(regexBusqueda) ||
          asignaturas.abreviatura.toString().toLowerCase().match(regexBusqueda) ||
          asignaturas.color.toString().toLowerCase().match(regexBusqueda)
        );
      }
    }
    this.asignaturasFiltrados = new MatTableDataSource<any>(asignaturasFiltrados);
  }

  allAsignaturas() {
    this._router.navigate(['/especificacion/asignaturas'])
    location.reload();
  }

  redirectEdit(id: any) {
    this._router.navigate(['/especificacion/asignaturas/editarAsignatura/', id])

  }
}
