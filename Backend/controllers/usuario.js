'use strict'

var validator = require('validator');
var usuario = require('../models/usuario');
var fs = require('fs');
var path = require('path');
const { default: mongoose } = require('mongoose');
const bcrypt = require('bcrypt');

const saltRounds = 10;

var controller = {

    save: async (req, res) => {
        // Recoger parametros por post
        var params = req.body;

        // Validar datos (validator)
        try {
            var validate_nombre = !validator.isEmpty(params.nombre);
            var validate_usuario = !validator.isEmpty(params.username);
            var validate_email = !validator.isEmpty(params.email);
            var validate_ci = !validator.isEmpty(params.ci);
            var validate_contrasena = !validator.isEmpty(params.contrasena);
            var validate_rol = !validator.isEmpty(params.rol);



        } catch (err) {
            return res.status(200).send({
                status: 'error',
                message: 'Faltan datos por enviar'
            });
        }

        var existingUser = await usuario.findOne({
            $or: [
                { email: params.email },
                { username: params.username },
                { phoneNumber: params.phoneNumber },
                { ci: params.ci }
            ]
        });

        if (!existingUser) {


            if (validate_nombre && validate_ci && validate_usuario && validate_email && validate_contrasena && validate_rol) {


                //Crear el objeto a guardar
                var usuario1 = new usuario();


                //asignar valores
                usuario1.nombre = params.nombre;
                usuario1.username = params.username;
                usuario1.email = params.email;
                usuario1.ci = params.ci;
                usuario1.phoneNumber = params.phoneNumber;
                usuario1.contrasena = await bcrypt.hash(params.contrasena, saltRounds);
                usuario1.rol = params.rol;
                usuario1.codigoVerificacion = params.codigoVerificacion;


                //guardar el articulo
                usuario1.save().then((usuarioStored) => {

                    if (!usuarioStored) {
                        return res.status(404).send({
                            status: 'error',
                            message: 'El usuario no se ha guardado.'
                        });
                    }

                    // devolder respuesta
                    return res.status(200).send({
                        status: 'success',
                        usuario: usuarioStored
                    });

                });



            } else {
                return res.status(200).send({
                    status: 'error',
                    message: 'Los datos no son validos'
                });
            }
        } else {
            return res.status(200).json({ message: 'El Nombre de usuario, CI, N° Celular o Email ya existen' });


        }

    },

    getUsuarios: (req, res) => {

        var query = usuario.find({});

        var last = req.params.last;

        if (last || last != undefined) {
            query.limit(5);
        }



        //find 
        query.sort('-_id').then((usuarios) => {

            if (!usuarios) {
                return res.status(404).send({
                    status: 'error',
                    message: 'No hay usuarios para mostrar'
                });
            }

            return res.status(200).send({
                status: 'success',
                usuarios
            });

        });

    },

    getUsuario: (req, res) => {

        //recoger el id de la url

        var usuarioId = req.params.id
        var usuarioIdValid = mongoose.Types.ObjectId.isValid(usuarioId);
        //comprobar que existe
        if (usuarioIdValid) {


            if (!usuarioId || usuario == null) {
                return res.status(404).send({
                    status: 'error',
                    message: 'No existe el usuario'
                });
            } else {
                usuario.findById(usuarioId).then((usuario) => {

                    if (!usuario) {
                        return res.status(404).send({
                            status: 'error',
                            message: 'No existe el usuario'
                        });
                    }

                    return res.status(200).send({
                        status: 'success',
                        usuario
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

    update: async (req, res) => {
        // Recoger el id del usuario por la URL
        var usuarioId = req.params.id;
    
        // Recoger los datos del body
        var params = req.body;
    
        // Validar el id del usuario
        var usuarioIdValid = mongoose.Types.ObjectId.isValid(usuarioId);
    
        // Validar los datos
        try {
            var validate_nombre = !validator.isEmpty(params.nombre);
            var validate_usuario = !validator.isEmpty(params.username);
            var validate_email = !validator.isEmpty(params.email);
            var validate_ci = !validator.isEmpty(params.ci);
            var validate_contrasena = !validator.isEmpty(params.contrasena);
            var validate_rol = !validator.isEmpty(params.rol);
        } catch (err) {
            return res.status(400).send({
                status: 'error',
                message: 'Faltan datos por enviar'
            });
        }
    
        if (
            usuarioId.match(/^[0-9a-fA-F]{24}$/) &&
            validate_nombre &&
            validate_usuario &&
            validate_email &&
            validate_ci &&
            validate_rol &&
            validate_contrasena
        ) {
            // Buscar el usuario actual en la base de datos
            usuario.findById(usuarioId)
                .then(usuarioActual => {
                    if (!usuarioActual) {
                        return res.status(404).send({
                            status: 'error',
                            message: 'No existe el usuario'
                        });
                    }
    
                    // Verificar si la contraseña ha sido modificada
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
                            usuario
                                .findOneAndUpdate({ _id: usuarioId }, params, { new: true })
                                .then(usuarioUpdated => {
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
                                })
                                .catch(error => {
                                    return res.status(500).send({
                                        status: 'error',
                                        message: 'Datos duplicadas con otro usuario. Los datos (CI, USUARIO, EMAIL, N° Celular) deben ser únicos.'
                                    });
                                });
                        });
                    } else {
                        // Actualizar el usuario en la base de datos sin modificar la contraseña
                        usuario
                            .findOneAndUpdate({ _id: usuarioId }, params, { new: true })
                            .then(usuarioUpdated => {
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
                            })
                            .catch(error => {
                                return res.status(500).send({
                                    status: 'error',
                                    message: 'Datos duplicadas con otro usuario. Los datos (CI, Usuario, Email, N° Celular) deben ser únicos.'
                                });
                            });
                    }
                })
                .catch(error => {
                    return res.status(500).send({
                        status: 'error',
                        message: 'Error al buscar el usuario en la base de datos'
                    });
                });
        } else {
            return res.status(400).send({
                status: 'error',
                message: 'La validación no es correcta'
            });
        }
    },

    delete: (req, res) => {

        var usuarioId = req.params.id;


        usuario.findByIdAndDelete({ _id: usuarioId }).then((usuarioRemoved) => {

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

    search: (req, res) => {

        //sacar strin a buscar

        var searchString = req.params.search1;
        //find and 

        usuario.find({
            "$or": [
                {
                    "nombre": { "$regex": searchString, "$options": "i" }
                }
                ,
                {
                    "username": { "$regex": searchString, "$options": "i" }
                },
                {
                    "ci": { "$regex": searchString, "$options": "i" }
                },
                {
                    "email": { "$regex": searchString, "$options": "i" }
                },
                {
                    "ROL": { "$regex": searchString, "$options": "i" }
                }
            ]
        })
            .sort([['date', 'descending']])
            .then((usuarios) => {
                if (!usuarios || usuarios.length <= 0) {
                    return res.status(404).send({
                        status: 'error',
                        message: 'No hay usuarios para mostrar'
                    });
                }

                return res.status(200).send({
                    status: 'success',
                    usuarios
                });
            })

    },






}; //end controller


module.exports = controller;