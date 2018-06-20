const path = require('path');
const express = require('express');
const http = require('http');
const app = express();
//Este modulo permite hacer comunicacion con WebSocket
const socketIO = require('socket.io');
//Esta funcion permite generar un path integro, sin los "../", sino que muestra el resultado final
//del path
const publicPath = path.join(__dirname, '../public');

//Si no se expresa la ruta, quedara por defecto '/'
app.use(express.static(publicPath));

//Se crea el servidor http con el listener de express
var server = http.createServer(app);

//Aca se crea el WebSocket Server, con el cual se va a manipular todo
//Hara la comunicacion entre el cliente y el server (backend y frontend)
const io = socketIO(server);

//La siguiente funcion es un event listener, permite registrar eventos que seran emitidos si se cumple
//el evento
//El evento a registrar es connection, que se emite cada vez que se genera una conexion desde el frontend
io.on('connection', (socket) => {
    console.log('New user connected');

    //Aca se crean los eventos correspondientes al socket creado
    //Evento de desconexion con el cliente
    socket.on('disconnect', () => {
        console.log('User was disconnected');
    });
});


const port = process.env.PORT || 3000;

server.listen(port, () => {
    console.log('Server running http://localhost:3000/ \n');

});