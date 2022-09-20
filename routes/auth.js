// importar el modulo express y de este modulo necesitamos el Router
const { Router } = require('express');
const { check } = require('express-validator');
const { crearUsuario, loginUsuario, renewToken } = require('../controllers/auth.controlles');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');



//define el objeto que va a contener las rutas
const router = Router();


//peticion al path new para crear un nuevo usuario
router.post( '/new',[
    check('name', 'se requiere un nombre de usuario').not().isEmpty(),
    check('email', 'El email es obligatorio').isEmail(),
    check('password', 'la contraseña es obligatoria').isLength({min: 6}),
    validarCampos
], crearUsuario)


//peticion al path / para hacer login
//path,midelwares validadores de campos, callback de la funcion que contiene
// la logica de la peticion
router.post( '/', [
    //estas son validaciones que trae el paquete express-validator, a la hora de hacer
    //una peticion en caso de que estas no se cumplan enviarán un objeto que contiene,
    //detalles con los errores, este se puee utilizar para manejarlos en el apartado
    //controller 
    check('email', 'El email es obligatorio').isEmail(),
    check('password', 'la contraseña es obligatoria').isLength({min: 6}),
    //esta validacion se encuentra en la carpeta middlewares y se encarga de utilizar el objeto errors
    //que se crea en caso de que las validaciones anteriores no se cumplan para enviar una respuesta con el error
    //y en caso de que todo sea correcto va a pasar a la funcion loginUsuario
    validarCampos

], loginUsuario)

//validar y revalidar token
router.get( '/renew',validarJWT, renewToken )





//exportar las rutas
module.exports = router;