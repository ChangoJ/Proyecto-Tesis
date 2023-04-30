import { Component, Input } from '@angular/core';
import Swal from 'sweetalert2';
import { Aula } from '../models/aula';
import { Asignatura } from '../models/asignatura';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { ActivatedRoute, Router } from '@angular/router';
import { AsignaturaService } from '../services/asignatura.service';
import { AulaService } from '../services/aula.service';
import { HorarioService } from '../services/horario.service';
import { MatDialog } from '@angular/material/dialog';
import { Horario } from '../models/horario';
import { Profesor } from '../models/profesor';
import { ProfesorService } from '../services/profesor.service';

@Component({
  selector: 'app-horario-edit',
  templateUrl: './horario-edit.component.html',
  styleUrls: ['./horario-edit.component.css'],
  providers: [HorarioService, AsignaturaService, AulaService, ProfesorService]
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
  
  public idHorario: string = "";
  public status!: string;
  public horario!: Horario
  public horarios: Horario[] = []
  public asignaturaHorario: Asignatura[] = []
  public aulaHorario: Aula[] = []
  public existHorarioCarrera: boolean;



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



  ngOnInit() {
    this.getAulas()
    this.getHorario()
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
    this._asignaturaService.search(this.opcion2, this.opcion3).subscribe(
      response => {

        if (response.asignaturas) {
          this.asignaturas = []; // Reiniciar el array de asignaturas

          // Iterar sobre las asignaturas obtenidas en la respuesta
          response.asignaturas.forEach((asignatura: { creditos: number; _id: string; nombre: string; carrera: String[]; semestre: String[]; profesor: Profesor[]; abreviatura: string; color: string; }) => {
            const creditos = asignatura.creditos; // Obtener la cantidad de créditos de la asignatura

            // Clonar la asignatura por la cantidad de créditos y guardarlas en el array this.asignaturas
            for (let i = 0; i < creditos; i++) {
              const asignaturaClonada = new Asignatura(
                asignatura._id,
                asignatura.nombre,
                asignatura.carrera,
                asignatura.semestre,
                asignatura.profesor,
                asignatura.creditos,
                asignatura.abreviatura,
                asignatura.color
              );

              this.asignaturas.push(asignaturaClonada);

              this.asignaturasFiltradas = this.asignaturas;
            }
          });


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
      console.log(event.container.data)

    } else {
      const daysOfWeek = ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado'];
      const item: any = event.previousContainer.data[event.previousIndex];
      const idParts: string[] = event.container.id.split('-');
      const day: number = Number(idParts[0]);
      const hourStart: string = idParts[1];
      const hourEnd: string = idParts[2];
      const dayName = daysOfWeek[day];
      let identificador = Number(idParts[0]) + '' + '' + Number(idParts[3]);


      console.log(idParts)
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

            console.log(this.monday[i].identificador)
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
          console.log(this.monday)
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



  getHorario() {
    this._route.params.subscribe(params => {
      let id = params['id'];
      this._horarioService.getHorario(id).subscribe(
        response => {
          if (response.horario) {
            this.horario = response.horario
            console.log(this.horario)

            this.getDaysHorario()

            this.getAsignaturas()
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
    this.idHorario = this.horario._id
    if (this.horario.tipoHorario === "Horario Diurno") {
      this.is_Diurno = true
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
        
        
        console.log(this.monday)
      } else if (dias[i] === "Martes") {
        this.tuesday.push(nuevoObjetoAsignatura);
        this.tuesday.push(nuevoObjetoAula);
      } else if (dias[i] === "Miercoles") {
        this.wednesday.push(nuevoObjetoAsignatura);
        this.wednesday.push(nuevoObjetoAula);
        
        console.log(this.wednesday)
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
    }
  }


  async submit() {
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

    this.horario.tipoHorario = this.opcion1
    this.horario.carrera = this.opcion2
    this.horario.semestre = this.opcion3
    this.horario._id = this.idHorario
     

    let elementoComprobarTipo: any = []
    let elementoComprobarId: any = []
    let asig: number = 0
    let aula: number = 0
    for (const dias of arreglosHorario) {
      console.log(dias)
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

      console.log(dias)



      

      for (const objeto of dias) {
        elementoComprobarTipo.push(objeto.elementoType)
        elementoComprobarId.push(objeto.identificador)

        console.log(objeto)
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
    console.log(elementoComprobarTipo)
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

    console.log(this.horario._id)
    console.log(this.horario)

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
        if (datosIguales) {
          this._horarioService.update(this.horario._id, this.horario).subscribe(
            response => {
              if (response.status == 'success' && datosIguales) {
                this.status = 'success'
                this.horario = response.horario

                Swal.fire(
                  'Horario creada',
                  'El horario se ha creado correctamente',
                  'success'
                )

                /* setTimeout(() => {
                  alert("subido" + "correctament")
                }, 1200); */
              }else{
                Swal.fire(
                  'Horario no creada',
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
            'Horario no creado',
            'Por favor, debe contener en cada celda una asignatura y una aula',
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
}
