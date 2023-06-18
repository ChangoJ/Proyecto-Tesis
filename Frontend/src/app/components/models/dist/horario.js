"use strict";
exports.__esModule = true;
exports.Horario = void 0;
var Horario = /** @class */ (function () {
    function Horario(_id, tipoHorario, estado, carrera, semestre, dia, idTabla, horas, item, creado_por, observacion) {
        this._id = _id;
        this.tipoHorario = tipoHorario;
        this.estado = estado;
        this.carrera = carrera;
        this.semestre = semestre;
        this.dia = dia;
        this.idTabla = idTabla;
        this.horas = horas;
        this.item = item;
        this.creado_por = creado_por;
        this.observacion = observacion;
    }
    return Horario;
}());
exports.Horario = Horario;
