"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.UsuarioService = void 0;
var core_1 = require("@angular/core");
var http_1 = require("@angular/common/http");
var UsuarioService = /** @class */ (function () {
    function UsuarioService(_http, _detalleService) {
        this._http = _http;
        this._detalleService = _detalleService;
        this.url = this._detalleService.Global.url;
        this.datosUsuario = localStorage.getItem('datosUsuario') || '';
    }
    UsuarioService.prototype.getUsuarios = function (last) {
        if (last === void 0) { last = null; }
        var usuarios = 'usuarios';
        if (last != null) {
            usuarios = 'usuario/true';
        }
        return this._http.get(this.url + usuarios);
    };
    UsuarioService.prototype.getUsuario = function (usuarioId) {
        return this._http.get(this.url + 'usuario/' + usuarioId);
    };
    UsuarioService.prototype.setUserData = function (userData) {
        var userDataString = JSON.stringify(userData);
        localStorage.setItem('datosUsuario', userDataString);
        var hey = JSON.parse(userDataString);
        console.log(hey.nombre);
    };
    UsuarioService.prototype.searchProfesora = function (searchString) {
        return this._http.get(this.url + 'searchUsuario/' + searchString);
    };
    UsuarioService.prototype.create = function (usuario) {
        var params = JSON.stringify(usuario);
        var headers = new http_1.HttpHeaders().set('Content-Type', 'application/json');
        return this._http.post(this.url + 'save-usuario', usuario, { headers: headers });
    };
    UsuarioService.prototype.update = function (id, usuario) {
        var params = JSON.stringify(usuario);
        var headers = new http_1.HttpHeaders().set('Content-Type', 'application/json');
        return this._http.put(this.url + 'usuario/' + id, params, { headers: headers });
    };
    UsuarioService.prototype["delete"] = function (id) {
        var headers = new http_1.HttpHeaders().set('Content-Type', 'application/json');
        return this._http["delete"](this.url + 'usuario/' + id, { headers: headers });
    };
    UsuarioService.prototype.decodeToken = function (token) {
        var base64Url = token.split('.')[1];
        var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        var decodedData = JSON.parse(atob(base64));
        return decodedData;
    };
    UsuarioService = __decorate([
        core_1.Injectable()
    ], UsuarioService);
    return UsuarioService;
}());
exports.UsuarioService = UsuarioService;
