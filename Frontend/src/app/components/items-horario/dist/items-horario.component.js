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
exports.ItemsHorarioComponent = void 0;
var core_1 = require("@angular/core");
var horario_service_1 = require("../services/horario.service");
var sweetalert2_1 = require("sweetalert2");
var table_1 = require("@angular/material/table");
var paginator_1 = require("@angular/material/paginator");
var horario_observacion_dialog_component_1 = require("../horario-observacion-dialog/horario-observacion-dialog.component");
var ItemsHorarioComponent = /** @class */ (function () {
    function ItemsHorarioComponent(_route, _horarioService, _router, dialog) {
        this._route = _route;
        this._horarioService = _horarioService;
        this._router = _router;
        this.dialog = dialog;
        this.listaA = [];
        this.terminoBusquedaHorario = '';
        this.editingHorario = null;
        this.carrerasFiltradas = [];
        this.rolesCarreras = {
            enfermeria: 'Enfermeria',
            fisioterapia: 'Fisioterapia',
            nutricion: 'Nutricion',
            psicologia: 'Psicologia',
            educacionBasica: 'Educacion Basica',
            produccionAudiovisual: 'Produccion Audiovisual',
            contabilidad: 'Contabilidad',
            derecho: 'Derecho',
            economia: 'Economia',
            software: 'Software',
            administracionEmpresas: 'Administracion de Empresas',
            gastronomia: 'Gastronomia',
            turismo: 'Turismo'
        };
        this.columnas = ['N°', 'Carrera', 'Periodo', 'Tipo', 'Acciones', 'Estado', 'Observacion'];
        this.is_horario = false;
        this.is_admin = false;
        this.is_aprobador = false;
    }
    ItemsHorarioComponent.prototype.ngOnInit = function () {
        this.getHorarios();
        this.ver = "Ver";
        this.authToken = localStorage.getItem('datosUsuario');
        this.UserData = JSON.parse(this.authToken);
        console.log(this.UserData.rol);
        if (this.UserData.rol === "Administrador" || this.UserData.rol === "Aprobador") {
            this.is_admin = true;
            this.is_aprobador = true;
        }
    };
    ItemsHorarioComponent.prototype.filtrarHorarios = function () {
        var terminosBusqueda = this.terminoBusquedaHorario.split(' ').join('|');
        var regexBusqueda = new RegExp(terminosBusqueda, 'gi');
        this.horariosFiltrados = new table_1.MatTableDataSource(this.carrerasFiltradas.filter(function (horario) {
            return horario.carrera.toString().toLowerCase().match(regexBusqueda) ||
                horario.semestre.toString().toLowerCase().match(regexBusqueda) ||
                horario.tipoHorario.toString().toLowerCase().match(regexBusqueda);
        }));
    };
    ItemsHorarioComponent.prototype.getHorarios = function () {
        var _this = this;
        this._horarioService.getHorarios().subscribe(function (response) {
            if (response.horarios) {
                _this.is_horario = true;
                _this.horarios = response.horarios;
                var carreraActual_1 = _this.rolesCarreras[_this.UserData.rol.toLowerCase()];
                _this.carrerasFiltradas = [];
                if (carreraActual_1) {
                    _this.carrerasFiltradas = _this.horarios.filter(function (carrera) { return carrera.carrera.toLowerCase() === carreraActual_1.toLowerCase(); });
                }
                else {
                    _this.carrerasFiltradas = _this.horarios;
                }
                console.log(_this.horarios);
                console.log(_this.carrerasFiltradas);
                _this.horariosFiltrados = new table_1.MatTableDataSource(_this.carrerasFiltradas);
                _this.horariosFiltrados.paginator = _this.paginator;
            }
        }, function (error) {
            console.log(error);
        });
    };
    ItemsHorarioComponent.prototype.getHorario = function (id) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this._horarioService.getHorario(id).subscribe(function (response) {
                if (response.horario) {
                    _this.horario = response.horario;
                }
                resolve(); // Resuelve la promesa una vez que se completa la llamada a la API
            }, function (error) {
                console.log(error);
                reject(error); // Rechaza la promesa en caso de error
            });
        });
    };
    ItemsHorarioComponent.prototype["delete"] = function (id) {
        var _this = this;
        sweetalert2_1["default"].fire({
            title: '¿Estás seguro?',
            text: 'El horario se eliminará permanentemente',
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Delete'
        }).then(function (result) {
            if (result.isConfirmed) {
                _this._horarioService["delete"](id).subscribe(function (response) {
                    setTimeout(function () {
                        location.reload();
                    }, 1200);
                }, function (error) {
                    console.log(error);
                    _this._router.navigate(['/horarios']);
                });
                sweetalert2_1["default"].fire('Horario borrado', 'El horario ha sido borrado', 'success');
            }
            else {
                sweetalert2_1["default"].fire('Operación cancelada', 'El horario no ha sido borrado', 'warning');
            }
        });
    };
    ItemsHorarioComponent.prototype.cambiarEstado = function (horario, estado) {
        return __awaiter(this, void 0, void 0, function () {
            var confirm, color;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log(horario._id);
                        return [4 /*yield*/, this.getHorario(horario._id)];
                    case 1:
                        _a.sent();
                        this.horario.estado = estado;
                        console.log(this.horario);
                        confirm = "";
                        color = "";
                        if (estado === "Aprobado") {
                            confirm = "success";
                            color = '#008000';
                        }
                        else {
                            confirm = "error";
                            color = '#d33';
                        }
                        sweetalert2_1["default"].fire({
                            title: '¿Estás seguro?',
                            text: 'El horario será ' + estado.toLowerCase() + '.',
                            icon: 'question',
                            showCancelButton: true,
                            confirmButtonColor: color,
                            cancelButtonColor: '#3085d6',
                            confirmButtonText: 'Aceptar'
                        }).then(function (result) {
                            if (result.isConfirmed) {
                                _this._horarioService.update(horario._id, _this.horario).subscribe(function (response) {
                                    if (response.status == 'success') {
                                        _this.horario = response.horario;
                                        sweetalert2_1["default"].fire('Estado de horario ' + estado.toLowerCase(), 'El estado del horario ha sido ' + estado.toLowerCase() + '.', confirm);
                                        setTimeout(function () {
                                            _this._router.navigate(['/horarios']);
                                        }, 1200);
                                    }
                                    else {
                                        sweetalert2_1["default"].fire('No se ha podido modificar el estado', 'Por favor, complete los datos correctamente.', 'error');
                                        setTimeout(function () {
                                            location.reload();
                                        }, 1200);
                                    }
                                }, function (error) {
                                    console.log(error);
                                });
                                sweetalert2_1["default"].fire('Estado de horario cambiado', 'El estado del horario ha sido ' + estado.toLowerCase() + '.', confirm);
                                setTimeout(function () {
                                    location.reload();
                                }, 1300);
                            }
                            else {
                                sweetalert2_1["default"].fire('Operación cancelada', 'El estado del horario no ha sido cambiado.', 'warning');
                                setTimeout(function () {
                                    location.reload();
                                }, 1200);
                            }
                        });
                        return [2 /*return*/];
                }
            });
        });
    };
    ItemsHorarioComponent.prototype.startEditing = function (horario) {
        this.editingHorario = horario;
    };
    ItemsHorarioComponent.prototype.openDialog = function (observacion) {
        var dialogRef = this.dialog.open(horario_observacion_dialog_component_1.HorarioObservacionDialogComponent, {
            width: '500px',
            data: observacion
        });
        dialogRef.afterClosed().subscribe(function (result) {
            if (result) {
                dialogRef.componentInstance.result = result;
            }
        });
    };
    ItemsHorarioComponent.prototype.saveObservation = function (horario) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log(horario);
                        return [4 /*yield*/, this.getHorario(horario._id)];
                    case 1:
                        _a.sent();
                        this.horario.observacion = horario.observacion;
                        sweetalert2_1["default"].fire({
                            title: '¿Estás seguro?',
                            text: 'Se modificará la observacion del profesor.',
                            icon: 'question',
                            showCancelButton: true,
                            confirmButtonColor: '#d33',
                            cancelButtonColor: '#3085d6',
                            confirmButtonText: 'Aceptar'
                        }).then(function (result) {
                            if (result.isConfirmed) {
                                _this._horarioService.update(horario._id, _this.horario).subscribe(function (response) {
                                    if (response.status == 'success') {
                                        _this.horario = response.profesor;
                                        sweetalert2_1["default"].fire('Observacion modificado', 'La observacion se ha modificado correctamente.', 'success');
                                        setTimeout(function () {
                                            _this._router.navigate(['/especificacion/profesores']);
                                        }, 1200);
                                    }
                                    else {
                                        sweetalert2_1["default"].fire('No se ha podido modificar la observacion', 'Por favor, complete los datos correctamente.', 'error');
                                        setTimeout(function () {
                                            location.reload();
                                        }, 1200);
                                    }
                                }, function (error) {
                                    console.log(error);
                                });
                                sweetalert2_1["default"].fire('Observacion modificada', 'La observacion ha sido modificada.', 'success');
                                setTimeout(function () {
                                    location.reload();
                                }, 1200);
                            }
                            else {
                                sweetalert2_1["default"].fire('Operación cancelada', 'La observacion no ha sido modificada.', 'warning');
                                setTimeout(function () {
                                    location.reload();
                                }, 1200);
                            }
                        });
                        this.editingHorario = null;
                        return [2 /*return*/];
                }
            });
        });
    };
    ItemsHorarioComponent.prototype.redirectEdit = function (id) {
        this._router.navigate(['/horarios/editarHorario', id]);
    };
    __decorate([
        core_1.ViewChild(paginator_1.MatPaginator, { static: true })
    ], ItemsHorarioComponent.prototype, "paginator");
    ItemsHorarioComponent = __decorate([
        core_1.Component({
            selector: 'app-items-horario',
            templateUrl: './items-horario.component.html',
            styleUrls: ['./items-horario.component.css'],
            providers: [horario_service_1.HorarioService]
        })
    ], ItemsHorarioComponent);
    return ItemsHorarioComponent;
}());
exports.ItemsHorarioComponent = ItemsHorarioComponent;
