"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.ProfesorService = void 0;
var core_1 = require("@angular/core");
var http_1 = require("@angular/common/http");
var ProfesorService = /** @class */ (function () {
    function ProfesorService(_http, _detalleService) {
        this._http = _http;
        this._detalleService = _detalleService;
        this.url = this._detalleService.Global.url;
    }
    ProfesorService.prototype.getProfesores = function (last) {
        if (last === void 0) { last = null; }
        var profesores = 'profesores';
        if (last != null) {
            profesores = 'profesor/true';
        }
        return this._http.get(this.url + profesores);
    };
    ProfesorService.prototype.getProfesor = function (profesorId) {
        return this._http.get(this.url + 'profesor/' + profesorId);
    };
    ProfesorService.prototype.searchProfesora = function (searchString) {
        return this._http.get(this.url + 'searchProfesor/' + searchString);
    };
    ProfesorService.prototype.create = function (profesor) {
        var params = JSON.stringify(profesor);
        var headers = new http_1.HttpHeaders().set('Content-Type', 'application/json');
        return this._http.post(this.url + 'save-profesor', profesor, { headers: headers });
    };
    ProfesorService.prototype.update = function (id, profesor) {
        var params = JSON.stringify(profesor);
        var headers = new http_1.HttpHeaders().set('Content-Type', 'application/json');
        return this._http.put(this.url + 'profesor/' + id, params, { headers: headers });
    };
    ProfesorService.prototype["delete"] = function (id) {
        var headers = new http_1.HttpHeaders().set('Content-Type', 'application/json');
        return this._http["delete"](this.url + 'profesor/' + id, { headers: headers });
    };
    ProfesorService = __decorate([
        core_1.Injectable()
    ], ProfesorService);
    return ProfesorService;
}());
exports.ProfesorService = ProfesorService;
