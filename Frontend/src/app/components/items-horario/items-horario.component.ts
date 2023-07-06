import { Component, ViewChild } from '@angular/core';
import { Horario } from '../models/horario';
import { ActivatedRoute, Router } from '@angular/router';
import { HorarioService } from '../services/horario.service';
import Swal from 'sweetalert2';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { HorarioObservacionDialogComponent } from '../horario-observacion-dialog/horario-observacion-dialog.component';
import { DetalleService } from '../services/detalle.service';
import { Usuario } from '../models/usuario';

@Component({
  selector: 'app-items-horario',
  templateUrl: './items-horario.component.html',
  styleUrls: ['./items-horario.component.css'],
  providers: [HorarioService, DetalleService]
})
export class ItemsHorarioComponent {
  public horarios!: Horario[];
  public indiceHora!: string
  public listaA: any[] = []
  public is_horario: boolean
  public horariosFiltrados!: MatTableDataSource<any>;
  public terminoBusquedaHorario: string = '';
  public ver: any;
  public horario!: Horario
  public is_admin!: boolean
  public is_aprobador!: boolean
  public is_revisador!: boolean
  public editingHorario: any = null;
  public authToken!: any;
  public userData!: any;
  public carrerasFiltradas: any[] = [];
  public rolesCarreras: any
  public carreras: any
  public horariosType: any
  public periodos: any[] = []
  public selectedCarrera!: any
  public selectedHorario!: any
  public selectedPeriodo!: any
  public columnas = ['N°', 'Carrera', 'Periodo', 'Tipo', 'Acciones', 'Estado(Aprobacion)', 'Estado(Revisado)', 'Observacion'];

  constructor(
    private _horarioService: HorarioService,
    private _router: Router,
    private dialog: MatDialog,
    private _detalleService: DetalleService
  ) {
    this.is_horario = false
    this.is_admin = false
    this.is_aprobador = false
    this.authToken = this._detalleService.authToken
    this.userData = this._detalleService.userData

    this.horariosType = this._detalleService.horariosType

  }

  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;

  ngOnInit() {
    this.getHorarios()
    this.ver = "Ver";
    this.userData = JSON.parse(this.authToken!)
    if (this.userData.rol === "Aprobador") {
      this.is_aprobador = true
    } else if (this.userData.rol === "Revisador") {
      this.is_revisador = true
    } else if (this.userData.rol === "Administrador" || this.userData.rol === "Superadministrador") {

      this.is_admin = true
    }

    this.getDataDetalles()
  }

  getDataDetalles() {

    this._detalleService.getRolesCarrera().subscribe(roles => {
      this.rolesCarreras = roles
    });

    this._detalleService.getCarreras().subscribe(carreras => {
      this.carreras = carreras
    });

    this._detalleService.getSemestres().subscribe(semestres => {
      this.periodos = semestres
    });

    /*   this._detalleService.getCiclos().subscribe(semestres => {
        this.periodos = semestres
      });
  
      this._detalleService.getPeriodosIngles().subscribe(semestres => {
        this.periodos = semestres
      }); */

  }


