"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.AuthService = void 0;
var core_1 = require("@angular/core");
var rxjs_1 = require("rxjs");
var AuthService = /** @class */ (function () {
    function AuthService(_http, _detalleService) {
        this._http = _http;
        this._detalleService = _detalleService;
        this.url = this._detalleService.Global.url;
        this.authToken = localStorage.getItem('authToken') || '';
    }
    AuthService.prototype.login = function (username, password) {
        var _this = this;
        var body = { username: username, password: password };
        return this._http.post(this.url + 'login', body).pipe(rxjs_1.map(function (response) {
            if (response && response.token) {
                _this.setAuthToken(response.token);
            }
            return response;
        }));
    };
    AuthService.prototype.setAuthToken = function (token) {
        localStorage.setItem('authToken', token);
    };
    AuthService.prototype.logout = function () {
        localStorage.removeItem('authToken');
        localStorage.removeItem('datosUsuario');
    };
    AuthService = __decorate([
        core_1.Injectable({
            providedIn: 'root'
        })
    ], AuthService);
    return AuthService;
}());
exports.AuthService = AuthService;
