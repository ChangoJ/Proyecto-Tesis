'use strict'

//cargar modulos de node para crear servidor
var express = require('express');
var bodyParser = require('body-parser');
var http = require('http'); // Añadimos el módulo http


//Ejecutar express (http)
var app = express();
var server = http.createServer(app);

// cargar ficheros rutas
var web_routes = require('./routes/routes');

//Middlewares

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// CORS
app.use((req, res, next) => {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
	res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
	res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
	next();
});

// Añadir prefijos a rutas / cargar rutas

app.use('/api', web_routes);


// Configurar Socket.IO
const socketIO = require('socket.io');
const io = socketIO(server); // Adjuntamos Socket.IO al servidor http

// Escuchar conexiones de clientes
io.on('connection', (socket) => {
  console.log('Nuevo cliente conectado:', socket.id);

  // Manejar evento cuando el cliente crea un horario
  socket.on('crearHorario', (data) => {
    console.log('Usuario', socket.id, 'está creando un horario:', data);
    // Aquí puedes realizar acciones adicionales, como guardar el horario en una base de datos, etc.
    // Luego, si es necesario, puedes notificar a otros usuarios conectados sobre el evento.
  });

  // Manejar evento cuando el cliente se desconecta
  socket.on('disconnect', () => {
    console.log('Cliente desconectado:', socket.id);
  });
});

// Exportar modulo (fichero actual)
module.exports = { app, server };
