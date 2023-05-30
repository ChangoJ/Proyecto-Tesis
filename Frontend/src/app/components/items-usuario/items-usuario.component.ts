import { Component, Input, ViewChild } from '@angular/core';
import { UsuarioService } from '../services/usuario.service';
import { MatTableDataSource } from '@angular/material/table';
import { Usuario } from '../models/usuario';
import { ActivatedRoute, Router } from '@angular/router';
import { Global } from '../services/global';
import { MatPaginator } from '@angular/material/paginator';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-items-usuario',
  templateUrl: './items-usuario.component.html',
  styleUrls: ['./items-usuario.component.css'],
  providers: [UsuarioService]
})
export class ItemsUsuarioComponent {
  public colorCuadro = document.querySelector(".color-square")
  public url: string
  public usuariosFiltrados!: MatTableDataSource<any>;
  public terminoBusquedaUsuarios: string = '';

  @Input() usuarios!: Usuario[]
  columnas = ['N°', 'Nombre', 'Usuario', 'Email', 'N° Celular', 'Rol', 'Acciones'];
  usuariosObtenidos: any[] = [];

  constructor(private _usuarioService: UsuarioService,
    private _route: ActivatedRoute,
    private _router: Router) {
    this.url = Global.url

  }

  @ViewChild('paginatorU', { static: false }) paginator!: MatPaginator;

  ngOnInit() {
    
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

        Swal.fire('Uusario borrado', 'El usuario ha sido borrado', 'success');
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
