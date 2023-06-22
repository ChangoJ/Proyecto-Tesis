"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.AsignaturaEditComponent = void 0;
var sweetalert2_1 = require("sweetalert2");
var asignatura_1 = require("./../models/asignatura");
var asignatura_service_1 = require("./../services/asignatura.service");
var core_1 = require("@angular/core");
var profesor_service_1 = require("../services/profesor.service");
var detalle_service_1 = require("../services/detalle.service");
var AsignaturaEditComponent = /** @class */ (function () {
    function AsignaturaEditComponent(_route, _asignaturaService, _profesorService, _router, _detalleService) {
        this._route = _route;
        this._asignaturaService = _asignaturaService;
        this._profesorService = _profesorService;
        this._router = _router;
        this._detalleService = _detalleService;
        this.profesores = [];
        this.carrerasFiltradas = [];
        this.selectedCarreras = [];
        this.selectedHorarios = [];
        this.selectedSemestres = [];
        this.selectedProfesores = [];
        this.itemCarreraEdit = [];
        this.itemSemestreEdit = [];
        this.itemProfesoresEdit = [];
        this.itemHorarioEdit = [];
        this.dropdownCarreras = {};
        this.dropdownSemestres = {};
        this.dropdownHorarios = {};
        this.dropdownProfesores = {};
        this.dropdownCiclos = {};
        this.asignatura = new asignatura_1.Asignatura('', '', [], [], [], '', 0, '', '#000000');
        this.page_title = "Editar Asignatura";
        this.is_edit = true;
        this.url = this._detalleService.Global.url;
        this.asignatura.carrera = [];
        this.asignatura.semestre = [];
        this.selectedHorarios = [];
        this.authToken = this._detalleService.authToken;
        this.userData = this._detalleService.userData;
        this.horariosType = this._detalleService.horariosType;
        this.dropdownCarreras = {
            singleSelection: false,
            idField: 'id',
            textField: 'textField',
            selectAllText: 'Seleccionar todo',
            unSelectAllText: 'Deseleccionar todo',
            itemsShowLimit: 13,
            allowSearchFilter: true
        };
        this.dropdownSemestres = {
            singleSelection: false,
            idField: 'id',
            textField: 'textField',
            selectAllText: 'Seleccionar todo',
            unSelectAllText: 'Deseleccionar todo',
            itemsShowLimit: 13,
            allowSearchFilter: true
        };
        this.dropdownCiclos = {
            singleSelection: false,
            idField: 'id',
            textField: 'textField',
            selectAllText: 'Seleccionar todo',
            unSelectAllText: 'Deseleccionar todo',
            itemsShowLimit: 13,
            allowSearchFilter: true
        };
        this.dropdownProfesores = {
            singleSelection: true,
            idField: '_id',
            textField: 'nombre',
            selectAllText: 'Seleccionar todo',
            unSelectAllText: 'Deseleccionar todo',
            itemsShowLimit: 13,
            allowSearchFilter: true
        };
        this.dropdownHorarios = {
            singleSelection: true,
            idField: 'id',
            textField: 'textField',
            selectAllText: 'Seleccionar todo',
            unSelectAllText: 'Deseleccionar todo',
            itemsShowLimit: 2,
            allowSearchFilter: false
        };
    }
    AsignaturaEditComponent.prototype.ngOnInit = function () {
        this.getAsignatura();
        this.getProfesores();
        this.getDataDetalles();
    };
    AsignaturaEditComponent.prototype.getDataDetalles = function () {
        var _this = this;
        this._detalleService.getCarrerasIndex().subscribe(function (carreras) {
            _this.carreras = carreras;
        });
        this._detalleService.getSemestresIndex().subscribe(function (semestres) {
            _this.semestres = semestres;
        });
        this._detalleService.getCiclosIndex().subscribe(function (ciclos) {
            _this.ciclos = ciclos;
        });
        this._detalleService.getRolesIndex().subscribe(function (roles) {
            _this.rolesCarreras = roles;
        });
    };
    AsignaturaEditComponent.prototype.onSubmit = function () {
        var _this = this;
        this.asignatura.carrera = [];
        this.asignatura.semestre = [];
        this.asignatura.horario = '';
        var controles = [];
        Object.values(this.asignaturaForm.controls).forEach(function (control) {
            control.markAsTouched();
            controles.push(control.status);
        });
        for (var _i = 0, _a = this.itemCarreraEdit; _i < _a.length; _i++) {
            var carrera = _a[_i];
            this.asignatura.carrera.push(carrera.textField);
        }
        for (var _b = 0, _c = this.selectedSemestres; _b < _c.length; _b++) {
            var semestre = _c[_b];
            this.asignatura.semestre.push(semestre.textField);
        }
        if (this.itemHorarioEdit.length !== 0) {
            this.asignatura.horario = this.itemHorarioEdit[0].textField;
        }
        if (this.asignatura.nombre === ""
            || this.asignatura.abreviatura === ""
            || this.asignatura.color === ""
            || this.asignatura.creditos === 0
            || this.asignatura.carrera.length === 0
            || this.asignatura.horario === ""
            || this.asignatura.profesor.length === 0
            || this.asignatura.semestre.length === 0
            || controles.includes("INVALID")) {
            sweetalert2_1["default"].fire('Asignatura no se ha modificada', 'Por favor, rellene los datos correctamente.', 'error');
        }
        else {
            this._asignaturaService.update(this.asignatura._id, this.asignatura).subscribe(function (response) {
                if (response.status == 'success') {
                    _this.status = 'success';
                    _this.asignatura = response.asignatura;
                    sweetalert2_1["default"].fire('Asignatura modificada', 'La Asignatura se ha modificado correctamente.', 'success');
                    setTimeout(function () {
                        _this._router.navigate(['/especificacion/asignaturas']);
                    }, 1200);
                }
                else {
                    sweetalert2_1["default"].fire('Asignatura no se ha modificado', 'Por favor, rellene los datos correctamente.', 'error');
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
    AsignaturaEditComponent.prototype.onKeyUp = function () {
        this.asignatura.abreviatura = this.formatearTexto(this.asignatura.nombre);
    };
    AsignaturaEditComponent.prototype.formatearTexto = function (texto) {
        console.log(texto);
        var palabras = texto.split(' ');
        console.log(palabras);
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
    AsignaturaEditComponent.prototype.getProfesores = function () {
        var _this = this;
        this._profesorService.getProfesores().subscribe(function (response) {
            if (response.profesores) {
                _this.profesores = response.profesores;
                var carreraActual_1 = _this.rolesCarreras[_this.userData.rol.toLowerCase().replace(/\s/g, "")];
                _this.carrerasFiltradas = [];
                if (carreraActual_1) {
                    _this.carrerasFiltradas = _this.profesores.filter(function (elemento) { return elemento.carrera.includes(carreraActual_1); });
                }
                else {
                    _this.carrerasFiltradas = _this.profesores;
                }
            }
        }, function (error) {
            console.log(error);
        });
    };
    AsignaturaEditComponent.prototype.getAsignatura = function () {
        var _this = this;
        this._route.params.subscribe(function (params) {
            var id = params['id'];
            _this._asignaturaService.getAsignatura(id).subscribe(function (response) {
                if (response.asignatura) {
                    _this.asignatura = response.asignatura;
                    _this.selectedHorarios = _this.horariosType.filter(function (horario) { return horario.textField === _this.asignatura.horario; });
                    _this.selectedCarreras = _this.carreras.filter(function (carrera) { return _this.asignatura.carrera.includes(carrera.textField); });
                    _this.selectedSemestres = _this.semestres.filter(function (semestre) { return _this.asignatura.semestre.includes(semestre.textField); });
                }
                else {
                    _this._router.navigate(['/especificacion/asignaturas'], { relativeTo: _this._route });
                }
            }, function (error) {
                _this._router.navigate(['/especificacion/asignaturas'], { relativeTo: _this._route });
            });
        });
    };
    AsignaturaEditComponent.prototype.redirectAsignatura = function () {
        this._router.navigate(['/especificacion/asignaturas'], { relativeTo: this._route });
    };
    AsignaturaEditComponent.prototype.onItemCarreraSelect = function (item) {
        this.itemCarreraEdit = item;
    };
    AsignaturaEditComponent.prototype.onItemSemestreSelect = function (item) {
        this.itemSemestreEdit = item;
    };
    AsignaturaEditComponent.prototype.onItemProfesoresSelect = function (item) {
        this.itemProfesoresEdit = item;
    };
    AsignaturaEditComponent.prototype.onItemHorariosSelect = function (item) {
        this.selectedSemestres = [];
        this.itemHorarioEdit = item;
    };
    AsignaturaEditComponent.prototype.allAsignaturas = function () {
        this._router.navigate(['/especificacion/asignaturas']);
    };
    __decorate([
        core_1.ViewChild('asignaturaForm', { static: false })
    ], AsignaturaEditComponent.prototype, "asignaturaForm");
    AsignaturaEditComponent = __decorate([
        core_1.Component({
            selector: 'app-asignatura-edit',
            templateUrl: '../asignatura-nuevo/asignatura-nuevo.component.html',
            styleUrls: ['./asignatura-edit.component.css'],
            providers: [asignatura_service_1.AsignaturaService, profesor_service_1.ProfesorService, detalle_service_1.DetalleService]
        })
    ], AsignaturaEditComponent);
    return AsignaturaEditComponent;
}());
exports.AsignaturaEditComponent = AsignaturaEditComponent;
