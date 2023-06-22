"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.HorarioService = void 0;
var core_1 = require("@angular/core");
var http_1 = require("@angular/common/http");
var HorarioService = /** @class */ (function () {
    function HorarioService(_http, _detalleService) {
        this._http = _http;
        this._detalleService = _detalleService;
        this.url = this._detalleService.Global.url;
    }
    HorarioService.prototype.getHorarios = function (last) {
        if (last === void 0) { last = null; }
        var horarios = 'horarios';
        if (last != null) {
            horarios = 'horario/true';
        }
        return this._http.get(this.url + horarios);
    };
    HorarioService.prototype.getHorario = function (horarioId) {
        return this._http.get(this.url + 'horario/' + horarioId);
    };
    HorarioService.prototype.searchHorario = function (searchString) {
        return this._http.get(this.url + 'searchHorario/' + searchString);
    };
    HorarioService.prototype.create = function (horario) {
        var params = JSON.stringify(horario);
        var headers = new http_1.HttpHeaders().set('Content-Type', 'application/json');
        return this._http.post(this.url + 'save-horario', horario, { headers: headers });
    };
    HorarioService.prototype.update = function (id, horario) {
        var params = JSON.stringify(horario);
        var headers = new http_1.HttpHeaders().set('Content-Type', 'application/json');
        return this._http.put(this.url + 'horario/' + id, params, { headers: headers });
    };
    HorarioService.prototype["delete"] = function (id) {
        var headers = new http_1.HttpHeaders().set('Content-Type', 'application/json');
        return this._http["delete"](this.url + 'horario/' + id, { headers: headers });
    };
    HorarioService = __decorate([
        core_1.Injectable({
            providedIn: 'root'
        })
    ], HorarioService);
    return HorarioService;
}());
exports.HorarioService = HorarioService;
