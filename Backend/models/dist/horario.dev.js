'use strict';

var mongoose = require('mongoose');

var autopopulate = require('mongoose-autopopulate');

var Schema = mongoose.Schema;
var HorarioScheme = Schema({
  tipoHorario: String,
  estado: String,
  carrera: String,
  semestre: String,
  dia: Array,
  idTabla: [{
    idAsignatura: String,
    idAula: String
  }],
  horas: [{
    horaInicio: String,
    horaFin: String
  }],
  item: [{
    asignatura: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Asignatura',
      autopopulate: true
    },
    aula: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Aula',
      autopopulate: true
    }
  }],
  creado_por: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    autopopulate: true
  },
  observacion: {
    type: String,
    required: false
  },
  paralelo: {
    type: String,
    required: false
  },
  ciclo: {
    type: String,
    required: false
  },
  horarioHoras: {
    type: String,
    required: false
  },
  revisado_por: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    autopopulate: true,
    required: false
  }
});
HorarioScheme.plugin(autopopulate);
module.exports = mongoose.model('Horario', HorarioScheme);