import { Profesor } from './../models/profesor';
import Swal from 'sweetalert2';
import { Global } from './../services/global';
import { Asignatura } from './../models/asignatura';
import { AsignaturaService } from './../services/asignatura.service';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { Component, ViewChild } from '@angular/core';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { ProfesorService } from '../services/profesor.service';
import { NgForm } from '@angular/forms';


@Component({
  selector: 'app-asignatura-edit',
  templateUrl: '../asignatura-nuevo/asignatura-nuevo.component.html',
  styleUrls: ['./asignatura-edit.component.css'],
  providers: [AsignaturaService, ProfesorService]
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

  carreras: any[] = [
    { id: 1, textField: 'Enfermeria' },
    { id: 2, textField: 'Fisioterapia' },
    { id: 3, textField: 'Nutricion' },
    { id: 4, textField: 'Psicologia' },
    { id: 5, textField: 'Educacion Basica' },
    { id: 6, textField: 'Produccion Audiovisual' },
    { id: 7, textField: 'Contabilidad' },
    { id: 8, textField: 'Derecho' },
    { id: 9, textField: 'Economia' },
    { id: 10, textField: 'Software' },
    { id: 11, textField: 'Administracion de Empresas' },
    { id: 12, textField: 'Gastronomia' },
    { id: 13, textField: 'Turismo' }
  ];

  semestres: any[] = [
    { id: 1, textField: '1' },
    { id: 2, textField: '2' },
    { id: 3, textField: '3' },
    { id: 4, textField: '4' },
    { id: 5, textField: '5' },
    { id: 6, textField: '6' },
    { id: 7, textField: '7' },
    { id: 8, textField: '8' }
  ];
  
  ciclos: any[] = [
    { id: 1, textField: '1' },
    { id: 2, textField: '2' },
  ];

  horariosType: any[] = [
    { id: 1, textField: 'Diurno' },
    { id: 2, textField: 'Nocturno' }
  ];

  selectedCarreras: any[] = [];
  selectedHorarios: any[] = [];
  selectedSemestres: any[] = [];
  selectedProfesores: any[] = [];
  itemCarreraEdit: any[] = [];
  itemSemestreEdit: any[] = [];
  itemProfesoresEdit: any[] = [];
  itemHorarioEdit: any[] = []
  dropdownCarreras: IDropdownSettings = {};
  dropdownSemestres: IDropdownSettings = {};
  dropdownHorarios: IDropdownSettings = {};
  dropdownProfesores: IDropdownSettings = {};
  
  dropdownCiclos: IDropdownSettings = {};


  constructor(
    private _route: ActivatedRoute,
    private _asignaturaService: AsignaturaService,
    private _profesorService: ProfesorService,
    private _router: Router
  ) {
    this.asignatura = new Asignatura('', '', [], [], [], '', 0, '', '#000000')
    this.page_title = "Editar Asignatura"
    this.is_edit = true;
    this.url = Global.url
    this.asignatura.carrera = []
    this.asignatura.semestre = []
    this.selectedHorarios = []

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

    this.dropdownProfesores = {
      singleSelection: true,
      idField: '_id',
      textField: 'nombre',
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


  onSubmit() {
    this.asignatura.carrera = []
    this.asignatura.semestre = []
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
    if (this.itemHorarioEdit.length !== 0) {
    this.asignatura.horario = this.itemHorarioEdit[0].textField
  }
  if (this.asignatura.nombre === ""
    || this.asignatura.abreviatura === ""
    || this.asignatura.color === ""
    || this.asignatura.creditos === 0
    || this.asignatura.carrera.length === 0
    || this.asignatura.horario === ""
    || this.asignatura.profesor.length ===0
    || this.asignatura.semestre.length ===0
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


  ngOnInit() {
    this.getAsignatura();
    this.getProfesores();
  }


  getProfesores() {
    this._profesorService.getProfesores().subscribe(
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


  getAsignatura() {
    this._route.params.subscribe(params => {
      let id = params['id'];
      this._asignaturaService.getAsignatura(id).subscribe(
        response => {
          if (response.asignatura) {
            this.asignatura = response.asignatura
            this.selectedHorarios = this.horariosType.filter(horario => horario.textField === this.asignatura.horario);
            this.selectedCarreras = this.carreras.filter(carrera => this.asignatura.carrera.includes(carrera.textField));
            this.selectedSemestres = this.semestres.filter(semestre => this.asignatura.semestre.includes(semestre.textField));
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
  }

  onItemSemestreSelect(item: any) {
    this.itemSemestreEdit = item
  }


  onItemProfesoresSelect(item: any) {
    this.itemProfesoresEdit = item
  }

  onItemHorariosSelect(item: any) {
    this.itemHorarioEdit = item
  }

  allAsignaturas() {
    this._router.navigate(['/especificacion/asignaturas'])
  }



}
