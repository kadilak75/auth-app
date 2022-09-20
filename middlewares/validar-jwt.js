const { response } = require("express");
const jwt = require('jsonwebtoken')

const validarJWT = (req,resp = response, next) =>{

    const token = req.header('x-token');

    if(!token) {
        return resp.status(401).json({
            ok: false,
            msk: 'error en el token'
        })
    }

    try {
        //payload que contiene el uid el name y el email
        const { uid, name, email } = jwt.verify( token, process.env.SECRET_JWT_SEED );
          
        //enviar informacion del middleware al controlador
        //ya que en el controlador vamos a mandar a llamar esta funcion el controlador tendrá acceso
        //a los arg req y resp por lo que podemos asignarle valores al req de la siguiente forma
        req.uid = uid;
        req.name = name;
        req.email = email;
        console.log(uid,name,email)
        
    } catch (error) {
        return resp.status(401).json({
            ok: false,
            msg: 'token no valido'
        })
    }



    // TODO OK
    next()
}

module.exports = {
    validarJWT
}