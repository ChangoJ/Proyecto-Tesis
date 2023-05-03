import { Global } from './../services/global';
import { ActivatedRoute, Router } from '@angular/router';
import { Profesor } from './../models/profesor';
import { ProfesorService } from './../services/profesor.service';
import { Component, Input } from '@angular/core';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-items-profesor',
  templateUrl: './items-profesor.component.html',
  styleUrls: ['./items-profesor.component.css'],
  providers: [ProfesorService]
})
export class ItemsProfesorComponent {
  public colorCuadro = document.querySelector(".color-square")
  public url: string
  public profesoresFiltrados: any[] = [];
  public terminoBusquedaProfesor: string = '';

  @Input() profesores!: Profesor[]
  columnas = ['N°','Nombre', 'Contrato', 'Cargo', 'Area', 'Acciones'];
  profesoresObtenidos: any[] = [];
  
  constructor(  private _profesorService: ProfesorService,
    private _route: ActivatedRoute,
    private _router: Router){
    this.url = Global.url
    this.profesoresFiltrados = []
    
  }

ngOnInit() {
 this._profesorService.getProfesores().subscribe(
      response => {
        if (response.profesores) {
          this.profesoresObtenidos = response.profesores
          this.profesoresFiltrados =  this.profesoresObtenidos;
        }
      },
      error => {
        console.log(error)
      }
    )  
    
  }

  delete(id: string) {

    Swal.fire({
      title: '¿Estás seguro?',
      text: 'El profesor se eliminará permanentemente',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Delete',
    }).then((result:any) => {
      if (result.isConfirmed) {
        this._profesorService.delete(id).subscribe(
          (response) => {
            setTimeout(() => {
              location.reload();
            }, 1200);
          },
          (error) => {
            console.log(error);
            this._router.navigate(['/especificacion/profesores']);
          }
        );

        Swal.fire('Profesor borrada', 'El profesor ha sido borrado', 'success');
      } else {
        Swal.fire('Operación cancelada', 'El profesor no ha sido borrado', 'warning');
      }
    });
  
    
  }

  filtrarProfesores() {
    const terminosBusqueda = this.terminoBusquedaProfesor.split(' ').join('|');
    const regexBusqueda = new RegExp(terminosBusqueda, 'gi');
    this.profesoresFiltrados = this.profesoresObtenidos.filter(profesor => 
        profesor.nombre.toLowerCase().match(regexBusqueda) ||
        profesor.cargo.toLowerCase().match(regexBusqueda) ||
        profesor.area.toLowerCase().match(regexBusqueda)||
        profesor.contrato.toLowerCase().match(regexBusqueda)
    );
}

  allProfesores(){
    this._router.navigate(['/especificacion/profesores'])
    location.reload();
  }

  redirectEdit(id:any){
    this._router.navigate(['/especificacion/profesores/editarProfesor/',id])
    
  }
}
