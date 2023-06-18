'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ProfesorScheme = Schema({
    nombre: String,
    contrato: String,
    carrera: Array,
    observacion: { type: String, required: false },
});

module.exports = mongoose.model('Profesores', ProfesorScheme);
