"use strict";

bcrypt = require('bcryptjs');
jwt = require('jsonwebtoken');
User = require('../models/usuario');
secretKey = 'MRCHANGO&CRISMASTERSON';
var controller = {
  login: function login(req, res) {
    var _req$body, username, password, user, isPasswordMatch, token;

    return regeneratorRuntime.async(function login$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _req$body = req.body, username = _req$body.username, password = _req$body.password;
            _context.prev = 1;
            _context.next = 4;
            return regeneratorRuntime.awrap(User.findOne({
              $or: [{
                username: username
              }, {
                ci: username
              }]
            }));

          case 4:
            user = _context.sent;

            if (user) {
              _context.next = 7;
              break;
            }

            return _context.abrupt("return", res.status(200).json({
              message: 'Usuario no encontrado'
            }));

          case 7:
            _context.next = 9;
            return regeneratorRuntime.awrap(bcrypt.compare(password, user.contrasena));

          case 9:
            isPasswordMatch = _context.sent;

            if (isPasswordMatch) {
              _context.next = 12;
              break;
            }

            return _context.abrupt("return", res.status(200).json({
              message: 'Contraseña incorrecta'
            }));

          case 12:
            // La contraseña coincide, puedes generar el token de autenticación y enviarlo al cliente
            token = jwt.sign({
              userId: user._id
            }, secretKey, {
              expiresIn: '1h'
            });
            res.json({
              token: token
            });
            _context.next = 19;
            break;

          case 16:
            _context.prev = 16;
            _context.t0 = _context["catch"](1);
            res.status(200).json({
              message: 'Error en el servidor'
            });

          case 19:
          case "end":
            return _context.stop();
        }
      }
    }, null, null, [[1, 16]]);
  }
};
module.exports = controller;