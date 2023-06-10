import { Global } from './../services/global';
import { ActivatedRoute, Router } from '@angular/router';
import { AulaService } from './../services/aula.service';
import { Aula } from './../models/aula';
import { Component, ViewChild } from '@angular/core';
import Swal from 'sweetalert2';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-aula-edit',
  templateUrl: '../aula-nuevo/aula-nuevo.component.html',
  styleUrls: ['./aula-edit.component.css'],
  providers: [AulaService]
})
export class AulaEditComponent {
  @ViewChild('aulaForm', { static: false }) aulaForm!: NgForm;
  public aula!: Aula
  public status!: string
  public is_edit!: boolean
  public page_title!: string
  public url!: string
  public isChecked!: boolean 
  public textoFormateado!:string
  public selectedUbicacion: any[] = [];
  public dropdownUbicacion: IDropdownSettings = {};
  public itemUbicacionEdit: any;
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
    this.aula = new Aula('', '', '', '', '', '#000000')
    this.page_title = "Editar Aula"
    this.is_edit = true;
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


  onSubmit() {
    this.aula.ubicacion = ''
    let controles: string[] = []
    Object.values(this.aulaForm.controls).forEach(control => {
      control.markAsTouched();
      controles.push(control.status)
    });
    if (this.itemUbicacionEdit.length !== 0) {
    this.aula.ubicacion = this.itemUbicacionEdit[0].textField

  }

    if (this.isChecked === undefined || this.isChecked === false) {
      this.aula.compartida = "No"
    } else {
      this.aula.compartida = "Si"
    }
    if (this.aula.compartida === ""
    || this.aula.nombre === ""
    || this.aula.abreviatura === ""
    || this.aula.color === ""
    || this.aula.ubicacion === ""
    || controles.includes("INVALID")
  ) {
    Swal.fire(
      'Aula no se ha modificada',
      'Por favor, rellene los datos correctamente.',
      'error'
    )

  } else {
    this._aulaService.update(this.aula._id, this.aula).subscribe(
      response => {
        if (response.status == 'success') {
          this.status = 'success'
          this.aula = response.aula

          Swal.fire(
            'Aula modificada',
            'La Aula se ha modificado correctamente.',
            'success'
          )
          setTimeout(() => {
            this._router.navigate(['/especificacion/aulas']);
          }, 1200);
        } else {
          Swal.fire(
            'Aula no se ha modificado',
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

  ngOnInit() {
    this.getAula();
  }

  getAula() {
    this._route.params.subscribe(params => {
      let id = params['id'];
      this._aulaService.getAula(id).subscribe(
        response => {
          if (response.aula) {
            this.aula = response.aula
            if (this.aula.compartida === "No") {
              this.isChecked = false
            } else {
              this.isChecked = true
            }
            this.selectedUbicacion = this.ubicaciones.filter(ubicacion => ubicacion.textField === this.aula.ubicacion);
           

          } else {
            this._router.navigate(['/especificacion/aulas'], { relativeTo: this._route });
          }
        },
        error => {
          this._router.navigate(['/especificacion/aulas'], { relativeTo: this._route });
        }
      )
    }
    )
  }


  redirectAula() {
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
    this.itemUbicacionEdit = item
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
    location.reload();
  }
}
