"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.AsignaturasComponent = void 0;
var asignatura_service_1 = require("./../services/asignatura.service");
var core_1 = require("@angular/core");
var detalle_service_1 = require("../services/detalle.service");
var AsignaturasComponent = /** @class */ (function () {
    function AsignaturasComponent(_asignaturaService, _router, _route, _detalleService) {
        this._asignaturaService = _asignaturaService;
        this._router = _router;
        this._route = _route;
        this._detalleService = _detalleService;
        this.opcionSeleccionada1 = null;
        this.opcionSeleccionada2 = null;
        this.url = this._detalleService.Global.url;
        this.is_searchSemestre = false;
        this.is_searchCarrera = false;
        this.is_searchTodo = false;
    }
    AsignaturasComponent.prototype.seleccionarCarrera = function (event) {
        this.opcionSeleccionada1 = event.target.value;
    };
    AsignaturasComponent.prototype.seleccionarSemestre = function (event) {
        this.opcionSeleccionada2 = event.target.value;
    };
    AsignaturasComponent.prototype.searchTodo = function () {
        this._router.navigate(['/especificacion/asignaturas'], { relativeTo: this._route });
    };
    AsignaturasComponent.prototype.search = function () {
        if (this.opcionSeleccionada1 == null) {
            this._router.navigate(['/especificacion/asignaturas/search/', this.opcionSeleccionada2], { relativeTo: this._route });
        }
        else if (this.opcionSeleccionada2 == null) {
            this._router.navigate(['/especificacion/asignaturas/search/', this.opcionSeleccionada1], { relativeTo: this._route });
            this.is_searchCarrera = true;
        }
        else {
            this._router.navigate(['/especificacion/asignaturas/search/', this.opcionSeleccionada1, this.opcionSeleccionada2], { relativeTo: this._route });
        }
    };
    AsignaturasComponent.prototype.ngOnInit = function () {
        var _this = this;
        if (this._router.url === "/especificacion/asignaturas") {
            this._asignaturaService.getAsignaturas().subscribe(function (response) {
                if (response.asignaturas) {
                    _this.asignaturas = response.asignaturas;
                }
                else {
                }
            }, function (error) {
                console.log(error);
            });
        }
        else {
            this._route.params.subscribe(function (params) {
                var search1 = params['search1'];
                var search2 = params['search2'];
                var search = params['search'];
                if (params['search'] !== undefined) {
                    _this.searchActual = search;
                    if (_this.searchActual.length <= 2) {
                        _this.is_searchSemestre = true;
                        _this.is_searchCarrera = false;
                    }
                    else {
                        _this.is_searchSemestre = false;
                        _this.is_searchCarrera = true;
                    }
                    _this._asignaturaService.searchOne(search).subscribe(function (response) {
                        if (response.asignaturas) {
                            _this.asignaturas = response.asignaturas;
                        }
                        else {
                            _this.asignaturas = [];
                        }
                    }, function (error) {
                        _this.asignaturas = [];
                    });
                }
                else {
                    _this.is_searchTodo = true;
                    _this.searchCarrera = search1;
                    _this.searchSemestre = search2;
                    _this._asignaturaService.search(search1, search2).subscribe(function (response) {
                        if (response.asignaturas) {
                            _this.asignaturas = response.asignaturas;
                        }
                        else {
                            _this.asignaturas = [];
                        }
                    }, function (error) {
                        console.log(error);
                        _this.asignaturas = [];
                        /* this._router.navigate(['/home']) */
                    });
                }
            });
        }
    };
    AsignaturasComponent = __decorate([
        core_1.Component({
            selector: 'app-asignaturas',
            templateUrl: './asignaturas.component.html',
            styleUrls: ['./asignaturas.component.css'],
            providers: [asignatura_service_1.AsignaturaService, detalle_service_1.DetalleService]
        })
    ], AsignaturasComponent);
    return AsignaturasComponent;
}());
exports.AsignaturasComponent = AsignaturasComponent;
