"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.AulaNuevoComponent = void 0;
var sweetalert2_1 = require("sweetalert2");
var aula_service_1 = require("./../services/aula.service");
var aula_1 = require("./../models/aula");
var core_1 = require("@angular/core");
var detalle_service_1 = require("../services/detalle.service");
var AulaNuevoComponent = /** @class */ (function () {
    function AulaNuevoComponent(_route, _aulaService, _router, _detalleService) {
        this._route = _route;
        this._aulaService = _aulaService;
        this._router = _router;
        this._detalleService = _detalleService;
        this.selectedUbicacion = [];
        this.dropdownUbicacion = {};
        this.aula = new aula_1.Aula('', '', '', '', '', '#000000');
        this.page_title = "Nueva Aula/Laboratorio";
        this.is_edit = false;
        this.url = this._detalleService.Global.url;
        this.ubicaciones = this._detalleService.ubicaciones;
        this.dropdownUbicacion = {
            singleSelection: true,
            idField: 'id',
            textField: 'textField',
            selectAllText: 'Seleccionar todo',
            unSelectAllText: 'Deseleccionar todo',
            itemsShowLimit: 2,
            allowSearchFilter: false
        };
    }
    AulaNuevoComponent.prototype.onSubmit = function () {
        var _this = this;
        var controles = [];
        this.aula.ubicacion = '';
        Object.values(this.aulaForm.controls).forEach(function (control) {
            control.markAsTouched();
            controles.push(control.status);
        });
        if (this.selectedUbicacion.length !== 0) {
            this.aula.ubicacion = this.selectedUbicacion[0].textField;
        }
        if (this.isChecked === undefined || this.isChecked === false) {
            this.aula.compartida = "No";
        }
        else {
            this.aula.compartida = "Si";
        }
        if (this.aula.compartida === ""
            || this.aula.nombre === ""
            || this.aula.abreviatura === ""
            || this.aula.color === ""
            || this.aula.ubicacion.length == 0
            || controles.includes("INVALID")) {
            sweetalert2_1["default"].fire('Aula no creada', 'Por favor, rellene los datos correctamente.', 'error');
        }
        else {
            this._aulaService.create(this.aula).subscribe(function (response) {
                if (response.status == 'success') {
                    _this.status = 'success';
                    _this.aula = response.aula;
                    sweetalert2_1["default"].fire('Aula creada', 'La Aula se ha creado correctamente.', 'success');
                    setTimeout(function () {
                        _this._router.navigate(['/especificacion/aulas']);
                    }, 1200);
                }
                else {
                    sweetalert2_1["default"].fire('Aula no creada', 'Por favor, rellene los datos correctamente.', 'error');
                    _this.status = 'error';
                }
            }, function (error) {
                console.log(error);
                _this.status = 'error';
            });
        }
    };
    AulaNuevoComponent.prototype.redirectAula = function () {
        this._router.navigate(['/especificacion/aulas'], { relativeTo: this._route });
    };
    AulaNuevoComponent.prototype.onKeyUp = function () {
        this.aula.abreviatura = this.formatearTexto(this.aula.nombre);
    };
    AulaNuevoComponent.prototype.formatearTexto = function (texto) {
        var palabras = texto.split(' ');
        var resultado = palabras.map(function (palabra) {
            if (palabra.length > 1) {
                return palabra.substring(0, 2).toUpperCase();
            }
            else {
                return palabra.toUpperCase();
            }
        });
        return resultado.join('-');
    };
    AulaNuevoComponent.prototype.onItemUbicacionSelect = function (item) {
    };
    AulaNuevoComponent.prototype.checkboxChanged = function (item) {
        console.log(item);
    };
    AulaNuevoComponent.prototype.handleChange = function (item) {
        if (item.checked === false) {
            this.isChecked = false;
        }
        else {
            this.isChecked = true;
        }
    };
    AulaNuevoComponent.prototype.allAulas = function () {
        this._router.navigate(['/especificacion/aulas']);
    };
    __decorate([
        core_1.ViewChild('aulaForm', { static: false })
    ], AulaNuevoComponent.prototype, "aulaForm");
    AulaNuevoComponent = __decorate([
        core_1.Component({
            selector: 'app-aula-nuevo',
            templateUrl: './aula-nuevo.component.html',
            styleUrls: ['./aula-nuevo.component.css'],
            providers: [aula_service_1.AulaService, detalle_service_1.DetalleService]
        })
    ], AulaNuevoComponent);
    return AulaNuevoComponent;
}());
exports.AulaNuevoComponent = AulaNuevoComponent;
