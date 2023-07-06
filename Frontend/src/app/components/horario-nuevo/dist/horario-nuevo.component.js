"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
exports.HorarioNuevoComponent = void 0;
var ExcelJS = require("exceljs");
var core_1 = require("@angular/core");
var drag_drop_1 = require("@angular/cdk/drag-drop");
var asignatura_1 = require("../models/asignatura");
var asignatura_service_1 = require("../services/asignatura.service");
var aula_service_1 = require("../services/aula.service");
var horario_service_1 = require("../services/horario.service");
var sweetalert2_1 = require("sweetalert2");
var horario_1 = require("../models/horario");
var jspdf_1 = require("jspdf");
var jspdf_autotable_1 = require("jspdf-autotable");
var FileSaver = require("file-saver");
var uuid_1 = require("uuid");
var detalle_service_1 = require("../services/detalle.service");
var usuario_service_1 = require("../services/usuario.service");
var HorarioNuevoComponent = /** @class */ (function () {
    function HorarioNuevoComponent(_route, _router, _asignaturaService, _aulasService, _horarioService, _detalleService, _usuarioService) {
        this._route = _route;
        this._router = _router;
        this._asignaturaService = _asignaturaService;
        this._aulasService = _aulasService;
        this._horarioService = _horarioService;
        this._detalleService = _detalleService;
        this._usuarioService = _usuarioService;
        this.profesores = [];
        this.listaA = [];
        this.opcion1 = "";
        this.opcion2 = "";
        this.opcion3 = "";
        this.opcion4 = "";
        this.opcion5 = "";
        this.horarios = [];
        this.asignaturaHorario = [];
        this.aulaHorario = [];
        this.isActiveBtn = false;
        this.isActiveBtnG = false;
        this.isActiveBtnV = true;
        this.verificarDiaPresencialVirtualBolean = false;
        this.verificarAulaUbicacionBolean = false;
        this.monday = [];
        this.tuesday = [];
        this.wednesday = [];
        this.thursday = [];
        this.friday = [];
        this.saturday = [];
        this.terminoBusquedaAsignatura = '';
        this.terminoBusquedaAsignaturaStatic = '';
        this.terminoBusquedaAsignaturaBoolean = false;
        this.terminoBusquedaAula = '';
        this.asignaturasFiltradas = [];
        this.asignaturasFiltradasDrop = [];
        this.asignaturasFiltradasDropReverse = [];
        this.aulasFiltradas = [];
        this.usuarios = [];
        this.revisador = [];
        this.aprobador = [];
        this.arrastreAsignaturas = [];
        this.horarioHoras = "";
        this.horario = new horario_1.Horario('', '', '', '', '', [], [], [], [], this.usuario);
        this.existHorarioCarrera = false;
        this.getHorarios();
        this.authToken = this._detalleService.authToken;
        this.userData = this._detalleService.userData;
    }
    HorarioNuevoComponent.prototype.ngOnInit = function () {
        this.getHorarios();
        this.getAulas();
        this.getUsuarios();
        this.getDataDetalles();
        this.getAsignaturas();
    };
    HorarioNuevoComponent.prototype.getDataDetalles = function () {
        var _this = this;
        this._route.params.subscribe(function (params) {
            _this.opcion2 = params['opcion2'];
            _this.opcion1 = params['opcion1'];
            console.log(_this.opcion1);
        });
        if (this.opcion2 !== "Ingles") {
            if (this.opcion1 === "Horario_Diurno") {
                this.horarioHoras = "1D";
            }
            else {
                this.horarioHoras = "1N";
            }
            this._detalleService.getHorasDiurnas().subscribe(function (horasDiurnas) {
                _this.hours = horasDiurnas;
            });
            this._detalleService.getHorasNocturnas().subscribe(function (horasNocturnas) {
                _this.hoursnight = horasNocturnas;
            });
        }
        else {
            if (this.opcion1 === "Horario_Diurno") {
                this.horarioHoras = "2D";
            }
            else {
                this.horarioHoras = "2N";
            }
            this._detalleService.getHorasAlternativaDiurnas().subscribe(function (horasAlternativaDiurnas) {
                _this.hours = horasAlternativaDiurnas;
            });
            this._detalleService.getHorasAlternativaNocturnas().subscribe(function (horasAlternativaNocturnas) {
                _this.hoursnight = horasAlternativaNocturnas;
            });
        }
    };
    HorarioNuevoComponent.prototype.onOptionSelectedHorario = function (horario) {
        var _this = this;
        this.monday = [];
        this.tuesday = [];
        this.wednesday = [];
        this.thursday = [];
        this.friday = [];
        this.saturday = [];
        this.asignaturasFiltradas = [];
        this.getAsignaturas();
        if (horario === "horasNocturnas") {
            this._detalleService.getHorasNocturnas().subscribe(function (horasNocturnas) {
                _this.hoursnight = horasNocturnas;
                _this.horarioHoras = "1N";
            });
        }
        else if (horario === "horasAlternativaNocturnas") {
            this._detalleService.getHorasAlternativaNocturnas().subscribe(function (horasAlternativaNocturnas) {
                _this.hoursnight = horasAlternativaNocturnas;
                _this.horarioHoras = "2N";
            });
        }
        else if (horario === "horasDiurnas") {
            this._detalleService.getHorasDiurnas().subscribe(function (horasDiurnas) {
                _this.hours = horasDiurnas;
                _this.horarioHoras = "1D";
            });
        }
        else if (horario === "horasAlternativaDiurnas") {
            this._detalleService.getHorasAlternativaDiurnas().subscribe(function (horasAlternativaDiurnas) {
                _this.hours = horasAlternativaDiurnas;
                _this.horarioHoras = "2D";
            });
        }
    };
    HorarioNuevoComponent.prototype.filtrarAsignaturas = function () {
        var _a;
        var _this = this;
        if (this.terminoBusquedaAsignaturaStatic !== "") {
            this.terminoBusquedaAsignaturaBoolean = true;
        }
        else if (this.terminoBusquedaAsignaturaStatic === "") {
            this.terminoBusquedaAsignaturaBoolean = false;
        }
        if (this.terminoBusquedaAsignatura === "") {
            this.terminoBusquedaAsignaturaBoolean = false;
        }
        if (this.terminoBusquedaAsignaturaBoolean === false) {
            this.asignaturasFiltradas = this.asignaturas.filter(function (asignatura) { return asignatura.nombre.toLowerCase().includes(_this.terminoBusquedaAsignatura.toLowerCase()); });
            if (this.terminoBusquedaAsignatura === "") {
                this.terminoBusquedaAsignaturaStatic = "";
                for (var i = 0; i < this.asignaturasFiltradasDrop.length; i++) {
                    var elemento2 = this.asignaturasFiltradasDrop[i];
                    // Buscar el elemento2 en array1
                    for (var j = 0; j < this.asignaturas.length; j++) {
                        var elemento1 = this.asignaturas[j];
                        // Comparar los elementos por su _id (puedes ajustar esto según tus necesidades)
                        if (elemento1._id === elemento2._id) {
                            // Eliminar el elemento coincidente de array1
                            this.asignaturas.splice(j, 1);
                            break; // Salir del bucle interno una vez que se haya eliminado el elemento
                        }
                    }
                }
                this.asignaturasFiltradasDrop = [];
                if (this.asignaturasFiltradasDropReverse.length !== 0) {
                    (_a = this.asignaturas).push.apply(_a, this.asignaturasFiltradasDropReverse);
                }
                this.asignaturasFiltradas = this.asignaturas;
                this.asignaturasFiltradasDropReverse = [];
            }
        }
    };
    HorarioNuevoComponent.prototype.filtrarAulas = function () {
        var _this = this;
        this.aulasFiltradas = this.aulas.filter(function (aula) { return aula.nombre.toLowerCase().includes(_this.terminoBusquedaAula.toLowerCase()); });
    };
    HorarioNuevoComponent.prototype.getAulas = function () {
        var _this = this;
        this._route;
        this._aulasService.getAulas().subscribe(function (response) {
            if (response.aulas) {
                _this.aulas = response.aulas;
                _this.aulasFiltradas = _this.aulas;
            }
        }, function (error) {
            console.log(error);
        });
    };
    HorarioNuevoComponent.prototype.getAsignaturas = function () {
        var _this = this;
        this._route.params.subscribe(function (params) {
            _this.opcion2 = params['opcion2'];
            _this.opcion1 = params['opcion1'];
            _this.opcion3 = params['opcion3'];
            _this.opcion4 = params['opcion4'];
            _this.opcion5 = params['opcion5'];
            _this.opcion2 = _this.opcion2.replace(/_/g, " ");
            _this.opcion1 = _this.opcion1.replace(/_/g, " ");
            if (_this.opcion5) {
                _this.is_Paralelo = true;
            }
            else {
                _this.is_Paralelo = false;
            }
            if (_this.opcion1 === "Horario Diurno") {
                _this.is_Diurno = true;
            }
            else {
                _this.is_Diurno = false;
            }
            _this._asignaturaService.search(_this.opcion2, _this.opcion3).subscribe(function (response) {
                if (response.asignaturas) {
                    _this.asignaturas = []; // Reiniciar el array de asignaturas
                    // Iterar sobre las asignaturas obtenidas en la respuesta
                    response.asignaturas.forEach(function (asignatura) {
                        var creditos = asignatura.creditos; // Obtener la cantidad de créditos de la asignatura
                        // Clonar la asignatura por la cantidad de créditos y guardarlas en el array this.asignaturas
                        for (var i = 0; i < creditos; i++) {
                            var asignaturaClonada = new asignatura_1.Asignatura(asignatura._id, asignatura.nombre, asignatura.carrera, asignatura.semestre, asignatura.profesor, asignatura.horario, asignatura.creditos, asignatura.abreviatura, asignatura.color, asignatura.paralelo, asignatura.ciclo);
                            _this.asignaturas.push(asignaturaClonada);
                        }
                    });
                    var tipoHorarioAsig_1;
                    if (_this.opcion1 === "Horario Diurno") {
                        tipoHorarioAsig_1 = 'Diurno';
                    }
                    else {
                        tipoHorarioAsig_1 = "Nocturno";
                    }
                    if (_this.opcion5 === undefined || _this.opcion5 === "") {
                        _this.opcion5 = "";
                    }
                    if (_this.opcion4 === undefined || _this.opcion4 === "") {
                        _this.opcion4 = "";
                    }
                    _this.asignaturas = _this.asignaturas.filter(function (asignatura) { return asignatura.horario === tipoHorarioAsig_1; });
                    if ((_this.opcion5 === undefined || _this.opcion5 === "") && (_this.opcion4 === undefined || _this.opcion4 === "")) {
                        _this.asignaturas = _this.asignaturas.filter(function (asignatura) { return asignatura.horario === tipoHorarioAsig_1 && asignatura.paralelo.length === 0 && asignatura.ciclo.length === 0; });
                    }
                    else if ((tipoHorarioAsig_1 === "Diurno") && (_this.opcion4 !== undefined || _this.opcion4 !== "") && (_this.opcion5 === undefined || _this.opcion5 === "")) {
                        _this.asignaturas = _this.asignaturas.filter(function (asignatura) { return asignatura.horario === tipoHorarioAsig_1 && asignatura.paralelo && asignatura.paralelo.includes(_this.opcion4); });
                    }
                    else if ((tipoHorarioAsig_1 === "Nocturno") && (_this.opcion4 !== undefined || _this.opcion4 !== "") && (_this.opcion5 === undefined || _this.opcion5 === "")) {
                        _this.asignaturas = _this.asignaturas.filter(function (asignatura) { return asignatura.horario === tipoHorarioAsig_1 && asignatura.ciclo && asignatura.ciclo.includes(_this.opcion4); });
                    }
                    else if ((_this.opcion4 !== undefined || _this.opcion4 !== "") && (_this.opcion5 !== undefined || _this.opcion5 !== "")) {
                        _this.asignaturas = _this.asignaturas.filter(function (asignatura) { return asignatura.horario === tipoHorarioAsig_1 && asignatura.paralelo && asignatura.paralelo.includes(_this.opcion5) && asignatura.ciclo && asignatura.ciclo.includes(_this.opcion4); });
                    }
                    _this.asignaturasFiltradas = _this.asignaturas;
                }
            }, function (error) {
                console.log(error);
            });
        });
    };
    HorarioNuevoComponent.prototype.getUsuarios = function () {
        var _this = this;
        this._usuarioService.getUsuarios().subscribe(function (response) {
            if (response.usuarios) {
                _this.usuarios = response.usuarios;
                for (var _i = 0, _a = _this.usuarios; _i < _a.length; _i++) {
                    var usuario = _a[_i];
                    if (usuario.rol === "Aprobador") {
                        _this.aprobador = usuario;
                    }
                    else if (usuario.rol === "Revisador") {
                        _this.revisador = usuario;
                    }
                }
            }
        }, function (error) {
            console.log(error);
        });
    };
    HorarioNuevoComponent.prototype.getDayData = function (day, hour) {
        switch (day) {
            case 0:
                return this.monday.filter(function (item) { return item.hourStart === hour.split('-')[0] && item.hourEnd === hour.split('-')[1]; }).map(function (item) { return item.item; });
            case 1:
                return this.tuesday.filter(function (item) { return item.hourStart === hour.split('-')[0] && item.hourEnd === hour.split('-')[1]; }).map(function (item) { return item.item; });
            case 2:
                return this.wednesday.filter(function (item) { return item.hourStart === hour.split('-')[0] && item.hourEnd === hour.split('-')[1]; }).map(function (item) { return item.item; });
            case 3:
                return this.thursday.filter(function (item) { return item.hourStart === hour.split('-')[0] && item.hourEnd === hour.split('-')[1]; }).map(function (item) { return item.item; });
            case 4:
                return this.friday.filter(function (item) { return item.hourStart === hour.split('-')[0] && item.hourEnd === hour.split('-')[1]; }).map(function (item) { return item.item; });
            case 5:
                return this.saturday.filter(function (item) { return item.hourStart === hour.split('-')[0] && item.hourEnd === hour.split('-')[1]; }).map(function (item) { return item.item; });
            default:
                return [];
        }
    };
    HorarioNuevoComponent.prototype.drop = function (event) {
        if (event.previousContainer === event.container) {
            drag_drop_1.moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
        }
        else {
            this.isActiveBtn = false;
            var item = [];
            var idParts = [];
            var day = [];
            var hourStart_1 = [];
            var hourEnd_1 = [];
            var dayName = [];
            var identificador = [];
            this.isActiveBtnG = false;
            var daysOfWeek = ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado'];
            item = event.previousContainer.data[event.previousIndex];
            idParts = event.container.id.split('-');
            day = Number(idParts[0]);
            hourStart_1 = idParts[1];
            hourEnd_1 = idParts[2];
            dayName = daysOfWeek[day];
            identificador = Number(idParts[0]) + '' + '' + Number(idParts[3]);
            // listasignatura id
            var idPartsAsignatura = [];
            var elementoType_1 = [];
            idPartsAsignatura = event.item.element.nativeElement.id.split('-');
            elementoType_1 = (idPartsAsignatura[0]);
            if (item.ubicacion) {
                elementoType_1 = "aula";
                identificador = identificador + 'aula';
            }
            else if (!item.ubicacion) {
                elementoType_1 = "asignatura";
                identificador = identificador + 'asignatura';
            }
            // Verificar si ya hay un elemento en la celda
            var existingItem = null;
            switch (day) {
                case 0:
                    existingItem = this.monday.find(function (item) { return (item.elementoType === elementoType_1) && (item.elementoType === item.elementoType) && item.hourStart === hourStart_1 && item.hourEnd === hourEnd_1; });
                    break;
                case 1:
                    existingItem = this.tuesday.find(function (item) { return item.elementoType === elementoType_1 && item.hourStart === hourStart_1 && item.hourEnd === hourEnd_1; });
                    break;
                case 2:
                    existingItem = this.wednesday.find(function (item) { return item.elementoType === elementoType_1 && item.hourStart === hourStart_1 && item.hourEnd === hourEnd_1; });
                    break;
                case 3:
                    existingItem = this.thursday.find(function (item) { return item.elementoType === elementoType_1 && item.hourStart === hourStart_1 && item.hourEnd === hourEnd_1; });
                    break;
                case 4:
                    existingItem = this.friday.find(function (item) { return item.elementoType === elementoType_1 && item.hourStart === hourStart_1 && item.hourEnd === hourEnd_1; });
                    break;
                case 5:
                    existingItem = this.saturday.find(function (item) { return item.elementoType === elementoType_1 && item.hourStart === hourStart_1 && item.hourEnd === hourEnd_1; });
                    break;
            }
            if (existingItem) {
                return;
            }
            //logica de arrastre de listas y horario para mantener organizado
            if (!event.container.id.startsWith('0-')
                && !event.container.id.startsWith('1-')
                && !event.container.id.startsWith('2-')
                && !event.container.id.startsWith('3-')
                && !event.container.id.startsWith('4-')
                && !event.container.id.startsWith('5-')) {
                if (event.container.id.includes('IdListaAsignaturas') && event.previousContainer.id.includes('IdListaAulas')) {
                    return;
                }
                if (event.container.id.includes('IdListaAulas') && event.previousContainer.id.includes('IdListaAsignaturas')) {
                    return;
                }
            }
            // Permitir transferencia si ya se encuentra en la lista de horarios
            if (event.previousContainer.id.startsWith('0-')
                || event.previousContainer.id.startsWith('1-')
                || event.previousContainer.id.startsWith('2-')
                || event.previousContainer.id.startsWith('3-')
                || event.previousContainer.id.startsWith('4-')
                || event.previousContainer.id.startsWith('5-')) {
                // Permitir transferencia a lista de asignatura (cdk-drop-0)
                if (!(elementoType_1 === "aula" && event.container.id.includes('IdListaAulas'))
                    && !(elementoType_1 === "asignatura" && event.container.id.includes('IdListaAsignaturas'))
                    && !event.container.id.startsWith('0-')
                    && !event.container.id.startsWith('1-')
                    && !event.container.id.startsWith('2-')
                    && !event.container.id.startsWith('3-')
                    && !event.container.id.startsWith('4-')
                    && !event.container.id.startsWith('5-')) {
                    return; // Permitir transferencia
                }
            }
            //Eliminar origen del array
            var prevIdParts = [];
            var prevDay = [];
            var preIdentificador = [];
            prevIdParts = event.previousContainer.id.split('-');
            prevDay = Number(prevIdParts[0]);
            preIdentificador = Number(prevIdParts[0]) + '' + '' + Number(prevIdParts[3]);
            if (item.ubicacion) {
                preIdentificador = preIdentificador + 'aula';
            }
            else if (!item.ubicacion) {
                preIdentificador = preIdentificador + 'asignatura';
            }
            switch (prevDay) {
                case 0:
                    for (var i = 0; i < this.monday.length; i++) {
                        if (this.monday[i].identificador === preIdentificador) {
                            this.monday.splice(i, 1);
                            break;
                        }
                    }
                    break;
                case 1:
                    for (var i = 0; i < this.tuesday.length; i++) {
                        if (this.tuesday[i].identificador === preIdentificador) {
                            this.tuesday.splice(i, 1);
                            break;
                        }
                    }
                    break;
                case 2:
                    for (var i = 0; i < this.wednesday.length; i++) {
                        if (this.wednesday[i].identificador === preIdentificador) {
                            this.wednesday.splice(i, 1);
                            break;
                        }
                    }
                    break;
                case 3:
                    for (var i = 0; i < this.thursday.length; i++) {
                        if (this.thursday[i].identificador === preIdentificador) {
                            this.thursday.splice(i, 1);
                            break;
                        }
                    }
                    break;
                case 4:
                    for (var i = 0; i < this.friday.length; i++) {
                        if (this.friday[i].identificador === preIdentificador) {
                            this.friday.splice(i, 1);
                            break;
                        }
                    }
                    break;
                case 5:
                    for (var i = 0; i < this.saturday.length; i++) {
                        if (this.saturday[i].identificador === preIdentificador) {
                            this.saturday.splice(i, 1);
                            break;
                        }
                    }
                    break;
            }
            var newItem = [];
            newItem = { identificador: identificador, elementoType: elementoType_1, dayName: dayName, hourStart: hourStart_1, hourEnd: hourEnd_1, item: __assign({}, item) };
            if (item.ubicacion) {
                newItem.elementoType = "aula";
            }
            else if (!item.ubicacion) {
                newItem.elementoType = "asignatura";
            }
            switch (day) {
                case 0:
                    this.monday.push(newItem);
                    break;
                case 1:
                    this.tuesday.push(newItem);
                    break;
                case 2:
                    this.wednesday.push(newItem);
                    break;
                case 3:
                    this.thursday.push(newItem);
                    break;
                case 4:
                    this.friday.push(newItem);
                    break;
                case 5:
                    this.saturday.push(newItem);
                    break;
            }
            if (!item.profesor) {
            }
            else {
                drag_drop_1.transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
            }
            this.verificarDiaPresencialVirtual();
            this.verificarAulaUbicacion();
            if (this.terminoBusquedaAsignatura !== "" && newItem.dayName !== undefined && !newItem.item.compartida) {
                this.asignaturasFiltradasDrop.push(newItem.item);
                this.terminoBusquedaAsignaturaStatic = this.terminoBusquedaAsignatura;
                console.log(this.terminoBusquedaAsignaturaStatic);
            }
            else if (this.terminoBusquedaAsignatura !== "" && newItem.dayName === undefined && !newItem.item.compartida) {
                if (this.asignaturasFiltradasDrop.length === 0) {
                    this.asignaturasFiltradasDropReverse.push(newItem.item);
                }
                // Verificar si hay una coincidencia en this.asignaturasFiltradasDrop y eliminarla
                for (var i = 0; i < this.asignaturasFiltradasDrop.length; i++) {
                    var elemento = this.asignaturasFiltradasDrop[i];
                    if (elemento._id === newItem.item._id) {
                        this.asignaturasFiltradasDrop.splice(i, 1);
                        break;
                    }
                }
            }
        }
    };
    HorarioNuevoComponent.prototype.getAulaId = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        _this._aulasService.getAula(id).subscribe(function (response) {
                            if (response.aula) {
                                _this.aulaHorario.push(response.aula);
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
    HorarioNuevoComponent.prototype.getAsignaturaId = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        _this._asignaturaService.getAsignatura(id).subscribe(function (response) {
                            if (response.asignatura) {
                                _this.asignaturaHorario.push(response.asignatura);
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
    HorarioNuevoComponent.prototype.getHorarios = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                this._horarioService.getHorarios().subscribe(function (response) {
                    if (response.horarios) {
                        _this.horarios = response.horarios;
                        if (_this.opcion4 === undefined) {
                            _this.opcion4 = "";
                        }
                        if (_this.opcion5 === undefined) {
                            _this.opcion5 = "";
                        }
                        for (var _i = 0, _a = _this.horarios; _i < _a.length; _i++) {
                            var horario = _a[_i];
                            if (horario.paralelo === undefined) {
                                horario.paralelo = "";
                            }
                            if (horario.ciclo === undefined) {
                                horario.ciclo = "";
                            }
                            if (_this.opcion1 === "Horario Nocturno") {
                                if (horario.carrera === _this.opcion2 && horario.semestre === _this.opcion3 && horario.tipoHorario === _this.opcion1 && horario.ciclo === _this.opcion4 && horario.paralelo === _this.opcion5) {
                                    _this.existHorarioCarrera = true;
                                }
                            }
                            else {
                                if (horario.carrera === _this.opcion2 && horario.semestre === _this.opcion3 && horario.tipoHorario === _this.opcion1 && horario.paralelo === _this.opcion4) {
                                    _this.existHorarioCarrera = true;
                                }
                            }
                        }
                        if (_this.opcion1 === "Horario Nocturno") {
                            _this.periodoTipo = "ciclo";
                        }
                        else {
                            _this.periodoTipo = "semestre";
                        }
                        if (_this.opcion2 === "Ingles") {
                            _this.periodoTipo = "Nivel";
                        }
                        if (_this.periodoTipo === "ciclo") {
                            _this.horarios = _this.horarios.filter(function (horario) { return horario.tipoHorario === _this.opcion1 && horario.ciclo === _this.opcion4; });
                        }
                        else {
                            _this.horarios = _this.horarios.filter(function (horario) { return horario.tipoHorario === _this.opcion1; });
                        }
                        if (_this.existHorarioCarrera) {
                            sweetalert2_1["default"].fire({
                                title: 'EL Horario de ' + _this.opcion2 + ' del ' + _this.opcion3 + ' ' + _this.periodoTipo + ' ya existe.',
                                text: 'Por favor, si desea modificar vaya a la sección de horarios',
                                icon: 'error',
                                showCancelButton: true,
                                confirmButtonColor: '#4CAF50',
                                cancelButtonColor: '#3085d6',
                                confirmButtonText: 'Ir'
                            }).then(function (result) {
                                if (result.isConfirmed) {
                                    _this._router.navigate(['/horarios']);
                                }
                                else {
                                    _this._router.navigate(['/home']);
                                }
                            });
                        }
                    }
                }, function (error) {
                    console.log(error);
                });
                return [2 /*return*/];
            });
        });
    };
    HorarioNuevoComponent.prototype.submit = function () {
        return __awaiter(this, void 0, void 0, function () {
            var arreglosHorario, identificadoresAulas, identificadoresAsignaturas, datosIguales, elementoComprobarTipo, elementoComprobarId, asig, aula, _i, arreglosHorario_1, dias, _a, dias_1, objetoElementoType, _b, dias_2, objeto, _c, elementoComprobarTipo_1, element, parejas, i, primeraTresLetras, j, items, index, i, asignatura, aula_1, itemsIdent, index2, i, IdAsignatura, IdAula;
            var _this = this;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0: return [4 /*yield*/, this.getHorarios()];
                    case 1:
                        _d.sent();
                        this.aulaHorario = [];
                        this.asignaturaHorario = [];
                        this.horario.horarioHoras = "";
                        this.horario = new horario_1.Horario('', '', '', '', '', [], [], [], [], this.usuario, '', '', '', '');
                        arreglosHorario = [
                            this.monday,
                            this.tuesday,
                            this.wednesday,
                            this.thursday,
                            this.friday,
                            this.saturday
                        ];
                        identificadoresAulas = [];
                        identificadoresAsignaturas = [];
                        datosIguales = false;
                        if (this.opcion1 == "Horario Diurno") {
                            this.horario.tipoHorario = "Horario Diurno";
                        }
                        else {
                            this.horario.tipoHorario = "Horario Nocturno";
                        }
                        this.horario.estado = "Pendiente (Creado)";
                        this.horario.carrera = this.opcion2;
                        this.horario.semestre = this.opcion3;
                        this.horario.creado_por = this.userData;
                        this.horario.horarioHoras = this.horarioHoras;
                        if (this.opcion1 == "Horario Diurno") {
                            this.horario.paralelo = this.opcion4;
                            this.horario.ciclo = "";
                        }
                        else {
                            this.horario.paralelo = this.opcion5;
                            this.horario.ciclo = this.opcion4;
                        }
                        elementoComprobarTipo = [];
                        elementoComprobarId = [];
                        asig = 0;
                        aula = 0;
                        _i = 0, arreglosHorario_1 = arreglosHorario;
                        _d.label = 2;
                    case 2:
                        if (!(_i < arreglosHorario_1.length)) return [3 /*break*/, 9];
                        dias = arreglosHorario_1[_i];
                        dias.sort(function (a, b) {
                            // Convierte las horas de inicio y fin a objetos Date para poder compararlas
                            var dateAStart = new Date('1970/01/01 ' + a.hourStart.trim());
                            var dateBStart = new Date('1970/01/01 ' + b.hourStart.trim());
                            var dateAEnd = new Date('1970/01/01 ' + a.hourEnd.trim());
                            var dateBEnd = new Date('1970/01/01 ' + b.hourEnd.trim());
                            // Compara las horas de inicio y fin y devuelve el resultado de la comparación
                            if (dateAStart < dateBStart) {
                                return -1;
                            }
                            else if (dateAStart > dateBStart) {
                                return 1;
                            }
                            else if (dateAEnd < dateBEnd) {
                                return -1;
                            }
                            else if (dateAEnd > dateBEnd) {
                                return 1;
                            }
                            else {
                                return 0;
                            }
                        });
                        for (_a = 0, dias_1 = dias; _a < dias_1.length; _a++) {
                            objetoElementoType = dias_1[_a];
                            elementoComprobarTipo.push(objetoElementoType.elementoType);
                            elementoComprobarId.push(objetoElementoType.identificador);
                        }
                        _b = 0, dias_2 = dias;
                        _d.label = 3;
                    case 3:
                        if (!(_b < dias_2.length)) return [3 /*break*/, 8];
                        objeto = dias_2[_b];
                        if (!objeto.identificador.includes("aula")) return [3 /*break*/, 5];
                        identificadoresAulas.push(objeto.identificador);
                        return [4 /*yield*/, this.getAulaId(objeto.item._id)];
                    case 4:
                        _d.sent();
                        _d.label = 5;
                    case 5:
                        if (!objeto.identificador.includes("asignatura")) return [3 /*break*/, 7];
                        this.horario.dia.push(objeto.dayName);
                        this.horario.horas.push({ horaInicio: objeto.hourStart, horaFin: objeto.hourEnd });
                        identificadoresAsignaturas.push(objeto.identificador);
                        return [4 /*yield*/, this.getAsignaturaId(objeto.item._id)];
                    case 6:
                        _d.sent();
                        _d.label = 7;
                    case 7:
                        _b++;
                        return [3 /*break*/, 3];
                    case 8:
                        _i++;
                        return [3 /*break*/, 2];
                    case 9:
                        for (_c = 0, elementoComprobarTipo_1 = elementoComprobarTipo; _c < elementoComprobarTipo_1.length; _c++) {
                            element = elementoComprobarTipo_1[_c];
                            if (element === "asignatura") {
                                asig++;
                            }
                            else {
                                aula++;
                            }
                        }
                        if (asig === aula) {
                            datosIguales = true;
                        }
                        parejas = [];
                        for (i = 0; i < elementoComprobarId.length; i++) {
                            primeraTresLetras = elementoComprobarId[i].substring(0, 3);
                            for (j = i + 1; j < elementoComprobarId.length; j++) {
                                if (elementoComprobarId[j].substring(0, 3) === primeraTresLetras) {
                                    parejas.push(j);
                                    break;
                                }
                            }
                        }
                        if (parejas.length !== elementoComprobarId.length / 2) {
                            datosIguales = false;
                        }
                        items = [
                            this.asignaturaHorario,
                            this.aulaHorario
                        ];
                        index = 0;
                        for (i = 0; i < items[0].length || i < items[1].length; i++) {
                            if (items[0][index]) {
                                asignatura = items[0][index];
                                aula_1 = items[1][index];
                                this.horario.item.push({ asignatura: asignatura, aula: aula_1 });
                            }
                            index = (index + 1) % items[0].length;
                        }
                        itemsIdent = [
                            identificadoresAsignaturas,
                            identificadoresAulas
                        ];
                        index2 = 0;
                        for (i = 0; i < itemsIdent[0].length || i < itemsIdent[1].length; i++) {
                            if (itemsIdent[0][index2]) {
                                IdAsignatura = itemsIdent[0][index2];
                                IdAula = itemsIdent[1][index2];
                                this.horario.idTabla.push({ idAsignatura: IdAsignatura, idAula: IdAula });
                            }
                            index2 = (index2 + 1) % itemsIdent[0].length;
                        }
                        sweetalert2_1["default"].fire({
                            title: '¿Estás seguro?',
                            text: 'El horarios se creará',
                            icon: 'question',
                            showCancelButton: true,
                            confirmButtonColor: '#4CAF50',
                            cancelButtonColor: '#3085d6',
                            confirmButtonText: 'Crear'
                        }).then(function (result) {
                            if (result.isConfirmed) {
                                if (datosIguales && !_this.existHorarioCarrera) {
                                    _this._horarioService.create(_this.horario).subscribe(function (response) {
                                        if (response.status == 'success') {
                                            _this.status = 'success';
                                            _this.horario = response.horario;
                                            sweetalert2_1["default"].fire('Horario creada', 'El horario se ha creado correctamente', 'success');
                                            _this.isActiveBtn = false;
                                            _this.isActiveBtnG = true;
                                            _this.isActiveBtnV = false;
                                            /*  setTimeout(() => {
                                               this._router.navigate(['/horarios']);
                                             }, 1000); */
                                        }
                                    }, function (error) {
                                        _this.status = 'error: ' + error;
                                        sweetalert2_1["default"].fire('Error', 'El horario no se ha creado correctamente' + _this.status, 'error');
                                    });
                                }
                                else if (!datosIguales) {
                                    sweetalert2_1["default"].fire('Horario no creado', 'Por favor, debe contener en cada celda una asignatura y una aula', 'error');
                                    _this.status = 'error';
                                }
                                else if (_this.existHorarioCarrera) {
                                    sweetalert2_1["default"].fire('EL Horario de ' + _this.opcion2 + ' del ' + _this.opcion3 + ' semestre ya existe', 'Por favor, si desea modificar vaya a la sección de horarios', 'error');
                                    _this.status = 'error';
                                }
                                else {
                                    sweetalert2_1["default"].fire('Horario no creada', 'Por favor, rellene las asignaturas y aulas correctamente', 'error');
                                    _this.status = 'error';
                                }
                            }
                            else {
                                sweetalert2_1["default"].fire('Operación cancelada', 'El horario no ha sido creado', 'warning');
                            }
                        });
                        return [2 /*return*/];
                }
            });
        });
    };
    HorarioNuevoComponent.prototype.exportarPDF = function () {
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
        var descriptionText = "MATRIZ HORARIO DEL NIVEL POR CARRERA";
        var descriptionWidth = doc.getTextWidth(descriptionText);
        var descriptionX = (pageWidth - descriptionWidth) / 2;
        doc.text(descriptionText, descriptionX, 15);
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        var carreraText = "Carrera: " + this.opcion2 + ' - ' + this.opcion1;
        var carreraInfoWidth = doc.getTextWidth(carreraText);
        var carreraInfoX = (pageWidth - carreraInfoWidth) / 2;
        doc.text(carreraText, carreraInfoX, 20);
        var periodoTipo = "";
        var periodoTipo2 = "";
        if (this.opcion1 === "Horario Diurno") {
            periodoTipo = "Semestre";
        }
        else {
            periodoTipo2 = "Ciclo";
            periodoTipo = "Semestre";
        }
        if (this.opcion2.toLowerCase() === "Ingles") {
            periodoTipo = "Nivel";
        }
        var semestreText = periodoTipo + ": " + this.opcion3;
        var semestreInfoWidth = doc.getTextWidth(semestreText);
        var semestreInfoX = (pageWidth - semestreInfoWidth) / 2;
        if (this.opcion1 === "Horario Nocturno") {
            semestreText = periodoTipo + ": " + this.opcion3 + '  ' + periodoTipo2 + ": " + this.opcion4;
            semestreInfoWidth = doc.getTextWidth(semestreText);
            semestreInfoX = (pageWidth - semestreInfoWidth) / 2;
        }
        doc.text(semestreText, semestreInfoX, 25);
        var days;
        var DataAdicional = [];
        var asignaturasProfesores = [];
        var rowData = [];
        var hoursPDF = this.hours;
        this.hours = [];
        var cellSize;
        var rowDataHead = [];
        var rowDataHead2 = [];
        rowDataHead2.push(['Asignaturas', 'Profesores', 'N° Horas', 'Modalidad']);
        if (this.opcion1 === "Horario Nocturno") {
            cellSize = 38;
            this.hours = this.hoursnight;
            days = ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado'];
            rowDataHead.push(['Horas', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sabado']);
        }
        else {
            cellSize = 45;
            this.hours = hoursPDF;
            rowDataHead.push(['Horas', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes']);
            days = ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes'];
        }
        rowDataHead = rowDataHead.map(function (row) {
            return row.map(function (item) {
                return {
                    content: item,
                    styles: { halign: 'center', fillColor: '#00AFF0' } // Color gris (código hexadecimal)
                };
            });
        });
        rowDataHead2 = rowDataHead2.map(function (row) {
            return row.map(function (item) {
                return {
                    content: item,
                    styles: { halign: 'center', fillColor: '#00AFF0' } // Color gris (código hexadecimal)
                };
            });
        });
        var agrupaciones = [];
        var row = [];
        // Agregar las horas y los datos de cada celda
        for (var i = 0; i < this.hours.length; i++) {
            row = [this.hours[i]];
            // Iterar sobre los arreglos correspondientes a cada día de la semana
            for (var j = 0; j < days.length; j++) {
                var dayArray = [
                    this.monday,
                    this.tuesday,
                    this.wednesday,
                    this.thursday,
                    this.friday,
                    this.saturday
                ];
                // Buscar el item correspondiente a esta celda
                for (var k = 0; k < dayArray.length; k++) {
                    var currentItem = dayArray[k];
                    currentItem.sort(function (a, b) { return a.identificador.localeCompare(b.identificador); });
                    var _loop_1 = function (l) {
                        var currentElement = currentItem[l];
                        if (currentElement.elementoType === 'asignatura') {
                            var currentAsignatura_1 = currentElement.item.nombre;
                            var currentProfesores_1 = currentElement.item.profesor[0].nombre;
                            var currentAsignaturaCreditos = currentElement.item.creditos; // Unir los nombres de los profesores separados por comas
                            if (!asignaturasProfesores.some(function (ap) { return ap.asignatura === currentAsignatura_1 && ap.profesores === currentProfesores_1; })) {
                                asignaturasProfesores.push({ asignatura: currentAsignatura_1, profesores: currentProfesores_1, horas: currentAsignaturaCreditos });
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
                                row[colIndex] += ' ' + (currentElement.item.nombre + ' - ' + currentElement.item.ubicacion).replace(/(.+)/, '($1)').trim();
                            }
                            else {
                                agrupaciones.push(currentElement);
                                row[colIndex] += currentElement.item.nombre.trim();
                            }
                        }
                    };
                    var this_1 = this;
                    for (var l = 0; l < currentItem.length; l++) {
                        _loop_1(l);
                    }
                }
            }
            rowData.push(row);
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
                    resultadoAgrupado[asignaturaId].dayName = item.dayName;
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
        asignaturasProfesores.forEach(function (elemento1) {
            elemento1.modalidad = [];
            resultadoFinal.forEach(function (resultado) {
                if (resultado && resultado.modalidad && elemento1.asignatura === resultado.item.nombre) {
                    elemento1.modalidad.push(resultado.modalidad);
                }
            });
        });
        asignaturasProfesores.forEach(function (ap) {
            DataAdicional.push([ap.asignatura, ap.profesores, ap.horas, ap.modalidad]);
        });
        rowData = rowData.map(function (row) {
            return row.map(function (item) {
                return {
                    content: item,
                    styles: { halign: 'center' } // Color gris (código hexadecimal)
                };
            });
        });
        DataAdicional = DataAdicional.map(function (row) {
            return row.map(function (item) {
                return {
                    content: item,
                    styles: { halign: 'center' } // Color gris (código hexadecimal)
                };
            });
        });
        // Agregar la tabla al PDF
        jspdf_autotable_1["default"](doc, {
            head: rowDataHead,
            body: rowData,
            theme: 'grid',
            styles: {
                cellWidth: cellSize,
                minCellHeight: 5,
                fontSize: 8,
                textColor: [0, 0, 0]
            },
            margin: { top: 30 }
        });
        jspdf_autotable_1["default"](doc, {
            head: rowDataHead2,
            body: DataAdicional,
            theme: 'grid',
            styles: {
                cellWidth: 60,
                fontSize: 8,
                textColor: [0, 0, 0]
            },
            margin: { top: 50, left: 30 }
        });
        var rowDataHead3 = [];
        var DataFirmas = [];
        doc.addPage();
        if (this.horario.revisado_por) {
            rowDataHead3.push(['Elaborado por:', 'Revisado por:', 'Aprobado por:']);
            DataFirmas.push(["", "", ""]);
            DataFirmas.push([this.horario.creado_por.nombre, this.horario.revisado_por.nombre, this.aprobador.nombre]);
            DataFirmas.push(["Director de Carrera", "Decano de Facultad", "Directora Académica "]);
        }
        else {
            rowDataHead3.push(['Elaborado por:', 'Revisado por:', 'Aprobado por:']);
            DataFirmas.push(["", "", ""]);
            DataFirmas.push([this.horario.creado_por.nombre, "", this.aprobador.nombre]);
            DataFirmas.push(["Director de Carrera", "Decano de Facultad", "Directora Académica "]);
        }
        jspdf_autotable_1["default"](doc, {
            head: rowDataHead3,
            body: DataFirmas,
            theme: 'grid',
            styles: {
                cellWidth: 60,
                minCellHeight: 10,
                fontSize: 8,
                textColor: [0, 0, 0]
            },
            margin: { left: 55 }
        });
        // Descargar el PDF
        doc.save(this.opcion1 + '-' + this.opcion2 + '-' + this.opcion3 + '.pdf');
    };
    HorarioNuevoComponent.prototype.exportarExcel = function () {
        // Crear una instancia de ExcelJS Workbook
        var workbook = new ExcelJS.Workbook();
        var worksheet = workbook.addWorksheet(this.opcion2 + '-' + this.opcion3);
        // Establecer la orientación horizontal y el tamaño del papel
        worksheet.pageSetup.orientation = 'landscape';
        worksheet.pageSetup.paperSize = 9;
        worksheet.pageSetup.fitToPage = true;
        // Obtener el objeto Column para cada columna y establecer su ancho
        var cellSize;
        var cellSizeBorder;
        var days;
        var indiceCell;
        var indiceCellBorder;
        var indiceCellList;
        if (this.opcion1 === "Horario Nocturno") {
            days = ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado'];
            indiceCell = 7;
            indiceCellBorder = 16;
            indiceCellList = 18;
            cellSize = 19;
            cellSizeBorder = 6;
        }
        else {
            indiceCell = 6;
            indiceCellBorder = 14;
            indiceCellList = 16;
            days = ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes'];
            cellSize = 23;
            cellSizeBorder = 5;
        }
        worksheet.getColumn('A').width = cellSize;
        worksheet.getColumn('B').width = cellSize;
        worksheet.getColumn('C').width = cellSize;
        worksheet.getColumn('D').width = cellSize;
        worksheet.getColumn('E').width = cellSize;
        worksheet.getColumn('F').width = cellSize;
        worksheet.getColumn('G').width = cellSize;
        for (var row_1 = 1; row_1 <= cellSizeBorder; row_1++) {
            for (var col = 1; col <= cellSizeBorder + 1; col++) {
                var cell = worksheet.getCell("" + String.fromCharCode(64 + col) + row_1);
                cell.border = {
                    top: { style: 'medium', color: { argb: 'FFC0C0C0' } },
                    left: { style: 'medium', color: { argb: 'FFC0C0C0' } },
                    bottom: { style: 'medium', color: { argb: 'FFC0C0C0' } },
                    right: { style: 'medium', color: { argb: 'FFC0C0C0' } }
                };
            }
        }
        worksheet.mergeCells('B1:E1'); // Fusionar 4 celdas en la primera fila
        var texto1 = worksheet.getCell(1, 2); // Seleccionar la celda B1
        texto1.value = 'Universidad Iberoamericana del Ecuador'; // Establecer el valor de la celda
        texto1.font = { size: 10, bold: true }; // Establecer el formato de la fuente
        texto1.alignment = { horizontal: 'center' };
        worksheet.mergeCells('B2:E2'); // Fusionar 4 celdas en la primera fila
        var texto2 = worksheet.getCell(2, 2); // Seleccionar la celda B2
        texto2.value = 'MATRIZ HORARIO DEL NIVEL POR CARRERA'; // Establecer el valor de la celda
        texto2.font = { size: 10, bold: true }; // Establecer el formato de la fuente
        texto2.alignment = { horizontal: 'center' };
        // Agregar el título al Excel
        worksheet.mergeCells('A3:F3'); // Fusionar 5 celdas en la primera fila
        var carreraText = worksheet.getCell(3, 1);
        carreraText.value = "Carrera: " + this.opcion2 + ' - ' + this.opcion1;
        carreraText.font = { size: 10, bold: true }; // Establecer el formato de la fuente
        carreraText.alignment = { horizontal: 'center' };
        var periodoTipo = "";
        if (this.opcion1 === "Horario Nocturno") {
            periodoTipo = "Ciclo";
        }
        else {
            periodoTipo = "Semestre";
        }
        if (this.opcion2.toLowerCase() === "Ingles") {
            periodoTipo = "Nivel";
        }
        // Agregar el título al Excel
        worksheet.mergeCells('A4:F4'); // Fusionar 5 celdas en la primera fila
        var semestreText = worksheet.getCell(4, 1);
        semestreText.value = periodoTipo + ": " + this.opcion3;
        semestreText.font = { size: 10, bold: true }; // Establecer el formato de la fuente
        semestreText.alignment = { horizontal: 'center' };
        var asignaturasProfesores = [];
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
        // Agregar las horas y los datos de cada celda
        var hoursPDF = this.hours;
        this.hours = [];
        if (this.opcion1 === "Horario Nocturno") {
            this.hours = this.hoursnight;
        }
        else {
            this.hours = hoursPDF;
        }
        var agrupaciones = [];
        var row = [];
        for (var i = 0; i < this.hours.length; i++) {
            row = [this.hours[i]];
            // Iterar sobre los arreglos correspondientes a cada día de la semana
            for (var j = 0; j < days.length; j++) {
                var dayArray = [
                    this.monday,
                    this.tuesday,
                    this.wednesday,
                    this.thursday,
                    this.friday,
                    this.saturday
                ];
                // Buscar el item correspondiente a esta celda
                for (var k = 0; k < dayArray.length; k++) {
                    var currentItem = dayArray[k];
                    currentItem.sort(function (a, b) { return a.identificador.localeCompare(b.identificador); });
                    var _loop_2 = function (l) {
                        var currentElement = currentItem[l];
                        if (currentElement.elementoType === 'asignatura') {
                            var currentAsignatura_2 = currentElement.item.nombre;
                            var currentProfesores_2 = currentElement.item.profesor[0].nombre;
                            var currentAsignaturaCreditos = currentElement.item.creditos;
                            if (!asignaturasProfesores.some(function (ap) { return ap.asignatura === currentAsignatura_2 && ap.profesores === currentProfesores_2; })) {
                                asignaturasProfesores.push({ asignatura: currentAsignatura_2, profesores: currentProfesores_2, horas: currentAsignaturaCreditos });
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
                            if (typeof row[colIndex] === 'undefined') {
                                row[colIndex] = '';
                            }
                            if (currentElement.elementoType === 'aula') {
                                agrupaciones.push(currentElement);
                                row[colIndex] += '\n' + (currentElement.item.nombre + ' - ' + currentElement.item.ubicacion).replace(/(.+)/, '($1)').trim();
                            }
                            else {
                                agrupaciones.push(currentElement);
                                row[colIndex] += currentElement.item.nombre.trim();
                            }
                        }
                    };
                    var this_2 = this;
                    for (var l = 0; l < currentItem.length; l++) {
                        _loop_2(l);
                    }
                }
            }
            worksheet.addRow(row).eachCell({ includeEmpty: true }, function (cell) {
                cell.font = { size: 6 };
            });
        }
        for (var i = 7; i <= indiceCellBorder; i++) {
            var rowTablaHorarioItem = worksheet.getRow(i);
            rowTablaHorarioItem.height = 20;
            rowTablaHorarioItem.alignment = { vertical: 'middle', horizontal: 'center' }; // Opcional: alinear el contenido
            rowTablaHorarioItem.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true }; // Activar el ajuste de texto
        }
        for (var row_2 = 6; row_2 <= indiceCellBorder; row_2++) {
            for (var col = 1; col <= indiceCell; col++) {
                var cell = worksheet.getCell("" + String.fromCharCode(64 + col) + row_2);
                cell.border = {
                    top: { style: 'thin', color: { argb: '000000' } },
                    left: { style: 'thin', color: { argb: '000000' } },
                    bottom: { style: 'thin', color: { argb: '000000' } },
                    right: { style: 'thin', color: { argb: '000000' } }
                };
            }
        }
        worksheet.insertRow(indiceCellList, ['Asignaturas', 'Profesores', 'N° Horas', 'Modalidad']);
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
                    resultadoAgrupado[asignaturaId].dayName = item.dayName;
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
        asignaturasProfesores.forEach(function (elemento1) {
            elemento1.modalidad = ""; // Inicializamos la propiedad modalidad como un array vacío
            resultadoFinal.forEach(function (resultado) {
                if (resultado && resultado.modalidad && elemento1.asignatura === resultado.item.nombre) {
                    elemento1.modalidad = resultado.modalidad;
                }
            });
        });
        asignaturasProfesores.forEach(function (ap) {
            worksheet.addRow([ap.asignatura, ap.profesores, ap.horas, ap.modalidad]).eachCell({ includeEmpty: true }, function (cell) {
                cell.font = { size: 8 };
                cell.border = {
                    top: { style: 'thin', color: { argb: '000000' } },
                    left: { style: 'thin', color: { argb: '000000' } },
                    bottom: { style: 'thin', color: { argb: '000000' } },
                    right: { style: 'thin', color: { argb: '000000' } }
                };
            });
        });
        var identificador = uuid_1.v4();
        var nombreArchivo = this.opcion1 + '-' + this.opcion2 + '-' + this.opcion3 + ("-(" + identificador + ").xlsx");
        // Agregar texto al final de la página
        var elaboradoPor = worksheet.getCell(26, 2);
        elaboradoPor.value = 'Elaborado por: ';
        elaboradoPor.font = { size: 8 };
        var nombreDirector = worksheet.getCell(29, 2);
        nombreDirector.value = this.horario.creado_por.nombre;
        nombreDirector.font = { size: 8 };
        var directorCarrera = worksheet.getCell(30, 2);
        directorCarrera.value = 'Director de Carrera';
        directorCarrera.font = { size: 8 };
        // Agregar texto al final de la página
        var revisadoPor = worksheet.getCell(26, 4);
        revisadoPor.value = 'Revisado por: ';
        revisadoPor.font = { size: 8 };
        if (this.horario.revisado_por) {
            var nombreRevisador = worksheet.getCell(29, 4);
            nombreRevisador.value = this.horario.revisado_por.nombre;
            nombreRevisador.font = { size: 8 };
        }
        else {
            var nombreRevisador = worksheet.getCell(29, 4);
            nombreRevisador.value = "";
            nombreRevisador.font = { size: 8 };
        }
        var cargoRevisador = worksheet.getCell(30, 4);
        cargoRevisador.value = 'Decano de Facultad';
        cargoRevisador.font = { size: 8 };
        // Agregar texto al final de la página
        var aprobadorPor = worksheet.getCell(26, 6);
        aprobadorPor.value = 'Aprobado por: ';
        aprobadorPor.font = { size: 8 };
        var nombreAprobador = worksheet.getCell(29, 6);
        nombreAprobador.value = this.aprobador.nombre;
        nombreAprobador.font = { size: 8 };
        var cargoAprobador = worksheet.getCell(30, 6);
        cargoAprobador.value = 'Directora Académica';
        cargoAprobador.font = { size: 8 };
        workbook.xlsx.writeBuffer().then(function (buffer) {
            var data = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            FileSaver.saveAs(data, nombreArchivo);
        });
    };
    HorarioNuevoComponent.prototype.verificarHorario = function () {
        return __awaiter(this, void 0, void 0, function () {
            var itemsHorarioArray, arreglosHorario, identificadoresAulas, identificadoresAsignaturas, datosIguales, itemHorariosList, elementoComprobarTipo, elementoComprobarId, asig, aula, _i, arreglosHorario_2, dias, _a, dias_3, objetoElementoType, _b, dias_4, objeto, _c, elementoComprobarTipo_2, element, parejas, i, primeraTresLetras, j, index, i, asignatura, aula_2, itemsIdent, index2, i, IdAsignatura, IdAula;
            var _this = this;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        this.terminoBusquedaAsignatura = "";
                        this.terminoBusquedaAsignaturaStatic = "";
                        this.terminoBusquedaAula = "";
                        return [4 /*yield*/, this.getHorarios()];
                    case 1:
                        _d.sent();
                        this.aulaHorario = [];
                        this.asignaturaHorario = [];
                        this.horario = new horario_1.Horario('', '', '', '', '', [], [], [], [], this.usuario);
                        itemsHorarioArray = [];
                        arreglosHorario = [];
                        arreglosHorario = [
                            this.monday,
                            this.tuesday,
                            this.wednesday,
                            this.thursday,
                            this.friday,
                            this.saturday
                        ];
                        identificadoresAulas = [];
                        identificadoresAsignaturas = [];
                        datosIguales = false;
                        itemHorariosList = [];
                        if (this.opcion1 == "Horario Diurno") {
                            this.horario.tipoHorario = "Horario Diurno";
                        }
                        else {
                            this.horario.tipoHorario = "Horario Nocturno";
                        }
                        this.horario.carrera = this.opcion2;
                        this.horario.semestre = this.opcion3;
                        elementoComprobarTipo = [];
                        elementoComprobarId = [];
                        asig = 0;
                        aula = 0;
                        _i = 0, arreglosHorario_2 = arreglosHorario;
                        _d.label = 2;
                    case 2:
                        if (!(_i < arreglosHorario_2.length)) return [3 /*break*/, 9];
                        dias = arreglosHorario_2[_i];
                        dias.sort(function (a, b) {
                            // Convierte las horas de inicio y fin a objetos Date para poder compararlas
                            var dateAStart = new Date('1970/01/01 ' + a.hourStart.trim());
                            var dateBStart = new Date('1970/01/01 ' + b.hourStart.trim());
                            var dateAEnd = new Date('1970/01/01 ' + a.hourEnd.trim());
                            var dateBEnd = new Date('1970/01/01 ' + b.hourEnd.trim());
                            // Compara las horas de inicio y fin y devuelve el resultado de la comparación
                            if (dateAStart < dateBStart) {
                                return -1;
                            }
                            else if (dateAStart > dateBStart) {
                                return 1;
                            }
                            else if (dateAEnd < dateBEnd) {
                                return -1;
                            }
                            else if (dateAEnd > dateBEnd) {
                                return 1;
                            }
                            else {
                                return 0;
                            }
                        });
                        for (_a = 0, dias_3 = dias; _a < dias_3.length; _a++) {
                            objetoElementoType = dias_3[_a];
                            elementoComprobarTipo.push(objetoElementoType.elementoType);
                            elementoComprobarId.push(objetoElementoType.identificador);
                        }
                        _b = 0, dias_4 = dias;
                        _d.label = 3;
                    case 3:
                        if (!(_b < dias_4.length)) return [3 /*break*/, 8];
                        objeto = dias_4[_b];
                        if (!objeto.identificador.includes("aula")) return [3 /*break*/, 5];
                        identificadoresAulas.push(objeto.identificador);
                        return [4 /*yield*/, this.getAulaId(objeto.item._id)];
                    case 4:
                        _d.sent();
                        _d.label = 5;
                    case 5:
                        if (!objeto.identificador.includes("asignatura")) return [3 /*break*/, 7];
                        this.horario.dia.push(objeto.dayName);
                        this.horario.horas.push({ horaInicio: objeto.hourStart, horaFin: objeto.hourEnd });
                        identificadoresAsignaturas.push(objeto.identificador);
                        return [4 /*yield*/, this.getAsignaturaId(objeto.item._id)];
                    case 6:
                        _d.sent();
                        _d.label = 7;
                    case 7:
                        _b++;
                        return [3 /*break*/, 3];
                    case 8:
                        _i++;
                        return [3 /*break*/, 2];
                    case 9:
                        for (_c = 0, elementoComprobarTipo_2 = elementoComprobarTipo; _c < elementoComprobarTipo_2.length; _c++) {
                            element = elementoComprobarTipo_2[_c];
                            if (element === "asignatura") {
                                asig++;
                            }
                            else {
                                aula++;
                            }
                        }
                        if (asig === aula) {
                            datosIguales = true;
                        }
                        parejas = [];
                        for (i = 0; i < elementoComprobarId.length; i++) {
                            primeraTresLetras = elementoComprobarId[i].substring(0, 3);
                            for (j = i + 1; j < elementoComprobarId.length; j++) {
                                if (elementoComprobarId[j].substring(0, 3) === primeraTresLetras) {
                                    parejas.push(j);
                                    break;
                                }
                            }
                        }
                        if (parejas.length !== elementoComprobarId.length / 2 && parejas.length !== 0) {
                            datosIguales = false;
                        }
                        itemsHorarioArray = [
                            this.asignaturaHorario,
                            this.aulaHorario
                        ];
                        index = 0;
                        this.horario.item = [];
                        for (i = 0; i < itemsHorarioArray[0].length || i < itemsHorarioArray[1].length; i++) {
                            if (itemsHorarioArray[0][index]) {
                                asignatura = itemsHorarioArray[0][index];
                                aula_2 = itemsHorarioArray[1][index];
                                this.horario.item.push({ asignatura: asignatura, aula: aula_2 });
                            }
                            index = (index + 1) % itemsHorarioArray[0].length;
                        }
                        itemsIdent = [];
                        itemsIdent = [
                            identificadoresAsignaturas,
                            identificadoresAulas
                        ];
                        index2 = 0;
                        for (i = 0; i < itemsIdent[0].length || i < itemsIdent[1].length; i++) {
                            if (itemsIdent[0][index2]) {
                                IdAsignatura = itemsIdent[0][index2];
                                IdAula = itemsIdent[1][index2];
                                this.horario.idTabla.push({ idAsignatura: IdAsignatura, idAula: IdAula });
                            }
                            index2 = (index2 + 1) % itemsIdent[0].length;
                        }
                        if (this.asignaturasFiltradas.length === 0 && this.terminoBusquedaAsignatura === "") {
                            sweetalert2_1["default"].fire({
                                title: '¿Estás seguro?',
                                text: 'Se empezará a verificar el horario',
                                icon: 'question',
                                showCancelButton: true,
                                confirmButtonColor: '#4CAF50',
                                cancelButtonColor: '#3085d6',
                                confirmButtonText: 'Verificar'
                            }).then(function (result) {
                                if (result.isConfirmed) {
                                    var itemsBDHorario = [];
                                    var itemsHorario = null;
                                    var mensaje_1 = "";
                                    if (datosIguales && !_this.existHorarioCarrera && parejas.length !== 0) {
                                        itemsBDHorario = _this.horarios.map(function (verify) { return ({
                                            carrera: verify.carrera,
                                            semestre: verify.semestre,
                                            dia: verify.dia,
                                            paralelo: verify.paralelo,
                                            idAsignaturaTableVerify: verify.idTabla.map(function (idTabla) { return idTabla.idAsignatura; }),
                                            idAulaTableVerify: verify.idTabla.map(function (idTabla) { return idTabla.idAula; }),
                                            itemverifyAsignatura: verify.item.map(function (item) { return item.asignatura._id; }),
                                            itemverifyAsignaturaNombre: verify.item.map(function (item) { return item.asignatura.nombre; }),
                                            itemverifyAula: verify.item.map(function (item) { return item.aula._id; }),
                                            itemverifyAulaNombre: verify.item.map(function (item) { return item.aula.nombre; }),
                                            itemverifyAulaCompartida: verify.item.map(function (item) { return item.aula.compartida; }),
                                            itemHorasInico: verify.horas.map(function (item) { return item.horaInicio; }),
                                            itemHorasFin: verify.horas.map(function (item) { return item.horaFin; }),
                                            itemverifyprofesor: verify.item.map(function (item) { return item.asignatura.profesor[0]._id; }),
                                            itemverifyprofesorNombre: verify.item.map(function (item) { return item.asignatura.profesor[0].nombre; })
                                        }); });
                                        itemsHorario = {
                                            dia: _this.horario.dia,
                                            idAsignaturaTableVerify: _this.horario.idTabla.map(function (idTabla) { return idTabla.idAsignatura; }),
                                            idAulaTableVerify: _this.horario.idTabla.map(function (idTabla) { return idTabla.idAula; }),
                                            itemverifyAsignatura: _this.horario.item.map(function (item) { return item.asignatura._id; }),
                                            itemverifyAula: _this.horario.item.map(function (item) { return item.aula._id; }),
                                            itemverifyAulaNombre: _this.horario.item.map(function (item) { return item.aula.nombre; }),
                                            itemverifyAulaCompartida: _this.horario.item.map(function (item) { return item.aula.compartida; }),
                                            itemverifyprofesor: _this.horario.item.map(function (item) { return item.asignatura.profesor[0]._id; }),
                                            itemverifyprofesorNombre: _this.horario.item.map(function (item) { return item.asignatura.profesor[0].nombre; })
                                        };
                                        for (var i = 0; i < itemsHorario.dia.length; i++) {
                                            var diaActual = itemsHorario.dia[i];
                                            for (var j = 0; j < itemsBDHorario.length; j++) {
                                                if (itemsBDHorario[j].dia.includes(diaActual)) {
                                                    // Iterar todos los elementos de los arrays que coinciden con el día actual
                                                    for (var k = 0; k < itemsBDHorario[j].idAsignaturaTableVerify.length; k++) {
                                                        if (itemsBDHorario[j].idAsignaturaTableVerify[k] === itemsHorario.idAsignaturaTableVerify[i] &&
                                                            itemsBDHorario[j].idAulaTableVerify[k] === itemsHorario.idAulaTableVerify[i] &&
                                                            itemsBDHorario[j].itemverifyAsignatura[k] === itemsHorario.itemverifyAsignatura[i] &&
                                                            itemsBDHorario[j].itemverifyAula[k] === itemsHorario.itemverifyAula[i]) {
                                                            mensaje_1 += "\n                      \n                    <strong>\u00A1Choque de aula y asignatura (Misma hora)</strong>!<br>\n                    Motivo: La misma asignatura y aula ya se asign\u00F3 en esa hora<br>\n                    <strong>Horario: " + itemsBDHorario[j].carrera + "  - " + itemsBDHorario[j].semestre + " - " + itemsBDHorario[j].paralelo + "</strong><br>\n                    Dia: " + diaActual + "<br>\n                    Hora: " + itemsBDHorario[j].itemHorasInico[k] + " - " + itemsBDHorario[j].itemHorasFin[k] + "<br>\n                    Asignatura: " + itemsBDHorario[j].itemverifyAsignaturaNombre[k] + "<br>\n                    Aula: " + itemsBDHorario[j].itemverifyAulaNombre[k] + "<br>\n                ";
                                                        }
                                                        else if (itemsBDHorario[j].idAsignaturaTableVerify[k] === itemsHorario.idAsignaturaTableVerify[i] &&
                                                            itemsBDHorario[j].itemverifyprofesor[k] === itemsHorario.itemverifyprofesor[i]) {
                                                            mensaje_1 += "\n                    <strong>\u00A1Choque de profesor (Misma hora)</strong>!<br>\n                    Motivo: El profesor ya se asign\u00F3 a al misma hora para dar otra clase<br>\n                    <strong>Horario: " + itemsBDHorario[j].carrera + "  - " + itemsBDHorario[j].semestre + " - " + itemsBDHorario[j].paralelo + "</strong><br>\n                    Dia: " + diaActual + "<br>\n                    Hora: " + itemsBDHorario[j].itemHorasInico[k] + " - " + itemsBDHorario[j].itemHorasFin[k] + "<br>\n                    Asignatura: " + itemsBDHorario[j].itemverifyAsignaturaNombre[k] + "<br>\n                    Aula: " + itemsBDHorario[j].itemverifyAulaNombre[k] + "<br>\n                    Profesor: " + itemsBDHorario[j].itemverifyprofesorNombre[k] + "<br>\n                ";
                                                        }
                                                        else if (itemsBDHorario[j].idAulaTableVerify[k] === itemsHorario.idAulaTableVerify[i] &&
                                                            itemsBDHorario[j].itemverifyAula[k] === itemsHorario.itemverifyAula[i]
                                                            && itemsBDHorario[j].itemverifyAulaCompartida[k] !== "Si")
                                                            mensaje_1 += "\n                  <strong>\u00A1Choque de aula (Misma hora)</strong>!<br>\n                  Motivo: El aula ya se asign\u00F3 para otra asignatura<br>\n                  <strong>Horario: " + itemsBDHorario[j].carrera + "  - " + itemsBDHorario[j].semestre + " - " + itemsBDHorario[j].paralelo + "</strong><br>\n                  Dia: " + diaActual + "<br>\n                  Hora: " + itemsBDHorario[j].itemHorasInico[k] + " - " + itemsBDHorario[j].itemHorasFin[k] + "<br>\n                  Asignatura: " + itemsBDHorario[j].itemverifyAsignaturaNombre[k] + "<br>\n                  Aula: " + itemsBDHorario[j].itemverifyAulaNombre[k] + "<br>\n                  Profesor: " + itemsBDHorario[j].itemverifyprofesorNombre[k] + "<br>\n              ";
                                                    }
                                                }
                                            }
                                        }
                                        if (mensaje_1 !== "") {
                                            sweetalert2_1["default"].fire({
                                                title: '¡Choques!',
                                                html: "<div style=\"height: 250px; overflow-y: auto\">" + mensaje_1 + "</div>",
                                                icon: 'warning',
                                                showCancelButton: true,
                                                cancelButtonText: 'Cerrar',
                                                confirmButtonText: 'Descargar PDF'
                                            }).then(function (result) {
                                                if (result.isConfirmed) {
                                                    if (result.isConfirmed) {
                                                        var doc = new jspdf_1["default"]();
                                                        doc.setFontSize(14);
                                                        var title = "Choques";
                                                        var text = mensaje_1.replace(/<br>/g, '').replace(/<strong>/g, '').replace(/<\/strong>/g, '');
                                                        var textLines = doc.splitTextToSize(text, 200); // Ancho máximo del texto en la página (en este caso, 190)
                                                        var pageHeight = doc.internal.pageSize.height;
                                                        var cursorY = 10;
                                                        doc.text(title, doc.internal.pageSize.getWidth() / 2, cursorY, { align: 'center' });
                                                        cursorY += 10; // Espacio entre el título y el texto
                                                        for (var i = 0; i < textLines.length; i++) {
                                                            if (cursorY > pageHeight - 5) {
                                                                doc.addPage();
                                                                cursorY = 10;
                                                            }
                                                            doc.text(textLines[i], 1, cursorY, { align: 'justify' });
                                                            cursorY += 7; // Espacio entre líneas de texto
                                                        }
                                                        doc.save('choques.pdf');
                                                    }
                                                }
                                            });
                                            _this.isActiveBtn = false;
                                            _this.isActiveBtnG = false;
                                        }
                                        if (datosIguales && !_this.existHorarioCarrera && parejas.length !== 0 && mensaje_1 === "") {
                                            _this.status = 'success';
                                            sweetalert2_1["default"].fire('Horario Verificado', 'El horario esta correctamente', 'success');
                                            _this.isActiveBtn = true;
                                        }
                                    }
                                    else if (parejas.length === 0) {
                                        sweetalert2_1["default"].fire('Horario Rechazado', 'Por favor, rellene las asignaturas y aulas correctamente', 'error');
                                        _this.isActiveBtn = false;
                                    }
                                    else if (!datosIguales) {
                                        sweetalert2_1["default"].fire('Horario no verificado', 'Por favor, debe contener en cada celda una asignatura y una aula', 'error');
                                        _this.isActiveBtn = false;
                                    }
                                    else if (_this.existHorarioCarrera) {
                                        sweetalert2_1["default"].fire('EL ' + _this.opcion1 + ' de ' + _this.opcion2 + ' del ' + _this.opcion3 + ' semestre ya existe', 'Por favor, si desea modificar vaya a la sección de horarios', 'error');
                                        _this.isActiveBtn = false;
                                    }
                                }
                                else {
                                    sweetalert2_1["default"].fire('Operación cancelada', 'El horario no ha sido verificado', 'warning');
                                }
                            });
                        }
                        else {
                            sweetalert2_1["default"].fire('Horario no verificado', 'Por favor, debe colocar todas las asignaturas.', 'error');
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    HorarioNuevoComponent.prototype.verificarDiaPresencialVirtual = function () {
        return __awaiter(this, void 0, void 0, function () {
            var arreglosHorario, identificadoresAulas, identificadoresAsignaturas, elementoComprobarTipo, elementoComprobarId, asig, aula, grupoAsigPoId, _i, arreglosHorario_3, dias, _a, dias_5, objetoElementoType, _b, dias_6, objetoElementoType, elemento, primerDigito, _c, dias_7, objeto;
            var _this = this;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        this.aulaHorario = [];
                        this.asignaturaHorario = [];
                        this.horario = new horario_1.Horario('', '', '', '', '', [], [], [], [], this.usuario);
                        arreglosHorario = [];
                        arreglosHorario = [
                            this.monday,
                            this.tuesday,
                            this.wednesday,
                            this.thursday,
                            this.friday,
                            this.saturday
                        ];
                        identificadoresAulas = [];
                        identificadoresAsignaturas = [];
                        if (this.opcion1 == "Horario Diurno") {
                            this.horario.tipoHorario = "Horario Diurno";
                        }
                        else {
                            this.horario.tipoHorario = "Horario Nocturno";
                        }
                        this.horario.carrera = this.opcion2;
                        this.horario.semestre = this.opcion3;
                        elementoComprobarTipo = [];
                        elementoComprobarId = [];
                        asig = 0;
                        aula = 0;
                        grupoAsigPoId = [];
                        _i = 0, arreglosHorario_3 = arreglosHorario;
                        _d.label = 1;
                    case 1:
                        if (!(_i < arreglosHorario_3.length)) return [3 /*break*/, 8];
                        dias = arreglosHorario_3[_i];
                        dias.sort(function (a, b) {
                            // Convierte las horas de inicio y fin a objetos Date para poder compararlas
                            var dateAStart = new Date('1970/01/01 ' + a.hourStart.trim());
                            var dateBStart = new Date('1970/01/01 ' + b.hourStart.trim());
                            var dateAEnd = new Date('1970/01/01 ' + a.hourEnd.trim());
                            var dateBEnd = new Date('1970/01/01 ' + b.hourEnd.trim());
                            // Compara las horas de inicio y fin y devuelve el resultado de la comparación
                            if (dateAStart < dateBStart) {
                                return -1;
                            }
                            else if (dateAStart > dateBStart) {
                                return 1;
                            }
                            else if (dateAEnd < dateBEnd) {
                                return -1;
                            }
                            else if (dateAEnd > dateBEnd) {
                                return 1;
                            }
                            else {
                                return 0;
                            }
                        });
                        for (_a = 0, dias_5 = dias; _a < dias_5.length; _a++) {
                            objetoElementoType = dias_5[_a];
                            elementoComprobarTipo.push(objetoElementoType.elementoType);
                            elementoComprobarId.push(objetoElementoType.identificador);
                        }
                        for (_b = 0, dias_6 = dias; _b < dias_6.length; _b++) {
                            objetoElementoType = dias_6[_b];
                            elemento = objetoElementoType;
                            primerDigito = elemento.identificador.toString()[0];
                            if (objetoElementoType.identificador.includes("aula")) {
                                if (grupoAsigPoId[primerDigito]) {
                                    grupoAsigPoId[primerDigito].push(elemento);
                                }
                                else {
                                    grupoAsigPoId[primerDigito] = [elemento];
                                }
                            }
                        }
                        _c = 0, dias_7 = dias;
                        _d.label = 2;
                    case 2:
                        if (!(_c < dias_7.length)) return [3 /*break*/, 7];
                        objeto = dias_7[_c];
                        if (!objeto.identificador.includes("aula")) return [3 /*break*/, 4];
                        identificadoresAulas.push(objeto.identificador);
                        return [4 /*yield*/, this.getAulaId(objeto.item._id)];
                    case 3:
                        _d.sent();
                        _d.label = 4;
                    case 4:
                        if (!objeto.identificador.includes("asignatura")) return [3 /*break*/, 6];
                        this.horario.dia.push(objeto.dayName);
                        this.horario.horas.push({ horaInicio: objeto.hourStart, horaFin: objeto.hourEnd });
                        identificadoresAsignaturas.push(objeto.identificador);
                        return [4 /*yield*/, this.getAsignaturaId(objeto.item._id)];
                    case 5:
                        _d.sent();
                        _d.label = 6;
                    case 6:
                        _c++;
                        return [3 /*break*/, 2];
                    case 7:
                        _i++;
                        return [3 /*break*/, 1];
                    case 8:
                        grupoAsigPoId.forEach(function (subArray) {
                            var isValid = true; // Variable para verificar si el día es válido
                            var zoomExist = subArray.some(function (element) { return element.item.ubicacion && element.item.ubicacion.toLowerCase() === 'zoom'; });
                            if (zoomExist) {
                                var hasOtherThanZoom = subArray.some(function (element) { return element.item.ubicacion && element.item.ubicacion.toLowerCase() !== 'zoom'; });
                                if (hasOtherThanZoom) {
                                    isValid = false;
                                }
                            }
                            var Dias = {
                                0: 'Lunes',
                                1: 'Martes',
                                2: 'Miércoles',
                                3: 'Jueves',
                                4: 'Viernes',
                                5: 'Sábado'
                            };
                            var dia;
                            // Verificar si el día es válido
                            if (!_this.verificarDiaPresencialVirtualBolean) {
                                if (!isValid) {
                                    subArray.forEach(function (element) {
                                        if (element.item.ubicacion && element.item.ubicacion.toLowerCase() !== 'zoom') {
                                            dia = parseInt(element.identificador.toString()[0]);
                                        }
                                    });
                                    var swalPromise = new Promise(function (resolve, reject) {
                                        sweetalert2_1["default"].fire({
                                            title: 'Advertencia',
                                            text: 'Hay clases presenciales y virtuales en el mismo día en el dia: ' + Dias[dia],
                                            icon: 'warning',
                                            showCancelButton: true,
                                            confirmButtonText: 'Aceptar',
                                            cancelButtonText: 'Quitar Advertencia'
                                        }).then(function (result) {
                                            if (result.isConfirmed) {
                                                resolve(false);
                                            }
                                            else if (result.dismiss === sweetalert2_1["default"].DismissReason.cancel) {
                                                resolve(true);
                                            }
                                        });
                                    });
                                    swalPromise.then(function (value) {
                                        _this.verificarDiaPresencialVirtualBolean = value;
                                    });
                                }
                            }
                        });
                        return [2 /*return*/];
                }
            });
        });
    };
    HorarioNuevoComponent.prototype.verificarAulaUbicacion = function () {
        return __awaiter(this, void 0, void 0, function () {
            var arreglosHorario, identificadoresAulas, identificadoresAsignaturas, elementoComprobarTipo, elementoComprobarId, asig, aula, grupoAsigPoId, _i, arreglosHorario_4, dias, _a, dias_8, objetoElementoType, _b, dias_9, objetoElementoType, elemento, primerDigito, _c, dias_10, objeto;
            var _this = this;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        this.aulaHorario = [];
                        this.asignaturaHorario = [];
                        this.horario = new horario_1.Horario('', '', '', '', '', [], [], [], [], this.usuario);
                        arreglosHorario = [];
                        arreglosHorario = [
                            this.monday,
                            this.tuesday,
                            this.wednesday,
                            this.thursday,
                            this.friday,
                            this.saturday
                        ];
                        identificadoresAulas = [];
                        identificadoresAsignaturas = [];
                        if (this.opcion1 == "Horario Diurno") {
                            this.horario.tipoHorario = "Horario Diurno";
                        }
                        else {
                            this.horario.tipoHorario = "Horario Nocturno";
                        }
                        this.horario.carrera = this.opcion2;
                        this.horario.semestre = this.opcion3;
                        this.horario.ciclo = this.opcion4;
                        elementoComprobarTipo = [];
                        elementoComprobarId = [];
                        asig = 0;
                        aula = 0;
                        grupoAsigPoId = [];
                        _i = 0, arreglosHorario_4 = arreglosHorario;
                        _d.label = 1;
                    case 1:
                        if (!(_i < arreglosHorario_4.length)) return [3 /*break*/, 8];
                        dias = arreglosHorario_4[_i];
                        dias.sort(function (a, b) {
                            // Convierte las horas de inicio y fin a objetos Date para poder compararlas
                            var dateAStart = new Date('1970/01/01 ' + a.hourStart.trim());
                            var dateBStart = new Date('1970/01/01 ' + b.hourStart.trim());
                            var dateAEnd = new Date('1970/01/01 ' + a.hourEnd.trim());
                            var dateBEnd = new Date('1970/01/01 ' + b.hourEnd.trim());
                            // Compara las horas de inicio y fin y devuelve el resultado de la comparación
                            if (dateAStart < dateBStart) {
                                return -1;
                            }
                            else if (dateAStart > dateBStart) {
                                return 1;
                            }
                            else if (dateAEnd < dateBEnd) {
                                return -1;
                            }
                            else if (dateAEnd > dateBEnd) {
                                return 1;
                            }
                            else {
                                return 0;
                            }
                        });
                        for (_a = 0, dias_8 = dias; _a < dias_8.length; _a++) {
                            objetoElementoType = dias_8[_a];
                            elementoComprobarTipo.push(objetoElementoType.elementoType);
                            elementoComprobarId.push(objetoElementoType.identificador);
                        }
                        for (_b = 0, dias_9 = dias; _b < dias_9.length; _b++) {
                            objetoElementoType = dias_9[_b];
                            elemento = objetoElementoType;
                            primerDigito = elemento.identificador.toString()[0];
                            if (objetoElementoType.identificador.includes("aula")) {
                                if (grupoAsigPoId[primerDigito]) {
                                    grupoAsigPoId[primerDigito].push(elemento);
                                }
                                else {
                                    grupoAsigPoId[primerDigito] = [elemento];
                                }
                            }
                        }
                        _c = 0, dias_10 = dias;
                        _d.label = 2;
                    case 2:
                        if (!(_c < dias_10.length)) return [3 /*break*/, 7];
                        objeto = dias_10[_c];
                        if (!objeto.identificador.includes("aula")) return [3 /*break*/, 4];
                        identificadoresAulas.push(objeto.identificador);
                        return [4 /*yield*/, this.getAulaId(objeto.item._id)];
                    case 3:
                        _d.sent();
                        _d.label = 4;
                    case 4:
                        if (!objeto.identificador.includes("asignatura")) return [3 /*break*/, 6];
                        this.horario.dia.push(objeto.dayName);
                        this.horario.horas.push({ horaInicio: objeto.hourStart, horaFin: objeto.hourEnd });
                        identificadoresAsignaturas.push(objeto.identificador);
                        return [4 /*yield*/, this.getAsignaturaId(objeto.item._id)];
                    case 5:
                        _d.sent();
                        _d.label = 6;
                    case 6:
                        _c++;
                        return [3 /*break*/, 2];
                    case 7:
                        _i++;
                        return [3 /*break*/, 1];
                    case 8:
                        grupoAsigPoId.forEach(function (subArray) {
                            var isValid = true; // Variable para verificar si el día es válido
                            var zoomExist = subArray.some(function (element) { return element.item.ubicacion && element.item.ubicacion.toLowerCase() === 'zoom'; });
                            if (!zoomExist) {
                                var colon = subArray.some(function (element) { return element.item.ubicacion && element.item.ubicacion.toLowerCase() !== 'campus colon'; });
                                if (colon) {
                                    var norte = subArray.some(function (element) { return element.item.ubicacion && element.item.ubicacion.toLowerCase() !== 'campus norte'; });
                                    if (norte) {
                                        isValid = false;
                                    }
                                }
                            }
                            var Dias = {
                                0: 'Lunes',
                                1: 'Martes',
                                2: 'Miércoles',
                                3: 'Jueves',
                                4: 'Viernes',
                                5: 'Sábado'
                            };
                            var dia;
                            // Verificar si el día es válido
                            if (!_this.verificarAulaUbicacionBolean) {
                                if (!isValid) {
                                    subArray.forEach(function (element) {
                                        if (element.item.ubicacion && element.item.ubicacion.toLowerCase() !== 'colon') {
                                            dia = parseInt(element.identificador.toString()[0]);
                                        }
                                    });
                                    var swalPromise = new Promise(function (resolve, reject) {
                                        sweetalert2_1["default"].fire({
                                            title: 'Advertencia',
                                            text: 'Hay aulas en diferentes ubicaciones (norte y colon) en el mismo día: ' + Dias[dia] + '.',
                                            icon: 'warning',
                                            showCancelButton: true,
                                            confirmButtonText: 'Aceptar',
                                            cancelButtonText: 'Quitar Advertencia'
                                        }).then(function (result) {
                                            if (result.isConfirmed) {
                                                resolve(false);
                                            }
                                            else if (result.dismiss === sweetalert2_1["default"].DismissReason.cancel) {
                                                resolve(true);
                                            }
                                        });
                                    });
                                    swalPromise.then(function (value) {
                                        _this.verificarAulaUbicacionBolean = value;
                                    });
                                }
                            }
                        });
                        return [2 /*return*/];
                }
            });
        });
    };
    __decorate([
        core_1.Input()
    ], HorarioNuevoComponent.prototype, "asignaturas");
    HorarioNuevoComponent = __decorate([
        core_1.Component({
            selector: 'app-horario-nuevo',
            templateUrl: './horario-nuevo.component.html',
            styleUrls: ['./horario-nuevo.component.css'],
            providers: [horario_service_1.HorarioService, asignatura_service_1.AsignaturaService, aula_service_1.AulaService, usuario_service_1.UsuarioService, detalle_service_1.DetalleService]
        })
    ], HorarioNuevoComponent);
    return HorarioNuevoComponent;
}());
exports.HorarioNuevoComponent = HorarioNuevoComponent;
