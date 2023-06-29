import { Component, Input, ViewChild } from '@angular/core';
import { UsuarioService } from '../services/usuario.service';
import { MatTableDataSource } from '@angular/material/table';
import { Usuario } from '../models/usuario';
import { ActivatedRoute, Router } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import Swal from 'sweetalert2';
import { DetalleService } from '../services/detalle.service';
import { HorarioService } from '../services/horario.service';
import { Horario } from '../models/horario';

@Component({
  selector: 'app-items-usuario',
  templateUrl: './items-usuario.component.html',
  styleUrls: ['./items-usuario.component.css'],
  providers: [UsuarioService, DetalleService, HorarioService]
})
export class ItemsUsuarioComponent {
  public url: string
  public usuariosFiltrados!: MatTableDataSource<any>;
  public terminoBusquedaUsuarios: string = '';
  public horarios!: Horario[];

  @Input() usuarios!: Usuario[]
  columnas = ['N°', 'Nombre', 'Usuario','CI', 'Email', 'N° Celular', 'Rol', 'Acciones'];
  usuariosObtenidos: any[] = [];

  constructor(private _usuarioService: UsuarioService,
    private _route: ActivatedRoute,
    private _router: Router,
    private _detalleService: DetalleService,
    private _horarioService: HorarioService) {
    this.url = this._detalleService.Global.url

  }

  @ViewChild('paginatorU', { static: false }) paginator!: MatPaginator;

  ngOnInit() {
    this.getUsuarios()
   
    this.getHorarios()

  }

  getUsuarios(){
    this._usuarioService.getUsuarios().subscribe(
      response => {
        if (response.usuarios) {
          this.usuariosObtenidos = response.usuarios
          this.usuariosFiltrados = new MatTableDataSource<any>(this.usuariosObtenidos);
          this.usuariosFiltrados.paginator = this.paginator;
        }
      },
      error => {
        console.log(error)
      }
    )
  }

  getHorarios() {
    this._horarioService.getHorarios().subscribe(
      response => {
        if (response.horarios) {
          this.horarios = response.horarios;
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
      text: 'El usuario se eliminará permanentemente',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Delete',
    }).then((result: any) => {
      if (result.isConfirmed) {
        let item: any = []
        let ubicacion: any = []
        let exist_usuario: boolean = false
        this.horarios.forEach(horario => {
          item = horario.creado_por
            if (item._id === id) {
              exist_usuario = true
              if (!horario.paralelo || horario.paralelo === "") {

                ubicacion = horario.tipoHorario + ": " + horario.carrera + ' - ' + horario.semestre
              } else {

                ubicacion = horario.tipoHorario + ": " + horario.carrera + ' - ' + horario.semestre + ' Paralelo (' + horario.paralelo! + ')'
              }
            }
      
        });
        if (!exist_usuario) {
    this._usuarioService.delete(id).subscribe(
          (response) => {
            setTimeout(() => {
              location.reload();
            }, 1200);
          },
          (error) => {
            console.log(error);
            this._router.navigate(['/especificacion/usuarios']);
          }
        ); 

        Swal.fire('Usuario borrado', 'El usuario ha sido borrado', 'success');

      } else {
        Swal.fire('Usuario no borrada', 'Si deseas borrarlo, primero borra el horario que creo el usuario: ' + ubicacion, 'error');
      }

      } else {
        Swal.fire('Operación cancelada', 'El usuario no ha sido borrado', 'warning');
      }
    });


  }

 
  filtrarUsuarios() {
    let terminosBusqueda = this.terminoBusquedaUsuarios.split(' ').join(' | ');
    console.log(terminosBusqueda)
    let regexBusqueda = new RegExp(terminosBusqueda, 'gi');
    this.usuariosFiltrados = new MatTableDataSource<any>(this.usuariosObtenidos.filter(usuario =>
      usuario.nombre.toString().toLowerCase().match(regexBusqueda) ||
      usuario.usuario.toString().toLowerCase().match(regexBusqueda) ||
      usuario.email.toString().toLowerCase().match(regexBusqueda) ||
      usuario.phoneNumber.toString().toLowerCase().match(regexBusqueda) ||
      usuario.rol.toString().toLowerCase().match(regexBusqueda)
    ));
  }

  allUsuarios() {
    this._router.navigate(['/especificacion/usuarios'])
    location.reload();
  }


  redirectEdit(id: any) {
    this._router.navigate(['/especificacion/usuarios/editarUsuario/', id])

  }
}
