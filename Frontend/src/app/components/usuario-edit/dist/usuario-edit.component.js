"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.UsuarioEditComponent = void 0;
var core_1 = require("@angular/core");
var usuario_service_1 = require("../services/usuario.service");
var usuario_1 = require("../models/usuario");
var global_1 = require("../services/global");
var sweetalert2_1 = require("sweetalert2");
var UsuarioEditComponent = /** @class */ (function () {
    function UsuarioEditComponent(_route, _usuarioService, _router) {
        this._route = _route;
        this._usuarioService = _usuarioService;
        this._router = _router;
        this.dropdownRoles = {};
        this.roles = [
            { id: 1, textField: 'Administrador' },
            { id: 2, textField: 'Revisador' },
            { id: 3, textField: 'Aprobador' },
            { id: 4, textField: 'Enfermeria' },
            { id: 5, textField: 'Fisioterapia' },
            { id: 6, textField: 'Nutricion' },
            { id: 7, textField: 'Psicologia' },
            { id: 8, textField: 'Educacion Basica' },
            { id: 9, textField: 'produccionAudiovisual' },
            { id: 10, textField: 'Contabilidad' },
            { id: 11, textField: 'Derecho' },
            { id: 12, textField: 'Economia' },
            { id: 13, textField: 'Software' },
            { id: 14, textField: 'AadministracionEmpresas' },
            { id: 15, textField: 'Gastronomia' },
            { id: 16, textField: 'Turismo' }
        ];
        this.user = new usuario_1.Usuario('', '', '', '', '', '', '');
        this.page_title = "Editar Usuario";
        this.is_edit = true;
        this.url = global_1.Global.url;
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
    UsuarioEditComponent.prototype.onSubmit = function () {
        return __awaiter(this, void 0, void 0, function () {
            var controles;
            var _this = this;
            return __generator(this, function (_a) {
                controles = [];
                Object.values(this.usuarioForm.controls).forEach(function (control) {
                    control.markAsTouched();
                    controles.push(control.status);
                });
                if (this.selectedRol.length !== 0) {
                    this.user.rol = '';
                    this.user.rol = this.selectedRol[0].textField;
                }
                if (this.user.ci === ""
                    || this.user.nombre === ""
                    || this.user.email === ""
                    || this.user.rol === ""
                    || this.user.username === ""
                    || this.user.contrasena === ""
                    || this.user.phoneNumber === undefined
                    || this.user.phoneNumber === ""
                    || controles.includes("INVALID")) {
                    sweetalert2_1["default"].fire('Usuario no se ha modificado', 'Por favor, rellene los datos correctamente.', 'error');
                }
                else {
                    this._usuarioService.update(this.user._id, this.user).subscribe(function (response) {
                        console.log(response);
                        if (response.status == 'success') {
                            _this.status = 'success';
                            _this.user = response.profesor;
                            sweetalert2_1["default"].fire('Usuario modificada', 'El Usuario se ha modificado correctamente.', 'success');
                            setTimeout(function () {
                                _this._router.navigate(['/especificacion/usuarios']);
                            }, 1200);
                        }
                        else {
                            sweetalert2_1["default"].fire('Usuario no se ha modificado', 'Por favor, rellene los datos correctamente.', 'error');
                            _this.status = 'error';
                            setTimeout(function () {
                                location.reload();
                            }, 1200);
                        }
                    }, function (error) {
                        console.log(error);
                        sweetalert2_1["default"].fire(error.error.message, 'Por favor, rellene los datos correctamente.', 'error');
                        _this.status = 'error';
                    });
                }
                return [2 /*return*/];
            });
        });
    };
    UsuarioEditComponent.prototype.ngOnInit = function () {
        this.getUsuario();
    };
    UsuarioEditComponent.prototype.getUsuario = function () {
        var _this = this;
        this._route.params.subscribe(function (params) {
            var id = params['id'];
            _this._usuarioService.getUsuario(id).subscribe(function (response) {
                if (response.usuario) {
                    _this.user = response.usuario;
                    _this.selectedRol = _this.roles.filter(function (rol) { return rol.textField === _this.user.rol; });
                }
                else {
                    _this._router.navigate(['/especificacion/usuarios'], { relativeTo: _this._route });
                }
            }, function (error) {
                _this._router.navigate(['/especificacion/usuarios'], { relativeTo: _this._route });
            });
        });
    };
    UsuarioEditComponent.prototype.redirectProfesor = function () {
        this._router.navigate(['/especificacion/usuarios'], { relativeTo: this._route });
    };
    UsuarioEditComponent.prototype.onItemRolSelect = function (item) {
        this.itemRolEdit = item;
    };
    UsuarioEditComponent.prototype.allUsuarios = function () {
        this._router.navigate(['/especificacion/usuarios']);
    };
    __decorate([
        core_1.ViewChild('usuarioForm', { static: false })
    ], UsuarioEditComponent.prototype, "usuarioForm");
    UsuarioEditComponent = __decorate([
        core_1.Component({
            selector: 'app-usuario-edit',
            templateUrl: '.././usuario-nuevo/usuario-nuevo.component.html',
            styleUrls: ['./usuario-edit.component.css'],
            providers: [usuario_service_1.UsuarioService]
        })
    ], UsuarioEditComponent);
    return UsuarioEditComponent;
}());
exports.UsuarioEditComponent = UsuarioEditComponent;
