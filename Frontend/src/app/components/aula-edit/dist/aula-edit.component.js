"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.AulaEditComponent = void 0;
var aula_service_1 = require("./../services/aula.service");
var aula_1 = require("./../models/aula");
var core_1 = require("@angular/core");
var sweetalert2_1 = require("sweetalert2");
var detalle_service_1 = require("../services/detalle.service");
var AulaEditComponent = /** @class */ (function () {
    function AulaEditComponent(_route, _aulaService, _router, _detalleService) {
        this._route = _route;
        this._aulaService = _aulaService;
        this._router = _router;
        this._detalleService = _detalleService;
        this.selectedUbicacion = [];
        this.dropdownUbicacion = {};
        this.aula = new aula_1.Aula('', '', '', '', '', '#000000');
        this.page_title = "Editar Aula/Laboratorio";
        this.is_edit = true;
        this.url = this._detalleService.Global.url;
        this.ubicaciones = this._detalleService.ubicaciones;
        this.selectedUbicacion = [];
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
    AulaEditComponent.prototype.onSubmit = function () {
        var _this = this;
        this.aula.ubicacion = '';
        var controles = [];
        Object.values(this.aulaForm.controls).forEach(function (control) {
            control.markAsTouched();
            controles.push(control.status);
        });
        if (this.itemUbicacionEdit.length !== 0) {
            this.aula.ubicacion = this.itemUbicacionEdit[0].textField;
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
            || this.aula.ubicacion === ""
            || controles.includes("INVALID")) {
            sweetalert2_1["default"].fire('Aula no se ha modificada', 'Por favor, rellene los datos correctamente.', 'error');
        }
        else {
            this._aulaService.update(this.aula._id, this.aula).subscribe(function (response) {
                if (response.status == 'success') {
                    _this.status = 'success';
                    _this.aula = response.aula;
                    sweetalert2_1["default"].fire('Aula modificada', 'La Aula se ha modificado correctamente.', 'success');
                    setTimeout(function () {
                        _this._router.navigate(['/especificacion/aulas']);
                    }, 1200);
                }
                else {
                    sweetalert2_1["default"].fire('Aula no se ha modificado', 'Por favor, rellene los datos correctamente.', 'error');
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
    AulaEditComponent.prototype.ngOnInit = function () {
        this.getAula();
    };
    AulaEditComponent.prototype.getAula = function () {
        var _this = this;
        this._route.params.subscribe(function (params) {
            var id = params['id'];
            _this._aulaService.getAula(id).subscribe(function (response) {
                if (response.aula) {
                    _this.aula = response.aula;
                    if (_this.aula.compartida === "No") {
                        _this.isChecked = false;
                    }
                    else {
                        _this.isChecked = true;
                    }
                    _this.selectedUbicacion = _this.ubicaciones.filter(function (ubicacion) { return ubicacion.textField === _this.aula.ubicacion; });
                }
                else {
                    _this._router.navigate(['/especificacion/aulas'], { relativeTo: _this._route });
                }
            }, function (error) {
                _this._router.navigate(['/especificacion/aulas'], { relativeTo: _this._route });
            });
        });
    };
    AulaEditComponent.prototype.redirectAula = function () {
        this._router.navigate(['/especificacion/aulas'], { relativeTo: this._route });
    };
    AulaEditComponent.prototype.onKeyUp = function () {
        this.aula.abreviatura = this.formatearTexto(this.aula.nombre);
    };
    AulaEditComponent.prototype.formatearTexto = function (texto) {
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
    AulaEditComponent.prototype.onItemUbicacionSelect = function (item) {
        this.itemUbicacionEdit = item;
    };
    AulaEditComponent.prototype.handleChange = function (item) {
        if (item.checked === false) {
            this.isChecked = false;
        }
        else {
            this.isChecked = true;
        }
    };
    AulaEditComponent.prototype.allAulas = function () {
        this._router.navigate(['/especificacion/aulas']);
    };
    __decorate([
        core_1.ViewChild('aulaForm', { static: false })
    ], AulaEditComponent.prototype, "aulaForm");
    AulaEditComponent = __decorate([
        core_1.Component({
            selector: 'app-aula-edit',
            templateUrl: '../aula-nuevo/aula-nuevo.component.html',
            styleUrls: ['./aula-edit.component.css'],
            providers: [aula_service_1.AulaService, detalle_service_1.DetalleService]
        })
    ], AulaEditComponent);
    return AulaEditComponent;
}());
exports.AulaEditComponent = AulaEditComponent;
