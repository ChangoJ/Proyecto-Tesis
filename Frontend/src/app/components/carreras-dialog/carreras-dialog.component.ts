import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { HorarioService } from '../services/horario.service';
import { Horario } from '../models/horario';
import Swal from 'sweetalert2';
import { DetalleService } from '../services/detalle.service';

@Component({
  selector: 'app-carreras-dialog',
  templateUrl: './carreras-dialog.component.html',
  styleUrls: ['./carreras-dialog.component.css'],
  providers: [HorarioService, DetalleService]
})
export class CarrerasDialogComponent {
  public datoRecibido!: any;
  public selectedCarrera!: string;
  public selectedSemestre!: string;
  public selectedCiclo!: string;
  public periodoTIpo!: any
  public horarios: Horario[] = []
  public selectedCarreras: any[] = [];
  public selectedSemestres: any[] = [];
  public dropdownCarreras: IDropdownSettings = {};
  public dropdownSemestres: IDropdownSettings = {};
  public authToken!: any;
  public userData!: any;
  public carrerasFiltradas: any[] = [];
  public semestres: any;
  public ciclos: any
  public rolesCarreras: any;
  public carreras: any
  public selectedOpcionPregunta: any = ""
  public selectedParalelo!: string;
  public selectedPeriodoIngles!: string;
  public paralelos: any[] = [];
  public periodosIngles: any[] = [];


  constructor(
    public dialogRef: MatDialogRef<CarrerasDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _router: Router,
    private _route: ActivatedRoute,
    private _horarioService: HorarioService,
    private _detalleService: DetalleService
  ) {


    this.authToken = this._detalleService.authToken
    this.userData = this._detalleService.userData




    this.dropdownCarreras = {
      singleSelection: false,
      idField: 'id',
      textField: 'textField',
      selectAllText: 'Seleccionar todo',
      unSelectAllText: 'Deseleccionar todo',
      itemsShowLimit: 13,
      allowSearchFilter: true
    };

    this.dropdownSemestres = {
      singleSelection: false,
      idField: 'id',
      textField: 'textField',
      selectAllText: 'Seleccionar todo',
      unSelectAllText: 'Deseleccionar todo',
      itemsShowLimit: 13,
      allowSearchFilter: true
    };

  }

  ngOnInit() {

    this.getHorarios()

    this.authToken = localStorage.getItem('datosUsuario');
    this.userData = JSON.parse(this.authToken!)
    this.getDataDetalles()
  }

  getDataDetalles() {



    this._detalleService.getRolesCarrera().subscribe(rolesCarrera => {
      this.rolesCarreras = rolesCarrera
    });


    this._detalleService.getCarrerasIndex().subscribe(carreras => {
      this.carreras = carreras
      let carreraActual = this.rolesCarreras[this.userData.rol.toLowerCase().replace(/\s/g, "")];


      this.carrerasFiltradas = [];

      if (carreraActual) {
        this.carrerasFiltradas = this.carreras.filter((carrera: { textField: string; }) => carrera.textField.toLowerCase() === carreraActual.toLowerCase());
      } else {
        this.carrerasFiltradas = this.carreras;
      }
    });

    this._detalleService.getSemestresIndex().subscribe(semestres => {
      this.semestres = semestres
    });


    this._detalleService.getParalelos().subscribe(paralelos => {
      this.paralelos = paralelos
    });


    this._detalleService.getPeriodosIngles().subscribe(periodos => {
      this.periodosIngles = periodos
    });

    this._detalleService.getCiclosIndex().subscribe(ciclos => {
      this.ciclos = ciclos
      if (this.datoRecibido === "Horarios Nocturnos") {
        /* this.semestres = this.ciclos */
        this.periodoTIpo = "Ciclo"
      } else {

        this.periodoTIpo = "Semestre"
      }

    });


  }

