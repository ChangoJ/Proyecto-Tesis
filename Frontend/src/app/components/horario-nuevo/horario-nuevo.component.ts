import * as ExcelJS from 'exceljs';
import { Component, Input } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Asignatura } from '../models/asignatura';
import { AsignaturaService } from '../services/asignatura.service';
import { AulaService } from '../services/aula.service';
import { Aula } from '../models/aula';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { Profesor } from '../models/profesor';
import { HorarioService } from '../services/horario.service';
import Swal from 'sweetalert2';
import { Horario } from '../models/horario';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as FileSaver from 'file-saver';
import { v4 as uuidv4 } from 'uuid';
import { DetalleService } from '../services/detalle.service';
import { UsuarioService } from '../services/usuario.service';


@Component({
  selector: 'app-horario-nuevo',
  templateUrl: './horario-nuevo.component.html',
  styleUrls: ['./horario-nuevo.component.css'],
  providers: [HorarioService, AsignaturaService, AulaService, UsuarioService, DetalleService]
})
export class HorarioNuevoComponent {

  @Input() asignaturas!: Asignatura[]
  public profesores: any[] = [];
  public aulas!: Aula[];
  public indiceHora!: string
  public listaA: any[] = []
  public is_Diurno!: Boolean
  public is_Paralelo!: Boolean
  public opcion1: string = "";
  public opcion2: string = "";
  public opcion3: string = "";
  public opcion4: string = "";
  public opcion5: string = "";
  public status!: string;
  public horario!: Horario
  public horarios: Horario[] = []
  public asignaturaHorario: Asignatura[] = []
  public aulaHorario: Aula[] = []
  public existHorarioCarrera: boolean;
  public isActiveBtn = false
  public isActiveBtnG = false
  public isActiveBtnV = true
  public verificarDiaPresencialVirtualBolean: boolean = false;
  public verificarAulaUbicacionBolean: boolean = false;
  public periodoTipo!: any
  public usuario!: any;
  public authToken: any;
  public userData: any;
  public monday: any[] = [];
  public tuesday: any[] = [];
  public wednesday: any[] = [];
  public thursday: any[] = [];
  public friday: any[] = [];
  public saturday: any[] = [];
  public hours!: any[]
  public hoursnight!: any[]
  public terminoBusquedaAsignatura: string = '';
  public terminoBusquedaAsignaturaStatic: string = '';
  public terminoBusquedaAsignaturaBoolean: boolean = false;
  public terminoBusquedaAula: string = '';
  public asignaturasFiltradas: any[] = [];
  public asignaturasFiltradasDrop: any[] = [];
  public asignaturasFiltradasDropReverse: any[] = [];
  public aulasFiltradas: any[] = [];
  public usuarios: any = [];
  public revisador: any = [];
  public aprobador: any = [];
  public arrastreAsignaturas: any[] = [];
  public horarioHoras: string = "";

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _asignaturaService: AsignaturaService,
    private _aulasService: AulaService,
    private _horarioService: HorarioService,
    private _detalleService: DetalleService,
    private _usuarioService: UsuarioService,
  ) {
    this.horario = new Horario('', '', '', '', '', [], [], [], [], this.usuario)
    this.existHorarioCarrera = false
    this.getHorarios()
    this.authToken = this._detalleService.authToken
    this.userData = this._detalleService.userData
  }


  ngOnInit() {
    this.getHorarios()
    this.getAulas()
    this.getUsuarios()
    this.getDataDetalles()

    this.getAsignaturas()
  }

  getDataDetalles() {

    this._route.params.subscribe(params => {
      this.opcion2 = params['opcion2'];

      this.opcion1 = params['opcion1'];
      console.log(this.opcion1)
    })
    if (this.opcion2 !== "Ingles") {
      if (this.opcion1 === "Horario_Diurno") {
        this.horarioHoras = "1D"
      } else {
        this.horarioHoras = "1N"
      }
      this._detalleService.getHorasDiurnas().subscribe(horasDiurnas => {
        this.hours = horasDiurnas
      });

      this._detalleService.getHorasNocturnas().subscribe(horasNocturnas => {
        this.hoursnight = horasNocturnas
      });

    } else {
      if (this.opcion1 === "Horario_Diurno") {
        this.horarioHoras = "2D"
      } else {
        this.horarioHoras = "2N"
      }
      this._detalleService.getHorasAlternativaDiurnas().subscribe(horasAlternativaDiurnas => {
        this.hours = horasAlternativaDiurnas
      });

      this._detalleService.getHorasAlternativaNocturnas().subscribe(horasAlternativaNocturnas => {
        this.hoursnight = horasAlternativaNocturnas
      });
    }

  }

  onOptionSelectedHorario(horario: any) {
    this.monday = [];
    this.tuesday = [];
    this.wednesday = [];
    this.thursday = [];
    this.friday = [];
    this.saturday = [];
    this.asignaturasFiltradas = []
    this.getAsignaturas()
    if (horario === "horasNocturnas") {
      this._detalleService.getHorasNocturnas().subscribe(horasNocturnas => {
        this.hoursnight = horasNocturnas
        this.horarioHoras = "1N"
      });
    } else if (horario === "horasAlternativaNocturnas") {
      this._detalleService.getHorasAlternativaNocturnas().subscribe(horasAlternativaNocturnas => {
        this.hoursnight = horasAlternativaNocturnas
        this.horarioHoras = "2N"
      });
    } else if (horario === "horasDiurnas") {
      this._detalleService.getHorasDiurnas().subscribe(horasDiurnas => {
        this.hours = horasDiurnas
        this.horarioHoras = "1D"
      });
    } else if (horario === "horasAlternativaDiurnas") {
      this._detalleService.getHorasAlternativaDiurnas().subscribe(horasAlternativaDiurnas => {
        this.hours = horasAlternativaDiurnas
        this.horarioHoras = "2D"
      });
    }

  }

  filtrarAsignaturas() {


    if (this.terminoBusquedaAsignaturaStatic !== "") {
      this.terminoBusquedaAsignaturaBoolean = true
    } else if (this.terminoBusquedaAsignaturaStatic === "") {
      this.terminoBusquedaAsignaturaBoolean = false
    }

    if (this.terminoBusquedaAsignatura === "") {
      this.terminoBusquedaAsignaturaBoolean = false
    }

    if (this.terminoBusquedaAsignaturaBoolean === false) {


      this.asignaturasFiltradas = this.asignaturas.filter(asignatura => asignatura.nombre.toLowerCase().includes(this.terminoBusquedaAsignatura.toLowerCase()));

      if (this.terminoBusquedaAsignatura === "") {
        this.terminoBusquedaAsignaturaStatic = ""
        for (let i = 0; i < this.asignaturasFiltradasDrop.length; i++) {
          let elemento2 = this.asignaturasFiltradasDrop[i];
          // Buscar el elemento2 en array1
          for (let j = 0; j < this.asignaturas.length; j++) {
            let elemento1 = this.asignaturas[j];

            // Comparar los elementos por su _id (puedes ajustar esto según tus necesidades)
            if (elemento1._id === elemento2._id) {
              // Eliminar el elemento coincidente de array1
              this.asignaturas.splice(j, 1);
              break; // Salir del bucle interno una vez que se haya eliminado el elemento
            }
          }

        }
        this.asignaturasFiltradasDrop = []
        if (this.asignaturasFiltradasDropReverse.length !== 0) {

          this.asignaturas.push(...this.asignaturasFiltradasDropReverse)
        }

        this.asignaturasFiltradas = this.asignaturas
        this.asignaturasFiltradasDropReverse = []
      }
    }

  }

  filtrarAulas() {
    this.aulasFiltradas = this.aulas.filter(aula => aula.nombre.toLowerCase().includes(this.terminoBusquedaAula.toLowerCase()));

  }

  getAulas() {
    this._route
    this._aulasService.getAulas().subscribe(
      response => {
        if (response.aulas) {
          this.aulas = response.aulas;
          this.aulasFiltradas = this.aulas
        }
      },
      error => {
        console.log(error)
      }
    )
  }


  getAsignaturas() {
    this._route.params.subscribe(params => {
      this.opcion2 = params['opcion2'];
      this.opcion1 = params['opcion1'];
      this.opcion3 = params['opcion3'];
      this.opcion4 = params['opcion4'];
      this.opcion5 = params['opcion5'];

      this.opcion2 = this.opcion2.replace(/_/g, " ");

      this.opcion1 = this.opcion1.replace(/_/g, " ");

      if (this.opcion5) {
        this.is_Paralelo = true
      } else {
        this.is_Paralelo = false
      }

      if (this.opcion1 === "Horario Diurno") {
        this.is_Diurno = true
      } else {
        this.is_Diurno = false
      }

      this._asignaturaService.search(this.opcion2, this.opcion3).subscribe(
        response => {
          if (response.asignaturas) {
            this.asignaturas = []; // Reiniciar el array de asignaturas

            // Iterar sobre las asignaturas obtenidas en la respuesta
            response.asignaturas.forEach((asignatura: { creditos: number; _id: string; nombre: string; carrera: String[]; semestre: String[]; profesor: Profesor[]; horario: string; abreviatura: string; color: string; paralelo: any[]; ciclo: any[]; }) => {
              let creditos = asignatura.creditos; // Obtener la cantidad de créditos de la asignatura

              // Clonar la asignatura por la cantidad de créditos y guardarlas en el array this.asignaturas
              for (let i = 0; i < creditos; i++) {
                let asignaturaClonada = new Asignatura(
                  asignatura._id,
                  asignatura.nombre,
                  asignatura.carrera,
                  asignatura.semestre,
                  asignatura.profesor,
                  asignatura.horario,
                  asignatura.creditos,
                  asignatura.abreviatura,
                  asignatura.color,
                  asignatura.paralelo,
                  asignatura.ciclo,
                );

                this.asignaturas.push(asignaturaClonada);

              }
            });

            let tipoHorarioAsig: any
            if (this.opcion1 === "Horario Diurno") {
              tipoHorarioAsig = 'Diurno'
            } else {
              tipoHorarioAsig = "Nocturno"
            }

            if (this.opcion5 === undefined || this.opcion5 === "") {
              this.opcion5 = ""
            }

            if (this.opcion4 === undefined || this.opcion4 === "") {
              this.opcion4 = ""
            }

            this.asignaturas = this.asignaturas.filter(asignatura => asignatura.horario === tipoHorarioAsig)


            if ((this.opcion5 === undefined || this.opcion5 === "") && (this.opcion4 === undefined || this.opcion4 === "")) {
              this.asignaturas = this.asignaturas.filter(asignatura => asignatura.horario === tipoHorarioAsig && asignatura.paralelo!.length === 0 && asignatura.ciclo!.length === 0)

            } else if ((tipoHorarioAsig === "Diurno") && (this.opcion4 !== undefined || this.opcion4 !== "") && (this.opcion5 === undefined || this.opcion5 === "")) {
              this.asignaturas = this.asignaturas.filter(asignatura => asignatura.horario === tipoHorarioAsig && asignatura.paralelo && asignatura.paralelo.includes(this.opcion4))

            } else if ((tipoHorarioAsig === "Nocturno") && (this.opcion4 !== undefined || this.opcion4 !== "") && (this.opcion5 === undefined || this.opcion5 === "")) {
              this.asignaturas = this.asignaturas.filter(asignatura => asignatura.horario === tipoHorarioAsig && asignatura.ciclo && asignatura.ciclo.includes(this.opcion4))

            } else if ((this.opcion4 !== undefined || this.opcion4 !== "") && (this.opcion5 !== undefined || this.opcion5 !== "")) {
              this.asignaturas = this.asignaturas.filter(asignatura => asignatura.horario === tipoHorarioAsig && asignatura.paralelo && asignatura.paralelo.includes(this.opcion5) && asignatura.ciclo && asignatura.ciclo.includes(this.opcion4))

            }

            this.asignaturasFiltradas = this.asignaturas;
          }
        },
        error => {
          console.log(error)
        }
      )
    })
  }

  getUsuarios() {
    this._usuarioService.getUsuarios().subscribe(
      response => {
        if (response.usuarios) {
          this.usuarios = response.usuarios
          for (let usuario of this.usuarios) {
            if (usuario.rol === "Aprobador") {
              this.aprobador = usuario
            } else if (usuario.rol === "Revisador") {
              this.revisador = usuario
            }
          }
        }
      },
      error => {
        console.log(error)
      }
    )
  }

  getDayData(day: number, hour: string): any[] {
    switch (day) {
      case 0:
        return this.monday.filter(item => item.hourStart === hour.split('-')[0] && item.hourEnd === hour.split('-')[1]).map(item => item.item);
      case 1:
        return this.tuesday.filter(item => item.hourStart === hour.split('-')[0] && item.hourEnd === hour.split('-')[1]).map(item => item.item);
      case 2:
        return this.wednesday.filter(item => item.hourStart === hour.split('-')[0] && item.hourEnd === hour.split('-')[1]).map(item => item.item);
      case 3:
        return this.thursday.filter(item => item.hourStart === hour.split('-')[0] && item.hourEnd === hour.split('-')[1]).map(item => item.item);
      case 4:
        return this.friday.filter(item => item.hourStart === hour.split('-')[0] && item.hourEnd === hour.split('-')[1]).map(item => item.item);
      case 5:
        return this.saturday.filter(item => item.hourStart === hour.split('-')[0] && item.hourEnd === hour.split('-')[1]).map(item => item.item);
      default:
        return [];
    }
  }


  drop(event: CdkDragDrop<any[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);

    } else {
      this.isActiveBtn = false
      let item: any = []
      let idParts: any = []
      let day: any = []
      let hourStart: any = []
      let hourEnd: any = []
      let dayName: any = []
      let identificador: any = []
      this.isActiveBtnG = false
      let daysOfWeek = ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado'];
      item = event.previousContainer.data[event.previousIndex];
      idParts = event.container.id.split('-');
      day = Number(idParts[0]);
      hourStart = idParts[1];
      hourEnd = idParts[2];
      dayName = daysOfWeek[day];
      identificador = Number(idParts[0]) + '' + '' + Number(idParts[3]);



      // listasignatura id
      let idPartsAsignatura: any[] = []
      let elementoType: any = []
      idPartsAsignatura = event.item.element.nativeElement.id.split('-');
      elementoType = (idPartsAsignatura[0]);


      if (item.ubicacion) {
        elementoType = "aula"
        identificador = identificador + 'aula'
      } else if (!item.ubicacion) {
        elementoType = "asignatura"
        identificador = identificador + 'asignatura'
      }

      // Verificar si ya hay un elemento en la celda
      let existingItem: any = null;
      switch (day) {
        case 0:
          existingItem = this.monday.find(item => (item.elementoType === elementoType) && (item.elementoType === item.elementoType) && item.hourStart === hourStart && item.hourEnd === hourEnd);
          break;
        case 1:
          existingItem = this.tuesday.find(item => item.elementoType === elementoType && item.hourStart === hourStart && item.hourEnd === hourEnd);
          break;
        case 2:
          existingItem = this.wednesday.find(item => item.elementoType === elementoType && item.hourStart === hourStart && item.hourEnd === hourEnd);
          break;
        case 3:
          existingItem = this.thursday.find(item => item.elementoType === elementoType && item.hourStart === hourStart && item.hourEnd === hourEnd);
          break;
        case 4:
          existingItem = this.friday.find(item => item.elementoType === elementoType && item.hourStart === hourStart && item.hourEnd === hourEnd);
          break;
        case 5:
          existingItem = this.saturday.find(item => item.elementoType === elementoType && item.hourStart === hourStart && item.hourEnd === hourEnd);
          break;
      }


      if (existingItem) {
        return
      }

      //logica de arrastre de listas y horario para mantener organizado
      if (!event.container.id.startsWith('0-')
        && !event.container.id.startsWith('1-')
        && !event.container.id.startsWith('2-')
        && !event.container.id.startsWith('3-')
        && !event.container.id.startsWith('4-')
        && !event.container.id.startsWith('5-')) {
        if (event.container.id.includes('IdListaAsignaturas') && event.previousContainer.id.includes('IdListaAulas')) {
          return;
        }

        if (event.container.id.includes('IdListaAulas') && event.previousContainer.id.includes('IdListaAsignaturas')) {
          return;
        }
      }

      // Permitir transferencia si ya se encuentra en la lista de horarios
      if (event.previousContainer.id.startsWith('0-')
        || event.previousContainer.id.startsWith('1-')
        || event.previousContainer.id.startsWith('2-')
        || event.previousContainer.id.startsWith('3-')
        || event.previousContainer.id.startsWith('4-')
        || event.previousContainer.id.startsWith('5-')) {

        // Permitir transferencia a lista de asignatura (cdk-drop-0)

        if (!(elementoType === "aula" && event.container.id.includes('IdListaAulas'))
          && !(elementoType === "asignatura" && event.container.id.includes('IdListaAsignaturas'))
          && !event.container.id.startsWith('0-')
          && !event.container.id.startsWith('1-')
          && !event.container.id.startsWith('2-')
          && !event.container.id.startsWith('3-')
          && !event.container.id.startsWith('4-')
          && !event.container.id.startsWith('5-')) {
          return; // Permitir transferencia
        }

      }


      //Eliminar origen del array
      let prevIdParts: any = []
      let prevDay: any = []
      let preIdentificador: any = []
      prevIdParts = event.previousContainer.id.split('-');
      prevDay = Number(prevIdParts[0]);
      preIdentificador = Number(prevIdParts[0]) + '' + '' + Number(prevIdParts[3]);
      if (item.ubicacion) {
        preIdentificador = preIdentificador + 'aula'
      } else if (!item.ubicacion) {
        preIdentificador = preIdentificador + 'asignatura'
      }
      switch (prevDay) {
        case 0:
          for (let i = 0; i < this.monday.length; i++) {
            if (this.monday[i].identificador === preIdentificador) {
              this.monday.splice(i, 1);
              break;
            }
          }
          break;
        case 1:
          for (let i = 0; i < this.tuesday.length; i++) {
            if (this.tuesday[i].identificador === preIdentificador) {
              this.tuesday.splice(i, 1);
              break;
            }
          }
          break;
        case 2:
          for (let i = 0; i < this.wednesday.length; i++) {
            if (this.wednesday[i].identificador === preIdentificador) {
              this.wednesday.splice(i, 1);
              break;
            }
          }
          break;
        case 3:
          for (let i = 0; i < this.thursday.length; i++) {
            if (this.thursday[i].identificador === preIdentificador) {
              this.thursday.splice(i, 1);
              break;
            }
          }
          break;
        case 4:
          for (let i = 0; i < this.friday.length; i++) {
            if (this.friday[i].identificador === preIdentificador) {
              this.friday.splice(i, 1);
              break;
            }
          }
          break;
        case 5:
          for (let i = 0; i < this.saturday.length; i++) {
            if (this.saturday[i].identificador === preIdentificador) {
              this.saturday.splice(i, 1);
              break;
            }
          }
          break;

      }
      let newItem: any = [];
      newItem = { identificador, elementoType, dayName, hourStart, hourEnd, item: { ...item } };

      if (item.ubicacion) {
        newItem.elementoType = "aula"
      } else if (!item.ubicacion) {
        newItem.elementoType = "asignatura"
      }

      switch (day) {
        case 0:
          this.monday.push(newItem);
          break;
        case 1:
          this.tuesday.push(newItem);
          break;
        case 2:
          this.wednesday.push(newItem);
          break;
        case 3:
          this.thursday.push(newItem);
          break;
        case 4:
          this.friday.push(newItem);
          break;
        case 5:
          this.saturday.push(newItem);
          break;
      }

      if (!item.profesor) {

      } else {

        transferArrayItem(
          event.previousContainer.data,
          event.container.data,
          event.previousIndex,
          event.currentIndex,
        )
      }


      this.verificarDiaPresencialVirtual()
      this.verificarAulaUbicacion()

      if (this.terminoBusquedaAsignatura !== "" && newItem.dayName !== undefined && !newItem.item.compartida) {
        this.asignaturasFiltradasDrop.push(newItem.item)
        this.terminoBusquedaAsignaturaStatic = this.terminoBusquedaAsignatura
        console.log(this.terminoBusquedaAsignaturaStatic)

      } else if (this.terminoBusquedaAsignatura !== "" && newItem.dayName === undefined && !newItem.item.compartida) {
        if (this.asignaturasFiltradasDrop.length === 0) {

          this.asignaturasFiltradasDropReverse.push(newItem.item)
        }
        // Verificar si hay una coincidencia en this.asignaturasFiltradasDrop y eliminarla
        for (let i = 0; i < this.asignaturasFiltradasDrop.length; i++) {
          let elemento = this.asignaturasFiltradasDrop[i];
          if (elemento._id === newItem.item._id) {
            this.asignaturasFiltradasDrop.splice(i, 1);

            break;
          }
        }

      }


    }


  }

  async getAulaId(id: any) {

    return new Promise<void>((resolve, reject) => {
      this._aulasService.getAula(id).subscribe(
        response => {
          if (response.aula) {
            this.aulaHorario.push(response.aula);
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

  async getAsignaturaId(id: any) {

    return new Promise<void>((resolve, reject) => {
      this._asignaturaService.getAsignatura(id).subscribe(
        response => {
          if (response.asignatura) {

            this.asignaturaHorario.push(response.asignatura);
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

  async getHorarios() {
    this._horarioService.getHorarios().subscribe(
      response => {
        if (response.horarios) {
          this.horarios = response.horarios;

          if (this.opcion4 === undefined) {
            this.opcion4 = ""
          }
          if (this.opcion5 === undefined) {
            this.opcion5 = ""
          }

          for (let horario of this.horarios) {
            if (horario.paralelo === undefined) {
              horario.paralelo = ""
            }
            if (horario.ciclo === undefined) {
              horario.ciclo = ""
            }

            if (this.opcion1 === "Horario Nocturno") {


              if (horario.carrera === this.opcion2 && horario.semestre === this.opcion3 && horario.tipoHorario === this.opcion1 && horario.ciclo === this.opcion4 && horario.paralelo === this.opcion5) {
                this.existHorarioCarrera = true

              }
            } else {
              if (horario.carrera === this.opcion2 && horario.semestre === this.opcion3 && horario.tipoHorario === this.opcion1 && horario.paralelo === this.opcion4) {
                this.existHorarioCarrera = true

              }
            }

          }

          if (this.opcion1 === "Horario Nocturno") {
            this.periodoTipo = "ciclo"
          } else {
            this.periodoTipo = "semestre"
          }



          if (this.opcion2 === "Ingles") {

            this.periodoTipo = "Nivel"
          }

          if (this.periodoTipo === "ciclo") {
            this.horarios = this.horarios.filter(horario => horario.tipoHorario === this.opcion1 && horario.ciclo === this.opcion4);
          } else {
            this.horarios = this.horarios.filter(horario => horario.tipoHorario === this.opcion1);

          }



          if (this.existHorarioCarrera) {
            Swal.fire({
              title: 'EL Horario de ' + this.opcion2 + ' del ' + this.opcion3 + ' ' + this.periodoTipo + ' ya existe.',
              text: 'Por favor, si desea modificar vaya a la sección de horarios',
              icon: 'error',
              showCancelButton: true,
              confirmButtonColor: '#4CAF50',
              cancelButtonColor: '#3085d6',
              confirmButtonText: 'Ir',
            }).then((result: any) => {
              if (result.isConfirmed) {
                this._router.navigate(['/horarios']);
              } else {
                this._router.navigate(['/home']);
              }
            })
          }

        }
      },
      error => {
        console.log(error)
      }
    )
  }


  async submit() {
    await this.getHorarios()
    this.aulaHorario = []
    this.asignaturaHorario = []
    this.horario.horarioHoras = ""
    this.horario = new Horario('', '', '', '', '', [], [], [], [], this.usuario, '', '', '', '')
    const arreglosHorario = [
      this.monday,
      this.tuesday,
      this.wednesday,
      this.thursday,
      this.friday,
      this.saturday
    ]

    let identificadoresAulas = []
    let identificadoresAsignaturas = []
    let datosIguales: boolean = false
    if (this.opcion1 == "Horario Diurno") {
      this.horario.tipoHorario = "Horario Diurno"
    } else {
      this.horario.tipoHorario = "Horario Nocturno"
    }
    this.horario.estado = "Pendiente (Creado)"

    this.horario.carrera = this.opcion2
    this.horario.semestre = this.opcion3
    this.horario.creado_por = this.userData
    this.horario.horarioHoras = this.horarioHoras
    if (this.opcion1 == "Horario Diurno") {

      this.horario.paralelo = this.opcion4
      this.horario.ciclo = ""
    } else {

      this.horario.paralelo = this.opcion5
      this.horario.ciclo = this.opcion4
    }


    let elementoComprobarTipo: any = []
    let elementoComprobarId: any = []
    let asig: number = 0
    let aula: number = 0
    for (const dias of arreglosHorario) {
      dias.sort(function (a, b) {
        // Convierte las horas de inicio y fin a objetos Date para poder compararlas
        const dateAStart = new Date('1970/01/01 ' + a.hourStart.trim());
        const dateBStart = new Date('1970/01/01 ' + b.hourStart.trim());
        const dateAEnd = new Date('1970/01/01 ' + a.hourEnd.trim());
        const dateBEnd = new Date('1970/01/01 ' + b.hourEnd.trim());

        // Compara las horas de inicio y fin y devuelve el resultado de la comparación
        if (dateAStart < dateBStart) {
          return -1;
        } else if (dateAStart > dateBStart) {
          return 1;
        } else if (dateAEnd < dateBEnd) {
          return -1;
        } else if (dateAEnd > dateBEnd) {
          return 1;
        } else {
          return 0;
        }
      });


      for (const objetoElementoType of dias) {
        elementoComprobarTipo.push(objetoElementoType.elementoType)
        elementoComprobarId.push(objetoElementoType.identificador)
      }


      for (const objeto of dias) {



        if (objeto.identificador.includes("aula")) {
          identificadoresAulas.push(objeto.identificador)
          await this.getAulaId(objeto.item._id)
        }

        if (objeto.identificador.includes("asignatura")) {
          this.horario.dia.push(objeto.dayName)
          this.horario.horas.push({ horaInicio: objeto.hourStart, horaFin: objeto.hourEnd });
          identificadoresAsignaturas.push(objeto.identificador)
          await this.getAsignaturaId(objeto.item._id)
        }
      }
    }

    for (const element of elementoComprobarTipo) {
      if (element === "asignatura") {
        asig++
      } else {
        aula++
      }
    }



    if (asig === aula) {
      datosIguales = true
    }

    let parejas = [];
    for (let i = 0; i < elementoComprobarId.length; i++) {
      let primeraTresLetras = elementoComprobarId[i].substring(0, 3);
      for (let j = i + 1; j < elementoComprobarId.length; j++) {
        if (elementoComprobarId[j].substring(0, 3) === primeraTresLetras) {
          parejas.push(j);
          break;
        }
      }
    }
    if (parejas.length !== elementoComprobarId.length / 2) {
      datosIguales = false
    }

    const items = [
      this.asignaturaHorario,
      this.aulaHorario
    ];

    let index = 0;

    for (let i = 0; i < items[0].length || i < items[1].length; i++) {
      if (items[0][index]) {
        let asignatura = items[0][index] as Asignatura;
        let aula = items[1][index] as Aula;
        this.horario.item.push({ asignatura: asignatura, aula: aula });
      }
      index = (index + 1) % items[0].length;
    }


    const itemsIdent = [
      identificadoresAsignaturas,
      identificadoresAulas
    ];
    let index2 = 0;

    for (let i = 0; i < itemsIdent[0].length || i < itemsIdent[1].length; i++) {
      if (itemsIdent[0][index2]) {
        let IdAsignatura = itemsIdent[0][index2];
        let IdAula = itemsIdent[1][index2];
        this.horario.idTabla.push({ idAsignatura: IdAsignatura, idAula: IdAula });
      }
      index2 = (index2 + 1) % itemsIdent[0].length;
    }


    Swal.fire({
      title: '¿Estás seguro?',
      text: 'El horarios se creará',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#4CAF50',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Crear',
    }).then((result: any) => {
      if (result.isConfirmed) {
        if (datosIguales && !this.existHorarioCarrera) {
          this._horarioService.create(this.horario).subscribe(
            response => {

              if (response.status == 'success') {
                this.status = 'success'
                this.horario = response.horario

                Swal.fire(
                  'Horario creada',
                  'El horario se ha creado correctamente',
                  'success'
                )
                this.isActiveBtn = false
                this.isActiveBtnG = true
                this.isActiveBtnV = false
                /*  setTimeout(() => {
                   this._router.navigate(['/horarios']);
                 }, 1000); */

              }
            },
            error => {
              this.status = 'error: ' + error
              Swal.fire(
                'Error',
                'El horario no se ha creado correctamente' + this.status,
                'error'
              )
            }
          )
        } else if (!datosIguales) {
          Swal.fire(
            'Horario no creado',
            'Por favor, debe contener en cada celda una asignatura y una aula',
            'error'
          )
          this.status = 'error'
        } else if (this.existHorarioCarrera) {
          Swal.fire(
            'EL Horario de ' + this.opcion2 + ' del ' + this.opcion3 + ' semestre ya existe',
            'Por favor, si desea modificar vaya a la sección de horarios',
            'error'
          )
          this.status = 'error'
        } else {
          Swal.fire(
            'Horario no creada',
            'Por favor, rellene las asignaturas y aulas correctamente',
            'error'
          )
          this.status = 'error'
        }
      } else {
        Swal.fire('Operación cancelada', 'El horario no ha sido creado', 'warning');
      }
    });
  }


  exportarPDF() {
    // Crear una instancia de jsPDF
    let doc = new jsPDF('landscape', 'mm', 'a4');

    let pageWidth = doc.internal.pageSize.width;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');

    let titleText = "UNIVERSIDAD IBEROAMERICANA DEL ECUADOR";
    let titleWidth = doc.getTextWidth(titleText);

    let titleX = (pageWidth - titleWidth) / 2;

    doc.text(titleText, titleX, 10);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');

    let descriptionText = "MATRIZ HORARIO DEL NIVEL POR CARRERA";
    let descriptionWidth = doc.getTextWidth(descriptionText);

    let descriptionX = (pageWidth - descriptionWidth) / 2;

    doc.text(descriptionText, descriptionX, 15);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');

    let carreraText = "Carrera: " + this.opcion2 + ' - ' + this.opcion1;
    let carreraInfoWidth = doc.getTextWidth(carreraText);

    let carreraInfoX = (pageWidth - carreraInfoWidth) / 2;

    doc.text(carreraText, carreraInfoX, 20);

    let periodoTipo: any = ""
    if (this.opcion1 === "Horario Diurno") {

      periodoTipo = "Semestre"
    } else {
      periodoTipo = "Ciclo"
    }


    if (this.opcion2.toLowerCase() === "Ingles") {

      periodoTipo = "Nivel"
    }

    console.log(periodoTipo)
    let semestreText = periodoTipo + ": " + this.opcion3;
    let semestreInfoWidth = doc.getTextWidth(semestreText);

    let semestreInfoX = (pageWidth - semestreInfoWidth) / 2;

    doc.text(semestreText, semestreInfoX, 25);



    let days
    let DataAdicional: any = [];
    let asignaturasProfesores: any[] = [];
    let rowData: any = [];
    let hoursPDF = this.hours
    this.hours = []
    let cellSize

    let rowDataHead: any = [];
    let rowDataHead2: any = [];
    rowDataHead2.push(['Asignaturas', 'Profesores', 'N° Horas', 'Modalidad'])


    if (this.opcion1 === "Horario Nocturno") {
      cellSize = 38

      this.hours = this.hoursnight
      days = ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado'];

      rowDataHead.push(['Horas', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sabado']);
    } else {
      cellSize = 45
      this.hours = hoursPDF
      rowDataHead.push(['Horas', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes']);
      days = ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes'];
    }

    rowDataHead = rowDataHead.map((row: any) => {
      return row.map((item: any) => {
        return {
          content: item,
          styles: { halign: 'center', fillColor: '#00AFF0' } // Color gris (código hexadecimal)
        };
      });
    });

    rowDataHead2 = rowDataHead2.map((row: any) => {
      return row.map((item: any) => {
        return {
          content: item,
          styles: { halign: 'center', fillColor: '#00AFF0' } // Color gris (código hexadecimal)
        };
      });
    });

    let agrupaciones: any = [];
    let row = []
    // Agregar las horas y los datos de cada celda
    for (let i = 0; i < this.hours.length; i++) {
      row = [this.hours[i]];

      // Iterar sobre los arreglos correspondientes a cada día de la semana
      for (let j = 0; j < days.length; j++) {

        let dayArray = [
          this.monday,
          this.tuesday,
          this.wednesday,
          this.thursday,
          this.friday,
          this.saturday
        ]
        // Buscar el item correspondiente a esta celda
        for (let k = 0; k < dayArray.length; k++) {
          let currentItem = dayArray[k];


          currentItem.sort((a, b) => a.identificador.localeCompare(b.identificador));

          for (let l = 0; l < currentItem.length; l++) {

            let currentElement = currentItem[l];

            if (currentElement.elementoType === 'asignatura') {
              let currentAsignatura = currentElement.item.nombre;
              let currentProfesores = currentElement.item.profesor[0].nombre;
              let currentAsignaturaCreditos = currentElement.item.creditos; // Unir los nombres de los profesores separados por comas
              if (!asignaturasProfesores.some(ap => ap.asignatura === currentAsignatura && ap.profesores === currentProfesores)) {
                asignaturasProfesores.push({ asignatura: currentAsignatura, profesores: currentProfesores, horas: currentAsignaturaCreditos });

              }


            }
            // Obtener la hora del elemento actual
            let elementHourStart = currentElement.hourStart;
            let elementHourEnd = currentElement.hourEnd;

            // Comprobar si las horas son iguales
            let rowIndex = i + 1; // Sumar 1 para evitar reemplazar la primera fila (encabezado)
            let colIndex = j + 1; // Sumar 1 para evitar reemplazar la primera columna (horario)

            // Insertar el valor en la celda correspondiente

            if (i === this.hours.indexOf(elementHourStart + '-' + elementHourEnd) && j === (days.indexOf(currentElement.dayName))) {

              if (typeof row[colIndex] === 'undefined') {
                row[colIndex] = '';
              }
              if (currentElement.elementoType === 'aula') {

                agrupaciones.push(currentElement)
                row[colIndex] += ' ' + (currentElement.item.nombre + ' - ' + currentElement.item.ubicacion).replace(/(.+)/, '($1)').trim();
              } else {

                agrupaciones.push(currentElement)
                row[colIndex] += currentElement.item.nombre.trim();
              }



            }

          }

        }
      }


      rowData.push(row);
    }
    // Crear un objeto para almacenar los resultados agrupados
    let resultadoAgrupado: any = [];

    // Recorrer el array original y agrupar las asignaturas y aulas

    let asignaturaId: string | number;

    agrupaciones.forEach((item: { elementoType: string; item: { _id: any; }; carrera: any; dayName: any; hourEnd: any; hourStart: any; identificador: any; semestre: any; }) => {
      if (item.elementoType === "asignatura") {
        asignaturaId = item.item._id;
        if (!resultadoAgrupado[asignaturaId]) {
          resultadoAgrupado[asignaturaId] = {
            carrera: item.carrera,
            dayName: item.dayName,
            elementoType: item.elementoType,
            hourEnd: item.hourEnd,
            hourStart: item.hourStart,
            identificador: item.identificador,
            item: item.item,
            semestre: item.semestre,
            aulas: []
          };
        }
      } else if (item.elementoType === "aula") {

        if (resultadoAgrupado[asignaturaId]) {

          resultadoAgrupado[asignaturaId].aulas.push(item);
          resultadoAgrupado[asignaturaId].dayName = item.dayName
        }
      }
    });


    // Convertir el objeto resultadoAgrupado en un array de resultados
    let resultadoFinal = Object.values(resultadoAgrupado);

    resultadoFinal.forEach((resultado: any) => {
      let todasSonZoom = true;
      let algunaEsZoom = false;

      resultado.aulas.forEach((aula: { item: { nombre: string; }; }) => {
        if (aula.item.nombre.toLowerCase() !== "zoom") {
          todasSonZoom = false;
        } else {
          algunaEsZoom = true;
        }
      });

      if (todasSonZoom) {
        resultado.modalidad = "Virtual";
      } else if (!algunaEsZoom) {
        resultado.modalidad = "Presencial";
      } else {
        resultado.modalidad = "Mixto (Virtual y Presencial)";
      }
    });

    asignaturasProfesores.forEach((elemento1) => {
      elemento1.modalidad = [];

      resultadoFinal.forEach((resultado: any) => {
        if (resultado && resultado.modalidad && elemento1.asignatura === resultado.item.nombre) {
          elemento1.modalidad.push(resultado.modalidad);
        }
      });
    });

    asignaturasProfesores.forEach(ap => {
      DataAdicional.push([ap.asignatura, ap.profesores, ap.horas, ap.modalidad]);
    });

    rowData = rowData.map((row: any) => {
      return row.map((item: any) => {
        return {
          content: item,
          styles: { halign: 'center' } // Color gris (código hexadecimal)
        };
      });
    });

    DataAdicional = DataAdicional.map((row: any) => {
      return row.map((item: any) => {
        return {
          content: item,
          styles: { halign: 'center' } // Color gris (código hexadecimal)
        };
      });
    });

    // Agregar la tabla al PDF
    autoTable(doc, {
      head: rowDataHead,
      body: rowData,
      theme: 'grid',
      styles: {
        cellWidth: cellSize,
        minCellHeight: 5,
        fontSize: 8,
        textColor: [0, 0, 0]

      },
      margin: { top: 30 }
    });



    autoTable(doc, {
      head: rowDataHead2,
      body: DataAdicional,
      theme: 'grid',
      styles: {
        cellWidth: 60,
        fontSize: 8,
        textColor: [0, 0, 0]
      },
      margin: { top: 50, left: 30 },

    });

    let rowDataHead3: any = [];

    let DataFirmas: any = [];


    doc.addPage();
    if (this.horario.revisado_por) {
      rowDataHead3.push(['Elaborado por:', 'Revisado por:', 'Aprobado por:'])
      DataFirmas.push(["", "", ""]);
      DataFirmas.push([this.horario.creado_por.nombre, this.horario.revisado_por!.nombre, this.aprobador.nombre]);
      DataFirmas.push(["Director de Carrera", "Decano de Facultad", "Directora Académica "]);
    } else {

      rowDataHead3.push(['Elaborado por:', 'Revisado por:', 'Aprobado por:'])
      DataFirmas.push(["", "", ""]);
      DataFirmas.push([this.horario.creado_por.nombre, "", this.aprobador.nombre]);
      DataFirmas.push(["Director de Carrera", "Decano de Facultad", "Directora Académica "]);
    }
    autoTable(doc, {
      head: rowDataHead3,
      body: DataFirmas,
      theme: 'grid',
      styles: {
        cellWidth: 60,
        minCellHeight: 10,
        fontSize: 8,
        textColor: [0, 0, 0]
      },
      margin: { left: 55 },

    });


    // Descargar el PDF
    doc.save(this.opcion1 + '-' + this.opcion2 + '-' + this.opcion3 + '.pdf');
  }

  exportarExcel() {
    // Crear una instancia de ExcelJS Workbook
    let workbook = new ExcelJS.Workbook();
    let worksheet = workbook.addWorksheet(this.opcion2 + '-' + this.opcion3);

    // Establecer la orientación horizontal y el tamaño del papel
    worksheet.pageSetup.orientation = 'landscape';
    worksheet.pageSetup.paperSize = 9;
    worksheet.pageSetup.fitToPage = true;

    // Obtener el objeto Column para cada columna y establecer su ancho
    let cellSize
    let cellSizeBorder
    let days
    let indiceCell
    let indiceCellBorder
    let indiceCellList
    if (this.opcion1 === "Horario Nocturno") {
      days = ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado'];
      indiceCell = 7
      indiceCellBorder = 16
      indiceCellList = 18
      cellSize = 19
      cellSizeBorder = 6
    } else {
      indiceCell = 6
      indiceCellBorder = 14
      indiceCellList = 16
      days = ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes'];
      cellSize = 23
      cellSizeBorder = 5
    }

    worksheet.getColumn('A').width = cellSize;
    worksheet.getColumn('B').width = cellSize;
    worksheet.getColumn('C').width = cellSize;
    worksheet.getColumn('D').width = cellSize;
    worksheet.getColumn('E').width = cellSize;
    worksheet.getColumn('F').width = cellSize;
    worksheet.getColumn('G').width = cellSize;

    for (let row = 1; row <= cellSizeBorder; row++) {
      for (let col = 1; col <= cellSizeBorder + 1; col++) {
        let cell = worksheet.getCell(`${String.fromCharCode(64 + col)}${row}`);
        cell.border = {
          top: { style: 'medium', color: { argb: 'FFC0C0C0' } },
          left: { style: 'medium', color: { argb: 'FFC0C0C0' } },
          bottom: { style: 'medium', color: { argb: 'FFC0C0C0' } },
          right: { style: 'medium', color: { argb: 'FFC0C0C0' } }
        };

      }
    }

    worksheet.mergeCells('B1:E1'); // Fusionar 4 celdas en la primera fila
    let texto1 = worksheet.getCell(1, 2); // Seleccionar la celda B1
    texto1.value = 'Universidad Iberoamericana del Ecuador'; // Establecer el valor de la celda
    texto1.font = { size: 10, bold: true }; // Establecer el formato de la fuente
    texto1.alignment = { horizontal: 'center' };

    worksheet.mergeCells('B2:E2'); // Fusionar 4 celdas en la primera fila
    let texto2 = worksheet.getCell(2, 2); // Seleccionar la celda B2
    texto2.value = 'MATRIZ HORARIO DEL NIVEL POR CARRERA'; // Establecer el valor de la celda
    texto2.font = { size: 10, bold: true }; // Establecer el formato de la fuente
    texto2.alignment = { horizontal: 'center' };

    // Agregar el título al Excel
    worksheet.mergeCells('A3:F3'); // Fusionar 5 celdas en la primera fila
    let carreraText = worksheet.getCell(3, 1);
    carreraText.value = "Carrera: " + this.opcion2 + ' - ' + this.opcion1;
    carreraText.font = { size: 10, bold: true }; // Establecer el formato de la fuente
    carreraText.alignment = { horizontal: 'center' };
    let periodoTipo: any = ""
    if (this.opcion1 === "Horario Nocturno") {
      periodoTipo = "Ciclo"
    } else {
      periodoTipo = "Semestre"
    }

    if (this.opcion2.toLowerCase() === "Ingles") {

      periodoTipo = "Nivel"
    }

    // Agregar el título al Excel
    worksheet.mergeCells('A4:F4'); // Fusionar 5 celdas en la primera fila
    let semestreText = worksheet.getCell(4, 1);
    semestreText.value = periodoTipo + ": " + this.opcion3;
    semestreText.font = { size: 10, bold: true }; // Establecer el formato de la fuente
    semestreText.alignment = { horizontal: 'center' };

    let asignaturasProfesores: any[] = [];

    // Pintar encabezado y agregar encabezado de horario
    worksheet.spliceRows(indiceCell, 0, ['Horas', ...days]);
    worksheet.getRow(indiceCell).eachCell({ includeEmpty: true }, function (cell, colNumber) {
      cell.font = {
        bold: true
      }
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '00aae4 ' } // aquí se define el color celeste
      };
    });

    // Agregar las horas y los datos de cada celda
    let hoursPDF = this.hours
    this.hours = []
    if (this.opcion1 === "Horario Nocturno") {
      this.hours = this.hoursnight
    } else {
      this.hours = hoursPDF
    }

    let agrupaciones: any = [];
    let row = []
    for (let i = 0; i < this.hours.length; i++) {
      row = [this.hours[i]];

      // Iterar sobre los arreglos correspondientes a cada día de la semana
      for (let j = 0; j < days.length; j++) {

        let dayArray = [
          this.monday,
          this.tuesday,
          this.wednesday,
          this.thursday,
          this.friday,
          this.saturday
        ];

        // Buscar el item correspondiente a esta celda
        for (let k = 0; k < dayArray.length; k++) {
          let currentItem = dayArray[k];

          currentItem.sort((a, b) => a.identificador.localeCompare(b.identificador));

          for (let l = 0; l < currentItem.length; l++) {

            let currentElement = currentItem[l];

            if (currentElement.elementoType === 'asignatura') {
              let currentAsignatura = currentElement.item.nombre;
              let currentProfesores = currentElement.item.profesor[0].nombre;
              let currentAsignaturaCreditos = currentElement.item.creditos;

              if (!asignaturasProfesores.some(ap => ap.asignatura === currentAsignatura && ap.profesores === currentProfesores)) {
                asignaturasProfesores.push({ asignatura: currentAsignatura, profesores: currentProfesores, horas: currentAsignaturaCreditos });
              }

            }

            // Obtener la hora del elemento actual
            let elementHourStart = currentElement.hourStart;
            let elementHourEnd = currentElement.hourEnd;

            // Comprobar si las horas son iguales
            let rowIndex = i + 1; // Sumar 1 para evitar reemplazar la primera fila (encabezado)
            let colIndex = j + 1; // Sumar 1 para evitar reemplazar la primera columna (horario)

            // Insertar el valor en la celda correspondiente

            if (i === this.hours.indexOf(elementHourStart + '-' + elementHourEnd) && j === (days.indexOf(currentElement.dayName))) {

              if (typeof row[colIndex] === 'undefined') {
                row[colIndex] = '';
              }
              if (currentElement.elementoType === 'aula') {
                agrupaciones.push(currentElement)
                row[colIndex] += '\n' + (currentElement.item.nombre + ' - ' + currentElement.item.ubicacion).replace(/(.+)/, '($1)').trim();
              } else {
                agrupaciones.push(currentElement)
                row[colIndex] += currentElement.item.nombre.trim();
              }


            }



          }

        }
      }

      worksheet.addRow(row).eachCell({ includeEmpty: true }, function (cell) {
        cell.font = { size: 6 };

      });

    }

    for (let i = 7; i <= indiceCellBorder; i++) {
      const rowTablaHorarioItem = worksheet.getRow(i);
      rowTablaHorarioItem.height = 20;
      rowTablaHorarioItem.alignment = { vertical: 'middle', horizontal: 'center' }; // Opcional: alinear el contenido
      rowTablaHorarioItem.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true }; // Activar el ajuste de texto
    }

    for (let row = 6; row <= indiceCellBorder; row++) {
      for (let col = 1; col <= indiceCell; col++) {
        let cell = worksheet.getCell(`${String.fromCharCode(64 + col)}${row}`);
        cell.border = {
          top: { style: 'thin', color: { argb: '000000' } },
          left: { style: 'thin', color: { argb: '000000' } },
          bottom: { style: 'thin', color: { argb: '000000' } },
          right: { style: 'thin', color: { argb: '000000' } }
        };

      }
    }

    worksheet.insertRow(indiceCellList, ['Asignaturas', 'Profesores', 'N° Horas', 'Modalidad']);


    worksheet.getRow(indiceCellList).eachCell({ includeEmpty: true }, function (cell) {
      cell.font = {
        bold: true,
        size: 8
      }
      cell.border = {
        top: { style: 'thin', color: { argb: '000000' } },
        left: { style: 'thin', color: { argb: '000000' } },
        bottom: { style: 'thin', color: { argb: '000000' } },
        right: { style: 'thin', color: { argb: '000000' } }
      };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '9b9b9b  ' } // aquí se define el color celeste
      };
    });

    // Crear un objeto para almacenar los resultados agrupados
    let resultadoAgrupado: any = [];

    // Recorrer el array original y agrupar las asignaturas y aulas

    let asignaturaId: string | number;

    agrupaciones.forEach((item: { elementoType: string; item: { _id: any; }; carrera: any; dayName: any; hourEnd: any; hourStart: any; identificador: any; semestre: any; }) => {
      if (item.elementoType === "asignatura") {
        asignaturaId = item.item._id;
        if (!resultadoAgrupado[asignaturaId]) {
          resultadoAgrupado[asignaturaId] = {
            carrera: item.carrera,
            dayName: item.dayName,
            elementoType: item.elementoType,
            hourEnd: item.hourEnd,
            hourStart: item.hourStart,
            identificador: item.identificador,
            item: item.item,
            semestre: item.semestre,
            aulas: []
          };
        }
      } else if (item.elementoType === "aula") {

        if (resultadoAgrupado[asignaturaId]) {

          resultadoAgrupado[asignaturaId].aulas.push(item);
          resultadoAgrupado[asignaturaId].dayName = item.dayName
        }
      }
    });


    // Convertir el objeto resultadoAgrupado en un array de resultados
    let resultadoFinal = Object.values(resultadoAgrupado);

    resultadoFinal.forEach((resultado: any) => {
      let todasSonZoom = true;
      let algunaEsZoom = false;

      resultado.aulas.forEach((aula: { item: { nombre: string; }; }) => {
        if (aula.item.nombre.toLowerCase() !== "zoom") {
          todasSonZoom = false;
        } else {
          algunaEsZoom = true;
        }
      });

      if (todasSonZoom) {
        resultado.modalidad = "Virtual";
      } else if (!algunaEsZoom) {
        resultado.modalidad = "Presencial";
      } else {
        resultado.modalidad = "Mixto (Virtual y Presencial)";
      }
    });

    asignaturasProfesores.forEach((elemento1) => {
      elemento1.modalidad = ""; // Inicializamos la propiedad modalidad como un array vacío

      resultadoFinal.forEach((resultado: any) => {
        if (resultado && resultado.modalidad && elemento1.asignatura === resultado.item.nombre) {
          elemento1.modalidad = resultado.modalidad;
        }
      });
    });

    asignaturasProfesores.forEach(ap => {
      worksheet.addRow([ap.asignatura, ap.profesores, ap.horas, ap.modalidad]).eachCell({ includeEmpty: true }, function (cell) {
        cell.font = { size: 8 };
        cell.border = {
          top: { style: 'thin', color: { argb: '000000' } },
          left: { style: 'thin', color: { argb: '000000' } },
          bottom: { style: 'thin', color: { argb: '000000' } },
          right: { style: 'thin', color: { argb: '000000' } }
        };
      })
    });

    const identificador = uuidv4();
    const nombreArchivo = this.opcion1 + '-' + this.opcion2 + '-' + this.opcion3 + `-(${identificador}).xlsx`;



    // Agregar texto al final de la página
    let elaboradoPor = worksheet.getCell(26, 2);
    elaboradoPor.value = 'Elaborado por: ';
    elaboradoPor.font = { size: 8 };

    let nombreDirector = worksheet.getCell(29, 2);
    nombreDirector.value = this.horario.creado_por.nombre;
    nombreDirector.font = { size: 8 };

    let directorCarrera = worksheet.getCell(30, 2);
    directorCarrera.value = 'Director de Carrera';
    directorCarrera.font = { size: 8 };


    // Agregar texto al final de la página
    let revisadoPor = worksheet.getCell(26, 4);
    revisadoPor.value = 'Revisado por: ';
    revisadoPor.font = { size: 8 };
    if (this.horario.revisado_por) {
      
      let nombreRevisador = worksheet.getCell(29, 4);
      nombreRevisador.value = this.horario.revisado_por!.nombre;
      nombreRevisador.font = { size: 8 };
    } else {

      let nombreRevisador = worksheet.getCell(29, 4);
      nombreRevisador.value = ""
      nombreRevisador.font = { size: 8 };
    }
    let cargoRevisador = worksheet.getCell(30, 4);
    cargoRevisador.value = 'Decano de Facultad';
    cargoRevisador.font = { size: 8 };



    // Agregar texto al final de la página
    let aprobadorPor = worksheet.getCell(26, 6);
    aprobadorPor.value = 'Aprobado por: ';
    aprobadorPor.font = { size: 8 };

    let nombreAprobador = worksheet.getCell(29, 6);
    nombreAprobador.value = this.aprobador.nombre;
    nombreAprobador.font = { size: 8 };

    let cargoAprobador = worksheet.getCell(30, 6);
    cargoAprobador.value = 'Directora Académica';
    cargoAprobador.font = { size: 8 };

    workbook.xlsx.writeBuffer().then((buffer: ArrayBuffer) => {
      const data = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      FileSaver.saveAs(data, nombreArchivo);
    });

  }

  async verificarHorario() {

    this.terminoBusquedaAsignatura = ""
    this.terminoBusquedaAsignaturaStatic = ""
    this.terminoBusquedaAula = ""
    await this.getHorarios()
    this.aulaHorario = []
    this.asignaturaHorario = []
    this.horario = new Horario('', '', '', '', '', [], [], [], [], this.usuario)
    let itemsHorarioArray = []
    let arreglosHorario = []
    arreglosHorario = [
      this.monday,
      this.tuesday,
      this.wednesday,
      this.thursday,
      this.friday,
      this.saturday
    ]

    let identificadoresAulas = []
    let identificadoresAsignaturas = []
    let datosIguales: boolean = false
    let itemHorariosList: any[] = []
    if (this.opcion1 == "Horario Diurno") {
      this.horario.tipoHorario = "Horario Diurno"
    } else {
      this.horario.tipoHorario = "Horario Nocturno"
    }

    this.horario.carrera = this.opcion2
    this.horario.semestre = this.opcion3

    let elementoComprobarTipo: any = []
    let elementoComprobarId: any = []
    let asig: number = 0
    let aula: number = 0
    for (const dias of arreglosHorario) {
      dias.sort(function (a, b) {
        // Convierte las horas de inicio y fin a objetos Date para poder compararlas
        const dateAStart = new Date('1970/01/01 ' + a.hourStart.trim());
        const dateBStart = new Date('1970/01/01 ' + b.hourStart.trim());
        const dateAEnd = new Date('1970/01/01 ' + a.hourEnd.trim());
        const dateBEnd = new Date('1970/01/01 ' + b.hourEnd.trim());

        // Compara las horas de inicio y fin y devuelve el resultado de la comparación
        if (dateAStart < dateBStart) {
          return -1;
        } else if (dateAStart > dateBStart) {
          return 1;
        } else if (dateAEnd < dateBEnd) {
          return -1;
        } else if (dateAEnd > dateBEnd) {
          return 1;
        } else {
          return 0;
        }
      });


      for (const objetoElementoType of dias) {
        elementoComprobarTipo.push(objetoElementoType.elementoType)
        elementoComprobarId.push(objetoElementoType.identificador)
      }

      for (const objeto of dias) {
        if (objeto.identificador.includes("aula")) {
          identificadoresAulas.push(objeto.identificador)
          await this.getAulaId(objeto.item._id)
        }

        if (objeto.identificador.includes("asignatura")) {
          this.horario.dia.push(objeto.dayName)
          this.horario.horas.push({ horaInicio: objeto.hourStart, horaFin: objeto.hourEnd });
          identificadoresAsignaturas.push(objeto.identificador)
          await this.getAsignaturaId(objeto.item._id)
        }
      }
    }

    for (const element of elementoComprobarTipo) {
      if (element === "asignatura") {
        asig++
      } else {
        aula++
      }
    }

    if (asig === aula) {
      datosIguales = true
    }

    let parejas = [];
    for (let i = 0; i < elementoComprobarId.length; i++) {
      let primeraTresLetras = elementoComprobarId[i].substring(0, 3);
      for (let j = i + 1; j < elementoComprobarId.length; j++) {
        if (elementoComprobarId[j].substring(0, 3) === primeraTresLetras) {
          parejas.push(j);
          break;
        }
      }
    }

    if (parejas.length !== elementoComprobarId.length / 2 && parejas.length !== 0) {
      datosIguales = false
    }

    itemsHorarioArray = [
      this.asignaturaHorario,
      this.aulaHorario
    ];


    let index = 0;
    this.horario.item = []
    for (let i = 0; i < itemsHorarioArray[0].length || i < itemsHorarioArray[1].length; i++) {
      if (itemsHorarioArray[0][index]) {
        let asignatura = itemsHorarioArray[0][index] as Asignatura;
        let aula = itemsHorarioArray[1][index] as Aula;
        this.horario.item.push({ asignatura: asignatura, aula: aula });
      }
      index = (index + 1) % itemsHorarioArray[0].length;
    }

    let itemsIdent = []
    itemsIdent = [
      identificadoresAsignaturas,
      identificadoresAulas
    ];

    //agregar items de cada celda
    let index2 = 0;
    for (let i = 0; i < itemsIdent[0].length || i < itemsIdent[1].length; i++) {
      if (itemsIdent[0][index2]) {
        let IdAsignatura = itemsIdent[0][index2];
        let IdAula = itemsIdent[1][index2];
        this.horario.idTabla.push({ idAsignatura: IdAsignatura, idAula: IdAula });
      }
      index2 = (index2 + 1) % itemsIdent[0].length;
    }


    if (this.asignaturasFiltradas.length === 0 && this.terminoBusquedaAsignatura === "") {

      Swal.fire({
        title: '¿Estás seguro?',
        text: 'Se empezará a verificar el horario',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#4CAF50',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Verificar',
      }).then((result: any) => {
        if (result.isConfirmed) {

          let itemsBDHorario = []
          let itemsHorario = null
          let mensaje = "";

          if (datosIguales && !this.existHorarioCarrera && parejas.length !== 0) {

            itemsBDHorario = this.horarios.map(verify => ({
              carrera: verify.carrera,
              semestre: verify.semestre,
              dia: verify.dia,
              paralelo: verify.paralelo,
              idAsignaturaTableVerify: verify.idTabla.map(idTabla => idTabla.idAsignatura),
              idAulaTableVerify: verify.idTabla.map(idTabla => idTabla.idAula),
              itemverifyAsignatura: verify.item.map(item => item.asignatura._id),
              itemverifyAsignaturaNombre: verify.item.map(item => item.asignatura.nombre),
              itemverifyAula: verify.item.map(item => item.aula._id),
              itemverifyAulaNombre: verify.item.map(item => item.aula.nombre),
              itemverifyAulaCompartida: verify.item.map(item => item.aula.compartida),
              itemHorasInico: verify.horas.map(item => item.horaInicio),
              itemHorasFin: verify.horas.map(item => item.horaFin),
              itemverifyprofesor: verify.item.map(item => item.asignatura.profesor[0]._id),
              itemverifyprofesorNombre: verify.item.map(item => item.asignatura.profesor[0].nombre),

            }));



            itemsHorario = {
              dia: this.horario.dia,
              idAsignaturaTableVerify: this.horario.idTabla.map(idTabla => idTabla.idAsignatura),
              idAulaTableVerify: this.horario.idTabla.map(idTabla => idTabla.idAula),
              itemverifyAsignatura: this.horario.item.map(item => item.asignatura._id),
              itemverifyAula: this.horario.item.map(item => item.aula._id),
              itemverifyAulaNombre: this.horario.item.map(item => item.aula.nombre),
              itemverifyAulaCompartida: this.horario.item.map(item => item.aula.compartida),
              itemverifyprofesor: this.horario.item.map(item => item.asignatura.profesor[0]._id),
              itemverifyprofesorNombre: this.horario.item.map(item => item.asignatura.profesor[0].nombre),
            };




            for (let i = 0; i < itemsHorario.dia.length; i++) {
              const diaActual = itemsHorario.dia[i];
              for (let j = 0; j < itemsBDHorario.length; j++) {
                if (itemsBDHorario[j].dia.includes(diaActual)) {

                  // Iterar todos los elementos de los arrays que coinciden con el día actual
                  for (let k = 0; k < itemsBDHorario[j].idAsignaturaTableVerify.length; k++) {

                    if (itemsBDHorario[j].idAsignaturaTableVerify[k] === itemsHorario.idAsignaturaTableVerify[i] &&
                      itemsBDHorario[j].idAulaTableVerify[k] === itemsHorario.idAulaTableVerify[i] &&
                      itemsBDHorario[j].itemverifyAsignatura[k] === itemsHorario.itemverifyAsignatura[i] &&
                      itemsBDHorario[j].itemverifyAula[k] === itemsHorario.itemverifyAula[i]) {

                      mensaje += `
                      
                    <strong>¡Choque de aula y asignatura (Misma hora)</strong>!<br>
                    Motivo: La misma asignatura y aula ya se asignó en esa hora<br>
                    <strong>Horario: ${itemsBDHorario[j].carrera}  - ${itemsBDHorario[j].semestre} - ${itemsBDHorario[j].paralelo}</strong><br>
                    Dia: ${diaActual}<br>
                    Hora: ${itemsBDHorario[j].itemHorasInico[k]} - ${itemsBDHorario[j].itemHorasFin[k]}<br>
                    Asignatura: ${itemsBDHorario[j].itemverifyAsignaturaNombre[k]}<br>
                    Aula: ${itemsBDHorario[j].itemverifyAulaNombre[k]}<br>
                `;


                    } else if (itemsBDHorario[j].idAsignaturaTableVerify[k] === itemsHorario.idAsignaturaTableVerify[i] &&
                      itemsBDHorario[j].itemverifyprofesor[k] === itemsHorario.itemverifyprofesor[i]) {



                      mensaje += `
                    <strong>¡Choque de profesor (Misma hora)</strong>!<br>
                    Motivo: El profesor ya se asignó a al misma hora para dar otra clase<br>
                    <strong>Horario: ${itemsBDHorario[j].carrera}  - ${itemsBDHorario[j].semestre} - ${itemsBDHorario[j].paralelo}</strong><br>
                    Dia: ${diaActual}<br>
                    Hora: ${itemsBDHorario[j].itemHorasInico[k]} - ${itemsBDHorario[j].itemHorasFin[k]}<br>
                    Asignatura: ${itemsBDHorario[j].itemverifyAsignaturaNombre[k]}<br>
                    Aula: ${itemsBDHorario[j].itemverifyAulaNombre[k]}<br>
                    Profesor: ${itemsBDHorario[j].itemverifyprofesorNombre[k]}<br>
                `;



                    } else if (itemsBDHorario[j].idAulaTableVerify[k] === itemsHorario.idAulaTableVerify[i] &&
                      itemsBDHorario[j].itemverifyAula[k] === itemsHorario.itemverifyAula[i]
                      && itemsBDHorario[j].itemverifyAulaCompartida[k] !== "Si")



                      mensaje += `
                  <strong>¡Choque de aula (Misma hora)</strong>!<br>
                  Motivo: El aula ya se asignó para otra asignatura<br>
                  <strong>Horario: ${itemsBDHorario[j].carrera}  - ${itemsBDHorario[j].semestre} - ${itemsBDHorario[j].paralelo}</strong><br>
                  Dia: ${diaActual}<br>
                  Hora: ${itemsBDHorario[j].itemHorasInico[k]} - ${itemsBDHorario[j].itemHorasFin[k]}<br>
                  Asignatura: ${itemsBDHorario[j].itemverifyAsignaturaNombre[k]}<br>
                  Aula: ${itemsBDHorario[j].itemverifyAulaNombre[k]}<br>
                  Profesor: ${itemsBDHorario[j].itemverifyprofesorNombre[k]}<br>
              `;



                  }
                }


              }
            }


            if (mensaje !== "") {
              Swal.fire({
                title: '¡Choques!',
                html: `<div style="height: 250px; overflow-y: auto">${mensaje}</div>`,
                icon: 'warning',
                showCancelButton: true,
                cancelButtonText: 'Cerrar',
                confirmButtonText: 'Descargar PDF',
              }).then((result) => {
                if (result.isConfirmed) {
                  if (result.isConfirmed) {
                    const doc = new jsPDF();
                    doc.setFontSize(14);

                    const title = "Choques";
                    const text = mensaje.replace(/<br>/g, '').replace(/<strong>/g, '').replace(/<\/strong>/g, '');

                    const textLines = doc.splitTextToSize(text, 200); // Ancho máximo del texto en la página (en este caso, 190)
                    const pageHeight = doc.internal.pageSize.height;
                    let cursorY = 10;

                    doc.text(title, doc.internal.pageSize.getWidth() / 2, cursorY, { align: 'center' });
                    cursorY += 10; // Espacio entre el título y el texto

                    for (let i = 0; i < textLines.length; i++) {
                      if (cursorY > pageHeight - 5) {
                        doc.addPage();
                        cursorY = 10;
                      }
                      doc.text(textLines[i], 1, cursorY, { align: 'justify' });
                      cursorY += 7; // Espacio entre líneas de texto
                    }

                    doc.save('choques.pdf');
                  }
                }
              });
              this.isActiveBtn = false

              this.isActiveBtnG = false
            }



            if (datosIguales && !this.existHorarioCarrera && parejas.length !== 0 && mensaje === "") {

              this.status = 'success'


              Swal.fire(
                'Horario Verificado',
                'El horario esta correctamente',
                'success'
              )
              this.isActiveBtn = true

            }


          } else if (parejas.length === 0) {
            Swal.fire(
              'Horario Rechazado',
              'Por favor, rellene las asignaturas y aulas correctamente',
              'error'
            )
            this.isActiveBtn = false
          } else if (!datosIguales) {
            Swal.fire(
              'Horario no verificado',
              'Por favor, debe contener en cada celda una asignatura y una aula',
              'error'
            )
            this.isActiveBtn = false
          } else if (this.existHorarioCarrera) {
            Swal.fire(
              'EL ' + this.opcion1 + ' de ' + this.opcion2 + ' del ' + this.opcion3 + ' semestre ya existe',
              'Por favor, si desea modificar vaya a la sección de horarios',
              'error'
            )
            this.isActiveBtn = false
          }

        } else {
          Swal.fire('Operación cancelada', 'El horario no ha sido verificado', 'warning');

        }
      });

    } else {
      Swal.fire(
        'Horario no verificado',
        'Por favor, debe colocar todas las asignaturas.',
        'error'
      )
    }

  }

  async verificarDiaPresencialVirtual() {
    this.aulaHorario = []
    this.asignaturaHorario = []
    this.horario = new Horario('', '', '', '', '', [], [], [], [], this.usuario)
    let arreglosHorario = []
    arreglosHorario = [
      this.monday,
      this.tuesday,
      this.wednesday,
      this.thursday,
      this.friday,
      this.saturday
    ]

    let identificadoresAulas = []
    let identificadoresAsignaturas = []
    if (this.opcion1 == "Horario Diurno") {
      this.horario.tipoHorario = "Horario Diurno"
    } else {
      this.horario.tipoHorario = "Horario Nocturno"
    }

    this.horario.carrera = this.opcion2
    this.horario.semestre = this.opcion3

    let elementoComprobarTipo: any = []
    let elementoComprobarId: any = []
    let asig: number = 0
    let aula: number = 0

    let grupoAsigPoId: any = []
    for (const dias of arreglosHorario) {
      dias.sort(function (a, b) {
        // Convierte las horas de inicio y fin a objetos Date para poder compararlas
        const dateAStart = new Date('1970/01/01 ' + a.hourStart.trim());
        const dateBStart = new Date('1970/01/01 ' + b.hourStart.trim());
        const dateAEnd = new Date('1970/01/01 ' + a.hourEnd.trim());
        const dateBEnd = new Date('1970/01/01 ' + b.hourEnd.trim());

        // Compara las horas de inicio y fin y devuelve el resultado de la comparación
        if (dateAStart < dateBStart) {
          return -1;
        } else if (dateAStart > dateBStart) {
          return 1;
        } else if (dateAEnd < dateBEnd) {
          return -1;
        } else if (dateAEnd > dateBEnd) {
          return 1;
        } else {
          return 0;
        }
      });

      for (const objetoElementoType of dias) {
        elementoComprobarTipo.push(objetoElementoType.elementoType)
        elementoComprobarId.push(objetoElementoType.identificador)
      }
      for (let objetoElementoType of dias) {
        let elemento = objetoElementoType;
        let primerDigito = elemento.identificador.toString()[0];
        if (objetoElementoType.identificador.includes("aula")) {


          if (grupoAsigPoId[primerDigito]) {
            grupoAsigPoId[primerDigito].push(elemento);
          } else {
            grupoAsigPoId[primerDigito] = [elemento];
          }
        }
      }

      for (const objeto of dias) {
        if (objeto.identificador.includes("aula")) {
          identificadoresAulas.push(objeto.identificador)
          await this.getAulaId(objeto.item._id)
        }

        if (objeto.identificador.includes("asignatura")) {
          this.horario.dia.push(objeto.dayName)
          this.horario.horas.push({ horaInicio: objeto.hourStart, horaFin: objeto.hourEnd });
          identificadoresAsignaturas.push(objeto.identificador)
          await this.getAsignaturaId(objeto.item._id)
        }
      }
    }



    grupoAsigPoId.forEach((subArray: any[]) => {
      let isValid = true; // Variable para verificar si el día es válido

      let zoomExist = subArray.some(element => element.item.ubicacion && element.item.ubicacion.toLowerCase() === 'zoom');

      if (zoomExist) {
        let hasOtherThanZoom = subArray.some(element => element.item.ubicacion && element.item.ubicacion.toLowerCase() !== 'zoom');

        if (hasOtherThanZoom) {
          isValid = false;

        }
      }

      let Dias: any = {
        0: 'Lunes',
        1: 'Martes',
        2: 'Miércoles',
        3: 'Jueves',
        4: 'Viernes',
        5: 'Sábado'
      };

      let dia: any
      // Verificar si el día es válido
      if (!this.verificarDiaPresencialVirtualBolean) {
        if (!isValid) {
          subArray.forEach(element => {
            if (element.item.ubicacion && element.item.ubicacion.toLowerCase() !== 'zoom') {
              dia = parseInt(element.identificador.toString()[0])
            }
          });

          let swalPromise = new Promise((resolve, reject) => {
            Swal.fire({
              title: 'Advertencia',
              text: 'Hay clases presenciales y virtuales en el mismo día en el dia: ' + Dias[dia],
              icon: 'warning',
              showCancelButton: true,
              confirmButtonText: 'Aceptar',
              cancelButtonText: 'Quitar Advertencia'
            }).then((result) => {
              if (result.isConfirmed) {
                resolve(false);
              } else if (result.dismiss === Swal.DismissReason.cancel) {
                resolve(true);
              }
            });
          });

          swalPromise.then((value: any) => {
            this.verificarDiaPresencialVirtualBolean = value;


          });
        }
      }

    });

  }

  async verificarAulaUbicacion() {
    this.aulaHorario = []
    this.asignaturaHorario = []
    this.horario = new Horario('', '', '', '', '', [], [], [], [], this.usuario)
    let arreglosHorario = []
    arreglosHorario = [
      this.monday,
      this.tuesday,
      this.wednesday,
      this.thursday,
      this.friday,
      this.saturday
    ]

    let identificadoresAulas = []
    let identificadoresAsignaturas = []
    if (this.opcion1 == "Horario Diurno") {
      this.horario.tipoHorario = "Horario Diurno"
    } else {
      this.horario.tipoHorario = "Horario Nocturno"
    }

    this.horario.carrera = this.opcion2
    this.horario.semestre = this.opcion3

    let elementoComprobarTipo: any = []
    let elementoComprobarId: any = []
    let asig: number = 0
    let aula: number = 0

    let grupoAsigPoId: any = []
    for (const dias of arreglosHorario) {
      dias.sort(function (a, b) {
        // Convierte las horas de inicio y fin a objetos Date para poder compararlas
        const dateAStart = new Date('1970/01/01 ' + a.hourStart.trim());
        const dateBStart = new Date('1970/01/01 ' + b.hourStart.trim());
        const dateAEnd = new Date('1970/01/01 ' + a.hourEnd.trim());
        const dateBEnd = new Date('1970/01/01 ' + b.hourEnd.trim());

        // Compara las horas de inicio y fin y devuelve el resultado de la comparación
        if (dateAStart < dateBStart) {
          return -1;
        } else if (dateAStart > dateBStart) {
          return 1;
        } else if (dateAEnd < dateBEnd) {
          return -1;
        } else if (dateAEnd > dateBEnd) {
          return 1;
        } else {
          return 0;
        }
      });

      for (const objetoElementoType of dias) {
        elementoComprobarTipo.push(objetoElementoType.elementoType)
        elementoComprobarId.push(objetoElementoType.identificador)
      }
      for (let objetoElementoType of dias) {
        let elemento = objetoElementoType;
        let primerDigito = elemento.identificador.toString()[0];
        if (objetoElementoType.identificador.includes("aula")) {


          if (grupoAsigPoId[primerDigito]) {
            grupoAsigPoId[primerDigito].push(elemento);
          } else {
            grupoAsigPoId[primerDigito] = [elemento];
          }
        }
      }

      for (const objeto of dias) {
        if (objeto.identificador.includes("aula")) {
          identificadoresAulas.push(objeto.identificador)
          await this.getAulaId(objeto.item._id)
        }

        if (objeto.identificador.includes("asignatura")) {
          this.horario.dia.push(objeto.dayName)
          this.horario.horas.push({ horaInicio: objeto.hourStart, horaFin: objeto.hourEnd });
          identificadoresAsignaturas.push(objeto.identificador)
          await this.getAsignaturaId(objeto.item._id)
        }
      }
    }



    grupoAsigPoId.forEach((subArray: any[]) => {
      let isValid = true; // Variable para verificar si el día es válido

      let zoomExist = subArray.some(element => element.item.ubicacion && element.item.ubicacion.toLowerCase() === 'zoom');

      if (!zoomExist) {
        let colon = subArray.some(element => element.item.ubicacion && element.item.ubicacion.toLowerCase() !== 'campus colon');

        if (colon) {
          let norte = subArray.some(element => element.item.ubicacion && element.item.ubicacion.toLowerCase() !== 'campus norte');

          if (norte) {
            isValid = false;

          }

        }
      }

      let Dias: any = {
        0: 'Lunes',
        1: 'Martes',
        2: 'Miércoles',
        3: 'Jueves',
        4: 'Viernes',
        5: 'Sábado'
      };

      let dia: any
      // Verificar si el día es válido
      if (!this.verificarAulaUbicacionBolean) {
        if (!isValid) {
          subArray.forEach(element => {
            if (element.item.ubicacion && element.item.ubicacion.toLowerCase() !== 'colon') {
              dia = parseInt(element.identificador.toString()[0])
            }
          });

          let swalPromise = new Promise((resolve, reject) => {
            Swal.fire({
              title: 'Advertencia',
              text: 'Hay aulas en diferentes ubicaciones (norte y colon) en el mismo día: ' + Dias[dia] + '.',
              icon: 'warning',
              showCancelButton: true,
              confirmButtonText: 'Aceptar',
              cancelButtonText: 'Quitar Advertencia'
            }).then((result) => {
              if (result.isConfirmed) {
                resolve(false);
              } else if (result.dismiss === Swal.DismissReason.cancel) {
                resolve(true);
              }
            });
          });

          swalPromise.then((value: any) => {
            this.verificarAulaUbicacionBolean = value;


          });
        }
      }

    });

  }


}