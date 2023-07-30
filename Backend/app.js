'use strict'

//cargar modulos de node para crear servidor
var express = require('express');
var bodyParser = require('body-parser');
var http = require('http'); // Añadimos el módulo http
const cors = require('cors');


//Ejecutar express (http)

var app = express();

var server = http.createServer(app);


//Middlewares

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// CORS


app.use(cors());

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
  next();
});

// cargar ficheros rutas
var web_routes = require('./routes/routes');


// Añadir prefijos a rutas / cargar rutas

app.use('/api', web_routes);


// Configurar Socket.IO
const socketIO = require('socket.io');
const io = socketIO(server); // Adjuntamos Socket.IO al servidor http
// Escuchar conexiones de clientes
var usuariosConectados = []
io.on('connection', (socket) => {
  console.log('Nuevo cliente conectado:', socket.id);
  // Manejar evento cuando el cliente crea un horario
  socket.on('crearHorario', () => {
    console.log('Usuario', socket.id, 'está creando un horario:');
    usuariosConectados.push(socket.id)
    console.log(usuariosConectados)

    // Enviamos los datos actualizados de usuariosConectados a todos los clientes
    io.emit('usuariosConectados', usuariosConectados);

  });

  // Manejar evento cuando el cliente se desconecta
  socket.on('disconnect', () => {
    console.log('Cliente desconectado:', socket.id);
    usuariosConectados = usuariosConectados.filter((elemento) => elemento !== socket.id);

  });
});

// Exportar modulo (fichero actual)
module.exports = { app, server };
