'use strict';

var mongoose = require('mongoose');

var autopopulate = require('mongoose-autopopulate');

var Schema = mongoose.Schema;
var DetalleScheme = Schema({
  carreras: Array,
  periodoIngles: Array,
  semestres: Array,
  ciclos: Array,
  paralelos: Array,
  horasDiurnas: Array,
  horasNocturnas: Array,
  horasAlternativaDiurnas: Array,
  horasAlternativaNocturnas: Array
});
DetalleScheme.plugin(autopopulate);
module.exports = mongoose.model('Detalle', DetalleScheme);