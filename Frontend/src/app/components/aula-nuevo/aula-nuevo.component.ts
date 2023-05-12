import Swal  from 'sweetalert2';
import { Global } from './../services/global';
import { AulaService } from './../services/aula.service';
import { Aula } from './../models/aula';
import { ActivatedRoute, Router } from '@angular/router';
import { Component } from '@angular/core';
import { IDropdownSettings } from 'ng-multiselect-dropdown';

@Component({
  selector: 'app-aula-nuevo',
  templateUrl: './aula-nuevo.component.html',
  styleUrls: ['./aula-nuevo.component.css'],
  providers: [AulaService]
})
export class AulaNuevoComponent {
  public aula!: Aula
  public status!: string
  public is_edit!: boolean
  public page_title: string
  public url!: string
  public isChecked!: boolean
  public textoFormateado!:string

  public selectedUbicacion: any[] = [];
  public dropdownUbicacion: IDropdownSettings = {};

  ubicaciones: any[] = [
    { id: 1, textField: 'Campus Norte' },
    { id: 2, textField: 'Campus Colon' }
  ];

  constructor(
    private _route: ActivatedRoute,
    private _aulaService: AulaService, 
    private _router: Router
  ) { 
    this.aula = new Aula('', '', '','','','#000000')
    this.page_title = "Crear Aula"
    this.is_edit = false;
    this.url = Global.url
    this.selectedUbicacion = []

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
    console.log(this.selectedUbicacion)

    this.aula.ubicacion = this.selectedUbicacion[0].textField

    console.log(this.aula.ubicacion)

    if (this.isChecked === undefined || this.isChecked === false){
      this.aula.compartida = "No"
    }else{
      this.aula.compartida = "Si"
    }

   this._aulaService.create(this.aula).subscribe(
      response => {

        if (response.status == 'success') {
          this.status = 'success'
          this.aula = response.aula

          Swal.fire(
            'Aula creada',
            'La Aula se ha creado correctamente',
            'success'
          )

          setTimeout(() => {
            this._router.navigate(['/especificacion/aulas']);
          }, 1200);
        } else {
          Swal.fire(
            'Aula no creada',
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

}
