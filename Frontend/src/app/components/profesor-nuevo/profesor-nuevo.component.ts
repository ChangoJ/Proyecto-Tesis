import Swal  from 'sweetalert2';
import { Global } from './../services/global';
import { Profesor } from './../models/profesor';
import { ProfesorService } from './../services/profesor.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Component } from '@angular/core';

@Component({
  selector: 'app-profesor-nuevo',
  templateUrl: './profesor-nuevo.component.html',
  styleUrls: ['./profesor-nuevo.component.css'],
  providers : [ProfesorService]
})
export class ProfesorNuevoComponent {
  public profesor!: Profesor
  public status!: string
  public is_edit!: boolean
  public page_title: string
  public url!: string
  public isChecked!: boolean


  constructor(
    private _route: ActivatedRoute,
    private _profesorService: ProfesorService, 
    private _router: Router
  ) { 
    this.profesor = new Profesor('','', '','','')
    this.page_title = "Crear Profesor"
    this.is_edit = false;
    this.url = Global.url
  }

  onSubmit(){
    

   this._profesorService.create(this.profesor).subscribe(
      response => {

        console.log(response.profesor)
        if (response.status == 'success') {
          this.status = 'success'
          this.profesor = response.profesor

          Swal.fire(
            'Profesor creada',
            'El profesor se ha creado correctamente',
            'success'
          )

          setTimeout(() => {
            this._router.navigate(['/especificacion/profesores']);
          }, 1200);
        } else {
          Swal.fire(
            'Profesor no creada',
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


  redirectProfesor(){
    this._router.navigate(['/especificacion/profesores'], { relativeTo: this._route });
  }

}
