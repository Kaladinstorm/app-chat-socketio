//Aca se genera el request con el server, y mantiene la conexion actic
//Si el server se cae, sigue reintentando hasta que se vuelve a conectar
var socket = io();

//La siguiente funcion es un evento tipo connect, el cual se emite cuando el socket
//se comunica con el server
socket.on('connect', function() {
    console.log('Socket is connected with server');
})

socket.on('newMessage', function(message) {
    console.log(message);
});

//El siguiente evento se emite cuando se desconecta con el server
socket.on('disconnect', function() {
    console.log('Disconnect from server');
});

socket.on('welcome', function(msg){
    console.log(msg);
});

//Aca se creara un evento personalizado, el cual se registrara el listener
//Sera ejecutado cuando en el server se genere el emit event

socket.on('newEmal', function(email){
    console.log('New Email');
    console.log(email);
});


/**
//Se generara un emit event, elcual ejecutara el listener personalizado que esta en el server
socket.emit('createEmail', {
    from: 'perra@asd.cl',
    text: 'mascalo'
});
 */