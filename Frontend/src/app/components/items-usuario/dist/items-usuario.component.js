"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.ItemsUsuarioComponent = void 0;
var core_1 = require("@angular/core");
var usuario_service_1 = require("../services/usuario.service");
var table_1 = require("@angular/material/table");
var sweetalert2_1 = require("sweetalert2");
var detalle_service_1 = require("../services/detalle.service");
var horario_service_1 = require("../services/horario.service");
var ItemsUsuarioComponent = /** @class */ (function () {
    function ItemsUsuarioComponent(_usuarioService, _route, _router, _detalleService, _horarioService) {
        this._usuarioService = _usuarioService;
        this._route = _route;
        this._router = _router;
        this._detalleService = _detalleService;
        this._horarioService = _horarioService;
        this.terminoBusquedaUsuarios = '';
        this.columnas = ['N°', 'Nombre', 'Usuario', 'CI', 'Email', 'N° Celular', 'Rol', 'Acciones'];
        this.usuariosObtenidos = [];
        this.url = this._detalleService.Global.url;
    }
    ItemsUsuarioComponent.prototype.ngOnInit = function () {
        this.getUsuarios();
        this.getHorarios();
    };
    ItemsUsuarioComponent.prototype.getUsuarios = function () {
        var _this = this;
        this._usuarioService.getUsuarios().subscribe(function (response) {
            if (response.usuarios) {
                _this.usuariosObtenidos = response.usuarios;
                _this.usuariosFiltrados = new table_1.MatTableDataSource(_this.usuariosObtenidos);
                _this.usuariosFiltrados.paginator = _this.paginator;
            }
        }, function (error) {
            console.log(error);
        });
    };
    ItemsUsuarioComponent.prototype.getHorarios = function () {
        var _this = this;
        this._horarioService.getHorarios().subscribe(function (response) {
            if (response.horarios) {
                _this.horarios = response.horarios;
            }
        }, function (error) {
            console.log(error);
        });
    };
    ItemsUsuarioComponent.prototype["delete"] = function (id) {
        var _this = this;
        sweetalert2_1["default"].fire({
            title: '¿Estás seguro?',
            text: 'El usuario se eliminará permanentemente',
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Delete'
        }).then(function (result) {
            if (result.isConfirmed) {
                var item_1 = [];
                var ubicacion_1 = [];
                var exist_usuario_1 = false;
                _this.horarios.forEach(function (horario) {
                    item_1 = horario.creado_por;
                    if (item_1._id === id) {
                        exist_usuario_1 = true;
                        if (!horario.paralelo || horario.paralelo === "") {
                            ubicacion_1 = horario.tipoHorario + ": " + horario.carrera + ' - ' + horario.semestre;
                        }
                        else {
                            ubicacion_1 = horario.tipoHorario + ": " + horario.carrera + ' - ' + horario.semestre + ' Paralelo (' + horario.paralelo + ')';
                        }
                    }
                });
                if (!exist_usuario_1) {
                    _this._usuarioService["delete"](id).subscribe(function (response) {
                        setTimeout(function () {
                            location.reload();
                        }, 1200);
                    }, function (error) {
                        console.log(error);
                        _this._router.navigate(['/especificacion/usuarios']);
                    });
                    sweetalert2_1["default"].fire('Usuario borrado', 'El usuario ha sido borrado', 'success');
                }
                else {
                    sweetalert2_1["default"].fire('Usuario no borrada', 'Si deseas borrarlo, primero borra el horario que creo el usuario: ' + ubicacion_1, 'error');
                }
            }
            else {
                sweetalert2_1["default"].fire('Operación cancelada', 'El usuario no ha sido borrado', 'warning');
            }
        });
    };
    ItemsUsuarioComponent.prototype.filtrarUsuarios = function () {
        var terminosBusqueda = this.terminoBusquedaUsuarios.split(' ').join(' | ');
        console.log(terminosBusqueda);
        var regexBusqueda = new RegExp(terminosBusqueda, 'gi');
        this.usuariosFiltrados = new table_1.MatTableDataSource(this.usuariosObtenidos.filter(function (usuario) {
            return usuario.nombre.toString().toLowerCase().match(regexBusqueda) ||
                usuario.usuario.toString().toLowerCase().match(regexBusqueda) ||
                usuario.email.toString().toLowerCase().match(regexBusqueda) ||
                usuario.phoneNumber.toString().toLowerCase().match(regexBusqueda) ||
                usuario.rol.toString().toLowerCase().match(regexBusqueda);
        }));
    };
    ItemsUsuarioComponent.prototype.allUsuarios = function () {
        this._router.navigate(['/especificacion/usuarios']);
        location.reload();
    };
    ItemsUsuarioComponent.prototype.redirectEdit = function (id) {
        this._router.navigate(['/especificacion/usuarios/editarUsuario/', id]);
    };
    __decorate([
        core_1.Input()
    ], ItemsUsuarioComponent.prototype, "usuarios");
    __decorate([
        core_1.ViewChild('paginatorU', { static: false })
    ], ItemsUsuarioComponent.prototype, "paginator");
    ItemsUsuarioComponent = __decorate([
        core_1.Component({
            selector: 'app-items-usuario',
            templateUrl: './items-usuario.component.html',
            styleUrls: ['./items-usuario.component.css'],
            providers: [usuario_service_1.UsuarioService, detalle_service_1.DetalleService, horario_service_1.HorarioService]
        })
    ], ItemsUsuarioComponent);
    return ItemsUsuarioComponent;
}());
exports.ItemsUsuarioComponent = ItemsUsuarioComponent;
