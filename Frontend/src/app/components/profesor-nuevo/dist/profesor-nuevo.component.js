"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.ProfesorNuevoComponent = void 0;
var sweetalert2_1 = require("sweetalert2");
var profesor_1 = require("./../models/profesor");
var profesor_service_1 = require("./../services/profesor.service");
var core_1 = require("@angular/core");
var detalle_service_1 = require("../services/detalle.service");
var ProfesorNuevoComponent = /** @class */ (function () {
    function ProfesorNuevoComponent(_route, _profesorService, _router, _detalleService) {
        this._route = _route;
        this._profesorService = _profesorService;
        this._router = _router;
        this._detalleService = _detalleService;
        this.selectedCarreras = [];
        this.dropdownCarreras = {};
        this.selectedContrato = [];
        this.dropdownContrato = {};
        this.contratos = [
            { id: 1, textField: 'Tiempo Completo' },
            { id: 2, textField: 'Medio Tiempo' },
            { id: 3, textField: 'Tiempo Parcial' }
        ];
        this.profesor = new profesor_1.Profesor('', '', '', [], '');
        this.page_title = "Nuevo Profesor";
        this.is_edit = false;
        this.url = this._detalleService.Global.url;
        this.dropdownCarreras = {
            singleSelection: false,
            idField: 'id',
            textField: 'textField',
            selectAllText: 'Seleccionar todo',
            unSelectAllText: 'Deseleccionar todo',
            itemsShowLimit: 13,
            allowSearchFilter: true
        };
        this.dropdownContrato = {
            singleSelection: true,
            idField: 'id',
            textField: 'textField',
            selectAllText: 'Seleccionar todo',
            unSelectAllText: 'Deseleccionar todo',
            itemsShowLimit: 3,
            allowSearchFilter: false
        };
    }
    ProfesorNuevoComponent.prototype.ngOnInit = function () {
        this.getDataDetalles();
    };
    ProfesorNuevoComponent.prototype.getDataDetalles = function () {
        var _this = this;
        this._detalleService.getCarrerasIndex().subscribe(function (carreras) {
            _this.carreras = carreras;
        });
    };
    ProfesorNuevoComponent.prototype.onSubmit = function () {
        var _this = this;
        this.profesor.carrera = [];
        this.profesor.contrato = '';
        var controles = [];
        Object.values(this.profesorForm.controls).forEach(function (control) {
            control.markAsTouched();
            controles.push(control.status);
        });
        for (var _i = 0, _a = this.selectedCarreras; _i < _a.length; _i++) {
            var carrera = _a[_i];
            this.profesor.carrera.push(carrera.textField);
        }
        if (this.selectedContrato.length !== 0) {
            this.profesor.contrato = this.selectedContrato[0].textField;
        }
        if (this.profesor.carrera.length === 0
            || this.profesor.nombre === ""
            || this.profesor.contrato.length === 0
            || controles.includes("INVALID")) {
            sweetalert2_1["default"].fire('Profesor no creado', 'Por favor, rellene los datos correctamente.', 'error');
        }
        else {
            this._profesorService.create(this.profesor).subscribe(function (response) {
                if (response.status == 'success') {
                    _this.status = 'success';
                    _this.profesor = response.profesor;
                    sweetalert2_1["default"].fire('Profesor creado', 'El profesor se ha creado correctamente.', 'success');
                    setTimeout(function () {
                        _this._router.navigate(['/especificacion/profesores']);
                    }, 1200);
                }
                else {
                    sweetalert2_1["default"].fire('Profesor no creado', 'Por favor, rellene los datos correctamente.', 'error');
                    _this.status = 'error';
                }
            }, function (error) {
                console.log(error);
                _this.status = 'error';
            });
        }
    };
    ProfesorNuevoComponent.prototype.redirectProfesor = function () {
        this._router.navigate(['/especificacion/profesores'], { relativeTo: this._route });
    };
    ProfesorNuevoComponent.prototype.onItemCarrerasSelect = function (item) {
    };
    ProfesorNuevoComponent.prototype.onItemContratoSelect = function (item) {
    };
    ProfesorNuevoComponent.prototype.allProfesores = function () {
        this._router.navigate(['/especificacion/profesores']);
    };
    ProfesorNuevoComponent.prototype.resumenProfesores = function () {
        this._router.navigate(['/especificacion/profesores/resumen-profesores']);
        setTimeout(function () {
            location.reload();
        }, 400);
    };
    __decorate([
        core_1.ViewChild('profesorForm', { static: false })
    ], ProfesorNuevoComponent.prototype, "profesorForm");
    ProfesorNuevoComponent = __decorate([
        core_1.Component({
            selector: 'app-profesor-nuevo',
            templateUrl: './profesor-nuevo.component.html',
            styleUrls: ['./profesor-nuevo.component.css'],
            providers: [profesor_service_1.ProfesorService, detalle_service_1.DetalleService]
        })
    ], ProfesorNuevoComponent);
    return ProfesorNuevoComponent;
}());
exports.ProfesorNuevoComponent = ProfesorNuevoComponent;
