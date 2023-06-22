'use strict';

var mongoose = require('mongoose');

var autopopulate = require('mongoose-autopopulate');

var Schema = mongoose.Schema;
var DetalleScheme = Schema({
  carreras: Array,
  semestres: Array,
  ciclos: Array,
  horasDiurnas: Array,
  horasNocturnas: Array
});
DetalleScheme.plugin(autopopulate);
module.exports = mongoose.model('Detalle', DetalleScheme);