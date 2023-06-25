"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.DetalleNuevoComponent = void 0;
var core_1 = require("@angular/core");
var detalle_1 = require("../models/detalle");
var detalle_service_1 = require("../services/detalle.service");
var sweetalert2_1 = require("sweetalert2");
var DetalleNuevoComponent = /** @class */ (function () {
    function DetalleNuevoComponent(_route, _detalleService, _router, formBuilder) {
        this._route = _route;
        this._detalleService = _detalleService;
        this._router = _router;
        this.formBuilder = formBuilder;
        this.detalle = new detalle_1.Detalle('', [], [], [], [], [], [], [], [], []);
        this.page_title = "Nuevo Detalle";
        this.is_edit = false;
        this.url = this._detalleService.Global.url;
        // Inicializar los formularios y los form controls
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
    DetalleNuevoComponent.prototype.ngOnInit = function () {
        this.agregarCarreras();
        this.agregarPeriodoIngles();
    };
    DetalleNuevoComponent.prototype.getCarrerasFormControls = function () {
        return this.carrerasForm.get('carreras').controls;
    };
    DetalleNuevoComponent.prototype.getperiodosInglesFormControls = function () {
        return this.periodosInglesForm.get('periodos').controls;
    };
    DetalleNuevoComponent.prototype.getHorasFormControls = function () {
        return this.horasForm.get('horas').controls;
    };
    DetalleNuevoComponent.prototype.agregarCarreras = function () {
        var carreras = this.carrerasForm.get('carreras');
        carreras.push(this.formBuilder.control(''));
    };
    DetalleNuevoComponent.prototype.removerCarreras = function (index) {
        var carreras = this.carrerasForm.get('carreras');
        carreras.removeAt(index);
    };
    DetalleNuevoComponent.prototype.agregarPeriodoIngles = function () {
        var periodos = this.periodosInglesForm.get('periodos');
        periodos.push(this.formBuilder.control(''));
    };
    DetalleNuevoComponent.prototype.removerPeriodoIngles = function (index) {
        var periodos = this.periodosInglesForm.get('periodos');
        periodos.removeAt(index);
    };
    DetalleNuevoComponent.prototype.onSubmit = function () {
        var _this = this;
        if (this.carrerasForm.invalid ||
            this.periodosInglesForm.invalid
            || this.semestres === undefined || this.ciclos === undefined
            || this.horaInicio === undefined || this.horaFin === undefined
            || this.horaInicioN === undefined || this.horaFinN === undefined
            || this.horaInicioN1 === undefined || this.horaFinN1 === undefined
            || this.horaInicioA === undefined || this.horaFinA === undefined
            || this.horaInicioAN === undefined || this.horaFinAN === undefined
            || this.horaInicioAN1 === undefined || this.horaFinAN1 === undefined) {
            sweetalert2_1["default"].fire('Detalle no creado', 'Por favor, rellene los datos correctamente.', 'error');
        }
        else {
            var carreras = this.carrerasForm.value.carreras;
            var periodosIngles = this.periodosInglesForm.value.periodos;
            var semestre = this.semestres;
            var semestres = [];
            var ciclo = this.ciclos;
            var ciclos = [];
            var paraleloInicio = "";
            var paraleloFin = "";
            var paralelos = [];
            for (var i = 1; i <= semestre; i++) {
                semestres.push(i.toString());
            }
            for (var i = 1; i <= ciclo; i++) {
                ciclos.push(i.toString());
            }
            for (var i = paraleloInicio; i <= paraleloFin; i++) {
                var letra = String.fromCharCode(i);
                paralelos.push(letra);
            }
            this.detalle.carreras = carreras;
            this.detalle.periodoIngles = periodosIngles;
            this.detalle.semestres = semestres;
            this.detalle.ciclos = ciclos;
            this.detalle.paralelos = paralelos;
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
            /* HORAS ALTERNATIVAS */
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
            this._detalleService.create(this.detalle).subscribe(function (response) {
                if (response.status == 'success') {
                    _this.status = 'success';
                    _this.detalle = response.detalle;
                    sweetalert2_1["default"].fire('Detalle creada', 'El detalle se ha creado correctamente.', 'success');
                    setTimeout(function () {
                        _this._router.navigate(['/especificacion/detalles']);
                    }, 1200);
                }
                else {
                    sweetalert2_1["default"].fire('Detalle no creada', 'Por favor, rellene los datos correctamente.', 'error');
                    _this.status = 'error';
                }
            }, function (error) {
                sweetalert2_1["default"].fire('Detalle no creada', error, 'error');
            });
        }
    };
    DetalleNuevoComponent.prototype.redirectDetalle = function () {
        this._router.navigate(['/especificacion/detalles'], { relativeTo: this._route });
    };
    DetalleNuevoComponent.prototype.allDetalles = function () {
        this._router.navigate(['/especificacion/detalles']);
    };
    DetalleNuevoComponent = __decorate([
        core_1.Component({
            selector: 'app-detalle-nuevo',
            templateUrl: './detalle-nuevo.component.html',
            styleUrls: ['./detalle-nuevo.component.css'],
            providers: [detalle_service_1.DetalleService]
        })
    ], DetalleNuevoComponent);
    return DetalleNuevoComponent;
}());
exports.DetalleNuevoComponent = DetalleNuevoComponent;
