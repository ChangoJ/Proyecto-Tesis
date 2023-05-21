import { Global } from './../services/global';
import { ActivatedRoute, Router } from '@angular/router';
import { Profesor } from './../models/profesor';
import { ProfesorService } from './../services/profesor.service';
import { Component } from '@angular/core';
import Swal from 'sweetalert2';
import { IDropdownSettings } from 'ng-multiselect-dropdown';

@Component({
  selector: 'app-profesor-edit',
  templateUrl: '../profesor-nuevo/profesor-nuevo.component.html',
  styleUrls: ['./profesor-edit.component.css'],
  providers: [ProfesorService]
})
  export class ProfesorEditComponent {
  public profesor!: Profesor
  public status!: string
  public is_edit!: boolean
  public page_title!: string
  public url!: string
  public isChecked!: boolean
  public selectedCarreras: any[] = [];
  public dropdownCarreras: IDropdownSettings = {};
  public selectedContrato: any[] = [];
  public dropdownContrato: IDropdownSettings = {};
  public itemContratoEdit: any;
  public itemCarrerasEdit: any;

  contratos: any[] = [
    { id: 1, textField: 'Tiempo Completo' },
    { id: 2, textField: 'Medio Tiempo' },
    { id: 3, textField: 'Tiempo Parcial' }
  ];

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

  constructor(
    private _route: ActivatedRoute,
    private _profesorService: ProfesorService,
    private _router: Router
  ) {
    this.profesor = new Profesor('','', '', [])
    this.page_title = "Editar Aula"
    this.is_edit = true;
    this.url = Global.url

    this.dropdownCarreras = {
      singleSelection: false,
      idField: 'id',
      textField: 'textField',
      selectAllText: 'Seleccionar todo',
      unSelectAllText: 'Deseleccionar todo',
      itemsShowLimit: 13,
      allowSearchFilter: true
    };

    this.dropdownContrato = {
      singleSelection: true,
      idField: 'id',
      textField: 'textField',
      selectAllText: 'Seleccionar todo',
      unSelectAllText: 'Deseleccionar todo',
      itemsShowLimit: 3,
      allowSearchFilter: false
    };

  }


  onSubmit() {
    this.profesor.carrera = []
    this.profesor.contrato = ''

    for (const carrera of this.itemCarrerasEdit) {
      this.profesor.carrera.push(carrera.textField);
    }
    this.profesor.contrato = this.itemContratoEdit[0].textField

    this._profesorService.update(this.profesor._id, this.profesor).subscribe(
      response => {

        if (response.status == 'success') {
          this.status = 'success'
          this.profesor = response.profesor

          Swal.fire(
            'Profesor modificada',
            'El profesor se ha modificado correctamente',
            'success'
          )
          setTimeout(() => {
            this._router.navigate(['/especificacion/profesores']);
          }, 1200);
        } else {
          Swal.fire(
            'Profesor no se ha modificado',
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

  ngOnInit() {
    this.getProfesor();
  }

  getProfesor() {
    this._route.params.subscribe(params => {
      let id = params['id'];
      this._profesorService.getProfesor(id).subscribe(
        response => {
          if (response.profesor) {
            this.profesor = response.profesor
            this.selectedCarreras = this.carreras.filter(carrera => this.profesor.carrera.includes(carrera.textField));
            this.selectedContrato = this.contratos.filter(contrato => contrato.textField === this.profesor.contrato);
           
          } else {
            this._router.navigate(['/especificacion/profesores'], { relativeTo: this._route });
          }
        },
        error => {
          this._router.navigate(['/especificacion/profesores'], { relativeTo: this._route });
        }
      )
    }
    )
  }




  redirectProfesor() {
    this._router.navigate(['/especificacion/profesores'], { relativeTo: this._route });
  }

  onItemCarrerasSelect(item: any) {
    this.itemCarrerasEdit = item
  }

  onItemContratoSelect(item: any) {
    this.itemContratoEdit = item
  }
  
  allProfesores(){
    this._router.navigate(['/especificacion/profesores'])
  }

  resumenProfesores(){
    this._router.navigate(['/especificacion/profesores/resumen-profesores'])
    
    location.reload();
  }
}
