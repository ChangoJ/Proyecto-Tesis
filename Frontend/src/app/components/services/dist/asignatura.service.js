"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.AsignaturaService = void 0;
var core_1 = require("@angular/core");
var http_1 = require("@angular/common/http");
var AsignaturaService = /** @class */ (function () {
    function AsignaturaService(_http, _detalleService) {
        this._http = _http;
        this._detalleService = _detalleService;
        this.url = this._detalleService.Global.url;
    }
    AsignaturaService.prototype.getAsignaturas = function (last) {
        if (last === void 0) { last = null; }
        var asignaturas = 'asignaturas';
        if (last != null) {
            asignaturas = 'asignatura/true';
        }
        return this._http.get(this.url + asignaturas);
    };
    AsignaturaService.prototype.getAsignatura = function (asignaturaId) {
        return this._http.get(this.url + 'asignatura/' + asignaturaId);
    };
    AsignaturaService.prototype.search = function (searchString, search2String) {
        return this._http.get(this.url + 'search/' + searchString + '/' + search2String);
    };
    AsignaturaService.prototype.searchThree = function (searchString, search2String, search3String) {
        return this._http.get(this.url + 'searchThree/' + searchString + '/' + search2String + '/' + search3String);
    };
    AsignaturaService.prototype.searchOne = function (searchString) {
        return this._http.get(this.url + 'searchOne/' + searchString);
    };
    AsignaturaService.prototype.create = function (asignatura) {
        var params = JSON.stringify(asignatura);
        var headers = new http_1.HttpHeaders().set('Content-Type', 'application/json');
        return this._http.post(this.url + 'save-for-profesor', params, { headers: headers });
    };
    AsignaturaService.prototype.update = function (id, asignatura) {
        var params = JSON.stringify(asignatura);
        var headers = new http_1.HttpHeaders().set('Content-Type', 'application/json');
        return this._http.put(this.url + 'asignatura/' + id, params, { headers: headers });
    };
    AsignaturaService.prototype["delete"] = function (id) {
        var headers = new http_1.HttpHeaders().set('Content-Type', 'application/json');
        return this._http["delete"](this.url + 'asignatura/' + id, { headers: headers });
    };
    AsignaturaService = __decorate([
        core_1.Injectable()
    ], AsignaturaService);
    return AsignaturaService;
}());
exports.AsignaturaService = AsignaturaService;
