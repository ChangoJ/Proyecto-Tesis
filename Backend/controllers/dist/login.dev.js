"use strict";

bcrypt = require('bcryptjs');
jwt = require('jsonwebtoken');
User = require('../models/usuario');

var nodemailer = require('nodemailer');

var _require = require("googleapis"),
    google = _require.google;

oAuth2Client = new google.auth.OAuth2('106822865384-1v7tmg8aeqssetsttaip63ecrki9epq1.apps.googleusercontent.com', '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', 'https://developers.google.com/oauthplayground');
oAuth2Client.setCredentials({
  refresh_token: "1//04aNxZcl1kfu-CgYIARAAGAQSNwF-L9Ir7a87xNHFLPYl0V3kXX-2uU318_HvvoI3IfBzWk8-2WUXuvjwItPr_ZD4zNtFbttPats"
});
secretKey = 'MRCHANGO&CRISMASTERSON';
codigoVerificacion = "";
user = "";

function generateVerificationCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

var controller = {
  sendCode: function sendCode(req, res) {
    var _req$body, username, password, isPasswordMatch, myAccessToken, transporter, mailOptions;

    return regeneratorRuntime.async(function sendCode$(_context) {
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
              message: 'Usuario no encontrado',
              status: "error"
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
              message: 'Contraseña incorrecta',
              status: "error"
            }));

          case 12:
            // Generar el código de verificación
            codigoVerificacion = generateVerificationCode(); // Guardar el código de verificación en el usuario

            user.codigoVerificacion = codigoVerificacion;
            _context.next = 16;
            return regeneratorRuntime.awrap(user.save());

          case 16:
            _context.next = 18;
            return regeneratorRuntime.awrap(oAuth2Client.getAccessToken());

          case 18:
            myAccessToken = _context.sent;
            // Configurar el transporte de correo electrónico con nodemailer
            transporter = nodemailer.createTransport({
              service: 'gmail',
              auth: {
                type: 'OAuth2',
                user: 'sistemaunibehorarios@gmail.com',
                clientId: '106822865384-1v7tmg8aeqssetsttaip63ecrki9epq1.apps.googleusercontent.com',
                clientSecret: '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',
                refreshToken: "1//04aNxZcl1kfu-CgYIARAAGAQSNwF-L9Ir7a87xNHFLPYl0V3kXX-2uU318_HvvoI3IfBzWk8-2WUXuvjwItPr_ZD4zNtFbttPats",
                accessToken: myAccessToken
              }
            }); // Configurar el correo electrónico a enviar

            mailOptions = {
              from: 'sistemaunibehorarios@gmail.com',
              to: user.email,
              subject: 'Código de verificación para el Sistema de Horarios de clases en la UNIB.E',
              text: "Tu c\xF3digo de verificaci\xF3n es: ".concat(codigoVerificacion)
            }; // Enviar el correo electrónico con el código de verificación

            transporter.sendMail(mailOptions, function (error, info) {
              if (error) {
                return res.status(200).json({
                  message: 'Error al enviar el código de verificación por correo electrónico',
                  status: "error"
                });
              } else {
                return res.status(200).json({
                  message: 'Código de verificación enviado por correo electrónico',
                  status: "success"
                });
              }
            });
            _context.next = 28;
            break;

          case 24:
            _context.prev = 24;
            _context.t0 = _context["catch"](1);
            console.log(_context.t0);
            res.status(200).json({
              message: 'Error en el servidor',
              status: "error"
            });

          case 28:
          case "end":
            return _context.stop();
        }
      }
    }, null, null, [[1, 24]]);
  },
  verifyCode: function verifyCode(req, res) {
    var code, token;
    return regeneratorRuntime.async(function verifyCode$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.prev = 0;
            code = req.body.code;

            if (!(user.codigoVerificacion === code)) {
              _context2.next = 7;
              break;
            }

            token = jwt.sign({
              userId: user._id
            }, secretKey, {
              expiresIn: '7d'
            });
            return _context2.abrupt("return", res.status(200).json({
              message: 'Código de verificación correcto',
              token: token
            }));

          case 7:
            return _context2.abrupt("return", res.status(200).json({
              message: 'Código de verificación incorrecto'
            }));

          case 8:
            _context2.next = 13;
            break;

          case 10:
            _context2.prev = 10;
            _context2.t0 = _context2["catch"](0);
            res.status(200).json({
              message: 'Error en el servidor'
            });

          case 13:
          case "end":
            return _context2.stop();
        }
      }
    }, null, null, [[0, 10]]);
  }
};

function getAccessAndRefreshTokens() {
  var _ref, token, refresh_token;

  return regeneratorRuntime.async(function getAccessAndRefreshTokens$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          _context3.next = 3;
          return regeneratorRuntime.awrap(oAuth2Client.getAccessToken());

        case 3:
          _ref = _context3.sent;
          token = _ref.token;
          refresh_token = _ref.refresh_token;
          return _context3.abrupt("return", {
            accessToken: token,
            refreshToken: refresh_token
          });

        case 9:
          _context3.prev = 9;
          _context3.t0 = _context3["catch"](0);
          console.log("Error al obtener los tokens:", _context3.t0);
          return _context3.abrupt("return", null);

        case 13:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 9]]);
}

module.exports = controller;