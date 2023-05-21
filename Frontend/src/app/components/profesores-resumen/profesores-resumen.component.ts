
import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Global } from '../services/global';
import { Asignatura } from '../models/asignatura';
import { AsignaturaService } from '../services/asignatura.service';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as ExcelJS from 'exceljs';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { HorarioService } from '../services/horario.service';
import { AulaService } from '../services/aula.service';
import { ProfesorService } from '../services/profesor.service';
import { Aula } from '../models/aula';
import { Horario } from '../models/horario';
import Swal from 'sweetalert2';
import FileSaver = require('file-saver');

@Component({
  selector: 'app-profesores-resumen',
  templateUrl: './profesores-resumen.component.html',
  styleUrls: ['./profesores-resumen.component.css'],
  providers: [HorarioService, AsignaturaService, AulaService, ProfesorService]
})
export class ProfesoresResumenComponent {

  public url: string
  public asignaturas!: Asignatura[]
  public asignaturasPorProfesor!: any[]
  public asignaturasPorProfesorTiempoCompleto!: MatTableDataSource<any>;
  public asignaturasPorProfesorMedioTiempo!: MatTableDataSource<any>;
  public asignaturasPorProfesorTiempoParcial!: MatTableDataSource<any>;
  public asignaturaHorario: Asignatura[] = []
  public aulaHorario: Aula[] = []
  public horarios: Horario[] = []
  public profesores: any[] = [];
  public aulas!: Aula[];
  public idHorario: string = "";
  public status!: string;
  public horario!: Horario
  public is_Diurno!: Boolean
  public asignaturasColocadas: any[] = [];
  public monday: any[] = [];
  public tuesday: any[] = [];
  public wednesday: any[] = [];
  public thursday: any[] = [];
  public friday: any[] = [];
  public saturday: any[] = [];
  public profesorSeleccionado!: any

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
    '07:00 - 08:00',
    '08:00 - 09:00',
    '09:00 - 10:00',
    '10:00 - 11:00',
    '11:00 - 12:00',
    '12:00 - 13:00',
    '13:00 - 14:00',
    '14:00 - 15:00',
    '18:00 - 19:00',
    '19:00 - 20:00',
    '20:00 - 21:00',
    '21:00 - 22:00',
  ]
  horarioProfesor!: any[][];

  @ViewChild('paginator', { static: false }) paginator!: MatPaginator;
  @ViewChild('paginator2', { static: false }) paginator2!: MatPaginator;
  @ViewChild('paginator3', { static: false }) paginator3!: MatPaginator;

  constructor(private _asignaturaService: AsignaturaService,
    private _aulasService: AulaService,
    private _horarioService: HorarioService,
    private _profesoresService: ProfesorService,
    private _route: ActivatedRoute,
    private _router: Router) {
    this.url = Global.url
  }



  ngOnInit() {

    this.getHorarios()
    this.getProfesores()
    this.getAsignaturas()
    this.getAulas()
  }

  getProfesores() {
    this._profesoresService.getProfesores().subscribe(
      response => {
        if (response.profesores) {
          this.profesores = response.profesores;
        }
      },
      error => {
        console.log(error)
      }
    )
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

  async getHorarios() {
    this._horarioService.getHorarios().subscribe(
      response => {
        if (response.horarios) {
          this.horarios = response.horarios;
          this.getDaysHorario()
        }
      },
      error => {
        console.log(error)
      }
    )
  }

  getHorariosCarrera(carreraDeseada: string) {
    let horariosCarrera: any[] = [];
    carreraDeseada = "Software"
    for (let i = 0; i < this.horarios.length; i++) {
      let horario = this.horarios[i];

      // Verificar si la carrera del horario coincide con la carrera deseada
      if (horario.carrera === carreraDeseada) {
        let asignaturas = horario.item.filter((item: any) =>
          item.asignatura.carrera.includes(carreraDeseada)
        );

        let horarios = horario

        horariosCarrera.push(horarios);
      }
    }
    return horariosCarrera;
  }

  getDaysHorario() {


    let horariosProfesores: any;

    for (let i = 0; i < this.horarios.length; i++) {
      let horario = this.horarios[i];
      let dias = horario.dia;

      for (let i = 0; i < dias.length; i++) {
        let nuevoObjetoAsignatura = {
          dayName: '',
          elementoType: '',
          hourEnd: '',
          hourStart: '',
          identificador: '',
          semestre: '',
          carrera: '',
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
        nuevoObjetoAsignatura.hourEnd = horario.horas[i].horaFin;
        nuevoObjetoAsignatura.hourStart = horario.horas[i].horaInicio;
        nuevoObjetoAsignatura.identificador = String(horario.idTabla[i].idAsignatura);
        nuevoObjetoAsignatura.item = horario.item[i].asignatura;
        nuevoObjetoAsignatura.elementoType = 'asignatura';
        nuevoObjetoAsignatura.semestre = horario.semestre;
        nuevoObjetoAsignatura.carrera = horario.carrera;

        /* Aula */
        nuevoObjetoAula.dayName = String(dias[i]);
        nuevoObjetoAula.hourEnd = horario.horas[i].horaFin;
        nuevoObjetoAula.hourStart = horario.horas[i].horaInicio;
        nuevoObjetoAula.identificador = String(horario.idTabla[i].idAula);
        nuevoObjetoAula.item = horario.item[i].aula;
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


      }

    }






  }

  getProfesorHorarioImprimir(profesorSeleccionado: any) {
    let diasArray = [
      this.monday,
      this.tuesday,
      this.wednesday,
      this.thursday,
      this.friday,
      this.saturday
    ]

    let identAsignatura: any
    let profesorId = profesorSeleccionado;

    this.horarioProfesor = diasArray.map(dia => dia.filter(item => {
      item
      if (item.elementoType === 'asignatura' && item.item.profesor && item.item.profesor[0]._id === profesorId) {

        identAsignatura = item.identificador.substring(0, 2)
        return true; // Mantener las asignaturas filtradas
      } else if (item.elementoType === 'aula' && item.identificador.substring(0, 2) === identAsignatura) {
        return true; // Mantener las aulas con identificador igual al profesor
      } else {
        return false; // Omitir otros elementos
      }
    }));
    console.log(this.horarioProfesor)
  }

  getAsignaturas() {
    this._asignaturaService.getAsignaturas().subscribe(
      response => {
        if (response.asignaturas) {
          this.asignaturas = response.asignaturas
          this.agruparAsignaturasPorProfesor(this.asignaturas)
          this.asignaturasPorProfesorTiempoCompleto.paginator = this.paginator
          this.asignaturasPorProfesorMedioTiempo.paginator = this.paginator2
          this.asignaturasPorProfesorTiempoParcial.paginator = this.paginator2
        }
      },
      error => {
        console.log(error)
      }
    )

  }


  async getProfesorSeleccionadoRPdf() {
    console.log(this.profesorSeleccionado)
    if (this.profesorSeleccionado !== undefined) {
      if (this.profesorSeleccionado === "todos") {
        for (let profesor of this.profesores) {
          await this.getProfesorHorarioImprimir(profesor._id);
          await this.exportarProfePdf(profesor.nombre);
        }
      } else {
        this.getProfesorHorarioImprimir(this.profesorSeleccionado._id);
        this.exportarProfePdf(this.profesorSeleccionado.nombre);
      }
    } else {
      Swal.fire(
        'Generacion de Horario del Profesor Rechazado',
        'Por favor, seleccione una opcion',
        'error'
      )
    }

  }

  agruparAsignaturasPorProfesor(asignaturas: any) {

    let diasArray = [
      this.monday,
      this.tuesday,
      this.wednesday,
      this.thursday,
      this.friday,
      this.saturday
    ]

    let identAsignatura: any
    let profesoresArray = this.profesores;
    let profesorId: any = ''
    let horariosProfesores: any = []

    let asignaturasProfesores: any = [];

    this.horarioProfesor = []
    horariosProfesores = profesoresArray.map(profesor => {
      profesorId = profesor._id;
      this.horarioProfesor = diasArray.map(dia => dia.filter(item => {

        if (item.elementoType === 'asignatura' && item.item.profesor && item.item.profesor[0]._id === profesorId) {

          identAsignatura = item.identificador.substring(0, 2)
          return true; // Mantener las asignaturas filtradas
        } else if (item.elementoType === 'aula' && item.identificador.substring(0, 2) === identAsignatura) {
          return true; // Mantener las aulas con identificador igual al profesor
        } else {
          return false; // Omitir otros elementos
        }
      }));


      // Buscar el item correspondiente a esta celda
      for (let k = 0; k < this.horarioProfesor.length; k++) {
        let currentItem = this.horarioProfesor[k];

        currentItem.sort((a, b) => a.identificador.localeCompare(b.identificador));

        for (let l = 0; l < currentItem.length; l++) {

          let currentElement = currentItem[l];
          if (currentElement.elementoType === 'asignatura') {
            let currentAsignaturaId = currentElement.item._id;
            let currentAsignatura = currentElement.item.nombre;
            let currentAsignaturaH = currentElement.item.horario;
            let currentAsignaturaC = currentElement.carrera;
            let currentAsignaturaS = currentElement.semestre;
            let currentProfesoresId = currentElement.item.profesor[0]._id;
            let currentProfesores = currentElement.item.profesor[0].nombre;
            let currentProfesoresContrato = currentElement.item.profesor[0].contrato;
            let currentAsignaturaCreditos = currentElement.item.creditos;
            console.log

            if (!asignaturasProfesores.some((ap: any) => ap.asigId === currentAsignaturaId && (ap.asignatura === currentAsignatura && ap.semestre === currentAsignaturaS) && ap.profesor === currentProfesores)) {
              asignaturasProfesores.push({ profeId: currentProfesoresId, asigId: currentAsignaturaId, carrera: currentAsignaturaC, semestre: currentAsignaturaS, asignatura: currentAsignatura, horario: currentAsignaturaH, profesor: currentProfesores, profesorContrato: currentProfesoresContrato, horas: currentAsignaturaCreditos });

            }


          }


        }

      }
    })

    let asignaturasPorProfesor: any = [];
    let asignaturasPorProfesorMedioTiempo: any = []
    let asignaturasPorProfesorTiempoCompleto: any = []
    let asignaturasPorProfesorTiempoParcial: any = []
    /* 
        // Crear un objeto para almacenar las asignaturas por profesor
        let asignaturasPorProfesor2: any = [];
    // Iterar sobre cada elemento en asignaturasProfesores
    for (let i = 0; i < asignaturasProfesores.length; i++) {
      let asignatura = asignaturasProfesores[i];
      let profesorContrato = asignatura.profesorContrato;
      let profeId = asignatura.profeId;
    
      // Verificar si el profesor tiene un contrato de "Medio Tiempo"
      if (profesorContrato === "Tiempo Completo") {
        // Verificar si el ID del profesor ya existe en asignaturasPorProfesorMedioTiempo
        if (profeId in asignaturasPorProfesorTiempoCompleto) {
          // Agregar la asignatura al arreglo del profesor existente
          asignaturasPorProfesorTiempoCompleto.push(asignatura);
        } else {
          // Crear un nuevo arreglo para el profesor y agregar la asignatura
          asignaturasPorProfesorTiempoCompleto = [asignatura];
        }
      }else if(profesorContrato === "Medio Tiempo"){
        if (profeId in asignaturasPorProfesorMedioTiempo) {
          // Agregar la asignatura al arreglo del profesor existente
          asignaturasPorProfesorMedioTiempo.push(asignatura);
        } else {
          // Crear un nuevo arreglo para el profesor y agregar la asignatura
          asignaturasPorProfesorMedioTiempo = [asignatura];
        }
      }else if(profesorContrato === "Tiempo Parcial"){
        if (profeId in asignaturasPorProfesorTiempoParcial) {
          // Agregar la asignatura al arreglo del profesor existente
          asignaturasPorProfesorTiempoParcial.push(asignatura);
        } else {
          // Crear un nuevo arreglo para el profesor y agregar la asignatura
          asignaturasPorProfesorTiempoParcial = [asignatura];
        }
      }
    
    }
     */




    for (let profesor of asignaturasProfesores) {
      console.log(profesor)
      let profeId = profesor.profeId;
      let profesorNombre = profesor.profesor;
      let profesorContrato = profesor.profesorContrato;
      let profesorAsignatura = {
       asignatura: profesor.asignatura,
       horas:profesor.horas,
       horario:profesor.horario,
       carrera:profesor.carrera,
      semestre: profesor.semestre
      } 


      let asignaturasDelProfesor = asignaturasPorProfesor.find(
        (item: any) => item.profesorId === profeId
      );

      if (asignaturasDelProfesor) {
        asignaturasDelProfesor.asignaturas.push(profesorAsignatura);
      } else {
        asignaturasPorProfesor.push({
          profesorId: profeId,
          profesornombre: profesorNombre,
          profesorContrato: profesorContrato,
          asignaturas: [profesorAsignatura],
        });
      }


    }
 
    /* for (let asignatura of asignaturas) {

      for (let profesor of asignatura.profesor) {

        let profesorId = profesor._id;
        let profesorNombre = profesor.nombre;
        let profesorContrato = profesor.contrato;
        let profesorCarrera = profesor.carrera;

        let asignaturasDelProfesor = asignaturasPorProfesor.find(
          (item: any) => item.profesorId === profesorId
        );

        console.log(asignaturasDelProfesor)
        if (asignaturasDelProfesor) {
          asignaturasDelProfesor.asignaturas.push(asignatura);
        } else {
          asignaturasPorProfesor.push({
            profesorId: profesorId,
            profesornombre: profesorNombre,
            profesorContrato: profesorContrato,
            profesorCarrera: profesorCarrera,
            asignaturas: [asignatura],
          });
        }


      }

    } */



    for (let asigPro of asignaturasPorProfesor) {
      // Agrupar asignaturas por tipo de contrato
      if (asigPro.profesorContrato === 'Tiempo Completo') {
        asignaturasPorProfesorMedioTiempo.push(asigPro);
      } else if (asigPro.profesorContrato === 'Medio Tiempo') {
        asignaturasPorProfesorTiempoCompleto.push(asigPro);
      } else if (asigPro.profesorContrato === 'Tiempo Parcial') {
        asignaturasPorProfesorTiempoParcial.push(asigPro);
      }
    }

   
    this.asignaturasPorProfesorTiempoCompleto = new MatTableDataSource<any>(asignaturasPorProfesorTiempoCompleto);
    this.asignaturasPorProfesorMedioTiempo = new MatTableDataSource<any>(asignaturasPorProfesorMedioTiempo);
    this.asignaturasPorProfesorTiempoParcial = new MatTableDataSource<any>(asignaturasPorProfesorTiempoParcial);
    console.log(asignaturasPorProfesorTiempoCompleto)
  }

  getSumaHoras(asignaturas: any[]): number {
    let sumaHoras = 0;
    for (let asignatura of asignaturas) {
      sumaHoras += parseInt(asignatura.horas);
    }
    return sumaHoras;
  }


  async getProfesorSeleccionadoRExcel() {
    console.log(this.profesorSeleccionado)
    if (this.profesorSeleccionado !== undefined) {
      if (this.profesorSeleccionado === "todos") {
        for (let profesor of this.profesores) {
          await this.getProfesorHorarioImprimir(profesor._id);
          await this.exportarProfeExcel(profesor.nombre);
        }
      } else {
        this.getProfesorHorarioImprimir(this.profesorSeleccionado._id);
        this.exportarProfeExcel(this.profesorSeleccionado.nombre);
      }
    } else {
      Swal.fire(
        'Generacion de Horario del Profesor Rechazado',
        'Por favor, seleccione una opcion',
        'error'
      )
    }

  }


  exportarProfePdf(profesor?: any) {

    console.log(this.horarioProfesor)
    // Crear una instancia de jsPDF
    let doc = new jsPDF('landscape', 'mm', 'a4');

    // Agregar el título al PDF
    doc.setFontSize(10);
    // Agregar el título al PDF
    doc.setFontSize(10);
    doc.text("Horario del profesor: " + profesor, 100, 10);


    let days
    let DataAdicional = [];
    let asignaturasProfesores: any[] = [];
    let rowData: any = [];
    let hoursPDF = this.hours
    this.hours = []
    let cellSize
    DataAdicional.push(['Asignaturas', 'N° Horas'])

    cellSize = 38

    this.hours = this.hoursnight
    days = ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado'];

    rowData.push(['Horas', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sabado']);


    // Agregar las horas y los datos de cada celda
    for (let i = 0; i < this.hours.length; i++) {
      let row = [this.hours[i]];

      // Iterar sobre los arreglos correspondientes a cada día de la semana
      for (let j = 0; j < days.length; j++) {

        // Buscar el item correspondiente a esta celda
        for (let k = 0; k < this.horarioProfesor.length; k++) {
          let currentItem = this.horarioProfesor[k];

          currentItem.sort((a, b) => a.identificador.localeCompare(b.identificador));

          for (let l = 0; l < currentItem.length; l++) {

            let currentElement = currentItem[l];
            if (currentElement.elementoType === 'asignatura') {
              let currentAsignaturaId = currentElement.item._id;
              let currentAsignatura = currentElement.item.nombre;
              let currentAsignaturaH = currentElement.item.horario;
              let currentAsignaturaC = currentElement.carrera;
              let currentAsignaturaS = currentElement.semestre;
              let currentProfesores = currentElement.item.profesor[0].nombre;
              let currentAsignaturaCreditos = currentElement.item.creditos;

              if (!asignaturasProfesores.some(ap => ap.asigId === currentAsignaturaId && (ap.asignatura === currentAsignatura && ap.semestre === currentAsignaturaS) && ap.profesores === currentProfesores)) {
                asignaturasProfesores.push({ asigId: currentAsignaturaId, carrera: currentAsignaturaC, semestre: currentAsignaturaS, asignatura: currentAsignatura, horario: currentAsignaturaH, profesores: currentProfesores, horas: currentAsignaturaCreditos });

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
                row[colIndex] += '\n' + '(' + currentElement.item.nombre + ' - ' + currentElement.item.ubicacion.trim() + ') ';

              } else {
                row[colIndex] += currentElement.item.nombre.trim();
                row[colIndex] += " ( " + currentElement.semestre + ' - ' + currentElement.carrera + ' - ' + currentElement.item.horario + " )"
              }



            }
            // Encontrar la posición exacta de la celda correspondiente

          }

        }
      }


      rowData.push(row);
    }
    let totalHoras = 0;

    asignaturasProfesores.forEach(ap => {
      DataAdicional.push([ap.asignatura + ' ( ' + ap.semestre + ' - ' + ap.carrera + ' ) ' + '( ' + ap.horario + ' )', ap.horas]);
      totalHoras += parseInt(ap.horas);
    });

    DataAdicional.push(['Total de horas', totalHoras]);



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

    // Agregar una nueva página al PDF
    doc.addPage();

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
    doc.save('Horario ' + profesor + '.pdf');
  }

  exportarProfeExcel(profesor?: any) {
    // Crear una instancia de ExcelJS Workbook
    let workbook = new ExcelJS.Workbook();
    let worksheet = workbook.addWorksheet(profesor);

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
    days = ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado'];
    indiceCell = 7
    indiceCellBorder = 19
    indiceCellList = 21
    cellSize = 19
    cellSizeBorder = 6


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
    texto2.value = 'MATRIZ HORARIO DEL PROFESOR'; // Establecer el valor de la celda
    texto2.font = { size: 10, bold: true }; // Establecer el formato de la fuente
    texto2.alignment = { horizontal: 'center' };

    // Agregar el título al Excel
    worksheet.mergeCells('A4:F4'); // Fusionar 5 celdas en la primera fila
    let titulo = worksheet.getCell(4, 1);

    titulo.value = 'Profesor: ' + profesor; // Establecer el valor de la celda
    titulo.font = { size: 10, bold: true }; // Establecer el formato de la fuente
    titulo.alignment = { horizontal: 'center' };


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
    this.hours = this.hoursnight

    for (let i = 0; i < this.hours.length; i++) {
      let row = [this.hours[i]];

      // Iterar sobre los arreglos correspondientes a cada día de la semana
      for (let j = 0; j < days.length; j++) {


        // Buscar el item correspondiente a esta celda
        for (let k = 0; k < this.horarioProfesor.length; k++) {
          let currentItem = this.horarioProfesor[k];

          currentItem.sort((a, b) => a.identificador.localeCompare(b.identificador));

          for (let l = 0; l < currentItem.length; l++) {

            let currentElement = currentItem[l];

            if (currentElement.elementoType === 'asignatura') {
              let currentAsignaturaId = currentElement.item._id;
              let currentAsignatura = currentElement.item.nombre;
              let currentAsignaturaH = currentElement.item.horario;
              let currentAsignaturaC = currentElement.carrera;
              let currentAsignaturaS = currentElement.semestre;
              let currentProfesores = currentElement.item.profesor[0].nombre;
              let currentAsignaturaCreditos = currentElement.item.creditos;


              if (!asignaturasProfesores.some(ap => ap.asigId === currentAsignaturaId && (ap.asignatura === currentAsignatura && ap.semestre === currentAsignaturaS) && ap.profesores === currentProfesores)) {
                asignaturasProfesores.push({ asigId: currentAsignaturaId, carrera: currentAsignaturaC, semestre: currentAsignaturaS, asignatura: currentAsignatura, horario: currentAsignaturaH, profesores: currentProfesores, horas: currentAsignaturaCreditos });

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
                row[colIndex] += '\n' + '(' + currentElement.item.nombre + ' - ' + currentElement.item.ubicacion.trim() + ') ';

              } else {
                row[colIndex] += currentElement.item.nombre.trim();
                row[colIndex] += " ( " + currentElement.semestre + ' - ' + currentElement.carrera + ' - ' + currentElement.item.horario + " )"
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
      rowTablaHorarioItem.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true }; // Opcional: alinear el contenido
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

    worksheet.insertRow(indiceCellList, ['Asignaturas', 'N° Horas',]);

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



    let totalHoras = 0;
    asignaturasProfesores.forEach(ap => {
      worksheet.addRow([ap.asignatura + ' ( ' + ap.semestre + ' - ' + ap.carrera + ' ) ' + '( ' + ap.horario + ' )', ap.horas]).eachCell({ includeEmpty: true }, function (cell) {

        cell.font = { size: 8 };
        cell.border = {
          top: { style: 'thin', color: { argb: '000000' } },
          left: { style: 'thin', color: { argb: '000000' } },
          bottom: { style: 'thin', color: { argb: '000000' } },
          right: { style: 'thin', color: { argb: '000000' } }
        };
      })

      totalHoras += parseInt(ap.horas);
      indiceCellList++
    });
    worksheet.insertRow(indiceCellList + 1, ['Total de horas', totalHoras]).eachCell({ includeEmpty: true }, function (cell) {
      cell.font = { size: 8 };
      cell.border = {
        top: { style: 'thin', color: { argb: '000000' } },
        left: { style: 'thin', color: { argb: '000000' } },
        bottom: { style: 'thin', color: { argb: '000000' } },
        right: { style: 'thin', color: { argb: '000000' } }
      };
    });

    for (let i = 0; i <= indiceCellList + 1; i++) {
      const rowTablaHorarioItem = worksheet.getRow(i);
      rowTablaHorarioItem.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true }; // Opcional: alinear el contenido
      rowTablaHorarioItem.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true }; // Activar el ajuste de texto
    }

    let nombreArchivo = 'Horario ' + profesor + '.xlsx';





    workbook.xlsx.writeBuffer().then((buffer: ArrayBuffer) => {
      const data = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      FileSaver.saveAs(data, nombreArchivo);
    });
  }

  exportarPDF() {

    // Crear una instancia de jsPDF
    let doc = new jsPDF('landscape', 'mm', 'a4');

    // Agregar el título al PDF
    doc.setFontSize(10);
    doc.text("Resumen de Profesores", 130, 10);
    let rowDataHead: any = [];
    let rowDataHead2: any = [];
    let rowDataHead3: any = [];
    let rowData: any = [];
    let rowData2: any = [];
    let rowData3: any = [];
    rowDataHead.push([{ title: "Profesores Tiempo Completo", colSpan: 6, styles: { halign: 'center', fillColor: '#00AFF0' } }])
    rowDataHead2.push([{ title: "Profesores Medio Tiempo", colSpan: 6, styles: { halign: 'center', fillColor: '#00AFF0' } }])
    rowDataHead3.push([{ title: "Profesores Tiempo Parcial", colSpan: 6, styles: { halign: 'center', fillColor: '#00AFF0' } }])
    rowData.push(['Docente', 'Asignaturas', 'N° Horas', 'Total de Horas', 'Observaciones', 'Faltan']);
    rowData2.push(['Docente', 'Asignaturas', 'N° Horas', 'Total de Horas', 'Observaciones', 'Faltan']);
    rowData3.push(['Docente', 'Asignaturas', 'N° Horas', 'Total de Horas', 'Observaciones', 'Faltan']);

    for (let profesorTCompleto of this.asignaturasPorProfesorTiempoCompleto.data) {
      let row = this.asignaturasPorProfesorTiempoCompleto.data.length;
      let asignaturasPorProfesor = [];
      let sumaHoras = 0;
      let isFirstRow = true;

      for (let asig of profesorTCompleto.asignaturas) {
        sumaHoras += parseInt(asig.creditos);
      }

      for (let asignatura of profesorTCompleto.asignaturas) {
        if (isFirstRow) {
          rowData.push([profesorTCompleto.profesornombre, asignatura.nombre, asignatura.creditos, sumaHoras]);
          isFirstRow = false;
        } else {
          rowData.push(['', asignatura.nombre, asignatura.creditos, '']);
        }
      }
    }

    for (let profesorMTiempo of this.asignaturasPorProfesorMedioTiempo.data) {
      let row = this.asignaturasPorProfesorMedioTiempo.data.length;
      let asignaturasPorProfesor = [];
      let sumaHoras = 0;
      let isFirstRow = true;

      for (let asig of profesorMTiempo.asignaturas) {
        sumaHoras += parseInt(asig.creditos);
      }

      for (let asignatura of profesorMTiempo.asignaturas) {
        if (isFirstRow) {
          rowData2.push([profesorMTiempo.profesornombre, asignatura.nombre, asignatura.creditos, sumaHoras]);
          isFirstRow = false;
        } else {
          rowData2.push(['', asignatura.nombre, asignatura.creditos, '']);
        }
      }
    }

    for (let profesorTParcial of this.asignaturasPorProfesorTiempoParcial.data) {
      let row = this.asignaturasPorProfesorTiempoParcial.data.length;
      let asignaturasPorProfesor = [];
      let sumaHoras = 0;
      let isFirstRow = true;

      for (let asig of profesorTParcial.asignaturas) {
        sumaHoras += parseInt(asig.creditos);
      }

      for (let asignatura of profesorTParcial.asignaturas) {
        if (isFirstRow) {
          rowData3.push([profesorTParcial.profesornombre, asignatura.nombre, asignatura.creditos, sumaHoras]);
          isFirstRow = false;
        } else {
          rowData3.push(['', asignatura.nombre, asignatura.creditos, '']);
        }
      }
    }

    // Agregar la tabla al PDF
    autoTable(doc, {
      head: rowDataHead,
      body: rowData,
      theme: 'grid',
      styles: {
        cellWidth: 45,
        minCellHeight: 5,
        fontSize: 8,
        textColor: [0, 0, 0]

      }
    });

    // Agregar la tabla al PDF
    autoTable(doc, {
      head: rowDataHead2,
      body: rowData2,
      theme: 'grid',
      styles: {
        cellWidth: 45,
        minCellHeight: 5,
        fontSize: 8,
        textColor: [0, 0, 0]

      }
    });

    // Agregar la tabla al PDF
    autoTable(doc, {
      head: rowDataHead3,
      body: rowData3,
      theme: 'grid',
      styles: {
        cellWidth: 45,
        minCellHeight: 5,
        fontSize: 8,
        textColor: [0, 0, 0]

      }
    });

    // Descargar el PDF
    doc.save('Resumen de Docentes' + '.pdf');

  }

  exportarExcel() {
    // Crear un nuevo libro de Excel
    let workbook = new ExcelJS.Workbook();
    let sheet = workbook.addWorksheet('Resumen de Profesores');
    // Establecer la orientación horizontal y el tamaño del papel
    sheet.pageSetup.orientation = 'landscape';
    sheet.pageSetup.paperSize = 9;
    sheet.pageSetup.fitToPage = true;

    // Agregar el título al Excel

    sheet.getCell('A1').value = 'UNIVERSIDAD IBEROAMERICANA DEL ECUADOR';
    sheet.getCell('A1').font = { size: 14, bold: true };
    sheet.getCell('A1').alignment = { horizontal: 'center' };
    sheet.mergeCells('A1:F1');

    sheet.getCell('A3').value = 'Resumen de Profesores';
    sheet.getCell('A3').font = { size: 14, bold: true };
    sheet.getCell('A3').alignment = { horizontal: 'center' };
    sheet.mergeCells('A3:F3');

    // Agregar encabezados de columna
    sheet.getCell('A5').value = 'Profesores Tiempo Completo';
    sheet.getCell('A5').font = { size: 14, bold: true };
    sheet.getCell('A5').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '00AFF0' } };
    sheet.getCell('A5').alignment = { horizontal: 'center' };
    sheet.mergeCells('A5:F5');
    sheet.getRow(6).values = ['Docente', 'Asignaturas', 'N° Horas', 'Total de Horas', 'Observaciones', 'Faltan'];
    sheet.getRow(6).font = { bold: true };
    sheet.getRow(6).alignment = { horizontal: 'center' };

    let rowIndex = 7;

    for (let profesorTCompleto of this.asignaturasPorProfesorTiempoCompleto.data) {
      let sumaHoras = 0;

      for (let asig of profesorTCompleto.asignaturas) {
        sumaHoras += parseInt(asig.creditos);
      }

      let asignaturasCount = profesorTCompleto.asignaturas.length;
      let isFirstRow = true;

      for (let i = 0; i < asignaturasCount; i++) {
        let rowIndexStart = rowIndex + i;

        if (isFirstRow) {
          sheet.getCell(`A${rowIndexStart}`).value = profesorTCompleto.profesornombre;
          sheet.getCell(`D${rowIndexStart}`).value = sumaHoras;
          isFirstRow = false;
        }

        let asignatura = profesorTCompleto.asignaturas[i];
        sheet.getCell(`B${rowIndexStart}`).value = asignatura.nombre;
        sheet.getCell(`C${rowIndexStart}`).value = asignatura.creditos;
      }

      if (asignaturasCount > 1) {
        let rowIndexEnd = rowIndex + asignaturasCount - 1;
        sheet.mergeCells('A' + rowIndex + ':A' + rowIndexEnd);
        sheet.mergeCells('D' + rowIndex + ':D' + rowIndexEnd);
      }

      rowIndex += asignaturasCount;
    }

    // Aplicar bordes oscuros a la tabla
    let startRowIndex = 5;
    let endRowIndex = rowIndex - 1;
    let startColumnIndex = 1;
    let endColumnIndex = 6;

    for (let i = startRowIndex; i <= endRowIndex; i++) {
      for (let j = startColumnIndex; j <= endColumnIndex; j++) {
        let cell = sheet.getCell(i, j);
        cell.border = {
          top: { style: 'thin', color: { argb: '000000' } },
          left: { style: 'thin', color: { argb: '000000' } },
          bottom: { style: 'thin', color: { argb: '000000' } },
          right: { style: 'thin', color: { argb: '000000' } },
        };
        cell.alignment = { wrapText: true };
        cell.alignment = cell.alignment || {};
        cell.alignment.wrapText = true;
        cell.alignment.vertical = 'middle';
        cell.alignment.horizontal = 'center';
      }
    }



    // Ajustar ancho de columna automáticamente
    sheet.columns.forEach((column) => {
      column.width = 24;
    });

    // Obtener la posición final de la primera tabla
    let primeraTablaFinal = rowIndex;

    // Iniciar la segunda tabla en la fila siguiente a la última fila de la primera tabla
    let segundaTablaInicio = primeraTablaFinal + 1; // Puedes ajustar este valor según tus necesidades

    // Agregar encabezado de la segunda tabla
    sheet.getCell(`A${segundaTablaInicio}`).value = 'Profesores Medio Tiempo';
    sheet.getCell(`A${segundaTablaInicio}`).font = { size: 14, bold: true };
    sheet.getCell(`A${segundaTablaInicio}`).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '00AFF0' } };
    sheet.getCell(`A${segundaTablaInicio}`).alignment = { horizontal: 'center' };
    sheet.mergeCells(`A${segundaTablaInicio}:F${segundaTablaInicio}`);
    sheet.getRow(segundaTablaInicio + 1).values = ['Docente', 'Asignaturas', 'N° Horas', 'Total de Horas', 'Observaciones', 'Faltan'];
    sheet.getRow(segundaTablaInicio + 1).font = { bold: true };
    sheet.getRow(segundaTablaInicio + 1).alignment = { horizontal: 'center' };


    for (let profesorMTiempo of this.asignaturasPorProfesorMedioTiempo.data) {
      let sumaHoras = 0;

      for (let asig of profesorMTiempo.asignaturas) {
        sumaHoras += parseInt(asig.creditos);
      }

      let asignaturasCount = profesorMTiempo.asignaturas.length;
      let isFirstRow = true;

      for (let i = 0; i < asignaturasCount; i++) {
        let rowIndexStart = segundaTablaInicio + 2 + i;

        if (isFirstRow) {
          sheet.getCell(`A${rowIndexStart}`).value = profesorMTiempo.profesornombre;
          sheet.getCell(`D${rowIndexStart}`).value = sumaHoras;
          isFirstRow = false;
        }

        let asignatura = profesorMTiempo.asignaturas[i];
        sheet.getCell(`B${rowIndexStart}`).value = asignatura.nombre;
        sheet.getCell(`C${rowIndexStart}`).value = asignatura.creditos;
      }

      if (asignaturasCount > 1) {
        let rowIndexEnd = (segundaTablaInicio + 2) + asignaturasCount - 1;
        sheet.mergeCells('A' + (segundaTablaInicio + 2) + ':A' + rowIndexEnd);
        sheet.mergeCells('D' + (segundaTablaInicio + 2) + ':D' + rowIndexEnd);
      }

      segundaTablaInicio += asignaturasCount;
    }


    // Aplicar bordes oscuros a la tabla
    startRowIndex = primeraTablaFinal + 1;
    endRowIndex = segundaTablaInicio + this.asignaturasPorProfesorMedioTiempo.data.length - 1;
    startColumnIndex = 1;
    endColumnIndex = 6;

    for (let i = startRowIndex; i <= endRowIndex; i++) {
      for (let j = startColumnIndex; j <= endColumnIndex; j++) {
        let cell = sheet.getCell(i, j);
        cell.border = {
          top: { style: 'thin', color: { argb: '000000' } },
          left: { style: 'thin', color: { argb: '000000' } },
          bottom: { style: 'thin', color: { argb: '000000' } },
          right: { style: 'thin', color: { argb: '000000' } },
        };
        cell.alignment = cell.alignment || {};
        cell.alignment.wrapText = true;
        cell.alignment.vertical = 'middle';
        cell.alignment.horizontal = 'center';
      }
    }

    // Obtener la posición final de la primera tabla
    let segundaTablaFinal = segundaTablaInicio;

    // Iniciar la segunda tabla en la fila siguiente a la última fila de la primera tabla
    let terceraTablaInicio = segundaTablaFinal + 3; // Puedes ajustar este valor según tus necesidades

    // Agregar encabezado de la segunda tabla
    sheet.getCell(`A${terceraTablaInicio}`).value = 'Profesores Tiempo Parcial';
    sheet.getCell(`A${terceraTablaInicio}`).font = { size: 14, bold: true };
    sheet.getCell(`A${terceraTablaInicio}`).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '00AFF0' } };
    sheet.getCell(`A${terceraTablaInicio}`).alignment = { horizontal: 'center' };
    sheet.mergeCells(`A${terceraTablaInicio}:F${terceraTablaInicio}`);
    sheet.getRow(terceraTablaInicio + 1).values = ['Docente', 'Asignaturas', 'N° Horas', 'Total de Horas', 'Observaciones', 'Faltan'];
    sheet.getRow(terceraTablaInicio + 1).font = { bold: true };
    sheet.getRow(terceraTablaInicio + 1).alignment = { horizontal: 'center' };


    for (let profesorTParcial of this.asignaturasPorProfesorTiempoParcial.data) {
      let sumaHoras = 0;

      for (let asig of profesorTParcial.asignaturas) {
        sumaHoras += parseInt(asig.creditos);
      }

      let asignaturasCount = profesorTParcial.asignaturas.length;
      let isFirstRow = true;

      for (let i = 0; i < asignaturasCount; i++) {
        let rowIndexStart = (terceraTablaInicio + 2) + i;

        if (isFirstRow) {
          sheet.getCell(`A${rowIndexStart}`).value = profesorTParcial.profesornombre;
          sheet.getCell(`D${rowIndexStart}`).value = sumaHoras;
          isFirstRow = false;
        }

        let asignatura = profesorTParcial.asignaturas[i];
        sheet.getCell(`B${rowIndexStart}`).value = asignatura.nombre;
        sheet.getCell(`C${rowIndexStart}`).value = asignatura.creditos;
      }

      if (asignaturasCount > 1) {
        let rowIndexEnd = (terceraTablaInicio + 2) + asignaturasCount - 1;
        sheet.mergeCells('A' + (terceraTablaInicio + 2) + ':A' + rowIndexEnd);
        sheet.mergeCells('D' + (terceraTablaInicio + 2) + ':D' + rowIndexEnd);
      }

      terceraTablaInicio += asignaturasCount;
    }


    // Aplicar bordes oscuros a la tabla
    startRowIndex = segundaTablaFinal + 3;
    endRowIndex = terceraTablaInicio + this.asignaturasPorProfesorMedioTiempo.data.length - 1;
    startColumnIndex = 1;
    endColumnIndex = 6;

    for (let i = startRowIndex; i <= endRowIndex; i++) {
      for (let j = startColumnIndex; j <= endColumnIndex; j++) {
        let cell = sheet.getCell(i, j);
        cell.border = {
          top: { style: 'thin', color: { argb: '000000' } },
          left: { style: 'thin', color: { argb: '000000' } },
          bottom: { style: 'thin', color: { argb: '000000' } },
          right: { style: 'thin', color: { argb: '000000' } },
        };
        cell.alignment = cell.alignment || {};
        cell.alignment.wrapText = true;
        cell.alignment.vertical = 'middle';
        cell.alignment.horizontal = 'center';
      }
    }

    // Guardar el archivo Excel
    const fileName = 'Resumen de Docentes.xlsx';
    workbook.xlsx.writeBuffer().then((data) => {
      const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      link.click();
      window.URL.revokeObjectURL(url);
    });
  }

  allProfesores() {
    this._router.navigate(['/especificacion/profesores'])
  }



  resumenProfesores() {
    this._router.navigate(['/especificacion/profesores/resumen-profesores'])

    location.reload();
  }

  redirectEdit(id: any) {
    this._router.navigate(['/especificacion/profesores/editarProfesor/', id])

  }

}
function uuidv4() {
  throw new Error('Function not implemented.');
}

