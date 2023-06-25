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
exports.DetalleEditComponent = void 0;
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var detalle_service_1 = require("../services/detalle.service");
var sweetalert2_1 = require("sweetalert2");
var detalle_1 = require("../models/detalle");
var DetalleEditComponent = /** @class */ (function () {
    function DetalleEditComponent(_route, _detalleService, _router, formBuilder) {
        this._route = _route;
        this._detalleService = _detalleService;
        this._router = _router;
        this.formBuilder = formBuilder;
        this.detalle = new detalle_1.Detalle('', [], [], [], [], [], [], [], [], []);
        this.page_title = "Editar Detalle";
        this.is_edit = false;
        this.url = this._detalleService.Global.url;
        this.carrerasForm = this.formBuilder.group({
            carreras: this.formBuilder.array([])
        });
        this.periodosInglesForm = this.formBuilder.group({
            periodos: this.formBuilder.array([])
        });
        this.horasForm = this.formBuilder.group({
            horas: this.formBuilder.array([])
        });
    }
    DetalleEditComponent.prototype.ngOnInit = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getDetalles()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    DetalleEditComponent.prototype.getDetalles = function () {
        var _this = this;
        this._route.params.subscribe(function (params) {
            var id = params['id'];
            _this._detalleService.getDetalle(id).subscribe(function (response) {
                if (response.detalle) {
                    _this.detalle = response.detalle;
                    _this.carrerasData = _this.detalle.carreras;
                    _this.peridosInglesData = _this.detalle.periodoIngles;
                    _this.semestresData = _this.detalle.semestres[_this.detalle.semestres.length - 1];
                    _this.ciclosData = _this.detalle.ciclos[_this.detalle.ciclos.length - 1];
                    _this.paraleloInicioData = _this.detalle.paralelos[0];
                    _this.paraleloFinData = _this.detalle.paralelos[_this.detalle.paralelos.length - 1];
                    _this.horasDiurnasDesdeData = _this.detalle.horasDiurnas[0];
                    _this.horasDiurnasHastaData = _this.detalle.horasDiurnas[_this.detalle.horasDiurnas.length - 1];
                    _this.horasNocturnasDesdeData = _this.detalle.horasNocturnas[0];
                    _this.horasNocturnasHasta2Data = _this.detalle.horasNocturnas[_this.detalle.horasNocturnas.length - 1];
                    _this.horasAlternativasDiurnasDesdeData = _this.detalle.horasAlternativaDiurnas[0];
                    _this.horasAlternativasDiurnasHastaData = _this.detalle.horasAlternativaDiurnas[_this.detalle.horasAlternativaDiurnas.length - 1];
                    _this.horasAlternativasNocturnasDesdeData = _this.detalle.horasAlternativaNocturnas[0];
                    _this.horasAlternativasNocturnasHasta2Data = _this.detalle.horasAlternativaNocturnas[_this.detalle.horasAlternativaNocturnas.length - 1];
                    _this.inicializarFormularios();
                }
                else {
                    _this._router.navigate(['/especificacion/detalles'], { relativeTo: _this._route });
                }
            }, function (error) {
                _this._router.navigate(['/especificacion/detalles'], { relativeTo: _this._route });
            });
        });
    };
    // ...
    DetalleEditComponent.prototype.inicializarFormularios = function () {
        this.inicializarCarrerasForm();
        this.inicializarPeriodoInglesForm();
        this.semestres = this.semestresData;
        this.ciclos = this.ciclosData;
        this.paraleloInicio = this.paraleloInicioData;
        this.paraleloFin = this.paraleloFinData;
        var partesD = this.horasDiurnasDesdeData.split("-");
        var partesD2 = this.horasDiurnasHastaData.split("-");
        var partesN = this.horasNocturnasDesdeData.split("-");
        var partesN2 = this.horasNocturnasHasta2Data.split("-");
        this.horaInicio = partesD[0].trim();
        this.horaFin = partesD2[1].trim();
        this.horaInicioN = partesN[0].trim();
        this.horaFinN1 = partesN2[1].trim();
        var partesAD = this.horasAlternativasDiurnasDesdeData.split("-");
        var partesAD2 = this.horasAlternativasDiurnasHastaData.split("-");
        var partesAN = this.horasAlternativasNocturnasDesdeData.split("-");
        var partesAN2 = this.horasAlternativasNocturnasHasta2Data.split("-");
        this.horaInicioA = partesAD[0].trim();
        this.horaFinA = partesAD2[1].trim();
        this.horaInicioAN = partesAN[0].trim();
        this.horaFinAN1 = partesAN2[1].trim();
    };
    DetalleEditComponent.prototype.inicializarCarrerasForm = function () {
        var carrerasArray = this.carrerasForm.get('carreras');
        this.carrerasData.forEach(function (carrera) {
            var control = new forms_1.FormControl(carrera);
            carrerasArray.push(control);
        });
    };
    DetalleEditComponent.prototype.inicializarPeriodoInglesForm = function () {
        var periodoInglesArray = this.periodosInglesForm.get('periodos');
        this.peridosInglesData.forEach(function (periodo) {
            var control = new forms_1.FormControl(periodo);
            periodoInglesArray.push(control);
        });
    };
    DetalleEditComponent.prototype.getCarrerasFormControls = function () {
        return this.carrerasForm.get('carreras').controls;
    };
    DetalleEditComponent.prototype.getperiodosInglesFormControls = function () {
        return this.periodosInglesForm.get('periodos').controls;
    };
    DetalleEditComponent.prototype.getHorasFormControls = function () {
        return this.horasForm.get('horas').controls;
    };
    DetalleEditComponent.prototype.agregarCarreras = function () {
        var carreras = this.carrerasForm.get('carreras');
        carreras.push(this.formBuilder.control(''));
    };
    DetalleEditComponent.prototype.removerCarreras = function (index) {
        var carreras = this.carrerasForm.get('carreras');
        carreras.removeAt(index);
    };
    DetalleEditComponent.prototype.agregarHoras = function () {
        var horas = this.horasForm.get('horas');
        horas.push(this.formBuilder.control(''));
    };
    DetalleEditComponent.prototype.removerHoras = function (index) {
        var horas = this.horasForm.get('horas');
        horas.removeAt(index);
    };
    DetalleEditComponent.prototype.agregarPeriodoIngles = function () {
        var periodos = this.periodosInglesForm.get('periodos');
        periodos.push(this.formBuilder.control(''));
    };
    DetalleEditComponent.prototype.removerPeriodoIngles = function (index) {
        var periodos = this.periodosInglesForm.get('periodos');
        periodos.removeAt(index);
    };
    DetalleEditComponent.prototype.onSubmit = function () {
        var _this = this;
        if (this.carrerasForm.invalid ||
            this.periodosInglesForm.invalid
            || this.semestres === undefined || this.ciclos === undefined
            || this.horaInicio === undefined || this.horaFin === undefined
            || this.horaInicioN === undefined || this.horaFinN1 === undefined
            || this.horaInicioA === undefined || this.horaFinA === undefined
            || this.horaInicioAN === undefined || this.horaFinAN1 === undefined) {
            sweetalert2_1["default"].fire('Detalle no creado', 'Por favor, rellene los datos correctamente.', 'error');
        }
        else {
            var carreras = this.carrerasForm.value.carreras;
            var periodos = this.periodosInglesForm.value.periodos;
            var semestre = this.semestres;
            var semestres = [];
            var ciclo = this.ciclos;
            var ciclos = [];
            var paraleloInicio = this.paraleloInicio.toUpperCase();
            var paraleloFin = this.paraleloFin.toUpperCase();
            var paralelos = [];
            for (var i = 1; i <= semestre; i++) {
                semestres.push(i.toString());
            }
            for (var i = 1; i <= ciclo; i++) {
                ciclos.push(i.toString());
            }
            var abecedario = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
            var indiceInicio = abecedario.indexOf(paraleloInicio.toUpperCase());
            var indiceFin = abecedario.indexOf(paraleloFin.toUpperCase());
            var subarray = abecedario.slice(indiceInicio, indiceFin + 1);
            console.log(subarray);
            this.detalle.carreras = carreras;
            this.detalle.periodoIngles = periodos;
            this.detalle.semestres = semestres;
            this.detalle.ciclos = ciclos;
            this.detalle.paralelos = subarray;
            // Crear un array para almacenar los pares de horas
            var paresHoras = [];
            // Convertir las horas iniciales y finales en objetos Date
            var horaInicio = new Date("1970-01-01T" + this.horaInicio);
            var horaFin = new Date("1970-01-01T" + this.horaFin);
            // Bucle for para generar los pares de horas
            for (var hora = horaInicio; hora < horaFin; hora.setHours(hora.getHours() + 1)) {
                var horaActual = hora.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
                var horaSiguiente = new Date(hora);
                horaSiguiente.setHours(horaSiguiente.getHours() + 1);
                var parHoras = horaActual + " - " + horaSiguiente.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
                paresHoras.push(parHoras);
            }
            this.detalle.horasDiurnas = paresHoras;
            if (this.horaFinN !== undefined || this.horaInicioN1 !== undefined) {
                // Crear un array para almacenar los pares de horas
                var paresHorasNocturnas = [];
                // Convertir las horas iniciales y finales en objetos Date
                var horaInicioN = new Date("1970-01-01T" + this.horaInicioN);
                var horaFinN = new Date("1970-01-01T" + this.horaFinN);
                var horaInicioN1 = new Date("1970-01-01T" + this.horaInicioN1);
                var horaFinN1 = new Date("1970-01-01T" + this.horaFinN1);
                // Bucle for para generar los pares de horas
                for (var hora = horaInicioN; hora < horaFinN; hora.setHours(hora.getHours() + 1)) {
                    var horaActual = hora.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
                    var horaSiguiente = new Date(hora);
                    horaSiguiente.setHours(horaSiguiente.getHours() + 1);
                    var parHoras = horaActual + " - " + horaSiguiente.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
                    paresHorasNocturnas.push(parHoras);
                }
                // Bucle for para generar los pares de horas
                for (var hora = horaInicioN1; hora < horaFinN1; hora.setHours(hora.getHours() + 1)) {
                    var horaActual = hora.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
                    var horaSiguiente = new Date(hora);
                    horaSiguiente.setHours(horaSiguiente.getHours() + 1);
                    var parHoras = horaActual + " - " + horaSiguiente.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
                    paresHorasNocturnas.push(parHoras);
                }
                this.detalle.horasNocturnas = paresHorasNocturnas;
            }
            // Crear un array para almacenar los pares de horas
            var paresHorasA = [];
            // Convertir las horas iniciales y finales en objetos Date
            var horaInicioA = new Date("1970-01-01T" + this.horaInicioA);
            var horaFinA = new Date("1970-01-01T" + this.horaFinA);
            // Bucle for para generar los pares de horas
            for (var hora = horaInicioA; hora < horaFinA; hora.setHours(hora.getHours() + 1)) {
                var horaActual = hora.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
                var horaSiguiente = new Date(hora);
                horaSiguiente.setHours(horaSiguiente.getHours() + 1);
                var parHoras = horaActual + " - " + horaSiguiente.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
                paresHorasA.push(parHoras);
            }
            this.detalle.horasAlternativaDiurnas = paresHorasA;
            // Crear un array para almacenar los pares de horas
            if (this.horaFinAN !== undefined || this.horaInicioAN1 !== undefined) {
                var paresHorasNocturnasA = [];
                // Convertir las horas iniciales y finales en objetos Date
                var horaInicioAN = new Date("1970-01-01T" + this.horaInicioAN);
                var horaFinAN = new Date("1970-01-01T" + this.horaFinAN);
                var horaInicioAN1 = new Date("1970-01-01T" + this.horaInicioAN1);
                var horaFinAN1 = new Date("1970-01-01T" + this.horaFinAN1);
                // Bucle for para generar los pares de horas
                for (var hora = horaInicioAN; hora < horaFinAN; hora.setHours(hora.getHours() + 1)) {
                    var horaActual = hora.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
                    var horaSiguiente = new Date(hora);
                    horaSiguiente.setHours(horaSiguiente.getHours() + 1);
                    var parHoras = horaActual + " - " + horaSiguiente.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
                    paresHorasNocturnasA.push(parHoras);
                }
                // Bucle for para generar los pares de horas
                for (var hora = horaInicioAN1; hora < horaFinAN1; hora.setHours(hora.getHours() + 1)) {
                    var horaActual = hora.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
                    var horaSiguiente = new Date(hora);
                    horaSiguiente.setHours(horaSiguiente.getHours() + 1);
                    var parHoras = horaActual + " - " + horaSiguiente.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
                    paresHorasNocturnasA.push(parHoras);
                }
                this.detalle.horasAlternativaNocturnas = paresHorasNocturnasA;
            }
            console.log(this.detalle);
            this._detalleService.update(this.detalle._id, this.detalle).subscribe(function (response) {
                if (response.status == 'success') {
                    _this.detalle = response.detalle;
                    sweetalert2_1["default"].fire('Detalle modificada', 'El detalle se ha modificada correctamente.', 'success');
                    setTimeout(function () {
                        _this._router.navigate(['/especificacion/detalles']);
                    }, 1200);
                }
                else {
                    sweetalert2_1["default"].fire('Detalle no se ha modificada', 'Por favor, rellene los datos correctamente.', 'error');
                    /* setTimeout(() => {
                      location.reload();
                    }, 1200); */
                }
            }, function (error) {
                sweetalert2_1["default"].fire('Detalle no modificado', error, 'error');
            });
        }
    };
    DetalleEditComponent.prototype.redirectDetalle = function () {
        this._router.navigate(['/especificacion/detalles'], { relativeTo: this._route });
    };
    DetalleEditComponent.prototype.allDetalles = function () {
        this._router.navigate(['/especificacion/detalles']);
    };
    DetalleEditComponent = __decorate([
        core_1.Component({
            selector: 'app-detalle-edit',
            templateUrl: '../detalle-nuevo/detalle-nuevo.component.html',
            styleUrls: ['./detalle-edit.component.css'],
            providers: [detalle_service_1.DetalleService]
        })
    ], DetalleEditComponent);
    return DetalleEditComponent;
}());
exports.DetalleEditComponent = DetalleEditComponent;
