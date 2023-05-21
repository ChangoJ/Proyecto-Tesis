import { Component, ViewChild } from '@angular/core';
import { Horario } from '../models/horario';
import { ActivatedRoute, Router } from '@angular/router';
import { HorarioService } from '../services/horario.service';
import Swal from 'sweetalert2';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

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
  public horariosFiltrados!: MatTableDataSource<any>;
  public terminoBusquedaHorario: string = '';
  public ver: any;

  constructor(
    private _route: ActivatedRoute,
    private _horarioService: HorarioService,
    private _router: Router
  ) {
    this.is_horario = false
  }

  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;

  ngOnInit() {
    this.getHorarios()
    this.ver = "Ver";

  }

  columnas = ['N°','Carrera', 'Semestre', 'Tipo', 'Acciones'];

  filtrarHorarios() {
    let terminosBusqueda = this.terminoBusquedaHorario.split(' ').join('|');
    let regexBusqueda = new RegExp(terminosBusqueda, 'gi');
    this.horariosFiltrados= new MatTableDataSource<any>( this.horarios.filter(horario => 
        horario.carrera.toString().toLowerCase().match(regexBusqueda) ||
        horario.semestre.toString().toLowerCase().match(regexBusqueda) ||
        horario.tipoHorario.toString().toLowerCase().match(regexBusqueda)
    ));
}

  getHorarios(){
      this._horarioService.getHorarios().subscribe(
        response => {
          if (response.horarios) {
            this.is_horario = true
            this.horarios = response.horarios;
            this.horariosFiltrados = new MatTableDataSource<any>(this.horarios)
            this.horariosFiltrados.paginator = this.paginator
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
