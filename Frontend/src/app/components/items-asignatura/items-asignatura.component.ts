import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Global } from './../services/global';
import { Asignatura } from './../models/asignatura';
import { Component, Input } from '@angular/core';
import { AsignaturaService } from '../services/asignatura.service';

@Component({
  selector: 'app-items-asignatura',
  templateUrl: './items-asignatura.component.html',
  styleUrls: ['./items-asignatura.component.css'],
  providers: [AsignaturaService]
})
export class ItemsAsignaturaComponent {

  public colorCuadro = document.querySelector(".color-square")
  public url: string
  @Input() asignaturas!: Asignatura[]
  
  constructor(  private _asignaturaService: AsignaturaService,
    private _route: ActivatedRoute,
    private _router: Router){
    this.url = Global.url
  }

 
  ngOnInit() {
  
  }

  delete(id: string) {

    Swal.fire({
      title: '¿Estás seguro?',
      text: 'La asignatura se eliminará permanentemente',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Delete',
    }).then((result:any) => {
      if (result.isConfirmed) {
        this._asignaturaService.delete(id).subscribe(
          (response) => {
            setTimeout(() => {
              location.reload();
            }, 1200);
          },
          (error) => {
            console.log(error);
            this._router.navigate(['/especificacion/asignaturas']);
          }
        );

        Swal.fire('Asignatura borrada', 'La Asignatura ha sido borrado', 'success');
      } else {
        Swal.fire('Operación cancelada', 'La Asignatura no ha sido borrado', 'warning');
      }
    });
  
    
  }

  redirectEdit(id:any){
    this._router.navigate(['/especificacion/asignaturas/editarAsignatura/',id])
    
  }
}
