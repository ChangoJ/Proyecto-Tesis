'use strict'

var mongoose = require('mongoose');
var autopopulate = require('mongoose-autopopulate');

var Schema = mongoose.Schema;

var AsignaturaScheme = Schema({
    nombre: String,
    carrera: Array,
    semestre: Array,
    profesor: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Profesor', autopopulate: true }],
    horario: String,
    creditos: String,
    abreviatura: String,
    color: String,
    paralelo: { type: Array, required: false },
});

AsignaturaScheme.plugin(autopopulate);


module.exports = mongoose.model('Asignatura', AsignaturaScheme);
