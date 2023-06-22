import { Component, ViewChild } from '@angular/core';
import { UsuarioService } from '../services/usuario.service';
import { Usuario } from '../models/usuario';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { NgForm } from '@angular/forms';
import { DetalleService } from '../services/detalle.service';

@Component({
  selector: 'app-usuario-edit',
  templateUrl: '.././usuario-nuevo/usuario-nuevo.component.html',
  styleUrls: ['./usuario-edit.component.css'],
  providers: [UsuarioService, DetalleService]
})
export class UsuarioEditComponent {
  @ViewChild('usuarioForm', { static: false }) usuarioForm!: NgForm;
  public user!: Usuario
  public status!: string
  public is_edit!: boolean
  public page_title!: string
  public url!: string
  public isChecked!: boolean
  public selectedRol!: any;
  public dropdownRoles: IDropdownSettings = {};
  public itemRolEdit: any;
  public roles: any


  constructor(
    private _route: ActivatedRoute,
    private _usuarioService: UsuarioService,
    private _router: Router,
    private _detalleService: DetalleService
  ) {
    this.user = new Usuario('', '', '', '', '', '', '')
    this.page_title = "Editar Usuario"
    this.is_edit = true;
    this.url = this._detalleService.Global.url

    this.dropdownRoles = {
      singleSelection: true,
      idField: 'id',
      textField: 'textField',
      selectAllText: 'Seleccionar todo',
      unSelectAllText: 'Deseleccionar todo',
      itemsShowLimit: 16,
      allowSearchFilter: true
    };

  }

  


  async onSubmit() {
    let controles: string[] = []
    Object.values(this.usuarioForm.controls).forEach(control => {
      control.markAsTouched();
      controles.push(control.status)
    });
    if (this.selectedRol.length !== 0) {
      this.user.rol = ''
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
        'Usuario no se ha modificado',
        'Por favor, rellene los datos correctamente.',
        'error'
      )

    } else {
      this._usuarioService.update(this.user._id, this.user).subscribe(
        response => {
          console.log(response)
          if (response.status == 'success') {
            this.status = 'success'
            this.user = response.profesor

            Swal.fire(
              'Usuario modificada',
              'El Usuario se ha modificado correctamente.',
              'success'
            )
            setTimeout(() => {
              this._router.navigate(['/especificacion/usuarios']);
            }, 1200);
          } else {
            Swal.fire(
              'Usuario no se ha modificado',
              'Por favor, rellene los datos correctamente.',
              'error'
            )
            this.status = 'error'
            setTimeout(() => {
              location.reload();
            }, 1200);
          }
        },
        error => {
          console.log(error)
          Swal.fire(
            error.error.message,
            'Por favor, rellene los datos correctamente.',
            'error'
          )
          this.status = 'error'
        }
      )
    }
  }

  ngOnInit() {
    this.getUsuario();

    this.getDataDetalles()
  }

      
   
  
  
    getDataDetalles() {
      this._detalleService.getRolesIndex().subscribe(roles => {
        this.roles = roles
      });
    }

  getUsuario() {
    this._route.params.subscribe(params => {
      let id = params['id'];
      this._usuarioService.getUsuario(id).subscribe(
        response => {
          if (response.usuario) {
            this.user = response.usuario
            this.selectedRol = this.roles.filter((rol: { textField: string; }) => rol.textField === this.user.rol);

          } else {
            this._router.navigate(['/especificacion/usuarios'], { relativeTo: this._route });
          }
        },
        error => {
          this._router.navigate(['/especificacion/usuarios'], { relativeTo: this._route });
        }
      )
    }
    )
  }




  redirectProfesor() {
    this._router.navigate(['/especificacion/usuarios'], { relativeTo: this._route });
  }



  onItemRolSelect(item: any) {
    this.itemRolEdit = item
  }

  allUsuarios() {
    this._router.navigate(['/especificacion/usuarios'])
  }
}
