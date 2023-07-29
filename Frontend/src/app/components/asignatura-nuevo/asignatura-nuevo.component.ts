import { Profesor } from './../models/profesor';
import { IDropdownSettings } from './../../../../node_modules/ng-multiselect-dropdown/multiselect.model.d';
import { Asignatura } from './../models/asignatura';
import { AsignaturaService } from './../services/asignatura.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, ViewChild } from '@angular/core';
import Swal from 'sweetalert2';
import { ProfesorService } from '../services/profesor.service';
import { NgForm } from '@angular/forms';
import { DetalleService } from '../services/detalle.service';

@Component({
  selector: 'app-asignatura-nuevo',
  templateUrl: './asignatura-nuevo.component.html',
  styleUrls: ['./asignatura-nuevo.component.css'],
  providers: [AsignaturaService, ProfesorService, DetalleService]
})
export class AsignaturaNuevoComponent {
  @ViewChild('asignaturaForm', { static: false }) asignaturaForm!: NgForm;
  public asignatura!: Asignatura
  public profesor!: Profesor
  public profesores: any[] = []
  itemProfesores: any[] = []
  public status!: string
  public is_edit!: boolean
  public page_title: string
  public url!: string
  public asignaturanumber!: number
  public carrerasFiltradas: any[] = [];
  public authToken: any;
  public userData: any;
  public rolesCarreras: any;
  public rolesCarrerasFilter: any;
  public carreras: any
  public semestres: any
  public ciclos: any
  public horariosType: any
  public periodosIngles: any[] = [];
  public selectedCarreras: any[] = [];
  public selectedSemestres: any[] = [];
  public selectedCiclos: any[] = [];
  public selectedProfesores: any[] = [];
  public selectedHorarios: any[];
  public selectedPeriodoIngles: any[] = [];
  public dropdownCarreras: IDropdownSettings = {};
  public dropdownSemestres: IDropdownSettings = {};
  public dropdownCiclos: IDropdownSettings = {};
  public dropdownPeriodosIngles: IDropdownSettings = {};
  public dropdownHorarios: IDropdownSettings = {};
  public dropdownProfesores: IDropdownSettings = {};
  public dropdownParalelos: IDropdownSettings = {};
  public paralelos: any[] = [];
  public selectedParalelos: any;
  itemCarreraEdit: any[] = [];


  constructor(
    private _route: ActivatedRoute,
    private _asignaturaService: AsignaturaService,
    private _profesorService: ProfesorService,
    private _router: Router,
    private _detalleService: DetalleService
  ) {
    this.asignatura = new Asignatura('', '', [], [], [], '', 0, '', '#000000')
    this.page_title = "Crear Asignatura"
    this.is_edit = false;
    this.url = this._detalleService.Global.url
    this.asignatura.carrera = []
    this.asignatura.semestre = []
    this.asignatura.profesor = []
    this.selectedHorarios = []
    this.authToken = this._detalleService.authToken
    this.userData = this._detalleService.userData
    this.horariosType = this._detalleService.horariosType

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

    this.dropdownCiclos = {
      singleSelection: false,
      idField: 'id',
      textField: 'textField',
      selectAllText: 'Seleccionar todo',
      unSelectAllText: 'Deseleccionar todo',
      itemsShowLimit: 13,
      allowSearchFilter: true
    };

    this.dropdownPeriodosIngles = {
      singleSelection: false,
      idField: 'id',
      textField: 'textField',
      selectAllText: 'Seleccionar todo',
      unSelectAllText: 'Deseleccionar todo',
      itemsShowLimit: 13,
      allowSearchFilter: true
    };



    this.dropdownProfesores = {
      singleSelection: false,
      idField: '_id',
      textField: 'nombre',
      selectAllText: 'Seleccionar todo',
      unSelectAllText: 'Deseleccionar todo',
      itemsShowLimit: 13,
      allowSearchFilter: true
    };

    this.dropdownParalelos = {
      singleSelection: true,
      idField: 'id',
      textField: 'textField',
      selectAllText: 'Seleccionar todo',
      unSelectAllText: 'Deseleccionar todo',
      itemsShowLimit: 13,
      allowSearchFilter: true
    };


    this.dropdownHorarios = {
      singleSelection: true,
      idField: 'id',
      textField: 'textField',
      selectAllText: 'Seleccionar todo',
      unSelectAllText: 'Deseleccionar todo',
      itemsShowLimit: 2,
      allowSearchFilter: false
    };
  }




  ngOnInit() {
    this.getProfesores()
    this.getDataDetalles()
  }

