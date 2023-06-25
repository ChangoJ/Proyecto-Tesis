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
exports.DetalleService = void 0;
var core_1 = require("@angular/core");
var http_1 = require("@angular/common/http");
var rxjs_1 = require("rxjs");
var DetalleService = /** @class */ (function () {
    function DetalleService(_http) {
        this._http = _http;
        this.semestres = [];
        this.horasDiurnas = [];
        this.horasNocturnas = [];
        this.horasAlternativaDiurnas = [];
        this.horasAlternativaNocturnas = [];
        this.ciclos = [];
        this.carreras = [];
        this.roles = [];
        this.rolesIndex = [];
        this.ciclosIndex = [];
        this.carrerasIndex = [];
        this.semestresIndex = [];
        this.periodoInglesIndex = [];
        this.rolesSubject = new rxjs_1.BehaviorSubject([]);
        this.carrerasSubject = new rxjs_1.BehaviorSubject([]);
        this.semestresSubject = new rxjs_1.BehaviorSubject([]);
        this.ciclosSubject = new rxjs_1.BehaviorSubject([]);
        this.rolesSubjectIndex = new rxjs_1.BehaviorSubject([]);
        this.carrerasSubjectIndex = new rxjs_1.BehaviorSubject([]);
        this.semestresSubjectIndex = new rxjs_1.BehaviorSubject([]);
        this.ciclosSubjectIndex = new rxjs_1.BehaviorSubject([]);
        this.periodoInglesSubjectIndex = new rxjs_1.BehaviorSubject([]);
        this.horasDiurnasSubject = new rxjs_1.BehaviorSubject([]);
        this.horasNocturnasSubject = new rxjs_1.BehaviorSubject([]);
        this.horasAlternativaDiurnasSubject = new rxjs_1.BehaviorSubject([]);
        this.horasAlternativaNocturnasSubject = new rxjs_1.BehaviorSubject([]);
        this.paralelos = [];
        this.paralelosSubject = new rxjs_1.BehaviorSubject([]);
        this.periodosIngles = [];
        this.periodosInglesSubject = new rxjs_1.BehaviorSubject([]);
        this.paralelosIndex = [];
        this.paralelosSubjectIndex = new rxjs_1.BehaviorSubject([]);
        this.Global = {
            url: 'http://localhost:3900/api/'
        };
        this.horariosType = [
            { id: 1, textField: 'Diurno' },
            { id: 2, textField: 'Nocturno' }
        ];
        this.authToken = localStorage.getItem('datosUsuario');
        this.userData = JSON.parse(this.authToken);
        this.ubicaciones = [
            { id: 1, textField: 'Campus Norte' },
            { id: 2, textField: 'Campus Colon' },
            { id: 3, textField: 'ZOOM' }
        ];
        this.url = this.Global.url;
        this.initializeData();
    }
    DetalleService.prototype.ngOnInit = function () {
    };
    DetalleService.prototype.initializeData = function () {
        return __awaiter(this, void 0, void 0, function () {
            var resultado, carreras, semestres, ciclos, paralelos, periodosIngles, paralelosIndex, rolesCarreras, rolesCarrerasDic, rolesCarrerasDiccionario_1, error_1;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.getDetalles().toPromise()];
                    case 1:
                        resultado = _a.sent();
                        if (resultado.status === "success") {
                            carreras = [];
                            semestres = [];
                            ciclos = [];
                            paralelos = [];
                            periodosIngles = [];
                            this.carreras = [];
                            this.semestres = [];
                            this.ciclos = [];
                            this.paralelos = [];
                            this.periodosIngles = [];
                            this.carrerasIndex = [];
                            this.paralelosIndex = [];
                            paralelosIndex = [];
                            rolesCarreras = [];
                            rolesCarrerasDic = [];
                            rolesCarrerasDiccionario_1 = [];
                            this.horasDiurnas = resultado.detalles[0].horasDiurnas;
                            this.horasNocturnas = resultado.detalles[0].horasNocturnas;
                            this.horasAlternativaDiurnas = resultado.detalles[0].horasAlternativaDiurnas;
                            this.horasAlternativaNocturnas = resultado.detalles[0].horasAlternativaNocturnas;
                            carreras = resultado.detalles[0].carreras;
                            semestres = resultado.detalles[0].semestres;
                            ciclos = resultado.detalles[0].ciclos;
                            paralelos = resultado.detalles[0].paralelos;
                            periodosIngles = resultado.detalles[0].periodoIngles;
                            rolesCarreras = resultado.detalles[0].carreras;
                            rolesCarrerasDic = resultado.detalles[0].carreras;
                            this.setCarreras(carreras);
                            this.setSemestres(semestres);
                            this.setCiclos(ciclos);
                            this.setParalelos(paralelos);
                            this.setPeriodosIngles(periodosIngles);
                            this.carrerasIndex = carreras.map(function (carrera, index) {
                                return { id: index + 1, textField: carrera };
                            });
                            this.semestresIndex = semestres.map(function (semestre, index) {
                                return { id: index + 1, textField: semestre };
                            });
                            this.ciclosIndex = ciclos.map(function (ciclo, index) {
                                return { id: index + 1, textField: ciclo };
                            });
                            this.periodoInglesIndex = periodosIngles.map(function (periodo, index) {
                                return { id: index + 1, textField: periodo };
                            });
                            this.paralelosIndex = paralelos.map(function (paralelo, index) {
                                return { id: index + 1, textField: paralelo };
                            });
                            this.roles = [
                                { id: 1, textField: 'Superadministrador' },
                                { id: 2, textField: 'Administrador' },
                                { id: 3, textField: 'Aprobador' },
                                { id: 4, textField: 'Revisador' },
                            ];
                            rolesCarreras.forEach(function (nombreCarrera, index) {
                                var nuevoRol = {
                                    id: index + 1 + _this.roles.length,
                                    textField: nombreCarrera
                                };
                                _this.roles.push(nuevoRol);
                            });
                            this.setRolesIndex(this.roles);
                            rolesCarrerasDic.forEach(function (nombreCarreraRoles) {
                                rolesCarrerasDiccionario_1[nombreCarreraRoles.toLowerCase().replace(/\s/g, "")] = nombreCarreraRoles;
                            });
                            this.setRolesCarrera(rolesCarrerasDiccionario_1);
                            this.setCarrerasIndex(this.carrerasIndex);
                            this.setSemestresIndex(this.semestresIndex);
                            this.setCiclosIndex(this.ciclosIndex);
                            this.setPeriodosInglesIndex(this.periodoInglesIndex);
                            this.setParalelosIndex(this.paralelosIndex);
                            this.setHorasDiurnas(this.horasDiurnas);
                            this.setHorasNocturnas(this.horasNocturnas);
                            this.setHorasAlternativaDiurnas(this.horasAlternativaDiurnas);
                            this.setHorasAlternativaNocturnas(this.horasAlternativaNocturnas);
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        error_1 = _a.sent();
                        console.error(error_1);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    DetalleService.prototype.setRolesCarrera = function (roles) {
        this.roles = roles;
        this.rolesSubject.next(this.roles);
    };
    DetalleService.prototype.getRolesCarrera = function () {
        return this.rolesSubject.asObservable();
    };
    DetalleService.prototype.setCarreras = function (carreras) {
        this.carreras = carreras;
        this.carrerasSubject.next(this.carreras);
    };
    DetalleService.prototype.getCarreras = function () {
        return this.carrerasSubject.asObservable();
    };
    DetalleService.prototype.setSemestres = function (semestres) {
        this.semestres = semestres;
        this.semestresSubject.next(this.semestres);
    };
    DetalleService.prototype.getSemestres = function () {
        return this.semestresSubject.asObservable();
    };
    DetalleService.prototype.setCiclos = function (ciclos) {
        this.ciclos = ciclos;
        this.ciclosSubject.next(this.ciclos);
    };
    DetalleService.prototype.getCiclos = function () {
        return this.ciclosSubject.asObservable();
    };
    DetalleService.prototype.setRolesIndex = function (rolesIndex) {
        this.rolesIndex = rolesIndex;
        this.rolesSubjectIndex.next(this.rolesIndex);
    };
    DetalleService.prototype.getRolesIndex = function () {
        return this.rolesSubjectIndex.asObservable();
    };
    DetalleService.prototype.setCarrerasIndex = function (carrerasIndex) {
        this.carrerasIndex = carrerasIndex;
        this.carrerasSubjectIndex.next(this.carrerasIndex);
    };
    DetalleService.prototype.getCarrerasIndex = function () {
        return this.carrerasSubjectIndex.asObservable();
    };
    DetalleService.prototype.setSemestresIndex = function (semestres) {
        this.semestresIndex = semestres;
        this.semestresSubjectIndex.next(this.semestresIndex);
    };
    DetalleService.prototype.getSemestresIndex = function () {
        return this.semestresSubjectIndex.asObservable();
    };
    DetalleService.prototype.setCiclosIndex = function (ciclos) {
        this.ciclosIndex = ciclos;
        this.ciclosSubjectIndex.next(this.ciclosIndex);
    };
    DetalleService.prototype.getCiclosIndex = function () {
        return this.ciclosSubjectIndex.asObservable();
    };
    DetalleService.prototype.setPeriodosInglesIndex = function (periodosIndex) {
        this.periodoInglesIndex = periodosIndex;
        this.periodoInglesSubjectIndex.next(this.periodoInglesIndex);
    };
    DetalleService.prototype.getPeriodosInglesIndex = function () {
        return this.periodoInglesSubjectIndex.asObservable();
    };
    DetalleService.prototype.setParalelosIndex = function (paralelosIndex) {
        this.paralelosIndex = paralelosIndex;
        this.paralelosSubjectIndex.next(this.paralelosIndex);
    };
    DetalleService.prototype.getParalelosIndex = function () {
        return this.paralelosSubjectIndex.asObservable();
    };
    DetalleService.prototype.setHorasDiurnas = function (horasDirunas) {
        this.horasDiurnas = horasDirunas;
        this.horasDiurnasSubject.next(this.horasDiurnas);
    };
    DetalleService.prototype.getHorasDiurnas = function () {
        return this.horasDiurnasSubject.asObservable();
    };
    DetalleService.prototype.setHorasNocturnas = function (horasNocturnas) {
        this.horasNocturnas = horasNocturnas;
        this.horasNocturnasSubject.next(this.horasNocturnas);
    };
    DetalleService.prototype.getHorasNocturnas = function () {
        return this.horasNocturnasSubject.asObservable();
    };
    DetalleService.prototype.setHorasAlternativaDiurnas = function (horasAlternativaDiurnas) {
        this.horasAlternativaDiurnas = horasAlternativaDiurnas;
        this.horasAlternativaDiurnasSubject.next(this.horasAlternativaDiurnas);
    };
    DetalleService.prototype.getHorasAlternativaDiurnas = function () {
        return this.horasAlternativaDiurnasSubject.asObservable();
    };
    DetalleService.prototype.setHorasAlternativaNocturnas = function (horasAlternativaNocturnas) {
        this.horasAlternativaNocturnas = horasAlternativaNocturnas;
        this.horasAlternativaNocturnasSubject.next(this.horasAlternativaNocturnas);
    };
    DetalleService.prototype.getHorasAlternativaNocturnas = function () {
        return this.horasAlternativaNocturnasSubject.asObservable();
    };
    DetalleService.prototype.setParalelos = function (paralelos) {
        this.paralelos = paralelos;
        this.paralelosSubject.next(this.paralelos);
    };
    DetalleService.prototype.getParalelos = function () {
        return this.paralelosSubject.asObservable();
    };
    DetalleService.prototype.setPeriodosIngles = function (periodosIngles) {
        this.periodosIngles = periodosIngles;
        this.periodosInglesSubject.next(this.periodosIngles);
    };
    DetalleService.prototype.getPeriodosIngles = function () {
        return this.periodosInglesSubject.asObservable();
    };
    DetalleService.prototype.getDetalles = function (last) {
        if (last === void 0) { last = null; }
        var detalles = 'detalles';
        if (last != null) {
            detalles = 'detalle/true';
        }
        return this._http.get(this.url + detalles);
    };
    DetalleService.prototype.getDetalle = function (detalleId) {
        return this._http.get(this.url + 'detalle/' + detalleId);
    };
    DetalleService.prototype.create = function (detalle) {
        var params = JSON.stringify(detalle);
        var headers = new http_1.HttpHeaders().set('Content-Type', 'application/json');
        return this._http.post(this.url + 'save-detalle', detalle, { headers: headers });
    };
    DetalleService.prototype.update = function (id, detalle) {
        var params = JSON.stringify(detalle);
        var headers = new http_1.HttpHeaders().set('Content-Type', 'application/json');
        return this._http.put(this.url + 'detalle/' + id, params, { headers: headers });
    };
    DetalleService.prototype["delete"] = function (id) {
        var headers = new http_1.HttpHeaders().set('Content-Type', 'application/json');
        return this._http["delete"](this.url + 'detalle/' + id, { headers: headers });
    };
    DetalleService = __decorate([
        core_1.Injectable()
    ], DetalleService);
    return DetalleService;
}());
exports.DetalleService = DetalleService;
