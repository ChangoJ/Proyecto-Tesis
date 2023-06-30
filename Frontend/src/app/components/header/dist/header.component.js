"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.HeaderComponent = void 0;
var core_1 = require("@angular/core");
var sweetalert2_1 = require("sweetalert2");
var HeaderComponent = /** @class */ (function () {
    function HeaderComponent(_authService, _router) {
        this._authService = _authService;
        this._router = _router;
    }
    HeaderComponent.prototype.especificacion = function () {
        this._router.navigate(['/especificacion/asignaturas']);
    };
    HeaderComponent.prototype.logout = function () {
        var _this = this;
        sweetalert2_1["default"].fire({
            title: '¿Estás seguro de cerrar sesión?',
            text: 'Se perdera todo lo que no ha guardado y se cerrara sesión.',
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Cerrar Sesión'
        }).then(function (result) {
            if (result.isConfirmed) {
                _this._authService.logout();
                setTimeout(function () {
                    _this._router.navigate(['/login']);
                }, 800);
                sweetalert2_1["default"].fire('Sesión cerrada', 'Ha cerrado sesión', 'success');
            }
            else {
                sweetalert2_1["default"].fire('Operación cancelada', 'No ha cerrado sesón', 'warning');
            }
        });
    };
    HeaderComponent = __decorate([
        core_1.Component({
            selector: 'app-header',
            templateUrl: './header.component.html',
            styleUrls: ['./header.component.css']
        })
    ], HeaderComponent);
    return HeaderComponent;
}());
exports.HeaderComponent = HeaderComponent;