  getDataDetalles() {
    this._detalleService.getCarrerasIndex().subscribe(carreras => {
      this.carreras = carreras
    });

    this._detalleService.getSemestresIndex().subscribe(semestres => {
      this.semestres = semestres
    });
    this._detalleService.getCiclosIndex().subscribe(ciclos => {
      this.ciclos = ciclos
    });
    this._detalleService.getRolesIndex().subscribe(roles => {
      this.rolesCarreras = roles
    });

    this._detalleService.getRolesCarrera().subscribe(roles => {
      this.rolesCarrerasFilter = roles
    });


    this._detalleService.getPeriodosInglesIndex().subscribe(periodos => {
      this.periodosIngles = periodos
    });

    this._detalleService.getParalelosIndex().subscribe(paralelos => {
      this.paralelos = paralelos
    });

  }

  getProfesores() {
    this._profesorService.getProfesores().subscribe(
      response => {
        if (response.profesores) {
          this.profesores = response.profesores;
          let carreraActual = this.rolesCarrerasFilter[this.userData.rol.toLowerCase().replace(/\s/g, "")];

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


  async getProfesorId(id: any) {
    return new Promise<void>((resolve, reject) => {
      this._profesorService.getProfesor(id).subscribe(
        response => {
          if (response.profesor) {
            this.asignatura.profesor.push(response.profesor);
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

  async onSubmit() {
    this.asignatura.semestre = []
    this.asignatura.carrera = []
    this.asignatura.paralelo = []
    this.asignatura.ciclo = []
    this.asignatura.profesor = []
    this.asignatura.horario = ''
    let controles: string[] = []
    Object.values(this.asignaturaForm.controls).forEach(control => {
      control.markAsTouched();
      controles.push(control.status)
    });

    for (const profesor of this.selectedProfesores) {
      await this.getProfesorId(profesor._id); // Utiliza await para esperar a que se complete la llamada a getProfesorId
    }


    for (const carrera of this.selectedCarreras) {
      this.asignatura.carrera.push(carrera.textField);
    }

    for (const semestre of this.selectedSemestres) {
      this.asignatura.semestre.push(semestre.textField);
    }

    if (this.selectedCiclos && this.selectedCiclos.length > 0) {
      for (const ciclo of this.selectedCiclos) {
        this.asignatura.ciclo.push(ciclo.textField);
      }
    }

    if (this.selectedParalelos && this.selectedParalelos.length > 0) {
      for (const paralelo of this.selectedParalelos) {
        this.asignatura.paralelo.push(paralelo.textField);
      }
    }




    if (this.selectedHorarios.length !== 0) {
      this.asignatura.horario = this.selectedHorarios[0].textField
    }
    if (this.asignatura.nombre === ""
      || this.asignatura.abreviatura === ""
      || this.asignatura.color === ""
      || this.asignatura.creditos === 0
      || this.asignatura.carrera.length === 0
      || this.asignatura.horario === ""
      || this.asignatura.profesor.length === 0
      || this.asignatura.semestre.length === 0
      || controles.includes("INVALID")
    ) {
      Swal.fire(
        'Asignatura no creada',
        'Por favor, rellene los datos correctamente',
        'error'
      )

    } else {

      this._asignaturaService.create(this.asignatura).subscribe(
        response => {
          console.log(response)
          if (response.status == 'success') {
            this.status = 'success'
            this.asignatura = response.asignatura

            Swal.fire(
              'Asignatura creada',
              'La Asignatura se ha creado correctamente.',
              'success'
            )

            setTimeout(() => {
              this._router.navigate(['/especificacion/asignaturas']);
            }, 1200);
          } else {
            Swal.fire(
              'Asignatura no creada',
              'Por favor, rellene los datos correctamente.',
              'error'
            )
            this.status = 'error'
          }
        },
        error => {
          this.status = 'error'
        }
      )
    }
  }


  redirectAsignatura() {
    this._router.navigate(['/especificacion/asignaturas'], { relativeTo: this._route });
  }

  onItemCarreraSelect(item: any) {
  }

  onItemSemestreSelect(item: any) {
  }

  onItemCicloSelect(item: any) {
  }


  onItemProfesoresSelect(item: any) {
  }

  onItemParaleloSelect(item: any) {
  }

  onItemPeriodoInglesSelect(item: any) {

    this.selectedPeriodoIngles = []
  }

  onItemHorariosSelect(item: any) {
    this.selectedSemestres = []
    this.selectedPeriodoIngles = []
  }

  onKeyUp() {
    this.asignatura.abreviatura = this.formatearTexto(this.asignatura.nombre);
  }


  formatearTexto(texto: string): string {
    const palabras = texto.split(' ');
    const resultado = palabras.map(palabra => {
      if (palabra.length > 1) {
        return palabra.substring(0, 2).toUpperCase();
      } else {
        return palabra.toUpperCase();
      }
    });
    return resultado.join('-');
  }

  allAsignaturas() {
    this._router.navigate(['/especificacion/asignaturas'])
  }

}
