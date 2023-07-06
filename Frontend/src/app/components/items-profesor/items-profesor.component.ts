
import { Profesor } from './../models/profesor';
import { ProfesorService } from './../services/profesor.service';
import { Component, Input, ViewChild } from '@angular/core';
import Swal from 'sweetalert2';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { DetalleService } from '../services/detalle.service';
import { Router } from '@angular/router';
import { HorarioService } from '../services/horario.service';
import { Horario } from '../models/horario';

@Component({
  selector: 'app-items-profesor',
  templateUrl: './items-profesor.component.html',
  styleUrls: ['./items-profesor.component.css'],
  providers: [ProfesorService, DetalleService, HorarioService]
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
  public horarios!: Horario[];
  public columnas = ['N°', 'Nombre', 'Contrato', 'Carreras', 'Acciones'];
  public profesoresObtenidos: any[] = [];
  public selectedCarrera!: any
  public selectedContrato!: any
  public carreras!: any
  public contratos!: any
  @Input() profesores!: Profesor[]
  


  constructor(private _profesorService: ProfesorService,
    private _router: Router,
    private _detalleService: DetalleService,
    private _horarioService: HorarioService) {
    this.url = this._detalleService.Global.url
    this.is_admin = false
    this.is_aprobador = false
    this.authToken = this._detalleService.authToken
    this.userData = this._detalleService.userData
    this.contratos = this._detalleService.contratos

  }

  @ViewChild('paginatorP', { static: false }) paginator!: MatPaginator;

  ngOnInit() {

    this.getProfesores()
    this.getDataDetalles()
    this.getHorarios()
  }

  getDataDetalles() {

    this._detalleService.getRolesCarrera().subscribe(roles => {
      this.rolesCarreras = roles
    });

    this._detalleService.getCarreras().subscribe(carreras => {
      this.carreras = carreras
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
      text: 'El profesor se eliminará permanentemente',
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
            if (item.asignatura.profesor[0]._id === id) {
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
          Swal.fire('Profesor no borrada', 'Si deseas borrarla, primero borra el horario que la contiene: ' + ubicacion, 'error');
        }
      } else {
        Swal.fire('Operación cancelada', 'El profesor no ha sido borrado.', 'warning');
      }
    });


  }


  filtrarProfesores() {
    let terminosBusqueda = this.terminoBusquedaProfesor.trim().toLowerCase();
    let regexBusqueda = new RegExp(`\\b${terminosBusqueda}\\b`, 'gi');

    let profesoresFiltrados = this.carrerasFiltradas

    if (this.selectedContrato !== undefined) {
      profesoresFiltrados = profesoresFiltrados.filter(profesor => {
        return profesor.contrato.toLowerCase() === this.selectedContrato.toLowerCase();
      });
    }

    if (this.selectedCarrera !== undefined) {
      profesoresFiltrados = profesoresFiltrados.filter(profesor => {
        return profesor.carrera.some((carrera: any) => carrera.toLowerCase() === this.selectedCarrera.toLowerCase());
       });
    }

    if (this.selectedCarrera === "Todas" || this.selectedContrato === "Todas") {
      profesoresFiltrados = this.carrerasFiltradas
    }

    if (terminosBusqueda !== '') {
      profesoresFiltrados = profesoresFiltrados.filter(profesor =>
        profesor.nombre.toString().toLowerCase().match(regexBusqueda) ||
        profesor.carrera.toString().toLowerCase().match(regexBusqueda) ||
        profesor.contrato.toString().toLowerCase().match(regexBusqueda)
      );

      if (this.profesoresFiltrados.data.length === 0) {
        let terminosBusquedaSeparado = this.terminoBusquedaProfesor.split(' ');
        regexBusqueda = new RegExp(`(${terminosBusquedaSeparado.join('|')})`, 'gi');
        profesoresFiltrados = profesoresFiltrados.filter(profesor =>
          profesor.nombre.toString().toLowerCase().match(regexBusqueda) ||
          profesor.carrera.toString().toLowerCase().match(regexBusqueda) ||
          profesor.contrato.toString().toLowerCase().match(regexBusqueda)
        );
      }
    }
    this.profesoresFiltrados = new  MatTableDataSource<any>(profesoresFiltrados);
  }

  allProfesores() {
    this._router.navigate(['/especificacion/profesores'])
    location.reload();
  }

  resumenProfesores() {
    this._router.navigate(['/especificacion/profesores/resumen-profesores'])
    setTimeout(() => {
      location.reload();
    }, 400);
  }

  redirectEdit(id: any) {
    this._router.navigate(['/especificacion/profesores/editarProfesor/', id])

  }
}
