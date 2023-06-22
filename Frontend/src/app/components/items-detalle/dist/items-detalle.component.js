"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.ItemsDetalleComponent = void 0;
var core_1 = require("@angular/core");
var table_1 = require("@angular/material/table");
var sweetalert2_1 = require("sweetalert2");
var detalle_service_1 = require("../services/detalle.service");
var ItemsDetalleComponent = /** @class */ (function () {
    function ItemsDetalleComponent(_detalleService, _route, _router) {
        this._detalleService = _detalleService;
        this._route = _route;
        this._router = _router;
        this.terminoBusquedaUsuarios = '';
        this.columnas = ['N°', 'Carreras', 'Semestres', 'Ciclos', 'HorasDiurnas', 'HorasNocturnas', 'Acciones'];
        this.detallesObtenidos = [];
        this.url = this._detalleService.Global.url;
    }
    ItemsDetalleComponent.prototype.ngOnInit = function () {
        var _this = this;
        this._detalleService.getDetalles().subscribe(function (response) {
            if (response.detalles) {
                _this.detallesObtenidos = response.detalles;
                _this.detallesFiltrados = new table_1.MatTableDataSource(_this.detallesObtenidos);
                _this.detallesFiltrados.paginator = _this.paginator;
            }
        }, function (error) {
            console.log(error);
        });
    };
    ItemsDetalleComponent.prototype["delete"] = function (id) {
        var _this = this;
        sweetalert2_1["default"].fire({
            title: '¿Estás seguro?',
            text: 'El detalle se eliminará permanentemente',
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Delete'
        }).then(function (result) {
            if (result.isConfirmed) {
                _this._detalleService["delete"](id).subscribe(function (response) {
                    setTimeout(function () {
                        location.reload();
                    }, 1200);
                }, function (error) {
                    console.log(error);
                    _this._router.navigate(['/especificacion/detalles']);
                });
                sweetalert2_1["default"].fire('Detalle borrado', 'El detalle ha sido borrado', 'success');
            }
            else {
                sweetalert2_1["default"].fire('Operación cancelada', 'El detalle no ha sido borrado', 'warning');
            }
        });
    };
    ItemsDetalleComponent.prototype.filtrarDetalles = function () {
        var terminosBusqueda = this.terminoBusquedaUsuarios.split(' ').join(' | ');
        console.log(terminosBusqueda);
        var regexBusqueda = new RegExp(terminosBusqueda, 'gi');
        this.detallesFiltrados = new table_1.MatTableDataSource(this.detallesObtenidos.filter(function (detalle) {
            return detalle.roles.toString().toLowerCase().match(regexBusqueda) ||
                detalle.tiposHorario.toString().toLowerCase().match(regexBusqueda) ||
                detalle.ubicaciones.toString().toLowerCase().match(regexBusqueda) ||
                detalle.phoneNumber.toString().toLowerCase().match(regexBusqueda) ||
                detalle.carreras.toString().toLowerCase().match(regexBusqueda);
        }));
    };
    ItemsDetalleComponent.prototype.allDetalles = function () {
        this._router.navigate(['/especificacion/detalles']);
        location.reload();
    };
    ItemsDetalleComponent.prototype.redirectEdit = function (id) {
        this._router.navigate(['/especificacion/detalles/editarDetalle/', id]);
    };
    __decorate([
        core_1.Input()
    ], ItemsDetalleComponent.prototype, "detalles");
    __decorate([
        core_1.ViewChild('paginatorD', { static: false })
    ], ItemsDetalleComponent.prototype, "paginator");
    ItemsDetalleComponent = __decorate([
        core_1.Component({
            selector: 'app-items-detalle',
            templateUrl: './items-detalle.component.html',
            styleUrls: ['./items-detalle.component.css'],
            providers: [detalle_service_1.DetalleService]
        })
    ], ItemsDetalleComponent);
    return ItemsDetalleComponent;
}());
exports.ItemsDetalleComponent = ItemsDetalleComponent;
