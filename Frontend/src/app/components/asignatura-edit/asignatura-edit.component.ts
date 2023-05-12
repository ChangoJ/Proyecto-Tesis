import { Profesor } from './../models/profesor';
import Swal from 'sweetalert2';
import { Global } from './../services/global';
import { Asignatura } from './../models/asignatura';
import { AsignaturaService } from './../services/asignatura.service';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { Component } from '@angular/core';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { ProfesorService } from '../services/profesor.service';


@Component({
  selector: 'app-asignatura-edit',
  templateUrl: '../asignatura-nuevo/asignatura-nuevo.component.html',
  styleUrls: ['./asignatura-edit.component.css'],
  providers: [AsignaturaService, ProfesorService]
})
export class AsignaturaEditComponent {
  public asignatura!: Asignatura
  public profesor!: Profesor
  public profesores: any[] = []
  public status!: string
  public is_edit!: boolean
  public page_title: string
  public url!: string
  public asignaturanumber!: number/* 
  semestres = ["1", "2", "3", "4", " 5", "6", "7", "8", "9", "10", "11", " 12"]; */
  /* carreras = ["Enfermeria", "Fisioterapia", "Nutricion", "Psicologia", " Educacion Basica",
    "Produccion Audiovisual", "Contabilidad", "Derecho", "Economia", "Software", "Administracion de Empresas",
    "Gastronomia", "Turismo"]; */
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

  horariosType: any[] = [
    { id: 1, textField: 'Diurno' },
    { id: 2, textField: 'Nocturno' }
  ];

  selectedCarreras: any[] = [];
  itemCarreraEdit: any[] = [];
  itemSemestreEdit: any[] = [];
  itemProfesoresEdit: any[] = [];
  selectedHorarios: any[] = [];

  itemHorarioEdit: any[] = []
  selectedSemestres: any[] = [];
  selectedProfesores: any[] = [];
  dropdownCarreras: IDropdownSettings = {};
  dropdownSemestres: IDropdownSettings = {};
  dropdownHorarios: IDropdownSettings = {};
  dropdownProfesores: IDropdownSettings = {};


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
    console.log(this.selectedHorarios)
    let itemCarreraRecogida = this.itemCarreraEdit
    this.asignatura.carrera = []
    let itemCarreraDepu = []
    let itemCarreraGood = []
    for (const carrera of itemCarreraRecogida) {
      if (carrera.textField) {
        itemCarreraDepu.push(carrera.textField)
      } else {
        itemCarreraDepu.push(carrera)
      }
    }
    itemCarreraGood = itemCarreraDepu.filter((valor, indice, arreglo) => arreglo.indexOf(valor) === indice)

    for (const carrera of itemCarreraGood) {
      this.asignatura.carrera.push(carrera);
    }

    let itemSemestreRecogida = this.itemSemestreEdit
    this.asignatura.semestre = []
    let itemSemestreDepu = []
    let itemSemestreGood = []
    for (const semestre of itemSemestreRecogida) {
      if (semestre.textField) {
        itemSemestreDepu.push(semestre.textField)
      } else {
        itemSemestreDepu.push(semestre)
      }
    }
    itemSemestreGood = itemSemestreDepu.filter((valor, indice, arreglo) => arreglo.indexOf(valor) === indice)

    for (const semestre of itemSemestreGood) {
      this.asignatura.semestre.push(semestre);
    }

    this.asignatura.horario = this.itemHorarioEdit[0].textField

    console.log(this.asignatura.horario)
    this._asignaturaService.update(this.asignatura._id, this.asignatura).subscribe(
      response => {

        if (response.status == 'success') {
          this.status = 'success'
          this.asignatura = response.asignatura

          Swal.fire(
            'Asignatura modificada',
            'La Asignatura se ha modificado correctamente',
            'success'
          )
          setTimeout(() => {
            this._router.navigate(['/especificacion/asignaturas']);
          }, 1200);
        } else {
          Swal.fire(
            'Asignatura no se ha modificado',
            'Por favor, rellene los datos correctamente',
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



}
