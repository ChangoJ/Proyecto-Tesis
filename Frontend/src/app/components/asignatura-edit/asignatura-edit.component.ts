import { Profesor } from './../models/profesor';
import Swal from 'sweetalert2';
import { Asignatura } from './../models/asignatura';
import { AsignaturaService } from './../services/asignatura.service';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { Component, ViewChild } from '@angular/core';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { ProfesorService } from '../services/profesor.service';
import { NgForm } from '@angular/forms';
import { DetalleService } from '../services/detalle.service';


@Component({
  selector: 'app-asignatura-edit',
  templateUrl: '../asignatura-nuevo/asignatura-nuevo.component.html',
  styleUrls: ['./asignatura-edit.component.css'],
  providers: [AsignaturaService, ProfesorService, DetalleService]
})
export class AsignaturaEditComponent {
  @ViewChild('asignaturaForm', { static: false }) asignaturaForm!: NgForm;
  public asignatura!: Asignatura
  public profesor!: Profesor
  public profesores: any[] = []
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


  selectedCarreras: any[] = [];
  selectedHorarios: any[] = [];
  selectedSemestres: any[] = [];
  selectedProfesores: any[] = [];
  public selectedPeriodoIngles: any[] = [];
  public periodosIngles: any[] = [];
  itemCarreraEdit: any[] = [];
  itemSemestreEdit: any[] = [];
  itemProfesoresEdit: any[] = [];
  itemHorarioEdit: any[] = []
  dropdownCarreras: IDropdownSettings = {};
  dropdownSemestres: IDropdownSettings = {};
  dropdownHorarios: IDropdownSettings = {};
  dropdownProfesores: IDropdownSettings = {};
  public dropdownPeriodosIngles: IDropdownSettings = {};
  public dropdownParalelos: IDropdownSettings = {};
  public paralelos: any[] = [];
  public selectedParalelos: any;
  dropdownCiclos: IDropdownSettings = {};
  itemParalelosEdit: any;
  itemPeriodoInglesEdit: any;


  constructor(
    private _route: ActivatedRoute,
    private _asignaturaService: AsignaturaService,
    private _profesorService: ProfesorService,
    private _router: Router,
    private _detalleService: DetalleService
  ) {
    this.asignatura = new Asignatura('', '', [], [], [], '', 0, '', '#000000')
    this.page_title = "Editar Asignatura"
    this.is_edit = true;
    this.url = this._detalleService.Global.url
    this.asignatura.carrera = []
    this.asignatura.semestre = []
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
      singleSelection: true,
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
    this.getAsignatura();
    this.getProfesores();
    this.getDataDetalles();
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

    this._detalleService.getPeriodosInglesIndex().subscribe(periodos => {
      this.periodosIngles = periodos
    });

    this._detalleService.getRolesCarrera().subscribe(roles => {
      this.rolesCarrerasFilter = roles
    });



    this._detalleService.getParalelosIndex().subscribe(paralelos => {
      this.paralelos = paralelos
    });

  }

  onSubmit() {
    this.asignatura.carrera = []
    this.asignatura.semestre = []
    this.asignatura.paralelo = []
    this.asignatura.horario = ''
    let controles: string[] = []
    Object.values(this.asignaturaForm.controls).forEach(control => {
      control.markAsTouched();
      controles.push(control.status)
    });
    for (const carrera of this.itemCarreraEdit) {
      this.asignatura.carrera.push(carrera.textField);
    }

    for (const semestre of this.selectedSemestres) {
      this.asignatura.semestre.push(semestre.textField);
    }

    for (const paralelo of this.selectedParalelos) {
      this.asignatura.paralelo.push(paralelo.textField);
    }

    if (this.itemHorarioEdit.length !== 0) {
      this.asignatura.horario = this.itemHorarioEdit[0].textField
    }
    console.log(this.asignatura)
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
        'Asignatura no se ha modificada',
        'Por favor, rellene los datos correctamente.',
        'error'
      )

    } else {
      this._asignaturaService.update(this.asignatura._id, this.asignatura).subscribe(
        response => {

          if (response.status == 'success') {
            this.status = 'success'
            this.asignatura = response.asignatura

            Swal.fire(
              'Asignatura modificada',
              'La Asignatura se ha modificado correctamente.',
              'success'
            )
            setTimeout(() => {
              this._router.navigate(['/especificacion/asignaturas']);
            }, 1200);
          } else {
            Swal.fire(
              'Asignatura no se ha modificado',
              'Por favor, rellene los datos correctamente.',
              'error'
            )
            this.status = 'error'
            setTimeout(() => {
              location.reload();
            }, 1200);
          }
        },
        error => {
          this.status = 'error'
        }
      )
    }
  }

  onKeyUp() {
    this.asignatura.abreviatura = this.formatearTexto(this.asignatura.nombre);
  }


  formatearTexto(texto: string): string {
    console.log(texto)
    const palabras = texto.split(' ');
    console.log(palabras)
    const resultado = palabras.map(palabra => {
      if (palabra.length > 1) {
        return palabra.substring(0, 2).toUpperCase();
      } else {
        return palabra.toUpperCase();
      }
    });
    return resultado.join('-');
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




  getAsignatura() {
    this._route.params.subscribe(params => {
      let id = params['id'];
      this._asignaturaService.getAsignatura(id).subscribe(
        response => {
          if (response.asignatura) {
            this.asignatura = response.asignatura
            this.selectedHorarios = this.horariosType.filter((horario: { textField: string; }) => horario.textField === this.asignatura.horario);
            this.selectedCarreras = this.carreras.filter((carrera: { textField: String; }) => this.asignatura.carrera.includes(carrera.textField));
            this.selectedParalelos = this.paralelos.filter((paralelo: { textField: String; }) => this.asignatura.paralelo!.includes(paralelo.textField));
            
            this.selectedSemestres = this.semestres.filter((semestre: { textField: String; }) => this.asignatura.semestre.includes(semestre.textField));
            if(this.selectedCarreras[0].textField === "Ingles" && this.selectedCarreras.length === 1){
              this.selectedSemestres = this.periodosIngles.filter((semestre: { textField: String; }) => this.asignatura.semestre.includes(semestre.textField));
      
            }
          } else {
            this._router.navigate(['/especificacion/asignaturas'], { relativeTo: this._route });
          }
        },
        error => {
          this._router.navigate(['/especificacion/asignaturas'], { relativeTo: this._route });
        }
      )
    }
    )
  }

  redirectAsignatura() {
    this._router.navigate(['/especificacion/asignaturas'], { relativeTo: this._route });
  }

  onItemCarreraSelect(item: any) {
    this.itemCarreraEdit = item
    if(item.length > 1){
      
    this.selectedPeriodoIngles = []
    this.selectedSemestres = []
    }
    this.selectedHorarios = []
    
             
  }

  onItemSemestreSelect(item: any) {
    this.itemSemestreEdit = item
  }


  onItemProfesoresSelect(item: any) {
    this.itemProfesoresEdit = item
  }

  onItemPeriodoInglesSelect(item: any) {
    this.itemPeriodoInglesEdit = item
  }

  onItemParaleloSelect(item: any) {
    this.itemParalelosEdit = item
  }

  onItemHorariosSelect(item: any) {
    this.selectedSemestres = []
    this.selectedPeriodoIngles = []
    this.itemHorarioEdit = item
  }

  allAsignaturas() {
    this._router.navigate(['/especificacion/asignaturas'])
  }



}
