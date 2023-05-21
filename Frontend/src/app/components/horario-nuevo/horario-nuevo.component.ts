
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


@Component({
  selector: 'app-horario-nuevo',
  templateUrl: './horario-nuevo.component.html',
  styleUrls: ['./horario-nuevo.component.css']
})
export class HorarioNuevoComponent {

  @Input() asignaturas!: Asignatura[]
  public profesores: any[] = [];
  public aulas!: Aula[];
  public indiceHora!: string
  public listaA: any[] = []
  public is_Diurno!: Boolean
  public opcion1: string = "";
  public opcion2: string = "";
  public opcion3: string = "";
  public status!: string;
  public horario!: Horario
  public horarios: Horario[] = []
  public asignaturaHorario: Asignatura[] = []
  public aulaHorario: Aula[] = []
  public existHorarioCarrera: boolean;
  public isActiveBtn = false
  public isActiveBtnG = false
  public isActiveBtnV = true

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _asignaturaService: AsignaturaService,
    private _aulasService: AulaService,
    private _horarioService: HorarioService,
    private dialog: MatDialog
  ) {
    this.horario = new Horario('', '', '', '', [], [], [], [])
    this.existHorarioCarrera = false
    this.getHorarios()
  }

  hours = [
    '07:00 - 08:00',
    '08:00 - 09:00',
    '09:00 - 10:00',
    '10:00 - 11:00',
    '11:00 - 12:00',
    '12:00 - 13:00',
    '13:00 - 14:00',
    '14:00 - 15:00',];

  hoursnight = [
    '08:00 - 09:00',
    '09:00 - 10:00',
    '10:00 - 11:00',
    '11:00 - 12:00',
    '12:00 - 13:00',
    '17:50 - 18:50',
    '18:50 - 19:50',
    '19:50 - 20:50',
    '20:50 - 21:50'
  ]

  monday: any[] = [];
  tuesday: any[] = [];
  wednesday: any[] = [];
  thursday: any[] = [];
  friday: any[] = [];
  saturday: any[] = [];

  terminoBusquedaAsignatura: string = '';
  terminoBusquedaAula: string = '';
  asignaturasFiltradas: any[] = [];

  aulasFiltradas: any[] = [];

  async ngOnInit() {

    this.getHorarios()
    this.getAsignaturas()
    this.getAulas()

  }



  filtrarAsignaturas() {
    this.asignaturasFiltradas = this.asignaturas.filter(asignatura => asignatura.nombre.toLowerCase().includes(this.terminoBusquedaAsignatura.toLowerCase()));

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
      this.opcion2 = this.opcion2.replace('_', " ");
      this.opcion2 = this.opcion2.replace('_', " ");
      this.opcion1 = this.opcion1.replace('_', " ");
      console.log(this.opcion1)
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
            response.asignaturas.forEach((asignatura: { creditos: number; _id: string; nombre: string; carrera: String[]; semestre: String[]; profesor: Profesor[]; horario: string; abreviatura: string; color: string; }) => {
              const creditos = asignatura.creditos; // Obtener la cantidad de créditos de la asignatura

              // Clonar la asignatura por la cantidad de créditos y guardarlas en el array this.asignaturas
              for (let i = 0; i < creditos; i++) {
                const asignaturaClonada = new Asignatura(
                  asignatura._id,
                  asignatura.nombre,
                  asignatura.carrera,
                  asignatura.semestre,
                  asignatura.profesor,
                  asignatura.horario,
                  asignatura.creditos,
                  asignatura.abreviatura,
                  asignatura.color
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

            this.asignaturas = this.asignaturas.filter(asignatura => asignatura.horario === tipoHorarioAsig)
            this.asignaturasFiltradas = this.asignaturas;
          }
        },
        error => {
          console.log(error)
        }
      )
    })
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
      const daysOfWeek = ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado'];
      const item: any = event.previousContainer.data[event.previousIndex];
      const idParts: string[] = event.container.id.split('-');
      const day: number = Number(idParts[0]);
      const hourStart: string = idParts[1];
      const hourEnd: string = idParts[2];
      const dayName = daysOfWeek[day];
      let identificador = Number(idParts[0]) + '' + '' + Number(idParts[3]);



      // listasignatura id
      const idPartsAsignatura: string[] = event.item.element.nativeElement.id.split('-');
      let elementoType: string = (idPartsAsignatura[0]);


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
      const prevIdParts: string[] = event.previousContainer.id.split('-');
      const prevDay: number = Number(prevIdParts[0]);
      let preIdentificador = Number(prevIdParts[0]) + '' + '' + Number(prevIdParts[3]);
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

      const newItem = { identificador, elementoType, dayName, hourStart, hourEnd, item: { ...item } };

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

          for (const horario of this.horarios) {
            if (horario.carrera === this.opcion2 && horario.semestre === this.opcion3 && horario.tipoHorario === this.opcion1) {
              this.existHorarioCarrera = true
              
            }
          }
          console.log(this.existHorarioCarrera)
          this.horarios = this.horarios.filter(horario => horario.tipoHorario === this.opcion1);
          console.log(this.horarios)

          if (this.existHorarioCarrera) {
            Swal.fire({
              title: 'EL Horario de ' + this.opcion2 + ' del ' + this.opcion3 + ' semestre ya existe',
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
    this.horario = new Horario('', '', '', '', [], [], [], [])
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
    console.log(this.opcion1)
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


    // Agregar el título al PDF
    doc.setFontSize(10);
    doc.text(this.opcion1 + ' de la carrera de ' + this.opcion2 + ' del semestre ' + this.opcion3, 100, 10);


    // Agregar texto al final de la página
    doc.setFontSize(8);
    doc.text('Elaborado por: ', 15, doc.internal.pageSize.height - 40);
    doc.setLineWidth(0.2);
    doc.line(15, doc.internal.pageSize.height - 25, 45, doc.internal.pageSize.height - 25);
    doc.setFontSize(8);
    doc.text('Mgs David Sosa', 15, doc.internal.pageSize.height - 20);
    doc.text('Director de carrera', 15, doc.internal.pageSize.height - 15);


    let days
    let DataAdicional = [];
    let asignaturasProfesores: any[] = [];
    let rowData: any = [];
    let hoursPDF = this.hours
    this.hours = []
    let cellSize
    DataAdicional.push(['Asignaturas', 'Profesores', 'N° Horas'])

    
    if (this.opcion1 === "Horario Nocturno") {
      cellSize = 38

      this.hours = this.hoursnight
      days = ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado'];

      rowData.push(['Horas', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sabado']);
    } else {
      cellSize = 45
      this.hours = hoursPDF
      rowData.push(['Horas', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes']);
      days = ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes'];
    }


    // Agregar las horas y los datos de cada celda
    for (let i = 0; i < this.hours.length; i++) {
      let row = [this.hours[i]];

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
                row[colIndex] += currentElement.item.nombre.replace(/(.+)/, '($1)').trim();
              } else {
                row[colIndex] += currentElement.item.nombre.trim();
              }



            }

          }

        }
      }


      rowData.push(row);
    }
    asignaturasProfesores.forEach(ap => {
      DataAdicional.push([ap.asignatura, ap.profesores, ap.horas]);
    });


    // Agregar la tabla al PDF
    autoTable(doc, {
      body: rowData,
      theme: 'grid',
      styles: {
        cellWidth: cellSize,
        minCellHeight: 5,
        fontSize: 8,
        textColor: [0, 0, 0]

      }
    });



    autoTable(doc, {
      body: DataAdicional,
      theme: 'grid',
      styles: {
        cellWidth: 80,
        fontSize: 8,
        textColor: [0, 0, 0]
      },
      margin: { top: 50, right: 50, bottom: 50, left: 30 },

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

    for (var row = 1; row <= cellSizeBorder; row++) {
      for (var col = 1; col <= cellSizeBorder + 1; col++) {
        var cell = worksheet.getCell(`${String.fromCharCode(64 + col)}${row}`);
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
    worksheet.mergeCells('A4:F4'); // Fusionar 5 celdas en la primera fila
    let titulo = worksheet.getCell(4, 1);
    titulo.value = this.opcion1 + ' de la carrera de ' + this.opcion2 + ' del semestre ' + this.opcion3;
    titulo.font = { size: 10, bold: true }; // Establecer el formato de la fuente
    titulo.alignment = { horizontal: 'center' };



    // Crear un array con los días de la semana y las horas


    let DataAdicional = [];
    let asignaturasProfesores: any[] = [];

    // Crear un array para almacenar los datos de cada fila
    let rowData: any = [];



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
    for (let i = 0; i < this.hours.length; i++) {
      let row = [this.hours[i]];

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
                row[colIndex] += '\n' + currentElement.item.nombre.replace(/(.+)/, '($1)').trim();
              } else {
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

    for (var row = 6; row <= indiceCellBorder; row++) {
      for (var col = 1; col <= indiceCell; col++) {
        var cell = worksheet.getCell(`${String.fromCharCode(64 + col)}${row}`);
        cell.border = {
          top: { style: 'thin', color: { argb: '000000' } },
          left: { style: 'thin', color: { argb: '000000' } },
          bottom: { style: 'thin', color: { argb: '000000' } },
          right: { style: 'thin', color: { argb: '000000' } }
        };

      }
    }

    worksheet.insertRow(indiceCellList, ['Asignaturas', 'Profesores', 'N° Horas']);

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

    asignaturasProfesores.forEach(ap => {
      worksheet.addRow([ap.asignatura, ap.profesores, ap.horas]).eachCell({ includeEmpty: true }, function (cell) {
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

    let nombreDirector = worksheet.getCell(28, 2);
    nombreDirector.value = 'Mgs David Sosa';
    nombreDirector.font = { size: 8 };

    let directorCarrera = worksheet.getCell(29, 2);
    directorCarrera.value = 'Director de carrera';
    directorCarrera.font = { size: 8 };


    // Agregar texto al final de la página
    let revisadoPor = worksheet.getCell(26, 4);
    revisadoPor.value = 'Revisado por: ';
    revisadoPor.font = { size: 8 };

    let nombreRevisador = worksheet.getCell(28, 4);
    nombreRevisador.value = 'Ph.D. Alicia Elizundia';
    nombreRevisador.font = { size: 8 };

    let cargoRevisador = worksheet.getCell(29, 4);
    cargoRevisador.value = 'Decana de Facultad';
    cargoRevisador.font = { size: 8 };



    // Agregar texto al final de la página
    let aprobadorPor = worksheet.getCell(26, 6);
    aprobadorPor.value = 'Aprobado por: ';
    aprobadorPor.font = { size: 8 };

    let nombreAprobador = worksheet.getCell(28, 6);
    nombreAprobador.value = 'Ph.D Luisa Taborda';
    nombreAprobador.font = { size: 8 };

    let cargoAprobador = worksheet.getCell(29, 6);
    cargoAprobador.value = 'Directora Academica';
    cargoAprobador.font = { size: 8 };

    workbook.xlsx.writeBuffer().then((buffer: ArrayBuffer) => {
      const data = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      FileSaver.saveAs(data, nombreArchivo);
    });

  }

  async verificarHorario() {



    await this.getHorarios()
    this.aulaHorario = []
    this.asignaturaHorario = []
    this.horario = new Horario('', '', '', '', [], [], [], [])
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

    if (this.asignaturasFiltradas.length === 0) {



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
              idAsignaturaTableVerify: verify.idTabla.map(idTabla => idTabla.idAsignatura),
              idAulaTableVerify: verify.idTabla.map(idTabla => idTabla.idAula),
              itemverifyAsignatura: verify.item.map(item => item.asignatura._id),
              itemverifyAsignaturaNombre: verify.item.map(item => item.asignatura.nombre),
              itemverifyAula: verify.item.map(item => item.aula._id),
              itemverifyAulaNombre: verify.item.map(item => item.aula.nombre),
              itemHorasInico: verify.horas.map(item => item.horaInicio),
              itemHorasFin: verify.horas.map(item => item.horaFin),
            }));


            itemsHorario = {
              dia: this.horario.dia,
              idAsignaturaTableVerify: this.horario.idTabla.map(idTabla => idTabla.idAsignatura),
              idAulaTableVerify: this.horario.idTabla.map(idTabla => idTabla.idAula),
              itemverifyAsignatura: this.horario.item.map(item => item.asignatura._id),
              itemverifyAula: this.horario.item.map(item => item.aula._id),
            };

            console.log(itemsBDHorario)


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
                    <strong>Horario: ${itemsBDHorario[j].carrera}  - ${itemsBDHorario[j].semestre}</strong><br>
                    Dia: ${diaActual}<br>
                    Hora: ${itemsBDHorario[j].itemHorasInico[k]} - ${itemsBDHorario[j].itemHorasFin[k]}<br>
                    Asignatura: ${itemsBDHorario[j].itemverifyAsignaturaNombre[i]}<br>
                    Aula: ${itemsBDHorario[j].itemverifyAulaNombre[i]}<br>
                `;



                    }
                  }
                }
              }
            }


            if (mensaje !== "") {
              Swal.fire({
                title: '¡Choque de asignaturas y aulas!',
                html: `<div style="height: 250px; overflow-y: auto">${mensaje}</div>`,
                icon: 'warning',
                showCancelButton: true,
                cancelButtonText: 'Cerrar',
                confirmButtonText: 'Descargar PDF',
              }).then((result) => {
                if (result.isConfirmed) {
                  if (result.isConfirmed) {
                    const doc = new jsPDF();
                    doc.setFontSize(20);
                    doc.text('¡Choque de asignaturas y aulas!', 55, 10);
                    const text = mensaje.replace(/<br>/g, '').replace(/<strong>/g, '').replace(/<\/strong>/g, '');
                    doc.text(text, 20, 40);
                    doc.save('choque_asignaturas_aulas.pdf');
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
        'Por favor, debe colocar todas las asignaturas',
        'error'
      )
    }

  }


}