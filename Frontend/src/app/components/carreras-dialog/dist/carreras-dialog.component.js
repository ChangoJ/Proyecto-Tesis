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
var CarrerasDialogComponent = /** @class */ (function () {
    function CarrerasDialogComponent(dialogRef, data, _router, _route, _horarioService) {
        this.dialogRef = dialogRef;
        this.data = data;
        this._router = _router;
        this._route = _route;
        this._horarioService = _horarioService;
        this.horarios = [];
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
        this.semestres = [
            { id: 1, textField: '1' },
            { id: 2, textField: '2' },
            { id: 3, textField: '3' },
            { id: 4, textField: '4' },
            { id: 5, textField: '5' },
            { id: 6, textField: '6' },
            { id: 7, textField: '7' },
            { id: 8, textField: '8' },
            { id: 9, textField: '9' },
            { id: 10, textField: '10' },
        ];
        this.ciclos = [
            { id: 1, textField: '1' },
            { id: 2, textField: '2' },
        ];
        this.selectedCarreras = [];
        this.selectedSemestres = [];
        this.dropdownCarreras = {};
        this.dropdownSemestres = {};
        this.carrerasFiltradas = [];
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
        if (this.datoRecibido === "Horarios Nocturnos") {
            this.semestres = this.ciclos;
            this.periodoTIpo = "Ciclo";
        }
        else {
            this.periodoTIpo = "Semestre";
        }
        this.authToken = localStorage.getItem('datosUsuario');
        this.UserData = JSON.parse(this.authToken);
        this.getRolCarrera();
    };
    CarrerasDialogComponent.prototype.getRolCarrera = function () {
        var carreraActual = this.rolesCarreras[this.UserData.rol.toLowerCase()];
        this.carrerasFiltradas = [];
        if (carreraActual) {
            this.carrerasFiltradas = this.carreras.filter(function (carrera) { return carrera.textField.toLowerCase() === carreraActual.toLowerCase(); });
        }
        else {
            this.carrerasFiltradas = this.carreras;
        }
    };
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
        console.log(this.datoRecibido);
        var existHorarioCarrera = false;
        if (this.datoRecibido === "Horarios Nocturnos") {
            this.datoRecibido = "Horario Nocturno";
            this.periodoTIpo = "Ciclo";
        }
        else {
            this.datoRecibido = "Horario Diurno";
            this.periodoTIpo = "Semestre";
        }
        for (var _i = 0, _a = this.horarios; _i < _a.length; _i++) {
            var horario = _a[_i];
            if (horario.carrera === this.selectedCarrera && horario.semestre === this.selectedSemestre && horario.tipoHorario === this.datoRecibido) {
                existHorarioCarrera = true;
            }
        }
        if (!existHorarioCarrera) {
            var ruta = 'home/creacion/' + this.datoRecibido + '/' + this.selectedCarrera + '/' + this.selectedSemestre;
            ruta = ruta.replace(/\s+/g, "_");
            this._router.navigate([ruta], { relativeTo: this._route });
            setTimeout(function () {
                location.reload();
            }, 400);
        }
        else {
            sweetalert2_1["default"].fire('EL Horario de ' + this.selectedCarrera + ' del ' + this.selectedSemestre + this.periodoTIpo + ' ya existe', 'Por favor, si desea modificar vaya a la sección de horarios', 'error');
        }
    };
    CarrerasDialogComponent = __decorate([
        core_1.Component({
            selector: 'app-carreras-dialog',
            templateUrl: './carreras-dialog.component.html',
            styleUrls: ['./carreras-dialog.component.css'],
            providers: [horario_service_1.HorarioService]
        }),
        __param(1, core_1.Inject(dialog_1.MAT_DIALOG_DATA))
    ], CarrerasDialogComponent);
    return CarrerasDialogComponent;
}());
exports.CarrerasDialogComponent = CarrerasDialogComponent;
