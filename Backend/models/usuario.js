'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UsuarioScheme = Schema({
    nombre: String,
    username: { type: String, unique: true },
    email: { type: String, unique: true },
    ci: { type: String, unique: true },
    phoneNumber: { type: String, unique: true, required: false },
    contrasena: String,
    rol: String,
    codigoVerificacion: { type: String, required: false },
});

module.exports = mongoose.model('Usuario', UsuarioScheme);
