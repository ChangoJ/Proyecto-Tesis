"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.ItemsProfesorComponent = void 0;
var profesor_service_1 = require("./../services/profesor.service");
var core_1 = require("@angular/core");
var sweetalert2_1 = require("sweetalert2");
var table_1 = require("@angular/material/table");
var detalle_service_1 = require("../services/detalle.service");
var horario_service_1 = require("../services/horario.service");
var ItemsProfesorComponent = /** @class */ (function () {
    function ItemsProfesorComponent(_profesorService, _router, _detalleService, _horarioService) {
        this._profesorService = _profesorService;
        this._router = _router;
        this._detalleService = _detalleService;
        this._horarioService = _horarioService;
        this.colorCuadro = document.querySelector(".color-square");
        this.terminoBusquedaProfesor = '';
        this.carrerasFiltradas = [];
        this.columnas = ['N°', 'Nombre', 'Contrato', 'Carreras', 'Acciones'];
        this.profesoresObtenidos = [];
        this.url = this._detalleService.Global.url;
        this.is_admin = false;
        this.is_aprobador = false;
        this.authToken = this._detalleService.authToken;
        this.userData = this._detalleService.userData;
        this.contratos = this._detalleService.contratos;
    }
    ItemsProfesorComponent.prototype.ngOnInit = function () {
        this.getProfesores();
        this.getDataDetalles();
        this.getHorarios();
    };
    ItemsProfesorComponent.prototype.getDataDetalles = function () {
        var _this = this;
        this._detalleService.getRolesCarrera().subscribe(function (roles) {
            _this.rolesCarreras = roles;
        });
        this._detalleService.getCarreras().subscribe(function (carreras) {
            _this.carreras = carreras;
        });
    };
    ItemsProfesorComponent.prototype.getProfesores = function () {
        var _this = this;
        this._profesorService.getProfesores().subscribe(function (response) {
            if (response.profesores) {
                _this.profesoresObtenidos = response.profesores;
                var carreraActual_1 = _this.rolesCarreras[_this.userData.rol.toLowerCase().replace(/\s/g, "")];
                _this.carrerasFiltradas = [];
                if (carreraActual_1) {
                    _this.carrerasFiltradas = _this.profesoresObtenidos.filter(function (elemento) { return elemento.carrera.includes(carreraActual_1); });
                }
                else {
                    _this.carrerasFiltradas = _this.profesoresObtenidos;
                }
                _this.profesoresFiltrados = new table_1.MatTableDataSource(_this.carrerasFiltradas);
                _this.profesoresFiltrados.paginator = _this.paginator;
            }
        }, function (error) {
            console.log(error);
        });
    };
    ItemsProfesorComponent.prototype.getHorarios = function () {
        var _this = this;
        this._horarioService.getHorarios().subscribe(function (response) {
            if (response.horarios) {
                _this.horarios = response.horarios;
            }
        }, function (error) {
            console.log(error);
        });
    };
    ItemsProfesorComponent.prototype["delete"] = function (id) {
        var _this = this;
        sweetalert2_1["default"].fire({
            title: '¿Estás seguro?',
            text: 'El profesor se eliminará permanentemente',
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Delete'
        }).then(function (result) {
            if (result.isConfirmed) {
                var item_1 = [];
                var ubicacion_1 = [];
                var exist_aula_1 = false;
                _this.horarios.forEach(function (horario) {
                    item_1 = horario.item;
                    item_1.forEach(function (item) {
                        if (item.asignatura.profesor[0]._id === id) {
                            exist_aula_1 = true;
                            if (!horario.paralelo || horario.paralelo === "") {
                                ubicacion_1 = horario.tipoHorario + ": " + horario.carrera + ' - ' + horario.semestre;
                            }
                            else {
                                ubicacion_1 = horario.tipoHorario + ": " + horario.carrera + ' - ' + horario.semestre + ' Paralelo (' + horario.paralelo + ')';
                            }
                        }
                    });
                });
                if (!exist_aula_1) {
                    _this._profesorService["delete"](id).subscribe(function (response) {
                        setTimeout(function () {
                            location.reload();
                        }, 1200);
                    }, function (error) {
                        console.log(error);
                        _this._router.navigate(['/especificacion/profesores']);
                    });
                    sweetalert2_1["default"].fire('Profesor borrada', 'El profesor ha sido borrado.', 'success');
                }
                else {
                    sweetalert2_1["default"].fire('Profesor no borrada', 'Si deseas borrarla, primero borra el horario que la contiene: ' + ubicacion_1, 'error');
                }
            }
            else {
                sweetalert2_1["default"].fire('Operación cancelada', 'El profesor no ha sido borrado.', 'warning');
            }
        });
    };
    ItemsProfesorComponent.prototype.filtrarProfesores = function () {
        var _this = this;
        var terminosBusqueda = this.terminoBusquedaProfesor.trim().toLowerCase();
        var regexBusqueda = new RegExp("\\b" + terminosBusqueda + "\\b", 'gi');
        var profesoresFiltrados = this.carrerasFiltradas;
        if (this.selectedContrato !== undefined) {
            profesoresFiltrados = profesoresFiltrados.filter(function (profesor) {
                return profesor.contrato.toLowerCase() === _this.selectedContrato.toLowerCase();
            });
        }
        if (this.selectedCarrera !== undefined) {
            profesoresFiltrados = profesoresFiltrados.filter(function (profesor) {
                return profesor.carrera.some(function (carrera) { return carrera.toLowerCase() === _this.selectedCarrera.toLowerCase(); });
            });
        }
        if (this.selectedCarrera === "Todas" || this.selectedContrato === "Todas") {
            profesoresFiltrados = this.carrerasFiltradas;
        }
        if (terminosBusqueda !== '') {
            profesoresFiltrados = profesoresFiltrados.filter(function (profesor) {
                return profesor.nombre.toString().toLowerCase().match(regexBusqueda) ||
                    profesor.carrera.toString().toLowerCase().match(regexBusqueda) ||
                    profesor.contrato.toString().toLowerCase().match(regexBusqueda);
            });
            if (this.profesoresFiltrados.data.length === 0) {
                var terminosBusquedaSeparado = this.terminoBusquedaProfesor.split(' ');
                regexBusqueda = new RegExp("(" + terminosBusquedaSeparado.join('|') + ")", 'gi');
                profesoresFiltrados = profesoresFiltrados.filter(function (profesor) {
                    return profesor.nombre.toString().toLowerCase().match(regexBusqueda) ||
                        profesor.carrera.toString().toLowerCase().match(regexBusqueda) ||
                        profesor.contrato.toString().toLowerCase().match(regexBusqueda);
                });
            }
        }
        this.profesoresFiltrados = new table_1.MatTableDataSource(profesoresFiltrados);
    };
    ItemsProfesorComponent.prototype.allProfesores = function () {
        this._router.navigate(['/especificacion/profesores']);
        location.reload();
    };
    ItemsProfesorComponent.prototype.resumenProfesores = function () {
        this._router.navigate(['/especificacion/profesores/resumen-profesores']);
        setTimeout(function () {
            location.reload();
        }, 400);
    };
    ItemsProfesorComponent.prototype.redirectEdit = function (id) {
        this._router.navigate(['/especificacion/profesores/editarProfesor/', id]);
    };
    __decorate([
        core_1.Input()
    ], ItemsProfesorComponent.prototype, "profesores");
    __decorate([
        core_1.ViewChild('paginatorP', { static: false })
    ], ItemsProfesorComponent.prototype, "paginator");
    ItemsProfesorComponent = __decorate([
        core_1.Component({
            selector: 'app-items-profesor',
            templateUrl: './items-profesor.component.html',
            styleUrls: ['./items-profesor.component.css'],
            providers: [profesor_service_1.ProfesorService, detalle_service_1.DetalleService, horario_service_1.HorarioService]
        })
    ], ItemsProfesorComponent);
    return ItemsProfesorComponent;
}());
exports.ItemsProfesorComponent = ItemsProfesorComponent;
