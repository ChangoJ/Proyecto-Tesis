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
exports.HorarioObservacionDialogComponent = void 0;
var core_1 = require("@angular/core");
var dialog_1 = require("@angular/material/dialog");
var HorarioObservacionDialogComponent = /** @class */ (function () {
    function HorarioObservacionDialogComponent(dialogRef, data) {
        this.dialogRef = dialogRef;
        // Accediendo al valor de observacion desde los datos del diálogo
        this.observacion = data;
    }
    HorarioObservacionDialogComponent = __decorate([
        core_1.Component({
            selector: 'app-horario-observacion-dialog',
            templateUrl: './horario-observacion-dialog.component.html',
            styleUrls: ['./horario-observacion-dialog.component.css']
        }),
        __param(1, core_1.Inject(dialog_1.MAT_DIALOG_DATA))
    ], HorarioObservacionDialogComponent);
    return HorarioObservacionDialogComponent;
}());
exports.HorarioObservacionDialogComponent = HorarioObservacionDialogComponent;
