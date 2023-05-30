import { Component } from '@angular/core';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { UsuarioService } from '../services/usuario.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Global } from '../services/global';
import Swal from 'sweetalert2';
import { Usuario } from '../models/usuario';

@Component({
  selector: 'app-usuario-nuevo',
  templateUrl: './usuario-nuevo.component.html',
  styleUrls: ['./usuario-nuevo.component.css'],
  providers: [UsuarioService]
})
export class UsuarioNuevoComponent {
  public user!: Usuario
  public status!: string
  public is_edit!: boolean
  public page_title: string
  public url!: string
  public isChecked!: boolean
  public selectedRol: any[] = [];
  public dropdownRoles: IDropdownSettings = {};



  roles: any[] = [
    { id: 1, textField: 'Administrador' },
    { id: 2, textField: 'Revisador' },
    { id: 3, textField: 'Aprobador' },
    { id: 4, textField: 'Enfermeria' },
    { id: 5, textField: 'Fisioterapia' },
    { id: 6, textField: 'Nutricion' },
    { id: 7, textField: 'Psicologia' },
    { id: 8, textField: 'Educacion Basica' },
    { id: 9, textField: 'Produccion Audiovisual' },
    { id: 10, textField: 'Contabilidad' },
    { id: 11, textField: 'Derecho' },
    { id: 12, textField: 'Economia' },
    { id: 13, textField: 'Software' },
    { id: 14, textField: 'Administracion de Empresas' },
    { id: 15, textField: 'Gastronomia' },
    { id: 16, textField: 'Turismo' }
  ];

  constructor(
    private _route: ActivatedRoute,
    private _usuarioService: UsuarioService,
    private _router: Router
  ) {
    this.user = new Usuario('','', '','','','')
    this.page_title = "Nuevo Usuario"
    this.is_edit = false;
    this.url = Global.url


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

  onSubmit() {


    this.user.rol = this.selectedRol[0].textField

    this._usuarioService.create(this.user).subscribe(
      response => {

        if (response.status == 'success') {
          this.status = 'success'
          this.user = response.usuario

          Swal.fire(
            'Usaurio creada',
            'El Usuario se ha creado correctamente',
            'success'
          )

          setTimeout(() => {
            this._router.navigate(['/especificacion/usuarios']);
          }, 1200);
        } else {
          Swal.fire(
            'Usuario no creada',
            'Por favor, rellene los datos correctamente',
            'error'
          )
          this.status = 'error'
        }
      },
      error => {
        this.status = 'error'
      }
    )
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
