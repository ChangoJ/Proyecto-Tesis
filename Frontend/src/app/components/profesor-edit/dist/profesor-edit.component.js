"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.ProfesorEditComponent = void 0;
var profesor_1 = require("./../models/profesor");
var profesor_service_1 = require("./../services/profesor.service");
var core_1 = require("@angular/core");
var sweetalert2_1 = require("sweetalert2");
var detalle_service_1 = require("../services/detalle.service");
var ProfesorEditComponent = /** @class */ (function () {
    function ProfesorEditComponent(_route, _profesorService, _router, _detalleService) {
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
        this.page_title = "Editar Aula";
        this.is_edit = true;
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
    ProfesorEditComponent.prototype.onSubmit = function () {
        var _this = this;
        this.profesor.carrera = [];
        this.profesor.contrato = '';
        var controles = [];
        Object.values(this.profesorForm.controls).forEach(function (control) {
            control.markAsTouched();
            controles.push(control.status);
        });
        for (var _i = 0, _a = this.itemCarrerasEdit; _i < _a.length; _i++) {
            var carrera = _a[_i];
            this.profesor.carrera.push(carrera.textField);
        }
        if (this.itemContratoEdit.length !== 0) {
            this.profesor.contrato = this.itemContratoEdit[0].textField;
        }
        if (this.profesor.carrera.length === 0
            || this.profesor.nombre === ""
            || this.profesor.contrato.length === 0
            || controles.includes("INVALID")) {
            sweetalert2_1["default"].fire('Profesor no se ha modificado', 'Por favor, rellene los datos correctamente', 'error');
        }
        else {
            this._profesorService.update(this.profesor._id, this.profesor).subscribe(function (response) {
                if (response.status == 'success') {
                    _this.status = 'success';
                    _this.profesor = response.profesor;
                    sweetalert2_1["default"].fire('Profesor modificado', 'El profesor se ha modificado correctamente', 'success');
                    setTimeout(function () {
                        _this._router.navigate(['/especificacion/profesores']);
                    }, 1200);
                }
                else {
                    sweetalert2_1["default"].fire('Profesor no se ha modificado', 'Por favor, rellene los datos correctamente', 'error');
                    _this.status = 'error';
                    setTimeout(function () {
                        location.reload();
                    }, 1200);
                }
            }, function (error) {
                _this.status = 'error';
            });
        }
    };
    ProfesorEditComponent.prototype.ngOnInit = function () {
        this.getProfesor();
        this.getDataDetalles();
    };
    ProfesorEditComponent.prototype.getDataDetalles = function () {
        var _this = this;
        this._detalleService.getCarrerasIndex().subscribe(function (carreras) {
            _this.carreras = carreras;
        });
    };
    ProfesorEditComponent.prototype.getProfesor = function () {
        var _this = this;
        this._route.params.subscribe(function (params) {
            var id = params['id'];
            _this._profesorService.getProfesor(id).subscribe(function (response) {
                if (response.profesor) {
                    _this.profesor = response.profesor;
                    _this.selectedCarreras = _this.carreras.filter(function (carrera) { return _this.profesor.carrera.includes(carrera.textField); });
                    _this.selectedContrato = _this.contratos.filter(function (contrato) { return contrato.textField === _this.profesor.contrato; });
                }
                else {
                    _this._router.navigate(['/especificacion/profesores'], { relativeTo: _this._route });
                }
            }, function (error) {
                _this._router.navigate(['/especificacion/profesores'], { relativeTo: _this._route });
            });
        });
    };
    ProfesorEditComponent.prototype.redirectProfesor = function () {
        this._router.navigate(['/especificacion/profesores'], { relativeTo: this._route });
    };
    ProfesorEditComponent.prototype.onItemCarrerasSelect = function (item) {
        this.itemCarrerasEdit = item;
    };
    ProfesorEditComponent.prototype.onItemContratoSelect = function (item) {
        this.itemContratoEdit = item;
    };
    ProfesorEditComponent.prototype.allProfesores = function () {
        this._router.navigate(['/especificacion/profesores']);
    };
    ProfesorEditComponent.prototype.resumenProfesores = function () {
        this._router.navigate(['/especificacion/profesores/resumen-profesores']);
        setTimeout(function () {
            location.reload();
        }, 400);
    };
    __decorate([
        core_1.ViewChild('profesorForm', { static: false })
    ], ProfesorEditComponent.prototype, "profesorForm");
    ProfesorEditComponent = __decorate([
        core_1.Component({
            selector: 'app-profesor-edit',
            templateUrl: '../profesor-nuevo/profesor-nuevo.component.html',
            styleUrls: ['./profesor-edit.component.css'],
            providers: [profesor_service_1.ProfesorService, detalle_service_1.DetalleService]
        })
    ], ProfesorEditComponent);
    return ProfesorEditComponent;
}());
exports.ProfesorEditComponent = ProfesorEditComponent;
