import Swal  from 'sweetalert2';
import { Global } from './../services/global';
import { AulaService } from './../services/aula.service';
import { Aula } from './../models/aula';
import { ActivatedRoute, Router } from '@angular/router';
import { Component } from '@angular/core';

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


  constructor(
    private _route: ActivatedRoute,
    private _aulaService: AulaService, 
    private _router: Router
  ) { 
    this.aula = new Aula('', '', '','','','#000000')
    this.page_title = "Crear Aula"
    this.is_edit = false;
    this.url = Global.url
  }

  onSubmit(){
    
    if (this.isChecked === undefined || this.isChecked === false){
      this.aula.compartida = "No"
    }else{
      this.aula.compartida = "Si"
    }

   this._aulaService.create(this.aula).subscribe(
      response => {

        console.log(response.aula)
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

}