  filtrarHorarios() {

    let terminosBusqueda = this.terminoBusquedaHorario.trim().toLowerCase();

    let regexBusqueda = new RegExp(`\\b${terminosBusqueda}\\b`, 'gi');

    let horariosFiltrados = this.carrerasFiltradas;
    console.log(this.selectedHorario)

    if (this.selectedCarrera !== undefined) {
      horariosFiltrados = horariosFiltrados.filter(horario => {
        return horario.carrera.toLowerCase() === this.selectedCarrera.toLowerCase();
      });
    }

    if (this.selectedPeriodo !== undefined) {
      horariosFiltrados = horariosFiltrados.filter(horario => {
        return horario.semestre.toLowerCase() === this.selectedPeriodo.toLowerCase()  || horario.ciclo === this.selectedPeriodo.toLowerCase();
      });
    }


    if (this.selectedHorario !== undefined) {
      horariosFiltrados = horariosFiltrados.filter(horario => {
        return horario.tipoHorario.toLowerCase() === this.selectedHorario.toLowerCase();
      });
    }

    if (this.selectedCarrera === "Todas" || this.selectedPeriodo === "Todas" || this.selectedHorario === "Todas") {
      horariosFiltrados = this.carrerasFiltradas;
    }


    if (terminosBusqueda !== '') {

      horariosFiltrados = horariosFiltrados.filter(horario =>
        horario.carrera.toString().toLowerCase().match(regexBusqueda) ||
        horario.semestre.toString().toLowerCase().match(regexBusqueda) ||
        horario.tipoHorario.toString().toLowerCase().match(regexBusqueda) ||
        horario.estado.toString().toLowerCase().match(regexBusqueda)

      );

      if (horariosFiltrados.length === 0) {
        let terminosBusquedaSeparados = terminosBusqueda.split(' ')
        regexBusqueda = new RegExp(`(${terminosBusquedaSeparados.join('|')})`, 'gi');
        horariosFiltrados = horariosFiltrados.filter(horario =>
          horario.carrera.toString().toLowerCase().match(regexBusqueda) ||
          horario.semestre.toString().toLowerCase().match(regexBusqueda) ||
          horario.tipoHorario.toString().toLowerCase().match(regexBusqueda) ||
          horario.estado.toString().toLowerCase().match(regexBusqueda)

        );
      }
    }
    this.horariosFiltrados = new MatTableDataSource<any>(horariosFiltrados)
  }

  getHorarios() {
    this._horarioService.getHorarios().subscribe(
      response => {
        if (response.horarios) {
          this.is_horario = true
          this.horarios = response.horarios;
          let carreraActual = this.rolesCarreras[this.userData.rol.toLowerCase().replace(/\s/g, "")];

          this.carrerasFiltradas = [];

          if (carreraActual) {
            this.carrerasFiltradas = this.horarios.filter(carrera => carrera.carrera.toLowerCase() === carreraActual.toLowerCase());
          } else {
            this.carrerasFiltradas = this.horarios;
          }

          this.horariosFiltrados = new MatTableDataSource<any>(this.carrerasFiltradas)
          this.horariosFiltrados.paginator = this.paginator

        }
      },
      error => {
        console.log(error)
      }
    )


  }



  getHorario(id: any) {

    return new Promise<void>((resolve, reject) => {
      this._horarioService.getHorario(id).subscribe(
        response => {
          if (response.horario) {

            this.horario = response.horario
          }
          resolve(); // Resuelve la promesa una vez que se completa la llamada a la API
        },
        error => {
          console.log(error);
          reject(error); // Rechaza la promesa en caso de error
        }
      );
    });


  }

  delete(id: string) {

    Swal.fire({
      title: '¿Estás seguro?',
      text: 'El horario se eliminará permanentemente',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Delete',
    }).then((result: any) => {
      if (result.isConfirmed) {
        this._horarioService.delete(id).subscribe(
          (response) => {
            setTimeout(() => {
              location.reload();
            }, 1200);
          },
          (error) => {
            console.log(error);
            this._router.navigate(['/horarios']);
          }
        );

        Swal.fire('Horario borrado', 'El horario ha sido borrado', 'success');
      } else {
        Swal.fire('Operación cancelada', 'El horario no ha sido borrado', 'warning');
      }
    });


  }

