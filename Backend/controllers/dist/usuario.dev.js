'use strict';

var validator = require('validator');

var usuario = require('../models/usuario');

var fs = require('fs');

var path = require('path');

var _require = require('mongoose'),
    mongoose = _require["default"];

var bcrypt = require('bcrypt');

var saltRounds = 10;
var controller = {
  save: function save(req, res) {
    var params, validate_nombre, validate_usuario, validate_email, validate_ci, validate_contrasena, validate_rol, existingUser, usuario1;
    return regeneratorRuntime.async(function save$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            // Recoger parametros por post
            params = req.body; // Validar datos (validator)

            _context.prev = 1;
            validate_nombre = !validator.isEmpty(params.nombre);
            validate_usuario = !validator.isEmpty(params.username);
            validate_email = !validator.isEmpty(params.email);
            validate_ci = !validator.isEmpty(params.ci);
            validate_contrasena = !validator.isEmpty(params.contrasena);
            validate_rol = !validator.isEmpty(params.rol);
            _context.next = 13;
            break;

          case 10:
            _context.prev = 10;
            _context.t0 = _context["catch"](1);
            return _context.abrupt("return", res.status(200).send({
              status: 'error',
              message: 'Faltan datos por enviar'
            }));

          case 13:
            _context.next = 15;
            return regeneratorRuntime.awrap(usuario.findOne({
              $or: [{
                email: params.email
              }, {
                username: params.username
              }, {
                phoneNumber: params.phoneNumber
              }, {
                ci: params.ci
              }]
            }));

          case 15:
            existingUser = _context.sent;

            if (existingUser) {
              _context.next = 34;
              break;
            }

            if (!(validate_nombre && validate_ci && validate_usuario && validate_email && validate_contrasena && validate_rol)) {
              _context.next = 31;
              break;
            }

            //Crear el objeto a guardar
            usuario1 = new usuario(); //asignar valores

            usuario1.nombre = params.nombre;
            usuario1.username = params.username;
            usuario1.email = params.email;
            usuario1.ci = params.ci;
            usuario1.phoneNumber = params.phoneNumber;
            _context.next = 26;
            return regeneratorRuntime.awrap(bcrypt.hash(params.contrasena, saltRounds));

          case 26:
            usuario1.contrasena = _context.sent;
            usuario1.rol = params.rol; //guardar el articulo

            usuario1.save().then(function (usuarioStored) {
              if (!usuarioStored) {
                return res.status(404).send({
                  status: 'error',
                  message: 'El usuario no se ha guardado.'
                });
              } // devolder respuesta


              return res.status(200).send({
                status: 'success',
                usuario: usuarioStored
              });
            });
            _context.next = 32;
            break;

          case 31:
            return _context.abrupt("return", res.status(200).send({
              status: 'error',
              message: 'Los datos no son validos'
            }));

          case 32:
            _context.next = 35;
            break;

          case 34:
            return _context.abrupt("return", res.status(200).json({
              message: 'El Nombre de usuario, CI, N° Celular o Email ya existen'
            }));

          case 35:
          case "end":
            return _context.stop();
        }
      }
    }, null, null, [[1, 10]]);
  },
  getUsuarios: function getUsuarios(req, res) {
    var query = usuario.find({});
    var last = req.params.last;

    if (last || last != undefined) {
      query.limit(5);
    } //find 


    query.sort('-_id').then(function (usuarios) {
      if (!usuarios) {
        return res.status(404).send({
          status: 'error',
          message: 'No hay usuarios para mostrar'
        });
      }

      return res.status(200).send({
        status: 'success',
        usuarios: usuarios
      });
    });
  },
  getUsuario: function getUsuario(req, res) {
    //recoger el id de la url
    var usuarioId = req.params.id;
    var usuarioIdValid = mongoose.Types.ObjectId.isValid(usuarioId); //comprobar que existe

    if (usuarioIdValid) {
      if (!usuarioId || usuario == null) {
        return res.status(404).send({
          status: 'error',
          message: 'No existe el usuario'
        });
      } else {
        usuario.findById(usuarioId).then(function (usuario) {
          if (!usuario) {
            return res.status(404).send({
              status: 'error',
              message: 'No existe el usuario'
            });
          }

          return res.status(200).send({
            status: 'success',
            usuario: usuario
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
    var usuarioId, params, usuarioIdValid, validate_nombre, validate_usuario, validate_email, validate_ci, validate_contrasena, validate_rol;
    return regeneratorRuntime.async(function update$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            // Recoger el id del usuario por la URL
            usuarioId = req.params.id; // Recoger los datos del body

            params = req.body; // Validar el id del usuario

            usuarioIdValid = mongoose.Types.ObjectId.isValid(usuarioId); // Validar los datos

            _context2.prev = 3;
            validate_nombre = !validator.isEmpty(params.nombre);
            validate_usuario = !validator.isEmpty(params.username);
            validate_email = !validator.isEmpty(params.email);
            validate_ci = !validator.isEmpty(params.ci);
            validate_contrasena = !validator.isEmpty(params.contrasena);
            validate_rol = !validator.isEmpty(params.rol);
            _context2.next = 15;
            break;

          case 12:
            _context2.prev = 12;
            _context2.t0 = _context2["catch"](3);
            return _context2.abrupt("return", res.status(400).send({
              status: 'error',
              message: 'Faltan datos por enviar'
            }));

          case 15:
            if (!(usuarioId.match(/^[0-9a-fA-F]{24}$/) && validate_nombre && validate_usuario && validate_email && validate_ci && validate_rol && validate_contrasena)) {
              _context2.next = 19;
              break;
            }

            // Buscar el usuario actual en la base de datos
            usuario.findById(usuarioId).then(function (usuarioActual) {
              if (!usuarioActual) {
                return res.status(404).send({
                  status: 'error',
                  message: 'No existe el usuario'
                });
              } // Verificar si la contraseña ha sido modificada


              if (params.contrasena && params.contrasena !== usuarioActual.contrasena) {
                // Encriptar la nueva contraseña
                bcrypt.hash(params.contrasena, 10, function (err, hash) {
                  if (err) {
                    return res.status(500).send({
                      status: 'error',
                      message: 'Error al encriptar la contraseña'
                    });
                  }

                  params.contrasena = hash; // Reemplazar la contraseña con el hash
                  // Actualizar el usuario en la base de datos

                  usuario.findOneAndUpdate({
                    _id: usuarioId
                  }, params, {
                    "new": true
                  }).then(function (usuarioUpdated) {
                    if (!usuarioUpdated) {
                      return res.status(404).send({
                        status: 'error',
                        message: 'No existe el usuario'
                      });
                    }

                    return res.status(200).send({
                      status: 'success',
                      usuario: usuarioUpdated
                    });
                  })["catch"](function (error) {
                    return res.status(500).send({
                      status: 'error',
                      message: 'Datos duplicadas con otro usuario. Los datos (CI, USUARIO, EMAIL, N° Celular) deben ser únicos.'
                    });
                  });
                });
              } else {
                // Actualizar el usuario en la base de datos sin modificar la contraseña
                usuario.findOneAndUpdate({
                  _id: usuarioId
                }, params, {
                  "new": true
                }).then(function (usuarioUpdated) {
                  if (!usuarioUpdated) {
                    return res.status(404).send({
                      status: 'error',
                      message: 'No existe el usuario'
                    });
                  }

                  return res.status(200).send({
                    status: 'success',
                    usuario: usuarioUpdated
                  });
                })["catch"](function (error) {
                  return res.status(500).send({
                    status: 'error',
                    message: 'Datos duplicadas con otro usuario. Los datos (CI, Usuario, Email, N° Celular) deben ser únicos.'
                  });
                });
              }
            })["catch"](function (error) {
              return res.status(500).send({
                status: 'error',
                message: 'Error al buscar el usuario en la base de datos'
              });
            });
            _context2.next = 20;
            break;

          case 19:
            return _context2.abrupt("return", res.status(400).send({
              status: 'error',
              message: 'La validación no es correcta'
            }));

          case 20:
          case "end":
            return _context2.stop();
        }
      }
    }, null, null, [[3, 12]]);
  },
  "delete": function _delete(req, res) {
    var usuarioId = req.params.id;
    usuario.findByIdAndDelete({
      _id: usuarioId
    }).then(function (usuarioRemoved) {
      if (!usuarioRemoved) {
        return res.status(404).send({
          status: 'error',
          message: 'usuario no existe'
        });
      }

      return res.status(200).send({
        status: 'success',
        usuario: usuarioRemoved
      });
    });
  },
  search: function search(req, res) {
    //sacar strin a buscar
    var searchString = req.params.search1; //find and 

    usuario.find({
      "$or": [{
        "nombre": {
          "$regex": searchString,
          "$options": "i"
        }
      }, {
        "username": {
          "$regex": searchString,
          "$options": "i"
        }
      }, {
        "ci": {
          "$regex": searchString,
          "$options": "i"
        }
      }, {
        "email": {
          "$regex": searchString,
          "$options": "i"
        }
      }, {
        "ROL": {
          "$regex": searchString,
          "$options": "i"
        }
      }]
    }).sort([['date', 'descending']]).then(function (usuarios) {
      if (!usuarios || usuarios.length <= 0) {
        return res.status(404).send({
          status: 'error',
          message: 'No hay usuarios para mostrar'
        });
      }

      return res.status(200).send({
        status: 'success',
        usuarios: usuarios
      });
    });
  }
}; //end controller

module.exports = controller;