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
  public aulasFiltrados: any[] = [];
  public terminoBusquedaAula: string = '';
  public aulasObtenidos: any[] = [];

  @Input() aulas!: Aula[]
  
  columnas = ['N°','Nombre', 'Ubicacion', 'Abreviatura', 'Compartida', 'Color','Acciones'];
  
  constructor(  private _aulaService: AulaService,
    private _route: ActivatedRoute,
    private _router: Router){
    this.url = Global.url
    this.aulasFiltrados = []
  }

  ngOnInit() {
    this._aulaService.getAulas().subscribe(
         response => {
           if (response.aulas) {
             this.aulasObtenidos = response.aulas
             this.aulasFiltrados =  this.aulasObtenidos;
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

  filtrarAulas() {
    const terminosBusqueda = this.terminoBusquedaAula.trim().toLowerCase();
    let regexBusqueda = new RegExp(`\\b${terminosBusqueda}\\b`, 'gi');
    this.aulasFiltrados = this.aulasObtenidos.filter(aula => 
      aula.nombre.toLowerCase().match(regexBusqueda) ||
      aula.ubicacion.toLowerCase().match(regexBusqueda) ||
      aula.compartida.toLowerCase().match(regexBusqueda) ||
      aula.abreviatura.toLowerCase().match(regexBusqueda) ||
      aula.color.toLowerCase().match(regexBusqueda)
    );
    if (this.aulasFiltrados.length === 0) {
      const terminosBusquedaSeparados = terminosBusqueda.split(' ');
      regexBusqueda = new RegExp(`(${terminosBusquedaSeparados.join('|')})`, 'gi');
      this.aulasFiltrados = this.aulasObtenidos.filter(aula => 
        aula.nombre.toLowerCase().match(regexBusqueda) ||
        aula.ubicacion.toLowerCase().match(regexBusqueda) ||
        aula.compartida.toLowerCase().match(regexBusqueda) ||
        aula.abreviatura.toLowerCase().match(regexBusqueda) ||
        aula.color.toLowerCase().match(regexBusqueda)
      );
    }
}

  allAulas(){
    this._router.navigate(['/especificacion/aulas'])
    location.reload();
  }

  redirectEdit(id:any){
    this._router.navigate(['/especificacion/aulas/editarAula/',id])
    
  }
}