  /*   getRolCarrera() {
      let carreraActual = this.rolesCarreras[this.userData.rol.toLowerCase()];
  
      this.carrerasFiltradas = [];
  
      if (carreraActual) {
        this.carrerasFiltradas = this.carreras.filter((carrera: { textField: string; }) => carrera.textField.toLowerCase() === carreraActual.toLowerCase());
      } else {
        this.carrerasFiltradas = this.carreras;
      }
  
    } */

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



  onCarreraSelected() {
    let existHorarioCarrera: boolean = false

    if (this.datoRecibido === "Horarios Nocturnos") {
      this.datoRecibido = "Horario Nocturno"
      this.periodoTIpo = "Ciclo"
    } else {
      this.datoRecibido = "Horario Diurno"
      this.periodoTIpo = "Semestre"
    }
    if (this.selectedParalelo === undefined) {
      this.selectedParalelo = ""
    }
    if (this.selectedCiclo === undefined) {
      this.selectedCiclo = ""
    }
    for (const horario of this.horarios) {
      if (horario.paralelo === undefined) {
        horario.paralelo = ""
      }

      if (horario.ciclo === undefined) {
        horario.ciclo = ""
      }
      if (horario.carrera === this.selectedCarrera && horario.semestre === this.selectedSemestre && horario.tipoHorario === this.datoRecibido && horario.ciclo === this.selectedCiclo && horario.paralelo === this.selectedParalelo) {
        existHorarioCarrera = true
      }
    }
    let ruta: any = ""

    let rutaEnviar: any = ""
    let title: any = ""
    if (this.datoRecibido === "Horario Diurno" && this.selectedOpcionPregunta === "si") {


      rutaEnviar = rutaEnviar = 'home/creacion/' + this.datoRecibido + '/' + this.selectedCarrera + '/' + this.selectedSemestre + '/' + this.selectedParalelo
      
      title = 'EL Horario de ' + this.selectedCarrera + ' del ' + this.selectedSemestre + ' ' + this.periodoTIpo +' - '+ 'paralelo '  + this.selectedParalelo +' '+' ya fue creado.' 
    } else if (this.datoRecibido === "Horario Diurno") {
      rutaEnviar = 'home/creacion/' + this.datoRecibido + '/' + this.selectedCarrera + '/' + this.selectedSemestre
      title = 'EL Horario de ' + this.selectedCarrera + ' del ' + this.selectedSemestre + ' ' + this.periodoTIpo + ' ya fue creado.'
    }

    if (this.datoRecibido === "Horario Nocturno" && this.selectedOpcionPregunta === "si") {
      rutaEnviar = rutaEnviar = 'home/creacion/' + this.datoRecibido + '/' + this.selectedCarrera + '/' + this.selectedSemestre + '/' + this.selectedCiclo + '/' + this.selectedParalelo
      title = 'EL Horario de ' + this.selectedCarrera + ' del ' + this.selectedSemestre + ' ' + 'semestre'  +this.selectedCiclo + ' ' + this.periodoTIpo + ' - '+ 'paralelo '  + this.selectedParalelo +' '+' ya fue creado.' 
    
    } else if (this.datoRecibido === "Horario Nocturno") {
      rutaEnviar = 'home/creacion/' + this.datoRecibido + '/' + this.selectedCarrera + '/' + this.selectedSemestre + '/' + this.selectedCiclo

      title = 'EL Horario de ' + this.selectedCarrera + ' del ' + this.selectedSemestre + ' ' + 'semestre'  +this.selectedCiclo + ' ' + this.periodoTIpo + ' ya fue creado.'
    }


    if (!existHorarioCarrera) {
      ruta = rutaEnviar
      ruta = ruta.replace(/\s+/g, "_");
      this._router.navigate([ruta], { relativeTo: this._route })
     setTimeout(() => {
        location.reload();
      }, 350); 
    } else {
      Swal.fire(
        title,
        'Por favor, si desea modificar vaya a la sección de horarios',
        'error'
      )

    }

  }
}
