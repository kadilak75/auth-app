const { response } = require('express');
const { validationResult } = require('express-validator');
const Usuario = require('../models/Usuario');
const bcrypt = require('bcryptjs');
const { generarJWT } = require('../helpers/jwt');



//funcion crear usuario
const crearUsuario = async (req,resp = response) =>{


    //en el req viene toda la informacion que se esta enviando en el body de la peticion
    //esta la podemos desestructurar para poder utilizar sus componentes mas facilmente
    const {email, name, password} = req.body
    
    try {
        //verificar el email
        //busca un usuario en la BD cuyo email sea igual al email que recibimos en la peticion
        const usuario = await Usuario.findOne({ email })
        
        //si el usuario ya existe en la base de datos va a regresar un error 400 y un objeto json
        if(usuario){
            return resp.status(400).json({
                ok: false,
                msg: 'El usuario ya existe'
                
            });
            
        }

        //Crear un usuario con el Modelo
        const dbUser = new Usuario(req.body);

        //Hashear la contraseña

        //metodo para encriptar contraseñas de bcrypt
        const salt = bcrypt.genSaltSync();
        //se cambia la contraseña del usuario que vamos a guardar en la BD
        //por una encriptada utilizando el metodo anterior
        dbUser.password = bcrypt.hashSync( password,salt );
        

        //Generar JasonWebToken JWT
        const token = await generarJWT( dbUser.id, name, email)
    
        //Guardar el usuario en la BD
        await dbUser.save();

        //Generar respuesta exitosa
        return resp.status(201).json({
            ok: true,
            //lo crea automaticamente el mongoDB
            uid: dbUser.id,
            name: name,
            token: token,
            

        });

    } 
    catch (error) {
        console.log(error)
        return resp.status(500).json({
            ok: false,
            msg: 'Error en el Servicio'
        });
    }


 
};



//funcion login
const loginUsuario = async (req,resp = response) =>{


    const {email, password} = req.body

    try {
        //verificar el email
        //busca un usuario en la BD cuyo email sea igual al email que recibimos en la peticion
        const dbUser = await Usuario.findOne({email});

        //si no se encontro el email del usuario este no existe en la BD
        if( !dbUser ){
            return resp.status(400).json({
                ok: false,
                msg: 'El correo no existe'
            })
        }

        //Confirmar si el password hace match
        //bcrypt tiene una funcion para saber si la contraseña sin encriptar que estamos recibiendo en la peticion 
        //corresponde a la contraseña que tenemos ya encriptada que tenemos en la BD
        const validPassword = bcrypt.compareSync( password, dbUser.password)

        //si el password no corresponde mandamos un error
        if( !validPassword ){
            return resp.status(400).json({
                ok: false,
                msg: 'Contraseña invalida'
            })
        }

        //Generar el JWT
        //si el usuario y la contraseña son correctos genera un JWT utilizando los datos que estan guardados en la BD
        //la funcion para generar un JWT se encuentra en helpers/jwt.js
        const token = await generarJWT(dbUser.id, dbUser.name, dbUser.email)

        //respuesta del servicio generar JWT
        return resp.json({
            ok: true,
            uid: dbUser.id,
            name: dbUser.name,
            email: dbUser.email,
            token: token
        })
        
    }catch (error) {
        consoñe.log(error);
        return resp.status(500).json({
        ok: false,
        msg: 'Hable con el administrador'
        })
    }


}

//funcion renew Token
const renewToken = async (req,resp = response) =>{

    //informacion pasada desde el middleware
   const {uid, name, email} = req
   

   const token = await generarJWT(uid, name, email)
   

   
    return resp.json({
        ok: true,
        uid: uid,
        name: name,
        email: email,
        token: token
        
    })
   
}




//exportar las funciones
module.exports = {
    crearUsuario,
    loginUsuario,
    renewToken
}