import Swal  from 'sweetalert2';
import { Global } from './../services/global';
import { AulaService } from './../services/aula.service';
import { Aula } from './../models/aula';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, ViewChild } from '@angular/core';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { MatCheckbox, MatCheckboxChange } from '@angular/material/checkbox';
import { NgForm } from '@angular/forms';


@Component({
  selector: 'app-aula-nuevo',
  templateUrl: './aula-nuevo.component.html',
  styleUrls: ['./aula-nuevo.component.css'],
  providers: [AulaService]
})
export class AulaNuevoComponent {
  
  @ViewChild('aulaForm', { static: false }) aulaForm!: NgForm;
  public aula!: Aula
  public status!: string
  public is_edit!: boolean
  public page_title: string
  public url!: string
  public isChecked!: boolean ;

  public textoFormateado!:string

  public selectedUbicacion: any[] = [];
  public dropdownUbicacion: IDropdownSettings = {};

  ubicaciones: any[] = [
    { id: 1, textField: 'Campus Norte' },
    { id: 2, textField: 'Campus Colon' },
    { id: 3, textField: 'ZOOM' }
  ];

  constructor(
    private _route: ActivatedRoute,
    private _aulaService: AulaService, 
    private _router: Router
  ) { 
    this.aula = new Aula('', '', '','','','#000000')
    this.page_title = "Nueva Aula/Laboratorio"
    this.is_edit = false;
    this.url = Global.url
    


    this.dropdownUbicacion = {
      singleSelection: true,
      idField: 'id',
      textField: 'textField',
      selectAllText: 'Seleccionar todo',
      unSelectAllText: 'Deseleccionar todo',
      itemsShowLimit: 2,
      allowSearchFilter: false
    };

  }

  onSubmit(){
    let controles: string[] = []
    Object.values(this.aulaForm.controls).forEach(control => {
      control.markAsTouched();
      controles.push(control.status)
    });
    if (this.selectedUbicacion.length !== 0) {
    this.aula.ubicacion = this.selectedUbicacion[0].textField
    }

    if (this.isChecked === undefined || this.isChecked === false){
      this.aula.compartida = "No"
    }else{
      this.aula.compartida = "Si"
    }
    if (this.aula.compartida === ""
      || this.aula.nombre === ""
      || this.aula.abreviatura === ""
      || this.aula.color === ""
      || this. aula.ubicacion.length == 0
      || controles.includes("INVALID")
    ) {
      Swal.fire(
        'Aula no creada',
        'Por favor, rellene los datos correctamente.',
        'error'
      )

    } else {
   this._aulaService.create(this.aula).subscribe(
      response => {

        if (response.status == 'success') {
          this.status = 'success'
          this.aula = response.aula

          Swal.fire(
            'Aula creada',
            'La Aula se ha creado correctamente.',
            'success'
          )

          setTimeout(() => {
            this._router.navigate(['/especificacion/aulas']);
          }, 1200);
        } else {
          Swal.fire(
            'Aula no creada',
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

  redirectAula(){
    this._router.navigate(['/especificacion/aulas'], { relativeTo: this._route });
  }

  onKeyUp() {
    this.aula.abreviatura = this.formatearTexto(this.aula.nombre);
  }


  formatearTexto(texto: string): string {
    const palabras = texto.split(' ');
    const resultado = palabras.map(palabra => {
      if (palabra.length > 1) {
        return palabra.substring(0, 2).toUpperCase() ;
      } else {
        return palabra.toUpperCase();
      }
    });
    return resultado.join('-');
  }

  onItemUbicacionSelect(item: any) {
  }

  checkboxChanged(item:any){
    console.log(item)
  }

  handleChange(item:any) {
    if(item.checked === false){
      this.isChecked = false
    }else{
      this.isChecked = true
    }
   }

   allAulas(){
    this._router.navigate(['/especificacion/aulas'])
  }
}
