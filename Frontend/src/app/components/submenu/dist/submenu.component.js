"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.SubmenuComponent = void 0;
var core_1 = require("@angular/core");
var horario_dialog_component_1 = require("../horario-dialog/horario-dialog.component");
var carreras_dialog_component_1 = require("../carreras-dialog/carreras-dialog.component");
var BD_service_1 = require("../services/BD.service");
var sweetalert2_1 = require("sweetalert2");
var SubmenuComponent = /** @class */ (function () {
    function SubmenuComponent(_route, dialog, _router, _bdService) {
        this._route = _route;
        this.dialog = dialog;
        this._router = _router;
        this._bdService = _bdService;
        this.home = false;
        this.especificacion = false;
        this.horario = false;
        this.is_admin = false;
        this.is_suAdmin = false;
    }
    SubmenuComponent.prototype.ngOnInit = function () {
        this.rutaActual = this._router.url;
        if (this.rutaActual.includes("/especificacion")) {
            this.especificacion = true;
        }
        else if (this.rutaActual.includes("/horario")) {
            this.horario = true;
        }
        else if (this.rutaActual.includes("/home") || this.rutaActual.includes("")) {
            this.home = true;
        }
        var authToken = localStorage.getItem('datosUsuario');
        var UserData = JSON.parse(authToken);
        if (UserData.rol === "Administrador" || UserData.rol === "Superadministrador") {
            this.is_admin = true;
        }
        if (UserData.rol === "Superadministrador") {
            this.is_suAdmin = true;
        }
    };
    SubmenuComponent.prototype.asignaturas = function () {
        this._router.navigate(['asignaturas'], { relativeTo: this._route });
    };
    SubmenuComponent.prototype.irCrearHorario = function () {
        var _this = this;
        this._router.navigate(['/home']);
        setTimeout(function () {
            _this.openHorarioDialog();
        }, 300);
    };
    SubmenuComponent.prototype.verHorarios = function () {
        this._router.navigate(['/horarios']);
        if (!this.rutaActual.includes("editarHorarios")) {
            this._router.navigate(['/horarios']);
        }
        if (this.rutaActual === "/horarios") {
            location.reload();
        }
    };
    SubmenuComponent.prototype.openHorarioDialog = function () {
        var _this = this;
        var dialogRef = this.dialog.open(horario_dialog_component_1.HorarioDialogComponent, {
            width: '500px'
        });
        dialogRef.afterClosed().subscribe(function (result) {
            if (result) {
                _this.openCarrerasDialog(result); // Pasar el valor al método openCarrerasDialog()
            }
        });
    };
    SubmenuComponent.prototype.openCarrerasDialog = function (valor) {
        var dialogRef = this.dialog.open(carreras_dialog_component_1.CarrerasDialogComponent, {
            width: '500px'
        });
        // Utilizar el valor en el componente CarrerasDialogComponent como necesites
        dialogRef.componentInstance.datoRecibido = valor;
    };
    SubmenuComponent.prototype.openGuardarDialog = function () {
        var _this = this;
        var dialogRef = this.dialog.open(horario_dialog_component_1.HorarioDialogComponent, {
            width: '500px'
        });
        dialogRef.afterClosed().subscribe(function (result) {
            if (result) {
                _this.openCarrerasDialog(result); // Pasar el valor al método openCarrerasDialog()
            }
        });
    };
    SubmenuComponent.prototype.exportarBD = function () {
        this._bdService.exportarDatos().subscribe(function (response) {
            console.log(response);
            sweetalert2_1["default"].fire('Exportado Correctamente', response.message, 'success');
        }, function (error) {
            sweetalert2_1["default"].fire('Exportación fallida', error.error.message, 'error');
        });
    };
    SubmenuComponent.prototype.importarBD = function (event) {
        var file = event.target.files[0];
        console.log(file);
        if (file) {
            this._bdService.importarDatos(file).subscribe(function (response) {
                sweetalert2_1["default"].fire('Importado Correctamente', response.message, 'success');
            }, function (error) {
                sweetalert2_1["default"].fire('Importación fallida', error.error.message, 'error');
            });
        }
    };
    SubmenuComponent = __decorate([
        core_1.Component({
            selector: 'app-submenu',
            templateUrl: './submenu.component.html',
            styleUrls: ['./submenu.component.css'],
            providers: [BD_service_1.BDService]
        })
    ], SubmenuComponent);
    return SubmenuComponent;
}());
exports.SubmenuComponent = SubmenuComponent;
