"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.AulasComponent = void 0;
var aula_service_1 = require("./../services/aula.service");
var core_1 = require("@angular/core");
var AulasComponent = /** @class */ (function () {
    function AulasComponent(_route, _aulaService, _router) {
        this._route = _route;
        this._aulaService = _aulaService;
        this._router = _router;
    }
    AulasComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.rutaActual = this._router.url;
        this._aulaService.getAulas().subscribe(function (response) {
            if (response.aulas) {
                _this.aulas = response.aulas;
            }
        }, function (error) {
            console.log(error);
        });
    };
    AulasComponent = __decorate([
        core_1.Component({
            selector: 'app-aulas',
            templateUrl: './aulas.component.html',
            styleUrls: ['./aulas.component.css'],
            providers: [aula_service_1.AulaService]
        })
    ], AulasComponent);
    return AulasComponent;
}());
exports.AulasComponent = AulasComponent;
