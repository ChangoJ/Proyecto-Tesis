import { Global } from './../services/global';
import { ActivatedRoute, Router } from '@angular/router';
import { AulaService } from './../services/aula.service';
import { Aula } from './../models/aula';
import { Component } from '@angular/core';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-aula-edit',
  templateUrl: '../aula-nuevo/aula-nuevo.component.html',
  styleUrls: ['./aula-edit.component.css'],
  providers: [AulaService]
})
export class AulaEditComponent {
  public aula!: Aula
  public status!: string
  public is_edit!: boolean
  public page_title!: string
  public url!: string
  public isChecked!: boolean

  constructor(
    private _route: ActivatedRoute,
    private _aulaService: AulaService,
    private _router: Router
  ) {
    this.aula = new Aula('', '', '', '', '', '#000000')
    this.page_title = "Crear Aula"
    this.is_edit = true;
    this.url = Global.url
  }


  onSubmit() {

    if (this.isChecked === undefined || this.isChecked === false) {
      this.aula.compartida = "No"
    } else {
      this.aula.compartida = "Si"
    }
    this._aulaService.update(this.aula._id, this.aula).subscribe(
      response => {

        console.log(response.aula)
        if (response.status == 'success') {
          this.status = 'success'
          this.aula = response.aula

          Swal.fire(
            'Aula modificada',
            'La Asignatura se ha modificado correctamente',
            'success'
          )
          setTimeout(() => {
            this._router.navigate(['/especificacion/aulas']);
          }, 1200);
        } else {
          Swal.fire(
            'Aula no se ha modificado',
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
    this.getAula();
  }

  getAula() {
    this._route.params.subscribe(params => {
      let id = params['id'];
      console.log(id)
      this._aulaService.getAula(id).subscribe(
        response => {
          if (response.aula) {
            this.aula = response.aula
            if (this.aula.compartida === "No") {
              console.log(this.aula.compartida)
              this.isChecked = false
            } else {
              
              console.log("fuck"+this.aula.compartida)
              this.isChecked = true
            }
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
}
