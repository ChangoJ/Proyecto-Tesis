"use strict";
exports.__esModule = true;
exports.roles = exports.ubicaciones = exports.hoursnight = exports.hours = exports.userData = exports.authToken = exports.horariosType = exports.ciclos = exports.semestresSelect = exports.carreras = exports.semestres = exports.carreraFilter = exports.rolesCarreras = exports.Global = void 0;
exports.Global = {
    url: 'http://localhost:3900/api/'
};
exports.rolesCarreras = {
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
exports.carreraFilter = ["Enfermeria",
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
exports.semestres = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10",];
exports.carreras = [
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
exports.semestresSelect = [
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
exports.ciclos = [
    { id: 1, textField: '1' },
    { id: 2, textField: '2' },
];
exports.horariosType = [
    { id: 1, textField: 'Diurno' },
    { id: 2, textField: 'Nocturno' }
];
exports.authToken = localStorage.getItem('datosUsuario');
exports.userData = JSON.parse(exports.authToken);
exports.hours = [
    '07:00 - 08:00',
    '08:00 - 09:00',
    '09:00 - 10:00',
    '10:00 - 11:00',
    '11:00 - 12:00',
    '12:00 - 13:00',
    '13:00 - 14:00',
    '14:00 - 15:00',
];
exports.hoursnight = [
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
exports.ubicaciones = [
    { id: 1, textField: 'Campus Norte' },
    { id: 2, textField: 'Campus Colon' },
    { id: 3, textField: 'ZOOM' }
];
exports.roles = [
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
