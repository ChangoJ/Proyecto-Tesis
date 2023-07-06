import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Asignatura } from './../models/asignatura';
import { Component, Input, ViewChild } from '@angular/core';
import { AsignaturaService } from '../services/asignatura.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { DetalleService } from '../services/detalle.service';
import { HorarioService } from '../services/horario.service';
import { Horario } from '../models/horario';

@Component({
  selector: 'app-items-asignatura',
  templateUrl: './items-asignatura.component.html',
  styleUrls: ['./items-asignatura.component.css'],
  providers: [AsignaturaService, DetalleService, HorarioService]
})
export class ItemsAsignaturaComponent {

  public colorCuadro = document.querySelector(".color-square")
  public url: string
  public asignaturasFiltrados!: MatTableDataSource<any>;
  public terminoBusquedaAsignatura: string = '';
  public selectedCarrera!: any
  public selectedSemestre!: any
  public selectedHorario!: any
  public asignaturasObtenidos: any[] = [];
  public authToken: any;
  public userData: any;
  public carrerasFiltradas: any[] = [];
  public is_admin: boolean
  public is_aprobador!: boolean
  public carreras: any
  public semestres: any
  public rolesCarreras: any = []
  public horarios!: Horario[];
  @Input() asignaturas!: Asignatura[]
  public columnas = ['N°', 'Nombre', 'Carrera', 'Periodo', 'Profesor', 'Horario', 'Creditos', 'Color', 'Acciones'];
  

  constructor(private _asignaturaService: AsignaturaService,
    private _route: ActivatedRoute,
    private _router: Router,
    private _detalleService: DetalleService,
    private _horarioService: HorarioService) {
    this.url = this._detalleService.Global.url
    this.is_admin = false
    this.is_aprobador = false
    this.authToken = this._detalleService.authToken
    this.userData = this._detalleService.userData

  }

  @ViewChild('paginatorAs', { static: false }) paginator!: MatPaginator;



  ngOnInit() {
    if (this.userData.rol === "Administrador" || this.userData.rol === "Aprobador" || this.userData.rol === "Superadministrador" ) {
      this.is_admin = true
      this.is_aprobador = true
    }
    this.getDataDetalles()
    this.getHorarios()


  }

  getDataDetalles() {

    this._detalleService.getRolesCarrera().subscribe(roles => {
      this.rolesCarreras = roles

      this.getAsignaturas()

    });

    this._detalleService.getCarreras().subscribe(carreras => {
      this.carreras = carreras
    });


    this._detalleService.getSemestres().subscribe(semestres => {
      this.semestres = semestres
    });

  }

  getAsignaturas() {
    this.asignaturasObtenidos = []

    this._asignaturaService.getAsignaturas().subscribe(
      response => {
        if (response.asignaturas) {
          this.asignaturasObtenidos = response.asignaturas
          let carreraActual = this.rolesCarreras[this.userData.rol.toLowerCase().replace(/\s/g, "")];

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

  getHorarios() {
    this._horarioService.getHorarios().subscribe(
      response => {
        if (response.horarios) {
          this.horarios = response.horarios;

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
        let item: any = []
        let ubicacion: any = []
        let exist_aula: boolean = false

        this.horarios.forEach(horario => {
          item = horario.item
          item.forEach((item: any) => {
            if (item.asignatura._id === id) {
              exist_aula = true
              if (!horario.paralelo || horario.paralelo === "") {

                ubicacion = horario.tipoHorario + ": " + horario.carrera + ' - ' + horario.semestre
              } else {

                ubicacion = horario.tipoHorario + ": " + horario.carrera + ' - ' + horario.semestre + ' Paralelo (' + horario.paralelo! + ')'
              }
            }
          });
        });

        if (!exist_aula) {
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
          Swal.fire('Asignatura no borrada', 'Si deseas borrarla, primero borra el horario que la contiene: ' + ubicacion, 'error');
        }
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
        return asignatura.semestre.some((semestre: any) => semestre.toLowerCase() === this.selectedSemestre.toLowerCase()) || asignatura.ciclo.some((ciclo: any) => ciclo.toLowerCase() === this.selectedSemestre.toLowerCase());
      });
    }

    
    if (this.selectedHorario !== undefined) {
      asignaturasFiltrados = asignaturasFiltrados.filter(asignatura => {
        return asignatura.horario.toLowerCase() === this.selectedHorario.toLowerCase();
      });
    }

    if (this.selectedCarrera === "Todas" || this.selectedSemestre === "Todas" || this.selectedHorario === "Todas") {
      asignaturasFiltrados = this.carrerasFiltradas;
    }

    if (terminosBusqueda !== '') {
      let regexBusqueda = new RegExp(`\\b${terminosBusqueda}\\b`, 'gi');
      asignaturasFiltrados = asignaturasFiltrados.filter(asignaturas =>
        asignaturas.nombre.toString().toLowerCase().match(regexBusqueda) ||
        asignaturas.profesor[0].nombre.toString().toLowerCase().match(regexBusqueda) ||
        asignaturas.creditos.toString().toLowerCase().match(regexBusqueda) ||
        asignaturas.abreviatura.toString().toLowerCase().match(regexBusqueda) ||
        asignaturas.color.toString().toLowerCase().match(regexBusqueda)||
        asignaturas.horario.toString().toLowerCase().match(regexBusqueda)
      );

      if (asignaturasFiltrados.length === 0) {
        let terminosBusquedaSeparados = terminosBusqueda.split(' ');
        regexBusqueda = new RegExp(`(${terminosBusquedaSeparados.join('|')})`, 'gi');
        asignaturasFiltrados = asignaturasFiltrados.filter(asignaturas =>
          asignaturas.nombre.toString().toLowerCase().match(regexBusqueda) ||
          asignaturas.profesor[0].nombre.toString().toLowerCase().match(regexBusqueda) ||
          asignaturas.creditos.toString().toLowerCase().match(regexBusqueda) ||
          asignaturas.abreviatura.toString().toLowerCase().match(regexBusqueda) ||
          asignaturas.color.toString().toLowerCase().match(regexBusqueda)||
          asignaturas.horario.toString().toLowerCase().match(regexBusqueda)
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
