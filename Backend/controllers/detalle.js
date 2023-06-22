'use strict'

var validator = require('validator');
var detalle = require('../models/detalle');
const { default: mongoose } = require('mongoose');

var controller = {

    save: (req, res) => {
        // Recoger parametros por post
        var params = req.body;
        /* 
                && params.horasDiurnas.length !== 0 && params.horasNocturnas.length !== 0
                && params.diasDiurnas.length !== 0 && params.diasNocturnas.length !== 0 */

        if (
            params.carreras.length !== 0 && params.semestres.length !== 0
            && params.ciclos.length !== 0 && params.horasDiurnas.length !== 0 && params.horasNocturnas.length !== 0

        ) {


            //Crear el objeto a guardar
            var detalle1 = new detalle();


            //asignar valores
            detalle1.carreras = params.carreras;
            detalle1.semestres = params.semestres;
            detalle1.ciclos = params.ciclos;
            detalle1.horasDiurnas = params.horasDiurnas;
            detalle1.horasNocturnas = params.horasNocturnas;


            //guardar el articulo
            detalle1.save().then((detalleStored) => {

                if (!detalleStored) {
                    return res.status(404).send({
                        status: 'error',
                        message: 'El detalle no se ha guardado.'
                    });
                }

                // devolder respuesta
                return res.status(200).send({
                    status: 'success',
                    detalle: detalleStored
                });

            });



        } else {
            return res.status(200).send({
                status: 'error',
                message: 'Los datos no son validos'
            });
        }
    },

    getDetalles: (req, res) => {

        var query = detalle.find({});

        var last = req.params.last;

        if (last || last != undefined) {
            query.limit(5);
        }

        //find 
        query.sort('-_id').then((detalles) => {

            if (!detalles) {
                return res.status(404).send({
                    status: 'error',
                    message: 'No hay detalle para mostrar'
                });
            }

            return res.status(200).send({
                status: 'success',
                detalles
            });

        });

    },

    getDetalle: (req, res) => {

        //recoger el id de la url

        var detalleId = req.params.id
        var DetalleIdValid = mongoose.Types.ObjectId.isValid(detalleId);
        //comprobar que existe
        if (DetalleIdValid) {


            if (!detalleId || detalle == null) {
                return res.status(404).send({
                    status: 'error',
                    message: 'No existe el detalle'
                });
            } else {
                detalle.findById(detalleId).then((detalle) => {

                    if (!detalle) {
                        return res.status(404).send({
                            status: 'error',
                            message: 'No existe el detalle'
                        });
                    }

                    return res.status(200).send({
                        status: 'success',
                        detalle
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

    update: (req, res) => {
        //recoger el id del articulo por la url
        var detalleId = req.params.id

        //recoger datos del put

        var params = req.body;

        var DetalleIdValid = mongoose.Types.ObjectId.isValid(detalleId);
        // Validar datos (validator)

        /*  
         && params.diasDiurnas.length !== 0 && params.diasNocturnas.length !== 0
          */
        if (
            params.carreras.length !== 0 && params.semestres.length !== 0
            && params.ciclos.length !== 0 && params.horasDiurnas.length !== 0 && params.horasNocturnas.length !== 0

        ) {
            detalle.findOneAndUpdate({ _id: detalleId }, params, { new: true }).then((detalleUpdated) => {

                if (!detalleUpdated) {
                    return res.status(404).send({
                        status: 'error',
                        message: 'No existe el detalle'
                    });
                }

                return res.status(200).send({
                    status: 'success',
                    detalle: detalleUpdated
                });

            });
        } else {
            return res.status(200).send({
                status: 'error',
                message: 'La validacion no es correcta'
            });
        }

    },

    delete: (req, res) => {

        var detalleId = req.params.id;


        detalle.findByIdAndDelete({ _id: detalleId }).then((detalleRemoved) => {

            if (!detalleRemoved) {
                return res.status(404).send({
                    status: 'error',
                    message: 'Detalle no existe'
                });
            }

            return res.status(200).send({
                status: 'success',
                detalle: detalleRemoved
            });
        });
    },




}; //end controller


module.exports = controller;