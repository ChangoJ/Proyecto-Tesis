"use strict";
exports.__esModule = true;
exports.Usuario = void 0;
var Usuario = /** @class */ (function () {
    function Usuario(_id, nombre, username, ci, email, contrasena, rol, phoneNumber, codigoVerificacion) {
        this._id = _id;
        this.nombre = nombre;
        this.username = username;
        this.ci = ci;
        this.email = email;
        this.contrasena = contrasena;
        this.rol = rol;
        this.phoneNumber = phoneNumber;
        this.codigoVerificacion = codigoVerificacion;
    }
    return Usuario;
}());
exports.Usuario = Usuario;
