
import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
import { Profesor } from '../models/profesor';
import { DetalleService } from '../services/detalle.service';
import { UsuarioService } from '../services/usuario.service';


@Component({
  selector: 'app-profesores-resumen',
  templateUrl: './profesores-resumen.component.html',
  styleUrls: ['./profesores-resumen.component.css'],
  providers: [HorarioService, AsignaturaService, AulaService, ProfesorService, DetalleService, UsuarioService]
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
  public profesor!: Profesor
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
  public editingProfesor: any = null;
  public carrerasFiltradas: any[] = [];
  public asignaturasFiltradas: any[] = [];
  public authToken: any;
  public userData: any;
  public rolesCarreras: any
  public hours: any
  public hoursAlternativasDiurnas: any
  public hoursAlternativasNocturnas: any
  public hoursnight: any
  public horarioProfesor!: any[][];
  public usuarios: any = [];
  public revisador: any = [];
  public aprobador: any = [];

  @ViewChild('paginator', { static: false }) paginator!: MatPaginator;
  @ViewChild('paginator2', { static: false }) paginator2!: MatPaginator;
  @ViewChild('paginator3', { static: false }) paginator3!: MatPaginator;

  constructor(private _asignaturaService: AsignaturaService,
    private _aulasService: AulaService,
    private _horarioService: HorarioService,
    private _profesoresService: ProfesorService,
    private _route: ActivatedRoute,
    private _router: Router,
    private _detalleService: DetalleService,
    private _usuarioService: UsuarioService) {
    this.url = this._detalleService.Global.url
    this.authToken = this._detalleService.authToken
    this.userData = this._detalleService.userData

  }


  ngOnInit() {
    this.getHorarios()
    this.getProfesores()
    this.getAsignaturas()
    this.getAulas()
    this.getDataDetalles()
    this.getUsuarios()
  }

  getDataDetalles() {
    this._detalleService.getRolesCarrera().subscribe(roles => {
      this.rolesCarreras = roles
    });
    this._detalleService.getHorasDiurnas().subscribe(horasDiurnas => {

      this.hours = horasDiurnas
    });

    this._detalleService.getHorasNocturnas().subscribe(horasNocturnas => {
      this.hoursnight = horasNocturnas
    });
    this._detalleService.getHorasAlternativaDiurnas().subscribe(horasAlternativasDiurnas => {

      this.hoursAlternativasDiurnas = horasAlternativasDiurnas
    });
    this._detalleService.getHorasAlternativaNocturnas().subscribe(horasAlternativasNocturnas => {

      this.hoursAlternativasNocturnas = horasAlternativasNocturnas
    });
  }

  getProfesores() {
    this._profesoresService.getProfesores().subscribe(
      response => {
        if (response.profesores) {
          this.profesores = response.profesores;
          let carreraActual = this.rolesCarreras[this.userData.rol.toLowerCase().replace(/\s/g, "")];

          this.carrerasFiltradas = [];

          if (carreraActual) {
            this.carrerasFiltradas = this.profesores.filter(elemento => elemento.carrera.includes(carreraActual));
          } else {
            this.carrerasFiltradas = this.profesores;
          }
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


  getProfesor(id: any) {

    return new Promise<void>((resolve, reject) => {
      this._profesoresService.getProfesor(id).subscribe(
        response => {
          if (response.profesor) {

            this.profesor = response.profesor
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

  startEditing(profesor: any): void {
    this.editingProfesor = profesor;

  }


  async saveObservation(profesor: any) {

    await this.getProfesor(profesor.profesorId)
    this.profesor.observacion = profesor.profesorObservacion

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
        this._profesoresService.update(profesor.profesorId, this.profesor).subscribe(
          response => {
            if (response.status == 'success') {
              this.status = 'success';
              this.profesor = response.profesor;

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

              this.status = 'error';
              setTimeout(() => {
                location.reload();
              }, 1200);
            }
          },
          error => {
            this.status = 'error';
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

    this.editingProfesor = null;
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
        let nuevoObjetoAsignatura: any = {
          dayName: '',
          elementoType: '',
          hourEnd: '',
          hourStart: '',
          identificador: '',
          semestre: '',
          ciclo: '',
          carrera: '',
          item: {}
        };

        let nuevoObjetoAula: any = {
          dayName: '',
          elementoType: '',
          hourEnd: '',
          hourStart: '',
          identificador: '',
          semestre: '',
          carrera: '',
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
        nuevoObjetoAsignatura.ciclo = horario.ciclo;

        /* Aula */
        nuevoObjetoAula.dayName = String(dias[i]);
        nuevoObjetoAula.hourEnd = horario.horas[i].horaFin;
        nuevoObjetoAula.hourStart = horario.horas[i].horaInicio;
        nuevoObjetoAula.identificador = String(horario.idTabla[i].idAula);
        nuevoObjetoAula.item = horario.item[i].aula;
        nuevoObjetoAula.elementoType = 'aula';
        nuevoObjetoAula.semestre = horario.semestre;
        nuevoObjetoAula.ciclo = horario.ciclo;



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
  }

  getAsignaturas() {
    this._asignaturaService.getAsignaturas().subscribe(
      response => {
        if (response.asignaturas) {
          this.asignaturas = response.asignaturas
          let carreraActual = this.rolesCarreras[this.userData.rol.toLowerCase()];

          this.asignaturasFiltradas = [];

          if (carreraActual) {
            this.asignaturasFiltradas = this.asignaturas.filter(elemento => elemento.carrera.includes(carreraActual));
          } else {
            this.asignaturasFiltradas = this.asignaturas;
          }
          this.agruparAsignaturasPorProfesor(this.asignaturasFiltradas)
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
    if (this.profesorSeleccionado !== undefined) {
      if (this.profesorSeleccionado === "todos") {
        for (let profesor of this.carrerasFiltradas) {
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
        'Por favor, seleccione una opcion.',
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
    let semestreAsignatura: any
    let cicloAsignatura: any
    let profesoresArray = this.carrerasFiltradas;
    let profesorId: any = ''
    let horariosProfesores: any = []

    let asignaturasProfesores: any = [];

    this.horarioProfesor = []



    horariosProfesores = profesoresArray.map(profesor => {
      profesorId = profesor._id;
      this.horarioProfesor = diasArray.map(dia => dia.filter(item => {
        if (!item.ciclo) {

          item.ciclo = ""

          cicloAsignatura = item.ciclo
        }

        if (item.elementoType === 'asignatura' && item.item.profesor && item.item.profesor[0]._id === profesorId) {

          identAsignatura = item.identificador.substring(0, 2)
          semestreAsignatura = item.semestre
          if (!item.ciclo) {

            item.ciclo = ""

            cicloAsignatura = item.ciclo
          } else {

            cicloAsignatura = item.ciclo
          }
          return true; // Mantener las asignaturas filtradas
        } else if (item.elementoType === 'aula' && item.identificador.substring(0, 2) === identAsignatura && item.semestre === semestreAsignatura && item.ciclo === cicloAsignatura) {


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
            let currentAsignaturaCiclo = currentElement.ciclo;
            let currentProfesoresId = currentElement.item.profesor[0]._id;
            let currentProfesores = currentElement.item.profesor[0].nombre;
            let currentProfesoresContrato = currentElement.item.profesor[0].contrato;
            let currentProfesoresObservacion = currentElement.item.profesor[0].observacion;
            let currentAsignaturaCreditos = currentElement.item.creditos;


            if (!asignaturasProfesores.some((ap: any) => ap.asigId === currentAsignaturaId && (ap.asignatura === currentAsignatura && ap.semestre === currentAsignaturaS && ap.ciclo === currentAsignaturaCiclo) && ap.profesor === currentProfesores)) {


              asignaturasProfesores.push({ profeId: currentProfesoresId, asigId: currentAsignaturaId, carrera: currentAsignaturaC, semestre: currentAsignaturaS, ciclo: currentAsignaturaCiclo, asignatura: currentAsignatura, horario: currentAsignaturaH, profesor: currentProfesores, profesorContrato: currentProfesoresContrato, horas: currentAsignaturaCreditos, profesorObservacion: currentProfesoresObservacion });

            }


          }


        }

      }
    })

    let asignaturasPorProfesor: any = [];
    let asignaturasPorProfesorMedioTiempo: any = []
    let asignaturasPorProfesorTiempoCompleto: any = []
    let asignaturasPorProfesorTiempoParcial: any = []


    for (let profesor of asignaturasProfesores) {

      let profeId = profesor.profeId;
      let profesorNombre = profesor.profesor;
      let profesorContrato = profesor.profesorContrato;
      let profesorObservacion = profesor.profesorObservacion;
      let profesorAsignatura = {
        asignatura: profesor.asignatura,
        horas: profesor.horas,
        horario: profesor.horario,
        carrera: profesor.carrera,
        semestre: profesor.semestre,
        ciclo: profesor.ciclo
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
          profesorObservacion: profesorObservacion
        });
      }


    }

    for (let asigPro of asignaturasPorProfesor) {
      // Agrupar asignaturas por tipo de contrato
      if (asigPro.profesorContrato === 'Tiempo Completo') {
        asignaturasPorProfesorTiempoCompleto.push(asigPro);
      } else if (asigPro.profesorContrato === 'Medio Tiempo') {
        asignaturasPorProfesorMedioTiempo.push(asigPro);
      } else if (asigPro.profesorContrato === 'Tiempo Parcial') {
        asignaturasPorProfesorTiempoParcial.push(asigPro);
      }
    }



    this.asignaturasPorProfesorTiempoCompleto = new MatTableDataSource<any>(asignaturasPorProfesorTiempoCompleto);
    this.asignaturasPorProfesorMedioTiempo = new MatTableDataSource<any>(asignaturasPorProfesorMedioTiempo);
    this.asignaturasPorProfesorTiempoParcial = new MatTableDataSource<any>(asignaturasPorProfesorTiempoParcial);


  }

  getSumaHoras(asignaturas: any[]): number {
    let sumaHoras = 0;
    for (let asignatura of asignaturas) {
      sumaHoras += parseInt(asignatura.horas);
    }
    return sumaHoras;
  }


  async getProfesorSeleccionadoRExcel() {
    if (this.profesorSeleccionado !== undefined) {
      if (this.profesorSeleccionado === "todos") {
        for (let profesor of this.carrerasFiltradas) {
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
    // Crear una instancia de jsPDF
    let doc = new jsPDF('landscape', 'mm', 'a4');


    var pageWidth = doc.internal.pageSize.width;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');

    var titleText = "UNIVERSIDAD IBEROAMERICANA DEL ECUADOR";
    var titleWidth = doc.getTextWidth(titleText);

    var titleX = (pageWidth - titleWidth) / 2;

    doc.text(titleText, titleX, 10);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');

    var descriptionText = "MATRIZ DEL HORARIO DEL PROFESOR";
    var descriptionWidth = doc.getTextWidth(descriptionText);

    var descriptionX = (pageWidth - descriptionWidth) / 2;

    doc.text(descriptionText, descriptionX, 15);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');

    var professorText = "Profesor: " + profesor;
    var professorInfoWidth = doc.getTextWidth(professorText);

    var professorInfoX = (pageWidth - professorInfoWidth) / 2;

    doc.text(professorText, professorInfoX, 20);


    let days
    let DataAdicional = [];
    let asignaturasProfesores: any[] = [];

    let asignaturasProfesoresNocturnoCicloUno: any[] = [];
    let asignaturasProfesoresNocturnoCicloDos: any[] = [];
    let asignaturasProfesoresDiurno: any[] = [];
    let rowDataHead: any = [];
    let rowDataHead2: any = [];
    let rowDataHead3: any = [];
    let rowDataHead4: any = [];
    let rowData: any = [];
    let rowDataC1: any = [];
    let rowDataC2: any = [];
    let hoursPDFDiurno = []
    let hoursPDFNocturno = []
    let hoursPDFNocturnoCombinado:any = []
    let hoursPDFDiurnoCombinado:any = []
    hoursPDFDiurno = this.hours
    hoursPDFNocturno = this.hoursnight

    let horastemporalesDirunas = hoursPDFDiurno.concat(this.hoursAlternativasDiurnas)
    horastemporalesDirunas.filter((hora: any, index: any) => horastemporalesDirunas.indexOf(hora) === index)
    .forEach((hora: any) => {
      hoursPDFDiurnoCombinado.push(hora)
    });

    hoursPDFDiurnoCombinado.sort()

    let horastemporalesNocturnas = hoursPDFNocturno.concat(this.hoursAlternativasNocturnas)
    horastemporalesNocturnas.filter((hora: any, index: any) => horastemporalesNocturnas.indexOf(hora) === index)
    .forEach((hora: any) => {
      hoursPDFNocturnoCombinado.push(hora)
    });

    hoursPDFNocturnoCombinado.sort()


   /*  if (this.profesorSeleccionado.carrera[0] === "Ingles" && this.profesorSeleccionado.carrera.length <= 1) {

      hoursPDFDiurno = this.hoursAlternativasDiurnas
      hoursPDFNocturno = this.hoursAlternativasNocturnas
    } */
    let cellSize: any = ""
    rowDataHead4.push([{ title: 'Asignaturas', styles: { halign: 'center', fillColor: '#00AFF0' } },
    { title: 'N° Horas', styles: { halign: 'center', fillColor: '#00AFF0' } },
    { title: 'Modalidad', styles: { halign: 'center', fillColor: '#00AFF0' } }])

    cellSize = 38

    days = ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado'];
    rowDataHead.push([{ title: "Horario Diurno", colSpan: 6, styles: { halign: 'center', fillColor: '#00AFF0' } }])
    rowDataHead2.push([{ title: "Horario Nocturno Ciclo 1", colSpan: 7, styles: { halign: 'center', fillColor: '#00AFF0' } }])
    rowDataHead3.push([{ title: "Horario Nocturno Ciclo 2", colSpan: 7, styles: { halign: 'center', fillColor: '#00AFF0' } }])
    rowData.push(['Horas', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes']);
    rowDataC1.push(['Horas', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sabado']);
    rowDataC2.push(['Horas', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sabado']);

    let identAsignatura: any = ""
    let semestreAsignatura: any = ""
    let cicloAsignatura: any = ""
    asignaturasProfesoresDiurno = this.horarioProfesor.map(item => item.filter(item => {
      if (!item.ciclo) {

        item.ciclo = ""

        cicloAsignatura = item.ciclo
      }

      if (item.elementoType === 'asignatura' && item.item.horario === 'Diurno' && item.item.profesor) {
        if (!item.ciclo) {

          item.ciclo = ""

          cicloAsignatura = item.ciclo
        } else {

          cicloAsignatura = item.ciclo
        }
        identAsignatura = item.identificador.substring(0, 2)
        semestreAsignatura = item.semestre
        return true; // Mantener las asignaturas filtradas
      } else if (item.elementoType === 'aula' && item.identificador.substring(0, 2) === identAsignatura && item.semestre === semestreAsignatura) {
        return true;
      } else {
        return false;
      }

    }))


    identAsignatura = ""
    semestreAsignatura = ""
    identAsignatura = ""
    cicloAsignatura = ""
    asignaturasProfesoresNocturnoCicloUno = this.horarioProfesor.map(item => item.filter(item => {
      if (!item.ciclo) {

        item.ciclo = ""

        cicloAsignatura = item.ciclo
      }

      if (item.elementoType === 'asignatura' && item.item.horario === 'Nocturno' && item.item.ciclo[0] === "1" && item.item.profesor) {
        if (!item.ciclo) {

          item.ciclo = ""

          cicloAsignatura = item.ciclo
        } else {

          cicloAsignatura = item.ciclo
        }
        identAsignatura = item.identificador.substring(0, 2)
        semestreAsignatura = item.semestre
        cicloAsignatura = item.ciclo
        return true; // Mantener las asignaturas filtradas
      } else if (item.elementoType === 'aula' && item.identificador.substring(0, 2) === identAsignatura && item.semestre === semestreAsignatura && item.ciclo === cicloAsignatura) {
        return true;
      } else {
        return false;
      }

    }))
    identAsignatura = ""
    semestreAsignatura = ""
    cicloAsignatura = ""
    asignaturasProfesoresNocturnoCicloDos = this.horarioProfesor.map(item => item.filter(item => {
      if (!item.ciclo) {

        item.ciclo = ""

        cicloAsignatura = item.ciclo
      }

      if (item.elementoType === 'asignatura' && item.item.horario === 'Nocturno' && item.item.ciclo[0] === "2" && item.item.profesor) {
        if (!item.ciclo) {

          item.ciclo = ""

          cicloAsignatura = item.ciclo
        } else {

          cicloAsignatura = item.ciclo
        }
        identAsignatura = item.identificador.substring(0, 2)
        semestreAsignatura = item.semestre
        cicloAsignatura = item.ciclo

        return true; // Mantener las asignaturas filtradas
      } else if (item.elementoType === 'aula' && item.identificador.substring(0, 2) === identAsignatura && item.semestre === semestreAsignatura && item.ciclo === cicloAsignatura) {
        return true;
      } else {
        return false;
      }

    }))

    let row: any[] = []
    let agrupaciones: any = [];
    for (let i = 0; i < hoursPDFDiurnoCombinado.length; i++) {
      row = [hoursPDFDiurnoCombinado[i]];

      for (let j = 0; j < days.length; j++) {

        // Buscar el item correspondiente a esta celda
        let currentItem = []
        for (let k = 0; k < asignaturasProfesoresDiurno.length; k++) {
          currentItem = asignaturasProfesoresDiurno[k];
          currentItem.sort((a: any, b: any) => a.identificador.localeCompare(b.identificador));

          for (let l = 0; l < currentItem.length; l++) {

            let currentElement = currentItem[l];

            if (currentElement.elementoType === 'asignatura') {

              let currentAsignaturaId = currentElement.item._id;
              let currentAsignatura = currentElement.item.nombre;
              let currentAsignaturaH = currentElement.item.horario;
              let currentAsignaturaC = currentElement.carrera;
              let currentAsignaturaS = currentElement.semestre;
              let currentAsignaturaCiclo = currentElement.ciclo;
              let currentProfesores = currentElement.item.profesor[0].nombre;
              let currentAsignaturaCreditos = currentElement.item.creditos;


              if (!asignaturasProfesores.some(ap => ap.asigId === currentAsignaturaId && (ap.asignatura === currentAsignatura && ap.semestre === currentAsignaturaS && ap.ciclo === currentAsignaturaCiclo) && ap.profesores === currentProfesores)) {
                asignaturasProfesores.push({ asigId: currentAsignaturaId, carrera: currentAsignaturaC, semestre: currentAsignaturaS, ciclo: currentAsignaturaCiclo, asignatura: currentAsignatura, horario: currentAsignaturaH, profesores: currentProfesores, horas: currentAsignaturaCreditos });

              }


            }

            // Obtener la hora del elemento actual
            let elementHourStart = currentElement.hourStart;
            let elementHourEnd = currentElement.hourEnd;

            // Comprobar si las horas son iguales
            let rowIndex = i + 1; // Sumar 1 para evitar reemplazar la primera fila (encabezado)
            let colIndex = j + 1; // Sumar 1 para evitar reemplazar la primera columna (horario)

            // Insertar el valor en la celda correspondiente

            if (i === hoursPDFDiurnoCombinado.indexOf(elementHourStart + '-' + elementHourEnd) && j === (days.indexOf(currentElement.dayName))) {



              if (typeof row[colIndex] === 'undefined') {
                row[colIndex] = '';
              }
              if (currentElement.elementoType === 'aula') {
                agrupaciones.push(currentElement)

                row[colIndex] += ' \n' + (currentElement.item.nombre + ' - ' + currentElement.item.ubicacion).replace(/(.+)/, '($1)').trim();

              } else {
                agrupaciones.push(currentElement)
                row[colIndex] += currentElement.item.nombre.trim();
                if (this.profesorSeleccionado.carrera[0] === "Ingles" && this.profesorSeleccionado.carrera.length <= 1) {
                  row[colIndex] += "\n( " + currentElement.semestre + ' nivel' + ' - ' + currentElement.carrera + ' - ' + currentElement.item.horario + " )"

                } else {
                  row[colIndex] += "\n( " + currentElement.semestre + ' semestre' + ' - ' + currentElement.carrera + ' - ' + currentElement.item.horario + " )"

                }
              }



            }




          }

        }
      }



      rowData.push(row);
    }



    for (let i = 0; i < hoursPDFNocturnoCombinado.length; i++) {
      row = [hoursPDFNocturnoCombinado[i]];

      for (let j = 0; j <= days.length; j++) {


        // Buscar el item correspondiente a esta celda
        let currentItem = []
        for (let k = 0; k < asignaturasProfesoresNocturnoCicloUno.length; k++) {
          currentItem = asignaturasProfesoresNocturnoCicloUno[k];

          currentItem.sort((a: any, b: any) => a.identificador.localeCompare(b.identificador));

          for (let l = 0; l < currentItem.length; l++) {

            let currentElement = currentItem[l];


            if (currentElement.elementoType === 'asignatura') {
              let currentAsignaturaId = currentElement.item._id;
              let currentAsignatura = currentElement.item.nombre;
              let currentAsignaturaH = currentElement.item.horario;
              let currentAsignaturaC = currentElement.carrera;
              let currentAsignaturaS = currentElement.semestre;
              let currentAsignaturaCiclo = currentElement.ciclo;
              let currentProfesores = currentElement.item.profesor[0].nombre;
              let currentAsignaturaCreditos = currentElement.item.creditos;


              if (!asignaturasProfesores.some(ap => ap.asigId === currentAsignaturaId && (ap.asignatura === currentAsignatura && ap.semestre === currentAsignaturaS && ap.ciclo === currentAsignaturaCiclo) && ap.profesores === currentProfesores)) {
                asignaturasProfesores.push({ asigId: currentAsignaturaId, carrera: currentAsignaturaC, semestre: currentAsignaturaS, ciclo: currentAsignaturaCiclo, asignatura: currentAsignatura, horario: currentAsignaturaH, profesores: currentProfesores, horas: currentAsignaturaCreditos });

              }

            }

            // Obtener la hora del elemento actual
            let elementHourStart = currentElement.hourStart;
            let elementHourEnd = currentElement.hourEnd;

            // Comprobar si las horas son iguales
            let rowIndex = i + 1; // Sumar 1 para evitar reemplazar la primera fila (encabezado)
            let colIndex = j + 1; // Sumar 1 para evitar reemplazar la primera columna (horario)



            if (i === hoursPDFNocturnoCombinado.indexOf(elementHourStart + '-' + elementHourEnd) && j === (days.indexOf(currentElement.dayName))) {

              if (typeof row[colIndex] === 'undefined') {
                row[colIndex] = '';
              }
              if (currentElement.elementoType === 'aula') {
                agrupaciones.push(currentElement)
                row[colIndex] += '\n' + '(' + currentElement.item.nombre + ' - ' + currentElement.item.ubicacion.trim() + ') ';

              } else {
                agrupaciones.push(currentElement)
                row[colIndex] += currentElement.item.nombre.trim();
                if (this.profesorSeleccionado.carrera[0] === "Ingles" && this.profesorSeleccionado.carrera.length <= 1) {
                  row[colIndex] += " ( " + currentElement.semestre + ' nivel' + ' - ' + currentElement.ciclo + ' Ciclo' + ' - ' + currentElement.carrera + ' - ' + currentElement.item.horario + " )"

                } else {
                  row[colIndex] += " ( " + currentElement.semestre + ' semestre' + ' - ' + currentElement.ciclo + ' Ciclo' + ' - ' + currentElement.carrera + ' - ' + currentElement.item.horario + " )"

                }


              }


            }


          }

        }
      }


      rowDataC1.push(row);
    }

    for (let i = 0; i < hoursPDFNocturnoCombinado.length; i++) {
      row = [hoursPDFNocturnoCombinado[i]];

      for (let j = 0; j <= days.length; j++) {

        // Buscar el item correspondiente a esta celda
        let currentItem = []
        for (let k = 0; k < asignaturasProfesoresNocturnoCicloDos.length; k++) {
          currentItem = asignaturasProfesoresNocturnoCicloDos[k];
          currentItem.sort((a: any, b: any) => a.identificador.localeCompare(b.identificador));

          for (let l = 0; l < currentItem.length; l++) {

            let currentElement = currentItem[l];

            if (currentElement.elementoType === 'asignatura') {
              let currentAsignaturaId = currentElement.item._id;
              let currentAsignatura = currentElement.item.nombre;
              let currentAsignaturaH = currentElement.item.horario;
              let currentAsignaturaC = currentElement.carrera;
              let currentAsignaturaS = currentElement.semestre;
              let currentAsignaturaCiclo = currentElement.ciclo;
              let currentProfesores = currentElement.item.profesor[0].nombre;
              let currentAsignaturaCreditos = currentElement.item.creditos;


              if (!asignaturasProfesores.some(ap => ap.asigId === currentAsignaturaId && (ap.asignatura === currentAsignatura && ap.semestre === currentAsignaturaS && ap.ciclo === currentAsignaturaCiclo) && ap.profesores === currentProfesores)) {
                asignaturasProfesores.push({ asigId: currentAsignaturaId, carrera: currentAsignaturaC, semestre: currentAsignaturaS, ciclo: currentAsignaturaCiclo, asignatura: currentAsignatura, horario: currentAsignaturaH, profesores: currentProfesores, horas: currentAsignaturaCreditos });

              }

            }

            // Obtener la hora del elemento actual
            let elementHourStart = currentElement.hourStart;
            let elementHourEnd = currentElement.hourEnd;

            // Comprobar si las horas son iguales
            let rowIndex = i + 1; // Sumar 1 para evitar reemplazar la primera fila (encabezado)
            let colIndex = j + 1; // Sumar 1 para evitar reemplazar la primera columna (horario)

            // Insertar el valor en la celda correspondiente

            if (i === hoursPDFNocturnoCombinado.indexOf(elementHourStart + '-' + elementHourEnd) && j === (days.indexOf(currentElement.dayName))) {

              if (typeof row[colIndex] === 'undefined') {
                row[colIndex] = '';
              }
              if (currentElement.elementoType === 'aula') {
                agrupaciones.push(currentElement)

                row[colIndex] += ' \n' + (currentElement.item.nombre + ' - ' + currentElement.item.ubicacion).replace(/(.+)/, '($1)').trim();
              } else {
                agrupaciones.push(currentElement)
                row[colIndex] += currentElement.item.nombre.trim();
                if (this.profesorSeleccionado.carrera[0] === "Ingles" && this.profesorSeleccionado.carrera.length <= 1) {
                  row[colIndex] += " ( " + currentElement.semestre + ' nivel' + ' - ' + currentElement.ciclo + ' ciclo' + ' - ' + currentElement.carrera + ' - ' + currentElement.item.horario + " )"

                } else {
                  row[colIndex] += " ( " + currentElement.semestre + ' semestre' + ' - ' + currentElement.ciclo + ' ciclo' + ' - ' + currentElement.carrera + ' - ' + currentElement.item.horario + " )"

                }


              }


            }



          }

        }
      }

      rowDataC2.push(row);
    }


    // Crear un objeto para almacenar los resultados agrupados
    let resultadoAgrupado: any = [];

    // Recorrer el array original y agrupar las asignaturas y aulas

    let asignaturaId: string | number;

    agrupaciones.forEach((item: { elementoType: string; item: { _id: any; }; carrera: any; dayName: any; hourEnd: any; hourStart: any; identificador: any; semestre: any; ciclo: any; }) => {
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
            ciclo: item.ciclo,
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

    // Verificar la modalidad de las aulas y agregar el campo "modalidad" en resultadoFinal


    let totalHoras = 0;



    asignaturasProfesores.forEach((elemento1) => {
      elemento1.modalidad = [];

      resultadoFinal.forEach((resultado: any) => {
        if (resultado && resultado.modalidad && elemento1.asignatura === resultado.item.nombre) {
          elemento1.modalidad.push(resultado.modalidad);
        }
      });
    });

    asignaturasProfesores.forEach(ap => {
      let tipoPeriodo: any
      let tipoPeriodo2: any
      if (ap.horario === "Diurno") {
        tipoPeriodo = "Semestre"
        if (this.profesorSeleccionado.carrera[0] === "Ingles" && this.profesorSeleccionado.carrera.length <= 1) {

          tipoPeriodo = "Nivel"
        }

        DataAdicional.push([ap.asignatura + ' ( ' + ap.semestre + ' ' + tipoPeriodo + ' - ' + ap.carrera + ' ) ' + '( ' + ap.horario + ' )', ap.horas, ap.modalidad]);
        totalHoras += parseInt(ap.horas);
      } else {
        tipoPeriodo = "Semestre"
        tipoPeriodo2 = "Ciclo"
        if (this.profesorSeleccionado.carrera[0] === "Ingles" && this.profesorSeleccionado.carrera.length <= 1) {

          tipoPeriodo = "Nivel"
        }
        DataAdicional.push([ap.asignatura + ' ( ' + ap.semestre + ' ' + tipoPeriodo + ' - ' + ap.ciclo + '  ' + tipoPeriodo2 + ' - ' + ap.carrera + ' ) ' + '( ' + ap.horario + ' )', ap.horas, ap.modalidad]);
        totalHoras += parseInt(ap.horas);
      }
    });



    DataAdicional.push(['Total de horas', totalHoras]);


    // Agregar la tabla al PDF
    autoTable(doc, {
      head: rowDataHead,
      body: rowData,
      theme: 'grid',
      styles: {
        cellWidth: cellSize,
        minCellHeight: 5,
        fontSize: 7,
        textColor: [0, 0, 0]
      },
      margin: { top: 30, left: 34, right: 34 }
    });
    doc.addPage();

    autoTable(doc, {
      head: rowDataHead2,
      body: rowDataC1,
      theme: 'grid',
      styles: {
        cellWidth: cellSize,
        minCellHeight: 5,
        fontSize: 7,
        textColor: [0, 0, 0]
      },

      margin: { top: 10 }
    });

    doc.addPage();

    autoTable(doc, {
      head: rowDataHead3,
      body: rowDataC2,
      theme: 'grid',
      styles: {
        cellWidth: cellSize,
        minCellHeight: 5,
        fontSize: 7,
        textColor: [0, 0, 0]

      },

      margin: { top: 10 }
    });

    // Agregar una nueva página al PDF
    doc.addPage();

    autoTable(doc, {
      head: rowDataHead4,
      body: DataAdicional,
      theme: 'grid',
      styles: {
        cellWidth: 80,
        fontSize: 8,
        textColor: [0, 0, 0]
      },

      margin: { top: 10 }

    });

    let rowDataHead5: any = [];

    let DataFirmas: any = [];

    rowDataHead5.push(['Elaborado por:', 'Revisado por:', 'Aprobado por:'])
    DataFirmas.push(["", "", ""]);
    DataFirmas.push([this.userData.nombre, "", this.aprobador.nombre]);
    DataFirmas.push(["Director de Carrera", "Decano de Facultad", "Directora Académica"]);

    autoTable(doc, {
      head: rowDataHead5,
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


    let cellSize: any = ""
    let cellSizeBorder: any = ""
    let days: any = ""
    let daysN: any = ""
    let indiceCell: any = ""
    let indiceCellBorder: any = ""
    let indiceCellList: number = 0
    let hoursPDFNocturnoCombinado:any = []
    let hoursPDFDiurnoCombinado:any = []
    days = ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes'];
    daysN = ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado'];
    indiceCell = 7
    indiceCellBorder = 17
    indiceCellList = 56
    cellSize = 19
    cellSizeBorder = 5


    let horastemporalesDirunas = this.hours.concat(this.hoursAlternativasDiurnas)
    horastemporalesDirunas.filter((hora: any, index: any) => horastemporalesDirunas.indexOf(hora) === index)
    .forEach((hora: any) => {
      hoursPDFDiurnoCombinado.push(hora)
    });

    hoursPDFDiurnoCombinado.sort()

    let horastemporalesNocturnas = this.hoursnight.concat(this.hoursAlternativasNocturnas)
    horastemporalesNocturnas.filter((hora: any, index: any) => horastemporalesNocturnas.indexOf(hora) === index)
    .forEach((hora: any) => {
      hoursPDFNocturnoCombinado.push(hora)
    });

    hoursPDFNocturnoCombinado.sort()

    worksheet.getColumn('A').width = cellSize;
    worksheet.getColumn('B').width = cellSize;
    worksheet.getColumn('C').width = cellSize;
    worksheet.getColumn('D').width = cellSize;
    worksheet.getColumn('E').width = cellSize;
    worksheet.getColumn('F').width = cellSize;
    worksheet.getColumn('G').width = cellSize;

    for (let row = 1; row <= cellSizeBorder; row++) {
      for (let col = 1; col <= cellSizeBorder + 2; col++) {
        var cell = worksheet.getCell(`${String.fromCharCode(64 + col)}${row}`);
        cell.border = {
          top: { style: 'medium', color: { argb: 'FFC0C0C0' } },
          left: { style: 'medium', color: { argb: 'FFC0C0C0' } },
          bottom: { style: 'medium', color: { argb: 'FFC0C0C0' } },
          right: { style: 'medium', color: { argb: 'FFC0C0C0' } }
        };

      }
    }



    let identAsignatura: any = ""
    let semestreAsignatura: any = ""
    let cicloAsignatura: any = ""
    let asignaturasProfesoresNocturnoCicloUno: any[] = [];
    let asignaturasProfesoresNocturnoCicloDos: any[] = [];
    let asignaturasProfesoresDiurno: any[] = [];
    asignaturasProfesoresDiurno = this.horarioProfesor.map(item => item.filter(item => {
      if (!item.ciclo) {

        item.ciclo = ""

        cicloAsignatura = item.ciclo
      }

      if (item.elementoType === 'asignatura' && item.item.horario === 'Diurno' && item.item.profesor) {
        if (!item.ciclo) {

          item.ciclo = ""

          cicloAsignatura = item.ciclo
        } else {

          cicloAsignatura = item.ciclo
        }
        identAsignatura = item.identificador.substring(0, 2)
        semestreAsignatura = item.semestre
        return true; // Mantener las asignaturas filtradas
      } else if (item.elementoType === 'aula' && item.identificador.substring(0, 2) === identAsignatura && item.semestre === semestreAsignatura) {
        return true;
      } else {
        return false;
      }

    }))


    identAsignatura = ""
    semestreAsignatura = ""
    identAsignatura = ""
    cicloAsignatura = ""
    asignaturasProfesoresNocturnoCicloUno = this.horarioProfesor.map(item => item.filter(item => {
      if (!item.ciclo) {

        item.ciclo = ""

        cicloAsignatura = item.ciclo
      }

      if (item.elementoType === 'asignatura' && item.item.horario === 'Nocturno' && item.item.ciclo[0] === "1" && item.item.profesor) {
        if (!item.ciclo) {

          item.ciclo = ""

          cicloAsignatura = item.ciclo
        } else {

          cicloAsignatura = item.ciclo
        }
        identAsignatura = item.identificador.substring(0, 2)
        semestreAsignatura = item.semestre
        cicloAsignatura = item.ciclo
        return true; // Mantener las asignaturas filtradas
      } else if (item.elementoType === 'aula' && item.identificador.substring(0, 2) === identAsignatura && item.semestre === semestreAsignatura && item.ciclo === cicloAsignatura) {
        return true;
      } else {
        return false;
      }

    }))
    identAsignatura = ""
    semestreAsignatura = ""
    cicloAsignatura = ""
    asignaturasProfesoresNocturnoCicloDos = this.horarioProfesor.map(item => item.filter(item => {
      if (!item.ciclo) {

        item.ciclo = ""

        cicloAsignatura = item.ciclo
      }

      if (item.elementoType === 'asignatura' && item.item.horario === 'Nocturno' && item.item.ciclo[0] === "2" && item.item.profesor) {
        if (!item.ciclo) {

          item.ciclo = ""

          cicloAsignatura = item.ciclo
        } else {

          cicloAsignatura = item.ciclo
        }
        identAsignatura = item.identificador.substring(0, 2)
        semestreAsignatura = item.semestre
        cicloAsignatura = item.ciclo

        return true; // Mantener las asignaturas filtradas
      } else if (item.elementoType === 'aula' && item.identificador.substring(0, 2) === identAsignatura && item.semestre === semestreAsignatura && item.ciclo === cicloAsignatura) {
        return true;
      } else {
        return false;
      }

    }))


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

    titulo.value = 'PROFESOR: ' + profesor; // Establecer el valor de la celda
    titulo.font = { size: 10, bold: true }; // Establecer el formato de la fuente
    titulo.alignment = { horizontal: 'center' };


    let asignaturasProfesores: any[] = [];

    worksheet.getCell('A6').value = 'Horario Diurno';
    worksheet.getCell('A6').font = { size: 14, bold: true };
    worksheet.getCell('A6').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '00AFF0' } };
    worksheet.getCell('A6').alignment = { horizontal: 'center' };
    worksheet.mergeCells('A6:F6');
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



    let row: number | string[] = []
    let agrupaciones: any = [];
    for (let i = 0; i < hoursPDFDiurnoCombinado.length; i++) {
      row = [hoursPDFDiurnoCombinado[i]];

      // Iterar sobre los arreglos correspondientes a cada día de la semana
      for (let j = 0; j <= days.length; j++) {


        // Buscar el item correspondiente a esta celda
        for (let k = 0; k < asignaturasProfesoresDiurno.length; k++) {
          let currentItem = asignaturasProfesoresDiurno[k];

          currentItem.sort((a: any, b: any) => a.identificador.localeCompare(b.identificador));

          for (let l = 0; l < currentItem.length; l++) {

            let currentElement = currentItem[l];

            if (currentElement.elementoType === 'asignatura') {
              let currentAsignaturaId = currentElement.item._id;
              let currentAsignatura = currentElement.item.nombre;
              let currentAsignaturaH = currentElement.item.horario;
              let currentAsignaturaC = currentElement.carrera;
              let currentAsignaturaS = currentElement.semestre;
              let currentAsignaturaCiclo = currentElement.ciclo;
              let currentProfesores = currentElement.item.profesor[0].nombre;
              let currentAsignaturaCreditos = currentElement.item.creditos;


              if (!asignaturasProfesores.some(ap => ap.asigId === currentAsignaturaId && (ap.asignatura === currentAsignatura && ap.semestre === currentAsignaturaS && ap.ciclo === currentAsignaturaCiclo) && ap.profesores === currentProfesores)) {
                asignaturasProfesores.push({ asigId: currentAsignaturaId, carrera: currentAsignaturaC, semestre: currentAsignaturaS, ciclo: currentAsignaturaCiclo, asignatura: currentAsignatura, horario: currentAsignaturaH, profesores: currentProfesores, horas: currentAsignaturaCreditos });

              }

            }

            // Obtener la hora del elemento actual
            let elementHourStart = currentElement.hourStart;
            let elementHourEnd = currentElement.hourEnd;

            // Comprobar si las horas son iguales
            let rowIndex = i + 1; // Sumar 1 para evitar reemplazar la primera fila (encabezado)
            let colIndex = j + 1; // Sumar 1 para evitar reemplazar la primera columna (horario)

            // Insertar el valor en la celda correspondiente

            if (i === hoursPDFDiurnoCombinado.indexOf(elementHourStart + '-' + elementHourEnd) && j === (days.indexOf(currentElement.dayName))) {

              if (typeof row[colIndex] === 'undefined') {
                row[colIndex] = '';
              }
              if (currentElement.elementoType === 'aula') {
                agrupaciones.push(currentElement)
                row[colIndex] += '\n' + '(' + currentElement.item.nombre + ' - ' + currentElement.item.ubicacion.trim() + ') ';

              } else {
                agrupaciones.push(currentElement)
                row[colIndex] += currentElement.item.nombre.trim();
                row[colIndex] += " ( " + currentElement.semestre + ' semestre' + ' - ' + currentElement.carrera + ' - ' + currentElement.item.horario + " )"


              }


            }



          }

        }
      }

      worksheet.addRow(row).eachCell({ includeEmpty: true }, function (cell) {
        cell.font = { size: 7 };

      });

    }

    for (let i = 7; i <= indiceCellBorder; i++) {
      const rowTablaHorarioItem = worksheet.getRow(i);
      rowTablaHorarioItem.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true }; // Opcional: alinear el contenido
      rowTablaHorarioItem.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true }; // Activar el ajuste de texto
    }

    for (let row = 6; row <= indiceCellBorder; row++) {
      for (let col = 1; col <= indiceCell - 1; col++) {
        var cell = worksheet.getCell(`${String.fromCharCode(64 + col)}${row}`);
        cell.border = {
          top: { style: 'thin', color: { argb: '000000' } },
          left: { style: 'thin', color: { argb: '000000' } },
          bottom: { style: 'thin', color: { argb: '000000' } },
          right: { style: 'thin', color: { argb: '000000' } }
        };

      }
    }

    let indiceColumn: any
    indiceCell = 20
    indiceColumn = 7
    indiceCellBorder = 35


    worksheet.getCell('A19').value = 'Horario Nocturno Ciclo 1';
    worksheet.getCell('A19').font = { size: 14, bold: true };
    worksheet.getCell('A19').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '00AFF0' } };
    worksheet.getCell('A19').alignment = { horizontal: 'center' };
    worksheet.mergeCells('A19:G19');
    // Pintar encabezado y agregar encabezado de horario

    worksheet.spliceRows(indiceCell, 0, ['Horas', ...daysN]);
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



    for (let i = 0; i < hoursPDFNocturnoCombinado.length; i++) {
      row = [hoursPDFNocturnoCombinado[i]];

      // Iterar sobre los arreglos correspondientes a cada día de la semana
      for (let j = 0; j <= days.length; j++) {


        // Buscar el item correspondiente a esta celda
        for (let k = 0; k < asignaturasProfesoresNocturnoCicloUno.length; k++) {
          let currentItem = asignaturasProfesoresNocturnoCicloUno[k];

          currentItem.sort((a: any, b: any) => a.identificador.localeCompare(b.identificador));

          for (let l = 0; l < currentItem.length; l++) {

            let currentElement = currentItem[l];

            if (currentElement.elementoType === 'asignatura') {
              let currentAsignaturaId = currentElement.item._id;
              let currentAsignatura = currentElement.item.nombre;
              let currentAsignaturaH = currentElement.item.horario;
              let currentAsignaturaC = currentElement.carrera;
              let currentAsignaturaS = currentElement.semestre;
              let currentAsignaturaCiclo = currentElement.ciclo;
              let currentProfesores = currentElement.item.profesor[0].nombre;
              let currentAsignaturaCreditos = currentElement.item.creditos;


              if (!asignaturasProfesores.some(ap => ap.asigId === currentAsignaturaId && (ap.asignatura === currentAsignatura && ap.semestre === currentAsignaturaS && ap.ciclo === currentAsignaturaCiclo) && ap.profesores === currentProfesores)) {
                asignaturasProfesores.push({ asigId: currentAsignaturaId, carrera: currentAsignaturaC, semestre: currentAsignaturaS, ciclo: currentAsignaturaCiclo, asignatura: currentAsignatura, horario: currentAsignaturaH, profesores: currentProfesores, horas: currentAsignaturaCreditos });

              }

            }

            // Obtener la hora del elemento actual
            let elementHourStart = currentElement.hourStart;
            let elementHourEnd = currentElement.hourEnd;

            // Comprobar si las horas son iguales
            let rowIndex = i + 1; // Sumar 1 para evitar reemplazar la primera fila (encabezado)
            let colIndex = j + 1; // Sumar 1 para evitar reemplazar la primera columna (horario)

            // Insertar el valor en la celda correspondiente
            if (i === hoursPDFNocturnoCombinado.indexOf(elementHourStart + '-' + elementHourEnd) && j === (daysN.indexOf(currentElement.dayName))) {

              if (typeof row[colIndex] === 'undefined') {
                row[colIndex] = '';
              }
              if (currentElement.elementoType === 'aula') {
                agrupaciones.push(currentElement)
                row[colIndex] += '\n' + '(' + currentElement.item.nombre + ' - ' + currentElement.item.ubicacion.trim() + ') ';

              } else {
                agrupaciones.push(currentElement)
                row[colIndex] += currentElement.item.nombre.trim();
                row[colIndex] += " ( " + currentElement.semestre + ' semestre' + ' - ' + currentElement.ciclo + ' Ciclo' + ' - ' + currentElement.carrera + ' - ' + currentElement.item.horario + " )"


              }


            }



          }

        }
      }

      worksheet.addRow(row).eachCell({ includeEmpty: true }, function (cell) {
        cell.font = { size: 6 };

      });

    }

    for (let i = 20; i <= indiceCellBorder; i++) {
      const rowTablaHorarioItem = worksheet.getRow(i);
      rowTablaHorarioItem.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true }; // Opcional: alinear el contenido
      rowTablaHorarioItem.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true }; // Activar el ajuste de texto
    }

    for (let row = 19; row <= indiceCellBorder; row++) {
      for (let col = 1; col <= indiceColumn; col++) {
        var cell = worksheet.getCell(`${String.fromCharCode(64 + col)}${row}`);
        cell.border = {
          top: { style: 'thin', color: { argb: '000000' } },
          left: { style: 'thin', color: { argb: '000000' } },
          bottom: { style: 'thin', color: { argb: '000000' } },
          right: { style: 'thin', color: { argb: '000000' } }
        };

      }
    }

    /* NOCTURNO CICLO 2 */
    indiceCell = ""
    indiceCell = 38
    indiceColumn = 7
    indiceCellBorder = 53


    worksheet.getCell('A37').value = 'Horario Nocturno Ciclo 2';
    worksheet.getCell('A37').font = { size: 14, bold: true };
    worksheet.getCell('A37').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '00AFF0' } };
    worksheet.getCell('A37').alignment = { horizontal: 'center' };
    worksheet.mergeCells('A37:G37');
    // Pintar encabezado y agregar encabezado de horario

    worksheet.spliceRows(indiceCell, 0, ['Horas', ...daysN]);
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




    for (let i = 0; i < hoursPDFNocturnoCombinado.length; i++) {
      let row = [hoursPDFNocturnoCombinado[i]];

      // Iterar sobre los arreglos correspondientes a cada día de la semana
      for (let j = 0; j <= days.length; j++) {


        // Buscar el item correspondiente a esta celda
        for (let k = 0; k < asignaturasProfesoresNocturnoCicloDos.length; k++) {
          let currentItem = asignaturasProfesoresNocturnoCicloDos[k];

          currentItem.sort((a: any, b: any) => a.identificador.localeCompare(b.identificador));

          for (let l = 0; l < currentItem.length; l++) {

            let currentElement = currentItem[l];

            if (currentElement.elementoType === 'asignatura') {
              let currentAsignaturaId = currentElement.item._id;
              let currentAsignatura = currentElement.item.nombre;
              let currentAsignaturaH = currentElement.item.horario;
              let currentAsignaturaC = currentElement.carrera;
              let currentAsignaturaS = currentElement.semestre;
              let currentAsignaturaCiclo = currentElement.ciclo;
              let currentProfesores = currentElement.item.profesor[0].nombre;
              let currentAsignaturaCreditos = currentElement.item.creditos;


              if (!asignaturasProfesores.some(ap => ap.asigId === currentAsignaturaId && (ap.asignatura === currentAsignatura && ap.semestre === currentAsignaturaS && ap.ciclo === currentAsignaturaCiclo) && ap.profesores === currentProfesores)) {
                asignaturasProfesores.push({ asigId: currentAsignaturaId, carrera: currentAsignaturaC, semestre: currentAsignaturaS, ciclo: currentAsignaturaCiclo, asignatura: currentAsignatura, horario: currentAsignaturaH, profesores: currentProfesores, horas: currentAsignaturaCreditos });

              }

            }

            // Obtener la hora del elemento actual
            let elementHourStart = currentElement.hourStart;
            let elementHourEnd = currentElement.hourEnd;

            // Comprobar si las horas son iguales
            let rowIndex = i + 1; // Sumar 1 para evitar reemplazar la primera fila (encabezado)
            let colIndex = j + 1; // Sumar 1 para evitar reemplazar la primera columna (horario)

            // Insertar el valor en la celda correspondiente

            if (i === hoursPDFNocturnoCombinado.indexOf(elementHourStart + '-' + elementHourEnd) && j === (daysN.indexOf(currentElement.dayName))) {

              if (typeof row[colIndex] === 'undefined') {
                row[colIndex] = '';
              }
              if (currentElement.elementoType === 'aula') {
                agrupaciones.push(currentElement)

                row[colIndex] += ' \n' + (currentElement.item.nombre + ' - ' + currentElement.item.ubicacion).replace(/(.+)/, '($1)').trim();
              } else {
                agrupaciones.push(currentElement)
                row[colIndex] += currentElement.item.nombre.trim();
                row[colIndex] += " ( " + currentElement.semestre + ' semestre' + ' - ' + currentElement.ciclo + ' ciclo' + ' - ' + currentElement.carrera + ' - ' + currentElement.item.horario + " )"


              }


            }



          }

        }
      }

      worksheet.addRow(row).eachCell({ includeEmpty: true }, function (cell) {
        cell.font = { size: 6 };

      });

    }

    for (let i = 37; i <= indiceCellBorder; i++) {
      const rowTablaHorarioItem = worksheet.getRow(i);
      rowTablaHorarioItem.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true }; // Opcional: alinear el contenido
      rowTablaHorarioItem.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true }; // Activar el ajuste de texto
    }

    for (let row = 37; row <= indiceCellBorder; row++) {
      for (let col = 1; col <= indiceColumn; col++) {
        var cell = worksheet.getCell(`${String.fromCharCode(64 + col)}${row}`);
        cell.border = {
          top: { style: 'thin', color: { argb: '000000' } },
          left: { style: 'thin', color: { argb: '000000' } },
          bottom: { style: 'thin', color: { argb: '000000' } },
          right: { style: 'thin', color: { argb: '000000' } }
        };

      }
    }



    worksheet.insertRow(indiceCellList, ['Asignaturas', 'N° Horas', 'Modalidad']);

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

    agrupaciones.forEach((item: { elementoType: string; item: { _id: any; }; carrera: any; dayName: any; hourEnd: any; hourStart: any; identificador: any; semestre: any; ciclo: any; }) => {
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
            ciclo: item.ciclo,
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
      elemento1.modalidad = "";

      resultadoFinal.forEach((resultado: any) => {
        if (resultado && resultado.modalidad && elemento1.asignatura === resultado.item.nombre) {
          elemento1.modalidad = resultado.modalidad;
        }
      });
    });



    let totalHoras = 0;
    asignaturasProfesores.forEach(ap => {
      let tipoPeriodo: any
      let tipoPeriodo2: any
      if (ap.horario === "Diurno") {
        tipoPeriodo = "Semestre"
        worksheet.addRow([ap.asignatura + ' ( ' + ap.semestre + '  ' + tipoPeriodo + ' - ' + ap.carrera + ' ) ' + '( ' + ap.horario + ' )', ap.horas, ap.modalidad]).eachCell({ includeEmpty: true }, function (cell) {

          cell.font = { size: 8 };
          cell.border = {
            top: { style: 'thin', color: { argb: '000000' } },
            left: { style: 'thin', color: { argb: '000000' } },
            bottom: { style: 'thin', color: { argb: '000000' } },
            right: { style: 'thin', color: { argb: '000000' } }
          };
        })
      } else {
        tipoPeriodo = "Semestre"
        tipoPeriodo2 = "Ciclo"
        worksheet.addRow([ap.asignatura + ' ( ' + ap.semestre + '  ' + tipoPeriodo + ' - ' + ap.ciclo + '  ' + tipoPeriodo2 + ' - ' + ap.carrera + ' ) ' + '( ' + ap.horario + ' )', ap.horas, ap.modalidad]).eachCell({ includeEmpty: true }, function (cell) {

          cell.font = { size: 8 };
          cell.border = {
            top: { style: 'thin', color: { argb: '000000' } },
            left: { style: 'thin', color: { argb: '000000' } },
            bottom: { style: 'thin', color: { argb: '000000' } },
            right: { style: 'thin', color: { argb: '000000' } }
          };
        })

      }

      totalHoras += parseInt(ap.horas);
      indiceCellList++
    });
    worksheet.insertRow(indiceCellList + 1, ['Total de horas', totalHoras, '']).eachCell({ includeEmpty: true }, function (cell) {
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

    console.log(indiceCellList)

    // Agregar texto al final de la página
    let elaboradoPor = worksheet.getCell(indiceCellList+5, 2);
    elaboradoPor.value = 'Elaborado por: ';
    elaboradoPor.font = { size: 8 };

    let nombreDirector = worksheet.getCell(indiceCellList+8, 2);
    nombreDirector.value = this.userData.nombre;
    nombreDirector.font = { size: 8 };

    let directorCarrera = worksheet.getCell(indiceCellList+9, 2);
    directorCarrera.value = 'Director de carrera';
    directorCarrera.font = { size: 8 };

    // Agregar texto al final de la página
    let revisadoPor = worksheet.getCell(indiceCellList+5, 4);
    revisadoPor.value = 'Revisado por: ';
    revisadoPor.font = { size: 8 };

    let nombreRevisador = worksheet.getCell(indiceCellList+8, 4);
    nombreRevisador.value = "";
    nombreRevisador.font = { size: 8 };

    let cargoRevisador = worksheet.getCell(indiceCellList+9, 4);
    cargoRevisador.value = 'Decano de Facultad';
    cargoRevisador.font = { size: 8 };



    // Agregar texto al final de la página
    let aprobadorPor = worksheet.getCell(indiceCellList+5, 6);
    aprobadorPor.value = 'Aprobado por: ';
    aprobadorPor.font = { size: 8 };

    let nombreAprobador = worksheet.getCell(indiceCellList+8, 6);
    nombreAprobador.value = this.aprobador.nombre;
    nombreAprobador.font = { size: 8 };

    let cargoAprobador = worksheet.getCell(indiceCellList+9, 6);
    cargoAprobador.value = 'Directora Académica';
    cargoAprobador.font = { size: 8 };

    let nombreArchivo = 'Horario ' + profesor + '.xlsx';



    workbook.xlsx.writeBuffer().then((buffer: ArrayBuffer) => {
      const data = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      FileSaver.saveAs(data, nombreArchivo);
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

    let descriptionText = "MATRIZ RESUMEN DE PROFESORES POR CARRERA";
    let descriptionWidth = doc.getTextWidth(descriptionText);

    let descriptionX = (pageWidth - descriptionWidth) / 2;

    doc.text(descriptionText, descriptionX, 15);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');

    let carreraText = "CARRERA: " + this.userData.rol.toUpperCase();
    let carreraInfoWidth = doc.getTextWidth(carreraText);

    let carreraInfoX = (pageWidth - carreraInfoWidth) / 2;
    doc.text(carreraText, carreraInfoX, 20);

    doc.setFont('helvetica', 'normal');

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
      let sumaHoras = 0;
      let isFirstRow = true;

      for (let asig of profesorTCompleto.asignaturas) {
        sumaHoras += parseInt(asig.horas);
      }

      let periodoType: any
      let periodoType2: any
      for (let asignatura of profesorTCompleto.asignaturas) {
        if (asignatura.horario === "Nocturno") {
          periodoType = "Semestre"
          periodoType2 = "Ciclo"
          if (isFirstRow) {
            rowData.push([profesorTCompleto.profesornombre, asignatura.asignatura + ' ( ' + asignatura.semestre + ' ' + periodoType + ' - ' + asignatura.ciclo + ' ' + periodoType2 + ' - ' + asignatura.carrera + ' )' + ' ( ' + asignatura.horario + ' )', asignatura.horas, sumaHoras, profesorTCompleto.profesorObservacion]);
            isFirstRow = false;
          } else {
            rowData.push(['', asignatura.asignatura + ' ( ' + asignatura.semestre + ' ' + periodoType + ' - ' + asignatura.ciclo + ' ' + periodoType2 + ' - ' + asignatura.carrera + ' )' + ' ( ' + asignatura.horario + ' )', asignatura.horas, '']);
          }
        } else {
          periodoType = "Semestre"
          if (isFirstRow) {
            rowData.push([profesorTCompleto.profesornombre, asignatura.asignatura + ' ( ' + asignatura.semestre + ' ' + periodoType + ' - ' + asignatura.carrera + ' )' + ' ( ' + asignatura.horario + ' )', asignatura.horas, sumaHoras, profesorTCompleto.profesorObservacion]);
            isFirstRow = false;
          } else {
            rowData.push(['', asignatura.asignatura + ' ( ' + asignatura.semestre + ' ' + periodoType + ' - ' + asignatura.carrera + ' )' + ' ( ' + asignatura.horario + ' )', asignatura.horas, '']);
          }
        }

      }
    }

    for (let profesorMTiempo of this.asignaturasPorProfesorMedioTiempo.data) {

      let sumaHoras = 0;
      let isFirstRow = true;

      for (let asig of profesorMTiempo.asignaturas) {
        sumaHoras += parseInt(asig.horas);
      }
      let periodoType: any
      let periodoType2: any
      for (let asignatura of profesorMTiempo.asignaturas) {

        if (asignatura.horario === "Nocturno") {
          periodoType = "Semestre"
          periodoType2 = "Ciclo"
          if (isFirstRow) {
            rowData2.push([profesorMTiempo.profesornombre, asignatura.asignatura + ' ( ' + asignatura.semestre + ' ' + periodoType + ' - ' + asignatura.ciclo + ' ' + periodoType2 + ' - ' + asignatura.carrera + ' )' + ' ( ' + asignatura.horario + ' )', asignatura.horas, sumaHoras, profesorMTiempo.profesorObservacion]);
            isFirstRow = false;
          } else {
            rowData2.push(['', asignatura.asignatura + ' ( ' + asignatura.semestre + ' ' + periodoType + ' - ' + asignatura.ciclo + ' ' + periodoType2 + ' - ' + asignatura.carrera + ' )' + ' ( ' + asignatura.horario + ' )', asignatura.horas, '']);
          }
        } else {
          periodoType = "Semestre"
          if (isFirstRow) {
            rowData2.push([profesorMTiempo.profesornombre, asignatura.asignatura + ' ( ' + asignatura.semestre + ' ' + periodoType + ' - ' + asignatura.carrera + ' )' + ' ( ' + asignatura.horario + ' )', asignatura.horas, sumaHoras, profesorMTiempo.profesorObservacion]);
            isFirstRow = false;
          } else {
            rowData2.push(['', asignatura.asignatura + ' ( ' + asignatura.semestre + ' ' + periodoType + ' - ' + asignatura.carrera + ' )' + ' ( ' + asignatura.horario + ' )', asignatura.horas, '']);
          }
        }
      }
    }

    for (let profesorTParcial of this.asignaturasPorProfesorTiempoParcial.data) {
      let sumaHoras = 0;
      let isFirstRow = true;

      for (let asig of profesorTParcial.asignaturas) {
        sumaHoras += parseInt(asig.horas);
      }
      let periodoType: any
      let periodoType2: any
      for (let asignatura of profesorTParcial.asignaturas) {
        if (asignatura.horario === "Nocturno") {
          periodoType = "Semestre"
          periodoType2 = "Ciclo"
          if (isFirstRow) {
            rowData3.push([profesorTParcial.profesornombre, asignatura.asignatura + ' ( ' + asignatura.semestre + ' ' + periodoType + ' - ' + asignatura.ciclo + ' ' + profesorTParcial + ' - ' + asignatura.carrera + ' )' + ' ( ' + asignatura.horario + ' )', asignatura.horas, sumaHoras, profesorTParcial.profesorObservacion]);
            isFirstRow = false;
          } else {
            rowData3.push(['', asignatura.asignatura + ' ( ' + asignatura.semestre + ' ' + periodoType + ' - ' + asignatura.ciclo + ' ' + profesorTParcial + ' - ' + asignatura.carrera + ' )' + ' ( ' + asignatura.horario + ' )', asignatura.horas, '']);
          }
        } else {
          periodoType = "Semestre"
          if (isFirstRow) {
            rowData3.push([profesorTParcial.profesornombre, asignatura.asignatura + ' ( ' + asignatura.semestre + ' ' + periodoType + ' - ' + asignatura.carrera + ' )' + ' ( ' + asignatura.horario + ' )', asignatura.horas, sumaHoras, profesorTParcial.profesorObservacion]);
            isFirstRow = false;
          } else {
            rowData3.push(['', asignatura.asignatura + ' ( ' + asignatura.semestre + ' ' + periodoType + ' - ' + asignatura.carrera + ' )' + ' ( ' + asignatura.horario + ' )', asignatura.horas, '']);
          }
        }
      }
    }

    // Definir la función de evento didParseCell
    const didParseCell = function (data: any) {
      const { column, cell } = data;

      if (column.dataKey === 2 || column.dataKey === 3 || column.dataKey === 5) {
        cell.styles.cellWidth = 13;
      }

      if (column.dataKey === 4 || column.dataKey === 5) {
        cell.styles.cellWidth = 45; // Establecer ancho de columna personalizado
      }

      if (column.dataKey === 0) {
        cell.styles.cellWidth = 35; // Establecer ancho de columna personalizado
      }
    };

    // Agregar la tabla al PDF
    autoTable(doc, {
      head: rowDataHead,
      body: rowData,
      theme: 'grid',
      styles: {
        cellWidth: 120,
        minCellHeight: 5,
        fontSize: 8,
        textColor: [0, 0, 0]
      },
      didParseCell: didParseCell,
      margin: { top: 25 },
    });

    doc.addPage();
    // Agregar la tabla al PDF
    autoTable(doc, {
      head: rowDataHead2,
      body: rowData2,
      theme: 'grid',
      styles: {
        cellWidth: 120,
        minCellHeight: 5,
        fontSize: 8,
        textColor: [0, 0, 0]

      },
      didParseCell: didParseCell,
    });

    doc.addPage();
    // Agregar la tabla al PDF
    autoTable(doc, {
      head: rowDataHead3,
      body: rowData3,
      theme: 'grid',
      styles: {
        cellWidth: 120,
        minCellHeight: 5,
        fontSize: 8,
        textColor: [0, 0, 0]

      },
      didParseCell: didParseCell,
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

    sheet.getCell('A2').value = 'MATRIZ RESUMEN DE PROFESORES POR CARRERA';
    sheet.getCell('A2').font = { size: 14, bold: true };
    sheet.getCell('A2').alignment = { horizontal: 'center' };
    sheet.mergeCells('A2:F2');

    sheet.getCell('A3').value = 'CARRERA: ' + this.userData.rol.toUpperCase();
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
    let periodoType: any
    let periodoType2: any
    for (let profesorTCompleto of this.asignaturasPorProfesorTiempoCompleto.data) {
      let sumaHoras = 0;

      for (let asig of profesorTCompleto.asignaturas) {
        sumaHoras += parseInt(asig.horas);
      }

      let asignaturasCount = profesorTCompleto.asignaturas.length;
      let isFirstRow = true;

      for (let i = 0; i < asignaturasCount; i++) {

        let rowIndexStart = rowIndex + i;

        if (isFirstRow) {
          sheet.getCell(`A${rowIndexStart}`).value = profesorTCompleto.profesornombre;
          sheet.getCell(`D${rowIndexStart}`).value = sumaHoras;
          sheet.getCell(`E${rowIndexStart}`).value = profesorTCompleto.profesorObservacion;
          isFirstRow = false;
        }

        let asignatura = profesorTCompleto.asignaturas[i];
        if (asignatura.horario === "Nocturno") {
          periodoType = "Semestre"
          periodoType2 = "Ciclo"

          sheet.getCell(`B${rowIndexStart}`).value = asignatura.asignatura + '\n( ' + asignatura.semestre + ' ' + periodoType + ' - ' + asignatura.ciclo + ' ' + periodoType2 + ' - ' + asignatura.carrera + ' )' + '\n( ' + asignatura.horario + ' )';
          sheet.getCell(`C${rowIndexStart}`).value = asignatura.horas;
        } else {
          periodoType = "Semestre"

          sheet.getCell(`B${rowIndexStart}`).value = asignatura.asignatura + '\n( ' + asignatura.semestre + ' ' + periodoType + ' - ' + asignatura.carrera + ' )' + '\n( ' + asignatura.horario + ' )';
          sheet.getCell(`C${rowIndexStart}`).value = asignatura.horas;
        }
      }

      if (asignaturasCount > 1) {
        let rowIndexEnd = rowIndex + asignaturasCount - 1;
        sheet.mergeCells('A' + rowIndex + ':A' + rowIndexEnd);
        sheet.mergeCells('D' + rowIndex + ':D' + rowIndexEnd);
        sheet.mergeCells('E' + rowIndex + ':E' + rowIndexEnd);
        sheet.mergeCells('F' + rowIndex + ':F' + rowIndexEnd);
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
        cell.alignment = cell.alignment || {};
        /*   cell.alignment.wrapText = true; */
        cell.alignment.vertical = 'middle';
        cell.alignment.horizontal = 'center';


      }
    }



    // Ajustar ancho de columna automáticamente
    sheet.columns.forEach((column) => {
      console.log(column)
      column.width = 24;
    });

    // Establecer el ancho de las columnas
    sheet.getColumn(2).width = 75;
    sheet.getColumn(3).width = 8;
    sheet.getColumn(4).width = 13;

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
        sumaHoras += parseInt(asig.horas);
      }

      let asignaturasCount = profesorMTiempo.asignaturas.length;
      let isFirstRow = true;

      for (let i = 0; i < asignaturasCount; i++) {
        let rowIndexStart = segundaTablaInicio + 2 + i;

        if (isFirstRow) {
          sheet.getCell(`A${rowIndexStart}`).value = profesorMTiempo.profesornombre;
          sheet.getCell(`D${rowIndexStart}`).value = sumaHoras;
          sheet.getCell(`E${rowIndexStart}`).value = profesorMTiempo.profesorObservacion;
          isFirstRow = false;
        }

        let asignatura = profesorMTiempo.asignaturas[i];
        if (asignatura.horario === "Nocturno") {
          periodoType = "Semestre"
          periodoType2 = "Ciclo"

          sheet.getCell(`B${rowIndexStart}`).value = asignatura.asignatura + '\n( ' + asignatura.semestre + ' ' + periodoType + ' - ' + asignatura.ciclo + ' ' + periodoType2 + ' - ' + asignatura.carrera + ' )' + '\n( ' + asignatura.horario + ' )';
          sheet.getCell(`C${rowIndexStart}`).value = asignatura.horas;
        } else {
          periodoType = "Semestre"

          sheet.getCell(`B${rowIndexStart}`).value = asignatura.asignatura + '\n( ' + asignatura.semestre + ' ' + periodoType + ' - ' + asignatura.carrera + ' )' + '\n( ' + asignatura.horario + ' )';
          sheet.getCell(`C${rowIndexStart}`).value = asignatura.horas;
        }
      }

      if (asignaturasCount > 1) {
        let rowIndexEnd = (segundaTablaInicio + 2) + asignaturasCount - 1;
        sheet.mergeCells('A' + (segundaTablaInicio + 2) + ':A' + rowIndexEnd);
        sheet.mergeCells('D' + (segundaTablaInicio + 2) + ':D' + rowIndexEnd);
        sheet.mergeCells('E' + (segundaTablaInicio + 2) + ':E' + rowIndexEnd);
        sheet.mergeCells('F' + (segundaTablaInicio + 2) + ':F' + rowIndexEnd);
      }

      segundaTablaInicio += asignaturasCount;
    }


    // Aplicar bordes oscuros a la tabla
    startRowIndex = primeraTablaFinal + 1;
    endRowIndex = segundaTablaInicio + 1
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
        /* cell.alignment.wrapText = true; */
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
        sumaHoras += parseInt(asig.horas);
      }

      let asignaturasCount = profesorTParcial.asignaturas.length;
      let isFirstRow = true;

      for (let i = 0; i < asignaturasCount; i++) {
        let rowIndexStart = (terceraTablaInicio + 2) + i;

        if (isFirstRow) {
          sheet.getCell(`A${rowIndexStart}`).value = profesorTParcial.profesornombre;
          sheet.getCell(`D${rowIndexStart}`).value = sumaHoras;
          sheet.getCell(`E${rowIndexStart}`).value = profesorTParcial.profesorObservacion;
          isFirstRow = false;
        }

        let asignatura = profesorTParcial.asignaturas[i];
        if (asignatura.horario === "Nocturno") {
          periodoType = "Semestre"
          periodoType2 = "Ciclo"
          sheet.getCell(`B${rowIndexStart}`).value = asignatura.asignatura + '\n( ' + asignatura.semestre + ' ' + periodoType + ' - ' + asignatura.ciclo + ' ' + periodoType2 + ' - ' + asignatura.carrera + ' )' + '\n( ' + asignatura.horario + ' )';
          sheet.getCell(`C${rowIndexStart}`).value = asignatura.horas;
        } else {
          periodoType = "Semestre"
          sheet.getCell(`B${rowIndexStart}`).value = asignatura.asignatura + '\n( ' + asignatura.semestre + ' ' + periodoType + ' - ' + asignatura.carrera + ' )' + '\n( ' + asignatura.horario + ' )';
          sheet.getCell(`C${rowIndexStart}`).value = asignatura.horas;
        }
      }

      if (asignaturasCount > 1) {
        let rowIndexEnd = (terceraTablaInicio + 2) + asignaturasCount - 1;
        sheet.mergeCells('A' + (terceraTablaInicio + 2) + ':A' + rowIndexEnd);
        sheet.mergeCells('D' + (terceraTablaInicio + 2) + ':D' + rowIndexEnd);
        sheet.mergeCells('E' + (terceraTablaInicio + 2) + ':E' + rowIndexEnd);
        sheet.mergeCells('F' + (terceraTablaInicio + 2) + ':F' + rowIndexEnd);
      }

      terceraTablaInicio += asignaturasCount;
    }


    // Aplicar bordes oscuros a la tabla
    startRowIndex = segundaTablaFinal + 3;
    endRowIndex = terceraTablaInicio + 1;
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
        /* cell.alignment.wrapText = true; */
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
