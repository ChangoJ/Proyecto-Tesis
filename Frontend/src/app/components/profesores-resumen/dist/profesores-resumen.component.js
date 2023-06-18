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
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
exports.__esModule = true;
exports.ProfesoresResumenComponent = void 0;
var core_1 = require("@angular/core");
var global_1 = require("../services/global");
var asignatura_service_1 = require("../services/asignatura.service");
var jspdf_1 = require("jspdf");
var jspdf_autotable_1 = require("jspdf-autotable");
var ExcelJS = require("exceljs");
var table_1 = require("@angular/material/table");
var horario_service_1 = require("../services/horario.service");
var aula_service_1 = require("../services/aula.service");
var profesor_service_1 = require("../services/profesor.service");
var sweetalert2_1 = require("sweetalert2");
var FileSaver = require("file-saver");
var ProfesoresResumenComponent = /** @class */ (function () {
    function ProfesoresResumenComponent(_asignaturaService, _aulasService, _horarioService, _profesoresService, _route, _router) {
        this._asignaturaService = _asignaturaService;
        this._aulasService = _aulasService;
        this._horarioService = _horarioService;
        this._profesoresService = _profesoresService;
        this._route = _route;
        this._router = _router;
        this.asignaturaHorario = [];
        this.aulaHorario = [];
        this.horarios = [];
        this.profesores = [];
        this.idHorario = "";
        this.asignaturasColocadas = [];
        this.monday = [];
        this.tuesday = [];
        this.wednesday = [];
        this.thursday = [];
        this.friday = [];
        this.saturday = [];
        this.editingProfesor = null;
        this.carrerasFiltradas = [];
        this.asignaturasFiltradas = [];
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
        this.hours = [
            '07:00 - 08:00',
            '08:00 - 09:00',
            '09:00 - 10:00',
            '10:00 - 11:00',
            '11:00 - 12:00',
            '12:00 - 13:00',
            '13:00 - 14:00',
            '14:00 - 15:00',
        ];
        this.hoursnight = [
            '08:00 - 09:00',
            '09:00 - 10:00',
            '10:00 - 11:00',
            '11:00 - 12:00',
            '12:00 - 13:00',
            '13:00 - 14:00',
            '18:00 - 19:00',
            '19:00 - 20:00',
            '20:00 - 21:00',
            '21:00 - 22:00',
        ];
        this.url = global_1.Global.url;
    }
    ProfesoresResumenComponent.prototype.ngOnInit = function () {
        this.getHorarios();
        this.getProfesores();
        this.getAsignaturas();
        this.getAulas();
        this.authToken = localStorage.getItem('datosUsuario');
        this.UserData = JSON.parse(this.authToken);
    };
    ProfesoresResumenComponent.prototype.getProfesores = function () {
        var _this = this;
        this._profesoresService.getProfesores().subscribe(function (response) {
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
    ProfesoresResumenComponent.prototype.getProfesor = function (id) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this._profesoresService.getProfesor(id).subscribe(function (response) {
                if (response.profesor) {
                    _this.profesor = response.profesor;
                }
                resolve(); // Resuelve la promesa una vez que se completa la llamada a la API
            }, function (error) {
                console.log(error);
                reject(error); // Rechaza la promesa en caso de error
            });
        });
    };
    ProfesoresResumenComponent.prototype.startEditing = function (profesor) {
        this.editingProfesor = profesor;
    };
    ProfesoresResumenComponent.prototype.saveObservation = function (profesor) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getProfesor(profesor.profesorId)];
                    case 1:
                        _a.sent();
                        this.profesor.observacion = profesor.profesorObservacion;
                        sweetalert2_1["default"].fire({
                            title: '¿Estás seguro?',
                            text: 'Se modificará la observacion del profesor.',
                            icon: 'question',
                            showCancelButton: true,
                            confirmButtonColor: '#d33',
                            cancelButtonColor: '#3085d6',
                            confirmButtonText: 'Aceptar'
                        }).then(function (result) {
                            if (result.isConfirmed) {
                                _this._profesoresService.update(profesor.profesorId, _this.profesor).subscribe(function (response) {
                                    if (response.status == 'success') {
                                        _this.status = 'success';
                                        _this.profesor = response.profesor;
                                        sweetalert2_1["default"].fire('Observacion modificado', 'La observacion se ha modificado correctamente.', 'success');
                                        setTimeout(function () {
                                            _this._router.navigate(['/especificacion/profesores']);
                                        }, 1200);
                                    }
                                    else {
                                        sweetalert2_1["default"].fire('No se ha podido modificar la observacion', 'Por favor, complete los datos correctamente.', 'error');
                                        _this.status = 'error';
                                        setTimeout(function () {
                                            location.reload();
                                        }, 1200);
                                    }
                                }, function (error) {
                                    _this.status = 'error';
                                });
                                sweetalert2_1["default"].fire('Observacion modificada', 'La observacion ha sido modificada.', 'success');
                                setTimeout(function () {
                                    location.reload();
                                }, 1200);
                            }
                            else {
                                sweetalert2_1["default"].fire('Operación cancelada', 'La observacion no ha sido modificada.', 'warning');
                                setTimeout(function () {
                                    location.reload();
                                }, 1200);
                            }
                        });
                        this.editingProfesor = null;
                        return [2 /*return*/];
                }
            });
        });
    };
    ProfesoresResumenComponent.prototype.getAulas = function () {
        var _this = this;
        this._route;
        this._aulasService.getAulas().subscribe(function (response) {
            if (response.aulas) {
                _this.aulas = response.aulas;
            }
        }, function (error) {
            console.log(error);
        });
    };
    ProfesoresResumenComponent.prototype.getHorarios = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                this._horarioService.getHorarios().subscribe(function (response) {
                    if (response.horarios) {
                        _this.horarios = response.horarios;
                        _this.getDaysHorario();
                    }
                }, function (error) {
                    console.log(error);
                });
                return [2 /*return*/];
            });
        });
    };
    ProfesoresResumenComponent.prototype.getHorariosCarrera = function (carreraDeseada) {
        var horariosCarrera = [];
        carreraDeseada = "Software";
        for (var i = 0; i < this.horarios.length; i++) {
            var horario = this.horarios[i];
            // Verificar si la carrera del horario coincide con la carrera deseada
            if (horario.carrera === carreraDeseada) {
                var asignaturas = horario.item.filter(function (item) {
                    return item.asignatura.carrera.includes(carreraDeseada);
                });
                var horarios = horario;
                horariosCarrera.push(horarios);
            }
        }
        return horariosCarrera;
    };
    ProfesoresResumenComponent.prototype.getDaysHorario = function () {
        var horariosProfesores;
        for (var i = 0; i < this.horarios.length; i++) {
            var horario = this.horarios[i];
            var dias = horario.dia;
            for (var i_1 = 0; i_1 < dias.length; i_1++) {
                var nuevoObjetoAsignatura = {
                    dayName: '',
                    elementoType: '',
                    hourEnd: '',
                    hourStart: '',
                    identificador: '',
                    semestre: '',
                    carrera: '',
                    item: {}
                };
                var nuevoObjetoAula = {
                    dayName: '',
                    elementoType: '',
                    hourEnd: '',
                    hourStart: '',
                    identificador: '',
                    item: {}
                };
                /* Asignatura */
                nuevoObjetoAsignatura.dayName = String(dias[i_1]);
                nuevoObjetoAsignatura.hourEnd = horario.horas[i_1].horaFin;
                nuevoObjetoAsignatura.hourStart = horario.horas[i_1].horaInicio;
                nuevoObjetoAsignatura.identificador = String(horario.idTabla[i_1].idAsignatura);
                nuevoObjetoAsignatura.item = horario.item[i_1].asignatura;
                nuevoObjetoAsignatura.elementoType = 'asignatura';
                nuevoObjetoAsignatura.semestre = horario.semestre;
                nuevoObjetoAsignatura.carrera = horario.carrera;
                /* Aula */
                nuevoObjetoAula.dayName = String(dias[i_1]);
                nuevoObjetoAula.hourEnd = horario.horas[i_1].horaFin;
                nuevoObjetoAula.hourStart = horario.horas[i_1].horaInicio;
                nuevoObjetoAula.identificador = String(horario.idTabla[i_1].idAula);
                nuevoObjetoAula.item = horario.item[i_1].aula;
                nuevoObjetoAula.elementoType = 'aula';
                if (dias[i_1] === "Lunes") {
                    this.monday.push(nuevoObjetoAsignatura);
                    this.monday.push(nuevoObjetoAula);
                }
                else if (dias[i_1] === "Martes") {
                    this.tuesday.push(nuevoObjetoAsignatura);
                    this.tuesday.push(nuevoObjetoAula);
                }
                else if (dias[i_1] === "Miercoles") {
                    this.wednesday.push(nuevoObjetoAsignatura);
                    this.wednesday.push(nuevoObjetoAula);
                }
                else if (dias[i_1] === "Jueves") {
                    this.thursday.push(nuevoObjetoAsignatura);
                    this.thursday.push(nuevoObjetoAula);
                }
                else if (dias[i_1] === "Viernes") {
                    this.friday.push(nuevoObjetoAsignatura);
                    this.friday.push(nuevoObjetoAula);
                }
                else if (dias[i_1] === "Sabado") {
                    this.saturday.push(nuevoObjetoAsignatura);
                    this.saturday.push(nuevoObjetoAula);
                }
            }
        }
    };
    ProfesoresResumenComponent.prototype.getProfesorHorarioImprimir = function (profesorSeleccionado) {
        var diasArray = [
            this.monday,
            this.tuesday,
            this.wednesday,
            this.thursday,
            this.friday,
            this.saturday
        ];
        var identAsignatura;
        var profesorId = profesorSeleccionado;
        this.horarioProfesor = diasArray.map(function (dia) { return dia.filter(function (item) {
            item;
            if (item.elementoType === 'asignatura' && item.item.profesor && item.item.profesor[0]._id === profesorId) {
                identAsignatura = item.identificador.substring(0, 2);
                return true; // Mantener las asignaturas filtradas
            }
            else if (item.elementoType === 'aula' && item.identificador.substring(0, 2) === identAsignatura) {
                return true; // Mantener las aulas con identificador igual al profesor
            }
            else {
                return false; // Omitir otros elementos
            }
        }); });
    };
    ProfesoresResumenComponent.prototype.getAsignaturas = function () {
        var _this = this;
        this._asignaturaService.getAsignaturas().subscribe(function (response) {
            if (response.asignaturas) {
                _this.asignaturas = response.asignaturas;
                var carreraActual_2 = _this.rolesCarreras[_this.UserData.rol.toLowerCase()];
                _this.asignaturasFiltradas = [];
                if (carreraActual_2) {
                    _this.asignaturasFiltradas = _this.asignaturas.filter(function (elemento) { return elemento.carrera.includes(carreraActual_2); });
                }
                else {
                    _this.asignaturasFiltradas = _this.asignaturas;
                }
                console.log(_this.asignaturasFiltradas);
                _this.agruparAsignaturasPorProfesor(_this.asignaturasFiltradas);
                _this.asignaturasPorProfesorTiempoCompleto.paginator = _this.paginator;
                _this.asignaturasPorProfesorMedioTiempo.paginator = _this.paginator2;
                _this.asignaturasPorProfesorTiempoParcial.paginator = _this.paginator2;
            }
        }, function (error) {
            console.log(error);
        });
    };
    ProfesoresResumenComponent.prototype.getProfesorSeleccionadoRPdf = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _i, _a, profesor;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!(this.profesorSeleccionado !== undefined)) return [3 /*break*/, 8];
                        if (!(this.profesorSeleccionado === "todos")) return [3 /*break*/, 6];
                        _i = 0, _a = this.carrerasFiltradas;
                        _b.label = 1;
                    case 1:
                        if (!(_i < _a.length)) return [3 /*break*/, 5];
                        profesor = _a[_i];
                        return [4 /*yield*/, this.getProfesorHorarioImprimir(profesor._id)];
                    case 2:
                        _b.sent();
                        return [4 /*yield*/, this.exportarProfePdf(profesor.nombre)];
                    case 3:
                        _b.sent();
                        _b.label = 4;
                    case 4:
                        _i++;
                        return [3 /*break*/, 1];
                    case 5: return [3 /*break*/, 7];
                    case 6:
                        this.getProfesorHorarioImprimir(this.profesorSeleccionado._id);
                        this.exportarProfePdf(this.profesorSeleccionado.nombre);
                        _b.label = 7;
                    case 7: return [3 /*break*/, 9];
                    case 8:
                        sweetalert2_1["default"].fire('Generacion de Horario del Profesor Rechazado', 'Por favor, seleccione una opcion.', 'error');
                        _b.label = 9;
                    case 9: return [2 /*return*/];
                }
            });
        });
    };
    ProfesoresResumenComponent.prototype.agruparAsignaturasPorProfesor = function (asignaturas) {
        var _this = this;
        var diasArray = [
            this.monday,
            this.tuesday,
            this.wednesday,
            this.thursday,
            this.friday,
            this.saturday
        ];
        var identAsignatura;
        var profesoresArray = this.carrerasFiltradas;
        var profesorId = '';
        var horariosProfesores = [];
        var asignaturasProfesores = [];
        this.horarioProfesor = [];
        horariosProfesores = profesoresArray.map(function (profesor) {
            profesorId = profesor._id;
            _this.horarioProfesor = diasArray.map(function (dia) { return dia.filter(function (item) {
                if (item.elementoType === 'asignatura' && item.item.profesor && item.item.profesor[0]._id === profesorId) {
                    identAsignatura = item.identificador.substring(0, 2);
                    return true; // Mantener las asignaturas filtradas
                }
                else if (item.elementoType === 'aula' && item.identificador.substring(0, 2) === identAsignatura) {
                    return true; // Mantener las aulas con identificador igual al profesor
                }
                else {
                    return false; // Omitir otros elementos
                }
            }); });
            // Buscar el item correspondiente a esta celda
            for (var k = 0; k < _this.horarioProfesor.length; k++) {
                var currentItem = _this.horarioProfesor[k];
                currentItem.sort(function (a, b) { return a.identificador.localeCompare(b.identificador); });
                var _loop_2 = function (l) {
                    var currentElement = currentItem[l];
                    if (currentElement.elementoType === 'asignatura') {
                        var currentAsignaturaId_1 = currentElement.item._id;
                        var currentAsignatura_1 = currentElement.item.nombre;
                        var currentAsignaturaH = currentElement.item.horario;
                        var currentAsignaturaC = currentElement.carrera;
                        var currentAsignaturaS_1 = currentElement.semestre;
                        var currentProfesoresId = currentElement.item.profesor[0]._id;
                        var currentProfesores_1 = currentElement.item.profesor[0].nombre;
                        var currentProfesoresContrato = currentElement.item.profesor[0].contrato;
                        var currentProfesoresObservacion = currentElement.item.profesor[0].observacion;
                        var currentAsignaturaCreditos = currentElement.item.creditos;
                        if (!asignaturasProfesores.some(function (ap) { return ap.asigId === currentAsignaturaId_1 && (ap.asignatura === currentAsignatura_1 && ap.semestre === currentAsignaturaS_1) && ap.profesor === currentProfesores_1; })) {
                            asignaturasProfesores.push({ profeId: currentProfesoresId, asigId: currentAsignaturaId_1, carrera: currentAsignaturaC, semestre: currentAsignaturaS_1, asignatura: currentAsignatura_1, horario: currentAsignaturaH, profesor: currentProfesores_1, profesorContrato: currentProfesoresContrato, horas: currentAsignaturaCreditos, profesorObservacion: currentProfesoresObservacion });
                        }
                    }
                };
                for (var l = 0; l < currentItem.length; l++) {
                    _loop_2(l);
                }
            }
        });
        var asignaturasPorProfesor = [];
        var asignaturasPorProfesorMedioTiempo = [];
        var asignaturasPorProfesorTiempoCompleto = [];
        var asignaturasPorProfesorTiempoParcial = [];
        var _loop_1 = function (profesor) {
            var profeId = profesor.profeId;
            var profesorNombre = profesor.profesor;
            var profesorContrato = profesor.profesorContrato;
            var profesorObservacion = profesor.profesorObservacion;
            var profesorAsignatura = {
                asignatura: profesor.asignatura,
                horas: profesor.horas,
                horario: profesor.horario,
                carrera: profesor.carrera,
                semestre: profesor.semestre
            };
            var asignaturasDelProfesor = asignaturasPorProfesor.find(function (item) { return item.profesorId === profeId; });
            if (asignaturasDelProfesor) {
                asignaturasDelProfesor.asignaturas.push(profesorAsignatura);
            }
            else {
                asignaturasPorProfesor.push({
                    profesorId: profeId,
                    profesornombre: profesorNombre,
                    profesorContrato: profesorContrato,
                    asignaturas: [profesorAsignatura],
                    profesorObservacion: profesorObservacion
                });
            }
        };
        for (var _i = 0, asignaturasProfesores_1 = asignaturasProfesores; _i < asignaturasProfesores_1.length; _i++) {
            var profesor = asignaturasProfesores_1[_i];
            _loop_1(profesor);
        }
        for (var _a = 0, asignaturasPorProfesor_1 = asignaturasPorProfesor; _a < asignaturasPorProfesor_1.length; _a++) {
            var asigPro = asignaturasPorProfesor_1[_a];
            // Agrupar asignaturas por tipo de contrato
            if (asigPro.profesorContrato === 'Tiempo Completo') {
                asignaturasPorProfesorMedioTiempo.push(asigPro);
            }
            else if (asigPro.profesorContrato === 'Medio Tiempo') {
                asignaturasPorProfesorTiempoCompleto.push(asigPro);
            }
            else if (asigPro.profesorContrato === 'Tiempo Parcial') {
                asignaturasPorProfesorTiempoParcial.push(asigPro);
            }
        }
        this.asignaturasPorProfesorTiempoCompleto = new table_1.MatTableDataSource(asignaturasPorProfesorTiempoCompleto);
        this.asignaturasPorProfesorMedioTiempo = new table_1.MatTableDataSource(asignaturasPorProfesorMedioTiempo);
        this.asignaturasPorProfesorTiempoParcial = new table_1.MatTableDataSource(asignaturasPorProfesorTiempoParcial);
    };
    ProfesoresResumenComponent.prototype.getSumaHoras = function (asignaturas) {
        var sumaHoras = 0;
        for (var _i = 0, asignaturas_1 = asignaturas; _i < asignaturas_1.length; _i++) {
            var asignatura = asignaturas_1[_i];
            sumaHoras += parseInt(asignatura.horas);
        }
        return sumaHoras;
    };
    ProfesoresResumenComponent.prototype.getProfesorSeleccionadoRExcel = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _i, _a, profesor;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!(this.profesorSeleccionado !== undefined)) return [3 /*break*/, 8];
                        if (!(this.profesorSeleccionado === "todos")) return [3 /*break*/, 6];
                        _i = 0, _a = this.carrerasFiltradas;
                        _b.label = 1;
                    case 1:
                        if (!(_i < _a.length)) return [3 /*break*/, 5];
                        profesor = _a[_i];
                        return [4 /*yield*/, this.getProfesorHorarioImprimir(profesor._id)];
                    case 2:
                        _b.sent();
                        return [4 /*yield*/, this.exportarProfeExcel(profesor.nombre)];
                    case 3:
                        _b.sent();
                        _b.label = 4;
                    case 4:
                        _i++;
                        return [3 /*break*/, 1];
                    case 5: return [3 /*break*/, 7];
                    case 6:
                        this.getProfesorHorarioImprimir(this.profesorSeleccionado._id);
                        this.exportarProfeExcel(this.profesorSeleccionado.nombre);
                        _b.label = 7;
                    case 7: return [3 /*break*/, 9];
                    case 8:
                        sweetalert2_1["default"].fire('Generacion de Horario del Profesor Rechazado', 'Por favor, seleccione una opcion', 'error');
                        _b.label = 9;
                    case 9: return [2 /*return*/];
                }
            });
        });
    };
    ProfesoresResumenComponent.prototype.exportarProfePdf = function (profesor) {
        // Crear una instancia de jsPDF
        var doc = new jspdf_1["default"]('landscape', 'mm', 'a4');
        var pageWidth = doc.internal.pageSize.width;
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        var titleText = "UNIVERSIDAD IBEROAMERICANA DEL ECUADOR";
        var titleWidth = doc.getTextWidth(titleText);
        var titleX = (pageWidth - titleWidth) / 2;
        doc.text(titleText, titleX, 10);
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        var descriptionText = "MATRIZ DEL HORARIO DEL PROFESOR";
        var descriptionWidth = doc.getTextWidth(descriptionText);
        var descriptionX = (pageWidth - descriptionWidth) / 2;
        doc.text(descriptionText, descriptionX, 15);
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        var professorText = "Profesor: " + profesor;
        var professorInfoWidth = doc.getTextWidth(professorText);
        var professorInfoX = (pageWidth - professorInfoWidth) / 2;
        doc.text(professorText, professorInfoX, 20);
        var days;
        var DataAdicional = [];
        var asignaturasProfesores = [];
        var asignaturasProfesoresNocturnoCicloUno = [];
        var asignaturasProfesoresNocturnoCicloDos = [];
        var asignaturasProfesoresDiurno = [];
        var rowDataHead = [];
        var rowDataHead2 = [];
        var rowDataHead3 = [];
        var rowDataHead4 = [];
        var rowData = [];
        var rowDataC1 = [];
        var rowDataC2 = [];
        var hoursPDF = [];
        hoursPDF = this.hours;
        var cellSize = "";
        rowDataHead4.push([{ title: 'Asignaturas', styles: { halign: 'center', fillColor: '#00AFF0' } },
            { title: 'N° Horas', styles: { halign: 'center', fillColor: '#00AFF0' } },
            { title: 'Modalidad', styles: { halign: 'center', fillColor: '#00AFF0' } }]);
        cellSize = 38;
        days = ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado'];
        rowDataHead.push([{ title: "Horario Diurno", colSpan: 6, styles: { halign: 'center', fillColor: '#00AFF0' } }]);
        rowDataHead2.push([{ title: "Horario Nocturno Ciclo 1", colSpan: 7, styles: { halign: 'center', fillColor: '#00AFF0' } }]);
        rowDataHead3.push([{ title: "Horario Nocturno Ciclo 2", colSpan: 7, styles: { halign: 'center', fillColor: '#00AFF0' } }]);
        rowData.push(['Horas', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes']);
        rowDataC1.push(['Horas', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sabado']);
        rowDataC2.push(['Horas', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sabado']);
        var identAsignatura = "";
        asignaturasProfesoresDiurno = this.horarioProfesor.map(function (item) { return item.filter(function (item) {
            if (item.elementoType === 'asignatura' && item.item.horario === 'Diurno' && item.item.profesor) {
                identAsignatura = item.identificador.substring(0, 2);
                return true;
            }
            else if (item.elementoType === 'aula' && item.identificador.substring(0, 2) === identAsignatura) {
                return true;
            }
            else {
                return false;
            }
        }); });
        identAsignatura = "";
        asignaturasProfesoresNocturnoCicloUno = this.horarioProfesor.map(function (item) { return item.filter(function (item) {
            if (item.elementoType === 'asignatura' && item.item.horario === 'Nocturno' && item.item.semestre[0] === "1" && item.item.profesor) {
                identAsignatura = item.identificador.substring(0, 2);
                return true;
            }
            else if (item.elementoType === 'aula' && item.identificador.substring(0, 2) === identAsignatura) {
                return true;
            }
            else {
                return false;
            }
        }); });
        identAsignatura = "";
        asignaturasProfesoresNocturnoCicloDos = this.horarioProfesor.map(function (item) { return item.filter(function (item) {
            if (item.elementoType === 'asignatura' && item.item.horario === 'Nocturno' && item.item.semestre[0] === "2" && item.item.profesor) {
                identAsignatura = item.identificador.substring(0, 2);
                return true;
            }
            else if (item.elementoType === 'aula' && item.identificador.substring(0, 2) === identAsignatura) {
                return true;
            }
            else {
                return false;
            }
        }); });
        var row = [];
        var agrupaciones = [];
        for (var i = 0; i < hoursPDF.length; i++) {
            row = [hoursPDF[i]];
            for (var j = 0; j < days.length; j++) {
                // Buscar el item correspondiente a esta celda
                var currentItem = [];
                for (var k = 0; k < asignaturasProfesoresDiurno.length; k++) {
                    currentItem = asignaturasProfesoresDiurno[k];
                    currentItem.sort(function (a, b) { return a.identificador.localeCompare(b.identificador); });
                    var _loop_3 = function (l) {
                        var currentElement = currentItem[l];
                        if (currentElement.elementoType === 'asignatura') {
                            var currentAsignaturaId_2 = currentElement.item._id;
                            var currentAsignatura_2 = currentElement.item.nombre;
                            var currentAsignaturaH = currentElement.item.horario;
                            var currentAsignaturaC = currentElement.carrera;
                            var currentAsignaturaS_2 = currentElement.semestre;
                            var currentProfesores_2 = currentElement.item.profesor[0].nombre;
                            var currentAsignaturaCreditos = currentElement.item.creditos;
                            if (!asignaturasProfesores.some(function (ap) { return ap.asigId === currentAsignaturaId_2 && (ap.asignatura === currentAsignatura_2 && ap.semestre === currentAsignaturaS_2) && ap.profesores === currentProfesores_2; })) {
                                asignaturasProfesores.push({ asigId: currentAsignaturaId_2, carrera: currentAsignaturaC, semestre: currentAsignaturaS_2, asignatura: currentAsignatura_2, horario: currentAsignaturaH, profesores: currentProfesores_2, horas: currentAsignaturaCreditos });
                            }
                        }
                        // Obtener la hora del elemento actual
                        var elementHourStart = currentElement.hourStart;
                        var elementHourEnd = currentElement.hourEnd;
                        // Comprobar si las horas son iguales
                        var rowIndex = i + 1; // Sumar 1 para evitar reemplazar la primera fila (encabezado)
                        var colIndex = j + 1; // Sumar 1 para evitar reemplazar la primera columna (horario)
                        // Insertar el valor en la celda correspondiente
                        if (i === hoursPDF.indexOf(elementHourStart + '-' + elementHourEnd) && j === (days.indexOf(currentElement.dayName))) {
                            if (typeof row[colIndex] === 'undefined') {
                                row[colIndex] = '';
                            }
                            if (currentElement.elementoType === 'aula') {
                                agrupaciones.push(currentElement);
                                row[colIndex] += '\n' + '(' + currentElement.item.nombre + ' - ' + currentElement.item.ubicacion.trim() + ') ';
                            }
                            else {
                                agrupaciones.push(currentElement);
                                row[colIndex] += currentElement.item.nombre.trim();
                                row[colIndex] += "\n( " + currentElement.semestre + ' semestre' + ' - ' + currentElement.carrera + ' - ' + currentElement.item.horario + " )";
                            }
                        }
                    };
                    for (var l = 0; l < currentItem.length; l++) {
                        _loop_3(l);
                    }
                }
            }
            rowData.push(row);
        }
        var rowC1 = [];
        for (var i = 0; i < this.hoursnight.length; i++) {
            rowC1 = [this.hoursnight[i]];
            for (var j = 0; j < days.length; j++) {
                // Buscar el item correspondiente a esta celda
                var currentItem = [];
                for (var k = 0; k < asignaturasProfesoresNocturnoCicloUno.length; k++) {
                    currentItem = asignaturasProfesoresNocturnoCicloUno[k];
                    currentItem.sort(function (a, b) { return a.identificador.localeCompare(b.identificador); });
                    var _loop_4 = function (l) {
                        var currentElement = currentItem[l];
                        if (currentElement.elementoType === 'asignatura') {
                            var currentAsignaturaId_3 = currentElement.item._id;
                            var currentAsignatura_3 = currentElement.item.nombre;
                            var currentAsignaturaH = currentElement.item.horario;
                            var currentAsignaturaC = currentElement.carrera;
                            var currentAsignaturaS_3 = currentElement.semestre;
                            var currentProfesores_3 = currentElement.item.profesor[0].nombre;
                            var currentAsignaturaCreditos = currentElement.item.creditos;
                            if (!asignaturasProfesores.some(function (ap) { return ap.asigId === currentAsignaturaId_3 && (ap.asignatura === currentAsignatura_3 && ap.semestre === currentAsignaturaS_3) && ap.profesores === currentProfesores_3; })) {
                                asignaturasProfesores.push({ asigId: currentAsignaturaId_3, carrera: currentAsignaturaC, semestre: currentAsignaturaS_3, asignatura: currentAsignatura_3, horario: currentAsignaturaH, profesores: currentProfesores_3, horas: currentAsignaturaCreditos });
                            }
                        }
                        // Obtener la hora del elemento actual
                        var elementHourStart = currentElement.hourStart;
                        var elementHourEnd = currentElement.hourEnd;
                        // Comprobar si las horas son iguales
                        var rowIndex = i + 1; // Sumar 1 para evitar reemplazar la primera fila (encabezado)
                        var colIndex = j + 1; // Sumar 1 para evitar reemplazar la primera columna (horario)
                        if (i === hoursPDF.indexOf(elementHourStart + '-' + elementHourEnd) && j === (days.indexOf(currentElement.dayName))) {
                            if (typeof rowC1[colIndex] === 'undefined') {
                                rowC1[colIndex] = '';
                            }
                            if (currentElement.elementoType === 'aula') {
                                agrupaciones.push(currentElement);
                                rowC1[colIndex] += '\n' + '(' + currentElement.item.nombre + ' - ' + currentElement.item.ubicacion.trim() + ') ';
                            }
                            else {
                                agrupaciones.push(currentElement);
                                rowC1[colIndex] += currentElement.item.nombre.trim();
                                rowC1[colIndex] += "\n( " + currentElement.semestre + ' ciclo' + ' - ' + currentElement.carrera + ' - ' + currentElement.item.horario + " )";
                            }
                        }
                    };
                    for (var l = 0; l < currentItem.length; l++) {
                        _loop_4(l);
                    }
                }
            }
            rowDataC1.push(rowC1);
        }
        var rowC2 = [];
        for (var i = 0; i < this.hoursnight.length; i++) {
            rowC2 = [this.hoursnight[i]];
            for (var j = 0; j < days.length; j++) {
                // Buscar el item correspondiente a esta celda
                var currentItem = [];
                for (var k = 0; k < asignaturasProfesoresNocturnoCicloDos.length; k++) {
                    currentItem = asignaturasProfesoresNocturnoCicloDos[k];
                    currentItem.sort(function (a, b) { return a.identificador.localeCompare(b.identificador); });
                    var _loop_5 = function (l) {
                        var currentElement = currentItem[l];
                        if (currentElement.elementoType === 'asignatura') {
                            var currentAsignaturaId_4 = currentElement.item._id;
                            var currentAsignatura_4 = currentElement.item.nombre;
                            var currentAsignaturaH = currentElement.item.horario;
                            var currentAsignaturaC = currentElement.carrera;
                            var currentAsignaturaS_4 = currentElement.semestre;
                            var currentProfesores_4 = currentElement.item.profesor[0].nombre;
                            var currentAsignaturaCreditos = currentElement.item.creditos;
                            if (!asignaturasProfesores.some(function (ap) { return ap.asigId === currentAsignaturaId_4 && (ap.asignatura === currentAsignatura_4 && ap.semestre === currentAsignaturaS_4) && ap.profesores === currentProfesores_4; })) {
                                asignaturasProfesores.push({ asigId: currentAsignaturaId_4, carrera: currentAsignaturaC, semestre: currentAsignaturaS_4, asignatura: currentAsignatura_4, horario: currentAsignaturaH, profesores: currentProfesores_4, horas: currentAsignaturaCreditos });
                            }
                        }
                        // Obtener la hora del elemento actual
                        var elementHourStart = currentElement.hourStart;
                        var elementHourEnd = currentElement.hourEnd;
                        // Comprobar si las horas son iguales
                        var rowIndex = i + 1; // Sumar 1 para evitar reemplazar la primera fila (encabezado)
                        var colIndex = j + 1; // Sumar 1 para evitar reemplazar la primera columna (horario)
                        // Insertar el valor en la celda correspondiente
                        if (i === hoursPDF.indexOf(elementHourStart + '-' + elementHourEnd) && j === (days.indexOf(currentElement.dayName))) {
                            if (typeof rowC2[colIndex] === 'undefined') {
                                rowC2[colIndex] = '';
                            }
                            if (currentElement.elementoType === 'aula') {
                                agrupaciones.push(currentElement);
                                rowC2[colIndex] += '\n' + '(' + currentElement.item.nombre + ' - ' + currentElement.item.ubicacion.trim() + ') ';
                            }
                            else {
                                agrupaciones.push(currentElement);
                                rowC2[colIndex] += currentElement.item.nombre.trim();
                                rowC2[colIndex] += "\n( " + currentElement.semestre + ' ciclo' + ' - ' + currentElement.carrera + ' - ' + currentElement.item.horario + " )";
                            }
                        }
                    };
                    for (var l = 0; l < currentItem.length; l++) {
                        _loop_5(l);
                    }
                }
            }
            rowDataC2.push(rowC2);
        }
        // Crear un objeto para almacenar los resultados agrupados
        var resultadoAgrupado = [];
        // Recorrer el array original y agrupar las asignaturas y aulas
        var asignaturaId;
        agrupaciones.forEach(function (item) {
            if (item.elementoType === "asignatura") {
                asignaturaId = item.item._id;
                if (!resultadoAgrupado[asignaturaId]) {
                    resultadoAgrupado[asignaturaId] = {
                        carrera: item.carrera,
                        dayName: item.dayName,
                        elementoType: item.elementoType,
                        hourEnd: item.hourEnd,
                        hourStart: item.hourStart,
                        identificador: item.identificador,
                        item: item.item,
                        semestre: item.semestre,
                        aulas: []
                    };
                }
            }
            else if (item.elementoType === "aula") {
                if (resultadoAgrupado[asignaturaId]) {
                    resultadoAgrupado[asignaturaId].aulas.push(item);
                }
            }
        });
        // Convertir el objeto resultadoAgrupado en un array de resultados
        var resultadoFinal = Object.values(resultadoAgrupado);
        resultadoFinal.forEach(function (resultado) {
            var todasSonZoom = true;
            var algunaEsZoom = false;
            resultado.aulas.forEach(function (aula) {
                if (aula.item.nombre.toLowerCase() !== "zoom") {
                    todasSonZoom = false;
                }
                else {
                    algunaEsZoom = true;
                }
            });
            if (todasSonZoom) {
                resultado.modalidad = "Virtual";
            }
            else if (!algunaEsZoom) {
                resultado.modalidad = "Presencial";
            }
            else {
                resultado.modalidad = "Mixto (Virtual y Presencial)";
            }
        });
        // Verificar la modalidad de las aulas y agregar el campo "modalidad" en resultadoFinal
        var totalHoras = 0;
        asignaturasProfesores.forEach(function (elemento1, index) {
            var resultado = resultadoFinal[index];
            if (resultado && resultado.modalidad) {
                elemento1.modalidad = resultado.modalidad;
            }
        });
        asignaturasProfesores.forEach(function (ap) {
            var tipoPeriodo;
            if (ap.horario === "Diurno") {
                tipoPeriodo = "Semestre";
            }
            else {
                tipoPeriodo = "Ciclo";
            }
            DataAdicional.push([ap.asignatura + ' ( ' + ap.semestre + ' ' + tipoPeriodo + ' - ' + ap.carrera + ' ) ' + '( ' + ap.horario + ' )', ap.horas, ap.modalidad]);
            totalHoras += parseInt(ap.horas);
        });
        DataAdicional.push(['Total de horas', totalHoras]);
        // Agregar la tabla al PDF
        jspdf_autotable_1["default"](doc, {
            head: rowDataHead,
            body: rowData,
            theme: 'grid',
            styles: {
                cellWidth: cellSize,
                minCellHeight: 5,
                fontSize: 7,
                textColor: [0, 0, 0]
            },
            margin: { top: 30, left: 34, right: 34 }
        });
        doc.addPage();
        jspdf_autotable_1["default"](doc, {
            head: rowDataHead2,
            body: rowDataC1,
            theme: 'grid',
            styles: {
                cellWidth: cellSize,
                minCellHeight: 5,
                fontSize: 7,
                textColor: [0, 0, 0]
            },
            margin: { top: 30 }
        });
        doc.addPage();
        jspdf_autotable_1["default"](doc, {
            head: rowDataHead3,
            body: rowDataC2,
            theme: 'grid',
            styles: {
                cellWidth: cellSize,
                minCellHeight: 5,
                fontSize: 7,
                textColor: [0, 0, 0]
            },
            margin: { top: 30 }
        });
        // Agregar una nueva página al PDF
        doc.addPage();
        jspdf_autotable_1["default"](doc, {
            head: rowDataHead4,
            body: DataAdicional,
            theme: 'grid',
            styles: {
                cellWidth: 80,
                fontSize: 8,
                textColor: [0, 0, 0]
            },
            margin: { top: 30 }
        });
        // Descargar el PDF
        doc.save('Horario ' + profesor + '.pdf');
    };
    ProfesoresResumenComponent.prototype.exportarProfeExcel = function (profesor) {
        // Crear una instancia de ExcelJS Workbook
        var workbook = new ExcelJS.Workbook();
        var worksheet = workbook.addWorksheet(profesor);
        // Establecer la orientación horizontal y el tamaño del papel
        worksheet.pageSetup.orientation = 'landscape';
        worksheet.pageSetup.paperSize = 9;
        worksheet.pageSetup.fitToPage = true;
        var cellSize = "";
        var cellSizeBorder = "";
        var days = "";
        var daysN = "";
        var indiceCell = "";
        var indiceCellBorder = "";
        var indiceCellList = 0;
        days = ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes'];
        daysN = ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado'];
        indiceCell = 7;
        indiceCellBorder = 15;
        indiceCellList = 43;
        cellSize = 19;
        cellSizeBorder = 5;
        worksheet.getColumn('A').width = cellSize;
        worksheet.getColumn('B').width = cellSize;
        worksheet.getColumn('C').width = cellSize;
        worksheet.getColumn('D').width = cellSize;
        worksheet.getColumn('E').width = cellSize;
        worksheet.getColumn('F').width = cellSize;
        worksheet.getColumn('G').width = cellSize;
        for (var row_1 = 1; row_1 <= cellSizeBorder; row_1++) {
            for (var col = 1; col <= cellSizeBorder + 2; col++) {
                var cell = worksheet.getCell("" + String.fromCharCode(64 + col) + row_1);
                cell.border = {
                    top: { style: 'medium', color: { argb: 'FFC0C0C0' } },
                    left: { style: 'medium', color: { argb: 'FFC0C0C0' } },
                    bottom: { style: 'medium', color: { argb: 'FFC0C0C0' } },
                    right: { style: 'medium', color: { argb: 'FFC0C0C0' } }
                };
            }
        }
        var identAsignatura = "";
        var asignaturasProfesoresNocturnoCicloUno = [];
        var asignaturasProfesoresNocturnoCicloDos = [];
        var asignaturasProfesoresDiurno = [];
        asignaturasProfesoresDiurno = this.horarioProfesor.map(function (item) { return item.filter(function (item) {
            if (item.elementoType === 'asignatura' && item.item.horario === 'Diurno' && item.item.profesor) {
                identAsignatura = item.identificador.substring(0, 2);
                return true;
            }
            else if (item.elementoType === 'aula' && item.identificador.substring(0, 2) === identAsignatura) {
                return true;
            }
            else {
                return false;
            }
        }); });
        identAsignatura = "";
        asignaturasProfesoresNocturnoCicloUno = this.horarioProfesor.map(function (item) { return item.filter(function (item) {
            if (item.elementoType === 'asignatura' && item.item.horario === 'Nocturno' && item.item.semestre[0] === "1" && item.item.profesor) {
                identAsignatura = item.identificador.substring(0, 2);
                return true;
            }
            else if (item.elementoType === 'aula' && item.identificador.substring(0, 2) === identAsignatura) {
                return true;
            }
            else {
                return false;
            }
        }); });
        identAsignatura = "";
        asignaturasProfesoresNocturnoCicloDos = this.horarioProfesor.map(function (item) { return item.filter(function (item) {
            if (item.elementoType === 'asignatura' && item.item.horario === 'Nocturno' && item.item.semestre[0] === "2" && item.item.profesor) {
                identAsignatura = item.identificador.substring(0, 2);
                return true;
            }
            else if (item.elementoType === 'aula' && item.identificador.substring(0, 2) === identAsignatura) {
                return true;
            }
            else {
                return false;
            }
        }); });
        worksheet.mergeCells('B1:E1'); // Fusionar 4 celdas en la primera fila
        var texto1 = worksheet.getCell(1, 2); // Seleccionar la celda B1
        texto1.value = 'Universidad Iberoamericana del Ecuador'; // Establecer el valor de la celda
        texto1.font = { size: 10, bold: true }; // Establecer el formato de la fuente
        texto1.alignment = { horizontal: 'center' };
        worksheet.mergeCells('B2:E2'); // Fusionar 4 celdas en la primera fila
        var texto2 = worksheet.getCell(2, 2); // Seleccionar la celda B2
        texto2.value = 'MATRIZ HORARIO DEL PROFESOR'; // Establecer el valor de la celda
        texto2.font = { size: 10, bold: true }; // Establecer el formato de la fuente
        texto2.alignment = { horizontal: 'center' };
        // Agregar el título al Excel
        worksheet.mergeCells('A4:F4'); // Fusionar 5 celdas en la primera fila
        var titulo = worksheet.getCell(4, 1);
        titulo.value = 'PROFESOR: ' + profesor; // Establecer el valor de la celda
        titulo.font = { size: 10, bold: true }; // Establecer el formato de la fuente
        titulo.alignment = { horizontal: 'center' };
        var asignaturasProfesores = [];
        worksheet.getCell('A6').value = 'Horario Diurno';
        worksheet.getCell('A6').font = { size: 14, bold: true };
        worksheet.getCell('A6').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '00AFF0' } };
        worksheet.getCell('A6').alignment = { horizontal: 'center' };
        worksheet.mergeCells('A6:F6');
        // Pintar encabezado y agregar encabezado de horario
        worksheet.spliceRows(indiceCell, 0, __spreadArrays(['Horas'], days));
        worksheet.getRow(indiceCell).eachCell({ includeEmpty: true }, function (cell, colNumber) {
            cell.font = {
                bold: true
            };
            cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: '00aae4 ' } // aquí se define el color celeste
            };
        });
        var row = [];
        var agrupaciones = [];
        for (var i = 0; i < this.hours.length; i++) {
            row = [this.hours[i]];
            // Iterar sobre los arreglos correspondientes a cada día de la semana
            for (var j = 0; j < days.length; j++) {
                // Buscar el item correspondiente a esta celda
                for (var k = 0; k < asignaturasProfesoresDiurno.length; k++) {
                    var currentItem = asignaturasProfesoresDiurno[k];
                    currentItem.sort(function (a, b) { return a.identificador.localeCompare(b.identificador); });
                    var _loop_6 = function (l) {
                        var currentElement = currentItem[l];
                        if (currentElement.elementoType === 'asignatura') {
                            var currentAsignaturaId_5 = currentElement.item._id;
                            var currentAsignatura_5 = currentElement.item.nombre;
                            var currentAsignaturaH = currentElement.item.horario;
                            var currentAsignaturaC = currentElement.carrera;
                            var currentAsignaturaS_5 = currentElement.semestre;
                            var currentProfesores_5 = currentElement.item.profesor[0].nombre;
                            var currentAsignaturaCreditos = currentElement.item.creditos;
                            if (!asignaturasProfesores.some(function (ap) { return ap.asigId === currentAsignaturaId_5 && (ap.asignatura === currentAsignatura_5 && ap.semestre === currentAsignaturaS_5) && ap.profesores === currentProfesores_5; })) {
                                asignaturasProfesores.push({ asigId: currentAsignaturaId_5, carrera: currentAsignaturaC, semestre: currentAsignaturaS_5, asignatura: currentAsignatura_5, horario: currentAsignaturaH, profesores: currentProfesores_5, horas: currentAsignaturaCreditos });
                            }
                        }
                        // Obtener la hora del elemento actual
                        var elementHourStart = currentElement.hourStart;
                        var elementHourEnd = currentElement.hourEnd;
                        // Comprobar si las horas son iguales
                        var rowIndex = i + 1; // Sumar 1 para evitar reemplazar la primera fila (encabezado)
                        var colIndex = j + 1; // Sumar 1 para evitar reemplazar la primera columna (horario)
                        // Insertar el valor en la celda correspondiente
                        if (i === this_1.hours.indexOf(elementHourStart + '-' + elementHourEnd) && j === (days.indexOf(currentElement.dayName))) {
                            if (typeof row[colIndex] === 'undefined') {
                                row[colIndex] = '';
                            }
                            if (currentElement.elementoType === 'aula') {
                                agrupaciones.push(currentElement);
                                row[colIndex] += '\n' + '(' + currentElement.item.nombre + ' - ' + currentElement.item.ubicacion.trim() + ') ';
                            }
                            else {
                                agrupaciones.push(currentElement);
                                row[colIndex] += currentElement.item.nombre.trim();
                                row[colIndex] += " ( " + currentElement.semestre + ' semestre' + ' - ' + currentElement.carrera + ' - ' + currentElement.item.horario + " )";
                            }
                        }
                    };
                    var this_1 = this;
                    for (var l = 0; l < currentItem.length; l++) {
                        _loop_6(l);
                    }
                }
            }
            worksheet.addRow(row).eachCell({ includeEmpty: true }, function (cell) {
                cell.font = { size: 7 };
            });
        }
        for (var i = 7; i <= indiceCellBorder; i++) {
            var rowTablaHorarioItem = worksheet.getRow(i);
            rowTablaHorarioItem.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true }; // Opcional: alinear el contenido
            rowTablaHorarioItem.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true }; // Activar el ajuste de texto
        }
        for (var row_2 = 6; row_2 <= indiceCellBorder; row_2++) {
            for (var col = 1; col <= indiceCell - 1; col++) {
                var cell = worksheet.getCell("" + String.fromCharCode(64 + col) + row_2);
                cell.border = {
                    top: { style: 'thin', color: { argb: '000000' } },
                    left: { style: 'thin', color: { argb: '000000' } },
                    bottom: { style: 'thin', color: { argb: '000000' } },
                    right: { style: 'thin', color: { argb: '000000' } }
                };
            }
        }
        var indiceColumn;
        indiceCell = 18;
        indiceColumn = 7;
        indiceCellBorder = 28;
        worksheet.getCell('A17').value = 'Horario Nocturno Ciclo 1';
        worksheet.getCell('A17').font = { size: 14, bold: true };
        worksheet.getCell('A17').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '00AFF0' } };
        worksheet.getCell('A17').alignment = { horizontal: 'center' };
        worksheet.mergeCells('A17:G17');
        // Pintar encabezado y agregar encabezado de horario
        worksheet.spliceRows(indiceCell, 0, __spreadArrays(['Horas'], daysN));
        worksheet.getRow(indiceCell).eachCell({ includeEmpty: true }, function (cell, colNumber) {
            cell.font = {
                bold: true
            };
            cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: '00aae4 ' } // aquí se define el color celeste
            };
        });
        var rowC1 = [];
        for (var i = 0; i < this.hoursnight.length; i++) {
            rowC1 = [this.hoursnight[i]];
            // Iterar sobre los arreglos correspondientes a cada día de la semana
            for (var j = 0; j < days.length; j++) {
                // Buscar el item correspondiente a esta celda
                for (var k = 0; k < asignaturasProfesoresNocturnoCicloUno.length; k++) {
                    var currentItem = asignaturasProfesoresNocturnoCicloUno[k];
                    currentItem.sort(function (a, b) { return a.identificador.localeCompare(b.identificador); });
                    var _loop_7 = function (l) {
                        var currentElement = currentItem[l];
                        if (currentElement.elementoType === 'asignatura') {
                            var currentAsignaturaId_6 = currentElement.item._id;
                            var currentAsignatura_6 = currentElement.item.nombre;
                            var currentAsignaturaH = currentElement.item.horario;
                            var currentAsignaturaC = currentElement.carrera;
                            var currentAsignaturaS_6 = currentElement.semestre;
                            var currentProfesores_6 = currentElement.item.profesor[0].nombre;
                            var currentAsignaturaCreditos = currentElement.item.creditos;
                            if (!asignaturasProfesores.some(function (ap) { return ap.asigId === currentAsignaturaId_6 && (ap.asignatura === currentAsignatura_6 && ap.semestre === currentAsignaturaS_6) && ap.profesores === currentProfesores_6; })) {
                                asignaturasProfesores.push({ asigId: currentAsignaturaId_6, carrera: currentAsignaturaC, semestre: currentAsignaturaS_6, asignatura: currentAsignatura_6, horario: currentAsignaturaH, profesores: currentProfesores_6, horas: currentAsignaturaCreditos });
                            }
                        }
                        // Obtener la hora del elemento actual
                        var elementHourStart = currentElement.hourStart;
                        var elementHourEnd = currentElement.hourEnd;
                        // Comprobar si las horas son iguales
                        var rowIndex = i + 1; // Sumar 1 para evitar reemplazar la primera fila (encabezado)
                        var colIndex = j + 1; // Sumar 1 para evitar reemplazar la primera columna (horario)
                        // Insertar el valor en la celda correspondiente
                        if (i === this_2.hours.indexOf(elementHourStart + '-' + elementHourEnd) && j === (days.indexOf(currentElement.dayName))) {
                            if (typeof rowC1[colIndex] === 'undefined') {
                                rowC1[colIndex] = '';
                            }
                            if (currentElement.elementoType === 'aula') {
                                agrupaciones.push(currentElement);
                                rowC1[colIndex] += '\n' + '(' + currentElement.item.nombre + ' - ' + currentElement.item.ubicacion.trim() + ') ';
                            }
                            else {
                                agrupaciones.push(currentElement);
                                rowC1[colIndex] += currentElement.item.nombre.trim();
                                rowC1[colIndex] += " ( " + currentElement.semestre + ' semestre' + ' - ' + currentElement.carrera + ' - ' + currentElement.item.horario + " )";
                            }
                        }
                    };
                    var this_2 = this;
                    for (var l = 0; l < currentItem.length; l++) {
                        _loop_7(l);
                    }
                }
            }
            worksheet.addRow(row).eachCell({ includeEmpty: true }, function (cell) {
                cell.font = { size: 6 };
            });
        }
        for (var i = 18; i <= indiceCellBorder; i++) {
            var rowTablaHorarioItem = worksheet.getRow(i);
            rowTablaHorarioItem.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true }; // Opcional: alinear el contenido
            rowTablaHorarioItem.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true }; // Activar el ajuste de texto
        }
        for (var row_3 = 17; row_3 <= indiceCellBorder; row_3++) {
            for (var col = 1; col <= indiceColumn; col++) {
                var cell = worksheet.getCell("" + String.fromCharCode(64 + col) + row_3);
                cell.border = {
                    top: { style: 'thin', color: { argb: '000000' } },
                    left: { style: 'thin', color: { argb: '000000' } },
                    bottom: { style: 'thin', color: { argb: '000000' } },
                    right: { style: 'thin', color: { argb: '000000' } }
                };
            }
        }
        /* NOCTURNO CICLO 2 */
        indiceCell = "";
        indiceCell = 31;
        indiceColumn = 7;
        indiceCellBorder = 41;
        worksheet.getCell('A30').value = 'Horario Nocturno Ciclo 2';
        worksheet.getCell('A30').font = { size: 14, bold: true };
        worksheet.getCell('A30').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '00AFF0' } };
        worksheet.getCell('A30').alignment = { horizontal: 'center' };
        worksheet.mergeCells('A30:G30');
        // Pintar encabezado y agregar encabezado de horario
        worksheet.spliceRows(indiceCell, 0, __spreadArrays(['Horas'], daysN));
        worksheet.getRow(indiceCell).eachCell({ includeEmpty: true }, function (cell, colNumber) {
            cell.font = {
                bold: true
            };
            cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: '00aae4 ' } // aquí se define el color celeste
            };
        });
        for (var i = 0; i < this.hoursnight.length; i++) {
            var row_4 = [this.hoursnight[i]];
            // Iterar sobre los arreglos correspondientes a cada día de la semana
            for (var j = 0; j < days.length; j++) {
                // Buscar el item correspondiente a esta celda
                for (var k = 0; k < asignaturasProfesoresNocturnoCicloDos.length; k++) {
                    var currentItem = asignaturasProfesoresNocturnoCicloDos[k];
                    currentItem.sort(function (a, b) { return a.identificador.localeCompare(b.identificador); });
                    var _loop_8 = function (l) {
                        var currentElement = currentItem[l];
                        if (currentElement.elementoType === 'asignatura') {
                            var currentAsignaturaId_7 = currentElement.item._id;
                            var currentAsignatura_7 = currentElement.item.nombre;
                            var currentAsignaturaH = currentElement.item.horario;
                            var currentAsignaturaC = currentElement.carrera;
                            var currentAsignaturaS_7 = currentElement.semestre;
                            var currentProfesores_7 = currentElement.item.profesor[0].nombre;
                            var currentAsignaturaCreditos = currentElement.item.creditos;
                            if (!asignaturasProfesores.some(function (ap) { return ap.asigId === currentAsignaturaId_7 && (ap.asignatura === currentAsignatura_7 && ap.semestre === currentAsignaturaS_7) && ap.profesores === currentProfesores_7; })) {
                                asignaturasProfesores.push({ asigId: currentAsignaturaId_7, carrera: currentAsignaturaC, semestre: currentAsignaturaS_7, asignatura: currentAsignatura_7, horario: currentAsignaturaH, profesores: currentProfesores_7, horas: currentAsignaturaCreditos });
                            }
                        }
                        // Obtener la hora del elemento actual
                        var elementHourStart = currentElement.hourStart;
                        var elementHourEnd = currentElement.hourEnd;
                        // Comprobar si las horas son iguales
                        var rowIndex = i + 1; // Sumar 1 para evitar reemplazar la primera fila (encabezado)
                        var colIndex = j + 1; // Sumar 1 para evitar reemplazar la primera columna (horario)
                        // Insertar el valor en la celda correspondiente
                        if (i === this_3.hours.indexOf(elementHourStart + '-' + elementHourEnd) && j === (days.indexOf(currentElement.dayName))) {
                            if (typeof row_4[colIndex] === 'undefined') {
                                row_4[colIndex] = '';
                            }
                            if (currentElement.elementoType === 'aula') {
                                agrupaciones.push(currentElement);
                                row_4[colIndex] += '\n' + '(' + currentElement.item.nombre + ' - ' + currentElement.item.ubicacion.trim() + ') ';
                            }
                            else {
                                agrupaciones.push(currentElement);
                                row_4[colIndex] += currentElement.item.nombre.trim();
                                row_4[colIndex] += " ( " + currentElement.semestre + ' semestre' + ' - ' + currentElement.carrera + ' - ' + currentElement.item.horario + " )";
                            }
                        }
                    };
                    var this_3 = this;
                    for (var l = 0; l < currentItem.length; l++) {
                        _loop_8(l);
                    }
                }
            }
            worksheet.addRow(row_4).eachCell({ includeEmpty: true }, function (cell) {
                cell.font = { size: 6 };
            });
        }
        for (var i = 18; i <= indiceCellBorder; i++) {
            var rowTablaHorarioItem = worksheet.getRow(i);
            rowTablaHorarioItem.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true }; // Opcional: alinear el contenido
            rowTablaHorarioItem.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true }; // Activar el ajuste de texto
        }
        for (var row_5 = 30; row_5 <= indiceCellBorder; row_5++) {
            for (var col = 1; col <= indiceColumn; col++) {
                var cell = worksheet.getCell("" + String.fromCharCode(64 + col) + row_5);
                cell.border = {
                    top: { style: 'thin', color: { argb: '000000' } },
                    left: { style: 'thin', color: { argb: '000000' } },
                    bottom: { style: 'thin', color: { argb: '000000' } },
                    right: { style: 'thin', color: { argb: '000000' } }
                };
            }
        }
        worksheet.insertRow(indiceCellList, ['Asignaturas', 'N° Horas', 'Modalidad']);
        worksheet.getRow(indiceCellList).eachCell({ includeEmpty: true }, function (cell) {
            cell.font = {
                bold: true,
                size: 8
            };
            cell.border = {
                top: { style: 'thin', color: { argb: '000000' } },
                left: { style: 'thin', color: { argb: '000000' } },
                bottom: { style: 'thin', color: { argb: '000000' } },
                right: { style: 'thin', color: { argb: '000000' } }
            };
            cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: '9b9b9b  ' } // aquí se define el color celeste
            };
        });
        // Crear un objeto para almacenar los resultados agrupados
        var resultadoAgrupado = [];
        // Recorrer el array original y agrupar las asignaturas y aulas
        var asignaturaId;
        agrupaciones.forEach(function (item) {
            if (item.elementoType === "asignatura") {
                asignaturaId = item.item._id;
                if (!resultadoAgrupado[asignaturaId]) {
                    resultadoAgrupado[asignaturaId] = {
                        carrera: item.carrera,
                        dayName: item.dayName,
                        elementoType: item.elementoType,
                        hourEnd: item.hourEnd,
                        hourStart: item.hourStart,
                        identificador: item.identificador,
                        item: item.item,
                        semestre: item.semestre,
                        aulas: []
                    };
                }
            }
            else if (item.elementoType === "aula") {
                if (resultadoAgrupado[asignaturaId]) {
                    resultadoAgrupado[asignaturaId].aulas.push(item);
                }
            }
        });
        // Convertir el objeto resultadoAgrupado en un array de resultados
        var resultadoFinal = Object.values(resultadoAgrupado);
        resultadoFinal.forEach(function (resultado) {
            var todasSonZoom = true;
            var algunaEsZoom = false;
            resultado.aulas.forEach(function (aula) {
                if (aula.item.nombre.toLowerCase() !== "zoom") {
                    todasSonZoom = false;
                }
                else {
                    algunaEsZoom = true;
                }
            });
            if (todasSonZoom) {
                resultado.modalidad = "Virtual";
            }
            else if (!algunaEsZoom) {
                resultado.modalidad = "Presencial";
            }
            else {
                resultado.modalidad = "Mixto (Virtual y Presencial)";
            }
        });
        asignaturasProfesores.forEach(function (elemento1, index) {
            var resultado = resultadoFinal[index];
            if (resultado && resultado.modalidad) {
                elemento1.modalidad = resultado.modalidad;
            }
        });
        var totalHoras = 0;
        asignaturasProfesores.forEach(function (ap) {
            var tipoPeriodo;
            if (ap.horario === "Diurno") {
                tipoPeriodo = "Semestre";
            }
            else {
                tipoPeriodo = "Ciclo";
            }
            worksheet.addRow([ap.asignatura + ' ( ' + ap.semestre + ' ' + tipoPeriodo + ' - ' + ap.carrera + ' ) ' + '( ' + ap.horario + ' )', ap.horas, ap.modalidad]).eachCell({ includeEmpty: true }, function (cell) {
                cell.font = { size: 8 };
                cell.border = {
                    top: { style: 'thin', color: { argb: '000000' } },
                    left: { style: 'thin', color: { argb: '000000' } },
                    bottom: { style: 'thin', color: { argb: '000000' } },
                    right: { style: 'thin', color: { argb: '000000' } }
                };
            });
            totalHoras += parseInt(ap.horas);
            indiceCellList++;
        });
        worksheet.insertRow(indiceCellList + 1, ['Total de horas', totalHoras, '']).eachCell({ includeEmpty: true }, function (cell) {
            cell.font = { size: 8 };
            cell.border = {
                top: { style: 'thin', color: { argb: '000000' } },
                left: { style: 'thin', color: { argb: '000000' } },
                bottom: { style: 'thin', color: { argb: '000000' } },
                right: { style: 'thin', color: { argb: '000000' } }
            };
        });
        for (var i = 0; i <= indiceCellList + 1; i++) {
            var rowTablaHorarioItem = worksheet.getRow(i);
            rowTablaHorarioItem.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true }; // Opcional: alinear el contenido
            rowTablaHorarioItem.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true }; // Activar el ajuste de texto
        }
        var nombreArchivo = 'Horario ' + profesor + '.xlsx';
        workbook.xlsx.writeBuffer().then(function (buffer) {
            var data = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            FileSaver.saveAs(data, nombreArchivo);
        });
    };
    ProfesoresResumenComponent.prototype.exportarPDF = function () {
        // Crear una instancia de jsPDF
        var doc = new jspdf_1["default"]('landscape', 'mm', 'a4');
        var pageWidth = doc.internal.pageSize.width;
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        var titleText = "UNIVERSIDAD IBEROAMERICANA DEL ECUADOR";
        var titleWidth = doc.getTextWidth(titleText);
        var titleX = (pageWidth - titleWidth) / 2;
        doc.text(titleText, titleX, 10);
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        var descriptionText = "MATRIZ RESUMEN DE PROFESORES POR CARRERA";
        var descriptionWidth = doc.getTextWidth(descriptionText);
        var descriptionX = (pageWidth - descriptionWidth) / 2;
        doc.text(descriptionText, descriptionX, 15);
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        var carreraText = "CARRERA: " + this.UserData.rol.toUpperCase();
        var carreraInfoWidth = doc.getTextWidth(carreraText);
        var carreraInfoX = (pageWidth - carreraInfoWidth) / 2;
        doc.text(carreraText, carreraInfoX, 20);
        doc.setFont('helvetica', 'normal');
        var rowDataHead = [];
        var rowDataHead2 = [];
        var rowDataHead3 = [];
        var rowData = [];
        var rowData2 = [];
        var rowData3 = [];
        rowDataHead.push([{ title: "Profesores Tiempo Completo", colSpan: 6, styles: { halign: 'center', fillColor: '#00AFF0' } }]);
        rowDataHead2.push([{ title: "Profesores Medio Tiempo", colSpan: 6, styles: { halign: 'center', fillColor: '#00AFF0' } }]);
        rowDataHead3.push([{ title: "Profesores Tiempo Parcial", colSpan: 6, styles: { halign: 'center', fillColor: '#00AFF0' } }]);
        rowData.push(['Docente', 'Asignaturas', 'N° Horas', 'Total de Horas', 'Observaciones', 'Faltan']);
        rowData2.push(['Docente', 'Asignaturas', 'N° Horas', 'Total de Horas', 'Observaciones', 'Faltan']);
        rowData3.push(['Docente', 'Asignaturas', 'N° Horas', 'Total de Horas', 'Observaciones', 'Faltan']);
        for (var _i = 0, _a = this.asignaturasPorProfesorTiempoCompleto.data; _i < _a.length; _i++) {
            var profesorTCompleto = _a[_i];
            var sumaHoras = 0;
            var isFirstRow = true;
            for (var _b = 0, _c = profesorTCompleto.asignaturas; _b < _c.length; _b++) {
                var asig = _c[_b];
                sumaHoras += parseInt(asig.horas);
            }
            var periodoType = void 0;
            for (var _d = 0, _e = profesorTCompleto.asignaturas; _d < _e.length; _d++) {
                var asignatura = _e[_d];
                if (asignatura.horario === "Nocturno") {
                    periodoType = "Ciclo";
                }
                else {
                    periodoType = "Semestre";
                }
                if (isFirstRow) {
                    rowData.push([profesorTCompleto.profesornombre, asignatura.asignatura + ' ( ' + asignatura.semestre + ' ' + periodoType + ' - ' + asignatura.carrera + ' )' + ' ( ' + asignatura.horario + ' )', asignatura.horas, sumaHoras, profesorTCompleto.profesorObservacion]);
                    isFirstRow = false;
                }
                else {
                    rowData.push(['', asignatura.asignatura + ' ( ' + asignatura.semestre + ' ' + periodoType + ' - ' + asignatura.carrera + ' )' + ' ( ' + asignatura.horario + ' )', asignatura.horas, '']);
                }
            }
        }
        for (var _f = 0, _g = this.asignaturasPorProfesorMedioTiempo.data; _f < _g.length; _f++) {
            var profesorMTiempo = _g[_f];
            var sumaHoras = 0;
            var isFirstRow = true;
            for (var _h = 0, _j = profesorMTiempo.asignaturas; _h < _j.length; _h++) {
                var asig = _j[_h];
                sumaHoras += parseInt(asig.horas);
            }
            var periodoType = void 0;
            for (var _k = 0, _l = profesorMTiempo.asignaturas; _k < _l.length; _k++) {
                var asignatura = _l[_k];
                if (asignatura.horario === "Nocturno") {
                    periodoType = "Ciclo";
                }
                else {
                    periodoType = "Semestre";
                }
                if (isFirstRow) {
                    rowData2.push([profesorMTiempo.profesornombre, asignatura.asignatura + ' ( ' + asignatura.semestre + ' ' + periodoType + ' - ' + asignatura.carrera + ' )' + ' ( ' + asignatura.horario + ' )', asignatura.horas, sumaHoras, profesorMTiempo.profesorObservacion]);
                    isFirstRow = false;
                }
                else {
                    rowData2.push(['', asignatura.asignatura + ' ( ' + asignatura.semestre + ' ' + periodoType + ' - ' + asignatura.carrera + ' )' + ' ( ' + asignatura.horario + ' )', asignatura.horas, '']);
                }
            }
        }
        for (var _m = 0, _o = this.asignaturasPorProfesorTiempoParcial.data; _m < _o.length; _m++) {
            var profesorTParcial = _o[_m];
            var sumaHoras = 0;
            var isFirstRow = true;
            for (var _p = 0, _q = profesorTParcial.asignaturas; _p < _q.length; _p++) {
                var asig = _q[_p];
                sumaHoras += parseInt(asig.horas);
            }
            var periodoType = void 0;
            for (var _r = 0, _s = profesorTParcial.asignaturas; _r < _s.length; _r++) {
                var asignatura = _s[_r];
                if (asignatura.horario === "Nocturno") {
                    periodoType = "Ciclo";
                }
                else {
                    periodoType = "Semestre";
                }
                if (isFirstRow) {
                    rowData3.push([profesorTParcial.profesornombre, asignatura.asignatura + ' ( ' + asignatura.semestre + ' ' + periodoType + ' - ' + asignatura.carrera + ' )' + ' ( ' + asignatura.horario + ' )', asignatura.horas, sumaHoras, profesorTParcial.profesorObservacion]);
                    isFirstRow = false;
                }
                else {
                    rowData3.push(['', asignatura.asignatura + ' ( ' + asignatura.semestre + ' ' + periodoType + ' - ' + asignatura.carrera + ' )' + ' ( ' + asignatura.horario + ' )', asignatura.horas, '']);
                }
            }
        }
        // Agregar la tabla al PDF
        jspdf_autotable_1["default"](doc, {
            head: rowDataHead,
            body: rowData,
            theme: 'grid',
            styles: {
                cellWidth: 45,
                minCellHeight: 5,
                fontSize: 8,
                textColor: [0, 0, 0]
            },
            margin: { top: 25 }
        });
        // Agregar la tabla al PDF
        jspdf_autotable_1["default"](doc, {
            head: rowDataHead2,
            body: rowData2,
            theme: 'grid',
            styles: {
                cellWidth: 45,
                minCellHeight: 5,
                fontSize: 8,
                textColor: [0, 0, 0]
            }
        });
        // Agregar la tabla al PDF
        jspdf_autotable_1["default"](doc, {
            head: rowDataHead3,
            body: rowData3,
            theme: 'grid',
            styles: {
                cellWidth: 45,
                minCellHeight: 5,
                fontSize: 8,
                textColor: [0, 0, 0]
            }
        });
        // Descargar el PDF
        doc.save('Resumen de Docentes' + '.pdf');
    };
    ProfesoresResumenComponent.prototype.exportarExcel = function () {
        // Crear un nuevo libro de Excel
        var workbook = new ExcelJS.Workbook();
        var sheet = workbook.addWorksheet('Resumen de Profesores');
        // Establecer la orientación horizontal y el tamaño del papel
        sheet.pageSetup.orientation = 'landscape';
        sheet.pageSetup.paperSize = 9;
        sheet.pageSetup.fitToPage = true;
        // Agregar el título al Excel
        sheet.getCell('A1').value = 'UNIVERSIDAD IBEROAMERICANA DEL ECUADOR';
        sheet.getCell('A1').font = { size: 14, bold: true };
        sheet.getCell('A1').alignment = { horizontal: 'center' };
        sheet.mergeCells('A1:F1');
        sheet.getCell('A2').value = 'MATRIZ RESUMEN DE PROFESORES POR CARRERA';
        sheet.getCell('A2').font = { size: 14, bold: true };
        sheet.getCell('A2').alignment = { horizontal: 'center' };
        sheet.mergeCells('A2:F2');
        sheet.getCell('A3').value = 'CARRERA: ' + this.UserData.rol.toUpperCase();
        sheet.getCell('A3').font = { size: 14, bold: true };
        sheet.getCell('A3').alignment = { horizontal: 'center' };
        sheet.mergeCells('A3:F3');
        // Agregar encabezados de columna
        sheet.getCell('A5').value = 'Profesores Tiempo Completo';
        sheet.getCell('A5').font = { size: 14, bold: true };
        sheet.getCell('A5').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '00AFF0' } };
        sheet.getCell('A5').alignment = { horizontal: 'center' };
        sheet.mergeCells('A5:F5');
        sheet.getRow(6).values = ['Docente', 'Asignaturas', 'N° Horas', 'Total de Horas', 'Observaciones', 'Faltan'];
        sheet.getRow(6).font = { bold: true };
        sheet.getRow(6).alignment = { horizontal: 'center' };
        var rowIndex = 7;
        var periodoType;
        for (var _i = 0, _a = this.asignaturasPorProfesorTiempoCompleto.data; _i < _a.length; _i++) {
            var profesorTCompleto = _a[_i];
            var sumaHoras = 0;
            for (var _b = 0, _c = profesorTCompleto.asignaturas; _b < _c.length; _b++) {
                var asig = _c[_b];
                sumaHoras += parseInt(asig.horas);
            }
            var asignaturasCount = profesorTCompleto.asignaturas.length;
            var isFirstRow = true;
            for (var i = 0; i < asignaturasCount; i++) {
                var rowIndexStart = rowIndex + i;
                if (isFirstRow) {
                    sheet.getCell("A" + rowIndexStart).value = profesorTCompleto.profesornombre;
                    sheet.getCell("D" + rowIndexStart).value = sumaHoras;
                    sheet.getCell("E" + rowIndexStart).value = profesorTCompleto.profesorObservacion;
                    isFirstRow = false;
                }
                var asignatura = profesorTCompleto.asignaturas[i];
                if (asignatura.horario === "Nocturno") {
                    periodoType = "Ciclo";
                }
                else {
                    periodoType = "Semestre";
                }
                sheet.getCell("B" + rowIndexStart).value = asignatura.asignatura + '\n( ' + asignatura.semestre + ' ' + periodoType + ' - ' + asignatura.carrera + ' )' + '\n( ' + asignatura.horario + ' )';
                sheet.getCell("C" + rowIndexStart).value = asignatura.horas;
            }
            if (asignaturasCount > 1) {
                var rowIndexEnd = rowIndex + asignaturasCount - 1;
                sheet.mergeCells('A' + rowIndex + ':A' + rowIndexEnd);
                sheet.mergeCells('D' + rowIndex + ':D' + rowIndexEnd);
                sheet.mergeCells('E' + rowIndex + ':E' + rowIndexEnd);
            }
            rowIndex += asignaturasCount;
        }
        // Aplicar bordes oscuros a la tabla
        var startRowIndex = 5;
        var endRowIndex = rowIndex - 1;
        var startColumnIndex = 1;
        var endColumnIndex = 6;
        for (var i = startRowIndex; i <= endRowIndex; i++) {
            for (var j = startColumnIndex; j <= endColumnIndex; j++) {
                var cell = sheet.getCell(i, j);
                cell.border = {
                    top: { style: 'thin', color: { argb: '000000' } },
                    left: { style: 'thin', color: { argb: '000000' } },
                    bottom: { style: 'thin', color: { argb: '000000' } },
                    right: { style: 'thin', color: { argb: '000000' } }
                };
                cell.alignment = { wrapText: true };
                cell.alignment = cell.alignment || {};
                cell.alignment.wrapText = true;
                cell.alignment.vertical = 'middle';
                cell.alignment.horizontal = 'center';
            }
        }
        // Ajustar ancho de columna automáticamente
        sheet.columns.forEach(function (column) {
            column.width = 24;
        });
        // Obtener la posición final de la primera tabla
        var primeraTablaFinal = rowIndex;
        // Iniciar la segunda tabla en la fila siguiente a la última fila de la primera tabla
        var segundaTablaInicio = primeraTablaFinal + 1; // Puedes ajustar este valor según tus necesidades
        // Agregar encabezado de la segunda tabla
        sheet.getCell("A" + segundaTablaInicio).value = 'Profesores Medio Tiempo';
        sheet.getCell("A" + segundaTablaInicio).font = { size: 14, bold: true };
        sheet.getCell("A" + segundaTablaInicio).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '00AFF0' } };
        sheet.getCell("A" + segundaTablaInicio).alignment = { horizontal: 'center' };
        sheet.mergeCells("A" + segundaTablaInicio + ":F" + segundaTablaInicio);
        sheet.getRow(segundaTablaInicio + 1).values = ['Docente', 'Asignaturas', 'N° Horas', 'Total de Horas', 'Observaciones', 'Faltan'];
        sheet.getRow(segundaTablaInicio + 1).font = { bold: true };
        sheet.getRow(segundaTablaInicio + 1).alignment = { horizontal: 'center' };
        for (var _d = 0, _e = this.asignaturasPorProfesorMedioTiempo.data; _d < _e.length; _d++) {
            var profesorMTiempo = _e[_d];
            var sumaHoras = 0;
            for (var _f = 0, _g = profesorMTiempo.asignaturas; _f < _g.length; _f++) {
                var asig = _g[_f];
                sumaHoras += parseInt(asig.horas);
            }
            var asignaturasCount = profesorMTiempo.asignaturas.length;
            var isFirstRow = true;
            for (var i = 0; i < asignaturasCount; i++) {
                var rowIndexStart = segundaTablaInicio + 2 + i;
                if (isFirstRow) {
                    sheet.getCell("A" + rowIndexStart).value = profesorMTiempo.profesornombre;
                    sheet.getCell("D" + rowIndexStart).value = sumaHoras;
                    sheet.getCell("E" + rowIndexStart).value = profesorMTiempo.profesorObservacion;
                    isFirstRow = false;
                }
                var asignatura = profesorMTiempo.asignaturas[i];
                if (asignatura.horario === "Nocturno") {
                    periodoType = "Ciclo";
                }
                else {
                    periodoType = "Semestre";
                }
                sheet.getCell("B" + rowIndexStart).value = asignatura.asignatura + '\n( ' + asignatura.semestre + ' ' + periodoType + ' - ' + asignatura.carrera + ' )' + '\n( ' + asignatura.horario + ' )';
                sheet.getCell("C" + rowIndexStart).value = asignatura.horas;
            }
            if (asignaturasCount > 1) {
                var rowIndexEnd = (segundaTablaInicio + 2) + asignaturasCount - 1;
                sheet.mergeCells('A' + (segundaTablaInicio + 2) + ':A' + rowIndexEnd);
                sheet.mergeCells('D' + (segundaTablaInicio + 2) + ':D' + rowIndexEnd);
                sheet.mergeCells('E' + (segundaTablaInicio + 2) + ':E' + rowIndexEnd);
            }
            segundaTablaInicio += asignaturasCount;
        }
        // Aplicar bordes oscuros a la tabla
        startRowIndex = primeraTablaFinal + 1;
        endRowIndex = segundaTablaInicio + this.asignaturasPorProfesorMedioTiempo.data.length;
        startColumnIndex = 1;
        endColumnIndex = 6;
        for (var i = startRowIndex; i <= endRowIndex; i++) {
            for (var j = startColumnIndex; j <= endColumnIndex; j++) {
                var cell = sheet.getCell(i, j);
                cell.border = {
                    top: { style: 'thin', color: { argb: '000000' } },
                    left: { style: 'thin', color: { argb: '000000' } },
                    bottom: { style: 'thin', color: { argb: '000000' } },
                    right: { style: 'thin', color: { argb: '000000' } }
                };
                cell.alignment = cell.alignment || {};
                cell.alignment.wrapText = true;
                cell.alignment.vertical = 'middle';
                cell.alignment.horizontal = 'center';
            }
        }
        // Obtener la posición final de la primera tabla
        var segundaTablaFinal = segundaTablaInicio;
        // Iniciar la segunda tabla en la fila siguiente a la última fila de la primera tabla
        var terceraTablaInicio = segundaTablaFinal + 3; // Puedes ajustar este valor según tus necesidades
        // Agregar encabezado de la segunda tabla
        sheet.getCell("A" + terceraTablaInicio).value = 'Profesores Tiempo Parcial';
        sheet.getCell("A" + terceraTablaInicio).font = { size: 14, bold: true };
        sheet.getCell("A" + terceraTablaInicio).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '00AFF0' } };
        sheet.getCell("A" + terceraTablaInicio).alignment = { horizontal: 'center' };
        sheet.mergeCells("A" + terceraTablaInicio + ":F" + terceraTablaInicio);
        sheet.getRow(terceraTablaInicio + 1).values = ['Docente', 'Asignaturas', 'N° Horas', 'Total de Horas', 'Observaciones', 'Faltan'];
        sheet.getRow(terceraTablaInicio + 1).font = { bold: true };
        sheet.getRow(terceraTablaInicio + 1).alignment = { horizontal: 'center' };
        for (var _h = 0, _j = this.asignaturasPorProfesorTiempoParcial.data; _h < _j.length; _h++) {
            var profesorTParcial = _j[_h];
            var sumaHoras = 0;
            for (var _k = 0, _l = profesorTParcial.asignaturas; _k < _l.length; _k++) {
                var asig = _l[_k];
                sumaHoras += parseInt(asig.horas);
            }
            var asignaturasCount = profesorTParcial.asignaturas.length;
            var isFirstRow = true;
            for (var i = 0; i < asignaturasCount; i++) {
                var rowIndexStart = (terceraTablaInicio + 2) + i;
                if (isFirstRow) {
                    sheet.getCell("A" + rowIndexStart).value = profesorTParcial.profesornombre;
                    sheet.getCell("D" + rowIndexStart).value = sumaHoras;
                    sheet.getCell("E" + rowIndexStart).value = profesorTParcial.profesorObservacion;
                    isFirstRow = false;
                }
                var asignatura = profesorTParcial.asignaturas[i];
                if (asignatura.horario === "Nocturno") {
                    periodoType = "Ciclo";
                }
                else {
                    periodoType = "Semestre";
                }
                sheet.getCell("B" + rowIndexStart).value = asignatura.asignatura + '\n( ' + asignatura.semestre + ' ' + periodoType + ' - ' + asignatura.carrera + ' )' + '\n( ' + asignatura.horario + ' )';
                sheet.getCell("C" + rowIndexStart).value = asignatura.horas;
            }
            if (asignaturasCount > 1) {
                var rowIndexEnd = (terceraTablaInicio + 2) + asignaturasCount - 1;
                sheet.mergeCells('A' + (terceraTablaInicio + 2) + ':A' + rowIndexEnd);
                sheet.mergeCells('D' + (terceraTablaInicio + 2) + ':D' + rowIndexEnd);
                sheet.mergeCells('E' + (terceraTablaInicio + 2) + ':E' + rowIndexEnd);
            }
            terceraTablaInicio += asignaturasCount;
        }
        // Aplicar bordes oscuros a la tabla
        startRowIndex = segundaTablaFinal + 3;
        endRowIndex = terceraTablaInicio + this.asignaturasPorProfesorMedioTiempo.data.length;
        startColumnIndex = 1;
        endColumnIndex = 6;
        for (var i = startRowIndex; i <= endRowIndex; i++) {
            for (var j = startColumnIndex; j <= endColumnIndex; j++) {
                var cell = sheet.getCell(i, j);
                cell.border = {
                    top: { style: 'thin', color: { argb: '000000' } },
                    left: { style: 'thin', color: { argb: '000000' } },
                    bottom: { style: 'thin', color: { argb: '000000' } },
                    right: { style: 'thin', color: { argb: '000000' } }
                };
                cell.alignment = cell.alignment || {};
                cell.alignment.wrapText = true;
                cell.alignment.vertical = 'middle';
                cell.alignment.horizontal = 'center';
            }
        }
        // Guardar el archivo Excel
        var fileName = 'Resumen de Docentes.xlsx';
        workbook.xlsx.writeBuffer().then(function (data) {
            var blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            var url = window.URL.createObjectURL(blob);
            var link = document.createElement('a');
            link.href = url;
            link.download = fileName;
            link.click();
            window.URL.revokeObjectURL(url);
        });
    };
    ProfesoresResumenComponent.prototype.allProfesores = function () {
        this._router.navigate(['/especificacion/profesores']);
    };
    ProfesoresResumenComponent.prototype.resumenProfesores = function () {
        this._router.navigate(['/especificacion/profesores/resumen-profesores']);
        location.reload();
    };
    ProfesoresResumenComponent.prototype.redirectEdit = function (id) {
        this._router.navigate(['/especificacion/profesores/editarProfesor/', id]);
    };
    __decorate([
        core_1.ViewChild('paginator', { static: false })
    ], ProfesoresResumenComponent.prototype, "paginator");
    __decorate([
        core_1.ViewChild('paginator2', { static: false })
    ], ProfesoresResumenComponent.prototype, "paginator2");
    __decorate([
        core_1.ViewChild('paginator3', { static: false })
    ], ProfesoresResumenComponent.prototype, "paginator3");
    ProfesoresResumenComponent = __decorate([
        core_1.Component({
            selector: 'app-profesores-resumen',
            templateUrl: './profesores-resumen.component.html',
            styleUrls: ['./profesores-resumen.component.css'],
            providers: [horario_service_1.HorarioService, asignatura_service_1.AsignaturaService, aula_service_1.AulaService, profesor_service_1.ProfesorService]
        })
    ], ProfesoresResumenComponent);
    return ProfesoresResumenComponent;
}());
exports.ProfesoresResumenComponent = ProfesoresResumenComponent;
function uuidv4() {
    throw new Error('Function not implemented.');
}
