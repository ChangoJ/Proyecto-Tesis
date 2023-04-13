import Swal  from 'sweetalert2';
import { Global } from './../services/global';
import { ActivatedRoute, Router } from '@angular/router';
import { AulaService } from './../services/aula.service';
import { Aula } from './../models/aula';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-items-aula',
  templateUrl: './items-aula.component.html',
  styleUrls: ['./items-aula.component.css'],
  providers: [AulaService]
})
export class ItemsAulaComponent {
  public colorCuadro = document.querySelector(".color-square")
  public url: string

  @Input() aulas!: Aula[]
  
  constructor(  private _aulaService: AulaService,
    private _route: ActivatedRoute,
    private _router: Router){
    this.url = Global.url
  }

  delete(id: string) {

    Swal.fire({
      title: '¿Estás seguro?',
      text: 'La aula se eliminará permanentemente',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Delete',
    }).then((result:any) => {
      if (result.isConfirmed) {
        this._aulaService.delete(id).subscribe(
          (response) => {
            setTimeout(() => {
              location.reload();
            }, 1200);
          },
          (error) => {
            console.log(error);
            this._router.navigate(['/especificacion/aulas']);
          }
        );

        Swal.fire('Aula borrada', 'La Aula ha sido borrado', 'success');
      } else {
        Swal.fire('Operación cancelada', 'La Aula no ha sido borrado', 'warning');
      }
    });
  
    
  }

  redirectEdit(id:any){
    this._router.navigate(['/especificacion/aulas/editarAula/',id])
    
  }
}
