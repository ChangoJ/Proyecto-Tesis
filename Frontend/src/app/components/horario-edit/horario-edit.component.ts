import { Component, Input } from '@angular/core';
import Swal from 'sweetalert2';
import { Aula } from '../models/aula';
import { Asignatura } from '../models/asignatura';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { ActivatedRoute, Router } from '@angular/router';
import { AsignaturaService } from '../services/asignatura.service';
import { AulaService } from '../services/aula.service';
import { HorarioService } from '../services/horario.service';
import { Horario } from '../models/horario';
import { Profesor } from '../models/profesor';
import { ProfesorService } from '../services/profesor.service';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as FileSaver from 'file-saver';
import { v4 as uuidv4 } from 'uuid';
import * as ExcelJS from 'exceljs';
import { UsuarioService } from '../services/usuario.service';
import { DetalleService } from '../services/detalle.service';
import { io, Socket } from 'socket.io-client';

@Component({
  selector: 'app-horario-edit',
  templateUrl: './horario-edit.component.html',
  styleUrls: ['./horario-edit.component.css'],
  providers: [HorarioService, AsignaturaService, AulaService, ProfesorService, UsuarioService, DetalleService]
})
export class HorarioEditComponent {

  @Input() asignaturas!: Asignatura[]
  public profesores: any[] = [];
  public aulas!: Aula[];
  public indiceHora!: string
  public listaA: any[] = []
  public is_Diurno!: Boolean
  public opcion1: string = "";
  public opcion2: string = "";
  public opcion3: string = "";
  public opcion4: string = "";
  public opcion5: string = "";
  public idHorario: string = "";
  public status!: string;
  public horario!: Horario
  public horarios: Horario[] = []
  public asignaturaHorario: Asignatura[] = []
  public aulaHorario: Aula[] = []
  public existHorarioCarrera: boolean;
  public isActiveBtn = false
  public isActiveBtnG = true
  public isActiveBtnV = false
  public opcionVerHorario = false
  public verificarDiaPresencialVirtualBolean: boolean = false;
  public verificarAsignaturasBolean: boolean = false;
  public verificarAulaUbicacionBolean: boolean = false;
  public verificarProfesorBolean: boolean = false;
  public authToken!: any;
  public userData!: any;
  public usuario!: any;
  public periodoTipo!: any;
  public usuarios: any = [];
  public revisador: any = [];
  public aprobador: any = [];
  public hours!: any[];
  public hoursnight!: any[];
  public monday: any[] = [];
  public tuesday: any[] = [];
  public wednesday: any[] = [];
  public thursday: any[] = [];
  public friday: any[] = [];
  public saturday: any[] = [];
  public terminoBusquedaAsignatura: string = '';
  public terminoBusquedaAsignaturaStatic: string = '';
  public terminoBusquedaAsignaturaBoolean: boolean = false;
  public terminoBusquedaAula: string = '';
  public asignaturasFiltradas: any[] = [];
  public asignaturasFiltradasDrop: any[] = [];
  public asignaturasFiltradasDropReverse: any[] = [];
  public asignaturasFiltradasDropReverseBEmpty: any[] = [];
  public asignaturasColocadas: any[] = [];
  public aulasFiltradas: any[] = [];
  public is_Paralelo: boolean = false;
  private socket!: Socket;
  public estadoHorarioCreacion: boolean = false
  public usuariosConectados: any = []



  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _asignaturaService: AsignaturaService,
    private _aulasService: AulaService,
    private _horarioService: HorarioService,
    private _usuarioService: UsuarioService,
    private _detalleService: DetalleService
  ) {
    this.horario = new Horario('', '', '', '', '', [], [], [], [], this.usuario)
    this.existHorarioCarrera = false
    this.authToken = this._detalleService.authToken
    this.userData = this._detalleService.userData

    this.socket = io('http://localhost:3900', {
      transports: ['websocket'],
    });

    this.socket.emit('crearHorario');

    this.socket.on('usuariosConectados', (usuarios: string[]) => {
      this.usuariosConectados = usuarios;
    });
  }


  async ngOnInit() {
    this.getAulas()
    this.getHorario()
    this.getHorarios()
    this.verHorario()
    this.getUsuarios()

    setTimeout(() => {
      
      console.log(this.socket.id)
      
      console.log(this.usuariosConectados)
     
      if (this.usuariosConectados.length > 1 && this.socket.id !== this.usuariosConectados[0]) {
        Swal.fire(
          'No puede modificar el horario',
          'Otro usuario ya está creando o modificando un horario, por favor, inténtalo más tarde.',
          'error'
        );
        
        this._router.navigate(['/home']);
      }


    }, 1200);


  }

  
  ngOnDestroy() {
    this.socket.disconnect();

  }

  getDataDetalles() {
    console.log(this.horario)
    if (this.horario.horarioHoras === "1D") {

      this._detalleService.getHorasDiurnas().subscribe(horasDiurnas => {
        this.hours = horasDiurnas
      });
    } else if (this.horario.horarioHoras === "1N") {
      this._detalleService.getHorasNocturnas().subscribe(horasNocturnas => {
        this.hoursnight = horasNocturnas
      });

    } else if (this.horario.horarioHoras === "2D") {

      this._detalleService.getHorasAlternativaDiurnas().subscribe(horasAlternativaDiurnas => {
        this.hours = horasAlternativaDiurnas
      });
    } else if (this.horario.horarioHoras === "2N") {
      this._detalleService.getHorasAlternativaNocturnas().subscribe(horasAlternativaNocturnas => {
        this.hoursnight = horasAlternativaNocturnas
      });
    }
  }

  verHorario() {
    this._route.params.subscribe(params => {
      const valorRecibido = params['valor'];
      if (valorRecibido === "Ver") {
        this.opcionVerHorario = true
      } else {
        this.opcionVerHorario = false
      }
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
          for (const horario of this.horarios) {
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
          if (this.opcion2 === "Inglés") {

            this.periodoTipo = "Nivel"
          }

          if (this.periodoTipo === "ciclo") {
            this.horarios = this.horarios.filter(horario => horario.tipoHorario === this.opcion1 && horario.ciclo === this.opcion4);
          } else {
            this.horarios = this.horarios.filter(horario => horario.tipoHorario === this.opcion1);

          }

        }
      },
      error => {
        console.log(error)
      }
    )
  }

  filtrarAsignaturas() {
    if (this.terminoBusquedaAsignaturaStatic !== "") {
      this.terminoBusquedaAsignaturaBoolean = true
      this.asignaturasFiltradasDropReverseBEmpty = []
    } else if (this.terminoBusquedaAsignaturaStatic === "") {
      this.terminoBusquedaAsignaturaBoolean = false

    }

    if (this.terminoBusquedaAsignatura === "") {
      this.terminoBusquedaAsignaturaBoolean = false
    }


    if (this.terminoBusquedaAsignaturaBoolean === false) {

      this.asignaturas.push(...this.asignaturasFiltradasDropReverseBEmpty)


      this.asignaturasFiltradasDropReverseBEmpty = []
      this.asignaturasFiltradas = this.asignaturas.filter(asignatura => asignatura.nombre.toLowerCase().includes(this.terminoBusquedaAsignatura.toLowerCase()));

      if (this.terminoBusquedaAsignatura === "") {
        this.asignaturasFiltradasDropReverseBEmpty = []
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

          } else if ((this.opcion4 === undefined || this.opcion4 === "") && (this.opcion5 !== undefined || this.opcion5 !== "")) {
            this.asignaturas = this.asignaturas.filter(asignatura => asignatura.horario === tipoHorarioAsig && asignatura.paralelo && asignatura.paralelo.includes(this.opcion5))
            console.log(this.asignaturas)
          } else if ((this.opcion4 !== undefined || this.opcion4 !== "") && (this.opcion5 === undefined || this.opcion5 === "")) {
            this.asignaturas = this.asignaturas.filter(asignatura => asignatura.horario === tipoHorarioAsig && asignatura.ciclo && asignatura.ciclo.includes(this.opcion4))

          } else if ((this.opcion4 !== undefined || this.opcion4 !== "") && (this.opcion5 !== undefined || this.opcion5 !== "")) {
            this.asignaturas = this.asignaturas.filter(asignatura => asignatura.horario === tipoHorarioAsig && asignatura.paralelo && asignatura.paralelo.includes(this.opcion5) && asignatura.ciclo && asignatura.ciclo.includes(this.opcion4))

          }

          // Recorrer cada objeto del primer array
          for (let i = 0; i < this.asignaturas.length; i++) {
            // Verificar si el _id del objeto existe en el segundo array
            const objetoDuplicado = this.asignaturasColocadas.find(objeto => objeto._id === this.asignaturas[i]._id);

            // Si existe, eliminar todos los objetos con ese _id en ambos arrays
            if (objetoDuplicado) {
              this.asignaturas.splice(i, 1);
              this.asignaturasColocadas.splice(this.asignaturasColocadas.indexOf(objetoDuplicado), 1);
              i--;
            }
            // Si no existe, agregar el objeto al arrayUnico
            else {
              this.asignaturasFiltradas.push(this.asignaturas[i]);
            }
          }

          // Agregar los objetos restantes del segundo array al arrayUnico
          this.asignaturasFiltradas.push(...this.asignaturasColocadas);


        }
      },
      error => {
        console.log(error)
      }
    )

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
      this.isActiveBtnG = false

      this.isActiveBtnV = true
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

        // Permitir transferencia a lista correspondiente

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


      ///Eliminar origen del array
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
      this.verificarrProfesor()

      if (this.terminoBusquedaAsignatura === "" && newItem.dayName === undefined && !newItem.item.compartida) {

        this.terminoBusquedaAsignaturaStatic = this.terminoBusquedaAsignatura
        if (this.asignaturas.length === 0) {

          this.asignaturasFiltradasDropReverseBEmpty.push(newItem.item)
        }



      } else if (this.terminoBusquedaAsignatura === "" && newItem.dayName !== undefined && !newItem.item.compartida) {
        this.terminoBusquedaAsignaturaStatic = this.terminoBusquedaAsignatura


        for (let i = 0; i < this.asignaturasFiltradasDropReverseBEmpty.length; i++) {
          let elemento = this.asignaturasFiltradasDropReverseBEmpty[i];
          if (elemento._id === newItem.item._id) {
            this.asignaturasFiltradasDropReverseBEmpty.splice(i, 1);

            break;
          }
        }
      }


      if (this.terminoBusquedaAsignatura !== "" && newItem.dayName !== undefined && !newItem.item.compartida) {
        this.asignaturasFiltradasDrop.push(newItem.item)
        this.terminoBusquedaAsignaturaStatic = this.terminoBusquedaAsignatura


        this.asignaturasFiltradasDropReverseBEmpty = []

      } else if (this.terminoBusquedaAsignatura !== "" && newItem.dayName === undefined && !newItem.item.compartida) {


        this.asignaturasFiltradasDropReverseBEmpty = []
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


  getHorario() {
    this._route.params.subscribe(params => {
      let id = params['id'];
      this._horarioService.getHorario(id).subscribe(
        response => {
          if (response.horario) {
            this.horario = response.horario
            this.getDaysHorario()

            this.getAsignaturas()
            this.getDataDetalles()
          } else {
            this._router.navigate(['/horarios'], { relativeTo: this._route });
          }
        },
        error => {
          this._router.navigate(['/horarios'], { relativeTo: this._route });
        }
      )
    }
    )
  }

  getDaysHorario() {
    let dias = this.horario.dia;
    this.opcion2 = this.horario.carrera
    this.opcion3 = this.horario.semestre
    this.opcion1 = this.horario.tipoHorario
    this.opcion5 = this.horario.paralelo!
    this.opcion4 = this.horario.ciclo!
    this.idHorario = this.horario._id
    if (this.horario.tipoHorario === "Horario Diurno") {
      this.is_Diurno = true
      this.periodoTipo = "semestre"

    } else {

      this.periodoTipo = "ciclo"
    }

    if (this.opcion2 === "Inglés") {

      this.periodoTipo = "Nivel"
    }



    for (let i = 0; i < dias.length; i++) {
      let nuevoObjetoAsignatura = {
        dayName: '',
        elementoType: '',
        hourEnd: '',
        hourStart: '',
        identificador: '',
        item: {}
      };

      let nuevoObjetoAula = {
        dayName: '',
        elementoType: '',
        hourEnd: '',
        hourStart: '',
        identificador: '',
        item: {}
      };

      /* Asignatura */
      nuevoObjetoAsignatura.dayName = String(dias[i]);
      nuevoObjetoAsignatura.hourEnd = this.horario.horas[i].horaFin;
      nuevoObjetoAsignatura.hourStart = this.horario.horas[i].horaInicio;
      nuevoObjetoAsignatura.identificador = String(this.horario.idTabla[i].idAsignatura);
      nuevoObjetoAsignatura.item = this.horario.item[i].asignatura;
      nuevoObjetoAsignatura.elementoType = 'asignatura';

      /* Aula */
      nuevoObjetoAula.dayName = String(dias[i]);
      nuevoObjetoAula.hourEnd = this.horario.horas[i].horaFin;
      nuevoObjetoAula.hourStart = this.horario.horas[i].horaInicio;
      nuevoObjetoAula.identificador = String(this.horario.idTabla[i].idAula);
      nuevoObjetoAula.item = this.horario.item[i].aula;
      nuevoObjetoAula.elementoType = 'aula';

      if (dias[i] === "Lunes") {
        this.monday.push(nuevoObjetoAsignatura);
        this.monday.push(nuevoObjetoAula);
      } else if (dias[i] === "Martes") {
        this.tuesday.push(nuevoObjetoAsignatura);
        this.tuesday.push(nuevoObjetoAula);
      } else if (dias[i] === "Miercoles") {
        this.wednesday.push(nuevoObjetoAsignatura);
        this.wednesday.push(nuevoObjetoAula);

      } else if (dias[i] === "Jueves") {
        this.thursday.push(nuevoObjetoAsignatura);
        this.thursday.push(nuevoObjetoAula);
      } else if (dias[i] === "Viernes") {
        this.friday.push(nuevoObjetoAsignatura);
        this.friday.push(nuevoObjetoAula);
      } else if (dias[i] === "Sabado") {
        this.saturday.push(nuevoObjetoAsignatura);
        this.saturday.push(nuevoObjetoAula);
      }


      this.asignaturasColocadas.push(nuevoObjetoAsignatura.item)
    }

  }

  async submit() {
    await this.getHorarios()
    this.aulaHorario = []
    this.asignaturaHorario = []
    this.horario = new Horario('', '', '', '', '', [], [], [], [], this.usuario)
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
    this.horario.estado = "Pendiente (Modificado)"
    this.horario.tipoHorario = this.opcion1
    this.horario.carrera = this.opcion2
    this.horario.semestre = this.opcion3
    this.horario._id = this.idHorario
    this.horario.paralelo = this.opcion5
    this.horario.ciclo = this.opcion4


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


      for (const objeto of dias) {
        elementoComprobarTipo.push(objeto.elementoType)
        elementoComprobarId.push(objeto.identificador)

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
      text: 'El horarios se modificá',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#4CAF50',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Modificar',
    }).then((result: any) => {
      if (result.isConfirmed) {
        if (datosIguales) {
          this._horarioService.update(this.horario._id, this.horario).subscribe(
            response => {
              if (response.status == 'success') {
                this.status = 'success'
                this.horario = response.horario

                Swal.fire(
                  'Horario Modificado',
                  'El horario se ha modificado correctamente',
                  'success'
                )


                this.isActiveBtn = false
                this.isActiveBtnG = true
                this.isActiveBtnV = false

                /*  setTimeout(() => {
                   this._router.navigate(['/horarios']);
                 }, 1500); */

              } else {
                Swal.fire(
                  'Horario no modificado',
                  'Por favor, rellene las asignaturas y aulas correctamente',
                  'error'
                )
                this.status = 'error'
              }
            },
            error => {
              this.status = 'error: ' + error
            }
          )
        } else if (!datosIguales) {
          Swal.fire(
            'Horario no modificado',
            'Por favor, debe contener en cada celda una asignatura y una aula',
            'error'
          )
          this.status = 'error'
        } else {
          Swal.fire(
            'Horario no modificado',
            'Por favor, rellene las asignaturas y aulas correctamente',
            'error'
          )
          this.status = 'error'
        }

      } else {
        Swal.fire('Operación cancelada', 'El horario no ha sido modificado', 'warning');

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
    let periodoTipo2: any = ""
    if (this.opcion1 === "Horario Nocturno") {
      periodoTipo = "Semestre"

      periodoTipo2 = "Ciclo"
    } else {
      periodoTipo = "Semestre"
    }

    if (this.opcion2.toLowerCase() === "inglés") {

      periodoTipo = "Nivel"
    }
    let semestreText = periodoTipo + ": " + this.opcion3;
    let semestreInfoWidth = doc.getTextWidth(semestreText);

    let semestreInfoX = (pageWidth - semestreInfoWidth) / 2;

    if (this.opcion1 === "Horario Nocturno") {
      semestreText = periodoTipo + ": " + this.opcion3 + '  ' + periodoTipo2 + ": " + this.opcion4;
      semestreInfoWidth = doc.getTextWidth(semestreText);

      semestreInfoX = (pageWidth - semestreInfoWidth) / 2;

    }



    doc.text(semestreText, semestreInfoX, 25);


    let days
    let DataAdicional: any = [];
    let asignaturasProfesores: any[] = [];
    let rowData: any = [];
    let rowDataHead: any = [];
    let rowDataHead2: any = [];
    let hoursPDF = this.hours
    this.hours = []
    let cellSize
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

    // Agregar las horas y los datos de cada celda
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
      elemento1.modalidad = ""; // Inicializamos la propiedad modalidad como un array vacío

      resultadoFinal.forEach((resultado: any) => {
        if (resultado && resultado.modalidad && elemento1.asignatura === resultado.item.nombre) {
          elemento1.modalidad = resultado.modalidad;
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



    doc.addPage();

    autoTable(doc, {
      head: rowDataHead2,
      body: DataAdicional,
      theme: 'grid',
      styles: {
        cellWidth: 60,
        fontSize: 8,
        textColor: [0, 0, 0]
      },
      margin: { left: 20 },

    });


    let rowDataHead3: any = [];

    let DataFirmas: any = [];


    if (this.horario.revisado_por) {
      rowDataHead3.push(['Elaborado por:', 'Revisado por:', 'Aprobado por:'])
      DataFirmas.push(["", "", ""]);
      DataFirmas.push([this.horario.creado_por.nombre, this.horario.revisado_por!.nombre, this.aprobador.nombre]);
      DataFirmas.push(["Director de Carrera", "Decano de Facultad", "Directora Académica"]);

    } else {

      rowDataHead3.push(['Elaborado por:', 'Revisado por:', 'Aprobado por:'])
      DataFirmas.push(["", "", ""]);
      DataFirmas.push([this.horario.creado_por.nombre, "", this.aprobador.nombre]);
      DataFirmas.push(["Director de Carrera", "Decano de Facultad", "Directora Académica"]);
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

    let cellSize
    let cellSizeBorder
    let days
    let indiceCell
    let indiceCellBorder
    let indiceCellList: number
    if (this.opcion1 === "Horario Nocturno") {
      days = ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado'];
      indiceCell = 7
      indiceCellBorder = 17
      indiceCellList = 19
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

    let periodoTipo2: any = ""
    if (this.opcion1 === "Horario Nocturno") {

      periodoTipo2 = "Ciclo"
      periodoTipo = "Semestre"
    } else {
      periodoTipo = "Semestre"
    }
    if (this.opcion2.toLowerCase() === "inglés" && this.opcion1 === "Horario Diurno") {

      periodoTipo = "Nivel"

      indiceCellBorder = 16
      indiceCellList = 19
    } else if (this.opcion2.toLowerCase() === "inglés" && this.opcion1 === "Horario Nocturno") {
      periodoTipo = "Nivel"
      indiceCellBorder = 15
      indiceCellList = 19
    }
    // Agregar el título al Excel
    worksheet.mergeCells('A4:F4'); // Fusionar 5 celdas en la primera fila
    let semestreText = worksheet.getCell(4, 1);
    semestreText.value = periodoTipo + ": " + this.opcion3;
    if (this.opcion1 === "Horario Nocturno") {

      semestreText.value = periodoTipo + ": " + this.opcion3 + '  ' + periodoTipo2 + ": " + this.opcion4;
    }
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
    }// Agregar las horas y los datos de cada celda

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
          elemento1.modalidad = resultado.modalidad
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

      indiceCellList++
    });

    const identificador = uuidv4();
    const nombreArchivo = this.opcion1 + '-' + this.opcion2 + '-' + this.opcion3 + `-(${identificador}).xlsx`;


    console.log(indiceCellList)
    // Agregar texto al final de la página
    let elaboradoPor = worksheet.getCell(indiceCellList + 4, 2);
    elaboradoPor.value = 'Elaborado por: ';
    elaboradoPor.font = { size: 8 };

    let nombreDirector = worksheet.getCell(indiceCellList + 7, 2);
    nombreDirector.value = this.horario.creado_por.nombre;
    nombreDirector.font = { size: 8 };

    let directorCarrera = worksheet.getCell(indiceCellList + 8, 2);
    directorCarrera.value = 'Director de carrera';
    directorCarrera.font = { size: 8 };


    // Agregar texto al final de la página
    let revisadoPor = worksheet.getCell(indiceCellList + 4, 4);
    revisadoPor.value = 'Revisado por: ';
    revisadoPor.font = { size: 8 };

    if (this.horario.revisado_por) {

      let nombreRevisador = worksheet.getCell(indiceCellList + 7, 4);
      nombreRevisador.value = this.horario.revisado_por!.nombre!
      nombreRevisador.font = { size: 8 };
    } else {

      let nombreRevisador = worksheet.getCell(indiceCellList + 7, 4);
      nombreRevisador.value = ""
      nombreRevisador.font = { size: 8 };
    }

    let cargoRevisador = worksheet.getCell(indiceCellList + 8, 4);
    cargoRevisador.value = 'Decano de Facultad';
    cargoRevisador.font = { size: 8 };



    // Agregar texto al final de la página
    let aprobadorPor = worksheet.getCell(indiceCellList + 4, 6);
    aprobadorPor.value = 'Aprobado por: ';
    aprobadorPor.font = { size: 8 };

    let nombreAprobador = worksheet.getCell(indiceCellList + 7, 6);
    nombreAprobador.value = this.aprobador.nombre;
    nombreAprobador.font = { size: 8 };

    let cargoAprobador = worksheet.getCell(indiceCellList + 8, 6);
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
    await this.getHorarios
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
    let index2 = 0;
    //agregar items de cada celda
    for (let i = 0; i < itemsIdent[0].length || i < itemsIdent[1].length; i++) {
      if (itemsIdent[0][index2]) {
        let IdAsignatura = itemsIdent[0][index2];
        let IdAula = itemsIdent[1][index2];
        this.horario.idTabla.push({ idAsignatura: IdAsignatura, idAula: IdAula });
      }
      index2 = (index2 + 1) % itemsIdent[0].length;
    }

    const realizarVerificacionHorario = () => {
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

          if (datosIguales && parejas.length !== 0) {
            itemsBDHorario = this.horarios.map(verify => ({
              carrera: verify.carrera,
              semestre: verify.semestre,
              ciclo: verify.ciclo,
              dia: verify.dia,
              paralelo: verify.paralelo,
              tipoHorario: verify.tipoHorario,
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


            itemsBDHorario = itemsBDHorario.filter(item => !(item.carrera === this.opcion2 && item.semestre === this.opcion3 && item.tipoHorario === this.opcion1 && item.ciclo === this.opcion4 && item.paralelo === this.opcion5));



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
                      itemsBDHorario[j].itemverifyAula[k] === itemsHorario.itemverifyAula[i] && !this.verificarProfesorBolean) {

                      mensaje += `
                        <strong>¡Choque de aula y asignatura (Misma hora)</strong>!<br>
                        Motivo: El profesor ya ha sido asignado a la misma hora para impartir otra clase<br>
                        <strong>Carrera:</strong> ${itemsBDHorario[j].carrera} <br>
                        <strong>Horario:</strong> ${itemsBDHorario[j].tipoHorario}<br>
                        <strong>Paralelo:</strong> ${itemsBDHorario[j].paralelo}<br>
                        <strong>Semestre:</strong> ${itemsBDHorario[j].semestre} <br>
                        <strong>Ciclo:</strong> ${itemsBDHorario[j].ciclo}<br>Dia: ${diaActual}<br>
                        <strong>Hora:</strong> ${itemsBDHorario[j].itemHorasInico[k]} - ${itemsBDHorario[j].itemHorasFin[k]}<br>
                        <strong>Asignatura:</strong> ${itemsBDHorario[j].itemverifyAsignaturaNombre[k]}<br>
                        <strong>Aula:</strong> ${itemsBDHorario[j].itemverifyAulaNombre[k]}<br>
                    `;

                    } else if (itemsBDHorario[j].idAsignaturaTableVerify[k] === itemsHorario.idAsignaturaTableVerify[i] &&
                      itemsBDHorario[j].itemverifyprofesor[k] === itemsHorario.itemverifyprofesor[i]
                      && !this.verificarProfesorBolean) {



                      mensaje += `
                        <strong>¡Choque de profesor (Misma hora)</strong>!<br> 
                        <strong>Motivo:  </strong> El profesor ya ha sido asignado a la misma hora para impartir otra clase.<br>
                        <strong>Surgerencia:  </strong> Asegurese si el profesor imparte a otras carreras si es asi, puede omitir la advertencia.<br>
                        <strong>Carrera:</strong> ${itemsBDHorario[j].carrera} <br>
                        <strong>Horario:</strong> ${itemsBDHorario[j].tipoHorario}<br>
                        <strong>Paralelo:</strong> ${itemsBDHorario[j].paralelo}<br>
                        <strong>Semestre:</strong> ${itemsBDHorario[j].semestre} <br>
                        <strong>Ciclo:</strong> ${itemsBDHorario[j].ciclo}<br> Dia: ${diaActual}<br>
                        <strong>Hora:</strong> ${itemsBDHorario[j].itemHorasInico[k]} - ${itemsBDHorario[j].itemHorasFin[k]}<br>
                        <strong>Asignatura:</strong> ${itemsBDHorario[j].itemverifyAsignaturaNombre[k]}<br>
                        <strong>Aula:</strong> ${itemsBDHorario[j].itemverifyAulaNombre[k]}<br>
                        <strong>Profesor:</strong> ${itemsBDHorario[j].itemverifyprofesorNombre[k]}<br>
                    `;




                    } else if (itemsBDHorario[j].idAulaTableVerify[k] === itemsHorario.idAulaTableVerify[i] &&
                      itemsBDHorario[j].itemverifyAula[k] === itemsHorario.itemverifyAula[i]
                      && itemsBDHorario[j].itemverifyAulaCompartida[k] !== "Si")



                      mensaje += `
                  <strong>¡Choque de aula (Misma hora)</strong>!<br>
                  Motivo: El aula ya ha sido asignada para otra asignatura<br>
                  <strong>Carrera:</strong> ${itemsBDHorario[j].carrera} <br>
                  <strong>Horario:</strong> ${itemsBDHorario[j].tipoHorario}<br>
                  <strong>Paralelo:</strong> ${itemsBDHorario[j].paralelo}<br>
                  <strong>Semestre:</strong> ${itemsBDHorario[j].semestre} <br>
                  <strong>Ciclo:</strong> ${itemsBDHorario[j].ciclo}<br> Dia: ${diaActual}<br>
                  <strong>Hora:</strong> ${itemsBDHorario[j].itemHorasInico[k]} - ${itemsBDHorario[j].itemHorasFin[k]}<br>
                  <strong>Asignatura:</strong> ${itemsBDHorario[j].itemverifyAsignaturaNombre[k]}<br>
                  <strong>Aula:</strong> ${itemsBDHorario[j].itemverifyAulaNombre[k]}<br>
                  <strong>Profesor:</strong> ${itemsBDHorario[j].itemverifyprofesorNombre[k]}<br>
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

                    doc.save('choque_asignaturas_aulas.pdf');
                  }
                }
              });
              this.isActiveBtn = false

              this.isActiveBtnG = false
            }



            this.verificarrProfesor()
            if (datosIguales && parejas.length !== 0 && mensaje === "") {

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
              'Por favor, complete correctamente las asignaturas y las aulas. Debe haber al menos una asignatura y un aula en la casilla correspondiente.',

              'error'
            )
            this.isActiveBtn = false
          } else if (!datosIguales) {
            Swal.fire(
              'Horario no creado',
              'Por favor, asegúrese de ingresar una asignatura y un aula en la celda correspondiente.',
              'error'
            )
            this.isActiveBtn = false
          }

        } else {
          Swal.fire(
            'Operación cancelada',
            'El horario no ha sido verificado',
            'warning');
        }
      });

    }

    if (!this.verificarAsignaturasBolean && this.asignaturasFiltradas.length !== 0) {
      let swalPromise = new Promise((resolve, reject) => {
        Swal.fire({
          title: 'Advertencia',
          text: 'Faltan asignaturas por colocar',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Aceptar',
          cancelButtonText: 'Omitir'
        }).then((result) => {
          if (result.isConfirmed) {
            resolve(false);
          } else if (result.dismiss === Swal.DismissReason.cancel) {
            resolve(true);
            realizarVerificacionHorario()
          }
        });
      });

      swalPromise.then((value: any) => {
        this.verificarAsignaturasBolean = value;
      });

    } else {
      realizarVerificacionHorario()
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


  async verificarrProfesor() {
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


    let itemsBDHorario = []
    let itemsHorario = null
    let mensaje = "";


    itemsBDHorario = this.horarios.map(verify => ({
      carrera: verify.carrera,
      semestre: verify.semestre,
      ciclo: verify.ciclo,
      dia: verify.dia,
      paralelo: verify.paralelo,
      tipoHorario: verify.tipoHorario,
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

    itemsBDHorario = itemsBDHorario.filter(item => !(item.carrera === this.opcion2 && item.semestre === this.opcion3 && item.tipoHorario === this.opcion1 && item.ciclo === this.opcion4 && item.paralelo === this.opcion5));


    itemsHorario = {
      dia: this.horario.dia,
      carrera: this.horario.carrera,
      idAsignaturaTableVerify: this.horario.idTabla.map(idTabla => idTabla.idAsignatura),
      itemverifyAsignatura: this.horario.item.map(item => item.asignatura._id),
      itemverifyprofesor: this.horario.item.map(item => item.asignatura.profesor[0]._id),
      itemverifyprofesorCarrera: this.horario.item.map(item => item.asignatura.profesor[0].carrera),
      itemverifyprofesorNombre: this.horario.item.map(item => item.asignatura.profesor[0].nombre),
    };



    for (let i = 0; i < itemsHorario.dia.length; i++) {
      const diaActual = itemsHorario.dia[i];
      for (let j = 0; j < itemsBDHorario.length; j++) {
        if (itemsBDHorario[j].dia.includes(diaActual)) {

          // Iterar todos los elementos de los arrays que coinciden con el día actual
          for (let k = 0; k < itemsBDHorario[j].idAsignaturaTableVerify.length; k++) {

            if (itemsBDHorario[j].idAsignaturaTableVerify[k] === itemsHorario.idAsignaturaTableVerify[i] &&
              itemsBDHorario[j].itemverifyprofesor[k] === itemsHorario.itemverifyprofesor[i]) {



              mensaje += `
                  <strong>¡Choque de profesor (Misma hora)</strong>!<br>
                  <strong>Motivo:  </strong> El profesor ya ha sido asignado a la misma hora para impartir otra clase.<br>
                  <strong>Surgerencia:  </strong> Asegurese si el profesor imparte a otras carreras si es asi, puede omitir la advertencia.<br>
                  <strong>Carrera:</strong> ${itemsBDHorario[j].carrera} <br>
                  <strong>Horario:</strong> ${itemsBDHorario[j].tipoHorario}<br>
                  <strong>Paralelo:</strong> ${itemsBDHorario[j].paralelo}<br>
                  <strong>Semestre:</strong> ${itemsBDHorario[j].semestre} <br>
                  <strong>Ciclo:</strong> ${itemsBDHorario[j].ciclo}<br>
                  <strong>Dia:</strong> ${diaActual}<br>
                  <strong>Hora:</strong> ${itemsBDHorario[j].itemHorasInico[k]} - ${itemsBDHorario[j].itemHorasFin[k]}<br>
                  <strong>Asignatura:</strong> ${itemsBDHorario[j].itemverifyAsignaturaNombre[k]}<br>
                  <strong>Aula:</strong> ${itemsBDHorario[j].itemverifyAulaNombre[k]}<br>
                  <strong>Profesor:</strong> ${itemsBDHorario[j].itemverifyprofesorNombre[k]}<br>
              `;
            }


          }
        }


      }
    }


    if (!this.verificarProfesorBolean && mensaje !== "") {
      let swalPromise = new Promise((resolve, reject) => {
        Swal.fire({
          title: 'Advertencia',
          html: `<div style="height: 250px; overflow-y: auto">${mensaje}</div>`,
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Aceptar',
          cancelButtonText: 'Quitar Advertencia'
        }).then((result) => {
          if (result.isConfirmed) {
            resolve(false);
          } else if (result.dismiss === Swal.DismissReason.cancel) {
            Swal.fire({
              title: '¿Estás seguro?',
              html: 'Una vez que acepte, la advertencia no volverá a aparecer a menos que actualice la página',
              icon: 'warning',
              showCancelButton: true,
              confirmButtonText: 'Cancelar',
              cancelButtonText: 'Aceptar'
            }).then((result) => {
              if (result.isConfirmed) {
                resolve(false);
              } else if (result.dismiss === Swal.DismissReason.cancel) {
                resolve(true);
              }
            });
          }
        });
      });

      swalPromise.then((value: any) => {
        this.verificarProfesorBolean = value;


      });
    }

  }




}

