const path = require('path');
const express = require('express');
const app = express();
//Esta funcion permite generar un path integro, sin los "../", sino que muestra el resultado final
//del path
const publicPath = path.join(__dirname, '../public');

//Si no se expresa la ruta, quedara por defecto '/'
app.use(express.static(publicPath));


const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log('Server running http://localhost:3000/ \n');

});