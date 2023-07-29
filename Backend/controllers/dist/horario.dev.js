'use strict';

var validator = require('validator');

var horario = require('../models/horario');

var _require = require('mongoose'),
    mongoose = _require["default"];

var controller = {
  save: function save(req, res) {
    // Recoger parametros por post
    var params = req.body; // Validar datos (validator)

    try {
      var validate_tipoHorario = !validator.isEmpty(params.tipoHorario);
      var validate_carrera = !validator.isEmpty(params.carrera);
      var validate_semestre = !validator.isEmpty(params.semestre);
      var validate_estado = !validator.isEmpty(params.estado);
    } catch (err) {
      return res.status(200).send({
        status: 'error',
        message: 'Faltan datos por enviar'
      });
    }

    if (validate_tipoHorario && validate_carrera && validate_estado && validate_semestre && params.dia.length !== 0 && params.idTabla.length !== 0 && params.horas.length !== 0 && params.item.length !== 0 && (params.creado_por !== undefined || params.creado_por !== null)) {
      //Crear el objeto a guardar
      var horario1 = new horario(); //asignar valores

      horario1.tipoHorario = params.tipoHorario;
      horario1.estado = params.estado;
      horario1.carrera = params.carrera;
      horario1.semestre = params.semestre;
      horario1.ciclo = params.ciclo;
      horario1.dia = params.dia;
      horario1.idTabla = params.idTabla;
      horario1.horas = params.horas;
      horario1.item = params.item;
      horario1.creado_por = params.creado_por;
      horario1.observacion = params.observacion;
      horario1.paralelo = params.paralelo;
      horario1.horarioHoras = params.horarioHoras;
      horario1.revisado_por = params.revisado_por; //guardar el articulo

      horario1.save().then(function (horarioStored) {
        if (!horarioStored) {
          return res.status(404).send({
            status: 'error',
            message: 'El horario no se ha guardado.'
          });
        } // devolder respuesta


        return res.status(200).send({
          status: 'success',
          horario: horarioStored
        });
      });
    } else {
      return res.status(200).send({
        status: 'error',
        message: 'Los datos no son validos'
      });
    }
  },
  getHorarios: function getHorarios(req, res) {
    var query = horario.find({});
    var last = req.params.last;

    if (last || last != undefined) {
      query.limit(5);
    } //find 


    query.sort('-_id').then(function (horarios) {
      if (!horarios) {
        return res.status(404).send({
          status: 'error',
          message: 'No hay horarios para mostrar'
        });
      }

      return res.status(200).send({
        status: 'success',
        horarios: horarios
      });
    });
  },
  getHorario: function getHorario(req, res) {
    //recoger el id de la url
    var horarioId = req.params.id;
    var horarioIdValid = mongoose.Types.ObjectId.isValid(horarioId); //comprobar que existe

    if (horarioIdValid) {
      if (!horarioId || horario == null) {
        return res.status(404).send({
          status: 'error',
          message: 'No existe el horario'
        });
      } else {
        horario.findById(horarioId).then(function (horario) {
          if (!horario) {
            return res.status(404).send({
              status: 'error',
              message: 'No existe el horario'
            });
          }

          return res.status(200).send({
            status: 'success',
            horario: horario
          });
        });
      }
    } else {
      return res.status(200).send({
        status: 'error',
        message: 'La validacion no es correcta'
      });
    }
  },
  update: function update(req, res) {
    //recoger el id del articulo por la url
    var horarioId = req.params.id; //recoger datos del put

    var params = req.body;
    var horarioIdValid = mongoose.Types.ObjectId.isValid(horarioId); // Validar datos (validator)

    try {
      var validate_tipoHorario = !validator.isEmpty(params.tipoHorario);
      var validate_carrera = !validator.isEmpty(params.carrera);
      var validate_semestre = !validator.isEmpty(params.semestre);
      var validate_estado = !validator.isEmpty(params.estado);
    } catch (err) {
      return res.status(200).send({
        status: 'error',
        message: 'Faltan datos por enviar'
      });
    }

    if (validate_tipoHorario && validate_carrera && validate_estado && validate_semestre && params.dia.length !== 0 && params.idTabla.length !== 0 && params.horas.length !== 0 && params.item.length !== 0 && (params.creado_por !== undefined || params.creado_por !== null)) {
      horario.findOneAndUpdate({
        _id: horarioId
      }, params, {
        "new": true
      }).then(function (horarioUpdated) {
        if (!horarioUpdated) {
          return res.status(404).send({
            status: 'error',
            message: 'No existe el horario'
          });
        }

        return res.status(200).send({
          status: 'success',
          horario: horarioUpdated
        });
      });
    } else {
      return res.status(200).send({
        status: 'error',
        message: 'La validacion no es correcta'
      });
    }
  },
  "delete": function _delete(req, res) {
    var horarioId = req.params.id;
    horario.findByIdAndDelete({
      _id: horarioId
    }).then(function (horarioRemoved) {
      if (!horarioRemoved) {
        return res.status(404).send({
          status: 'error',
          message: 'Horario no existe'
        });
      }

      return res.status(200).send({
        status: 'success',
        horario: horarioRemoved
      });
    });
  },
  search: function search(req, res) {
    //sacar strin a buscar
    var searchString = req.params.search1; //find and 

    horario.find({
      "$or": [{
        "tipoHorario": {
          "$regex": searchString,
          "$options": "i"
        }
      }, {
        "carrera": {
          "$regex": searchString,
          "$options": "i"
        }
      }, {
        "semestre": {
          "$regex": "^" + searchString + "$",
          "$options": "i"
        }
      }, {
        "ciclo": {
          "$regex": "^" + searchString + "$",
          "$options": "i"
        }
      }, {
        "estado": {
          "$regex": searchString,
          "$options": "i"
        }
      }, {
        "observacion": {
          "$regex": searchString,
          "$options": "i"
        }
      }]
    }).sort([['date', 'descending']]).then(function (horarios) {
      if (!horarios || horarios.length <= 0) {
        return res.status(404).send({
          status: 'error',
          message: 'No hay horarios para mostrar'
        });
      }

      return res.status(200).send({
        status: 'success',
        horarios: horarios
      });
    });
  }
}; //end controller

module.exports = controller;