"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.BDService = void 0;
var core_1 = require("@angular/core");
var http_1 = require("@angular/common/http");
var BDService = /** @class */ (function () {
    function BDService(_http, _detalleService) {
        this._http = _http;
        this._detalleService = _detalleService;
        this.url = this._detalleService.Global.url;
    }
    BDService.prototype.exportarDatos = function () {
        return this._http.get(this.url + 'exportar/');
    };
    BDService.prototype.importarDatos = function (file) {
        var headers = new http_1.HttpHeaders();
        headers.append('Content-Type', 'application/json'); // Configura el encabezado Content-Type como application/json
        return this._http.post(this.url + 'importar/', file, { headers: headers });
    };
    BDService = __decorate([
        core_1.Injectable()
    ], BDService);
    return BDService;
}());
exports.BDService = BDService;
