"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.ItemsAulaComponent = void 0;
var sweetalert2_1 = require("sweetalert2");
var aula_service_1 = require("./../services/aula.service");
var core_1 = require("@angular/core");
var table_1 = require("@angular/material/table");
var detalle_service_1 = require("../services/detalle.service");
var horario_service_1 = require("../services/horario.service");
var ItemsAulaComponent = /** @class */ (function () {
    function ItemsAulaComponent(_aulaService, _route, _router, _detalleService, _horarioService) {
        this._aulaService = _aulaService;
        this._route = _route;
        this._router = _router;
        this._detalleService = _detalleService;
        this._horarioService = _horarioService;
        this.colorCuadro = document.querySelector(".color-square");
        this.terminoBusquedaAula = '';
        this.aulasObtenidos = [];
        this.columnas = ['N°', 'Nombre', 'Ubicacion', 'Abreviatura', 'Compartida', 'Color', 'Acciones'];
        this.url = this._detalleService.Global.url;
    }
    ItemsAulaComponent.prototype.ngOnInit = function () {
        this.getaulas();
        this.getHorarios();
    };
    ItemsAulaComponent.prototype["delete"] = function (id) {
        var _this = this;
        sweetalert2_1["default"].fire({
            title: '¿Estás seguro?',
            text: 'La aula se eliminará permanentemente',
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
                        if (item.aula._id === id) {
                            console.log(id);
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
                    _this._aulaService["delete"](id).subscribe(function (response) {
                        setTimeout(function () {
                            location.reload();
                        }, 1200);
                    }, function (error) {
                        console.log(error);
                        _this._router.navigate(['/especificacion/aulas']);
                    });
                    sweetalert2_1["default"].fire('Aula borrada', 'La Aula ha sido borrado', 'success');
                }
                else {
                    sweetalert2_1["default"].fire('Aula no borrada', 'Si deseas borrarla, primero borra el horario que la contiene: ' + ubicacion_1, 'error');
                }
            }
            else {
                sweetalert2_1["default"].fire('Operación cancelada', 'La Aula no ha sido borrado', 'warning');
            }
        });
    };
    ItemsAulaComponent.prototype.getaulas = function () {
        var _this = this;
        this._aulaService.getAulas().subscribe(function (response) {
            if (response.aulas) {
                _this.aulasObtenidos = response.aulas;
                _this.aulasFiltrados = new table_1.MatTableDataSource(_this.aulasObtenidos);
                _this.aulasFiltrados.paginator = _this.paginator;
            }
        }, function (error) {
            console.log(error);
        });
    };
    ItemsAulaComponent.prototype.getHorarios = function () {
        var _this = this;
        this._horarioService.getHorarios().subscribe(function (response) {
            if (response.horarios) {
                _this.horarios = response.horarios;
                console.log(_this.horarios);
            }
        }, function (error) {
            console.log(error);
        });
    };
    ItemsAulaComponent.prototype.filtrarAulas = function () {
        var terminosBusqueda = this.terminoBusquedaAula.trim().toLowerCase();
        var regexBusqueda = new RegExp("\\b" + terminosBusqueda + "\\b", 'gi');
        this.aulasFiltrados = new table_1.MatTableDataSource(this.aulasObtenidos.filter(function (aula) {
            return aula.nombre.toString().toLowerCase().match(regexBusqueda) ||
                aula.ubicacion.toString().toLowerCase().match(regexBusqueda) ||
                aula.compartida.toString().toLowerCase().match(regexBusqueda) ||
                aula.abreviatura.toString().toLowerCase().match(regexBusqueda) ||
                aula.color.toString().toLowerCase().match(regexBusqueda);
        }));
        if (this.aulasFiltrados.data.length === 0) {
            var terminosBusquedaSeparados = terminosBusqueda.split(' ');
            regexBusqueda = new RegExp("(" + terminosBusquedaSeparados.join('|') + ")", 'gi');
            this.aulasFiltrados = new table_1.MatTableDataSource(this.aulasObtenidos.filter(function (aula) {
                return aula.nombre.toString().toLowerCase().match(regexBusqueda) ||
                    aula.ubicacion.toString().toLowerCase().match(regexBusqueda) ||
                    aula.compartida.toString().toLowerCase().match(regexBusqueda) ||
                    aula.abreviatura.toString().toLowerCase().match(regexBusqueda) ||
                    aula.color.toString().toLowerCase().match(regexBusqueda);
            }));
        }
    };
    ItemsAulaComponent.prototype.allAulas = function () {
        this._router.navigate(['/especificacion/aulas']);
        location.reload();
    };
    ItemsAulaComponent.prototype.redirectEdit = function (id) {
        this._router.navigate(['/especificacion/aulas/editarAula/', id]);
    };
    __decorate([
        core_1.Input()
    ], ItemsAulaComponent.prototype, "aulas");
    __decorate([
        core_1.ViewChild('paginatorA', { static: false })
    ], ItemsAulaComponent.prototype, "paginator");
    ItemsAulaComponent = __decorate([
        core_1.Component({
            selector: 'app-items-aula',
            templateUrl: './items-aula.component.html',
            styleUrls: ['./items-aula.component.css'],
            providers: [aula_service_1.AulaService, detalle_service_1.DetalleService, horario_service_1.HorarioService]
        })
    ], ItemsAulaComponent);
    return ItemsAulaComponent;
}());
exports.ItemsAulaComponent = ItemsAulaComponent;
