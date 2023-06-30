'use strict';

var mongoose = require('mongoose');

var app = require('./app');

var port = 3900;

var cors = require('cors');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/sistema_creacion_horarios', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(function () {
  console.log("Conexion a BD Exitosa!"); // Configurar CORS

  app.use(cors()); // Crear servidor y recibir peticiones HTTP

  app.listen(port, function () {
    console.log("Servidor Exitoso http://localhost:" + port);
  });
});