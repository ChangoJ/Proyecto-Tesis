"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
exports.__esModule = true;
exports.CarrerasDialogComponent = void 0;
var core_1 = require("@angular/core");
var dialog_1 = require("@angular/material/dialog");
var horario_service_1 = require("../services/horario.service");
var sweetalert2_1 = require("sweetalert2");
var detalle_service_1 = require("../services/detalle.service");
var CarrerasDialogComponent = /** @class */ (function () {
    function CarrerasDialogComponent(dialogRef, data, _router, _route, _horarioService, _detalleService) {
        this.dialogRef = dialogRef;
        this.data = data;
        this._router = _router;
        this._route = _route;
        this._horarioService = _horarioService;
        this._detalleService = _detalleService;
        this.horarios = [];
        this.selectedCarreras = [];
        this.selectedSemestres = [];
        this.dropdownCarreras = {};
        this.dropdownSemestres = {};
        this.carrerasFiltradas = [];
        this.selectedOpcionPregunta = "";
        this.paralelos = [];
        this.periodosIngles = [];
        this.authToken = this._detalleService.authToken;
        this.userData = this._detalleService.userData;
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
    }
    CarrerasDialogComponent.prototype.ngOnInit = function () {
        this.getHorarios();
        this.authToken = localStorage.getItem('datosUsuario');
        this.userData = JSON.parse(this.authToken);
        this.getDataDetalles();
    };
    CarrerasDialogComponent.prototype.getDataDetalles = function () {
        var _this = this;
        this._detalleService.getRolesCarrera().subscribe(function (rolesCarrera) {
            _this.rolesCarreras = rolesCarrera;
        });
        console.log(this.rolesCarreras);
        this._detalleService.getCarrerasIndex().subscribe(function (carreras) {
            _this.carreras = carreras;
            var carreraActual = _this.rolesCarreras[_this.userData.rol.toLowerCase().replace(/\s/g, "")];
            _this.carrerasFiltradas = [];
            if (carreraActual) {
                _this.carrerasFiltradas = _this.carreras.filter(function (carrera) { return carrera.textField.toLowerCase() === carreraActual.toLowerCase(); });
            }
            else {
                _this.carrerasFiltradas = _this.carreras;
            }
        });
        this._detalleService.getSemestresIndex().subscribe(function (semestres) {
            _this.semestres = semestres;
        });
        this._detalleService.getParalelos().subscribe(function (paralelos) {
            _this.paralelos = paralelos;
        });
        this._detalleService.getPeriodosIngles().subscribe(function (periodos) {
            _this.periodosIngles = periodos;
        });
        this._detalleService.getCiclosIndex().subscribe(function (ciclos) {
            _this.ciclos = ciclos;
            if (_this.datoRecibido === "Horarios Nocturnos") {
                /* this.semestres = this.ciclos */
                _this.periodoTIpo = "Ciclo";
            }
            else {
                _this.periodoTIpo = "Semestre";
            }
        });
    };
    /*   getRolCarrera() {
        let carreraActual = this.rolesCarreras[this.userData.rol.toLowerCase()];
    
        this.carrerasFiltradas = [];
    
        if (carreraActual) {
          this.carrerasFiltradas = this.carreras.filter((carrera: { textField: string; }) => carrera.textField.toLowerCase() === carreraActual.toLowerCase());
        } else {
          this.carrerasFiltradas = this.carreras;
        }
    
      } */
    CarrerasDialogComponent.prototype.getHorarios = function () {
        var _this = this;
        this._horarioService.getHorarios().subscribe(function (response) {
            if (response.horarios) {
                _this.horarios = response.horarios;
            }
        }, function (error) {
            console.log(error);
        });
    };
    CarrerasDialogComponent.prototype.onCarreraSelected = function () {
        var existHorarioCarrera = false;
        if (this.datoRecibido === "Horarios Nocturnos") {
            this.datoRecibido = "Horario Nocturno";
            this.periodoTIpo = "Ciclo";
        }
        else {
            this.datoRecibido = "Horario Diurno";
            this.periodoTIpo = "Semestre";
        }
        if (this.selectedParalelo === undefined) {
            this.selectedParalelo = "";
        }
        for (var _i = 0, _a = this.horarios; _i < _a.length; _i++) {
            var horario = _a[_i];
            if (horario.paralelo === undefined) {
                horario.paralelo = "";
            }
            if (horario.carrera === this.selectedCarrera && horario.semestre === this.selectedSemestre && horario.tipoHorario === this.datoRecibido && horario.paralelo === this.selectedParalelo) {
                existHorarioCarrera = true;
            }
        }
        var ruta = "";
        var rutaEnviar = "";
        if (this.selectedOpcionPregunta === "si") {
            rutaEnviar = rutaEnviar = 'home/creacion/' + this.datoRecibido + '/' + this.selectedCarrera + '/' + this.selectedSemestre + '/' + this.selectedParalelo;
        }
        else {
            rutaEnviar = 'home/creacion/' + this.datoRecibido + '/' + this.selectedCarrera + '/' + this.selectedSemestre;
        }
        if (!existHorarioCarrera) {
            ruta = rutaEnviar;
            ruta = ruta.replace(/\s+/g, "_");
            this._router.navigate([ruta], { relativeTo: this._route });
            setTimeout(function () {
                location.reload();
            }, 350);
        }
        else {
            sweetalert2_1["default"].fire('EL Horario de ' + this.selectedCarrera + ' del ' + this.selectedSemestre + ' ' + this.periodoTIpo + ' ya fue creado.', 'Por favor, si desea modificar vaya a la sección de horarios', 'error');
        }
    };
    CarrerasDialogComponent = __decorate([
        core_1.Component({
            selector: 'app-carreras-dialog',
            templateUrl: './carreras-dialog.component.html',
            styleUrls: ['./carreras-dialog.component.css'],
            providers: [horario_service_1.HorarioService, detalle_service_1.DetalleService]
        }),
        __param(1, core_1.Inject(dialog_1.MAT_DIALOG_DATA))
    ], CarrerasDialogComponent);
    return CarrerasDialogComponent;
}());
exports.CarrerasDialogComponent = CarrerasDialogComponent;
