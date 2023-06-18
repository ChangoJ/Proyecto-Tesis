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
            console.log(req.body);
            _req$body = req.body, username = _req$body.username, password = _req$body.password;
            _context.prev = 2;
            _context.next = 5;
            return regeneratorRuntime.awrap(User.findOne({
              $or: [{
                username: username
              }, {
                ci: username
              }]
            }));

          case 5:
            user = _context.sent;

            if (user) {
              _context.next = 8;
              break;
            }

            return _context.abrupt("return", res.status(200).json({
              message: 'Usuario no encontrado'
            }));

          case 8:
            _context.next = 10;
            return regeneratorRuntime.awrap(bcrypt.compare(password, user.contrasena));

          case 10:
            isPasswordMatch = _context.sent;

            if (isPasswordMatch) {
              _context.next = 13;
              break;
            }

            return _context.abrupt("return", res.status(200).json({
              message: 'Contraseña incorrecta'
            }));

          case 13:
            // La contraseña coincide, puedes generar el token de autenticación y enviarlo al cliente
            token = jwt.sign({
              userId: user._id
            }, secretKey, {
              expiresIn: '1h'
            });
            res.json({
              token: token
            });
            _context.next = 20;
            break;

          case 17:
            _context.prev = 17;
            _context.t0 = _context["catch"](2);
            res.status(200).json({
              message: 'Error en el servidor'
            });

          case 20:
          case "end":
            return _context.stop();
        }
      }
    }, null, null, [[2, 17]]);
  }
};
module.exports = controller;