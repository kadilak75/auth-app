//express para poder hacer comprobaciones de las peticiones que recibimos
const express = require('express');
//import pemite recibir peticiones de otros servidores
const cors = require('cors');
//import rutas de el archivo index
const path = require('path')
const { dbConnection } = require('./db/config');

//permite definir variables de entorno que se encuentran en el archivo .env
//process.env.POR
require ('dotenv').config();



//crear el servidor/aplicacion de express
const app = express();


//CORS: permite a la app recibir peticiones de otros servidores,
//en el caso de que solo se quiera permitir de un servidor en especifico se coloca aqui
app.use( cors() );


// Conexion a la BD definida en db/config
dbConnection()


//Directorio Publico: cuando se abra nuestra pagina va a cargar lo que se encuentra
//en la carpeta public
app.use( express.static('public'))



// Lectura y parseo del body
app.use( express.json() );

//Rutas: Cuando se haga la peticion al API con la ruta /api/auth cargamos
//las rutas que tenemos en ./routes/auth
app.use('/api/auth', require('./routes/auth') );

//manejo de las demas rutas que se van a trabajar desde angular
//esto permite redireccionar a el archivo index html donde estan las rutas de angular
app.get('*', ( req, res) => {
    res.sendFile( path.resolve(__dirname, 'public/index.html'))
})

//conectamos al servidor y escuchamos los cambios en el servior que va a estar en el puerto 4000
app.listen(process.env.PORT , ()=>{
    console.log(`Servidor corriendo en puerto ${ process.env.PORT }`)
});