'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ProfesorScheme = Schema({
    nombre: String,
    contrato: String,
    carrera: Array,
});

module.exports = mongoose.model('Profesor', ProfesorScheme);
