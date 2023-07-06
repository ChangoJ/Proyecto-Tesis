"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.LoginComponent = void 0;
var core_1 = require("@angular/core");
var usuario_service_1 = require("../services/usuario.service");
var sweetalert2_1 = require("sweetalert2");
var LoginComponent = /** @class */ (function () {
    function LoginComponent(_route, _authService, _usuarioService, _router) {
        this._route = _route;
        this._authService = _authService;
        this._usuarioService = _usuarioService;
        this._router = _router;
        this.usernameValue = "";
        this.passwordValue = "";
        this.code = "";
        this.contador = 0;
        this.showVerificationCodeForm = false;
    }
    LoginComponent.prototype.verifyCode = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                this._authService.verifyCode(this.code).subscribe(function (response) { return __awaiter(_this, void 0, void 0, function () {
                    var tokenData, userId, userData, mensaje;
                    var _this = this;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                if (!response.token) return [3 /*break*/, 2];
                                this._authService.setAuthToken(response.token);
                                tokenData = this._usuarioService.decodeToken(response.token);
                                userId = tokenData.userId;
                                return [4 /*yield*/, this._usuarioService.getUsuario(userId).toPromise()];
                            case 1:
                                userData = _a.sent();
                                this.userData = userData.usuario;
                                this._usuarioService.setUserData(this.userData);
                                this._router.navigate(['home']);
                                return [3 /*break*/, 3];
                            case 2:
                                mensaje = response.message;
                                sweetalert2_1["default"].fire(mensaje, 'Por favor, asegurese de ingresar bien el codigo de verificación.', 'error');
                                this.contador++;
                                _a.label = 3;
                            case 3:
                                if (this.contador === 3) {
                                    sweetalert2_1["default"].fire("Muchos Intentos Fallidos", 'Por favor, asegurese de ingresar bien el codigo de verificación.', 'error');
                                    setTimeout(function () {
                                        _this.showVerificationCodeForm = false;
                                    }, 400);
                                    setTimeout(function () {
                                        location.reload();
                                    }, 1200);
                                }
                                return [2 /*return*/];
                        }
                    });
                }); });
                return [2 /*return*/];
            });
        });
    };
    LoginComponent.prototype.sendCode = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                sweetalert2_1["default"].fire({
                    title: "Cargando...",
                    html: "\n    <div style=\"display: flex; justify-content: center; align-items: center; overflow: hidden;\">\n      <div class=\"spinner\"></div>\n    </div>\n  ",
                    showConfirmButton: false,
                    allowOutsideClick: false,
                    allowEscapeKey: false
                });
                this._authService.sendCode(this.usernameValue, this.passwordValue)
                    .subscribe(function (response) { return __awaiter(_this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        console.log(response);
                        if (response.status === "success") {
                            sweetalert2_1["default"].fire(response.message, 'Por favor, revise su correo en la bandeja principal o SPAM.', 'success');
                            this.showVerificationCodeForm = true;
                        }
                        else {
                            sweetalert2_1["default"].fire(response.message, 'Por favor, ingrese correctamente los datos.', 'error');
                        }
                        return [2 /*return*/];
                    });
                }); }, function (error) {
                    console.error(error);
                });
                return [2 /*return*/];
            });
        });
    };
    LoginComponent = __decorate([
        core_1.Component({
            selector: 'app-login',
            templateUrl: './login.component.html',
            styleUrls: ['./login.component.css'],
            providers: [usuario_service_1.UsuarioService]
        })
    ], LoginComponent);
    return LoginComponent;
}());
exports.LoginComponent = LoginComponent;
