//Aca se genera el request con el server, y mantiene la conexion actic
//Si el server se cae, sigue reintentando hasta que se vuelve a conectar
var socket = io();

//La siguiente funcion es un evento tipo connect, el cual se emite cuando el socket
//se comunica con el server
socket.on('connect', function() {
    console.log('Socket is connected with server');
})

socket.on('newMessage', function(message) {

    //Se genera una fecha formateada con moment
    var formatedTime = moment(message.createdAt).format("h:mm a");
    //Se obtiene el html del bloque que contiene el template a usar
    var template = jQuery('#message-template').html();
    //Se genera el template pasando por argumentos los valores a usar
    var html = Mustache.render(template, {
        text: message.text,
        from: message.from,
        createdAt: formatedTime
    })
    //Se agrega el template o el html al ol q se llama messages
    jQuery('#messages').append(html);

    /** Esta forma es usando solo jQuery, sin mustache 
     * 
    var formatedTime = moment(message.createdAt).format("h:mm a");
    var li = jQuery('<li></li>');
    li.text(`- ${message.from} ${formatedTime}: ${message.text}`);
    jQuery('#messages').append(li);
    console.log(message);

    */    
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
 */
socket.emit('createEmail', {
    from: 'perra@asd.cl',
    text: 'mascalo'
}, function(res){
    console.log('mail ok', res);
});

/** Sobreescribir la funcionalidad del boton */
jQuery('#message-form').on('submit', function(e) {
    e.preventDefault();

    var textBoxMesage = jQuery('[name=message]');
    socket.emit('createMessage', {
        from: 'User',
        text: textBoxMesage.val()
    }, function(msg){
        textBoxMesage.val('');
    })
});
