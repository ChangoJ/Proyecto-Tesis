'use strict'

var mongoose = require('mongoose');
var {app, server} = require('./app')
var port = 3900;
const cors = require('cors');




mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/sistema_creacion_horarios', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("Conexion a BD Exitosa!");
        // Configurar CORS
        app.use(cors());
        // Crear servidor y recibir peticiones HTTP
        server.listen(port, () => {
            console.log("Servidor Exitoso http://localhost:" + port);
        });
    });

