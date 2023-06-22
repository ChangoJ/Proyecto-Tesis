import { Component, ViewChild } from '@angular/core';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { UsuarioService } from '../services/usuario.service';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Usuario } from '../models/usuario';
import { NgForm } from '@angular/forms';
import { DetalleService } from '../services/detalle.service';

@Component({
  selector: 'app-usuario-nuevo',
  templateUrl: './usuario-nuevo.component.html',
  styleUrls: ['./usuario-nuevo.component.css'],
  providers: [UsuarioService, DetalleService]
})
export class UsuarioNuevoComponent {
  @ViewChild('usuarioForm', { static: false }) usuarioForm!: NgForm;

  public user!: Usuario
  public status!: string
  public is_edit!: boolean
  public page_title: string
  public url!: string
  public isChecked!: boolean
  public selectedRol: any[] = [];
  public dropdownRoles: IDropdownSettings = {};
  public roles: any


 

  constructor(
    private _route: ActivatedRoute,
    private _usuarioService: UsuarioService,
    private _router: Router,
    private _detalleService: DetalleService
  ) {
    this.user = new Usuario('', '', '', '', '', '', '')
    this.page_title = "Nuevo Usuario"
    this.is_edit = false;
    this.url = this._detalleService.Global.url


    this.dropdownRoles = {
      singleSelection: true,
      idField: 'id',
      textField: 'textField',
      selectAllText: 'Seleccionar todo',
      unSelectAllText: 'Deseleccionar todo',
      itemsShowLimit: 13,
      allowSearchFilter: false
    };
  }

  ngOnInit() {
  this.getDataDetalles()
    
  }


  getDataDetalles() {
    this._detalleService.getRolesIndex().subscribe(roles => {
      console.log(roles)
      this.roles = roles
    });
  }

  async onSubmit() {
    let controles: string[] = []
    Object.values(this.usuarioForm.controls).forEach(control => {
      control.markAsTouched();
      controles.push(control.status)
    });
    if (this.selectedRol.length !== 0) {
      this.user.rol = this.selectedRol[0].textField
    }
    if (this.user.ci === ""
      || this.user.nombre === ""
      || this.user.email === ""
      || this.user.rol === ""
      || this.user.username === ""
      || this.user.contrasena === ""
      || this.user.phoneNumber === undefined
      || this.user.phoneNumber === ""
      || controles.includes("INVALID")
    ) {
      Swal.fire(
        'Usuario no creada',
        'Por favor, rellene los datos correctamente.',
        'error'
      )

    } else {
      this._usuarioService.create(this.user).subscribe(
        response => {
          console.log(response)
          if (response.status == 'success') {
            this.status = 'success'
            this.user = response.usuario

            Swal.fire(
              'Usuario creada',
              'El Usuario se ha creado correctamente.',
              'success'
            )

            setTimeout(() => {
              this._router.navigate(['/especificacion/usuarios']);
            }, 1200);
          } else {
            Swal.fire(
              response.message,
              'Por favor, rellene los datos correctamente.',
              'error'
            )
            this.status = 'error'
          }
        },
        error => {
          console.log(error)
          this.status = 'error'
        }
      )
    }

  }


  redirectUsuario() {
    this._router.navigate(['/especificacion/usuarios'], { relativeTo: this._route });
  }

  onItemRolSelect(item: any) {
  }



  allUsuarios() {
    this._router.navigate(['/especificacion/usuarios'])
  }

}
