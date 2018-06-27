const path = require('path');
const express = require('express');
const http = require('http');
const app = express();
const generateMessage = require('./utils/message').generateMessages;
const isRealString = require('./utils/validation');
const Users = require('./utils/users');
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
const users = new Users();

//La siguiente funcion es un event listener, permite registrar eventos que seran emitidos si se cumple
//el evento
//El evento a registrar es connection, que se emite cada vez que se genera una conexion desde el frontend
io.on('connection', (socket) => {
    console.log('New user connected');

    socket.on('join', function(params, callback) {

        if(!isRealString(params.name) || !isRealString(params.room)) {
            callback('Name and room are required.');
        } else {

            //Esta funcion setea el socket en una room, la cual para que las conexiones entren
            //deben señalar que quieren entrar a esta room por medio del nombre 
            socket.join(params.room);

            //Se elimina el usuario si esta en otra room
            users.removeUser(socket.id);
            //Aca se agrega un nuevo usuario al arreglo
            users.addUser(socket.id, params.name, params.room);

            //Aca se actualiza la lista de usuarios para todos los sockets de cierta room
            io.to(params.room).emit('updateUserList', users.getUserList(params.room));
            //Aca se envia el mensaje de bienvenida
            socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat!'));

            // Aca se le envia el broadcast a la room especifica, y se le da el emit
            socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin', 'A '+ params.name +' has connected!') );
            callback();
        }
    });

    socket.emit('welcome', { msg: 'Welcome to the chat'});

    socket.broadcast.emit('welcome', { msg: 'A new user has connected'} );

    

    //Listener que se eecutara cuando el cliente envie el emit
    socket.on('createMessage', function(message, callback) {
        

        //Se busca el uusario con el id del socket
        var user = users.getUser(socket.id);

        if(user && isRealString(message.text)) {

        //De esta forma se envia el mensaje como broadcast, le envia el mensaje a todos los sockets
        //Descomentar para probar
        //El .to se especifcia a q room se enviara el mensage
            io.to(user.room).emit('newMessage', generateMessage(user.name, message.text));
        }

        

        


        //De esta forma se envia el broadcast solo a este socket creado
        //El broadcast es enviado a todos los sockets menos al socket que emitio el mensaje o activo el evento
        //Descomentar para probar
        //socket.broadcast.emit('newMessage', generateMessage(message.from, message.text))
        callback('Ack from server')
    });

    //Aca se crea el event emit, que ejecutara el listener creado en el lado del cliente
    //Emit acepta un segundo parametro, el cual puede ser un objeto de cualquir tipo
    //Lo ideal es pasar un objeto json, asi se pueden especificar varias cosas
    //El segundo argunmento sera recibido en el callback del cliente
    
    socket.emit('newEmal', {
        from: 'juan@gmail.com',
        text: 'chupalo',
        createdAt: 123
    });

    //Se crea un listener personalizado que sera emitido por el cliente
    //Para darle una especie de acknowledgement al evento, se puede crear un callback
    socket.on('createEmail', function(newEmail, callback) {
        console.log('New Email:', newEmail);
        callback('Send from server!');
    })

    //Aca se crean los eventos correspondientes al socket creado
    //Evento de desconexion con el cliente
    socket.on('disconnect', () => {
        var user = users.removeUser(socket.id);

        if(user) {
            io.to(user.room).emit('updateUserList', users.getUserList(user.room));
            io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has left the room`));
        }
    });

    
});


const port = process.env.PORT || 3000;

server.listen(port, () => {
    console.log('Server running http://localhost:3000/ \n');

});