"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.GlobalService = void 0;
var core_1 = require("@angular/core");
var GlobalService = /** @class */ (function () {
    function GlobalService() {
        this.Global = {
            url: 'http://localhost:3900/api/'
        };
        this.rolesCarreras = {
            enfermeria: 'Enfermeria',
            fisioterapia: 'Fisioterapia',
            nutricion: 'Nutricion',
            psicologia: 'Psicologia',
            educacionBasica: 'Educacion Basica',
            produccionAudiovisual: 'Produccion Audiovisual',
            contabilidad: 'Contabilidad',
            derecho: 'Derecho',
            economia: 'Economia',
            software: 'Software',
            administracionEmpresas: 'Administracion de Empresas',
            gastronomia: 'Gastronomia',
            turismo: 'Turismo'
        };
        this.carreraFilter = ["Enfermeria",
            "Fisioterapia",
            "Nutricion",
            "Psicologia",
            "Educacion Basica",
            "Produccion Audiovisual",
            "Contabilidad",
            "Derecho",
            "Economia",
            "Software",
            "Administracion de Empresas",
            "Gastronomia",
            "Turismo"
        ];
        this.semestres = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10",];
        this.carreras = [
            { id: 1, textField: 'Enfermeria' },
            { id: 2, textField: 'Fisioterapia' },
            { id: 3, textField: 'Nutricion' },
            { id: 4, textField: 'Psicologia' },
            { id: 5, textField: 'Educacion Basica' },
            { id: 6, textField: 'Produccion Audiovisual' },
            { id: 7, textField: 'Contabilidad' },
            { id: 8, textField: 'Derecho' },
            { id: 9, textField: 'Economia' },
            { id: 10, textField: 'Software' },
            { id: 11, textField: 'Administracion de Empresas' },
            { id: 12, textField: 'Gastronomia' },
            { id: 13, textField: 'Turismo' }
        ];
        this.semestresSelect = [
            { id: 1, textField: '1' },
            { id: 2, textField: '2' },
            { id: 3, textField: '3' },
            { id: 4, textField: '4' },
            { id: 5, textField: '5' },
            { id: 6, textField: '6' },
            { id: 7, textField: '7' },
            { id: 8, textField: '8' },
            { id: 9, textField: '9' },
            { id: 10, textField: '10' },
        ];
        this.ciclos = [
            { id: 1, textField: '1' },
            { id: 2, textField: '2' },
        ];
        this.horariosType = [
            { id: 1, textField: 'Diurno' },
            { id: 2, textField: 'Nocturno' }
        ];
        this.authToken = localStorage.getItem('datosUsuario');
        this.userData = JSON.parse(this.authToken);
        this.hours = [
            '07:00 - 08:00',
            '08:00 - 09:00',
            '09:00 - 10:00',
            '10:00 - 11:00',
            '11:00 - 12:00',
            '12:00 - 13:00',
            '13:00 - 14:00',
            '14:00 - 15:00',
        ];
        this.hoursnight = [
            '08:00 - 09:00',
            '09:00 - 10:00',
            '10:00 - 11:00',
            '11:00 - 12:00',
            '12:00 - 13:00',
            '13:00 - 14:00',
            '18:00 - 19:00',
            '19:00 - 20:00',
            '20:00 - 21:00',
            '21:00 - 22:00',
        ];
        this.ubicaciones = [
            { id: 1, textField: 'Campus Norte' },
            { id: 2, textField: 'Campus Colon' },
            { id: 3, textField: 'ZOOM' }
        ];
        this.roles = [
            { id: 1, textField: 'Administrador' },
            { id: 2, textField: 'Revisador' },
            { id: 3, textField: 'Aprobador' },
            { id: 4, textField: 'Enfermeria' },
            { id: 5, textField: 'Fisioterapia' },
            { id: 6, textField: 'Nutricion' },
            { id: 7, textField: 'Psicologia' },
            { id: 8, textField: 'Educacion Basica' },
            { id: 9, textField: 'produccionAudiovisual' },
            { id: 10, textField: 'Contabilidad' },
            { id: 11, textField: 'Derecho' },
            { id: 12, textField: 'Economia' },
            { id: 13, textField: 'Software' },
            { id: 14, textField: 'AadministracionEmpresas' },
            { id: 15, textField: 'Gastronomia' },
            { id: 16, textField: 'Turismo' }
        ];
    }
    GlobalService = __decorate([
        core_1.Injectable()
    ], GlobalService);
    return GlobalService;
}());
exports.GlobalService = GlobalService;
