const { validationResult } = require("express-validator")
const {response} = require ("express")

const validarCampos = (req,resp = response, next) =>{
         //objeto errors que va a ser el resultado de las validaciones que colocamos en el apartao routes
        const errors = validationResult(req)


        //en caso de que ocurra un error en el request el objeto errors va a tener un detalle de la validacion
        //que no se cumplio, por lo cual nosotros podemos utilizarlo para regresar una peticion con el error
        //400 que indica una peticion errones un ok: false y un detalle de los errores con errors.map

        if (!errors.isEmpty() ){
            return resp.status(400).json({
                ok: false,
                errors: errors.mapped()
            });
        }

        //si no hay errores pasamos a la siguiente parte del codigo que es la respuesta sin erores
        //que se encuentra en el authControlles
        next()

}


module.exports = {
    validarCampos
}