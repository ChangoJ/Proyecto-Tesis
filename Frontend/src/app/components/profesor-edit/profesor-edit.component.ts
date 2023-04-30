import { Global } from './../services/global';
import { ActivatedRoute, Router } from '@angular/router';
import { Profesor } from './../models/profesor';
import { ProfesorService } from './../services/profesor.service';
import { Component } from '@angular/core';
import Swal from 'sweetalert2';

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

  constructor(
    private _route: ActivatedRoute,
    private _profesorService: ProfesorService,
    private _router: Router
  ) {
    this.profesor = new Profesor('','', '', '', '')
    this.page_title = "Editar Aula"
    this.is_edit = true;
    this.url = Global.url
  }


  onSubmit() {

    this._profesorService.update(this.profesor._id, this.profesor).subscribe(
      response => {

        console.log(response.profesor)
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
      console.log(id)
      this._profesorService.getProfesor(id).subscribe(
        response => {
          if (response.profesor) {
            this.profesor = response.profesor
            
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
}