  async cambiarEstado(horario: any, estado: string) {

    await this.getHorario(horario._id)
    this.horario.estado = estado
    let confirm: any = ""
    let color = ""
    if (estado === "Aprobado") {
      confirm = "success"
      color = '#008000'
    } else {
      confirm = "error"

      color = '#d33'
    }
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'El horario será ' + estado.toLowerCase() + '.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: color,
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Aceptar',
    }).then((result: any) => {
      if (result.isConfirmed) {
        this._horarioService.update(horario._id, this.horario).subscribe(
          response => {
            if (response.status == 'success') {
              this.horario = response.horario;

              Swal.fire(
                'Estado de horario ' + estado.toLowerCase(),
                'El estado del horario ha sido ' + estado.toLowerCase() + '.',
                confirm
              );

              setTimeout(() => {
                this._router.navigate(['/horarios']);
              }, 1400);
            } else {
              Swal.fire(
                'No se ha podido modificar el estado',
                'Por favor, complete los datos correctamente.',
                'error'
              );

              setTimeout(() => {
                location.reload();
              }, 1400);
            }
          },
          error => {
            console.log(error)
          }
        );
        Swal.fire('Estado de horario cambiado', 'El estado del horario ha sido ' + estado.toLowerCase() + '.', confirm);
        setTimeout(() => {
          location.reload();
        }, 1400);
      } else {
        Swal.fire('Operación cancelada', 'El estado del horario no ha sido cambiado.', 'warning');

      }
    });

  }

  startEditing(horario: any): void {
    this.editingHorario = horario;

  }

  async cambiarEstadoRevision(horario: any, estado: string, usuario: any) {

    await this.getHorario(horario._id)
    let confirm: any = ""
    let color = ""
    if (estado === "Aprobado") {

      this.horario.revisado_por = usuario._id
      confirm = "success"
      color = '#008000'
    } else {

      this.horario.revisado_por = null
      confirm = "error"

      color = '#d33'


    }
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'El horario será ' + estado.toLowerCase() + ' en su revisión' + '.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: color,
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Aceptar',
    }).then((result: any) => {
      if (result.isConfirmed) {


        console.log(this.horario)
        this._horarioService.update(horario._id, this.horario).subscribe(
          response => {
            if (response.status == 'success') {
              this.horario = response.horario;
              console.log(this.horario)

              Swal.fire(
                'Estado de revisón del horario ' + estado.toLowerCase() + '.',
                'El estado de revisión horario ha sido ' + estado.toLowerCase() + '.',
                confirm
              );

              setTimeout(() => {
                this._router.navigate(['/horarios']);
              }, 1400);
            } else {
              Swal.fire(
                'No se ha podido modificar el estado de revision.',
                'Existe un error.',
                'error'
              );

              setTimeout(() => {
                location.reload();
              }, 1400);
            }
          },
          error => {
            console.log(error)
          }
        );
        Swal.fire('Estado de revisón del horario cambiado.', 'El estado de revisión del horario ha sido ' + estado.toLowerCase() + '.', confirm);
        setTimeout(() => {
          location.reload();
        }, 1400);
      } else {
        Swal.fire('Operación cancelada', 'Estado de revisón del horario no ha sido cambiado.', 'warning');

      }
    });

  }

  openDialog(observacion: string) {
    const dialogRef = this.dialog.open(HorarioObservacionDialogComponent, {
      width: '500px',
      data: observacion
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        dialogRef.componentInstance.result = result;
      }
    });
  }

  async saveObservation(horario: any) {
    await this.getHorario(horario._id)
    this.horario.observacion = horario.observacion

    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Se modificará la observacion del profesor.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Aceptar',
    }).then((result: any) => {
      if (result.isConfirmed) {
        this._horarioService.update(horario._id, this.horario).subscribe(
          response => {
            if (response.status == 'success') {
              this.horario = response.profesor;

              Swal.fire(
                'Observacion modificado',
                'La observacion se ha modificado correctamente.',
                'success'
              );

              setTimeout(() => {
                this._router.navigate(['/especificacion/profesores']);
              }, 1200);
            } else {
              Swal.fire(
                'No se ha podido modificar la observacion',
                'Por favor, complete los datos correctamente.',
                'error'
              );

              setTimeout(() => {
                location.reload();
              }, 1200);
            }
          },
          error => {
            console.log(error)
          }
        );
        Swal.fire('Observacion modificada', 'La observacion ha sido modificada.', 'success');
        setTimeout(() => {
          location.reload();
        }, 1200);
      } else {
        Swal.fire('Operación cancelada', 'La observacion no ha sido modificada.', 'warning');

        setTimeout(() => {
          location.reload();
        }, 1200);
      }
    });

    this.editingHorario = null;
  }

  redirectEdit(id: any) {
    this._router.navigate(['/horarios/editarHorario', id])

  }




}
