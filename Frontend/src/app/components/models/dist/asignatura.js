"use strict";
exports.__esModule = true;
exports.Asignatura = void 0;
var Asignatura = /** @class */ (function () {
    function Asignatura(_id, nombre, carrera, semestre, profesor, horario, creditos, abreviatura, color, paralelo) {
        this._id = _id;
        this.nombre = nombre;
        this.carrera = carrera;
        this.semestre = semestre;
        this.profesor = profesor;
        this.horario = horario;
        this.creditos = creditos;
        this.abreviatura = abreviatura;
        this.color = color;
        this.paralelo = paralelo;
    }
    return Asignatura;
}());
exports.Asignatura = Asignatura;
