"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.HomeComponent = void 0;
var core_1 = require("@angular/core");
var asignatura_service_1 = require("../services/asignatura.service");
var aula_service_1 = require("../services/aula.service");
var usuario_service_1 = require("../services/usuario.service");
var sweetalert2_1 = require("sweetalert2");
var HomeComponent = /** @class */ (function () {
    function HomeComponent(_usuarioService, _route, _asignaturaService) {
        this._usuarioService = _usuarioService;
        this._route = _route;
        this._asignaturaService = _asignaturaService;
        this.listaA = [];
        this.is_horario = false;
        this.authToken = localStorage.getItem('authToken');
        this.userData = localStorage.getItem('datosUsuario');
    }
    HomeComponent.prototype.ngOnInit = function () {
        this.getAsignaturas();
        this.getUsuario();
    };
    HomeComponent.prototype.getUsuario = function () {
        var _this = this;
        var tokenData = this._usuarioService.decodeToken(this.authToken);
        var userId = tokenData.userId;
        this._usuarioService.getUsuario(userId).subscribe(function (response) {
            if (response.usuario) {
                _this.nombreUsuario = response.usuario.nombre;
            }
        }, function (error) {
            console.log("No existe");
        });
    };
    HomeComponent.prototype.getAsignaturas = function () {
        var _this = this;
        var periodoTipo;
        var horario;
        this._route.params.subscribe(function (params) {
            var opcion2 = params['opcion2'];
            var opcion3 = params['opcion3'];
            var opcion4 = params['opcion4'];
            if (params['opcion1'] === "Horario_Nocturno") {
                periodoTipo = "Ciclo";
                horario = "Nocturno";
            }
            else {
                periodoTipo = "semestre";
                horario = "Diurno";
            }
            console.log(opcion2);
            if (opcion2 !== "undefined" || opcion3 !== "undefined") {
                var opcion2_1 = params['opcion2'];
                opcion2_1 = opcion2_1.replace(/_/g, " ");
                var opcion3_1 = params['opcion3'];
                opcion3_1 = opcion3_1.replace(/_/g, " ");
                if (opcion2_1 && opcion3_1 && !opcion4) {
                    _this._asignaturaService.search(opcion2_1, opcion3_1).subscribe(function (response) {
                        if (response.asignaturas) {
                            var asignaturas = [];
                            asignaturas = response.asignaturas;
                            asignaturas.forEach(function (asignatura) {
                                if (asignatura.horario === horario && asignatura.paralelo.length === 0) {
                                    _this.is_horario = true;
                                }
                            });
                            /* this.is_horario = true */
                            if (!_this.is_horario) {
                                sweetalert2_1["default"].fire('Horario de la Carrera de ' + opcion2_1 + ' del ' + periodoTipo + ' ' + opcion3_1, 'No hay asignaturas para mostrar', 'error');
                            }
                        }
                        else {
                            _this.is_horario = false;
                        }
                    }, function (error) {
                        sweetalert2_1["default"].fire('Horario de la Carrera de ' + opcion2_1 + ' del ' + periodoTipo + ' ' + opcion3_1, error.error.message, 'error');
                    });
                }
                else if (opcion2_1 && opcion3_1 && opcion4) {
                    _this._asignaturaService.searchThree(opcion2_1, opcion3_1, opcion4).subscribe(function (response) {
                        if (response.asignaturas) {
                            var asignaturas = [];
                            asignaturas = response.asignaturas;
                            asignaturas.forEach(function (asignatura) {
                                if (asignatura.horario === horario) {
                                    _this.is_horario = true;
                                }
                            });
                            /* this.is_horario = true */
                            if (!_this.is_horario) {
                                sweetalert2_1["default"].fire('Horario ' + horario + ' de la Carrera de ' + opcion2_1 + ' del ' + periodoTipo + ' ' + opcion3_1 + ' del paralelo ' + opcion4, 'No hay asignaturas para mostrar', 'error');
                            }
                        }
                        else {
                            _this.is_horario = false;
                        }
                    }, function (error) {
                        sweetalert2_1["default"].fire('Horario ' + horario + ' de la Carrera de ' + opcion2_1 + ' del ' + periodoTipo + ' ' + opcion3_1 + ' del paralelo ' + opcion4, error.error.message, 'error');
                    });
                }
            }
            else {
                sweetalert2_1["default"].fire("Error al mostrar", "Por favor, selecciona los datos.", 'error');
            }
        });
    };
    HomeComponent = __decorate([
        core_1.Component({
            selector: 'app-home',
            templateUrl: './home.component.html',
            styleUrls: ['./home.component.css'],
            providers: [asignatura_service_1.AsignaturaService, aula_service_1.AulaService, usuario_service_1.UsuarioService]
        })
    ], HomeComponent);
    return HomeComponent;
}());
exports.HomeComponent = HomeComponent;
