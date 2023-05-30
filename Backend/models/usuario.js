'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UsuarioScheme = Schema({
    nombre: String,
    usuario: String,
    email: String,
    phoneNumber: {
        type: String,
        required: false
    },
    contrasena: String,
    rol: String,
});

module.exports = mongoose.model('Usuario', UsuarioScheme);
