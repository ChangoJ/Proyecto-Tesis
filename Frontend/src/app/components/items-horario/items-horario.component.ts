import { Component, ViewChild } from '@angular/core';
import { Horario } from '../models/horario';
import { ActivatedRoute, Router } from '@angular/router';
import { HorarioService } from '../services/horario.service';
import Swal from 'sweetalert2';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { HorarioObservacionDialogComponent } from '../horario-observacion-dialog/horario-observacion-dialog.component';

@Component({
  selector: 'app-items-horario',
  templateUrl: './items-horario.component.html',
  styleUrls: ['./items-horario.component.css'],
  providers: [HorarioService]
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
  public editingHorario: any = null;
  authToken!: any;
  UserData!: any;
  carrerasFiltradas: any[] = [];

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

  constructor(
    private _route: ActivatedRoute,
    private _horarioService: HorarioService,
    private _router: Router,
    private dialog: MatDialog
  ) {
    this.is_horario = false
    this.is_admin = false
    this.is_aprobador = false

  }

  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;

  ngOnInit() {
    this.getHorarios()
    this.ver = "Ver";
    this.authToken = localStorage.getItem('datosUsuario');
    this.UserData = JSON.parse(this.authToken!)
    if (this.UserData.rol === "Administrador" || this.UserData.rol === "Aprobador") {
      this.is_admin = true
      this.is_aprobador = true
    }


  }

  columnas = ['N°', 'Carrera', 'Periodo', 'Tipo', 'Acciones', 'Estado', 'Observacion'];

  filtrarHorarios() {
    let terminosBusqueda = this.terminoBusquedaHorario.split(' ').join('|');
    let regexBusqueda = new RegExp(terminosBusqueda, 'gi');
    this.horariosFiltrados = new MatTableDataSource<any>(this.carrerasFiltradas.filter(horario =>
      horario.carrera.toString().toLowerCase().match(regexBusqueda) ||
      horario.semestre.toString().toLowerCase().match(regexBusqueda) ||
      horario.tipoHorario.toString().toLowerCase().match(regexBusqueda)
    ));
  }

  getHorarios() {
    this._horarioService.getHorarios().subscribe(
      response => {
        if (response.horarios) {
          this.is_horario = true
          this.horarios = response.horarios;
          let carreraActual = this.rolesCarreras[this.UserData.rol.toLowerCase()];

          this.carrerasFiltradas = [];
      
          if (carreraActual) {
            this.carrerasFiltradas = this.horarios.filter(carrera => carrera.carrera.toLowerCase() === carreraActual.toLowerCase());
          } else {
            this.carrerasFiltradas = this.horarios;
          }
          console.log(this.horarios)
          
          console.log(this.carrerasFiltradas)
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
    console.log(horario._id)
    await this.getHorario(horario._id)
    this.horario.estado = estado
    console.log(this.horario)
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
              }, 1200);
            } else {
              Swal.fire(
                'No se ha podido modificar el estado',
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
        Swal.fire('Estado de horario cambiado', 'El estado del horario ha sido ' + estado.toLowerCase() + '.', confirm);
        setTimeout(() => {
          location.reload();
        }, 1300);
      } else {
        Swal.fire('Operación cancelada', 'El estado del horario no ha sido cambiado.', 'warning');

        setTimeout(() => {
          location.reload();
        }, 1200);
      }
    });

  }

  startEditing(horario: any): void {
    this.editingHorario = horario;

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
    console.log(horario)
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
