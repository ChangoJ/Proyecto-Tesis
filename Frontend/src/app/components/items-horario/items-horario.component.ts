import { Component } from '@angular/core';
import { Asignatura } from '../models/asignatura';
import { Horario } from '../models/horario';
import { ActivatedRoute, Router } from '@angular/router';
import { HorarioService } from '../services/horario.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-items-horario',
  templateUrl: './items-horario.component.html',
  styleUrls: ['./items-horario.component.css'],
  providers: [HorarioService]
})
export class ItemsHorarioComponent {
  public horarios!: Horario[];
  public indiceHora!: string
  public listaA: any[] = []
  public is_horario: boolean
  public horariosFiltrados: any[] = [];
  public terminoBusquedaHorario: string = '';

  constructor(
    private _route: ActivatedRoute,
    private _horarioService: HorarioService,
    private _router: Router
  ) {
    this.is_horario = false
    this.horariosFiltrados = []
  }

  ngOnInit() {
    this.getHorarios()
  }

  columnas = ['N°','Carrera', 'Semestre', 'Tipo', 'Acciones'];

  filtrarHorarios() {
    const terminosBusqueda = this.terminoBusquedaHorario.split(' ').join('|');
    const regexBusqueda = new RegExp(terminosBusqueda, 'gi');
    this.horariosFiltrados = this.horarios.filter(horario => 
        horario.carrera.toLowerCase().match(regexBusqueda) ||
        horario.semestre.toLowerCase().match(regexBusqueda) ||
        horario.tipoHorario.toLowerCase().match(regexBusqueda)
    );
}

  getHorarios(){
      this._horarioService.getHorarios().subscribe(
        response => {
          if (response.horarios) {
            this.horarios = response.horarios;
            this.horariosFiltrados = this.horarios
            console.log(this.horariosFiltrados)
            this.is_horario = true
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
      text: 'El horario se eliminará permanentemente',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Delete',
    }).then((result:any) => {
      if (result.isConfirmed) {
        this._horarioService.delete(id).subscribe(
          (response) => {
            setTimeout(() => {
              location.reload();
            }, 1200);
          },
          (error) => {
            console.log(error);
            this._router.navigate(['/horarios']);
          }
        );

        Swal.fire('Horario borrado', 'El horario ha sido borrado', 'success');
      } else {
        Swal.fire('Operación cancelada', 'El horario no ha sido borrado', 'warning');
      }
    });
  
    
  }

  redirectEdit(id:any){
    this._router.navigate(['/horarios/editarHorario',id])
    
  }


}
