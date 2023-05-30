import { Component } from '@angular/core';
import { UsuarioService } from '../services/usuario.service';
import { Usuario } from '../models/usuario';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { ActivatedRoute, Router } from '@angular/router';
import { Global } from '../services/global';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-usuario-edit',
  templateUrl: '.././usuario-nuevo/usuario-nuevo.component.html',
  styleUrls: ['./usuario-edit.component.css'],
  providers: [UsuarioService]
})
export class UsuarioEditComponent {
  public user!: Usuario
  public status!: string
  public is_edit!: boolean
  public page_title!: string
  public url!: string
  public isChecked!: boolean
  public selectedRol!: any;
  public dropdownRoles: IDropdownSettings = {};
  public itemRolEdit: any;


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
    this.user = new Usuario('', '', '', '', '', '')
    this.page_title = "Editar Usuario"
    this.is_edit = true;
    this.url = Global.url

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


  onSubmit() {
    this.user.rol = ''


    this.user.rol = this.itemRolEdit[0].textField

    this._usuarioService.update(this.user._id, this.user).subscribe(
      response => {

        if (response.status == 'success') {
          this.status = 'success'
          this.user = response.profesor

          Swal.fire(
            'Usuario modificada',
            'El Usuario se ha modificado correctamente',
            'success'
          )
          setTimeout(() => {
            this._router.navigate(['/especificacion/usuarios']);
          }, 1200);
        } else {
          Swal.fire(
            'Usuario no se ha modificado',
            'Por favor, rellene los datos correctamente',
            'error'
          )
          this.status = 'error'
          setTimeout(() => {
            location.reload();
          }, 1200);
        }
      },
      error => {
        this.status = 'error'
      }
    )
  }

  ngOnInit() {
    this.getUsuario();
  }

  getUsuario() {
    this._route.params.subscribe(params => {
      let id = params['id'];
      this._usuarioService.getUsuario(id).subscribe(
        response => {
          if (response.usuario) {
            this.user = response.usuario
            this.selectedRol = this.roles.filter(rol => rol.textField === this.user.rol);

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
