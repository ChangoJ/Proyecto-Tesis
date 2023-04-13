import { Profesor } from './../models/profesor';
import { Component, Input } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Asignatura } from '../models/asignatura';
import { AsignaturaService } from '../services/asignatura.service';
import { AulaService } from '../services/aula.service';
import { Aula } from '../models/aula';
import { ActivatedRoute, Router } from '@angular/router';
import { HorarioDialogComponent } from '../horario-dialog/horario-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { CarrerasDialogComponent } from '../carreras-dialog/carreras-dialog.component';



@Component({
  selector: 'app-horario',
  templateUrl: './horario.component.html',
  styleUrls: ['./horario.component.css'],
  providers: [AsignaturaService, AulaService]
})
export class HorarioComponent {

  @Input() asignaturas!: Asignatura[]
  public profesores: any[] = [];
  public aulas!: Aula[];
  public indiceHora!: string
  public listaA: any[] = []
  public is_Diurno!: Boolean


  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _asignaturaService: AsignaturaService,
    private _aulasService: AulaService,
    private dialog: MatDialog
  ) {

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

  ngOnInit() {

    this.getAsignaturas()
    this.getAulas()
  }


  getAulas() {
    this._route
    this._aulasService.getAulas().subscribe(
      response => {
        if (response.aulas) {
          this.aulas = response.aulas;

        }
      },
      error => {
        console.log(error)
      }
    )
  }


  getAsignaturas() {
    this._route.params.subscribe(params => {
      var opcion2 = params['opcion2'];
      var opcion1 = params['opcion1'];
      opcion2 = opcion2.replace('_', " ");
      opcion2 = opcion2.replace('_', " ");

      if (opcion1 === "Horarios_Diurnos") {
        this.is_Diurno = true
      } else {
        this.is_Diurno = false
      }

      this._asignaturaService.searchOne(opcion2).subscribe(
        response => {
          if (response.asignaturas) {
            this.asignaturas = response.asignaturas;
            console.log(this.asignaturas)

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
    if (event.container.id.startsWith('0-') ||
      event.container.id.startsWith('1-') ||
      event.container.id.startsWith('2-') ||
      event.container.id.startsWith('3-') ||
      event.container.id.startsWith('4-')) {
      if (event.previousContainer === event.container) {
        moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
      } else {
        const daysOfWeek = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
        const item: any = event.previousContainer.data[event.previousIndex];
        const idParts: string[] = event.container.id.split('-');
        const day: number = Number(idParts[0]);
        const hourStart: string = idParts[1];
        const hourEnd: string = idParts[2];
        const dayName = daysOfWeek[day]; 

        // Verificar si ya hay un elemento en la celda
        let existingItem: any = null;
        switch (day) {
          case 0:
            existingItem = this.monday.find(item => item.hourStart === hourStart && item.hourEnd === hourEnd);
            break;
          case 1:
            existingItem = this.tuesday.find(item => item.hourStart === hourStart && item.hourEnd === hourEnd);
            break;
          case 2:
            existingItem = this.wednesday.find(item => item.hourStart === hourStart && item.hourEnd === hourEnd);
            break;
          case 3:
            existingItem = this.thursday.find(item => item.hourStart === hourStart && item.hourEnd === hourEnd);
            break;
          case 4:
            existingItem = this.friday.find(item => item.hourStart === hourStart && item.hourEnd === hourEnd);
            break;
          case 5:
            existingItem = this.saturday.find(item => item.hourStart === hourStart && item.hourEnd === hourEnd);
            break;
        }

        if (existingItem) {
          return;
        }

     
        //Eliminar origen del array
        const prevIdParts: string[] = event.previousContainer.id.split('-');
        const prevDay: number = Number(prevIdParts[0]);
        const prevIndex: number = event.previousIndex;


        switch (prevDay) {
          case 0:
            
          console.log( this.monday.splice(prevIndex, 1))
            this.monday.splice(prevIndex, 1);
            break;
          case 1:
            
          console.log( this.tuesday.splice(prevIndex, 1))
            this.tuesday.splice(prevIndex, 1);
            break;
          case 2:
            this.wednesday.splice(prevIndex, 1);
            break;
          case 3:
            this.thursday.splice(prevIndex, 1);
            break;
          case 4:
            this.friday.splice(prevIndex, 1);
            break;
          case 5:
            this.saturday.splice(prevIndex, 1);
            break;

        }

        const newItem = { dayName, hourStart, hourEnd, item: { ...item } };
        console.log(newItem)
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

        transferArrayItem(
          event.previousContainer.data,
          event.container.data,
          event.previousIndex,
          event.currentIndex,
        )
      }
    }


  }


}