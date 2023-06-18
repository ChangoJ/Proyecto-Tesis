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
exports.AsignaturaNuevoComponent = void 0;
var global_1 = require("./../services/global");
var asignatura_1 = require("./../models/asignatura");
var asignatura_service_1 = require("./../services/asignatura.service");
var core_1 = require("@angular/core");
var sweetalert2_1 = require("sweetalert2");
var profesor_service_1 = require("../services/profesor.service");
var AsignaturaNuevoComponent = /** @class */ (function () {
    function AsignaturaNuevoComponent(_route, _asignaturaService, _profesorService, _router) {
        this._route = _route;
        this._asignaturaService = _asignaturaService;
        this._profesorService = _profesorService;
        this._router = _router;
        this.profesores = [];
        this.itemProfesores = [];
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
        this.carreras = [
            { id: 1, textField: 'Enfermeria' },
            { id: 2, textField: 'Fisioterapia' },
            { id: 3, textField: 'Nutricion' },
            { id: 4, textField: 'Psicologia' },
            { id: 5, textField: 'Educacion Basica' },
            { id: 6, textField: 'Produccion Audiovisual' },
            { id: 7, textField: 'Contabilidad' },
            { id: 8, textField: 'Derecho' },
            { id: 9, textField: 'Economia' },
            { id: 10, textField: 'Software' },
            { id: 11, textField: 'Administracion de Empresas' },
            { id: 12, textField: 'Gastronomia' },
            { id: 13, textField: 'Turismo' }
        ];
        this.semestres = [
            { id: 1, textField: '1' },
            { id: 2, textField: '2' },
            { id: 3, textField: '3' },
            { id: 4, textField: '4' },
            { id: 5, textField: '5' },
            { id: 6, textField: '6' },
            { id: 7, textField: '7' },
            { id: 8, textField: '8' }
        ];
        this.ciclos = [
            { id: 1, textField: '1' },
            { id: 2, textField: '2' },
        ];
        this.horariosType = [
            { id: 1, textField: 'Diurno' },
            { id: 2, textField: 'Nocturno' }
        ];
        this.selectedCarreras = [];
        this.selectedSemestres = [];
        this.selectedProfesores = [];
        this.dropdownCarreras = {};
        this.dropdownSemestres = {};
        this.dropdownCiclos = {};
        this.dropdownHorarios = {};
        this.dropdownProfesores = {};
        this.asignatura = new asignatura_1.Asignatura('', '', [], [], [], '', 0, '', '#000000');
        this.page_title = "Crear Asignatura";
        this.is_edit = false;
        this.url = global_1.Global.url;
        this.asignatura.carrera = [];
        this.asignatura.semestre = [];
        this.asignatura.profesor = [];
        this.selectedHorarios = [];
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
            singleSelection: false,
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
    AsignaturaNuevoComponent.prototype.ngOnInit = function () {
        this.authToken = localStorage.getItem('datosUsuario');
        this.UserData = JSON.parse(this.authToken);
        this.getProfesores();
    };
    AsignaturaNuevoComponent.prototype.getProfesores = function () {
        var _this = this;
        this._profesorService.getProfesores().subscribe(function (response) {
            if (response.profesores) {
                _this.profesores = response.profesores;
                var carreraActual_1 = _this.rolesCarreras[_this.UserData.rol.toLowerCase()];
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
    AsignaturaNuevoComponent.prototype.getProfesorId = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        _this._profesorService.getProfesor(id).subscribe(function (response) {
                            if (response.profesor) {
                                _this.asignatura.profesor.push(response.profesor);
                            }
                            resolve(); // Resuelve la promesa una vez que se completa la llamada a la API
                        }, function (error) {
                            console.log(error);
                            reject(error); // Rechaza la promesa en caso de error
                        });
                    })];
            });
        });
    };
    AsignaturaNuevoComponent.prototype.onSubmit = function () {
        return __awaiter(this, void 0, void 0, function () {
            var controles, _i, _a, profesor, _b, _c, carrera, _d, _e, semestre;
            var _this = this;
            return __generator(this, function (_f) {
                switch (_f.label) {
                    case 0:
                        this.asignatura.semestre = [];
                        this.asignatura.carrera = [];
                        this.asignatura.horario = '';
                        controles = [];
                        Object.values(this.asignaturaForm.controls).forEach(function (control) {
                            control.markAsTouched();
                            controles.push(control.status);
                        });
                        _i = 0, _a = this.selectedProfesores;
                        _f.label = 1;
                    case 1:
                        if (!(_i < _a.length)) return [3 /*break*/, 4];
                        profesor = _a[_i];
                        return [4 /*yield*/, this.getProfesorId(profesor._id)];
                    case 2:
                        _f.sent(); // Utiliza await para esperar a que se complete la llamada a getProfesorId
                        _f.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4:
                        for (_b = 0, _c = this.selectedCarreras; _b < _c.length; _b++) {
                            carrera = _c[_b];
                            this.asignatura.carrera.push(carrera.textField);
                        }
                        for (_d = 0, _e = this.selectedSemestres; _d < _e.length; _d++) {
                            semestre = _e[_d];
                            this.asignatura.semestre.push(semestre.textField);
                        }
                        if (this.selectedHorarios.length !== 0) {
                            this.asignatura.horario = this.selectedHorarios[0].textField;
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
                            sweetalert2_1["default"].fire('Asignatura no creada', 'Por favor, rellene los datos correctamente.', 'error');
                        }
                        else {
                            this._asignaturaService.create(this.asignatura).subscribe(function (response) {
                                if (response.status == 'success') {
                                    _this.status = 'success';
                                    _this.asignatura = response.asignatura;
                                    sweetalert2_1["default"].fire('Asignatura creada', 'La Asignatura se ha creado correctamente.', 'success');
                                    setTimeout(function () {
                                        _this._router.navigate(['/especificacion/asignaturas']);
                                    }, 1200);
                                }
                                else {
                                    sweetalert2_1["default"].fire('Asignatura no creada', 'Por favor, rellene los datos correctamente.', 'error');
                                    _this.status = 'error';
                                }
                            }, function (error) {
                                _this.status = 'error';
                            });
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    AsignaturaNuevoComponent.prototype.redirectAsignatura = function () {
        this._router.navigate(['/especificacion/asignaturas'], { relativeTo: this._route });
    };
    AsignaturaNuevoComponent.prototype.onItemCarreraSelect = function (item) {
    };
    AsignaturaNuevoComponent.prototype.onItemSemestreSelect = function (item) {
    };
    AsignaturaNuevoComponent.prototype.onItemProfesoresSelect = function (item) {
    };
    AsignaturaNuevoComponent.prototype.onItemHorariosSelect = function (item) {
        this.selectedSemestres = [];
    };
    AsignaturaNuevoComponent.prototype.onKeyUp = function () {
        this.asignatura.abreviatura = this.formatearTexto(this.asignatura.nombre);
    };
    AsignaturaNuevoComponent.prototype.formatearTexto = function (texto) {
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
    AsignaturaNuevoComponent.prototype.allAsignaturas = function () {
        this._router.navigate(['/especificacion/asignaturas']);
    };
    __decorate([
        core_1.ViewChild('asignaturaForm', { static: false })
    ], AsignaturaNuevoComponent.prototype, "asignaturaForm");
    AsignaturaNuevoComponent = __decorate([
        core_1.Component({
            selector: 'app-asignatura-nuevo',
            templateUrl: './asignatura-nuevo.component.html',
            styleUrls: ['./asignatura-nuevo.component.css'],
            providers: [asignatura_service_1.AsignaturaService, profesor_service_1.ProfesorService]
        })
    ], AsignaturaNuevoComponent);
    return AsignaturaNuevoComponent;
}());
exports.AsignaturaNuevoComponent = AsignaturaNuevoComponent;
