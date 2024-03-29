import Swal  from 'sweetalert2';
import { Profesor } from './../models/profesor';
import { ProfesorService } from './../services/profesor.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, ViewChild } from '@angular/core';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { NgForm } from '@angular/forms';
import { DetalleService } from '../services/detalle.service';

@Component({
  selector: 'app-profesor-nuevo',
  templateUrl: './profesor-nuevo.component.html',
  styleUrls: ['./profesor-nuevo.component.css'],
  providers : [ProfesorService, DetalleService]
})
export class ProfesorNuevoComponent {
  
  @ViewChild('profesorForm', { static: false }) profesorForm!: NgForm;
  public profesor!: Profesor
  public status!: string
  public is_edit!: boolean
  public page_title: string
  public url!: string
  public isChecked!: boolean
  public selectedCarreras: any[] = [];
  public dropdownCarreras: IDropdownSettings = {};
  public selectedContrato: any[] = [];
  public dropdownContrato: IDropdownSettings = {};
  public carreras : any
  public contratos: any[] = [
    { id: 1, textField: 'Tiempo Completo' },
    { id: 2, textField: 'Medio Tiempo' },
    { id: 3, textField: 'Tiempo Parcial' }
  ];

  constructor(
    private _route: ActivatedRoute,
    private _profesorService: ProfesorService, 
    private _router: Router,
    private _detalleService: DetalleService
  ) { 
    this.profesor = new Profesor('','', '',[],'')
    this.page_title = "Nuevo Profesor"
    this.is_edit = false;
    this.url = this._detalleService.Global.url


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

  ngOnInit() {
    this.getDataDetalles()
   
  }

  
  getDataDetalles(){
    this._detalleService.getCarrerasIndex().subscribe(carreras => {
      this.carreras = carreras 
    });
  }

  onSubmit(){
    this.profesor.carrera = []
    this.profesor.contrato = ''
    let controles: string[] = []
    Object.values(this.profesorForm.controls).forEach(control => {
      control.markAsTouched();
      controles.push(control.status)
    });
    
    for (const carrera of this.selectedCarreras) {
      this.profesor.carrera.push(carrera.textField);
    }
    if (this.selectedContrato.length !== 0) {
    this.profesor.contrato = this.selectedContrato[0].textField
  }
  if (this.profesor.carrera.length ===0
      || this.profesor.nombre === ""
      || this.profesor.contrato.length ===0
      || controles.includes("INVALID")
    ) {
      Swal.fire(
        'Profesor no creado',
        'Por favor, rellene los datos correctamente.',
        'error'
      )

    } else {
   this._profesorService.create(this.profesor).subscribe(
      response => {

        if (response.status == 'success') {
          this.status = 'success'
          this.profesor = response.profesor

          Swal.fire(
            'Profesor creado',
            'El profesor se ha creado correctamente.',
            'success'
          )

          setTimeout(() => {
            this._router.navigate(['/especificacion/profesores']);
          }, 1200);
        } else {
          Swal.fire(
            'Profesor no creado',
            'Por favor, rellene los datos correctamente.',
            'error'
          )
          this.status = 'error'
        }
      },
      error => {
        console.log(error)
        this.status = 'error'
      }
    ) 
    }
  }


  redirectProfesor(){
    this._router.navigate(['/especificacion/profesores'], { relativeTo: this._route });
  }

  onItemCarrerasSelect(item: any) {
  }

  onItemContratoSelect(item: any) {
  }

  allProfesores(){
    this._router.navigate(['/especificacion/profesores'])
  }

  resumenProfesores(){
    this._router.navigate(['/especificacion/profesores/resumen-profesores'])
    setTimeout(() => {
      location.reload();
    }, 400); 
   
  }

}
