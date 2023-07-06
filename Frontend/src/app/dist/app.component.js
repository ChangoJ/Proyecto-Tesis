"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.AppComponent = void 0;
var core_1 = require("@angular/core");
var detalle_service_1 = require("./components/services/detalle.service");
var auth_service_1 = require("./components/services/auth.service");
var sweetalert2_1 = require("sweetalert2");
var AppComponent = /** @class */ (function () {
    function AppComponent(_router, _authService) {
        this._router = _router;
        this._authService = _authService;
        this.title = 'sistema-web-creacion-de-horarios-unibe';
        this.inactivityTimeout = 5 * 60 * 60 * 1000;
        this.secondWarningTimeout = 12 * 60 * 60 * 1000;
        this.firstWarningShown = false;
        this.resetTimeout();
    }
    ;
    AppComponent.prototype.resetTimeout = function () {
        var _this = this;
        this.firstWarningShown = false;
        clearTimeout(this.timeoutId);
        clearTimeout(this.timeoutId2);
        this.timeoutId = setTimeout(function () {
            if (localStorage.length > 0) {
                _this.firstWarningShown = true;
                sweetalert2_1["default"].fire({
                    title: "Sesión a punto de expirar",
                    text: "La sesión está a punto de expirar. ¿Desea mantenerse en sesión?",
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonText: 'Mantener sesión',
                    cancelButtonText: 'Cerrar sesión'
                }).then(function (result) {
                    if (result.isConfirmed) {
                        // El usuario ha decidido mantener la sesión, reiniciamos el temporizador
                        _this.resetTimeout();
                        _this.firstWarningShown = false;
                    }
                    else if (result.isDismissed) {
                        // El usuario ha decidido cerrar sesión
                        localStorage.clear();
                        // Aquí puedes redirigir al usuario a la página de inicio de sesión o realizar otras acciones necesarias
                        _this._router.navigate(['/login']);
                    }
                });
                if (_this.firstWarningShown) {
                    _this.timeoutId2 = setTimeout(function () {
                        sweetalert2_1["default"].fire("Sesión Expirada", 'La sesión ha expirado.', 'error');
                        localStorage.clear();
                        _this._router.navigate(['/login']);
                    }, _this.secondWarningTimeout);
                }
            }
        }, this.inactivityTimeout);
    };
    AppComponent.prototype.resetTimeoutOnPageReload = function () {
        this.resetTimeout();
    };
    __decorate([
        core_1.HostListener('window:mousemove'),
        core_1.HostListener('window:keypress')
    ], AppComponent.prototype, "resetTimeout");
    __decorate([
        core_1.HostListener('window:beforeunload')
    ], AppComponent.prototype, "resetTimeoutOnPageReload");
    AppComponent = __decorate([
        core_1.Component({
            selector: 'app-root',
            templateUrl: './app.component.html',
            styleUrls: ['./app.component.css'],
            providers: [detalle_service_1.DetalleService, auth_service_1.AuthService]
        })
    ], AppComponent);
    return AppComponent;
}());
exports.AppComponent = AppComponent;
