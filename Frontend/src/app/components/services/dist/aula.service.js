"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.AulaService = void 0;
var core_1 = require("@angular/core");
var http_1 = require("@angular/common/http");
var AulaService = /** @class */ (function () {
    function AulaService(_http, _detalleService) {
        this._http = _http;
        this._detalleService = _detalleService;
        this.url = this._detalleService.Global.url;
    }
    AulaService.prototype.getAulas = function (last) {
        if (last === void 0) { last = null; }
        var aulas = 'aulas';
        if (last != null) {
            aulas = 'aula/true';
        }
        return this._http.get(this.url + aulas);
    };
    AulaService.prototype.getAula = function (aulaId) {
        return this._http.get(this.url + 'aula/' + aulaId);
    };
    AulaService.prototype.searchAula = function (searchString) {
        return this._http.get(this.url + 'searchAula/' + searchString);
    };
    AulaService.prototype.create = function (aula) {
        var params = JSON.stringify(aula);
        var headers = new http_1.HttpHeaders().set('Content-Type', 'application/json');
        return this._http.post(this.url + 'save-aula', aula, { headers: headers });
    };
    AulaService.prototype.update = function (id, aula) {
        var params = JSON.stringify(aula);
        var headers = new http_1.HttpHeaders().set('Content-Type', 'application/json');
        return this._http.put(this.url + 'aula/' + id, params, { headers: headers });
    };
    AulaService.prototype["delete"] = function (id) {
        var headers = new http_1.HttpHeaders().set('Content-Type', 'application/json');
        return this._http["delete"](this.url + 'aula/' + id, { headers: headers });
    };
    AulaService = __decorate([
        core_1.Injectable()
    ], AulaService);
    return AulaService;
}());
exports.AulaService = AulaService;
