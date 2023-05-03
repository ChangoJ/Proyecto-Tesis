import { Profesor } from './../models/profesor';
import { IDropdownSettings } from './../../../../node_modules/ng-multiselect-dropdown/multiselect.model.d';
import { Global } from './../services/global';
import { Asignatura } from './../models/asignatura';
import { AsignaturaService } from './../services/asignatura.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Component } from '@angular/core';
import Swal from 'sweetalert2';
import { ProfesorService } from '../services/profesor.service';

@Component({
  selector: 'app-asignatura-nuevo',
  templateUrl: './asignatura-nuevo.component.html',
  styleUrls: ['./asignatura-nuevo.component.css'],
  providers: [AsignaturaService, ProfesorService]
})
export class AsignaturaNuevoComponent {
  public asignatura!: Asignatura
  public profesor!: Profesor
  public profesores: any[] = []
  itemProfesores: any[] = []
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
    { id: 8, textField: '8' },
    { id: 9, textField: '9' },
    { id: 10, textField: '10' },
    { id: 11, textField: '11' },
    { id: 12, textField: '12' },
  ];
  selectedCarreras: any[] = [];
  selectedSemestres: any[] = [];
  selectedProfesores: any[] = [];
  dropdownCarreras: IDropdownSettings = {};
  dropdownSemestres: IDropdownSettings = {};

  dropdownProfesores: IDropdownSettings = {};


  constructor(
    private _route: ActivatedRoute,
    private _asignaturaService: AsignaturaService,
    private _profesorService: ProfesorService,
    private _router: Router
  ) {
    this.asignatura = new Asignatura('', '', [], [], [],0, '', '#000000')
    this.page_title = "Crear Asignatura"
    this.is_edit = false;
    this.url = Global.url
    this.asignatura.carrera = []
    this.asignatura.semestre = []
    this.asignatura.profesor = []

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

    this.dropdownProfesores = {
      singleSelection: false,
      idField: '_id',
      textField: 'nombre',
      selectAllText: 'Seleccionar todo',
      unSelectAllText: 'Deseleccionar todo',
      itemsShowLimit: 13,
      allowSearchFilter: true
    };

  }


  ngOnInit() {
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
    for (const profesor of this.selectedProfesores) {
      await this.getProfesorId(profesor._id); // Utiliza await para esperar a que se complete la llamada a getProfesorId
    }


    for (const carrera of this.selectedCarreras) {
      this.asignatura.carrera.push(carrera.textField);
    }

    for (const semestre of this.selectedSemestres) {
      this.asignatura.semestre.push(semestre.textField);
    }
    
    this._asignaturaService.create(this.asignatura).subscribe(
      response => {
        if (response.status == 'success') {
          this.status = 'success'
          this.asignatura = response.asignatura

          Swal.fire(
            'Asignatura creada',
            'La Asignatura se ha creado correctamente',
            'success'
          )

          setTimeout(() => {
            this._router.navigate(['/especificacion/asignaturas']);
          }, 1200);
        } else {
          Swal.fire(
            'Asignatura no creada',
            'Por favor, rellene los datos correctamente',
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


  redirectAsignatura() {
    this._router.navigate(['/especificacion/asignaturas'], { relativeTo: this._route });
  }

  onItemCarreraSelect(item: any) {
  }

  onItemSemestreSelect(item: any) {
  }


  onItemProfesoresSelect(item: any) {
  }

}
